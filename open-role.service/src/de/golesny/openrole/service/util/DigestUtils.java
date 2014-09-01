package de.golesny.openrole.service.util;

import java.math.BigInteger;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import de.golesny.openrole.service.OpenRoleException;
import de.golesny.openrole.service.OpenroleServiceServlet;

public final class DigestUtils {

	public static final Charset DEFAULTCHARSET = Charset.forName("UTF-8");
	private static final String PWCHARS[] = {"abcdefghiklm","npqrstuvwxyz","ABCDEFGHIKLMN","PQRSTUVWXYZ","0123456789","!§%&?=/"};

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
	
	public static String createRandomString() {
		SecureRandom random = new SecureRandom();
		String newCode = new BigInteger(320, random).toString(32);
		return newCode;
	}
	
	public static String createPassword() {
		SecureRandom random = new SecureRandom();
		StringBuilder sb = new StringBuilder();
		for (int i=0; i<8; i++) {
			int slot = random.nextInt(PWCHARS.length);
			char c = PWCHARS[slot].charAt(random.nextInt(PWCHARS[slot].length()));
			sb.append(c);
		}
		return sb.toString();
	}
}
