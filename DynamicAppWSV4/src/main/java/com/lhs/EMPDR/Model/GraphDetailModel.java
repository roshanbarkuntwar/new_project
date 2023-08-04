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
public class GraphDetailModel {

    List<BatchFilemodel> graphTypeList;

    List<String> labels = new ArrayList<String>();
    List<String> series = new ArrayList<String>();
    List<String> color = new ArrayList<String>();
    List<ArrayList> graphdata = new ArrayList<ArrayList>();

    List<String> font = new ArrayList<String>();
//String batchFile;

//    public String getBatchFile() {
//        return batchFile;
//    }
//
//    public void setBatchFile(String batchFile) {
//        this.batchFile = batchFile;
//    }
    public List<BatchFilemodel> getGraphTypeList() {
        return graphTypeList;
    }

    public void setGraphTypeList(List<BatchFilemodel> graphTypeList) {
        this.graphTypeList = graphTypeList;
    }

    public List<ArrayList> getGraphdata() {
        return graphdata;
    }

    public void setGraphdata(List<ArrayList> graphdata) {
        this.graphdata = graphdata;
    }

    //String colour;
    //  String font;
    public void graphdata(ArrayList data) {
        graphdata.add(data);
    }

    public void addcolor(String clr) {
        color.add(clr);
    }

    public void addfont(String f) {
        font.add(f);
    }

    public List<String> getColor() {
        return color;
    }

    public void setColor(List<String> color) {
        this.color = color;
    }

    public List<String> getFont() {
        return font;
    }

    public void setFont(List<String> font) {
        this.font = font;
    }

//    public String getFont() {
//        return font;
//    }
//
//    public void setFont(String font) {
//        this.font = font;
//    }
    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<String> getSeries() {
        return series;
    }

    public void setSeries(List<String> series) {
        this.series = series;
    }

//    public String getColour() {
//        return colour;
//    }
//
//    public void setColour(String colour) {
//        this.colour = colour;
//    }
    public void addSeries(String s) {
        series.add(s);
    }

    public void addLabel(String l) {
        labels.add(l);
    }
//       public void addData(String d)
//    {
//        data.add(d);
//    }
}
