package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.*;
import com.onboard.onboarding.repositories.ApplicationRepository;
import com.onboard.onboarding.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final ApplicationRepository applicationRepo;
    private final TestRepository testRepo;

    
    public Application apply(Application application) {

        Application savedApp = applicationRepo.save(application);

        Test onlineTest = new Test();
        onlineTest.setApplication(savedApp);
        onlineTest.setTestType(TestType.ONLINE);
        onlineTest.setTestStatus(TestStatus.SCHEDULED);
        onlineTest.setScore(0);

        testRepo.save(onlineTest);

        return savedApp;
    }

    
    public Test submitOnlineTest(Long testId, int score) {

        Test test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        test.setScore(score);
        test.setTestStatus(score >= 40 ? TestStatus.PASSED : TestStatus.FAILED);

        return testRepo.save(test);
    }
}
