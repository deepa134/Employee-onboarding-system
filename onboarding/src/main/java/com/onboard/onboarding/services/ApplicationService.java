package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.Application;
import com.onboard.onboarding.repositories.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public Application apply(Application application) {

        // Test starts TODAY
        application.setStatus("TEST_ACTIVE");

        // Active for 2 days
        application.setTestDate(LocalDate.now().plusDays(2));

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
