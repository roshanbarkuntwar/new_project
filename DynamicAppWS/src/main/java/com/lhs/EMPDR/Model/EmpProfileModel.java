/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.io.InputStream;

/**
 *
 * @author avitosh.rakshe
 */
public class EmpProfileModel {
    
    
   private String empName;
   private String depName;
   private String designName;
   private String DOB;
   private String join_Date;
   private String geoOrgName;
   private String from_Date;
   private String geoOrgCodeName;
   private String postingType;
   private Long mobile;
   private Integer phone;
   private String email;
   private String address;
   private Integer pin;
   private String city;
   private String stateName;
   private byte[] photo;
   

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName;
    }

    public String getDesignName() {
        return designName;
    }

    public void setDesignName(String designName) {
        this.designName = designName;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

  

    public String getJoin_Date() {
        return join_Date;
    }

    public void setJoin_Date(String join_Date) {
        this.join_Date = join_Date;
    }

    public String getGeoOrgName() {
        return geoOrgName;
    }

    public void setGeoOrgName(String geoOrgName) {
        this.geoOrgName = geoOrgName;
    }

    public String getGeoOrgCodeName() {
        return geoOrgCodeName;
    }

    public void setGeoOrgCodeName(String geoOrgCodeName) {
        this.geoOrgCodeName = geoOrgCodeName;
    }

    public String getPostingType() {
        return postingType;
    }

    public void setPostingType(String postingType) {
        this.postingType = postingType;
    }

    public Long getMobile() {
        return mobile;
    }

    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }

    public Integer getPhone() {
        return phone;
    }

    public void setPhone(Integer phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getPin() {
        return pin;
    }

    public void setPin(Integer pin) {
        this.pin = pin;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getFrom_Date() {
        return from_Date;
    }

    public void setFrom_Date(String from_Date) {
        this.from_Date = from_Date;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }
    
}
