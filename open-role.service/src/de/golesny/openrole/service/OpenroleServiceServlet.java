package de.golesny.openrole.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.EmbeddedEntity;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

@SuppressWarnings("serial")
public class OpenroleServiceServlet extends HttpServlet {
	private static final String USER_PROP_USER = "user";
	private static final String USER_PROP_PWHASH = "pwhash";
	private static final String USER_PROP_RANDOMSHA1 = "randomsha1";
	private static final String HEADER_TOKEN = "X-Openrole-Token";
	private static final Charset DEFAULTCHARSET = Charset.forName("UTF-8");
	private static String CONFIG = "config";
	private static String SLASH_CONFIG = "/"+CONFIG;
	private static String SLASH_LOGIN = "/login";
	private static String SLASH_LOGOUT = "/logout";
	private static String SLASH_REGISTER = "/register";
	private static Map<String,String> SYSTEMS = new HashMap<String,String>();
	static {
		SYSTEMS.put("dungeonslayers","Dungeonslayers");
		SYSTEMS.put("malmsturm", "Malmsturm");
	}
	
	private String configAsJson;
	
	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		super.doOptions(req, resp);
		addAccessControlHeader(resp);
		resp.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Openrole-Token");
	}

	private void addAccessControlHeader(HttpServletResponse resp) {
		resp.addHeader("Access-Control-Allow-Origin", "*");
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		try {
			addAccessControlHeader(resp);
			resp.setContentType("application/json");
			if (SLASH_CONFIG.equals(req.getPathInfo())) {
				// global configuration requested without system
				initConfig();
				resp.getWriter().println(configAsJson);
				return;
			}
			Entity user = getUser(req.getHeader(HEADER_TOKEN)); 
			checkUserToken(user);
			
			if (SLASH_LOGOUT.equals(req.getPathInfo())) {
				doLogout(user);
				resp.setStatus(200);
				return;
			}
			
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS.keySet());
			if (ServiceActions.get.equals(requestInfo.action)) {
				resp.getWriter().println("{\"malmsturm\":\""+req.getPathInfo()+"\"}");
			}
		} catch (OpenRoleException e) {
			resp.setStatus(e.responseCode);
			resp.setContentType("plain/text");
			resp.getWriter().append(e.getMessage());
		}
	}

	
	
	private void doLogout(Entity user) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		user.setProperty(USER_PROP_RANDOMSHA1, null);
		datastore.put(user);
		System.out.println("user "+user.getKey().getName()+" logged out");
	}

	@Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		try {
			addAccessControlHeader(resp);
			if (SLASH_LOGIN.equals(req.getPathInfo())) {
				String email = req.getParameter("email");
				String pw = getPost(req.getReader());
				String hash = doLogin(email, pw);
				resp.setStatus(200); // ok
				resp.setContentType("text/plain");
				resp.getWriter().write(hash);
				System.out.println(new Date()+" User logged in: "+email+ " pwHash="+hash);
				return;
			} else if (SLASH_REGISTER.equals(req.getPathInfo())) {
				String hash = doRegister(req.getParameter("email"), getPost(req.getReader()));
				resp.setContentType("text/plain");
				resp.setStatus(201); // created
				resp.getWriter().write(hash);
				return;
			}
			resp.setContentType("application/json");
			Entity user = getUser(req.getHeader(HEADER_TOKEN)); 
			checkUserToken(user);

			System.out.println("getPathInfo="+req.getPathInfo());
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS.keySet());


			if (ServiceActions.store.equals(requestInfo.action)) {
				String post = getPost(req.getReader());
				DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
				
				Entity entity = findOrCreateEntityForUpdate(user, requestInfo.system, requestInfo.docId);

				JSONObject jsonObject = new JSONObject(post);
				for (String k : JSONObject.getNames(jsonObject)) {
					if (! "docId".equals(k) ) {
						Object valObj = jsonObject.get(k);
						Object value = jsonToObject(valObj);
						entity.setUnindexedProperty(k, value);
					}
				}
				Key newKey = datastore.put(entity);
				System.out.println("stored with key = "+newKey);
				
				resp.setContentType("plain/text");
				resp.getWriter().write(""+newKey.getId());
				resp.setStatus(201);
			} else {
				throw new OpenRoleException("Service action '"+requestInfo.action+"' not valid", 403);
			}
		} catch (OpenRoleException e) {
			resp.setStatus(e.responseCode);
			resp.setContentType("plain/text");
			resp.getWriter().append(e.getMessage());
		}
    }

	private Entity findOrCreateEntityForUpdate(Entity user, String system, String docId) {
		if (docId != null) {
			long docIdL = Long.valueOf(docId);
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Key key = KeyFactory.createKey(user.getKey(), system, docIdL);
			try {
				return datastore.get(key);
			} catch (EntityNotFoundException e) {
				System.err.println("["+system+"] Illegal identifier '"+docId+"' from user "+user.getKey());
				throw new OpenRoleException("Invalid identifer", 403);
			}
		}
		// new 
		return new Entity(system, user.getKey());
	}

	private void checkUserToken(Entity user) {
		if (user == null) {
			throw new OpenRoleException("Not logged in", 403);
		}
	}

	private String doLogin(String email, String pw) {
		String lowercaseEmailSHA1 = getSHA1(email.toLowerCase());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey(USER_PROP_USER, lowercaseEmailSHA1);
		try {
			Entity user = datastore.get(key);
			String pwHash = getSHA1(pw);
			if (pwHash.equals(user.getProperty(USER_PROP_PWHASH))) {
				String randomSHA1 = (String) user.getProperty(USER_PROP_RANDOMSHA1);
				if (randomSHA1 == null) {
					randomSHA1 = getSHA1(email + "-" + System.currentTimeMillis());
					user.setProperty(USER_PROP_RANDOMSHA1, randomSHA1);
					datastore.put(user);
				}
				return randomSHA1;
			} else {
				throw new OpenRoleException("USER_PW_WRONG", 403);
			}
		} catch (EntityNotFoundException e) {
			throw new OpenRoleException("USER_PW_WRONG", 403);
		}
	}

	private String doRegister(String email, String pw) {
		String lowercaseEmailSHA1 = getSHA1(email.toLowerCase());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey(USER_PROP_USER, lowercaseEmailSHA1);
		try {
			datastore.get(key);
			throw new OpenRoleException("USER_ALREADY_EXISTS", 409);
		} catch (EntityNotFoundException e) {
			// we can proceed
			Entity newUser = new Entity(key);
			String pwHash = getSHA1(pw);
			newUser.setProperty(USER_PROP_PWHASH, pwHash);
			String randomsha1 = getSHA1(email + "-" + System.currentTimeMillis());
			newUser.setProperty(USER_PROP_RANDOMSHA1, randomsha1);
			datastore.put(newUser);
			return randomsha1;
		}
	}
	
	private String getSHA1(String plain) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			return byteArrayToHexString(md.digest(plain.getBytes(DEFAULTCHARSET)));
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			throw new OpenRoleException("Could not create an hash for password", 500);
		}
	}
	
	public static String byteArrayToHexString(byte[] b) {
		  String result = "";
		  for (int i=0; i < b.length; i++) {
		    result += Integer.toString( ( b[i] & 0xff ) + 0x100, 16).substring( 1 );
		  }
		  return result;
		}

	private Entity getUser(String token) {
		// Get the Datastore Service
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		Filter randomSha1Filter = new FilterPredicate(USER_PROP_RANDOMSHA1, FilterOperator.EQUAL, token);

		// Use class Query to assemble a query
		Query q = new Query("user").setFilter(randomSha1Filter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);

		Entity result = pq.asSingleEntity();
		return result;
	}

	private void initConfig() {
		if (configAsJson == null) {
			configAsJson = JsonUtils.getConfigAsString(SYSTEMS);
		}
	}
	
	private String getPost(BufferedReader reader) throws IOException {
		StringBuffer jb = new StringBuffer();
    	String line = null;
    	while ((line = reader.readLine()) != null)
    	{
    		jb.append(line);
    	}
    	return jb.toString();
	}
	
	private Object jsonToObject(Object jsonObj) {
		Object value = null;
		if (jsonObj instanceof Long || jsonObj instanceof String) {
			value = jsonObj;
		} else if (jsonObj instanceof JSONArray) {
			EmbeddedEntity lstForStore = new EmbeddedEntity();
			JSONArray arr = (JSONArray)jsonObj;
			for (int i=0; i<arr.length(); i++) {
				Object obj = arr.get(i);
				lstForStore.setUnindexedProperty("idx_"+i, jsonToObject(obj));
			}
			value = lstForStore;
		} else if (jsonObj instanceof JSONObject) {
			EmbeddedEntity mapToStore = new EmbeddedEntity();
			for (String k : JSONObject.getNames((JSONObject)jsonObj)) {
				mapToStore.setUnindexedProperty(k, jsonToObject(((JSONObject) jsonObj).get(k)));
			}
			value = mapToStore;
		}
		return value;
	}
	
	private JSONObject objectToJson(Object value) {
		JSONObject json = new JSONObject();
		return json;
	}
}

