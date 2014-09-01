package de.golesny.openrole.service.util;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class DigestUtilsTest {

	@Test
	public void password_has_8_chars() {
		for (int i=0; i<10;i++) {
			String pw = DigestUtils.createPassword();
			assertEquals(8, pw.length());
		}
	}
}
