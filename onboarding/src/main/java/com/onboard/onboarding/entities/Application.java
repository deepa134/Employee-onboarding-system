package com.onboard.onboarding.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "applications")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long internshipId;

    private String candidateName;
    private String email;
    private String phone;
    private String degree;
    private String college;
    private String cgpa;
    private String skills;

    private String resumeFileName;

    private String status;

    private LocalDate testDate;
    private Integer score;

    private String interviewStatus;
    private LocalDate interviewDate;
    private String interviewTime;
    private String interviewLevel;
}
