/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.SubTabOfReportModel;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class SubTabListJSON {

    List<SubTabOfReportModel> subTab = new ArrayList<SubTabOfReportModel>();

    public List<SubTabOfReportModel> getSubTab() {
        return subTab;
    }

    public void setSubTab(List<SubTabOfReportModel> subTab) {
        this.subTab = subTab;
    }

}
