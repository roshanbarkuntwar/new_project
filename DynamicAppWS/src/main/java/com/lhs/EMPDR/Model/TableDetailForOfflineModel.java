/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDetailForOfflineModel {

    List<ArrayList> tableRows = new ArrayList<ArrayList>();
    List<String> tableHeading;

    public List<ArrayList> getTableRows() {
        return tableRows;
    }

    public void setTableRows(List<ArrayList> tableRows) {
        this.tableRows = tableRows;
    }

    public List<String> getTableHeading() {
        return tableHeading;
    }

    public void setTableHeading(List<String> tableHeading) {
        this.tableHeading = tableHeading;
    }

}
