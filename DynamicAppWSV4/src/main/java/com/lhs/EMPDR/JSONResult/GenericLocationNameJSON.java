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
public class GenericLocationNameJSON {

    List<GenericCodeNameModel> locations;

    public List<GenericCodeNameModel> getLocations() {
        return locations;
    }

    public void setLocations(List<GenericCodeNameModel> locations) {
        this.locations = locations;
    }

}
