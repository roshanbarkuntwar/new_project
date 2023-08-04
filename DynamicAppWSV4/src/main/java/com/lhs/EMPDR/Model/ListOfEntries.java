/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.Model;

import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class ListOfEntries {

    List<NewEntryModel> newEntryModel;

    public List<NewEntryModel> getListOfEntries() {
        return newEntryModel;
    }

    public void setListOfEntries(List<NewEntryModel> newEntryModel) {
        this.newEntryModel = newEntryModel;
    }

}
