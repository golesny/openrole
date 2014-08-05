package de.golesny.openrole.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.apache.commons.lang3.StringUtils;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PreparedQuery.TooManyResultsException;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import de.golesny.openrole.service.util.DigestUtils;

public class DAO {
	private static final Logger log = Logger.getLogger(DAO.class.getName());
	public static final String SHARES = "shares";
	public static final String PROP_DOCID = "docid";
	public static final String SHARES_PROP_SYSTEM = "system";
	public static final String USER_PROP_NICK = "nick";
	public static final String USER_PROP_USER = "user";
	public static final String USER_PROP_PWHASH = "pwhash";
	public static final String USER_PROP_RANDOMSHA1 = "randomsha1";
	
	private DatastoreService datastore;
	
	public DAO() {
		datastore = DatastoreServiceFactory.getDatastoreService();
	}
	
	/**
	 * 
	 * @param user
	 * @param system
	 * @return list of shares character entities
	 */
	public List<Entity> findAllSharedCharactersForUser(Entity user, String system) {
		String nick = (String)user.getProperty(USER_PROP_NICK);
		log.fine("find all shares for user nick "+nick);
		if (StringUtils.isEmpty(nick)) {
			return Collections.emptyList();
		}
		Filter allThatAreSharedForUser = new FilterPredicate(SHARES, FilterOperator.EQUAL, nick);
		Filter systemFilter = new FilterPredicate(SHARES_PROP_SYSTEM, FilterOperator.EQUAL, system);
		Query query = new Query(SHARES).setFilter(allThatAreSharedForUser).setFilter(systemFilter);
		List<Long> docIds = new ArrayList<>();
		for (Entity shar : datastore.prepare(query).asIterable()) {
			docIds.add(Long.valueOf((long)shar.getProperty(PROP_DOCID)));
		}
		if (docIds.size() > 0) {
			List<Key> keys = new ArrayList<>();
			for (Long id : docIds) {
				keys.add(KeyFactory.createKey(system, id.longValue()));
			}
			Map<Key, Entity> map = datastore.get(keys);
			return new ArrayList<Entity>(map.values());
		}
		return Collections.emptyList();
	}

	public Entity findOrCreateEntityForUpdate(String system, String docId) {
		if (docId != null) {
			long docIdL = Long.valueOf(docId);
			Key key = KeyFactory.createKey(system, docIdL);
			try {
				return datastore.get(key);
			} catch (EntityNotFoundException e) {
				throw new OpenRoleException("["+system+"] Illegal identifier '"+docId+"'", "MSG.ID_NOT_FOUND", 403);
			}
		}
		// new 
		return new Entity(system);
	}

	public Entity findCharacter(Entity user, RequestInfo requestInfo) {
		if (requestInfo.docId != null) {
			long docIdL = Long.valueOf(requestInfo.docId);
			Key key = KeyFactory.createKey(requestInfo.system, docIdL);
			try {
				Entity character = datastore.get(key);
				if (! user.getKey().getName().equals((String)character.getProperty(USER_PROP_USER))) {
					throw new OpenRoleException("User "+user.getKey()+" wants to access not his character", "ILLEGAL_ACTION", 403);
				}
				return character;
			} catch (EntityNotFoundException e) {
				throw new OpenRoleException("["+requestInfo.system+"] Illegal identifier '"+requestInfo.docId+"' from user "+user.getKey(), "ID_NOT_FOUND", 403);
			}
		}
		throw new OpenRoleException("["+requestInfo.system+"] Identifier must not be null from user "+user.getKey(), "ID_NOT_FOUND", 403);
	}

	public List<Map<String, String>> getCharacterOverview(Entity user, RequestInfo reqInfo) {
		Filter filter = new FilterPredicate(USER_PROP_USER, FilterOperator.EQUAL, user.getKey().getName());
		Query query = new Query(reqInfo.system).setFilter(filter);
		List<Map<String, String>> result = new ArrayList<>();
		for (Entity ent : datastore.prepare(query).asIterable()) {
			if (StringUtils.isNotBlank(reqInfo.docId)) {
				if (ent.hasProperty("systemname") && StringUtils.equals(reqInfo.docId, ""+ent.getProperty("systemname"))) {
					createEntry(result, ent);
				}
			} else {
				createEntry(result, ent);
			}
		}
		return result;
	}

