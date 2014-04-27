package de.golesny.openrole.service.util;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import de.golesny.openrole.service.OpenRoleException;
import de.golesny.openrole.service.OpenroleServiceServlet;

public final class DigestUtils {

	public static final Charset DEFAULTCHARSET = Charset.forName("UTF-8");

	public static String getSHA1(String plain) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			return byteArrayToHexString(md.digest(plain.getBytes(DEFAULTCHARSET)));
		} catch (NoSuchAlgorithmException e) {
			throw new OpenRoleException(e.getMessage(), OpenroleServiceServlet.INTERNAL_SERVER_ERROR, 500);
		}
	}

	public static String byteArrayToHexString(byte[] b) {
		String result = "";
		for (int i=0; i < b.length; i++) {
			result += Integer.toString( ( b[i] & 0xff ) + 0x100, 16).substring( 1 );
		}
		return result;
	}
}
