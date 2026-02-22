package com.onboard.onboarding.repositories;
import com.onboard.onboarding.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestRepository extends JpaRepository<Test, Long> {

    List<Test> findByApplicationId(Long applicationId);
}
