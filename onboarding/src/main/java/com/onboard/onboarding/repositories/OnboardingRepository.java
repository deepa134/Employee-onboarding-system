package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Onboarding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {

    List<Onboarding>  findByEmail (String email);
}
