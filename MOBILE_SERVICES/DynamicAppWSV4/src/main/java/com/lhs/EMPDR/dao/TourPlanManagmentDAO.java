/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author anjali.bhendarkar
 */
public class TourPlanManagmentDAO {

    Connection con;
    String USERCODE = "";

    public TourPlanManagmentDAO(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public HashMap<String, Object> getTaskTabs(String userCode, String seqNo, String filterParam) {

        HashMap<String, Object> mainObj = new HashMap<String, Object>();
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        String empCode = "";
        String userEmpCode = "";

        String empCodeSql = "SELECT U.EMP_CODE FROM USER_MAST U WHERE U.USER_CODE = '" + userCode + "'";

        try {
//            U.log("empDetails sql--> " + empCodeSql);
            ps = con.prepareStatement(empCodeSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                userEmpCode = resultSet.getString("emp_code");
            }
        } catch (Exception e) {
            U.errorLog("exeception ---> " + e.getMessage());
        }

        ArrayList<HashMap<String, Object>> taskTabList = new ArrayList<HashMap<String, Object>>();

        String sql = "SELECT * FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE U  where u.seq_no='" + seqNo + "' ";
        String taskSql = null;
        String where_clause = null;
        try {
            ps = con.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                taskSql = resultSet.getString("pl_sql_text");
                where_clause = resultSet.getString("where_clause");
            }
        } catch (Exception ex) {
            Logger.getLogger(TourPlanManagmentDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

//        U.log("taskSql@@@ ---> " + taskSql);
//        U.log("where_clause ---> " + where_clause);
        if (taskSql != null && !taskSql.isEmpty()) {

            try {
                if (filterParam != null && !filterParam.isEmpty() && filterParam.length() > 3) {
//                    U.log("Filter Param -----------> " + filterParam);
                    JSONParser json_parser = new JSONParser();
                    JSONObject filterJson = (JSONObject) json_parser.parse(filterParam);
                    Set<Object> set = filterJson.keySet();
                    Iterator<Object> iterator = set.iterator();
                    while (iterator.hasNext()) {
                        Object key = iterator.next();
//                    String replaceStr = filterJson.get(key).toString();
                        if (filterJson.get(key) != null && !filterJson.get(key).toString().isEmpty()) {
                            taskSql = taskSql.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                            where_clause = where_clause.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                        } else {
                            taskSql = taskSql.replaceAll("'" + key + "'", "NULL");
                            where_clause = where_clause.replaceAll("'" + key + "'", "NULL");
                        }

                    }

                    if (filterJson.get("EMP_CODE") != null && !filterJson.get("EMP_CODE").toString().isEmpty()) {
                        empCode = filterJson.get("EMP_CODE").toString();
                    }
                } else {
//                    U.log("Filter Param NOT PRESESNT-----------> ");

                    taskSql = taskSql.replaceAll("'EMP_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'FROM_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TO_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TASK_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'GEO_ORG_CODE'", "NULL");
//                    taskSql = taskSql.replaceAll("'USERCODE'", "NULL");
                    where_clause = where_clause.replaceAll("'EMP_CODE'", "NULL");
                    where_clause = where_clause.replaceAll("'FROM_DATE'", "NULL");
                    where_clause = where_clause.replaceAll("'TASK_CODE'", "NULL");
                    where_clause = where_clause.replaceAll("'TO_DATE'", "NULL");
                    where_clause = where_clause.replaceAll("'GEO_ORG_CODE'", "NULL");
//                    where_clause = where_clause.replaceAll("'USERCODE'", "NULL");
                }
            } catch (Exception e) {
            }
            try {

                taskSql = taskSql.replaceAll("'USERCODE'", "'" + userCode + "'");
                taskSql = taskSql.replaceAll("'EMPCODE'", "'" + userEmpCode + "'");
                try {
                    where_clause = where_clause.replaceAll("'EMPCODE'", "'" + userEmpCode + "'");
                    where_clause = where_clause.replaceAll("'USERCODE'", "'" + userCode + "'");
                } catch (Exception e) {
                }
                taskSql = taskSql.replaceAll("WHERECLAUSE", where_clause);
                U.log("taskSql After repalceing value ---> " + taskSql);
                ps = con.prepareStatement(taskSql);
                resultSet = ps.executeQuery();

                if (resultSet != null && resultSet.next()) {
                    do {
                        HashMap<String, Object> taskTab = new HashMap<String, Object>();
                        taskTab.put("seq_id", resultSet.getString("seq_id"));
                        taskTab.put("alert_desc", resultSet.getString("ALERT_DESC"));
                        taskTab.put("count_high", resultSet.getString("count_high"));
                        taskTab.put("count_mid", resultSet.getString("count_mid"));
                        taskTab.put("count_low", resultSet.getString("count_low"));
                        taskTab.put("count_all", resultSet.getString("count_all"));
                        try {
                            InputStream imgstream = resultSet.getBlob("icon_image").getBinaryStream();
                            taskTab.put("icon_image", Util.getImgstreamToBytes(imgstream));
                        } catch (Exception ex) {
                            taskTab.put("icon_image", "");
                        }
                        taskTabList.add(taskTab);
                    } while (resultSet.next());
                }
            } catch (Exception ex) {
                U.errorLog("exeception ---> " + ex.getMessage());
            }
        }
        String empSql = "";
        String empPhotoSql = "";
        if (empCode != null && !empCode.isEmpty()) {
            empSql = "SELECT E.EMP_NAME, (SELECT USER_CODE FROM USER_MAST WHERE EMP_CODE = '" + empCode + "') USER_CODE,"
                    + "NVL((SELECT D.DESIG_NAME FROM EMP_DESIG_MAST D WHERE D.DESIG_CODE = E.DESIG_CODE),'') DESIG_NAME "
                    + "FROM EMP_MAST E WHERE E.EMP_CODE = '" + empCode + "'";

            empPhotoSql = "select p.photo FROM EMP_PHOTO_MAST P WHERE p.EMP_CODE ='" + empCode + "'";
        } else {

            empSql = "SELECT E.EMP_NAME, (SELECT USER_CODE FROM USER_MAST WHERE EMP_CODE = '" + userEmpCode + "') USER_CODE,"
                    + "NVL((SELECT D.DESIG_NAME FROM EMP_DESIG_MAST D WHERE D.DESIG_CODE = E.DESIG_CODE),'') DESIG_NAME "
                    + "FROM EMP_MAST E WHERE E.EMP_CODE = '" + userEmpCode + "'";

            empPhotoSql = "select p.photo FROM EMP_PHOTO_MAST P WHERE p.EMP_CODE ='" + userEmpCode + "'";
        }

        HashMap<String, Object> empDetails = new HashMap<String, Object>();
        try {
            U.log("empDetails sql--> " + empSql);
            ps = con.prepareStatement(empSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                empDetails.put("emp_name", resultSet.getString("emp_name"));
                empDetails.put("user_code", resultSet.getString("user_code"));
                empDetails.put("desig_name", resultSet.getString("desig_name"));
                mainObj.put("empDetails", empDetails);
            }
        } catch (Exception ex) {
            mainObj.put("empDetails", "");
            U.errorLog("exeception ---> " + ex.getMessage());
        }

        try {
            U.log("empPhotoSql sql--> " + empPhotoSql);
            ps = con.prepareStatement(empPhotoSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                try {
                    InputStream imgstream = resultSet.getBinaryStream("photo");
                    empDetails.put("photo", Util.getImgstreamToBytes(imgstream));
                } catch (Exception e) {
                    U.errorLog(e.getMessage());
                    U.errorLog(e.getCause());
                    empDetails.put("photo", "");
                }
            } else {
                empDetails.put("photo", "");
            }
        } catch (Exception ex) {
            mainObj.put("empDetails", "");
            U.errorLog(ex.getMessage());
            U.errorLog(ex.getCause());
        }

        mainObj.put("empDetails", empDetails);
        mainObj.put("taskTabs", taskTabList);

        return mainObj;
    }

    public ArrayList<HashMap<String, Object>> getTaskList(String userCode, String seqId, String taskPriority, String filterParam) {
        ArrayList<HashMap<String, Object>> taskList = new ArrayList<HashMap<String, Object>>();
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        String empCode = "";

        String sql = "select * from lhssys_alert_direct_email e where e.seq_id='" + seqId + "'";
        String taskSql = null;
        String taskSqlWhereClause = null;

        String empSql = "SELECT E.EMP_CODE FROM EMP_MAST E WHERE E.EMP_CODE = (SELECT U.EMP_CODE FROM USER_MAST U WHERE U.USER_CODE = '" + userCode + "')";

        try {
//            U.log("empDetails sql--> " + empSql);
            ps = con.prepareStatement(empSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                empCode = resultSet.getString("emp_code");
            }
        } catch (Exception ex) {
            U.errorLog("exeception ---> " + ex.getMessage());
        }

        try {
//            U.log("getTaskList query--> " + sql);
            ps = con.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                taskSql = resultSet.getString("sql_text");
                taskSqlWhereClause = resultSet.getString("PL_SQL_TEXT");
            }
        } catch (Exception ex) {
            Logger.getLogger(TourPlanManagmentDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        if (taskSql != null && !taskSql.isEmpty()) {

            try {
                if (filterParam != null && !filterParam.isEmpty() && filterParam.length() > 3) {
//                    U.log("Filter Param -----------> " + filterParam);
                    JSONParser json_parser = new JSONParser();
                    JSONObject filterJson = (JSONObject) json_parser.parse(filterParam);
                    Set<Object> set = filterJson.keySet();
                    Iterator<Object> iterator = set.iterator();
                    while (iterator.hasNext()) {
                        Object key = iterator.next();
//                    String replaceStr = filterJson.get(key).toString();
                        if (filterJson.get(key) != null && !filterJson.get(key).toString().isEmpty()) {
                            taskSql = taskSql.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                            if (taskSqlWhereClause != null && !taskSqlWhereClause.isEmpty()) {
                                taskSqlWhereClause = taskSqlWhereClause.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                            }
                        } else {
                            taskSql = taskSql.replaceAll("'" + key + "'", "NULL");
                            if (taskSqlWhereClause != null && !taskSqlWhereClause.isEmpty()) {
                                taskSqlWhereClause = taskSqlWhereClause.replaceAll("'" + key + "'", "NULL");
                            }
                        }
                    }
                } else {
//                    U.log("Filter Param NOT PRESESNT-----------> ");
                    taskSql = taskSql.replaceAll("'EMP_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'FROM_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TO_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TASK_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'GEO_ORG_CODE'", "NULL");
                    if (taskSqlWhereClause != null && !taskSqlWhereClause.isEmpty()) {
                        taskSqlWhereClause = taskSqlWhereClause.replaceAll("'EMP_CODE'", "NULL");
                        taskSqlWhereClause = taskSqlWhereClause.replaceAll("'FROM_DATE'", "NULL");
                        taskSqlWhereClause = taskSqlWhereClause.replaceAll("'TO_DATE'", "NULL");
                        taskSqlWhereClause = taskSqlWhereClause.replaceAll("'TASK_CODE'", "NULL");
                        taskSqlWhereClause = taskSqlWhereClause.replaceAll("'GEO_ORG_CODE'", "NULL");
                    }
                }
            } catch (Exception e) {
            }

            try {
                if (taskPriority.equalsIgnoreCase("A")) {
                    taskPriority = "H', 'M', 'L";
                }
                taskSql = taskSql.replaceAll("'USERCODE'", "'" + userCode + "'");
                taskSql = taskSql.replaceAll("'EMPCODE'", "'" + empCode + "'");
                taskSql = taskSql.replaceAll("'TASK_PRIORITY'", "'" + taskPriority + "'");
                if (taskSqlWhereClause != null && !taskSqlWhereClause.isEmpty()) {
                    taskSqlWhereClause = taskSqlWhereClause.replaceAll("'USERCODE'", "'" + userCode + "'");
                    taskSqlWhereClause = taskSqlWhereClause.replaceAll("'EMPCODE'", "'" + empCode + "'");
                    taskSqlWhereClause = taskSqlWhereClause.replaceAll("'TASK_PRIORITY'", "'" + taskPriority + "'");
                    taskSql = taskSql.replaceAll("WHERECLAUSE", taskSqlWhereClause);
                }

                U.log("getTaskList query--> " + taskSql);
                ps = con.prepareStatement(taskSql);
                resultSet = ps.executeQuery();

                if (resultSet != null && resultSet.next()) {
                    do {
                        HashMap<String, Object> task = new HashMap<String, Object>();
                        task.put("slno", resultSet.getString("slno"));
                        task.put("assignor_emp_code", resultSet.getString("assignor_emp_code"));
                        task.put("assignor_emp_name", resultSet.getString("assignor_emp_name"));
                        task.put("emp_code", resultSet.getString("emp_code"));
                        task.put("emp_name", resultSet.getString("emp_name"));
                        task.put("task_code", resultSet.getString("task_code"));
                        task.put("task_name", resultSet.getString("task_name"));
                        task.put("task_index", resultSet.getString("task_index"));
                        task.put("start_date", resultSet.getString("start_date"));
                        task.put("duedate", resultSet.getString("duedate"));
                        task.put("remark", resultSet.getString("remark"));
                        task.put("task_seq_no", resultSet.getString("task_seq_no"));
                        if (resultSet.getString("task_status") != null && !resultSet.getString("task_status").isEmpty()) {
                            task.put("task_status", resultSet.getString("task_status"));
                        } else {
                            task.put("task_status", "P");
                        }
                        try {
                            task.put("running_status", resultSet.getString("task_running_status"));
                        } catch (Exception e) {
                            task.put("running_status", "");
                            U.errorLog("ERROR--> " + e.getMessage());
                        }

                        try {
                            task.put("task_action_type", resultSet.getString("task_action_type"));
                        } catch (Exception e) {
                            task.put("task_action_type", "");
                            U.errorLog("ERROR--> " + e.getMessage());
                        }
                        ArrayList<  HashMap<String, String>> taskStatusDetailsList = new ArrayList< HashMap<String, String>>();
                        try {
                            HashMap<String, String> taskStatusDetails = new HashMap<String, String>();
                            if (task.get("task_status").equals("R")) {
                                taskStatusDetails.put("status_count", resultSet.getString("status_count"));
                                taskStatusDetails.put("task_slno", resultSet.getString("task_slno"));
                                taskStatusDetails.put("action_date", resultSet.getString("action_date"));
                                taskStatusDetails.put("task_status_name", resultSet.getString("task_status_name"));
                                taskStatusDetails.put("status_remark", resultSet.getString("status_remark"));
                                taskStatusDetails.put("reviewer_remark", resultSet.getString("REVIEW_REMARK"));
                                taskStatusDetailsList.add(taskStatusDetails);
                                task.put("taskStatusDetails", taskStatusDetailsList);
                            } else {
                                task.put("taskStatusDetails", "");
                            }
                        } catch (Exception e) {
                            task.put("taskStatusDetails", "");
                            U.errorLog("exeception ---> " + e.getMessage());
                        }

                        taskList.add(task);
                    } while (resultSet.next());
                }
            } catch (Exception ex) {
                U.errorLog("exeception ---> " + ex.getMessage());
            }

        }

        return taskList;
    }

    public HashMap<String, String> updateTaskStatus(String userCode, String taskSeqNo,
            String taskStatus, String remark, String taskPersent, String taskCode) {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateTaskStatusSql = "";
        if (taskStatus != null && !taskStatus.isEmpty()) {
            if (taskStatus.equalsIgnoreCase("R")) {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate "
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                updateTaskActionTran(userCode, taskSeqNo, remark, taskPersent, taskCode);
            } else if (taskStatus.equalsIgnoreCase("A")) {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate "
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                updateTaskActionTran(userCode, taskSeqNo, remark, taskPersent, taskCode);
            } else if (taskStatus.equalsIgnoreCase("X")) {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate ,"
                        + " CANCELLEDBY='" + userCode + "' ,"
                        + " CANCELLED_REMARK='" + remark + "' ,"
                        + " CANCELLEDDATE=sysdate"
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                updateTaskActionTran(userCode, taskSeqNo, remark, taskStatus, taskCode);
            } else {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate ,"
                        + " COMPLETEBY='" + userCode + "' ,"
                        + " COMPLETE_RAMARK='" + remark + "' ,"
                        + " COMPLETEDATE=sysdate"
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                updateTaskActionTran(userCode, taskSeqNo, remark, taskStatus, taskCode);
            }

            PreparedStatement ps;
            try {
                U.log("update TASK_TRAN sql --> " + updateTaskStatusSql);
                ps = con.prepareStatement(updateTaskStatusSql);
                int i = ps.executeUpdate();
                U.log("rows updated:--> " + i);
                if (i > 0) {
                    res.put("updateStatus", "success");
                    res.put("msg", " Task Status updated successfully");
                } else {
                    res.put("updateStatus", "success");
                    res.put("msg", " Task Status updated successfully");
                }
            } catch (Exception ex) {
                res.put("updateStatus", "error");
                res.put("msg", " Task Status Not updated ");
                U.errorLog("exeception ---> " + ex.getMessage());
            }
        }

        return res;
    }

    private void updateTaskActionTran(String userCode, String taskSeqNo, String remark, String taskPersent, String taskCode) {
        String insertSql = "insert into task_action_tran"
                + "             (task_seq_no,"
                + "             task_code,"
                + "             task_slno,"
                + "             action_date,"
                + "             action_by,"
                + "             remark,"
                + "             task_status,"
                + "             lastupdate)"
                + "         values"
                + "             ('" + taskSeqNo + "',"
                + "             '" + taskCode + "',"
                + "             (select (nvl(max(task_slno), 0) + 1) from task_action_tran where task_code = '" + taskCode + "' and task_seq_no = '" + taskSeqNo + "'),"
                + "             sysdate,"
                + "             '" + userCode + "',"
                + "             '" + remark + "',"
                + "             '" + taskPersent + "',"
                + "             sysdate)";

        PreparedStatement ps;
        try {
            U.log("TaskActionTran insertSql--> " + insertSql);
            ps = con.prepareStatement(insertSql);
            int i = ps.executeUpdate();
            U.log("rows updated: " + i);

        } catch (Exception ex) {

            U.errorLog("exeception ---> " + ex.getMessage());
        }
    }

    public HashMap<String, Object> getVLCDashbordData(String userCode) {
        HashMap<String, Object> vlcData = new HashMap<String, Object>();
        ArrayList< HashMap<String, String>> observationCatgList = new ArrayList< HashMap<String, String>>();
        String sql = "select * from view_observation_catgory  order by slno";

        PreparedStatement ps;
        try {
            ps = con.prepareStatement(sql);

            ResultSet resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> observationCatg = new HashMap<String, String>();
                    observationCatg.put("obsvr_name", resultSet.getString("obsvr_name"));
                    observationCatg.put("obsvr_code", resultSet.getString("obsvr_code"));
                    observationCatg.put("slno", resultSet.getString("slno"));
                    observationCatg.put("non_productive_visit_flag ", resultSet.getString("non_productive_visit_flag"));
                    observationCatgList.add(observationCatg);
                } while (resultSet.next());
            }
        } catch (Exception ex) {
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        vlcData.put("observation_catgory", observationCatgList);
        return vlcData;
    }

    public HashMap<String, Object> getStaffDashbordData(String userCode, String entityCode, String emp_code, String fromDate, String toDate) {
        HashMap<String, Object> staffDashbordData = new HashMap<String, Object>();

        PreparedStatement ps;
        ResultSet resultSet;
        HashMap<String, Object> empDetails = new HashMap<String, Object>();
        HashMap<String, Object> graphData = new HashMap<String, Object>();
        ArrayList<HashMap<String, String>> todaysTaskList = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, String>> targetList = new ArrayList<HashMap<String, String>>();
        ArrayList<ArrayList<String>> data = new ArrayList<ArrayList<String>>();
        ArrayList<String> series = new ArrayList<String>();
        ArrayList<String> labes = new ArrayList<String>();
        String emp_code_Sql = "select EMP_CODE from user_mast where user_code='" + userCode + "'";
//        String emp_code = "";
        String acc_year = "";

        if (emp_code != null && !emp_code.isEmpty()) {
//            emp_code=empCode
        } else {
            try {
                ps = con.prepareStatement(emp_code_Sql);
                resultSet = ps.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    emp_code = resultSet.getString("EMP_CODE");
                }
            } catch (Exception ex) {
                U.errorLog("exeception ---> " + ex.getMessage());
            }
        }

        String getAccYearSQL = "SELECT A.ACC_YEAR FROM ACC_YEAR_MAST A  WHERE "
                + "to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') )"
                + "between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC ";
        U.log("getAccYearSQL : " + getAccYearSQL);

        try {
            ps = con.prepareStatement(getAccYearSQL);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                acc_year = resultSet.getString(1);
            }
        } catch (Exception e) {
        }

//        String empSql = "SELECT E.EMP_NAME,P.PHOTO,"
//                + "  NVL((SELECT D.DESIG_NAME FROM EMP_DESIG_MAST D WHERE D.DESIG_CODE = E.DESIG_CODE),'') DESIG_NAME"
//                + "  FROM EMP_MAST E, EMP_PHOTO_MAST P"
//                + "  WHERE E.EMP_CODE = '" + emp_code + "'"
//                + "  and E.EMP_CODE = p.EMP_CODE";
        String empSql = "SELECT E.EMP_NAME, (SELECT USER_CODE FROM USER_MAST WHERE EMP_CODE = '" + emp_code + "') USER_CODE,"
                + "NVL((SELECT D.DESIG_NAME FROM EMP_DESIG_MAST D WHERE D.DESIG_CODE = (select s.desig_code from view_emp_status_mast s where emp_code='" + emp_code + "')),'') DESIG_NAME "
                + "FROM EMP_MAST E WHERE E.EMP_CODE = '" + emp_code + "'";

        String empPhotoSql = "select p.photo FROM EMP_PHOTO_MAST P WHERE p.EMP_CODE ='" + emp_code + "'";

        try {
            U.log("empDetails sql--> " + empSql);
            ps = con.prepareStatement(empSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                empDetails.put("emp_name", resultSet.getString("emp_name"));
                empDetails.put("desig_name", resultSet.getString("desig_name"));
                empDetails.put("user_code", resultSet.getString("user_code"));
            }
        } catch (Exception ex) {
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        try {
            InputStream imgstream;
            ps = con.prepareStatement(empPhotoSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                imgstream = resultSet.getBinaryStream("photo");
                empDetails.put("photo", Util.getImgstreamToBytes(imgstream));
            } else {
                empDetails.put("photo", "");
            }
        } catch (Exception e) {
            U.errorLog("exeception ---> " + e.getMessage());
            empDetails.put("photo", "");
        }

//        String targetSql = "SELECT * "
//                + "  FROM (SELECT '23568' TARGET, '4587' VALUE FROM DUAL "
//                + "        UNION ALL "
//                + "        SELECT '65384' TARGET, '1457' VALUE FROM DUAL "
//                + "        UNION ALL "
//                + "        SELECT '874532' TARGET, '5641' VALUE FROM DUAL)";
//Get_emp_mis_kpi(a_emp_code varchar2, a_from_date date, a_to_date date) 
        String targetSql = "select  Get_emp_mis_kpi('" + emp_code + "', '" + fromDate + "', '" + toDate + "')  from dual";

        try {
            U.log("targetSql--> " + targetSql);
            ps = con.prepareStatement(targetSql);
            resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                String targetString = resultSet.getString(1); //vst#250~231|sal#2485000~220700|inv#1923700~561300

                if (targetString != null && !targetString.isEmpty()) {
                    String[] targetArr = targetString.split("\\|");
                    U.log("targetString" + targetString);
                    for (int i = 0; i < targetArr.length; i++) {
                        HashMap<String, String> target = new HashMap<String, String>();
                        target.put("target", targetArr[i].split("#")[1].split("~")[0]);
                        target.put("value", targetArr[i].split("#")[1].split("~")[1]);
                        targetList.add(target);
                    }
                } else {
                    HashMap<String, String> target = new HashMap<String, String>();
                    target.put("target", "--");
                    target.put("value", "--");
                    targetList.add(target);

                    target.put("target", "--");
                    target.put("value", "--");
                    targetList.add(target);

                    target.put("target", "--");
                    target.put("value", "--");
                    targetList.add(target);
                }

            }

        } catch (Exception ex) {
            U.errorLog("exeception targetSql ---> " + ex.getMessage());
            ex.printStackTrace();
        }

        String todaysTaskSql = "select slno,assignor_emp_code, assignor_emp_name,"
                + "       emp_code,emp_name,task_code,task_name, task_index, start_date,"
                + "       duedate,remark,task_seq_no,NVL(task_status,'P') task_status,task_running_status, task_action_type"
                + "  from (select z.assignor_emp_code,(select e.user_name from user_mast e where z.assignor_emp_code = e.emp_code) assignor_emp_name,z.emp_code,"
                + "               (select e1.emp_name from emp_mast e1 where z.emp_code = e1.emp_code) emp_name,"
                + "               z.task_code,(select t.task_name from task_mast t  where z.task_code = t.task_code) task_name,"
                + "               DECODE(z.task_index, 'H', 'High', 'M', 'Medium', 'L', 'Low') task_index,"
                + "               to_char(z.start_date, 'dd-mm-rrrr') start_date,to_char(z.duedate, 'dd-mm-rrrr') duedate,"
                + "               z.remark, z.task_seq_no,z.task_status,"
                + "               (select t.task_action_type from task_mast t where z.task_code = t.task_code) task_action_type, rownum slno,"
                + "               (select a.task_status from task_action_tran a where a.task_seq_no = z.task_seq_no and a.task_code = z.task_code and a.task_slno ="
                + "               (select max(a1.task_slno) from task_action_tran a1 where a1.task_seq_no = a.task_seq_no and a1.task_code = a.task_code)) task_running_status"
                + "          from task_tran z"
                + "         WHERE to_date(sysdate, 'dd-mm-yyyy') BETWEEN"
                + "               TO_DATE(Z.Start_Date, 'dd-mm-yyyy') AND"
                + "               TO_DATE(Z.DUEDATE, 'dd-mm-yyyy')"
                + "           AND Z.EMP_CODE = '" + emp_code + "'"
                + "           AND Z.TASK_INDEX in ('H', 'M', 'L'))";

        try {

            U.log("todaysTaskSql--> " + todaysTaskSql);
            ps = con.prepareStatement(todaysTaskSql);
            resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> todaysTask = new HashMap<String, String>();
                    todaysTask.put("slno", resultSet.getString("slno"));
                    todaysTask.put("assignor_emp_code", resultSet.getString("assignor_emp_code"));
                    todaysTask.put("assignor_emp_name", resultSet.getString("assignor_emp_name"));
                    todaysTask.put("emp_code", resultSet.getString("emp_code"));
                    todaysTask.put("emp_name", resultSet.getString("emp_name"));
                    todaysTask.put("task_code", resultSet.getString("task_code"));
                    todaysTask.put("task_name", resultSet.getString("task_name"));
                    todaysTask.put("task_index", resultSet.getString("task_index"));
                    todaysTask.put("start_date", resultSet.getString("start_date"));
                    todaysTask.put("duedate", resultSet.getString("duedate"));
                    todaysTask.put("remark", resultSet.getString("remark"));
                    todaysTask.put("task_seq_no", resultSet.getString("task_seq_no"));
                    todaysTask.put("task_status", resultSet.getString("task_status"));

                    try {
                        todaysTask.put("running_status", resultSet.getString("task_running_status"));
                    } catch (Exception e) {
                        todaysTask.put("running_status", "");
                    }

                    try {
                        todaysTask.put("task_action_type", resultSet.getString("task_action_type"));
                    } catch (Exception e) {
                        todaysTask.put("task_action_type", "");
                    }
                    todaysTaskList.add(todaysTask);
                } while (resultSet.next());

            }

        } catch (Exception ex) {
            U.errorLog("exeception ---> " + ex.getMessage());
        }

        String graphSql = "SELECT MONTH_NO, MONTH_CHAR,"
                + "round(LHS_CRM.GET_EMP_SALES_ACH_LAST_YR_LIVE('" + entityCode + "', '" + acc_year + "', '" + emp_code + "', TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy'), LAST_DAY(TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy')), '', NULL, NULL)/100000, 3)  sales_LAST_YR,"
                + "round(LHS_CRM.GET_EMP_SALES_TARGET_INDVL('" + entityCode + "', '" + acc_year + "', '" + emp_code + "', TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy'), LAST_DAY(TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy')), '', NULL, NULL)/100000, 3)  sales_target,"
                + "round(LHS_CRM.GET_EMP_SALES_ACHIVEMENT('" + entityCode + "', '" + acc_year + "', '" + emp_code + "', TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy'), LAST_DAY(TO_DATE('01-'||MONTH_CHAR||'-20'||decode(upper(month_char), 'JAN', SUBSTR('" + acc_year + "', 4, 2), 'FEB', SUBSTR('" + acc_year + "', 4, 2), 'MAR', SUBSTR('" + acc_year + "', 4, 2), SUBSTR('" + acc_year + "', 1, 2)),'dd-mm-yyyy')), '', NULL, NULL)/100000, 3)  sales_TILL_DT "
                + "FROM"
                + "(select to_char(add_months('01-dec-2012', rownum ),'Mon') MONTH_CHAR, to_char(rownum) MONTH_NO from user_objects t where rownum<=12 order by case WHEN rownum < 4 THEN rownum ELSE (rownum * -1) + rownum end, rownum)";
        U.log("graphSql--> " + graphSql);
        try {
            ps = con.prepareStatement(graphSql);
            resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {
                    ArrayList<String> row = new ArrayList<String>();
                    row.add(resultSet.getString("sales_LAST_YR"));
                    row.add(resultSet.getString("sales_target"));
                    row.add(resultSet.getString("sales_TILL_DT"));
//                    U.log("sales_target--> " + resultSet.getString("sales_target"));
                    data.add(row);
                    series.add(resultSet.getString("MONTH_CHAR"));
                } while (resultSet.next());
//                labes.add("sales Last Year");
//                labes.add("sales target");
//                labes.add("sales Till Date");
                labes.add("Sales LY");
                labes.add("Target");
                labes.add("sales YTD");
            }

            graphData.put("data", data);
            graphData.put("series", series);
            graphData.put("labes", labes);
            staffDashbordData.put("graphData", graphData);
            staffDashbordData.put("targetData", targetList);
            staffDashbordData.put("empDetails", empDetails);
            staffDashbordData.put("todaysTaskList", todaysTaskList);
        } catch (Exception ex) {
            U.errorLog("exeception ---> " + ex.getMessage());
        }

        return staffDashbordData;
    }

    public HashMap<String, Object> getTaskEntryDates(String seqNo, String userCode, String empCode) {

        HashMap<String, Object> taskEntryDates = new HashMap<String, Object>();
        PreparedStatement ps;
        ResultSet resultSet;

        String sql = "select pl_sql_text from lhssys_portal_table_dsc_update t where t.seq_no=" + seqNo;
        String pl_sql_text = "";
        try {
            U.log("get pl_sql_text--> " + sql);
            ps = con.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                pl_sql_text = resultSet.getString("pl_sql_text");
            }
        } catch (Exception e) {

            U.errorLog("exeception ---> " + e.getMessage());
            U.errorLog("cause ---> " + e.getCause());
        }

        if (empCode != null && !empCode.isEmpty()) {
            userCode = empCode;
            if (empCode.contains("~")) {
                String empGeo[] = empCode.split("~");
                empCode = empGeo[0];
//                geo_org_code = empGeo[1];
            }
            sql = "select user_code from user_mast t where t.emp_code='" + empCode + "'";
            try {
                U.log("get user_code-2-> " + sql);
                ps = con.prepareStatement(sql);
                resultSet = ps.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    if (resultSet.getString("user_code") != null && !resultSet.getString("user_code").isEmpty()) {
                        userCode = resultSet.getString("user_code");
                    }
                }
            } catch (Exception e) {
                U.errorLog("exeception ---> " + e.getMessage());
                U.errorLog("cause ---> " + e.getCause());
            }
        }

