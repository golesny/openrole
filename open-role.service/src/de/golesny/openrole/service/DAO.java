package de.golesny.openrole.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;

public class DAO {

	public Entity findOrCreateEntityForUpdate(Entity user, String system, String docId) {
		if (docId != null) {
			long docIdL = Long.valueOf(docId);
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Key key = KeyFactory.createKey(user.getKey(), system, docIdL);
			try {
				return datastore.get(key);
			} catch (EntityNotFoundException e) {
				throw new OpenRoleException("["+system+"] Illegal identifier '"+docId+"' from user "+user.getKey(), "MSG.ID_NOT_FOUND", 403);
			}
		}
		// new 
		return new Entity(system, user.getKey());
	}

	public Entity findCharacter(Entity user, RequestInfo requestInfo) {
		if (requestInfo.docId != null) {
			long docIdL = Long.valueOf(requestInfo.docId);
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Key key = KeyFactory.createKey(user.getKey(), requestInfo.system, docIdL);
			try {
				return datastore.get(key);
			} catch (EntityNotFoundException e) {
				throw new OpenRoleException("["+requestInfo.system+"] Illegal identifier '"+requestInfo.docId+"' from user "+user.getKey(), "ID_NOT_FOUND", 403);
			}
		}
		throw new OpenRoleException("["+requestInfo.system+"] Identifiermus not be null from user "+user.getKey(), "ID_NOT_FOUND", 403);
	}

	public List<Map<String, String>> getCharacterOverview(Entity user, RequestInfo reqInfo) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query query = new Query(reqInfo.system, user.getKey());
		List<Map<String, String>> result = new ArrayList<>();
		for (Entity ent : datastore.prepare(query).asIterable()) {
			Map<String, String> entry = new HashMap<>();
			entry.put("docId", ""+ent.getKey().getId());
			entry.put("charactername", ""+ent.getProperty("charactername"));
			result.add(entry);
		}
		return result;
	}
	
	
}
