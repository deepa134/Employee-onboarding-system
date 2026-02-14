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
    private String interviewLevel;

    private LocalDate l1Date;
    private String l1Time;
    private String l1Mode;
    private Long l1InterviewerId;
    private String l1InterviewerStatus;
    private String l1Result;
    private LocalDate l2Date;
    private String l2Time;
    private String l2Mode;
    private Long l2InterviewerId;
    private String l2InterviewerStatus;
    private String l2Result;
    private LocalDate hrDate;
    private String hrTime;
    private String hrMode;
    private String hrInterviewerName;   
    private String hrResult;
    private String offerLetterFile;
    private String offerStatus;
    private String signedOfferLetter;


}
