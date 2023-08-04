/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ProjectListModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ProjectListJSON {

    List<ProjectListModel> Project_List;

    public List<ProjectListModel> getProject_List() {
        return Project_List;
    }

    public void setProject_List(List<ProjectListModel> Project_List) {
        this.Project_List = Project_List;
    }

}
