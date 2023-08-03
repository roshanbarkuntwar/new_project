/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author kirti.misal
 */
public class HeadingValueOfTable {
    ArrayList <String> heading=new ArrayList<String>();
    ArrayList <ArrayList<String>> value=new ArrayList<ArrayList<String>>();
    private Map<String,String> totalValue=new HashMap<String,String>();
    String pageHeading;  
    
    public ArrayList<String> getHeading() {
        return heading;
    }

    public void setHeading(ArrayList<String> heading) {
        this.heading = heading;
    }

    public ArrayList<ArrayList<String>> getValue() {
        return value;
    }

    public void setValue(ArrayList<ArrayList<String>> value) {
        this.value = value;
    }

    public Map<String,String> getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Map<String,String> totalValue) {
        this.totalValue = totalValue;
    }

    public String getPageHeading() {
        return pageHeading;
    }

    public void setPageHeading(String pageHeading) {
        this.pageHeading = pageHeading;
    }
}
