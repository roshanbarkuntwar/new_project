/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.GraphTabListModel;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class GraphTabListJSON {

    List<GraphTabListModel> tabList;

    public List<GraphTabListModel> getTabList() {
        return tabList;
    }

    public void setTabList(List<GraphTabListModel> tabList) {
        this.tabList = tabList;
    }

}
