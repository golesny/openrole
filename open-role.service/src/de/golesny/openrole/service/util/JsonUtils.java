package de.golesny.openrole.service.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.appengine.api.datastore.EmbeddedEntity;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Text;

import de.golesny.openrole.service.DAO;
import de.golesny.openrole.service.OpenRoleException;
import de.golesny.openrole.service.OpenroleServiceServlet;

public class JsonUtils {
	private static final Logger log = Logger.getLogger(JsonUtils.class.getName());
	
	public static String getConfigAsString(Map<String,String> systems) {
		JSONObject jsonConfig = new JSONObject();
		for (String id : systems.keySet()) {
			JSONObject entry = new JSONObject();
			entry.put("id", id);
			entry.put("name", systems.get(id));
			jsonConfig.append("systems", entry);
		}
		return jsonConfig.toString();
	}
	
	protected static Object jsonToEntityObject(Object jsonObj) {
		Object value = null;
		if (jsonObj == null || JSONObject.NULL.equals(jsonObj)) {
			// do nothing
		} else if (jsonObj instanceof Long || jsonObj instanceof Integer) {
			value = jsonObj;
		} else if (jsonObj instanceof String) {
			if ( ((String)jsonObj).length() > 500) {
				value = new Text((String)jsonObj);
			} else {
				value = jsonObj;
			}
		} else if (jsonObj instanceof JSONArray) {
			EmbeddedEntity lstForStore = new EmbeddedEntity();
			JSONArray arr = (JSONArray)jsonObj;
			int indexLen = (arr.length() % 10) +1;
			for (int i=0; i<arr.length(); i++) {
				Object obj = arr.get(i);
				lstForStore.setUnindexedProperty("idx_"+StringUtils.leftPad(""+i,indexLen, '0'), jsonToEntityObject(obj));
			}
			value = lstForStore;
		} else if (jsonObj instanceof JSONObject) {
			EmbeddedEntity mapToStore = new EmbeddedEntity();
			String[] keys = JSONObject.getNames((JSONObject)jsonObj);
			if (keys != null) {
				for (String k : keys) {
					mapToStore.setUnindexedProperty(k, jsonToEntityObject(((JSONObject) jsonObj).get(k)));
				}
				value = mapToStore;
			}
		} else {
			throw new OpenRoleException("Unhandled object class: "+jsonObj.getClass(), OpenroleServiceServlet.INTERNAL_SERVER_ERROR, 500);
		}
		return value;
	}
	

	public static JSONObject convertEntityObjectToJson(Entity entity) {
		JSONObject json = new JSONObject();
		for (String k : entity.getProperties().keySet()) {
			json.put(k, entityObjectToJson(entity.getProperties().get(k)));
		}
		return json;
	}
	
	public static Object entityObjectToJson(Object entity) {
		if (entity instanceof Long || entity instanceof String) {
			return entity;
		} else if (entity instanceof Text) {
			return ((Text)entity).getValue();
		} else if (entity instanceof EmbeddedEntity) {
			EmbeddedEntity e = (EmbeddedEntity)entity;
			if (isArray(e)) {
				JSONArray arr = new JSONArray();
				ArrayList<String> keys = new ArrayList<>();
				keys.addAll( e.getProperties().keySet() );
				Collections.sort(keys);
				for (String k : keys) {
					arr.put(entityObjectToJson(e.getProperties().get(k)));
				}
				return arr;
			} else {
				JSONObject mapObj = new JSONObject();
				for (String k :  e.getProperties().keySet()) {
					mapObj.put(k, entityObjectToJson(e.getProperties().get(k)));
				}
				return mapObj;
			}
		} else if (entity == null) {
			return null;
		} else {
			log.warning("Unhandled entity class "+entity.getClass().getName());
			return null;
		}
	}

	protected static boolean isArray(EmbeddedEntity e) {
		for (String k : e.getProperties().keySet()) {
			if (!k.startsWith("idx_")) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @param entity
	 * @param jsonObject
	 * @return all shared nicks, not null
	 */
	public static List<String> updateEntity(Entity entity, JSONObject jsonObject) {
		List<String> shares = new ArrayList<>();
		for (String k : JSONObject.getNames(jsonObject)) {
			if (! "docId".equals(k) ) {
				Object valObj = jsonObject.get(k);
				if (DAO.SHARES.equals(k)) {
					// we don't save shares inside the character
					if (valObj instanceof JSONArray) {
						JSONArray arr = (JSONArray)valObj;
						for (int i=0; i<arr.length(); i++) {
							shares.add(arr.getString(i));
						} 
					}
				} else {
					Object value = JsonUtils.jsonToEntityObject(valObj);
					entity.setUnindexedProperty(k, value);
				}
			}
		}
		return shares;	
	}
	
	/**
	 * Returns response for login and register. 
	 */
	public static String getLoginResponse(Entity user, String randomSHA1) {
		return getLoginResponse((String)user.getProperty(DAO.USER_PROP_NICK), randomSHA1);
	}
	
	public static String getLoginResponse(String nick, String randomSHA1) {
		JSONObject json = new JSONObject();
		json.put("nick", nick);
		json.put("token", randomSHA1);
		return json.toString();
	}

}
