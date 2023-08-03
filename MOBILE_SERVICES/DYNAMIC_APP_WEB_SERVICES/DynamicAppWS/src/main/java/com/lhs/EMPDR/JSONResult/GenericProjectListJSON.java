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
public class GenericProjectListJSON {

    List<GenericCodeNameModel> projectList;

    public List<GenericCodeNameModel> getProjectList() {
        return projectList;
    }

    public void setProjectList(List<GenericCodeNameModel> projectList) {
        this.projectList = projectList;
    }

}
