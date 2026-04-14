package com.localmart.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String dob;
    private String address;
}
