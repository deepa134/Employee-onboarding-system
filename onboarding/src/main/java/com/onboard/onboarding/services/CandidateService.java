package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.Candidate;
import com.onboard.onboarding.entities.Test;
import com.onboard.onboarding.entities.TestStatus;
import com.onboard.onboarding.repositories.CandidateRepository;
import com.onboard.onboarding.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepo;
    private final TestRepository testRepo;

    //  Register candidate → schedule first test
    public Candidate registerCandidate(Candidate candidate) {
        Candidate saved = candidateRepo.save(candidate);

        Test test = new Test();
        test.setCandidate(saved);
        test.setTestStatus(TestStatus.SCHEDULED);
        test.setScore(0);
        testRepo.save(test);

        return saved;
    }

    //  Candidate submits a test → evaluate automatically
    public Test submitTest(Long candidateId, Long testId, int score) {
        Test test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found with ID " + testId));

        if (!test.getCandidate().getId().equals(candidateId)) {
            throw new RuntimeException("Test does not belong to this candidate");
        }

        test.setScore(score);
        test.setTestStatus(score >= 40 ? TestStatus.PASSED : TestStatus.FAILED); // simple evaluation
        return testRepo.save(test);
    }

    //  Get all tests for a candidate
    public List<Test> getCandidateTests(Long candidateId) {
        return testRepo.findByCandidateId(candidateId);
    }

    //  Get test status by test ID
    public TestStatus getTestStatus(Long testId) {
        Test test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found with ID " + testId));
        return test.getTestStatus();
    }

    //  Schedule a new test for candidate
    public Test scheduleTest(Long candidateId) {
        Candidate candidate = candidateRepo.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Test test = new Test();
        test.setCandidate(candidate);
        test.setTestStatus(TestStatus.SCHEDULED);
        test.setScore(0);
        return testRepo.save(test);
    }
}
