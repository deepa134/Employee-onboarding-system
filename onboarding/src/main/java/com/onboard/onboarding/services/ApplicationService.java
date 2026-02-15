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
    private final EmailService emailService;

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
        return applicationRepository.findAll()
                .stream()
                .filter(app ->
                        (app.getL1InterviewerId() != null && app.getL1InterviewerId().equals(id)) ||
                        (app.getL2InterviewerId() != null && app.getL2InterviewerId().equals(id))
                )
                .toList();
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

        if (score >= 8) application.setStatus("TEST_PASSED");
        else application.setStatus("TEST_FAILED");

        return applicationRepository.save(application);
    }

    // ✅ INTERVIEW SCHEDULE + EMAIL
    public Application scheduleInterview(Long applicationId,
                                         String level,
                                         LocalDate date,
                                         String time,
                                         String mode,
                                         Long interviewerId) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        time = time.substring(0, 5);

        app.setInterviewLevel(level);
        app.setInterviewStatus(level + "_SCHEDULED");

        if ("L1".equals(level)) {
            app.setL1Date(date);
            app.setL1Time(time);
            app.setL1Mode(mode);
            app.setL1InterviewerId(interviewerId);
            app.setL1InterviewerStatus("REQUESTED");
        }

        if ("L2".equals(level)) {
            app.setL2Date(date);
            app.setL2Time(time);
            app.setL2Mode(mode);
            app.setL2InterviewerId(interviewerId);
            app.setL2InterviewerStatus("REQUESTED");
        }

        if ("HR".equals(level)) {
            app.setHrDate(date);
            app.setHrTime(time);
            app.setHrMode(mode);
            app.setHrInterviewerName("HR");
            app.setInterviewStatus("HR_SCHEDULED");
        }

        applicationRepository.save(app);

        String subject = level + " Interview Scheduled";

        String body = "Dear " + app.getCandidateName() + ",\n\n" +
                "Your " + level + " interview has been scheduled.\n\n" +
                "Date: " + date + "\n" +
                "Time: " + time + "\n" +
                "Mode: " + mode + "\n\n" +
                "Please login to the portal for more details.\n\n" +
                "Best Regards,\nHR Team";

        emailService.sendEmail(app.getEmail(), subject, body);

        return app;
    }

    public Application updateInterviewerStatus(Long applicationId, String status) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("L1".equals(app.getInterviewLevel())) {
            app.setL1InterviewerStatus(status);
        }

        if ("L2".equals(app.getInterviewLevel())) {
            app.setL2InterviewerStatus(status);
        }

        return applicationRepository.save(app);
    }

    // ✅ L1 / L2 RESULT + REJECTION MAIL
    public Application updateInterviewResult(Long applicationId, String result) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("L1_PASSED".equals(result)) {
            app.setL1Result("PASSED");
            app.setInterviewStatus("L1_PASSED");
            app.setStatus("L2_PENDING");
        }

        if ("L1_FAILED".equals(result)) {
            app.setL1Result("FAILED");
            app.setInterviewStatus("L1_FAILED");
            app.setStatus("REJECTED");
            sendRejectionMail(app, "L1");
        }

        if ("L2_PASSED".equals(result)) {
            app.setL2Result("PASSED");
            app.setInterviewStatus("L2_PASSED");
            app.setStatus("HR_PENDING");
        }

        if ("L2_FAILED".equals(result)) {
            app.setL2Result("FAILED");
            app.setInterviewStatus("L2_FAILED");
            app.setStatus("REJECTED");
            sendRejectionMail(app, "L2");
        }

        return applicationRepository.save(app);
    }

    // ✅ HR RESULT + SELECTION / REJECTION MAIL
    public Application updateHrResult(Long applicationId, String result) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("HR_PASSED".equals(result)) {
            app.setHrResult("PASSED");
            app.setInterviewStatus("HR_PASSED");
            app.setStatus("SELECTED");

            String subject = "Congratulations – You are Selected!";
            String body = "Dear " + app.getCandidateName() + ",\n\n" +
                    "Congratulations!\n\n" +
                    "You have successfully cleared all interview rounds.\n" +
                    "Our HR team will release the offer letter shortly.\n\n" +
                    "Best Regards,\nHR Team";

            emailService.sendEmail(app.getEmail(), subject, body);
        }

        if ("HR_FAILED".equals(result)) {
            app.setHrResult("FAILED");
            app.setInterviewStatus("HR_FAILED");
            app.setStatus("REJECTED");
            sendRejectionMail(app, "HR");
        }

        return applicationRepository.save(app);
    }

    public Application uploadOfferLetter(Long appId, String fileName) {

        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setOfferLetterFile(fileName);
        app.setOfferStatus("PENDING");

        applicationRepository.save(app);

        String subject = "Offer Letter Released";

        String body = "Dear " + app.getCandidateName() + ",\n\n" +
                "Congratulations.\n\n" +
                "Your offer letter has been released.\n" +
                "Please login to the portal to download and accept it.\n\n" +
                "Best Regards,\nHR Team";

        emailService.sendEmail(app.getEmail(), subject, body);

        return app;
    }

    public Application updateOfferStatus(Long appId, String status) {

        Application app = applicationRepository.findById(appId)
                .orElseThrow();

        app.setOfferStatus(status);

        String subject = "Offer Letter Response";

        String body = "Candidate " + app.getCandidateName() + " has " + status + " the offer letter.";

        emailService.sendEmail("yourgmail@gmail.com", subject, body);

        return applicationRepository.save(app);
    }

    public Application uploadSignedOffer(Long appId, String fileName) {

        Application app = applicationRepository.findById(appId)
                .orElseThrow();

        app.setSignedOfferLetter(fileName);

        String subject = "Signed Offer Letter Uploaded";

        String body = "Candidate " + app.getCandidateName() + " has uploaded the signed offer letter.";

        emailService.sendEmail("yourgmail@gmail.com", subject, body);

        return applicationRepository.save(app);
    }

    // ✅ COMMON REJECTION MAIL
    private void sendRejectionMail(Application app, String level) {

        String subject = "Interview Update";

        String body = "Dear " + app.getCandidateName() + ",\n\n" +
                "Thank you for attending the " + level + " interview.\n\n" +
                "We regret to inform you that you have not been selected for the next stage.\n\n" +
                "We wish you all the best for your future.\n\n" +
                "Best Regards,\nHR Team";

        emailService.sendEmail(app.getEmail(), subject, body);
    }
}
