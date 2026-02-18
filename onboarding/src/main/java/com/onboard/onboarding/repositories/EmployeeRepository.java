package com.onboard.onboarding.repositories;

import com.onboard.onboarding.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee  findTopByEmailOrderByIdDesc(String email);
}