//        String sql = "  SELECT DISTINCT(reportDate) reportDate, TYPE FROM(SELECT DISTINCT (to_char(calc_date, 'rrrr-mm-dd')) reportDate, "
//                + "'task' as type from (with numbers as (select level - 1 as n from dual connect by level <= (select max(RR.DUEDATE - "
//                + "RR.START_DATE) + 1 from TASK_TRAN RR where RR.emp_code = (select emp_code from user_mast where user_code = '" + userCode
//                + "'))) select START_DATE + n.n as calc_date from TASK_TRAN d join numbers n on n.n <= DUEDATE - START_DATE WHERE D.Emp_Code = "
//                + "(select emp_code from user_mast where user_code = '" + userCode + "') ORDER BY START_DATE, DUEDATE, START_DATE) UNION ALL "
//                + "select DISTINCT (to_char(to_date(TASK_DATE, 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd')) reportDate, 'tour' as type from "
//                + "lhssys_calender_scheduler l where l.user_code = (select emp_code from user_mast where user_code = '" + userCode + "') "
//                + "order by reportDate)order by reportDate";
        ArrayList< HashMap<String, String>> entryDateList = new ArrayList<HashMap<String, String>>();

        if (pl_sql_text != null && !pl_sql_text.isEmpty()) {

            pl_sql_text = pl_sql_text.replaceAll("USERCODE", userCode);

            try {
                U.log("pl_sql_text--> " + pl_sql_text);
                ps = con.prepareStatement(pl_sql_text);
                resultSet = ps.executeQuery();

                if (resultSet != null && resultSet.next()) {
                    do {
                        HashMap<String, String> model = new HashMap<String, String>();
                        model.put("date", resultSet.getString("reportDate"));
//                    model.put("title", resultSet.getString("title"));
//                        model.put("type", resultSet.getString("type"));
                        try {
                            model.put("color", resultSet.getString("color").toLowerCase());
                        } catch (Exception e) {
                            model.put("color", "black");
                        }
                        entryDateList.add(model);
                    } while (resultSet.next());
                }
            } catch (Exception e) {

                U.errorLog("exeception ---> " + e.getMessage());
            }
        }
        taskEntryDates.put("entryDates", entryDateList);
        return taskEntryDates;
    }

    public HashMap<String, Object> getTaskByDate(String userCode, String taskDate, String seqNo, String empCode, String geo_org_code) {

        PreparedStatement ps;
        ResultSet resultSet;
        HashMap<String, Object> resObj = new HashMap<String, Object>();
        String sql = "select sql_text from lhssys_portal_table_dsc_update where seq_no='" + seqNo + "'";

//        String sql = " select 'C' data_type,to_char(T.TASK_DATE,'DD-MON-rrrr') DUEDATE, ' ' TASK_INDEX,T.TASK TASK,''  REMARK, "
//                + " (SELECT Y.EMP_NAME  FROM EMP_MAST Y WHERE Y.EMP_CODE = T.USER_CODE) ASSIGNOR_EMP_CODE, "
//                + " T.ENTRY_DATE CREATEDDATE, T.VRNO TASK_SEQ_NO, T.SLNO TASK_SLNO  "
//                + " from lhssys_calender_scheduler t where user_code = (select emp_code from user_mast where user_code='" + userCode + "')"
//                + " AND to_char(T.TASK_DATE, 'DD-MON-rrrr') = to_char( to_date('" + taskDate + "','mm-dd-rrrr'),'DD-MON-rrrr') "
//                + " UNION ALL"
//                + " select 'T' data_type, to_char( T.DUEDATE,'DD-MON-rrrr') DUEDATE, DECODE(T.task_index, 'H', 'High', 'M', 'Medium', 'L', 'Low')TASK_INDEX,"
//                + " (SELECT K.TASK_NAME FROM TASK_MAST K WHERE K.TASK_CODE = T.TASK_CODE) TASK , T.REMARK, "
//                + " (SELECT Y.EMP_NAME  FROM EMP_MAST Y WHERE Y.EMP_CODE = T.ASSIGNOR_EMP_CODE)ASSIGNOR_EMP_CODE ,"
//                + "  T.CREATEDDATE, TO_CHAR(T.TASK_SEQ_NO) TASK_SEQ_NO, T.TASK_SLNO  "
//                + " from task_tran t where emp_code = (select emp_code from user_mast where user_code='" + userCode + "') "
//                + "AND to_char( to_date('" + taskDate + "','mm-dd-rrrr'),'DD-MON-rrrr') BETWEEN TRUNC(T.START_DATE) AND TRUNC(T.DUEDATE)";
//        U.log("GET TASK LIST BY DATE SQL : " + sql);
        String sql_text = "";
        try {
            U.log("get sql_text--> " + sql);
            ps = con.prepareStatement(sql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                sql_text = resultSet.getString("sql_text");
            }
        } catch (Exception e) {

            U.errorLog("exeception ---> " + e.getMessage());
            U.errorLog("cause ---> " + e.getCause());
        }
        if (empCode != null && !empCode.isEmpty()) {
            userCode = empCode;
            if (empCode.contains("~")) {
                String empGeo[] = empCode.split("~");
                empCode = empGeo[0];
                geo_org_code = empGeo[1];
            }
            sql = "select user_code from user_mast t where t.emp_code='" + empCode + "'";
            try {
                U.log("get user_code- 3-> " + sql);
                ps = con.prepareStatement(sql);
                resultSet = ps.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    if (resultSet.getString("user_code") != null && !resultSet.getString("user_code").isEmpty()) {
                        userCode = resultSet.getString("user_code");
                    }
                }
            } catch (Exception e) {
                U.errorLog("exeception ---> " + e.getMessage());
                U.errorLog("cause ---> " + e.getCause());
            }
        }
        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, String>> visitList = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> visitDetails = new HashMap<String, String>();
