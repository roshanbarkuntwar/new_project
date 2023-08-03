/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class LoginModel {

    String userName;
    String user_code;
    String message;
    String module;
    String entity_code;
    String division;
    String acc_year;
    String dept_code;
    String acc_code;
    String acc_name;
    String dashboardLink;
    String notif_topic;
    String emp_code;
    String login_user_flag;
    String geo_org_code;
    String geo_org_name;
    String bill_entry_catg_preference;
    String user_level;
    String mobileNo;
    String location_track_interval;
    String location_track_flag;
    HashMap<String, String> OTP;

    public String getLogin_user_flag() {
        return login_user_flag;
    }

    public void setLogin_user_flag(String login_user_flag) {
        this.login_user_flag = login_user_flag;
    }

    public String getEmp_code() {
        return emp_code;
    }

    public void setEmp_code(String emp_code) {
        this.emp_code = emp_code;
    }

    public String getDashboardLink() {
        return dashboardLink;
    }

    public void setDashboardLink(String dashboardLink) {
        this.dashboardLink = dashboardLink;
    }

    public String getAcc_code() {
        return acc_code;
    }

    public void setAcc_code(String acc_code) {
        this.acc_code = acc_code;
    }

    public String getModule() {
        return module;
    }

    public String getEntity_code() {
        return entity_code;
    }

    public void setEntity_code(String entity_code) {
        this.entity_code = entity_code;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getAcc_year() {
        return acc_year;
    }

    public void setAcc_year(String acc_year) {
        this.acc_year = acc_year;
    }

    public String getDept_code() {
        return dept_code;
    }

    public void setDept_code(String dept_code) {
        this.dept_code = dept_code;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getAcc_name() {
        return acc_name;
    }

    public void setAcc_name(String acc_name) {
        this.acc_name = acc_name;
    }
//List<TableDetailModel> tableData;
//    public List<TableDetailModel> getTableData() {
//        return tableData;
//    }
//
//    public void setTableData(List<TableDetailModel> tableData) {
//        this.tableData = tableData;
//    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUser_code() {
        return user_code;
    }

    public void setUser_code(String user_code) {
        this.user_code = user_code;
    }

    public String getNotif_topic() {
        return notif_topic;
    }

    public void setNotif_topic(String notif_topic) {
        this.notif_topic = notif_topic;
    }

    public String getGeo_org_code() {
        return geo_org_code;
    }

    public void setGeo_org_code(String geo_org_code) {
        this.geo_org_code = geo_org_code;
    }

    public String getGeo_org_name() {
        return geo_org_name;
    }

    public void setGeo_org_name(String geo_org_name) {
        this.geo_org_name = geo_org_name;
    }

    public String getBill_entry_catg_preference() {
        return bill_entry_catg_preference;
    }

    public void setBill_entry_catg_preference(String bill_entry_catg_preference) {
        this.bill_entry_catg_preference = bill_entry_catg_preference;
    }

    public HashMap<String, String> getOTP() {
        return OTP;
    }

    public void setOTP(HashMap<String, String> OTP) {
        this.OTP = OTP;
    }

    public String getUser_level() {
        return user_level;
    }

    public void setUser_level(String user_level) {
        this.user_level = user_level;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getLocation_track_interval() {
        return location_track_interval;
    }

    public void setLocation_track_interval(String location_track_interval) {
        this.location_track_interval = location_track_interval;
    }

    public String getLocation_track_flag() {
        return location_track_flag;
    }

    public void setLocation_track_flag(String location_track_flag) {
        this.location_track_flag = location_track_flag;
    }
    
    
    

}
