package com.onboard.onboarding.services;

import com.onboard.onboarding.entities.Internship;
import com.onboard.onboarding.entities.InternshipStatus;
import com.onboard.onboarding.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InternshipService {

    private final InternshipRepository internshipRepo;

    public Internship postInternship(Internship internship) {
        return internshipRepo.save(internship);
    }

    public List<Internship> getAllInternships() {
        return internshipRepo.findAll();
    }

    public Internship getInternship(Long id) {
        return internshipRepo.findById(id).orElseThrow(() -> new RuntimeException("Internship not found"));
    }

    public Internship closeInternship(Long id) {
        Internship internship = getInternship(id);
        internship.setStatus(InternshipStatus.CLOSED);
        return internshipRepo.save(internship);
    }
    public void deleteInternship(Long id) {
    internshipRepo.deleteById(id);
}

}
