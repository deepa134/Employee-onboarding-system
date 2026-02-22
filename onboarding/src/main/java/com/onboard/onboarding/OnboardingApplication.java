package com.onboard.onboarding;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class OnboardingApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnboardingApplication.class, args);
	}

}