//        if (seqNo.equalsIgnoreCase("24")) {
        try {

            sql_text = sql_text.replaceAll("'USERCODE'", "'" + userCode + "'");
            sql_text = sql_text.replaceAll("'TASKDATE'", "'" + taskDate + "'");
            sql_text = sql_text.replaceAll("'GEOORGCODE'", "'" + geo_org_code + "'");

            U.log("GET TASK LIST BY DATE SQL : " + sql_text);
            ps = con.prepareStatement(sql_text);
            resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> model = new HashMap<String, String>();

                    model.put("TASK", resultSet.getString("TASK_NAME"));
                    model.put("REMARK", resultSet.getString("REMARK"));
                    model.put("TASK_DATE", resultSet.getString("TASK_DATE"));
//                        model.put("STATE", resultSet.getString("STATE_CODE"));
                    model.put("PLAN_VISITS", resultSet.getString("PLAN_VISITS"));
                    model.put("PLAN_ORDER", resultSet.getString("PLAN_ORDER"));
                    model.put("LOCATION", resultSet.getString("GEO_NAME"));
                    model.put("VISIT_LOCATION", resultSet.getString("VISIT_LOCATION"));
                    model.put("STATUS", resultSet.getString("STATUS"));
                    model.put("ENTRY_TYPE", resultSet.getString("ENTRY_TYPE"));

                    try {
                        if (resultSet.getString("data_type").equalsIgnoreCase("C")) {
                            model.put("updateKeyCol", "VRNO#SLNO");
                        } else {
                            model.put("updateKeyCol", "TASK_SEQ_NO#TASK_SLNO");
                        }
                    } catch (Exception ex) {
                        model.put("updateKey", "");
                        model.put("updateKeyVal", "");
                    }
                    list.add(model);
                } while (resultSet.next());
            }

        } catch (Exception e) {
            U.errorLog("exeception in getTaskByDate ---> " + e.getMessage());
        }

