package com.onboard.onboarding.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "candidates") 
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @Column(name = "role_applied")
    private String roleApplied;
    @OneToMany(mappedBy = "candidate")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Test> tests;


    
}
