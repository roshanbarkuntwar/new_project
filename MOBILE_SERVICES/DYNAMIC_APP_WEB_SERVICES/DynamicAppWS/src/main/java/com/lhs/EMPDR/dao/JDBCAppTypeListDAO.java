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
    }

    public AppTypeListJSON AppTypeList(String userCode, String entityCodeStr, String loginFlag) {
        List<AppTypeListModel> list = new ArrayList<AppTypeListModel>();
        List<ValueClassModel> entityList = new ArrayList<ValueClassModel>();
        AppTypeListJSON result = new AppTypeListJSON();

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
//        String sql = "select distinct module from LHSSYS_USER_APP_KEY_VALIDATION where user_code=(SELECT U.USER_CODE FROM USER_MAST U WHERE U.USER_CODE = '" + userCode+ "') AND FLAG = 'M' ";
        String sql = "";
        if (loginFlag != null && !loginFlag.isEmpty() && loginFlag.equalsIgnoreCase("V")) {
            sql = "select distinct L.module, T.TAB_CONTAINER from LHSSYS_USER_APP_KEY_VALIDATION L, LHSSYS_PORTAL_TAB_MAST T "
                    + "where substr(L.user_code,2) ='" + userCode + "'" + "AND T.TAB_ID = L.MODULE AND FLAG = 'M' ";
        } else {
            sql = "select distinct L.module, T.TAB_CONTAINER from LHSSYS_USER_APP_KEY_VALIDATION L, LHSSYS_PORTAL_TAB_MAST T "
                    + "where user_code ='" + userCode + "'" + "AND T.TAB_ID = L.MODULE AND FLAG = 'M' ";
        }
        try {
            System.out.println("sql--> " + sql);

            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    AppTypeListModel model = new AppTypeListModel();
                    model.setApptype(resultSet.getString("module"));
                    model.setAppVersion(resultSet.getString("TAB_CONTAINER"));
                    list.add(model);
                } while (resultSet.next());
                result.setAppTypes(list);
            } else {
                System.out.println("APPTYPE LIST FETCHING SQL ERROR");
            }
        } catch (Exception e) {
            System.out.println("exception ---> " + e.getMessage());
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }

        if (entityCodeStr == null || entityCodeStr.isEmpty()) {
            entityCodeStr = "";
        }
        String entityCodeSQL = "";
        if (loginFlag != null && !loginFlag.isEmpty() && loginFlag.equalsIgnoreCase("V")) {
            U.log("VIEW MODE");
            entityCodeSQL = "SELECT E.ENTITY_CODE, E.ENTITY_CODE || ' - ' || E.ENTITY_NAME ENTITY_NAME FROM ENTITY_MAST E, LHSSYS_PORTAL_USER_MAST U"
                    + " WHERE SUBSTR(U.portal_User_code, 2) = '" + userCode + "' AND INSTR(U.Entity_code, E.ENTITY_CODE) <> 0"
                    + " AND INSTR(NVL('" + entityCodeStr + "', E.ENTITY_CODE), E.ENTITY_CODE) <> 0 order by E.Entity_Name";
        } else {
            U.log("USER MAST MODE");
            entityCodeSQL = "SELECT E.ENTITY_CODE, E.ENTITY_CODE || ' - ' || E.ENTITY_NAME ENTITY_NAME "
                    + "  FROM ENTITY_MAST E, USER_MAST U WHERE U.USER_CODE = '" + userCode + "'   AND INSTR(U.ENTITY, E.ENTITY_CODE) <> 0"
                    + "   AND INSTR(NVL('" + entityCodeStr + "', E.ENTITY_CODE), E.ENTITY_CODE) <> 0 order by E.Entity_Name";
        }

        System.out.println("entityCodeSQL----> " + entityCodeSQL);

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

                if (entityList.size() > 1) {
                    ValueClassModel model = new ValueClassModel();
                    model.setCode("");
                    model.setValue("All Entity");
                    entityList.add(model);
                }
                result.setEntityCodes(entityList);
            } else {
                System.out.println("ENTITY CODE LIST FETCHING SQL ERROR");
            }
        } catch (Exception e) {
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return result;
    }

    public AppTypeListJSON divCodeList(String userCode, String entityCode) {
        List<ValueClassModel> divList = new ArrayList<ValueClassModel>();
        AppTypeListJSON result = new AppTypeListJSON();

        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        String divCodeSQL = "SELECT div_code, div_code ||' - '|| div_name div_name FROM DIV_MAST WHERE ENTITY_CODE='" + entityCode + "'";

        System.out.println("entityCodeSQL----> " + divCodeSQL);

        try {
            preparedStatement = connection.prepareStatement(divCodeSQL);
            resultSet = preparedStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    ValueClassModel model = new ValueClassModel();
                    model.setCode(resultSet.getString("DIV_CODE"));
                    model.setValue(resultSet.getString("DIV_NAME"));
                    divList.add(model);
                } while (resultSet.next());

//                if (divList.size() > 1) {
//                    ValueClassModel model = new ValueClassModel();
//                    model.setCode("");
//                    model.setValue("All Entity");
//                    divList.add(model);
//                }
                result.setDivCodes(divList);
            } else {
                System.out.println("DIV CODE LIST FETCHING SQL ERROR");
            }
        } catch (Exception e) {
        } finally {
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }
        return result;
    }
}
