package com.onboard.onboarding.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tests")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Candidate candidate;


    @Enumerated(EnumType.STRING)
    private TestStatus testStatus = TestStatus.SCHEDULED;

    private int score = 0;
}