//        }
        if (seqNo.equalsIgnoreCase("17")) {
            try {
                sql_text = sql_text.replaceAll("'USERCODE'", "'" + userCode + "'");
                sql_text = sql_text.replaceAll("'TASKDATE'", "'" + taskDate + "'");

                U.log("GET TASK LIST BY DATE SQL : " + sql_text);
                ps = con.prepareStatement(sql_text);
                resultSet = ps.executeQuery();

                if (resultSet != null && resultSet.next()) {
                    do {
                        HashMap<String, String> model = new HashMap<String, String>();
                        model.put("LEVEL1c", resultSet.getString("LEVEL1~"));
                        model.put("LEVEL1", resultSet.getString("LEVEL1"));
                        model.put("LEVEL2c", resultSet.getString("LEVEL2~"));
                        model.put("LEVEL2", resultSet.getString("LEVEL2"));
                        model.put("LEVEL3c", resultSet.getString("LEVEL3~"));
                        model.put("LEVEL3", resultSet.getString("LEVEL3"));
                        model.put("START_TIME", resultSet.getString("START_TIME"));
                        model.put("END_TIME", resultSet.getString("END_TIME"));
                        model.put("TASK_DATEc", resultSet.getString("TASK_DATE"));
                        model.put("ENTRY_COUNT", resultSet.getString("ENTRY_COUNT"));
                        model.put("DURATION", resultSet.getString("DURATION"));
                        try {
                            model.put("updateKeyCol", "rowid_seq");
                        } catch (Exception ex) {
                            model.put("updateKey", "");
                            model.put("updateKeyVal", "");
                        }
                        visitList.add(model);
                    } while (resultSet.next());
                }

            } catch (Exception e) {

                U.errorLog("exeception in getTaskByDate ---> " + e.getMessage());
            }
        }

