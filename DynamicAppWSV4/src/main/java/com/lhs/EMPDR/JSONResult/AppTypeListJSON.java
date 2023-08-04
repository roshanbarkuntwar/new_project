/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.AppTypeListModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class AppTypeListJSON {

    List<AppTypeListModel> appTypes;
    List<ValueClassModel> entityCodes;

    public List<ValueClassModel> getEntityCodes() {
        return entityCodes;
    }

    public void setEntityCodes(List<ValueClassModel> entityCodes) {
        this.entityCodes = entityCodes;
    }

    public List<AppTypeListModel> getAppTypes() {
        return appTypes;
    }

    public void setAppTypes(List<AppTypeListModel> appTypes) {
        this.appTypes = appTypes;
    }

}
