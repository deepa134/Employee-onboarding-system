package com.onboard.onboarding.controllers;

import com.onboard.onboarding.entities.Internship;
import com.onboard.onboarding.services.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InternshipController {

    private final InternshipService internshipService;

  
    @PostMapping(value = "/upload-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file) {

        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

           
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + File.separator + fileName;

            file.transferTo(new File(filePath));

            return ResponseEntity.ok(fileName);  

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("PDF Upload Failed");
        }
    }

   
    @PostMapping("/post")
    public Internship postInternship(
            @RequestParam("title") String title,
            @RequestParam("location") String location,
            @RequestParam("ctc") String ctc,
            @RequestParam("description") String description,
            @RequestParam("pdfFileName") String pdfFileName) {

        Internship internship = new Internship();
        internship.setTitle(title);
        internship.setLocation(location);
        internship.setCtc(ctc);
        internship.setDescription(description);
        internship.setPdfFileName(pdfFileName);

        return internshipService.postInternship(internship);
    }

   
    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

  
    @PutMapping("/{id}/close")
    public Internship closeInternship(@PathVariable Long id) {
        return internshipService.closeInternship(id);
    }

   
    @DeleteMapping("/{id}")
    public String deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return "Internship deleted successfully";
    }
}
