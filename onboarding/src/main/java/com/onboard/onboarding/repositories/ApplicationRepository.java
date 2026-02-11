package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}
