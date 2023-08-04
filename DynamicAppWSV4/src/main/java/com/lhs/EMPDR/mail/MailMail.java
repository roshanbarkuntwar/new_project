package com.lhs.EMPDR.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class MailMail {

    private JavaMailSender mailSender;

    public JavaMailSender getMailSender() {
        return mailSender;
    }

    private SimpleMailMessage simpleMailMessage;

    public void setSimpleMailMessage(SimpleMailMessage simpleMailMessage) {
        this.simpleMailMessage = simpleMailMessage;
    }

    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMail(String dear, String content) {
        SimpleMailMessage message = new SimpleMailMessage(simpleMailMessage);
        message.setText(String.format(simpleMailMessage.getText(), dear, content));
        mailSender.send(message);
    }
}
