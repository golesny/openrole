package de.golesny.openrole.service;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.net.UnknownServiceException;
import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

import de.golesny.openrole.service.util.PathUtils;

public class PathUtilsTest {
	
	@Test
	public void simpleURL_system_is_extraced_one_system_given() throws IOException {
		assertRequestInfo("malmsturm", null, null, PathUtils.extractRequestInfo("/malmsturm", mkSystems("malmsturm")));
	}
	
	@Test
	public void simpleURL_system_is_extraced_from_list() throws IOException {
		assertRequestInfo("malmsturm", null, null,
				PathUtils.extractRequestInfo("/malmsturm", mkSystems("malmsturm", "anysystem", "another")));
	}
	
	@Test
	public void simpleURL_system_is_extraced_from_middle_of_list() throws IOException {
		assertRequestInfo("malmsturm", null, null,
				PathUtils.extractRequestInfo("/malmsturm", mkSystems( "anysystem", "malmsturm", "another")));
	}
	
	@Test
	public void simpleURL_system_is_extraced_from_end_of_list() throws IOException {
		assertRequestInfo("another", null, null,
				PathUtils.extractRequestInfo("/another", mkSystems( "anysystem", "malmsturm", "another")));
	}
	
	@Test
	public void system_is_extraced_withaction() throws IOException {
		for (ServiceActions ac : ServiceActions.values()) {
			assertRequestInfo("another", ac, null, 
					PathUtils.extractRequestInfo("/another/"+ac.name()+"/", mkSystems( "anysystem", "malmsturm", "another")));
		}
	}
	
	@Test
	public void system_is_extraced_with_docid() throws IOException {
		assertRequestInfo("another", ServiceActions.store, "hggdsf67673",
				PathUtils.extractRequestInfo("/another/store/hggdsf67673", mkSystems( "anysystem", "malmsturm", "another")));
	}
	
	@Test
	public void system_is_extraced_with_config() throws IOException {
		assertRequestInfo("another", ServiceActions.get, "config",
				PathUtils.extractRequestInfo("/another/get/config", mkSystems( "anysystem", "malmsturm", "another")));
	}
	
	@Test(expected=UnknownServiceException.class)
	public void invalid_system_throws_Unsupported_Exception() throws IOException {
		PathUtils.extractRequestInfo("/invalid", mkSystems("malmsturm"));
	}

	@Test(expected=UnknownServiceException.class)
	public void invalid_system_throws_Unsupported_Exception_complexURL() throws IOException {
		PathUtils.extractRequestInfo("/invalid/store", mkSystems("malmsturm"));
	}
	
	@Test(expected=UnknownServiceException.class)
	public void invalid_system_throws_Unsupported_Exception_with_query_part() throws IOException {
		PathUtils.extractRequestInfo("/invalid/store?shkf=hsdhf", mkSystems("malmsturm"));
	}
	
	@Test(expected=UnknownServiceException.class)
	public void invalid_system_throws_Unsupported_Exception_on_null() throws IOException {
		PathUtils.extractRequestInfo("/invalid/store?shkf=hsdhf", null);
	}
	
	@Test(expected=UnknownServiceException.class)
	public void invalid_system_throws_Unsupported_Exception_on_empty_set() throws IOException {
		PathUtils.extractRequestInfo("/invalid/store?shkf=hsdhf", new HashSet<String>());
	}
	
	private void assertRequestInfo(
		String expectedSystem,
		ServiceActions expectedAction, 
		String documentId,
		RequestInfo actualObject)
	{
		assertEquals(expectedSystem, actualObject.system);
		assertEquals(expectedAction, actualObject.action);
		assertEquals(documentId, actualObject.docId);
	}
	
	private Set<String> mkSystems(String... sysArr) {
		Set<String> set = new HashSet<>();
		for (String s : sysArr) {
			set.add(s);
		}
		return set;
	}
}
