/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.NotificationModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class NotificationJSON {

    List<NotificationModel> model;

    public List<NotificationModel> getModel() {
        return model;
    }

    public void setModel(List<NotificationModel> model) {
        this.model = model;
    }

}
