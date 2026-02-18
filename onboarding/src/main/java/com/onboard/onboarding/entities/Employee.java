package com.onboard.onboarding.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String name;
    private String email;
    private String contactNumber;

    private String department;
    private String designation;
    private String workLocation;
    private String workMode;
    private String employmentType;

    private String dateOfJoining;
    private String reportingTime;

    private String managerName;
    private String managerEmail;
    private String managerContact;

    private String accommodation;

    private String officialEmail;

    private String status;
}
