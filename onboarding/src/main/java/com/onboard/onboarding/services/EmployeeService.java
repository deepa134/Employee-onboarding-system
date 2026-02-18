package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.Employee;
import com.onboard.onboarding.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository repo;
    private final JavaMailSender mailSender;

    // ✅ CREATE EMPLOYEE
    public Employee save(Employee emp) {

    // 🔥 check if employee already exists
    Employee existing = repo.findTopByEmailOrderByIdDesc(emp.getEmail());

    if (existing != null) {
        return existing;   // already created → do not create again
    }

    emp.setEmployeeId("EMP" + System.currentTimeMillis());
    emp.setStatus("ACTIVE");

    Employee savedEmployee = repo.save(emp);

    try {
        sendJoiningMail(savedEmployee);
    } catch (Exception e) {
        System.out.println("Mail not sent: " + e.getMessage());
    }

    return savedEmployee;
}


    // ✅ GET ALL EMPLOYEES (used in HR dashboard)
    public List<Employee> getAll() {
        return repo.findAll();
    }

    // ✅ GET EMPLOYEE BY EMAIL
    public Employee getByEmail(String email) {
        return repo.findTopByEmailOrderByIdDesc(email);
    }

    // ✅ SEND WELCOME MAIL
    private void sendJoiningMail(Employee emp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(emp.getEmail());
        message.setSubject("Welcome to the Company 🎉");

        message.setText(
                "Dear " + emp.getName() + ",\n\n" +

                "Congratulations! Your onboarding process is completed successfully.\n\n" +

                "Here are your joining details:\n\n" +

                "Employee ID : " + emp.getEmployeeId() + "\n" +
                "Date of Joining : " + emp.getDateOfJoining() + "\n" +
                "Reporting Time : " + emp.getReportingTime() + "\n" +
                "Work Location : " + emp.getWorkLocation() + "\n\n" +

                "Reporting Manager : " + emp.getManagerName() + "\n" +
                "Manager Email : " + emp.getManagerEmail() + "\n" +
                "Manager Contact : " + emp.getManagerContact() + "\n\n" +

                "Accommodation : " + emp.getAccommodation() + "\n\n" +

                "Please report on time and carry all required documents.\n\n" +

                "We are excited to have you on our team!\n\n" +

                "Best Regards,\nHR Team"
        );

        mailSender.send(message);
    }
}