	private void createEntry(List<Map<String, String>> result, Entity ent) {
		Map<String, String> entry = new HashMap<>();
		entry.put("docId", ""+ent.getKey().getId());
		entry.put("charactername", ""+ent.getProperty("charactername"));
		result.add(entry);
	}
	
	public String doRegister(String email, String pw, String nick) {
		String lowercaseEmailSHA1 = DigestUtils.getSHA1(email.toLowerCase());
		Key key = KeyFactory.createKey(USER_PROP_USER, lowercaseEmailSHA1);
		try {
			datastore.get(key);
			throw new OpenRoleException("E-Mail "+lowercaseEmailSHA1+" already exists while registration", "MSG.USER_ALREADY_EXISTS", 409);
		} catch (EntityNotFoundException e) {
			// check the nick, if not available
			if (!StringUtils.isEmpty(nick)) {
				Query query = new Query(USER_PROP_USER).setFilter(new Query.FilterPredicate(DAO.USER_PROP_NICK, FilterOperator.EQUAL, nick));
				try {
				  if (datastore.prepare(query).asSingleEntity() != null) {
					  throw new OpenRoleException("There are to many results for nick "+nick, "MSG.NICK_ALREADY_EXISTS", 409);
				  }
				} catch (TooManyResultsException e1) {
					throw new OpenRoleException("There are to many results for nick "+nick, "MSG.NICK_ALREADY_EXISTS", 409);
				}
			}
			// we can proceed
			Entity newUser = new Entity(key);
			newUser.setProperty(DAO.USER_PROP_NICK, nick);
			String pwHash = DigestUtils.getSHA1(pw);
			newUser.setProperty(USER_PROP_PWHASH, pwHash);
			String randomsha1 = DigestUtils.getSHA1(email + "-" + System.currentTimeMillis());
			newUser.setProperty(USER_PROP_RANDOMSHA1, randomsha1);
			datastore.put(newUser);
			return randomsha1;
		}
	}
	
	public Entity getUser(String token) {
		log.fine("getting user with token "+token);
		Filter randomSha1Filter = new FilterPredicate(USER_PROP_RANDOMSHA1, FilterOperator.EQUAL, token);

		// Use class Query to assemble a query
		Query q = new Query(USER_PROP_USER).setFilter(randomSha1Filter);

		// Use PreparedQuery interface to retrieve results
		PreparedQuery pq = datastore.prepare(q);

		Entity result = pq.asSingleEntity();
		return result;
	}

	public void updateShares(Key characterKey, String system, final List<String> newShares) {
		log.fine("updating shares: "+newShares);
		Filter filter = new FilterPredicate(PROP_DOCID, FilterOperator.EQUAL, characterKey.getId());
		Query query = new Query(SHARES).setFilter(filter);
		List<String> sharesToProcess = new ArrayList<>();
		sharesToProcess.addAll(newShares);
		List<Key> toDelete = new ArrayList<>();
		for (Entity shar : datastore.prepare(query).asIterable()) {
			String nick = (String)shar.getProperty(USER_PROP_NICK);
			if (newShares.contains(nick)) {
				// already saved
				sharesToProcess.remove(nick);
			} else if (!newShares.contains(nick)) {
				// put to delete
				toDelete.add(shar.getKey());
				sharesToProcess.remove(nick);
			}
		}
		if (toDelete.size() > 0) {
			datastore.delete(toDelete);
		}
		// create the rest
		if (sharesToProcess.size() > 0) {
			List<Entity> toStore = new ArrayList<>();
			for (String nick : sharesToProcess) {
				Entity s = new Entity(SHARES);
				s.setProperty(PROP_DOCID, characterKey.getId());
				s.setProperty(USER_PROP_NICK, nick);
				s.setProperty(SHARES_PROP_SYSTEM, system);
				toStore.add(s);
			}
			datastore.put(toStore); 
		}
	}

	public List<String> findAllSharesForCharacter(long characterDocId) {
		Filter filter = new FilterPredicate(PROP_DOCID, FilterOperator.EQUAL, characterDocId);
		Query query = new Query(SHARES).setFilter(filter );
		List<String> nicks = new ArrayList<>();
		for (Entity shar : datastore.prepare(query).asIterable()) {
			nicks.add((String)shar.getProperty(USER_PROP_NICK));
		}
		return nicks;
	}
	
}
