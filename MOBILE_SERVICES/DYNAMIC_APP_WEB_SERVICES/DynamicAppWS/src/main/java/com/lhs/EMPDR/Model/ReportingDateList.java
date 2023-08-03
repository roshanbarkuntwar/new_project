/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

/**
 *
 * @author dhanshri.paradkar
 */
public class ReportingDateList {

//    String foo;
//    String date = "";
    String startTime = "";
    String endTime = "";
    String allDay = "";
    String title = "";
    String updateKey = "";
    String updateKeyValue = "";

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getAllDay() {
        return allDay;
    }

    public void setAllDay(String allDay) {
        this.allDay = allDay;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

//    public String getFoo() {
//        return foo;
//    }
//
//    public void setFoo(String foo) {
//        this.foo = foo;
//    }
//
//    public String getDate() {
//        return date;
//    }
//
//    public void setDate(String date) {
//        this.date = date;
//    }
    public String getUpdateKey() {
        return updateKey;
    }

    public void setUpdateKey(String updateKey) {
        this.updateKey = updateKey;
    }

    public String getUpdateKeyValue() {
        return updateKeyValue;
    }

    public void setUpdateKeyValue(String updateKeyValue) {
        this.updateKeyValue = updateKeyValue;
    }
}
