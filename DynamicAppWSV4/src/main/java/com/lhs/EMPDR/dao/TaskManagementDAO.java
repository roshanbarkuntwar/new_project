/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author ranjeet.kumar
 */
public class TaskManagementDAO {

    Connection con;
    String USERCODE = "";
    boolean isNotificationSend = false;

    public TaskManagementDAO(Connection con) {
        this.con = con;
        U u = new U(this.con);
    }

    public HashMap<String, Object> getTaskTabs(String userCode, String seqNo, String filterParam) {

        HashMap<String, Object> mainObj = new HashMap<String, Object>();
        PreparedStatement ps = null;
        ResultSet resultSet = null;
        String empCode = "";
        String userEmpCode = "";
        System.out.println("FILTER PARAM : " + filterParam);
        String empCodeSql = "SELECT U.EMP_CODE FROM USER_MAST U WHERE U.USER_CODE = '" + userCode + "'";

        try {
//            U.log("empDetails sql--> " + empCodeSql);
            ps = con.prepareStatement(empCodeSql);
            resultSet = ps.executeQuery();
            if (resultSet != null && resultSet.next()) {
                userEmpCode = resultSet.getString("emp_code");
            }
        } catch (Exception e) {
            U.log("exeception ---> " + e.getMessage());
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
            Logger.getLogger(TaskManagementDAO.class.getName()).log(Level.SEVERE, null, ex);
        }    

//        U.log("taskSql@@@ ---> " + taskSql);
//        U.log("where_clause ---> " + where_clause);
        if (taskSql != null && !taskSql.isEmpty()) {

            try {
                if (filterParam != null && !filterParam.isEmpty() && filterParam.length() > 3) {
                    U.log("Filter Param -----------> " + filterParam);
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
                    U.log("Filter Param NOT PRESESNT-----------> ");
                    taskSql = taskSql.replaceAll("'TASK_STATUS'", "NULL");
                    taskSql = taskSql.replaceAll("'EMP_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'FROM_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TO_DATE'", "NULL");
                    taskSql = taskSql.replaceAll("'TASK_CODE'", "NULL");
                    taskSql = taskSql.replaceAll("'GEO_ORG_CODE'", "NULL");
//                    taskSql = taskSql.replaceAll("'USERCODE'", "NULL");
                    where_clause = where_clause.replaceAll("'TASK_STATUS'", "NULL");
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
        System.out.println("FILTER PARAM : " + filterParam);
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
            Logger.getLogger(TaskManagementDAO.class.getName()).log(Level.SEVERE, null, ex);
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
                        System.out.println("taskSqlWhereClause --Replace-- " + taskSqlWhereClause);
                    }
                } else {
                    System.out.println("taskSqlWhereClause --Replace--22222222 " + taskSqlWhereClause);
//                    U.log("Filter Param NOT PRESESNT-----------> ");
                    //taskSql = taskSql.replaceAll("'TASK_STATUS'", empCode);
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
//                        assignor_emp_code,
// assignor_emp_code,
//               assignor_emp_name,
//               emp_code,
//               emp_name,
//               task_code,
//               task_name,
//               task_index,
//               start_date,
//               duedate,
//               remark,
//               MM.task_seq_no,
//               task_status,
//               task_action_type,
//               task_running_status,
//               task_action
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
                        try {
                            System.out.println("task action==>" + resultSet.getString("task_action"));
                            task.put("task_action", resultSet.getString("task_action"));
                        } catch (Exception e) {
                            task.put("task_action", "");
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

    public HashMap<String, String> updateTaskStatus(String userCode, String taskSeqNo,
            String taskStatus, String remark, String taskPersent, String taskCode, String assignorEmpCode) {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateTaskStatusSql = "";
        if (taskStatus != null && !taskStatus.isEmpty()) {
            System.out.println("taskStatus===========================> " + taskStatus);
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
                updateTaskActionTran(userCode, taskSeqNo, remark, taskStatus, taskCode);
            } else if (taskStatus.equalsIgnoreCase("X")) {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate ,"
                        + " CANCELLEDBY='" + userCode + "' ,"
                        + " CANCELLED_REMARK='" + remark + "' ,"
                        + " CANCELLEDDATE=sysdate"
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                updateTaskActionTran(userCode, taskSeqNo, remark, taskStatus, taskCode);
            } else if (taskStatus.equalsIgnoreCase("S")) {
                updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='" + taskStatus + "' ,"
                        + " lastupdate=sysdate ,"
                        + " CANCELLEDBY='" + userCode + "' ,"
                        + " CANCELLED_REMARK='" + remark + "' ,"
                        + " CANCELLEDDATE=sysdate"
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
//                insertIntoTaskTran(userCode, taskSeqNo, remark, taskStatus, taskCode);
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
                    sendNotification(assignorEmpCode, taskCode, taskStatus, userCode);
                } else {
                    res.put("updateStatus", "success");
                    res.put("msg", " Task Status Not updated successfully");
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
                + "              (select emp_code from user_mast where user_code='" + userCode + "'),"
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

    public HashMap<String, String> updateLocation(String userCode, String latitude, String longitude, String location, String user, String table, String update_key) {
        HashMap<String, String> res = new HashMap<String, String>();
        String updateLocationSql = "UPDATE " + table + " SET latitude='" + latitude + "' , longitude='"
                + longitude + "', location = '" + location + "', Location_Updated_By ='" + userCode + "', Location_Lastupdate = sysdate WHERE " + update_key + "= '" + user + "'";

        PreparedStatement ps;
        try {
            U.log("update Location sql --> " + updateLocationSql);
            ps = con.prepareStatement(updateLocationSql);
            int i = ps.executeUpdate();
            if (i > 0) {
                res.put("updateStatus", "success");
                res.put("msg", " Location updated successfully");
            } else {
                res.put("updateStatus", "success");
                res.put("msg", " Location Not updated");
            }
            U.log("rows updated:- > " + i);
        } catch (Exception ex) {
            res.put("updateStatus", "error");
            res.put("msg", " Location Not updated ");
            U.errorLog("exeception ---> " + ex.getMessage());
        }
        return res;
    }

    public void sendNotification(String assignorEmpCode, String taskCode, String taskStatus, String userCode) {

        String AUTH_KEY_FCM = "AAAAqTPM8z8:APA91bGVIagFqqDqxKRmp_8iq8VdxPX3yzkUIyp0URXoe6anWMgltTzX2QEyZ9klRYb1Y3jfGwUfb_S8prvVvJkYjLrU7fyGlbVJ07WlEWOp21cu3cW-M-dg8_1rQeSNygGe3WKzhoxL";
        String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";
        String notifData = "", message = "", tokenNo = "", status = "";

        try {
            if (taskStatus.equals("C")) {
                status = "Completed";
            } else if (taskStatus.equals("P")) {
                status = "Pending";
            } else if (taskStatus.equals("R")) {
                status = "Running";
            } else {
                status = "Cancel";
            }

            String query = "select Y.PUSH_ALERT_TOKEN_NO, LHS_UTILITY.GET_NAME('TASK_CODE', '" + taskCode + "')|| ' task status is " + status + " by ' || LHS_UTILITY.GET_NAME('USER_CODE','" + userCode + "') "
                    + "MESSAGE from lhssys_user_app_key_validation y, USER_MAST X where X.emp_code='" + assignorEmpCode + "' AND X.USER_CODE = Y.USER_CODE";

            System.out.println("Query---sendNotif--->" + query);
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                tokenNo = rs.getString(1);
                message = rs.getString(2);
            }

            if (tokenNo != null && !tokenNo.isEmpty()) {

                notifData
                        = "{\"notification\":{\"title\":\"Task Status\",\"body\":\"" + message + "\"},"
                        //  + "\"data\":" + jsonData + ","
                        + "\"to\":\"" + tokenNo + "\","
                        + "\"priority\":\"high\","
                        + "\"click_action\":\"FCM_PLUGIN_ACTIVITY\","
                        + "\"sound \":\"enabled\"}";

                String authKey = AUTH_KEY_FCM; // You FCM AUTH key
                String FMCurl = API_URL_FCM;
                URL url = new URL(FMCurl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setUseCaches(false);
                conn.setDoInput(true);
                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "key=" + authKey);
                conn.setRequestProperty("Content-Type", "application/json");

                OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
                wr.write(notifData);
                wr.flush();
                conn.getInputStream();
                int code = conn.getResponseCode();
                System.out.println("Response Code For Notif---->" + code);

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public String reAssignTask(String taskSeqNo) {
        String reAssignStatus = "";
        HashMap<String, String> prevTaskDetails = new HashMap<String, String>();
        String reAssignTaskFetchQry = "SELECT * from TASK_TRAN T WHERE T.TASK_SEQ_NO='" + taskSeqNo + "'";
        try {
            PreparedStatement ps = con.prepareStatement(reAssignTaskFetchQry);
            ResultSet rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            for (int i = 1; i < columnCount; i++) {

            }
            ArrayList<String> rsmdList = new ArrayList<String>();

        } catch (Exception e) {
        }

        return reAssignStatus;
    }

    public HashMap<String, String> reAssignTask(String taskSeqNo, String reAssignData) throws ParseException, Exception {
        HashMap<String, String> res = new HashMap<String, String>();
        JSONParser json_parser = new JSONParser();
        JSONObject reAssignJson = (JSONObject) json_parser.parse(reAssignData);
        String fromDate = reAssignJson.get("from_date") != null ? (String) reAssignJson.get("from_date") : "";
        String toDate = reAssignJson.get("to_date") != null ? (String) reAssignJson.get("to_date") : "";
        String remark = reAssignJson.get("remark") != null ? (String) reAssignJson.get("remark") : "";

        System.out.println("ASSIGN_REMARK: " + fromDate + " , " + toDate + " , " + remark);
        System.out.println("taskSeqNO: " + taskSeqNo);
        try {
            String prevTaskQry = "SELECT * from task_tran t where t.task_seq_no = '" + taskSeqNo + "'";
            CommunicationDAO cdao = new CommunicationDAO(con);
            List<HashMap<String, String>> taskList = new ArrayList<HashMap<String, String>>();
            taskList = cdao.getQueryResponse(prevTaskQry);
            System.out.println("TASK_DETAILS : " + taskList.get(0));
            String EMP_CODE = taskList.get(0).get("EMP_CODE");
            String TASK_INDEX = taskList.get(0).get("TASK_INDEX");
            String assignor_emp_code = taskList.get(0).get("ASSIGNOR_EMP_CODE");
            String createdby = taskList.get(0).get("CREATEDBY");
            String ENTITY_CODE = taskList.get(0).get("ENTITY_CODE");
            String TASK_CODE = taskList.get(0).get("TASK_CODE");
            int task_slno = Integer.parseInt(taskList.get(0).get("TASK_SLNO"));
            String TASK_SEQ_NO = "";

            String taskSeqNoSql = "SELECT MAX(TASK_SEQ_NO) + 1 FROM TASK_TRAN";
            int maxSeqNo = 0;
            try {
                PreparedStatement ps1 = con.prepareStatement(taskSeqNoSql);
                ResultSet rs1 = ps1.executeQuery();
                if (rs1.next()) {
                    maxSeqNo = rs1.getInt(1);
                }
            } catch (Exception e) {
                U.errorLog("exeception 9---> " + e.getMessage());
            }
            TASK_SEQ_NO = String.valueOf(maxSeqNo);

            String taskQuery = "INSERT INTO TASK_TRAN (PREVIOUS_TASK_REQ,TASK_SEQ_NO,EMP_CODE,START_DATE,"
                    + "remark,TASK_INDEX,CREATEDDATE,assignor_emp_code,createdby,ENTITY_CODE,TASK_CODE,task_slno,DUEDATE) VALUES"
                    + " ('" + taskSeqNo + "',"
                    + " '" + TASK_SEQ_NO + "',"
                    + " '" + EMP_CODE + "',"
                    + " to_date('" + fromDate + "','DD-MM-RRRR'),"
                    + " '" + remark + "',"
                    + " '" + TASK_INDEX + "',"
                    + " sysdate,"
                    + " '" + assignor_emp_code + "',"
                    + " '" + createdby + "',"
                    + " '" + ENTITY_CODE + "',"
                    + " '" + TASK_CODE + "',"
                    + " '" + (task_slno + 1) + "',"
                    + "to_date( '" + toDate + "', 'DD-MM-RRRR'))";
            System.out.println("taskQuery : " + taskQuery);
            PreparedStatement taskInsertPrepare = con.prepareStatement(taskQuery);

            int insertCount = taskInsertPrepare.executeUpdate();
            if (insertCount > 0) {
                String updateTaskStatusSql = "update TASK_TRAN set "
                        + " TASK_STATUS='S' ,"
                        + " lastupdate=sysdate ,"
                        + " where TASK_SEQ_NO='" + taskSeqNo + "'";
                PreparedStatement ps = con.prepareStatement(updateTaskStatusSql);
                int updateCount = ps.executeUpdate();
                if (updateCount > 0) {
                    res.put("updateStatus", "success");
                } else {
                    res.put("updateStatus", "error");
                }
                res.put("status", "success");
                res.put("resMessage", "Task Re-Assigned to " + EMP_CODE);
            } else {
                res.put("status", "error");
                res.put("resMessage", "Something Went Wrong..");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return res;
    }
}
