package de.golesny.openrole.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import de.golesny.openrole.service.util.DigestUtils;
import de.golesny.openrole.service.util.JsonUtils;
import de.golesny.openrole.service.util.PathUtils;

@SuppressWarnings("serial")
public class OpenroleServiceServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(OpenroleServiceServlet.class.getName());
	public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
	private static final String CONTENTTYPE_JSON_UTF_8 = "application/json; charset=UTF-8";
	private static final String USER_PROP_USER = "user";
	private static final String USER_PROP_PWHASH = "pwhash";
	private static final String USER_PROP_RANDOMSHA1 = "randomsha1";
	private static final String HEADER_TOKEN = "X-Openrole-Token";
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
			switch (requestInfo.action) {
			case get:
				doGet(req, resp, user, requestInfo);
				break;
			case list:
				doList(req, resp, user, requestInfo);
				break;
			default:
				throw new OpenRoleException("Unhandled get action: "+requestInfo.action, "ILLEGAL_ACTION", 403);
			}
		} catch (OpenRoleException e) {
			resp.setStatus(e.responseCode);
			resp.setContentType("plain/text");
			resp.getWriter().append(e.resourceKey);
			log(e);
		} catch (Exception e) {
			resp.setStatus(500);
			resp.setContentType("plain/text");
			resp.getWriter().append(INTERNAL_SERVER_ERROR);
			log(e);
		}
	}

	private void doLogout(Entity user) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		user.setProperty(USER_PROP_RANDOMSHA1, null);
		datastore.put(user);
		log.fine("user "+user.getKey().getName()+" logged out");
	}

	@Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		try {
			addAccessControlHeader(resp);
			if (SLASH_LOGIN.equals(req.getPathInfo())) {
				String email = req.getParameter("email");
				String pw = PathUtils.getPost(req.getReader());
				String hash = doLogin(email, pw);
				resp.setStatus(200); // ok
				resp.setContentType("text/plain");
				resp.getWriter().write(hash);
				log.fine(" User logged in: "+email+ " pwHash="+hash);
				return;
			} else if (SLASH_REGISTER.equals(req.getPathInfo())) {
				String hash = doRegister(req.getParameter("email"), PathUtils.getPost(req.getReader()));
				resp.setContentType("text/plain");
				resp.setStatus(201); // created
				resp.getWriter().write(hash);
				return;
			}
			resp.setContentType("application/json");
			Entity user = getUser(req.getHeader(HEADER_TOKEN)); 
			checkUserToken(user);

			log.finer("getPathInfo="+req.getPathInfo());
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS.keySet());


			switch (requestInfo.action) {
			case get:
				throw new OpenRoleException("Invalid action get called", "SERVICE_ACTION_INVALID", 403);
			case store:
				doStore(req, resp, user, requestInfo);
				break;
			case update:
				break;
			default:
				throw new OpenRoleException("Service action '"+requestInfo.action+"' not valid", "SERVICE_ACTION_INVALID", 403);
			}
		} catch (OpenRoleException e) {
			resp.setStatus(e.responseCode);
			resp.setContentType("plain/text");
			resp.getWriter().append(e.resourceKey);
			log(e);
		} catch (Exception e) {
			resp.setStatus(500);
			resp.setContentType("plain/text");
			resp.getWriter().append(INTERNAL_SERVER_ERROR);
			log(e);
		}
    }

	private void doStore(HttpServletRequest req, HttpServletResponse resp,
			Entity user, RequestInfo requestInfo) throws IOException {
		String post = PathUtils.getPost(req.getReader());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity entity = new DAO().findOrCreateEntityForUpdate(user, requestInfo.system, requestInfo.docId);

		JSONObject jsonObject = new JSONObject(post);
		JsonUtils.updateEntity(entity, jsonObject);
		Key newKey = datastore.put(entity);
		log.finer("stored with key = "+newKey);
		
		resp.setContentType("plain/text");
		resp.getWriter().write(""+newKey.getId());
		resp.setStatus(201);
	}

	private void doGet(HttpServletRequest req, HttpServletResponse resp,
			Entity user, RequestInfo requestInfo) throws IOException {
		Entity entity = new DAO().findCharacter(user, requestInfo);
		JSONObject json = JsonUtils.convertEntityObjectToJson(entity);
		json.put("docId", ""+entity.getKey().getId());
		resp.setContentType(CONTENTTYPE_JSON_UTF_8);
		resp.getWriter().write(""+json.toString());
		resp.setStatus(200);
	}
	
	
	private void doList(HttpServletRequest req, HttpServletResponse resp,
			Entity user, RequestInfo reqInfo) throws IOException {
		List<Map<String, String>> list = new DAO().getCharacterOverview(user, reqInfo);
		JSONArray jsonArr = new JSONArray();
		// return an array of characters
		for (Map<String, String> el : list) {
			JSONObject entry = new JSONObject();
			for (String k : el.keySet()) {
				entry.put(k, el.get(k));
			}
			jsonArr.put(entry);
		}
		resp.setContentType(CONTENTTYPE_JSON_UTF_8);
		String jsonString = jsonArr.toString();
		resp.getWriter().write(""+jsonString);
		resp.setStatus(200);
	}
	
	private void checkUserToken(Entity user) {
		if (user == null) {
			throw new OpenRoleException("User was not logged in", "NOT_LOGGED_IN", 401);
		}
	}

	public String doLogin(String email, String pw) {
		String lowercaseEmailSHA1 = DigestUtils.getSHA1(email.toLowerCase());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey(USER_PROP_USER, lowercaseEmailSHA1);
		try {
			Entity user = datastore.get(key);
			String pwHash = DigestUtils.getSHA1(pw);
			if (pwHash.equals(user.getProperty(USER_PROP_PWHASH))) {
				String randomSHA1 = (String) user.getProperty(USER_PROP_RANDOMSHA1);
				if (randomSHA1 == null) {
					randomSHA1 = DigestUtils.getSHA1(email + "-" + System.currentTimeMillis());
					user.setProperty(USER_PROP_RANDOMSHA1, randomSHA1);
					datastore.put(user);
				}
				return randomSHA1;
			} else {
				throw new OpenRoleException("User ID "+user.getProperty(USER_PROP_USER)+" typed wrong password", "USER_PW_WRONG", 403);
			}
		} catch (EntityNotFoundException e) {
			throw new OpenRoleException("Couldn't find entity User with key "+key, "USER_PW_WRONG", 403);
		}
	}

	public String doRegister(String email, String pw) {
		String lowercaseEmailSHA1 = DigestUtils.getSHA1(email.toLowerCase());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey(USER_PROP_USER, lowercaseEmailSHA1);
		try {
			datastore.get(key);
			throw new OpenRoleException("User "+lowercaseEmailSHA1+" already exists while registration", "USER_ALREADY_EXISTS", 409);
		} catch (EntityNotFoundException e) {
			// we can proceed
			Entity newUser = new Entity(key);
			String pwHash = DigestUtils.getSHA1(pw);
			newUser.setProperty(USER_PROP_PWHASH, pwHash);
			String randomsha1 = DigestUtils.getSHA1(email + "-" + System.currentTimeMillis());
			newUser.setProperty(USER_PROP_RANDOMSHA1, randomsha1);
			datastore.put(newUser);
			return randomsha1;
		}
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
	
	private void log(Exception e) {
		StringBuilder sb = new StringBuilder();
		sb.append(e.getClass().getSimpleName()).append(": ");
		sb.append(e.getMessage());
		if (e instanceof OpenRoleException) {
			OpenRoleException ore = (OpenRoleException)e;
			sb.append(" | ").append(ore.resourceKey).append(":").append(ore.responseCode);
			log.warning(sb.toString());
		} else {
			log.severe(sb.toString());
		}
	}
}

