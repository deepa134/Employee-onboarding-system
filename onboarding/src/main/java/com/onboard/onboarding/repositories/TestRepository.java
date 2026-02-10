package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

    // Return all tests for a candidate
    List<Test> findByCandidateId(Long candidateId);

   
}
