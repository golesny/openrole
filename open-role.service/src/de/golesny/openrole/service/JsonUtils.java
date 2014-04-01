package de.golesny.openrole.service;

import java.util.Map;

import org.json.JSONObject;

public class JsonUtils {
	
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
}
