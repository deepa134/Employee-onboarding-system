package com.onboard.onboarding.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String ctc;
    private String location;  
    private String pdfFileName;
    private String companyName;


    @Enumerated(EnumType.STRING)
    private InternshipStatus status = InternshipStatus.OPEN;
}
