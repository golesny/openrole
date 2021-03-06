package de.golesny.openrole.service.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.UnknownServiceException;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import de.golesny.openrole.service.OpenRoleException;
import de.golesny.openrole.service.RequestInfo;
import de.golesny.openrole.service.ServiceActions;

public class PathUtils {

	/**
	 * Tyical format is:<br>
	 * /system/action/id
	 */
	public static RequestInfo extractRequestInfo(String pathInfo, Set<String> systems) throws IOException {
		if (pathInfo != null && pathInfo.startsWith("/") && pathInfo.length() > 3) {
			String[] parts = StringUtils.split(pathInfo, '/');
			// parse the system
			String system = null;
			if (parts.length > 0) {
				String tmpSystem = parts[0];
				if (systems != null) {
					for (String s : systems) {
						if (s.equals(tmpSystem)) {
							system =  tmpSystem;
						}
					}
				}
			}
			if (system != null) {
				// parse the action
				ServiceActions action = null;
				if (parts.length > 1) {
					try {
						action = ServiceActions.valueOf(parts[1]);
					} catch (IllegalArgumentException e) {
						throw new OpenRoleException("Invalid action called: "+parts[1], "MSG.SERVICE_ACTION_INVALID", 403);
					}
				}
				// parse document id
				String docId = null;
				if (parts.length > 2) {
					docId = parts[2];
				}
				return new RequestInfo(system, action, docId);
			}
		}
		throw new UnknownServiceException("Unknown system");
	}
	
	public static String getPost(BufferedReader reader) throws IOException {
		StringBuffer jb = new StringBuffer();
    	String line = null;
    	while ((line = reader.readLine()) != null)
    	{
    		jb.append(line);
    	}
    	return jb.toString();
	}
}