//        try {
//            sql_text = "SELECT TASK_COUNT, VISIT_COUNT, ROUND((VISIT_COUNT/CASE TASK_COUNT WHEN 0 THEN 1 ELSE TASK_COUNT END ) *100/ 20)  STARS FROM "
//                    + "(SELECT ( SELECT COUNT(*) FROM TASK_TRAN T WHERE T.Emp_Code =\n"
//                    + "  (select emp_code from user_mast where user_code = '" + userCode + "') AND "
//                    + "to_date('" + taskDate + "', 'mm-dd-yyyy') BETWEEN T.Start_Date  "
//                    + "AND T.DUEDATE ) TASK_COUNT, "
//                    + "(SELECT COUNT(*) FROM( SELECT DISTINCT(A.GEO_ORG_CODE) FROM ACC_FOLLOWUP_TRAN A "
//                    + " WHERE A.USER_CODE = '" + userCode + "' AND A.VRDATE =to_date('" + taskDate + "','mm-dd-yyyy') "
//                    + "    )) VISIT_COUNT FROM DUAL)";
//            U.log("GET TASK LIST BY DATE SQL : " + sql_text);
//            ps = con.prepareStatement(sql_text);
//            resultSet = ps.executeQuery();
//
//            if (resultSet != null && resultSet.next()) {
//                do {
//                    visitDetails.put("task_count", resultSet.getString("TASK_COUNT"));
//                    visitDetails.put("visit_count", resultSet.getString("VISIT_COUNT"));
//                    visitDetails.put("stars", resultSet.getString("STARS"));
//                } while (resultSet.next());
//                resObj.put("visitDetailsStatus", "true");
//            } else {
//                resObj.put("visitDetailsStatus", "false");
//            }
//        } catch (Exception e) {
//            resObj.put("visitDetailsStatus", "false");
//            U.log("exeception in getTaskByDate ---> " + e.getMessage());
//        }
        resObj.put("taskList", list);
