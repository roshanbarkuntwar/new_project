/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ListOfDependentRowValueModel {
    
    List<DependentRowResponseModel> listDependentValue = new ArrayList<DependentRowResponseModel>();
    String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<DependentRowResponseModel> getListDependentValue() {
        return listDependentValue;
    }

    public void setListDependentValue(List<DependentRowResponseModel> listDependentValue) {
        this.listDependentValue = listDependentValue;
    }
}
