package de.golesny.openrole.service;

public class OpenRoleException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	public int responseCode = 500;

	public OpenRoleException(String message, int responseCode) {
		super(message);
		this.responseCode = responseCode;
	}
}
