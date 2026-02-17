package com.onboard.onboarding.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Onboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;
    private String aadhaar;
    private String pan;
    private String bankAccount;
    private String email;
    private String status; 
}
