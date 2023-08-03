/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.DashboardModel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author kirti.misal
 */
public class DashboardResultJSON {

   

    List<DashboardModel> tab = new ArrayList<DashboardModel>();
    HashMap<String, Object> graphdata;
    private List<HashMap<String, Object>> hashMapList = new ArrayList<HashMap<String, Object>>();
    ArrayList<String> headingOfGraph=new ArrayList<String>();

    public ArrayList<String> getHeadingOfGraph() {
        return headingOfGraph;
    }

    public void setHeadingOfGraph(ArrayList<String> headingOfGraph) {
        this.headingOfGraph = headingOfGraph;
    }
    
    
    
     public List<HashMap<String, Object>> getHashMapList() {
        return hashMapList;
    }

    public void setHashMapList(List<HashMap<String, Object>> hashMapList) {
        this.hashMapList = hashMapList;
    }
    public List<DashboardModel> getTab() {
        return tab;
    }

    public void setTab(List<DashboardModel> tab) {
        this.tab = tab;
    }

    public HashMap<String, Object> getGraphdata() {
        return graphdata;
    }

    public void setGraphdata(HashMap<String, Object> graphdata) {
        this.graphdata = graphdata;
    }

}
