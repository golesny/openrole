package de.golesny.openrole.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import de.golesny.openrole.service.util.DigestUtils;
import de.golesny.openrole.service.util.JsonUtils;
import de.golesny.openrole.service.util.PathUtils;

@SuppressWarnings("serial")
public class OpenroleServiceServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(OpenroleServiceServlet.class.getName());
	public static final String INTERNAL_SERVER_ERROR = "MSG.INTERNAL_SERVER_ERROR";
	private static final String CONTENTTYPE_JSON_UTF_8 = "application/json; charset=UTF-8";
	private static final String USER_PROP_PWHASH = "pwhash";
	private static final String USER_PROP_RANDOMSHA1 = "randomsha1";
	private static final String HEADER_TOKEN = "X-Openrole-Token";
	private static String SLASH_LOGIN = "/login";
	private static String SLASH_LOGOUT = "/logout";
	private static String SLASH_REGISTER = "/register";
	private static Set<String> SYSTEMS = new HashSet<>();
	static {
		SYSTEMS.add("customconf");
		SYSTEMS.add("dungeonslayers");
		SYSTEMS.add("malmsturm");
		SYSTEMS.add("malmsturmgm");
	}
	
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
			String token = req.getHeader(HEADER_TOKEN);
			Entity user = null;
			if (StringUtils.isEmpty(token)) {
				if (SLASH_LOGOUT.equals(req.getPathInfo())) {
					// already logged out
					resp.setStatus(200);
					return;
				}
			} else {
				user = new DAO().getUser(token); 
			}
			checkUserToken(user);
			
			if (SLASH_LOGOUT.equals(req.getPathInfo())) {
				doLogout(user);
				resp.setStatus(200);
				return;
			}
			
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS);
			switch (requestInfo.action) {
			case get:
				doGet(req, resp, user, requestInfo);
				break;
			case list:
				doList(req, resp, user, requestInfo);
				break;
			case shares:
				doShares(resp, user, requestInfo);
				break;
			default:
				throw new OpenRoleException("Unhandled get action: "+requestInfo.action, "MSG.ILLEGAL_ACTION", 403);
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

	private void doShares(HttpServletResponse resp,
			Entity user, RequestInfo requestInfo) throws IOException {
		List<Entity> characterList = new DAO().findAllSharedCharactersForUser(user, requestInfo.system);
		JSONArray jsonArr = new JSONArray();
		for (Entity entity : characterList) {
			JSONObject jsonCharacter = JsonUtils.convertEntityObjectToJson(entity);
			jsonCharacter.put("docId", ""+entity.getKey().getId());
			jsonArr.put(jsonCharacter);
		}
		resp.setContentType(CONTENTTYPE_JSON_UTF_8);
		resp.getWriter().write(""+jsonArr.toString());
		resp.setStatus(200);
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
				String responseJson = doLogin(email, pw);
				resp.setStatus(200); // ok
				resp.setContentType(CONTENTTYPE_JSON_UTF_8);
				resp.getWriter().write(responseJson);
				log.fine("User logged in: "+email);
				return;
			} else if (SLASH_REGISTER.equals(req.getPathInfo())) {
				String nick = req.getParameter("nick");
				String randomSHA1 = new DAO().doRegister(req.getParameter("email"), PathUtils.getPost(req.getReader()), nick);
				resp.setContentType(CONTENTTYPE_JSON_UTF_8);
				resp.setStatus(201); // created
				resp.getWriter().write(JsonUtils.getLoginResponse(nick, randomSHA1));
				return;
			}
			resp.setContentType("application/json");
			Entity user = new DAO().getUser(req.getHeader(HEADER_TOKEN)); 
			checkUserToken(user);

			log.finer("getPathInfo="+req.getPathInfo());
			RequestInfo requestInfo = PathUtils.extractRequestInfo(req.getPathInfo(), SYSTEMS);


			switch (requestInfo.action) {
			case get:
				throw new OpenRoleException("Invalid action get called", "MSG.SERVICE_ACTION_INVALID", 403);
			case store:
				doStore(req, resp, user, requestInfo);
				break;
			case update:
				break;
			default:
				throw new OpenRoleException("Service action '"+requestInfo.action+"' not valid", "MSG.SERVICE_ACTION_INVALID", 403);
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
		
		DAO dao = new DAO();
		Entity entity = dao.findOrCreateEntityForUpdate(requestInfo.system, requestInfo.docId);

		JSONObject jsonObject = new JSONObject(post);
		List<String> shares = JsonUtils.updateEntity(entity, jsonObject);
		entity.setProperty(DAO.USER_PROP_USER, user.getKey().getName());
		Key newKey = datastore.put(entity);
		log.finer("stored with key = "+newKey);
		dao.updateShares(newKey, requestInfo.system, shares);
		
		resp.setContentType("plain/text");
		resp.getWriter().write(""+newKey.getId());
		resp.setStatus(201);
	}

	private void doGet(HttpServletRequest req, HttpServletResponse resp,
			Entity user, RequestInfo requestInfo) throws IOException {
		DAO dao = new DAO();
		Entity entity = dao.findCharacter(user, requestInfo);
		JSONObject json = JsonUtils.convertEntityObjectToJson(entity);
		json.put("docId", ""+entity.getKey().getId());
		// get Shares
		List<String> nicks = dao.findAllSharesForCharacter(entity.getKey().getId());
		json.put(DAO.SHARES, nicks);
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
			throw new OpenRoleException("User was not logged in", "MSG.NOT_LOGGED_IN", 401);
		}
	}

	/**
	 * @param email
	 * @param pw
	 * @return json with login data
	 */
	public String doLogin(String email, String pw) {
		String lowercaseEmailSHA1 = DigestUtils.getSHA1(email.toLowerCase());
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Key key = KeyFactory.createKey(DAO.USER_PROP_USER, lowercaseEmailSHA1);
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
				return JsonUtils.getLoginResponse(user, randomSHA1);
			} else {
				throw new OpenRoleException("User ID "+user.getProperty(DAO.USER_PROP_USER)+" typed wrong password", "USER_PW_WRONG", 403);
			}
		} catch (EntityNotFoundException e) {
			throw new OpenRoleException("Couldn't find entity User with key "+key, "MSG.USER_PW_WRONG", 403);
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
			log.severe(ExceptionUtils.getStackTrace(e));
		}
	}
}

