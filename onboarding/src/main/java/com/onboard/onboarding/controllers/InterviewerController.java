package com.onboard.onboarding.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviewers")
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewerController {

    @GetMapping
    public List<Map<String, Object>> getInterviewers() {

        return List.of(
                Map.of("id", 1, "name", "Kavya"),
                Map.of("id", 2, "name", "Arun"),
                Map.of("id", 3, "name", "Mani")
        );
    }
}
