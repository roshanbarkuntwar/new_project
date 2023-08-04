/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.ArrayList;

/**
 *
 * @author kirti.misal
 */
public class ParentChildItemListModel {
      ArrayList<DyanamicRecordsListModel> parent;
      ArrayList< ArrayList<DyanamicRecordsListModel>> child;

    public ArrayList<DyanamicRecordsListModel> getParent() {
        return parent;
    }

    public void setParent(ArrayList<DyanamicRecordsListModel> parent) {
        this.parent = parent;
    }

    public ArrayList<ArrayList<DyanamicRecordsListModel>> getChild() {
        return child;
    }

    public void setChild(ArrayList<ArrayList<DyanamicRecordsListModel>> child) {
        this.child = child;
    }
      
      
      
}
