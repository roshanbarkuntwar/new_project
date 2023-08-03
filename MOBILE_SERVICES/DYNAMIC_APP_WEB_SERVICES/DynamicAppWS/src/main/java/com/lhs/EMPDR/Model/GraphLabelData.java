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
 * @author ranjeet.kumar
 */
public class GraphLabelData {
     private List<ArrayList> graphLabelData = new ArrayList<ArrayList>();
    private List<ArrayList> tableDataValue = new ArrayList<ArrayList>();
    private List<ArrayList> slabDataValue = new ArrayList<ArrayList>();

    public List<ArrayList> getGraphLabelData() {
        return graphLabelData;
    }

    public void setGraphLabelData(List<ArrayList> graphLabelData) {
        this.graphLabelData = graphLabelData;
    }

    public List<ArrayList> getTableDataValue() {
        return tableDataValue;
    }

    public void setTableDataValue(List<ArrayList> tableDataValue) {
        this.tableDataValue = tableDataValue;
    }

    public List<ArrayList> getSlabDataValue() {
        return slabDataValue;
    }

    public void setSlabDataValue(List<ArrayList> slabDataValue) {
        this.slabDataValue = slabDataValue;
    }
}
