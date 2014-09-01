package de.golesny.openrole.service.util;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import de.golesny.openrole.service.MailInfo;
import de.golesny.openrole.service.OpenRoleException;

public class MailUtils {
	private static String FROM = "dgolesny@gmail.com";
	
	public static void sendPWResetCode(MailInfo obj) {
		String subject = "Openrole.net password reset code";
		String body = "Go to http://www.openrole.net/#/pwresetcode\n\nEnter you E-Mail and this code: \n\n"+obj.code;
		internalSendMail(obj.email, obj.nick, subject, body);
	}
	
	public static void sendNewPassword(MailInfo obj) {
		String subject = "Openrole.net password reset";
		String body = "Your new password is: "+obj.pw;
		internalSendMail(obj.email, obj.nick, subject, body);
	}

	private static void internalSendMail(String from, String nick, String subject, String body) {
		Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);


        try {
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(FROM, "Daniel Golesny (Openrole.net)"));
            msg.addRecipient(Message.RecipientType.TO,
                             new InternetAddress(from, nick));
			msg.setSubject(subject);
			msg.setText(body);
            Transport.send(msg);

        } catch (AddressException e) {
            throw new OpenRoleException("E-Mail falsch", "MSG.WRONG_EMAILFORMAT", 409);
        } catch (MessagingException e) {
            throw new OpenRoleException("Internal Error with mail transfer: "+e.getMessage(), "MSG.MAIL_COULDNOT_SEND", 500);
        } catch (UnsupportedEncodingException e) {
        	throw new OpenRoleException("Unsupported Encoding with mail transfer: "+e.getMessage(), "MSG.MAIL_COULDNOT_SEND", 500);
		}
	}
}
