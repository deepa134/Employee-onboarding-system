package com.onboard.onboarding.controllers;

import com.onboard.onboarding.entities.Candidate;
import com.onboard.onboarding.entities.Test;
import com.onboard.onboarding.entities.TestStatus;
import com.onboard.onboarding.services.CandidateService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    // 1️⃣ Register candidate
    @PostMapping("/register")
    public Candidate register(@RequestBody Candidate candidate) {
        return candidateService.registerCandidate(candidate);
    }

    // 2️⃣ Schedule a new test for candidate
    @PostMapping("/{candidateId}/tests/schedule")
    public Test scheduleTest(@PathVariable Long candidateId) {
        return candidateService.scheduleTest(candidateId);
    }

    // 3️⃣ Submit a test
    @PostMapping("/{candidateId}/tests/{testId}/submit")
    public Test submitTest(
            @PathVariable Long candidateId,
            @PathVariable Long testId,
            @RequestBody ScoreRequest request) {
        return candidateService.submitTest(candidateId, testId, request.getScore());
    }

    // 4️⃣ Get all tests of a candidate
    @GetMapping("/{candidateId}/tests")
    public List<Test> getTests(@PathVariable Long candidateId) {
        return candidateService.getCandidateTests(candidateId);
    }

    // 5️⃣ Get test status
    @GetMapping("/tests/{testId}/status")
    public String getStatus(@PathVariable Long testId) {
        TestStatus status = candidateService.getTestStatus(testId);
        return status.name();
    }

    // DTO for score submission
    @Data
    public static class ScoreRequest {
        private int score;
    }
}
