package com.onboard.onboarding.controllers;

import com.onboard.onboarding.entities.Onboarding;
import com.onboard.onboarding.services.OnboardingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin
public class OnboardingController {

    private final OnboardingService service;

    public OnboardingController(OnboardingService service) {
        this.service = service;
    }

    @PostMapping
    public Onboarding save(@RequestBody Onboarding onboarding) {
        return service.save(onboarding);
    }

   @GetMapping("/candidate")
public List<Onboarding> getByEmail(@RequestParam String email) {
    return service.getByEmail(email);
}


    @GetMapping
    public List<Onboarding> getAll() {
        return service.getAll();
    }

    @PutMapping("/update/{id}/{status}")
    public Onboarding updateStatus(@PathVariable Long id,
                                   @PathVariable String status) {
        return service.updateStatus(id, status);
    }
}
