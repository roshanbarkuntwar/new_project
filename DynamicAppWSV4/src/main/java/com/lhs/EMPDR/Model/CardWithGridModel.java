/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.sql.Array;
import java.util.ArrayList;

/**
 *
 * @author anjali.bhendarkar
 */
public class CardWithGridModel {

    String heading = "";
    ArrayList<String> month;
    ArrayList<String> qtr;
    ArrayList<String> year;

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public ArrayList<String> getMonth() {
        return month;
    }

    public void setMonth(ArrayList<String> month) {
        this.month = month;
    }

    public ArrayList<String> getQtr() {
        return qtr;
    }

    public void setQtr(ArrayList<String> qtr) {
        this.qtr = qtr;
    }

    public ArrayList<String> getYear() {
        return year;
    }

    public void setYear(ArrayList<String> year) {
        this.year = year;
    }
    
}
