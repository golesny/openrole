package de.golesny.openrole.service;

public class OpenRoleException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	public final int responseCode;
	public final String resourceKey;

	public OpenRoleException(String internalLogMessage, String resourceKey, int responseCode) {
		super(internalLogMessage);
		this.resourceKey = resourceKey;
		this.responseCode = responseCode;
	}
}
