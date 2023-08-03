/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.GenericCodeNameModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class GenericActivityJSON {

    List<GenericCodeNameModel> activityList;

    public List<GenericCodeNameModel> getActivityList() {
        return activityList;
    }

    public void setActivityList(List<GenericCodeNameModel> activityList) {
        this.activityList = activityList;
    }

}
