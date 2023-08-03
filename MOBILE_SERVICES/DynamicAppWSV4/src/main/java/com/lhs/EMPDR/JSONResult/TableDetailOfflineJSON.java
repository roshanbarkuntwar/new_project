/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.TableDetailForOfflineModel;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class TableDetailOfflineJSON {

    TableDetailForOfflineModel tableDetail = new TableDetailForOfflineModel();

    public TableDetailForOfflineModel getTableDetail() {
        return tableDetail;
    }

    public void setTableDetail(TableDetailForOfflineModel tableDetail) {
        this.tableDetail = tableDetail;
    }

}
