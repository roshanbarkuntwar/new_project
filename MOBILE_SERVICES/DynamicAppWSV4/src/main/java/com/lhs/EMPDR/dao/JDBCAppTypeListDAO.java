/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.AppTypeListJSON;
import com.lhs.EMPDR.Model.AppTypeListModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCAppTypeListDAO {

    Connection connection;

    public JDBCAppTypeListDAO(Connection c) {
        this.connection = c;
        U u = new U(this.connection);
    }

    public AppTypeListJSON AppTypeList(String userCode) {
        List<AppTypeListModel> list = new ArrayList<AppTypeListModel>();
        List<ValueClassModel> entityList = new ArrayList<ValueClassModel>();
        AppTypeListJSON result = new AppTypeListJSON();

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String sql = "select distinct module from LHSSYS_USER_APP_KEY_VALIDATION where user_code='" + userCode + "' AND FLAG = 'M' ";
        try {
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    AppTypeListModel model = new AppTypeListModel();
                    model.setApptype(resultSet.getString("module"));
                    list.add(model);

                } while (resultSet.next());
                result.setAppTypes(list);
            }else{
                System.out.println("APPTYPE LIST FETCHING SQL ERROR");
            }
        } catch (Exception e) {
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        String entityCodeSQL = "SELECT E.ENTITY_CODE, E.ENTITY_NAME FROM ENTITY_MAST E, USER_MAST U WHERE U.USER_CODE = '"
                + userCode + "' AND INSTR(U.ENTITY, E.ENTITY_CODE) <> 0";
        try {
            preparedStatement = connection.prepareStatement(entityCodeSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    ValueClassModel model = new ValueClassModel();
                    model.setCode(resultSet.getString("ENTITY_CODE"));
                    model.setValue(resultSet.getString("ENTITY_NAME"));
                    entityList.add(model);

                } while (resultSet.next());
                result.setEntityCodes(entityList);
            }else{
                System.out.println("ENTITY CODE LIST FETCHING SQL ERROR");
            }
        } catch (Exception e) {
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }
}
