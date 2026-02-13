package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // 🔹 For Interviewer Dashboard → show only assigned interviews
    List<Application> findByInterviewerId(Long interviewerId);

    // 🔹 Optional (useful later) → filter by status also
    List<Application> findByInterviewerIdAndStatus(Long interviewerId, String status);

}
