/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ActivityListModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ActivityListJSON {

    List<ActivityListModel> Activity_list;

    public List<ActivityListModel> getActivity_list() {
        return Activity_list;
    }

    public void setActivity_list(List<ActivityListModel> Activity_list) {
        this.Activity_list = Activity_list;
    }

}
