package com.onboard.onboarding.controllers;

import com.onboard.onboarding.entities.Application;
import com.onboard.onboarding.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationService applicationService;


    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Application apply(
            @RequestParam Long internshipId,
            @RequestParam String candidateName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String degree,
            @RequestParam String college,
            @RequestParam String cgpa,
            @RequestParam String skills,
            @RequestParam MultipartFile resume
    ) {

        try {

            String uploadDir = System.getProperty("user.dir") + File.separator + "resumes";
            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            resume.transferTo(new File(uploadDir + File.separator + fileName));

            Application application = new Application();
            application.setInternshipId(internshipId);
            application.setCandidateName(candidateName);
            application.setEmail(email);
            application.setPhone(phone);
            application.setDegree(degree);
            application.setCollege(college);
            application.setCgpa(cgpa);
            application.setSkills(skills);
            application.setResumeFileName(fileName);

            return applicationService.apply(application);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Application failed");
        }
    }

    

    @GetMapping
    public List<Application> getAll() {
        return applicationService.getAllApplications();
    }

    

    @GetMapping("/interviewer/{id}")
    public List<Application> getByInterviewer(@PathVariable Long id) {
        return applicationService.getApplicationsByInterviewer(id);
    }

    

    @PostMapping("/submit-test")
    public Application submitTest(
            @RequestParam Long applicationId,
            @RequestParam int score
    ) {
        return applicationService.submitTest(applicationId, score);
    }

   

    @PostMapping("/schedule-interview")
    public Application scheduleInterview(
            @RequestParam Long applicationId,
            @RequestParam String level,
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam String mode,
            @RequestParam(required = false) Long interviewerId
    ) {

        return applicationService.scheduleInterview(
                applicationId,
                level,
                LocalDate.parse(date),
                time,
                mode,
                interviewerId
        );
    }

    @PostMapping("/interviewer-response")
    public Application interviewerResponse(
            @RequestParam Long applicationId,
            @RequestParam String status
    ) {
        return applicationService.updateInterviewerStatus(applicationId, status);
    }

    @PostMapping("/update-interview-result")
    public Application updateInterviewResult(
            @RequestParam Long applicationId,
            @RequestParam String result
    ) {
        return applicationService.updateInterviewResult(applicationId, result);
    }

    @PostMapping("/hr-result")
    public Application updateHrResult(
            @RequestParam Long applicationId,
            @RequestParam String result
    ) {
        return applicationService.updateHrResult(applicationId, result);
    }

}
