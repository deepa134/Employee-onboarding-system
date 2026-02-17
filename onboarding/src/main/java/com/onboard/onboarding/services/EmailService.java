package com.onboard.onboarding.services;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    @Async
    public void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("yourgmail@gmail.com"); 

        mailSender.send(message);
    }
}
