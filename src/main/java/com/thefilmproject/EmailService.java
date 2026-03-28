package com.thefilmproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@thefilmproject.com}")
    private String fromEmail;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordReset(String toEmail, String token) {
        if (mailSender == null) { System.err.println("Mail not configured — skipping password reset email"); return; }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Reset your TheFilmProject password");
            msg.setText("Hi,\n\nClick the link below to reset your password:\n\n"
                    + frontendUrl + "/reset-password?token=" + token
                    + "\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\nTheFilmProject Team");
            mailSender.send(msg);
        } catch (Exception e) {
            // Log but don't fail - user will see success message regardless
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendVerification(String toEmail, String token) {
        if (mailSender == null) { System.err.println("Mail not configured — skipping verification email"); return; }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Verify your TheFilmProject email");
            msg.setText("Hi,\n\nClick the link below to verify your email address:\n\n"
                    + frontendUrl + "/verify-email?token=" + token
                    + "\n\nThis link expires in 24 hours.\n\nTheFilmProject Team");
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }
}
