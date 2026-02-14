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

        return applicationRepository.save(app);
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
        }

        return applicationRepository.save(app);
    }

    public Application updateHrResult(Long applicationId, String result) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if ("HR_PASSED".equals(result)) {
            app.setHrResult("PASSED");
            app.setInterviewStatus("HR_PASSED");
            app.setStatus("SELECTED");
        }

        if ("HR_FAILED".equals(result)) {
            app.setHrResult("FAILED");
            app.setInterviewStatus("HR_FAILED");
            app.setStatus("REJECTED");
        }

        return applicationRepository.save(app);
    }
}
