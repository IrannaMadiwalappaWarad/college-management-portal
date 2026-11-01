package com.college.portal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String usn;
    private String name;
    private String email;
    private String department;
    private int semester;
    private String section;
    private String phone;
}
