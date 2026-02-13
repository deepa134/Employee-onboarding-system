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

    // ✅ When candidate applies
    public Application apply(Application application) {

        application.setStatus("TEST_ACTIVE");
        application.setTestDate(LocalDate.now().plusDays(2));

        return applicationRepository.save(application);
    }

    // ✅ Get all applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // ✅ Submit test & evaluate
    public Application submitTest(Long applicationId, int score) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("TEST_PASSED".equals(application.getStatus()) ||
            "TEST_FAILED".equals(application.getStatus())) {

            throw new RuntimeException("Test already submitted");
        }

        if (LocalDate.now().isAfter(application.getTestDate())) {
            application.setStatus("TEST_EXPIRED");
            return applicationRepository.save(application);
        }

        application.setScore(score);

        if (score >= 8) {
            application.setStatus("TEST_PASSED");
        } else {
            application.setStatus("TEST_FAILED");
        }

        return applicationRepository.save(application);
    }

    // ✅ Schedule Interview (CORRECT VERSION)
    public Application scheduleInterview(
            Long applicationId,
            String level,
            LocalDate date,
            String time
    ) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setInterviewLevel(level);
        application.setInterviewDate(date);   // 🔥 now LocalDate
        application.setInterviewTime(time);
        application.setInterviewStatus(level + "_SCHEDULED");

        return applicationRepository.save(application);
    }
}