//        resObj.put("visitList", visitList);
//        resObj.put("visitDetails", visitDetails);
        return resObj;
    }

    public HashMap<String, Object> getTourByDate(String userCode, String from_date, String to_date, String seqNo, String empCode) {
        PreparedStatement ps;
        ResultSet resultSet;
        HashMap<String, Object> resObj = new HashMap<String, Object>();
        String sql_text = "SELECT rownum, LHS_UTILITY.GET_NAME('TASK_CATG_CODE',T.TASK_CATG) TASK_CATG,"
                + " to_char(T.TASK_DATE,'DD-MM-YYYY') TASK_DATE, T.NO_OF_OCCURRENCE, T.OCCURRENCE_WEEK_DAYS, T.REMARK,T.LOCATION,"
                + " LHS_UTILITY.GET_NAME('GEO_CODE',T.GEO_CODE) GEO_CODE, LHS_CRM.get_parent_geo_code(T.GEO_CODE,'ST') STATE_CODE,"
                + " T.APPROVEDBY, T.APPROVEDDATE, T.VRNO, T.TASK_STATUS, TO_NUMBER((TO_CHAR(TASK_DATE,'RR')||'00')+(TO_CHAR(TASK_DATE,'MM'))+('.'||TO_CHAR(TASK_DATE,'DD'))) DATE_ORDER_BY,"
                + " ROWID FROM LHSSYS_CALENDER_SCHEDULER T where T.entry_user_code = '" + userCode + "' "
                + " and T.task_type = 'T' and T.task_date BETWEEN to_date('" + from_date + "', 'DD-MM-RRRR')"
                + " and to_date('" + to_date + "', 'DD-MM-RRRR') ORDER BY TASK_DATE ";

//        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, String>> tourList = new ArrayList<HashMap<String, String>>();
        try {
            U.log("GET TOUR LIST BY DATE SQL : " + sql_text);
            ps = con.prepareStatement(sql_text);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> model = new HashMap<String, String>();
                    model.put("SLNO", resultSet.getString("ROWNUM"));
                    model.put("TASK_DATE", resultSet.getString("TASK_DATE"));
//                    model.put("TASK_NAME", resultSet.getString("TASK_NAME"));
                    model.put("TASK_CATG", resultSet.getString("TASK_CATG"));
                    model.put("TASK_STATUS", resultSet.getString("TASK_STATUS"));
                    model.put("NO_OF_OCCURRENCE", resultSet.getString("NO_OF_OCCURRENCE"));
                    model.put("OCCURRENCE_WEEK_DAYS", resultSet.getString("OCCURRENCE_WEEK_DAYS"));
                    model.put("REMARK", resultSet.getString("REMARK"));
                    model.put("VRNO", resultSet.getString("VRNO"));
                    model.put("STATE_CODE", resultSet.getString("STATE_CODE"));
                    model.put("GEO_CODE", resultSet.getString("GEO_CODE"));
                    model.put("APPROVEDBY", resultSet.getString("APPROVEDBY"));
                    model.put("APPROVEDDATE", resultSet.getString("APPROVEDDATE"));
                    model.put("LOCATION", resultSet.getString("LOCATION"));
                    model.put("DATE_ORDER_BY", resultSet.getString("DATE_ORDER_BY"));
                    model.put("ROWID", resultSet.getString("ROWID"));
                    tourList.add(model);
                    System.out.println("tourList =====" + tourList.toString());
                } while (resultSet.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog("exeception in getTourByDate ---> " + e.getMessage());
        }
        resObj.put("tourList", tourList);
        return resObj;
    }

    public HashMap<String, Object> getTourCardsforApproval(String userCode, String vrno) {
        PreparedStatement ps;
        ResultSet resultSet;
        HashMap<String, Object> resObj = new HashMap<String, Object>();
        String sql_text = "SELECT rownum, LHS_UTILITY.GET_NAME('TASK_CATG_CODE',T.TASK_CATG) TASK_CATG,"
                + " to_char(T.TASK_DATE,'DD-MM-YYYY') TASK_DATE, T.NO_OF_OCCURRENCE, T.OCCURRENCE_WEEK_DAYS, T.REMARK,T.LOCATION,"
                + " LHS_UTILITY.GET_NAME('GEO_CODE',T.GEO_CODE) GEO_CODE, LHS_CRM.get_parent_geo_code(T.GEO_CODE,'ST') STATE_CODE,"
                + " T.APPROVEDBY, T.APPROVEDDATE, T.VRNO, T.TASK_STATUS, TO_NUMBER((TO_CHAR(TASK_DATE,'RR')||'00')+(TO_CHAR(TASK_DATE,'MM'))+('.'||TO_CHAR(TASK_DATE,'DD'))) DATE_ORDER_BY,"
                + " ROWID FROM LHSSYS_CALENDER_SCHEDULER T where T.VRNO='" + vrno + "' ORDER BY T.TASK_DATE DESC";

//        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, String>> tourList = new ArrayList<HashMap<String, String>>();
        try {
            U.log("GET TOUR CARD LIST FOR APPROVAL SQL : " + sql_text);
            ps = con.prepareStatement(sql_text);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, String> model = new HashMap<String, String>();
                    model.put("SLNO", resultSet.getString("ROWNUM"));
                    model.put("TASK_DATE", resultSet.getString("TASK_DATE"));
//                    model.put("TASK_NAME", resultSet.getString("TASK_NAME"));
                    model.put("TASK_CATG", resultSet.getString("TASK_CATG"));
                    model.put("TASK_STATUS", resultSet.getString("TASK_STATUS"));
                    model.put("NO_OF_OCCURRENCE", resultSet.getString("NO_OF_OCCURRENCE"));
                    model.put("OCCURRENCE_WEEK_DAYS", resultSet.getString("OCCURRENCE_WEEK_DAYS"));
                    model.put("REMARK", resultSet.getString("REMARK"));
                    model.put("VRNO", resultSet.getString("VRNO"));
                    model.put("STATE_CODE", resultSet.getString("STATE_CODE"));
                    model.put("GEO_CODE", resultSet.getString("GEO_CODE"));
                    model.put("APPROVEDBY", resultSet.getString("APPROVEDBY"));
                    model.put("APPROVEDDATE", resultSet.getString("APPROVEDDATE"));
                    model.put("LOCATION", resultSet.getString("LOCATION"));
                    model.put("DATE_ORDER_BY", resultSet.getString("DATE_ORDER_BY"));
                    model.put("ROWID", resultSet.getString("ROWID"));
                    tourList.add(model);
                    System.out.println("tourCardList =====" + tourList.toString());
                } while (resultSet.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog("exeception in getTourByDate ---> " + e.getMessage());
        }
        resObj.put("tourList", tourList);
        return resObj;
    }

    public HashMap<String, Object> getTourBillCardsforApproval(String userCode, String vrno, String seqNo) {
        PreparedStatement ps;
        ResultSet resultSet;
        HashMap<String, Object> resObj = new HashMap<String, Object>();
        String sql_text = "";

        try {
            String fetchQry = "SELECT * FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE T WHERE T.SEQ_NO='" + seqNo + "'";
            System.out.println("getTourBillCards==> " + fetchQry);
            PreparedStatement ps1 = con.prepareStatement(fetchQry);
            ResultSet rs = ps1.executeQuery();
            if (rs != null && rs.next()) {
                sql_text = rs.getString("sql_text");
                sql_text = sql_text.replace("'VRNO'", "'" + vrno + "'");
            }
        } catch (Exception e1) {
        }

//        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        ArrayList<HashMap<String, Object>> tourList = new ArrayList<HashMap<String, Object>>();
        try {
            U.log("GET TOUR CARD LIST FOR APPROVAL SQL : " + sql_text);
            ps = con.prepareStatement(sql_text);

            resultSet = ps.executeQuery();
            ResultSetMetaData rsmd = resultSet.getMetaData();

            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, Object> model = new HashMap<String, Object>();
                    model.put("slno", resultSet.getString("SLNO"));
                    model.put("vrdate", resultSet.getString("VRDATE"));
//                    model.put("TASK_NAME", resultSet.getString("TASK_NAME"));
                    model.put("expense_date", resultSet.getString("EXPENSE_DATE"));
                    model.put("geo_code", resultSet.getString("GEO_CODE"));
                    model.put("nafhead", resultSet.getString("NAFHEAD"));
                    model.put("rate", resultSet.getString("RATE"));
                    model.put("remark", resultSet.getString("REMARK"));
                    model.put("amt", resultSet.getString("AMT"));
                    model.put("approved_amt", resultSet.getString("approved_amt") != null ? resultSet.getString("approved_amt") : "");
                    model.put("to_geo_code", resultSet.getString("TO_GEO_CODE"));
//                    model.put("APPROVEDBY", resultSet.getString("APPROVEDBY"));
//                    model.put("APPROVEDDATE", resultSet.getString("APPROVEDDATE"));
//                    model.put("LOCATION", resultSet.getString("LOCATION"));
                    model.put("vrno", resultSet.getString("vrno"));
                    model.put("user_level", resultSet.getString("user_level"));
                    model.put("qty", resultSet.getString("QTY"));
                    model.put("currency_code", resultSet.getString("CURRENCY_CODE"));
                    model.put("appr_status", resultSet.getString("appr_status"));
                    model.put("appr_remark", resultSet.getString("appr_remark") != null ? resultSet.getString("appr_remark") : "");
                    if (resultSet.getBlob("attachment") != null) {
                        InputStream inputStream = resultSet.getBlob("attachment").getBinaryStream();
                        model.put("attachment", Util.getImgstreamToBytes(inputStream));
                    }
                    tourList.add(model);
                    System.out.println("tourCardList =====" + tourList.toString());
                } while (resultSet.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
            U.errorLog("exeception in getTourByDate ---> " + e.getMessage());
        }
        resObj.put("tourList", tourList);
        return resObj;
    }

     public HashMap<String, String> approveTourBill(String jsonString, String seqNo, String user_code) {

        String execute_on_approval = null;
        HashMap<String, String> status = new HashMap<String, String>();
        try {
            String fetchQry = "SELECT * FROM LHSSYS_PORTAL_TABLE_DSC_UPDATE T WHERE T.SEQ_NO='" + seqNo + "'";
            System.out.println("getTourBillCards==> " + fetchQry);
            PreparedStatement ps1 = con.prepareStatement(fetchQry);
            ResultSet rs = ps1.executeQuery();
            if (rs != null && rs.next()) {
                execute_on_approval = rs.getString("execute_on_approval");
//                sql_text = sql_text.replace("'VRNO'", "'" + vrno + "'");
            }
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        PreparedStatement ps = null;
        try {
            JSONArray jsonArray = new JSONArray();
            JSONParser parser = new JSONParser();
            JSONObject jsonObj = (JSONObject) parser.parse(jsonString);
            //         JSONObject jSONObject = (JSONObject) jsonArray.get(i);
            jsonArray = (JSONArray) jsonObj.get("cards");
            Iterator itr = jsonArray.iterator();
            while (itr != null && itr.hasNext()) {
//               System.out.println("--"+itr.next().toString());
                JSONObject jObj = (JSONObject) parser.parse(itr.next().toString());
                Set<Map.Entry<String, Object>> entrySet = jObj.entrySet();
                String execute_on_approval_procedure = execute_on_approval;
                execute_on_approval_procedure = execute_on_approval_procedure.replaceAll("'USER_CODE'", "'" + user_code + "'");
                for (Map.Entry<String, Object> map : entrySet) {
//                   System.out.println("Key ---" +map.getKey() + "& Value ---" +map.getValue());
                    execute_on_approval_procedure = execute_on_approval_procedure.replace("'" + map.getKey().toUpperCase() + "'", "'" + map.getValue() + "'");

                }
//               entrySet = null;
                System.out.println("execite on approval===> " + execute_on_approval_procedure);
                ps = con.prepareStatement(execute_on_approval_procedure);
                int i = ps.executeUpdate();
                if (i > 0) {
                    System.out.println("updated");
                } else {
                    System.out.println("not updated");
                }
            }
//            JSONObject jSONObject = (JSONObject) jsonArray.get(0);

//            jSONObject.k
//            for (int k = 0; k < jSONObject.size(); k++) {
//                Set<Map.Entry<String, Object>> entrySet = jSONObject.entrySet();
//                for (Map.Entry<String, Object> map : entrySet) {
//                      System.out.println(map.getKey());
//                }
//            }
        } catch (Exception ex) {
            status.put("messege", "data not updated");
            ex.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {

                }
            }
        }
        status.put("messege", "update data");
        return status;
    }

    public ArrayList<HashMap<String, Object>> getTaskStatusList(String userCode, String taskSeqNo) {
        ArrayList<HashMap<String, Object>> taskStatusList = new ArrayList<HashMap<String, Object>>();
//        String taskStatusListSql = "select * from task_action_tran a where  a.task_seq_no='" + taskSeqNo + "' order by task_slno";
        String taskStatusListSql = "select a.*,"
                + "       NVL((SELECT S.task_status_name"
                + "             FROM VIEW_TASK_STATUS S"
                + "            WHERE S.task_status = A.TASK_STATUS),"
                + "           '') task_status_name ,"
                + " to_char(a.action_date,'dd-MON-rrrr HH:MI:SS ') action_dateFor"
                + "  from task_action_tran a"
                + " where a.task_seq_no = '" + taskSeqNo + "'"
                + " order by task_slno";
        try {
            PreparedStatement ps = con.prepareStatement(taskStatusListSql);
            ResultSet resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, Object> taskStatus = new HashMap<String, Object>();
                    taskStatus.put("task_seq_no", resultSet.getString("task_seq_no"));
                    taskStatus.put("task_slno", resultSet.getString("task_slno"));
                    taskStatus.put("action_date", resultSet.getString("action_dateFor"));
                    taskStatus.put("task_status", resultSet.getString("task_status"));
                    taskStatus.put("task_status_name", resultSet.getString("task_status_name"));
                    taskStatus.put("status_remark", resultSet.getString("remark"));
                    taskStatus.put("reviewer_remark", resultSet.getString("review_remark"));
                    taskStatusList.add(taskStatus);
                } while (resultSet.next());
            }
        } catch (Exception e) {
            U.errorLog("exeception ---> " + e.getMessage());
        }
        return taskStatusList;
    }

    public HashMap<String, String> updateTaskStatusRemark(String userCode, String remark, String taskSeqNo, String taskSlno) {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateTaskStatusSql = "";

        updateTaskStatusSql = "update task_action_tran t set  t.reviewdate=sysdate , "
                + " t.reviewby='" + userCode + "', t.review_remark ='" + remark + "'  "
                + " where t.task_seq_no ='" + taskSeqNo + "' and t.task_slno='" + taskSlno + "'";
        PreparedStatement ps;
        try {
            U.log("update task_action_tran sql --> " + updateTaskStatusSql);
            ps = con.prepareStatement(updateTaskStatusSql);
            int i = ps.executeUpdate();
            if (i > 0) {
                res.put("updateStatus", "success");
                res.put("msg", " Task review updated successfully");
            } else {
                res.put("updateStatus", "success");
                res.put("msg", " Task review Not updated");
            }
            U.log("rows updated:- > " + i);
        } catch (Exception ex) {
            res.put("updateStatus", "error");
            res.put("msg", " Task review Not updated ");
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        return res;
    }

    public HashMap<String, String> deleteStoredTourData(String userCode, String rowId) {
        HashMap<String, String> res = new HashMap<String, String>();
        String deleteStoredTour = "";

        deleteStoredTour = "delete from lhssys_calender_scheduler t where t.rowid = '" + rowId + "'";
        PreparedStatement ps;
        try {
            U.log("delete lhssys_calender_scheduler data --> " + deleteStoredTour);
            ps = con.prepareStatement(deleteStoredTour);
            int i = ps.executeUpdate();
            if (i > 0) {
                res.put("deleteStatus", "success");
                res.put("msg", " Stored Tour Deleted successfully");
            } else {
                res.put("deleteStatus", "succ");
                res.put("msg", " Stored Tour Not Deleted");
            }
            U.log("rows updated:- > " + i);
        } catch (Exception ex) {
            res.put("deleteStatus", "error");
            res.put("msg", " Stored Tour Not Deleted !! ");
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        return res;
    }

    public HashMap<String, String> approveTourCards(String userCode, String cardJson) throws ParseException, Exception {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateTourCard = "";
        // System.out.println("CARD JSON== " + cardJson);
        JSONArray jsonArray = new JSONArray();
        JSONArray listJsonArray = new JSONArray();
        JSONParser json_parser = new JSONParser();
        JSONObject listjson = (JSONObject) json_parser.parse(cardJson);
        listJsonArray = (JSONArray) listjson.get("list");
        int listArrLength = listJsonArray.size();
        U.log("listArrLength" + listArrLength);

        for (int k = 0; k < listArrLength; k++) {
            JSONObject obj1 = (JSONObject) listJsonArray.get(k);
            // System.out.println("APP: CARD :" + obj1);
            String status = obj1.get("TASK_STATUS").toString();
            if (status.equalsIgnoreCase("S")) {
                status = "A";
            }
            updateTourCard = "begin update lhssys_calender_scheduler set APPROVEDBY ='" + userCode + "', APPROVEDDATE = sysdate, TASK_STATUS = '" + status + "'  where rowid = '" + obj1.get("ROWID").toString() + "';"
                    + "update lhssys_cal_sch_head set  APPROVEDDATE = sysdate where vrno = '" + obj1.get("VRNO").toString() + "'; end;";
            PreparedStatement ps;
            try {
                U.log("update lhssys_calender_scheduler data --> " + updateTourCard);
                ps = con.prepareStatement(updateTourCard);
                int i = ps.executeUpdate();
                if (i > 0) {
                    res.put("updateStatus", "success");
                    res.put("msg", "Plan Updated Successfully");
                } else {
                    res.put("updateStatus", "succ");
                    res.put("msg", "Plan Not Approved");
                }
                U.log("rows updated:- > " + i);
            } catch (Exception ex) {
                res.put("updateStatus", "error");
                res.put("msg", "  Tour Not Approved !! ");
                U.errorLog("exeception ---> " + ex.getMessage());
            }
        }

        return res;
    }

    public HashMap<String, Object> getEmpLocation(String userCode, String seqNo, String empCode, String visitDate) {
        HashMap<String, Object> resObj = new HashMap<String, Object>();
        ArrayList< HashMap<String, Object>> list = new ArrayList< HashMap< String, Object>>();
        String empLocationSql = null;
        PreparedStatement ps = null;

        String sql = "select SQL_TEXT from lhssys_portal_table_dsc_update t where t.seq_no='" + seqNo + "'";
        try {
//            U.log("get user_code-1-> " + sql);
            ps = con.prepareStatement(sql);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
//                if (resultSet.getString("user_code") != null && !resultSet.getString("user_code").isEmpty()) {
//                    userCode = resultSet.getString("user_code");
//                }
                empLocationSql = resultSet.getString(1);
            }
            System.out.println("empLocationSql == " + empLocationSql);
            empLocationSql = empLocationSql.replace("'EMPCODE'", "'" + empCode + "'");
            empLocationSql = empLocationSql.replace("'VISIT_DATE'", "'" + visitDate + "'");
            System.out.println("replaced empLocationSql == " + empLocationSql);
        } catch (Exception e) {
            U.errorLog("exeception ---> " + e.getMessage());
            U.errorLog("cause ---> " + e.getCause());
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException ex) {
                    Logger.getLogger(TourPlanManagmentDAO.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
//        empLocationSql = "select f.location,f.vrdate,f.lastupdate from acc_followup_tran f where user_code='" + userCode + "' "
//                + "and vrdate=trunc(sysdate) order by f.lastupdate";
//        empLocationSql = "select F.GEO_ORG_CODE, MAX(f.location) location, MAX(f.lastupdate) lastupdate,(SELECT G.geo_org_name "
//                + "FROM VIEW_GEO_ORG_MAST G WHERE G.geo_org_code = F.GEO_ORG_CODE AND ROWNUM = 1) LOCATION_NAME from "
//                + "acc_followup_tran f where user_code = '" + userCode + "' and TO_DATE(vrdate, 'dd-mm-rrrr') = TO_DATE('" + visitDate
//                + "', 'dd-mm-rrrr') group by F.GEO_ORG_CODE order by lastupdate";
//        empLocationSql = "select F.GEO_ORG_CODE, MAX(f.location) location, '' ||TO_CHAR(MAX(f.lastupdate), 'dd-MON-yy hh24:MI:ss') lastupdate,"
//                + "(SELECT G.geo_org_name FROM VIEW_GEO_ORG_MAST G WHERE G.geo_org_code = F.GEO_ORG_CODE AND ROWNUM = 1) LOCATION_NAME, "
//                + "'V' FLAG , f.trantype, TO_CHAR(f.vrdate) vrdate from acc_followup_tran f where user_code = '" + userCode + "'  and TO_DATE(vrdate, 'dd-mm-rrrr') = TO_DATE('" + visitDate + "', 'dd-mm-rrrr') "
//                + "group by F.GEO_ORG_CODE, f.trantype, f.vrdate UNION SELECT '' GEO_ORG_CODE,A.LATITUDE||'~~'||A.LONGITUDE, A.COL3||' '||A.COL4 LASTUPDATE, A.LOCATION LOCATION_NAME, 'I' FLAG ,TO_CHAR(A.Seq_Id) trantype, A.Col3 vrdate "
//                + "FROM LHSSYS_PORTAL_APP_TRAN A WHERE A.USER_CODE = '" + userCode + "' AND A.DYNAMIC_TABLE_SEQ_ID = '999' and TO_DATE(A.LASTUPDATE, 'dd-mm-rrrr') = TO_DATE('" + visitDate + "', 'dd-mm-rrrr') "
//                + "UNION SELECT '' GEO_ORG_CODE,A.COL11||'~~'||A.COL12,A.COL3 || ' ' || NVL(A.COL7,'NA') LASTUPDATE, A.COL13 LOCATION_NAME, 'O' FLAG ,TO_CHAR(A.Seq_Id) trantype , A.Col3 vrdate "
//                + "FROM LHSSYS_PORTAL_APP_TRAN A WHERE A.USER_CODE = '" + userCode + "' AND A.DYNAMIC_TABLE_SEQ_ID = '999' and TO_DATE(A.LASTUPDATE, 'dd-mm-rrrr') = TO_DATE('" + visitDate + "', 'dd-mm-rrrr') "
//                + "UNION SELECT Col9 GEO_ORG_CODE, A.LATITUDE || '~~' || A.LONGITUDE, '' || TO_CHAR(A.lastupdate, 'dd-MON-yy hh24:MI:ss') lastupdate, A.LOCATION, 'V' FLAG, TO_CHAR(A.Col4) trantype, A.Col3 vrdate "
//                + "FROM LHSSYS_PORTAL_APP_TRAN A WHERE A.COL1 IN('8.1', '8.7', '8.8', '8.9', '8.11', '8.12') "
//                + "AND A.USER_CODE = '" + userCode + "' "
//                + "AND to_char(to_date(A.LASTUPDATE, 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd') = to_char(to_date('" + visitDate + "', 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd') "
//                + "order by lastupdate";
        try {
            U.log("getEmpLocation sql --> " + empLocationSql);
            ps = con.prepareStatement(empLocationSql);
            ResultSet resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    HashMap<String, Object> taskStatus = new HashMap<String, Object>();
//                    taskStatus.put("location", resultSet.getString("location"));
                    taskStatus.put("vrdate", resultSet.getString("vrdate"));
                    taskStatus.put("entry_type", resultSet.getString("FLAG"));
                    taskStatus.put("geo_org_code", resultSet.getString("geo_org_code"));
                    taskStatus.put("trantype", resultSet.getString("trantype") != null ? resultSet.getString("trantype") : "--");
                    taskStatus.put("location_name", resultSet.getString("LOCATION_NAME"));
                    taskStatus.put("lastupdate", resultSet.getString("lastupdate"));
                    taskStatus.put("lat_long", resultSet.getString("lat_long"));
                    taskStatus.put("tran_detail", resultSet.getString("tran_detail"));
                    taskStatus.put("remark", resultSet.getString("remark") != null ? resultSet.getString("remark") : "--");
                    list.add(taskStatus);
                } while (resultSet.next());
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        resObj.put("locationList", list);
        return resObj;
    }

    public ArrayList<HashMap<String, Object>> getMapDashboardData(String userCode, String filterParam, String seqNo) {
        ArrayList<HashMap<String, Object>> mapDashboadDataList = new ArrayList<HashMap<String, Object>>();
//        String taskStatusListSql = "select * from task_action_tran a where  a.task_seq_no='" + taskSeqNo + "' order by task_slno";

        String visitDate = "sysdate";
        String UserCode = userCode;
        String mapDashBoardQuery = null;
        PreparedStatement ps1 = null;
        try {

            try {
                ps1 = con.prepareStatement("SELECT default_populate_data FROM lhssys_portal_table_dsc_update WHERE seq_no=" + seqNo);
                ResultSet rs1 = ps1.executeQuery();
                if (rs1 != null && rs1.next()) {
                    mapDashBoardQuery = rs1.getString(1);
                    U.log("mapDashBoardQuery:    " + mapDashBoardQuery);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (ps1 != null) {
                    ps1.close();
                }
            }

//            if (filterParam != null && !filterParam.isEmpty()) {
//                U.log("Filter Param -----------> " + filterParam);
//                JSONParser json_parser = new JSONParser();
//                JSONObject filterJson = (JSONObject) json_parser.parse(filterParam);
//                if (visitDate != null && !visitDate.equals("")) {
//                    visitDate = "'" + filterJson.get("VISIT_DATE").toString() + "'";
//                }
//                String emp = "'" + filterJson.get("EMP_CODE").toString() + "'";
//                U.log("EMP: " + emp);
//
////                try {
////                    PreparedStatement ps1 = con.prepareStatement("SELECT USER_CODE FROM USER_MAST WHERE EMP_CODE=" + emp);
////                    ResultSet rs1 = ps1.executeQuery();
////                    if (rs1 != null && rs1.next()) {
////                        UserCode = rs1.getString(1);
////                        U.log("USERCODE:    " + UserCode);
////                    }
////                } catch (Exception e) {
////                    e.printStackTrace();
////                }
//
//            } else {
//
//            }
            if (filterParam != null && !filterParam.isEmpty()) {
                U.log("Filter Param -----------> " + filterParam);
                JSONParser json_parser = new JSONParser();
                JSONObject filterJson = (JSONObject) json_parser.parse(filterParam);
//                for(int i = 0;i < filterJson.;i++){
//                    mapDashBoardQuery = mapDashBoardQuery.replaceAll("'"+filterJson.+"'", UserCode)
//                }

//                if(filterJson.size() == 0){
//                    mapDashBoardQuery = mapDashBoardQuery.replaceAll("'USERCODE'","'" + userCode + "'");
//                    mapDashBoardQuery = mapDashBoardQuery.replaceAll("'USERCODE'","'" + userCode + "'");
//                }
                mapDashBoardQuery = mapDashBoardQuery.replaceAll("'USERCODE'", "'" + userCode + "'");
                for (Object key : filterJson.keySet()) {

                    System.out.println("key==" + key + "value==" + filterJson.get(key));
                    if (filterJson.get(key) == null || filterJson.get(key) == "null") {
                        mapDashBoardQuery = mapDashBoardQuery.replaceAll("'" + key + "'", "''");
                    } else {
                        mapDashBoardQuery = mapDashBoardQuery.replaceAll("'" + key + "'", "'" + filterJson.get(key) + "'");
                    }
//                    System.out.println("replaced mapDashBoardQuery : " + mapDashBoardQuery);
                }
                System.out.println("replaced mapDashBoardQuery : " + mapDashBoardQuery);
            } else {

            }

        } catch (Exception e) {
            e.printStackTrace();
            e.getMessage();
        }

//        String mapDashboardDataSql = "SELECT F.STORE_FILE, L.COL1 as SEQ_NO, L.COL2 as USER_CODE, L.COL3 as in_DATE, L.COL4 as IN_TIME, "
//                + "DECODE(L.COL5, 'P', 'Present', 'A', 'Absent') ATTENDANCE_STATUS, L.COL6 as status_detail, L.COL7 as OUT_TIME, "
//                + "L.COL8 as IMAGE_SEQ_NO, L.LATITUDE, L.LONGITUDE, L.LOCATION, L.COL11 as OUT_LATITUDE, L.COL12 as OUT_LONGITUDE,L.COL13 as OUT_LOCATION,"
//                + " L.LASTUPDATE, U.EMP_CODE as emp_code, "
//                + "(SELECT TASK_COUNT + VISIT_COUNT NO_OF_VISIT FROM(SELECT (SELECT COUNT(A.COL9) ENTRY_COUNT "
//                + "FROM LHSSYS_PORTAL_APP_TRAN A WHERE A.COL1 IN ('8.1','8.7', '8.8', '8.9', '8.11', '8.12') AND A.USER_CODE = '" + UserCode + "' "
//                + "AND to_char(to_date(A.LASTUPDATE, 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd') = to_char(to_date(" + visitDate + ", 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd')) TASK_COUNT, (SELECT COUNT(*) "
//                + "FROM (SELECT DISTINCT (A.GEO_ORG_CODE) FROM ACC_FOLLOWUP_TRAN A WHERE A.USER_CODE = '" + UserCode + "' "
//                + "AND A.VRDATE = to_date(" + visitDate + ", 'dd-mm-yyyy'))) VISIT_COUNT FROM DUAL) ) NO_OF_VISITS, (SELECT COUNT(*) "
//                + "FROM TASK_TRAN T WHERE T.Emp_Code =(select emp_code from user_mast where user_code = '" + UserCode + "') "
//                + "AND to_date(" + visitDate + ", 'dd-mm-yyyy') BETWEEN T.Start_Date AND T.DUEDATE) TARGET, (SELECT SUM(OB.AFIELD1) "
//                + "FROM ORDER_BODY OB WHERE OB.VRNO IN( SELECT O.VRNO FROM ORDER_HEAD O "
//                + "WHERE to_char(to_date(O.LASTUPDATE, 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd') = to_char(to_date(" + visitDate + ", 'dd-mm-rrrr HH24:MI:SS'), 'rrrr-mm-dd') "
//                + "AND O.USER_CODE = '" + UserCode + "')) BOOKED_VALUE, "
//                + "LHS_UTILITY.GET_NAME('EMP_CODE', U.EMP_CODE) employee_name,"
//                + "(SELECT LHS_UTILITY.GET_NAME('DESIG_CODE', S.DESIG_CODE) "
//                + "FROM VIEW_EMP_STATUS_MAST S WHERE S.EMP_CODE = U.EMP_CODE) employee_role, '' imei_device_id "
//                + "FROM LHSSYS_PORTAL_APP_TRAN L, LHSSYS_PORTAL_UPLOAD_FILE F, USER_MAST U "
//                + "WHERE U.USER_CODE = L.USER_CODE AND L.DYNAMIC_TABLE_SEQ_ID = '999' "
//                + "AND L.COL3 = to_char(to_date(" + visitDate + ",'DD-MM-YY'), 'DD-MON-RR') AND F.FILE_ID(+) = L.COL8 "
//                + "AND(U.EMP_CODE = (SELECT EE.EMP_CODE FROM USER_MAST EE WHERE EE.USER_CODE = '" + UserCode + "') OR U.EMP_CODE "
//                + "IN (SELECT ES.EMP_CODE FROM VIEW_EMP_STATUS_MAST ES WHERE ES.REPORT_TO_EMP_CODE = (SELECT EE.EMP_CODE "
//                + "FROM USER_MAST EE WHERE EE.USER_CODE = '" + UserCode + "'))) ORDER BY L.SEQ_ID ";
        String mapDashboardDataSql = mapDashBoardQuery.replaceAll("'VISIT_DATE'", visitDate);

//        U.log("SQL_QRY: " + mapDashboardDataSql);
        try {
            PreparedStatement ps = con.prepareStatement(mapDashboardDataSql);
            ResultSet resultSet = ps.executeQuery();

            if (resultSet != null && resultSet.next()) {
                do {

                    U.log("Inside");

                    HashMap<String, Object> mapDashboardData = new HashMap<String, Object>();
                    try {
                        System.out.println("img length == ");
                        if (resultSet.getBinaryStream("STORE_FILE_LRAW") != null) {
                             System.out.println("img length == 2");
                        InputStream imgstream = resultSet.getBinaryStream("STORE_FILE_LRAW");
                        byte[] longx = Util.getImgstreamToBytes(imgstream);
                        mapDashboardData.put("user_image", longx);
                        } else {
                            InputStream imgstream = getClass().getResourceAsStream("/defualtDp.png");
                            mapDashboardData.put("user_image", Util.getImgstreamToBytes(imgstream));
                        }
                    } catch (Exception ex) {
                        ex.printStackTrace();
                        InputStream imgstream = getClass().getResourceAsStream("/defualtDp.png");
                        mapDashboardData.put("user_image", Util.getImgstreamToBytes(imgstream));
                    }
                    try {
                        mapDashboardData.put("user_code", resultSet.getString("USER_CODE"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("in_date", resultSet.getString("in_DATE"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("in_time", resultSet.getString("IN_TIME"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("attendance_status", resultSet.getString("ATTENDANCE_STATUS"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("status_detail", resultSet.getString("status_detail"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("out_time", resultSet.getString("OUT_TIME"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("location", resultSet.getString("location"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("out_location", resultSet.getString("OUT_LOCATION"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("no_of_visits", resultSet.getString("no_of_visits"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("target", resultSet.getString("target"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("booked_value", resultSet.getString("booked_value"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("employee_name", resultSet.getString("employee_name"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("employee_role", resultSet.getString("employee_role"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("emp_code", resultSet.getString("emp_code"));
                    } catch (Exception ex) {
                    }
                    try {
                        mapDashboardData.put("markersCount", resultSet.getString("markersCount"));
                    } catch (Exception ex) {
                    }
//                    InputStream imgstream = null;
//                      byte[] longx = Util.getImgstreamToBytes(rs.getBinaryStream("doc_image"));
//                    model.setImage(longx);
//                        System.out.println("img length == "+resultSet.getBinaryStream("STORE_FILE_LRAW"));

                    mapDashboadDataList.add(mapDashboardData);
                } while (resultSet.next());
            }
        } catch (Exception e) {
            U.errorLog("exeception ---> " + e.getMessage());
        }
        return mapDashboadDataList;
    }

}
