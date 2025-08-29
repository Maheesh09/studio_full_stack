package com.studio.backend.dto;

public class CustomerDTO {
    private int Cus_Id;
    private String Cus_Name;

    public CustomerDTO(){

    }

    public CustomerDTO(int Cus_Id, String Cus_Name){
        this.Cus_Id = Cus_Id;
        this.Cus_Name = Cus_Name;
    }

    public int getCus_Id() {
        return Cus_Id;
    }

    public void setCus_Id(int cus_Id) {
        Cus_Id = cus_Id;
    }

    public String getCus_Name() {
        return Cus_Name;
    }

    public void setCus_Name(String cus_Name) {
        Cus_Name = cus_Name;
    }
}