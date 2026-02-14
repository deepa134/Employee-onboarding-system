package com.onboard.onboarding.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class FileConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String basePath = System.getProperty("user.dir") + File.separator;

        registry.addResourceHandler("/offers/**")
                .addResourceLocations("file:" + basePath + "offers" + File.separator);

        registry.addResourceHandler("/signed-offers/**")
                .addResourceLocations("file:" + basePath + "signed-offers" + File.separator);

        registry.addResourceHandler("/resumes/**")
                .addResourceLocations("file:" + basePath + "resumes" + File.separator);
    }
}
