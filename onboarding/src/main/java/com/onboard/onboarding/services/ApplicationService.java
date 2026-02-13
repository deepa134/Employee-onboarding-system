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

        application.setStatus("TEST_ACTIVE");
        application.setTestDate(LocalDate.now().plusDays(2));
        application.setInterviewStatus("NOT_SCHEDULED");
        application.setScore(null);

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getApplicationsByInterviewer(Long id) {
        return applicationRepository.findByInterviewerId(id);
    }

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

    public Application scheduleInterview(Long applicationId,
                                         String level,
                                         LocalDate date,
                                         String time,
                                         String mode,
                                         Long interviewerId) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setInterviewLevel(level);
        app.setInterviewDate(date);

        // ⭐ TIME SAFETY FIX
        app.setInterviewTime(time.substring(0, 5));

        app.setInterviewStatus(level + "_SCHEDULED");
        app.setMode(mode);
        app.setInterviewerId(interviewerId);
        app.setInterviewerStatus("REQUESTED");

        return applicationRepository.save(app);
    }

    public Application updateInterviewerStatus(Long applicationId, String status) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setInterviewerStatus(status);
        return applicationRepository.save(app);
    }

    public Application updateInterviewResult(Long applicationId, String result) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("L1_PASSED".equals(result)) {
            app.setInterviewStatus("L1_PASSED");
            app.setStatus("L2_PENDING");
        }

        if ("L1_FAILED".equals(result)) {
            app.setInterviewStatus("L1_FAILED");
            app.setStatus("REJECTED");
        }

        if ("L2_PASSED".equals(result)) {
            app.setInterviewStatus("L2_PASSED");
            app.setStatus("SELECTED");
        }

        if ("L2_FAILED".equals(result)) {
            app.setInterviewStatus("L2_FAILED");
            app.setStatus("REJECTED");
        }

        return applicationRepository.save(app);
    }
}
