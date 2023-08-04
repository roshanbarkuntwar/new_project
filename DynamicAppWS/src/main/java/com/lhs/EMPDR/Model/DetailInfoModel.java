/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author premkumar.agrawal
 */
public class DetailInfoModel {
    
    HashMap<String, ArrayList<String>> defaultPopulateData;
    String Status;
    String Message;

    public HashMap<String, ArrayList<String>> getDefaultPopulateData() {
        return defaultPopulateData;
    }

    public void setDefaultPopulateData(HashMap<String, ArrayList<String>> defaultPopulateData) {
        this.defaultPopulateData = defaultPopulateData;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String Status) {
        this.Status = Status;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String Message) {
        this.Message = Message;
    }
    
}
