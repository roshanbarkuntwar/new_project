/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.List;

/**
 *
 * @author dhanshri.paradkar
 */
public class ListOfReportingSummaryModel {

    List<ReportingSummaryByDate> list;

    public List<ReportingSummaryByDate> getList() {
        return list;
    }

    public void setList(List<ReportingSummaryByDate> list) {
        this.list = list;
    }

}
