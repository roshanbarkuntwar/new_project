/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class GraphLabelDetailModel {

    private List<GraphLabelData> graphLabelDataList = new ArrayList<GraphLabelData>();
    List<ArrayList> graphLabelData = new ArrayList<ArrayList>();
    List<ArrayList> tableDataValue = new ArrayList<ArrayList>();
    List<ArrayList> slabDataValue = new ArrayList<ArrayList>();
    List<String> series;
    List<String> columnWidth;
    List<String> columnAlignment;
    List<String> columnName;
    List<ArrayList<byte[]>> imageArray;
    String[] graphType;
    HashMap<String, Object> graphData = new HashMap<String, Object>();

    int noOfColumns;
    String graphDisplayFlag;

    public List<ArrayList> getSlabDataValue() {
        return slabDataValue;
    }

    public void setSlabDataValue(List<ArrayList> slabDataValue) {
        this.slabDataValue = slabDataValue;
    }

    public List<String> getColumnAlignment() {
        return columnAlignment;
    }

    public void setColumnAlignment(List<String> columnAlignment) {
        this.columnAlignment = columnAlignment;
    }

    public List<String> getColumnWidth() {
        return columnWidth;
    }

    public void setColumnWidth(List<String> columnWidth) {
        this.columnWidth = columnWidth;
    }

    public String getGraphDisplayFlag() {
        return graphDisplayFlag;
    }

    public void setGraphDisplayFlag(String graphDisplayFlag) {
        this.graphDisplayFlag = graphDisplayFlag;
    }

    public List<String> getColumnName() {
        return columnName;
    }

    public void setColumnName(List<String> columnName) {
        this.columnName = columnName;
    }

    public int getNoOfColumns() {
        return noOfColumns;
    }

    public void setNoOfColumns(int noOfColumns) {
        this.noOfColumns = noOfColumns;
    }

    public List<String> getSeries() {
        return series;
    }

    public void setSeries(List<String> series) {
        this.series = series;
    }

    public List<ArrayList> getGraphLabelData() {
        return graphLabelData;
    }

    public void setGraphLabelData(List<ArrayList> graphLabelData) {
        this.graphLabelData = graphLabelData;
    }
    public List<ArrayList<byte[]>> getImageArray() {
        return imageArray;
    }

    public void setImageArray(List<ArrayList<byte[]>> imageArray) {
        this.imageArray = imageArray;
    }

    public String[] getGraphType() {
        return graphType;
    }

    public void setGraphType(String[] graphType) {
        this.graphType = graphType;
    }

    public HashMap<String, Object> getGraphData() {
        return graphData;
    }

    public void setGraphData(HashMap<String, Object> graphData) {
        this.graphData = graphData;
    }

    public List<ArrayList> getTableDataValue() {
        return tableDataValue;
    }

    public void setTableDataValue(List<ArrayList> tableDataValue) {
        this.tableDataValue = tableDataValue;
    }

    public List<GraphLabelData> getGraphLabelDataList() {
        return graphLabelDataList;
    }

    public void setGraphLabelDataList(List<GraphLabelData> graphLabelDataList) {
        this.graphLabelDataList = graphLabelDataList;
    }
  

}
