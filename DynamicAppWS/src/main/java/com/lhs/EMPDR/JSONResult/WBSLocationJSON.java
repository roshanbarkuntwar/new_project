/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.Model.WBSGenericModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class WBSLocationJSON {
    //List<WBSGenericModel> locationList;

    List<GenericCodeNameModel> locationList;
    String lovHeading;
    String sqlData;
    String offlineLOVID;

    public String getOfflineLOVID() {
        return offlineLOVID;
    }

    public void setOfflineLOVID(String offlineLOVID) {
        this.offlineLOVID = offlineLOVID;
    }

    public String getLovHeading() {
        return lovHeading;
    }

    public void setLovHeading(String lovHeading) {
        this.lovHeading = lovHeading;
    }
    

    public List<GenericCodeNameModel> getLocationList() {
        return locationList;
    }

    public void setLocationList(List<GenericCodeNameModel> locationList) {
        this.locationList = locationList;
    }

    public String getSqlData() {
        return sqlData;
    }

    public void setSqlData(String sqlData) {
        this.sqlData = sqlData;
    }
}
