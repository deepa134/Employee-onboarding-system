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
import java.util.Map;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InternshipController {

    private final InternshipService internshipService;

  
   @PostMapping(value = "/upload-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Map<String, String>> uploadPdf(@RequestParam("file") MultipartFile file) {
    try {
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + File.separator + fileName;

        file.transferTo(new File(filePath));

        // ✅ Return JSON
        return ResponseEntity.ok(Map.of("filename", fileName));

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of("error", "PDF Upload Failed"));
    }
}


    @PostMapping("/post")
    public Internship postInternship(
            @RequestParam("companyName")String companyName,
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
        internship.setCompanyName(companyName); 

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
public ResponseEntity<Map<String, String>> deleteInternship(@PathVariable Long id) {
    internshipService.deleteInternship(id);
    return ResponseEntity.ok(Map.of("message", "Internship deleted successfully"));
}

    
}
