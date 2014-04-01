package de.golesny.openrole.service;

public class RequestInfo {
	public final String system;
	public final ServiceActions action;
	public final String docId;
	
	public RequestInfo(String system, ServiceActions action, String docId) {
		this.system = system;
		this.action = action;
		this.docId = docId;
	}
}
