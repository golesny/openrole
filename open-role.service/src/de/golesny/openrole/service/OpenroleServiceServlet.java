package de.golesny.openrole.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.EmbeddedEntity;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;

@SuppressWarnings("serial")
public class OpenroleServiceServlet extends HttpServlet {
	private static final String COOKIE_AUTH_ID = "auth_id";
	private static String CONFIG = "config";
	private static String SLASH_CONFIG = "/"+CONFIG;
	private static String SLASH_LOGIN = "/login";
	private static String SLASH_LOGOUT = "/logout";
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
		addAccessControlHeader(resp);
		resp.setContentType("application/json");
		if (SLASH_CONFIG.equals(req.getPathInfo())) {
        	// global configuration requested without system
			initConfig();
			resp.getWriter().println(configAsJson);
		} else if (SLASH_LOGOUT.equals(req.getPathInfo())) {
			// TODO remove auth_id from database
			Cookie cookie = new Cookie(COOKIE_AUTH_ID, "");
			cookie.setMaxAge(1);
			resp.addCookie(cookie);
		} else {
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS.keySet());
			if (ServiceActions.get.equals(requestInfo.action)) {
				resp.getWriter().println("{\"malmsturm\":\""+req.getPathInfo()+"\"}");
			}
		}
	}

	
	
	@Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		addAccessControlHeader(resp);
		if (SLASH_LOGIN.equals(req.getPathInfo())) {
			String email = req.getParameter("email");
			String pw = getPost(req.getReader());
			// TODO create new auth_id in database
			Cookie cookie = new Cookie(COOKIE_AUTH_ID, "abcdefghijklm");
			cookie.setSecure(true);
			cookie.setMaxAge(Integer.MAX_VALUE);
			resp.addCookie(cookie);
			resp.setStatus(200);
			resp.setContentType("text/plain");
			resp.getWriter().write("responseABC");
			System.out.println(new Date()+" User logged in: "+email+ " pw="+pw);
			return;
		}
		resp.setContentType("application/json");
		User user = getUser(req.getCookies()); 
		if (user == null) {
			resp.setStatus(401);
		}

        System.out.println("getPathInfo="+req.getPathInfo());
        RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS.keySet());

        
        if (ServiceActions.store.equals(requestInfo.action)) {
        	String post = getPost(req.getReader());
        	//
        	Key key = KeyFactory.createKey(requestInfo.system, user.getUserId());
        	System.out.println("new key = " +key);
        	Entity entity = new Entity(requestInfo.system, key);
        	
        	JSONObject jsonObject = new JSONObject(post);
        	System.out.println("jsonObject="+jsonObject.toString());
        	for (String k : JSONObject.getNames(jsonObject)) {
        		System.out.println("json.names="+k);
        		Object valObj = jsonObject.get(k);
        		System.out.println("       val  ="+valObj);
        		System.out.println("       class="+valObj.getClass().getName());
        		Object value = jsonToObject(valObj);
        		
        		entity.setProperty(k, value);
        	}
        	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
//        	datastore.put(entity);




        	// We have one entity group per Guestbook with all Greetings residing
        	// in the same entity group as the Guestbook to which they belong.
        	// This lets us run a transactional ancestor query to retrieve all
        	// Greetings for a given Guestbook.  However, the write rate to each
        	// Guestbook should be limited to ~1/second.
        	//        String guestbookName = req.getParameter("guestbookName");
        	//        Key guestbookKey = KeyFactory.createKey("Guestbook", guestbookName);
        	//        String content = req.getParameter("content");
        	//        Date date = new Date();
        	//        Entity greeting = new Entity("Greeting", guestbookKey);
        	//        greeting.setProperty("user", user);
        	//        greeting.setProperty("date", date);
        	//        greeting.setProperty("content", content);
        	//
        	//        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        	//        datastore.put(greeting);


        	resp.setStatus(201);
        }
    }

	private User getUser(Cookie[] cookies) {
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (COOKIE_AUTH_ID.equals(cookie.getName())) {
					// TODO find user in database with auth_id
					return new User("test", "golesny.de");
				}
			}
		}
		return null;
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
				lstForStore.setProperty("idx_"+i, jsonToObject(obj));
			}
			value = lstForStore;
		} else if (jsonObj instanceof JSONObject) {
			EmbeddedEntity mapToStore = new EmbeddedEntity();
			for (String k : JSONObject.getNames((JSONObject)jsonObj)) {
				mapToStore.setProperty(k, jsonToObject(((JSONObject) jsonObj).get(k)));
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

