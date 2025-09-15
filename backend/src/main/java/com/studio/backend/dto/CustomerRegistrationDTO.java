package com.studio.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CustomerRegistrationDTO {


    private String Cus_Name;
    private String Cus_Phone;
    private String email;
    private String Cus_Password;

}