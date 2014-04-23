package de.golesny.openrole.service;

import java.io.IOException;
import java.net.UnknownServiceException;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

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
					action = ServiceActions.valueOf(parts[1]);
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
}
