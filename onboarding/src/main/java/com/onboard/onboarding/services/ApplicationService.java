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
    private final EmailService emailService;   // ✅ EMAIL SERVICE

    // ================= APPLY =================

    public Application apply(Application application) {

        application.setStatus("TEST_ACTIVE");
        application.setTestDate(LocalDate.now().plusDays(2));

        application.setInterviewStatus("NOT_SCHEDULED");
        application.setScore(null);

        return applicationRepository.save(application);
    }

    // ================= GET ALL =================

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // ================= SUBMIT TEST =================

    public Application submitTest(Long applicationId, int score) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Prevent re-submission
        if ("TEST_PASSED".equals(application.getStatus()) ||
            "TEST_FAILED".equals(application.getStatus())) {
            throw new RuntimeException("Test already submitted");
        }

        // Check expiry
        if (LocalDate.now().isAfter(application.getTestDate())) {
            application.setStatus("TEST_EXPIRED");
            return applicationRepository.save(application);
        }

        application.setScore(score);

        if (score >= 8) {
            application.setStatus("TEST_PASSED");

            // ✅ MAIL – TEST CLEARED
            emailService.sendEmail(
                    application.getEmail(),
                    "Online Test Result",
                    "Congratulations " + application.getCandidateName() +
                            ",\n\nYou have cleared the online test.\nHR will schedule your interview soon."
            );

        } else {
            application.setStatus("TEST_FAILED");

            // ✅ MAIL – TEST FAILED
            emailService.sendEmail(
                    application.getEmail(),
                    "Online Test Result",
                    "Hi " + application.getCandidateName() +
                            ",\n\nWe regret to inform you that you did not clear the online test."
            );
        }

        return applicationRepository.save(application);
    }

    // ================= SCHEDULE INTERVIEW =================

    public Application scheduleInterview(
            Long applicationId,
            String level,
            LocalDate date,
            String time
    ) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Only passed candidates allowed
        if (!"TEST_PASSED".equals(application.getStatus())) {
            throw new RuntimeException("Candidate has not cleared the test");
        }

        application.setInterviewLevel(level);
        application.setInterviewDate(date);
        application.setInterviewTime(time);
        application.setInterviewStatus(level + "_SCHEDULED");

        Application saved = applicationRepository.save(application);

        // ✅ INTERVIEW MAIL

        emailService.sendEmail(
                saved.getEmail(),
                level + " Interview Scheduled",
                "Dear " + saved.getCandidateName() + ",\n\n" +
                        "Your " + level + " interview has been scheduled.\n\n" +
                        "📅 Date: " + date +
                        "\n⏰ Time: " + time +
                        "\n\nAll the best!\nHR Team"
        );

        return saved;
    }
}
