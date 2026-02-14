package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByL1InterviewerId(Long interviewerId);
    List<Application> findByL2InterviewerId(Long interviewerId);

}
