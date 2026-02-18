package com.onboard.onboarding.controllers;

import com.onboard.onboarding.entities.Employee;
import com.onboard.onboarding.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service;

    @PostMapping
    public Employee create(@RequestBody Employee emp) {
        return service.save(emp);
    }

    @GetMapping("/{email}")
    public Employee getByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }

    
    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }
    @GetMapping("/candidate")
public Employee getByEmailParam(@RequestParam String email) {
    return service.getByEmail(email);
}

}
