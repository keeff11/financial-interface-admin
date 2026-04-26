package com.kkh.api_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ApiDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiDashboardApplication.class, args);
	}

}
