package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.Onboarding;
import com.onboard.onboarding.repositories.OnboardingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OnboardingService {

    private final OnboardingRepository repo;

    public OnboardingService(OnboardingRepository repo) {
        this.repo = repo;
    }

   
    public Onboarding save(Onboarding onboarding) {

        
        onboarding.setStatus("PENDING");

        return repo.save(onboarding);
    }

    
    public List<Onboarding> getByEmail(String email) {
        return repo.findByEmail(email);
    }

   
    public List<Onboarding> getByApplicationId(Long applicationId) {
        return repo.findByApplicationId(applicationId);
    }

    
    public List<Onboarding> getAll() {
        return repo.findAll();
    }

   
    public Onboarding updateStatus(Long id, String status) {

        Onboarding ob = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Onboarding not found"));

        ob.setStatus(status);

        return repo.save(ob);
    }
}
