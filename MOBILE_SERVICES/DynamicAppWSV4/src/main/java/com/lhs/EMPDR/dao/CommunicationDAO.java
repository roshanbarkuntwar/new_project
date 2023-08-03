/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.utility.Util;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author ranjeet.kumar
 */
public class CommunicationDAO {

    private Connection connection = null;

    public CommunicationDAO(Connection conn) {
        this.connection = conn;
    }

    public List<HashMap<String, String>> getCommunicationUserList(String seqNo, String userParam) {
        ArrayList<HashMap<String, String>> communicationChannel = new ArrayList<HashMap<String, String>>();

        String loginUserFlag = "";
        String userCode = "";
        String geoOrgCode = "";
        String accCode = "";
        String communicationChannelQry = "";
        HashMap<String, String> communicationChannelMap;
        try {
            String taskSql = "";
            String where_clause = "";
            if (userParam != null && !userParam.isEmpty()) {
                JSONParser json_parser = new JSONParser();
                JSONObject filterJson = (JSONObject) json_parser.parse(userParam);
                System.out.println("filterJson ---- > " + filterJson);
                System.out.println("LOGIN_USER_FLAG = " + filterJson.get("login_user_flag"));
                String loginId = filterJson.get("loginId").toString() != null ? filterJson.get("loginId").toString() : "";
                System.out.println("loginId  ------- " + loginId);
                loginUserFlag = filterJson.get("login_user_flag") != null ? (String) filterJson.get("login_user_flag") : "";
                userCode = filterJson.get("user_code").toString();
                geoOrgCode = filterJson.get("geo_org_code") != null ? (String) filterJson.get("geo_org_code") : "";
                accCode = filterJson.get("acc_code") != null ? (String) filterJson.get("acc_code") : "";
                if (loginUserFlag != null && !loginUserFlag.equalsIgnoreCase("E")) {
                    userCode = loginId;
                }
                String communicationChannelFindQry = "select sql_text from lhssys_portal_table_filter tf"
                        + " where tf.status = 'T' and tf.seq_no = '" + seqNo + "' and tf.data_type = '" + loginUserFlag + "'";
                System.out.println("communicationChannelFindQry==> "+ communicationChannelFindQry);
                PreparedStatement communicationChannelStatement = connection.prepareStatement(communicationChannelFindQry);
                ResultSet resultSet = communicationChannelStatement.executeQuery();
                if (resultSet != null && resultSet.next()) {
                    communicationChannelQry = resultSet.getString(1);
                    communicationChannelQry = communicationChannelQry.replace("'USERCODE'", "'" + userCode + "'").replace("'GEOORGCODE'", "'" + geoOrgCode + "'");
//                    communicationChannelQry += " order by user_name";
                    System.out.println("communicationChannelQry After Replace ---->  " + communicationChannelQry);
                }
//                connection.setAutoCommit(false);
                PreparedStatement ps = connection.prepareStatement(communicationChannelQry);
                ResultSet rs = ps.executeQuery();
                ResultSetMetaData rsmd = rs.getMetaData();
                ArrayList<String> rsmdList = new ArrayList<String>();
                int columnCout = rsmd.getColumnCount();
                for (int i = 1; i <= columnCout; i++) {
                    rsmdList.add(rsmd.getColumnName(i));
                }
                if (rs != null) {
                    while (rs.next()) {
                        communicationChannelMap = new HashMap<String, String>();
                        for (String columnName : rsmdList) {
                            communicationChannelMap.put(columnName, rs.getString(columnName));
                        }
                        communicationChannel.add(communicationChannelMap);
                    }
                }
            } else {
                loginUserFlag = "";
                userCode = "";
                geoOrgCode = "";
                accCode = "";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return communicationChannel;
    }

    public HashMap<String, String> composeMessage(String composeData, String communicationChannelData, String userDetails) {
        HashMap<String, String> composeMessageResponse = new HashMap<String, String>();

        try {
            JSONParser json_parser = new JSONParser();
            JSONObject composeDataJson = (JSONObject) json_parser.parse(composeData);
            JSONObject communicationChannelDataJson = (JSONObject) json_parser.parse(communicationChannelData);
            JSONObject userDetailsJson = (JSONObject) json_parser.parse(userDetails);
            System.out.println(composeDataJson.get("subject").toString());
            String subject = composeDataJson.get("subject") != null ? (String) composeDataJson.get("subject") : "";
            String priority = composeDataJson.get("priority") != null ? (String) composeDataJson.get("priority") : "";
            String message = composeDataJson.get("message") != null ? (String) composeDataJson.get("message") : "";
            String attachedFile = composeDataJson.get("attach") != null ? (String) composeDataJson.get("attach") : "";
            String loginId = userDetailsJson.get("loginId").toString() != null ? userDetailsJson.get("loginId").toString() : "";
            String loginUserFlag = userDetailsJson.get("login_user_flag") != null ? (String) userDetailsJson.get("login_user_flag") : "";
            String userCode = userDetailsJson.get("user_code").toString() != null ? userDetailsJson.get("user_code").toString() : "";
            String channelCode = communicationChannelDataJson.get("USER_CODE").toString() != null ? communicationChannelDataJson.get("USER_CODE").toString() : "";
            String userType = communicationChannelDataJson.get("USER_TYPE").toString() != null ? communicationChannelDataJson.get("USER_TYPE").toString() : "";
            String recieveUser = channelCode;
            if (userType.equalsIgnoreCase("G")) {
            } else {
                channelCode = "";
            }
            if (loginUserFlag != null && !loginUserFlag.equalsIgnoreCase("E")) {
                userCode = loginId;
            }
            int msgId = 0;
            PreparedStatement msgIdSeq = connection.prepareStatement("select LHSSYS_msg_ID.Nextval from dual");
            ResultSet msgIdResultSet = msgIdSeq.executeQuery();
            if (msgIdResultSet != null && msgIdResultSet.next()) {
                msgId = msgIdResultSet.getInt(1);
            }
            String composeMessageQry = "INSERT INTO LHSSYS_MSG_MAST (msg_type, \n"
                    + "from_date, \n"
                    + "to_date, \n"
                    + "msg_caption, \n"
                    + "msg_str, \n"
                    + "user_code, \n"
                    + "lastupdate, \n"
                    + "approvedby, \n"
                    + "approveddate, \n"
                    + "flag, \n"
                    + "msg_id, \n"
                    + "msg_group_code, \n"
                    + "message_type, priority) VALUES ('M',sysdate,'','" + subject + "','" + message + "','" + userCode
                    + "',sysdate,'" + userCode + "',sysdate,'','" + msgId + "','" + channelCode + "','I','" + priority + "')";
            System.out.println("composeMessageQry---------->" + composeMessageQry);
            PreparedStatement composePrepare = connection.prepareStatement(composeMessageQry);
            int composeCount = composePrepare.executeUpdate();
            if (composeCount > 0) {
//                saveAttachment(String.valueOf(msgId), subject, attachedFile);
                System.out.println("Success...MSG MAST........");
                composeMessageResponse.put("resMessage", message);
                composeMessageResponse.put("status", "success");
            } else {
                System.out.println("Error in Compose Message");
                composeMessageResponse.put("resMessage", "Error");
                composeMessageResponse.put("status", "error");
            }
            if (userType.equalsIgnoreCase("G")) {
                System.out.println("------------------------------------GROUP MESSAGE-----------------------------------------");
                try {
                    CallableStatement groupMsgCall = connection.prepareCall("{call app_save_group_message(?, ?)}");
                    groupMsgCall.setString(1, recieveUser);
                    groupMsgCall.setInt(2, msgId);
                    int groupStatus = groupMsgCall.executeUpdate();
                    System.out.println("groupStatus ------- " + groupStatus);
                    if (groupStatus > 0) {
                        String attachSaveFlag = saveAttachment(String.valueOf(msgId), subject, attachedFile);
                        System.out.println("TRUE");
                        if (attachSaveFlag.equalsIgnoreCase("success")) {
                            System.out.println("Record Inserted .....");
                            composeMessageResponse.put("resMessage", message);
                            composeMessageResponse.put("status", "success");
                        } else {
                            System.out.println("Record Not Inserted .....");
                            composeMessageResponse.put("resMessage", "Not Saved");
                            composeMessageResponse.put("status", "error");
                        }
                    } else {
                        System.out.println("FALSE");
                        composeMessageResponse.put("status", "error");
                        composeMessageResponse.put("resMessage", "Not Sent");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("------------------------------------ONE TO ONE MESSAGE-----------------------------------------");
                String userMsgQry = "Insert into LHSSYS_MSG_USER(msg_id,"
                        + "user_code,"
                        + "user_type,"
                        + "message_view_flag,"
                        + "message_snooze) values('" + msgId + "','" + recieveUser + "','" + userType + "','F','F')";
                System.out.println("UserMsgQuery -----" + userMsgQry);
                PreparedStatement userMsgStmt = connection.prepareStatement(userMsgQry);
                int returnCount = userMsgStmt.executeUpdate();
                if (returnCount > 0) {
                    String attachSaveFlag = saveAttachment(String.valueOf(msgId), subject, attachedFile);
                    if (attachSaveFlag.equalsIgnoreCase("success")) {
                        System.out.println("Record Inserted .....");
                        composeMessageResponse.put("resMessage", message);
                        composeMessageResponse.put("status", "success");
                    } else {
                        System.out.println("Record Not Inserted .....");
                        composeMessageResponse.put("resMessage", "Not Saved");
                        composeMessageResponse.put("status", "error");
                    }
                } else {
                    System.out.println("Error in Insertion");
                    composeMessageResponse.put("status", "error");
                    composeMessageResponse.put("resMessage", message);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return composeMessageResponse;
    }

    public List<HashMap<String, String>> getChattingMsgList(String seqNo, String communicationChannelData, String userDetails) {
        List<HashMap<String, String>> composeMessageResponse = new ArrayList<HashMap<String, String>>();

        try {
            JSONParser json_parser = new JSONParser();
            JSONObject communicationChannelDataJson = (JSONObject) json_parser.parse(communicationChannelData);
            JSONObject userDetailsJson = (JSONObject) json_parser.parse(userDetails);
            String userCode = userDetailsJson.get("user_code") != null ? (String) userDetailsJson.get("user_code") : "";
            String loginId = userDetailsJson.get("loginId") != null ? (String) userDetailsJson.get("loginId") : "";
            String loginUserFlag = userDetailsJson.get("login_user_flag") != null ? (String) userDetailsJson.get("login_user_flag") : "";
            String channelCode = communicationChannelDataJson.get("USER_CODE") != null ? (String) communicationChannelDataJson.get("USER_CODE") : "";
            String userType = communicationChannelDataJson.get("USER_TYPE") != null ? (String) communicationChannelDataJson.get("USER_TYPE") : "";
            String endUserType = communicationChannelDataJson.get("END_USER_TYPE") != null ? (String) communicationChannelDataJson.get("END_USER_TYPE") : "";
            try {
                if (loginUserFlag != null && !loginUserFlag.equalsIgnoreCase("E")) {
                    userCode = loginId;
                }
                String qry = "SELECT sql_text, pl_sql_text, view_sql from LHSSYS_PORTAL_TABLE_DSC_UPDATE t where t.seq_no='" + seqNo + "'";
                PreparedStatement ps = connection.prepareStatement(qry);
                ResultSet rs = ps.executeQuery();
                String chattingMsgListQry = "";
                if (rs != null && rs.next()) {
                    if (userType.equalsIgnoreCase("G")) {
                        if (endUserType.equalsIgnoreCase("M")) {
                            chattingMsgListQry = rs.getString(3);
                        } else {
                            chattingMsgListQry = rs.getString(2);
                        }
                    } else {
                        chattingMsgListQry = rs.getString(1);
                    }
                    chattingMsgListQry = chattingMsgListQry.replace("'SENDER'", "'" + userCode + "'").replace("'RECEIVER'", "'" + channelCode + "'");
                    System.out.println("chatting Qry : " + chattingMsgListQry);
                    composeMessageResponse = getQueryResponse(chattingMsgListQry);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return composeMessageResponse;
    }

    public HashMap<String, String> updateMsgStatus(String communicationChannelData, String userDetails) {
        HashMap<String, String> updateMessageResponse = new HashMap<String, String>();

        try {
            JSONParser json_parser = new JSONParser();
            JSONObject communicationChannelDataJson = (JSONObject) json_parser.parse(communicationChannelData);
            JSONObject userDetailsJson = (JSONObject) json_parser.parse(userDetails);
            String loginId = userDetailsJson.get("loginId").toString() != null ? userDetailsJson.get("loginId").toString() : "";
            String loginUserFlag = userDetailsJson.get("login_user_flag") != null ? (String) userDetailsJson.get("login_user_flag") : "";
            String userCode = userDetailsJson.get("user_code").toString() != null ? userDetailsJson.get("user_code").toString() : "";
            String channelCode = communicationChannelDataJson.get("USER_CODE").toString() != null ? communicationChannelDataJson.get("USER_CODE").toString() : "";
            String userType = communicationChannelDataJson.get("USER_TYPE").toString() != null ? communicationChannelDataJson.get("USER_TYPE").toString() : "";
            if (loginUserFlag != null && !loginUserFlag.equalsIgnoreCase("E")) {
                userCode = loginId;
            }
            String updateMsgQry;
            try {
                if (userType.equalsIgnoreCase("G")) {
                    updateMsgQry = "update lhssys_msg_user u\n"
                            + "   set u.message_view_flag = 'T'\n"
                            + " where U.user_code = '" + userCode + "'\n"
                            + " AND U.message_view_flag = 'F'\n"
                            + " AND EXISTS (SELECT 1 FROM LHSSYS_MSG_MAST M WHERE M.MSG_GROUP_CODE = '" + channelCode + "'  and m.msg_id = u.msg_id)";
                } else {
                    updateMsgQry = "update lhssys_msg_user u\n"
                            + "   set u.message_view_flag = 'T'\n"
                            + " where U.user_code = '" + userCode + "' \n"
                            + "AND U.message_view_flag = 'F' \n"
                            + " AND EXISTS (SELECT 1 FROM LHSSYS_MSG_MAST M WHERE M.user_code = '" + channelCode + "'  and m.msg_id = u.msg_id)";
                }
                System.out.println("updateMsgQry  ================ > " + updateMsgQry);
                PreparedStatement msgStatusStatement = connection.prepareStatement(updateMsgQry);
                int msgUpdateCount = msgStatusStatement.executeUpdate();
                if (msgUpdateCount > 0) {
                    updateMessageResponse.put("status", "success");
                    updateMessageResponse.put("resMessage", msgUpdateCount + " Records Updated..");
                } else {
                    updateMessageResponse.put("status", "noData");
                    updateMessageResponse.put("resMessage", "No New Data");
                }
            } catch (Exception e) {
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return updateMessageResponse;
    }

    public HashMap<String, String> saveReplyMsg(String replyMsg, String msgData, String communicationChannelData, String userDetails) {
        HashMap<String, String> replyMessageResponse = new HashMap<String, String>();

        try {
            JSONParser json_parser = new JSONParser();
            JSONObject msgDataJson = (JSONObject) json_parser.parse(msgData);
            JSONObject communicationChannelDataJson = (JSONObject) json_parser.parse(communicationChannelData);
            JSONObject userDetailsJson = (JSONObject) json_parser.parse(userDetails);
            System.out.println(msgDataJson.get("MSG_CAPTION").toString());
            String subject = msgDataJson.get("MSG_CAPTION") != null ? (String) msgDataJson.get("MSG_CAPTION") : "";
            String priority = msgDataJson.get("PRIORITY") != null ? (String) msgDataJson.get("PRIORITY") : "";
            String parentMsgId = msgDataJson.get("MSG_ID") != null ? (String) msgDataJson.get("MSG_ID") : "";
//            String message = msgDataJson.get("message") != null ? (String) msgDataJson.get("message") : "";
            String message = replyMsg;
            String loginId = userDetailsJson.get("loginId").toString() != null ? userDetailsJson.get("loginId").toString() : "";
            String loginUserFlag = userDetailsJson.get("login_user_flag") != null ? (String) userDetailsJson.get("login_user_flag") : "";
            String userCode = userDetailsJson.get("user_code").toString() != null ? userDetailsJson.get("user_code").toString() : "";
            String channelCode = communicationChannelDataJson.get("USER_CODE").toString() != null ? communicationChannelDataJson.get("USER_CODE").toString() : "";
            String userType = communicationChannelDataJson.get("USER_TYPE").toString() != null ? communicationChannelDataJson.get("USER_TYPE").toString() : "";
            String recieveUser = channelCode;
            if (userType.equalsIgnoreCase("G")) {
            } else {
                channelCode = "";
            }
            if (loginUserFlag != null && !loginUserFlag.equalsIgnoreCase("E")) {
                userCode = loginId;
            }
            int msgId = 0;
            PreparedStatement msgIdSeq = connection.prepareStatement("select LHSSYS_msg_ID.Nextval from dual");
            ResultSet msgIdResultSet = msgIdSeq.executeQuery();
            if (msgIdResultSet != null && msgIdResultSet.next()) {
                msgId = msgIdResultSet.getInt(1);
            }
            String replyMessageQry = "INSERT INTO LHSSYS_MSG_MAST (msg_type, \n"
                    + "from_date, \n"
                    + "to_date, \n"
                    + "msg_caption, \n"
                    + "msg_str, \n"
                    + "user_code, \n"
                    + "lastupdate, \n"
                    + "approvedby, \n"
                    + "approveddate, \n"
                    + "flag, \n"
                    + "msg_id, \n"
                    + "msg_group_code, \n"
                    + "message_type, priority, PARENT_MSG_ID) VALUES ('M',sysdate,'','" + subject + "','" + message + "','" + userCode
                    + "',sysdate,'" + userCode + "',sysdate,'','" + msgId + "','" + channelCode + "','I','" + priority + "','" + parentMsgId + "')";
            System.out.println("composeMessageQry---------->" + replyMessageQry);
            PreparedStatement replyMsgPrepare = connection.prepareStatement(replyMessageQry);
            int replyCount = replyMsgPrepare.executeUpdate();
            if (replyCount > 0) {
                System.out.println("Success...MSG MAST..REPLY......");
                replyMessageResponse.put("resMessage", message);
                replyMessageResponse.put("status", "success");
            } else {
                System.out.println("Error in Compose Message");
                replyMessageResponse.put("resMessage", "Error");
                replyMessageResponse.put("status", "error");
            }
            if (userType.equalsIgnoreCase("G")) {
                System.out.println("------------------------------------GROUP MESSAGE-----------------------------------------");
                try {
                    CallableStatement groupMsgCall = connection.prepareCall("{call app_save_group_message(?, ?)}");
                    groupMsgCall.setString(1, recieveUser);
                    groupMsgCall.setInt(2, msgId);
                    int groupStatus = groupMsgCall.executeUpdate();
                    System.out.println("groupStatus ------- " + groupStatus);
                    if (groupStatus > 0) {
                        System.out.println("TRUE");
                        replyMessageResponse.put("status", "success");
                        replyMessageResponse.put("resMessage", "Successfully Sent");
                    } else {
                        System.out.println("FALSE");
                        replyMessageResponse.put("status", "error");
                        replyMessageResponse.put("resMessage", "Not Sent");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("------------------------------------ONE TO ONE MESSAGE-----------------------------------------");
                String userMsgQry = "Insert into LHSSYS_MSG_USER(msg_id,"
                        + "user_code,"
                        + "user_type,"
                        + "message_view_flag,"
                        + "message_snooze) values('" + msgId + "','" + recieveUser + "','" + userType + "','F','F')";
                System.out.println("UserMsgQuery -----" + userMsgQry);
                PreparedStatement userMsgStmt = connection.prepareStatement(userMsgQry);
                int returnCount = userMsgStmt.executeUpdate();
                if (returnCount > 0) {
                    System.out.println("Record Inserted .....");
                    replyMessageResponse.put("resMessage", message);
                    replyMessageResponse.put("status", "success");
                } else {
                    System.out.println("Error in Insertion");
                    replyMessageResponse.put("status", "error");
                    replyMessageResponse.put("resMessage", message);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return replyMessageResponse;
    }

    /**
     * Required Functions for Getting Table Response with Column Headers *
     */
    public List<HashMap<String, String>> getQueryResponse(String qry) {
        List<HashMap<String, String>> responseDataList = new ArrayList<HashMap<String, String>>();
        HashMap<String, String> responseData;
        try {
            PreparedStatement ps = connection.prepareStatement(qry);
            ResultSet rs = ps.executeQuery();
            ResultSetMetaData rsmd = rs.getMetaData();
            ArrayList<String> rsmdList = new ArrayList<String>();
            int columnCout = rsmd.getColumnCount();
            for (int i = 1; i <= columnCout; i++) {
                rsmdList.add(rsmd.getColumnName(i));
            }
            if (rs != null) {
                while (rs.next()) {
                    responseData = new HashMap<String, String>();
                    for (String columnName : rsmdList) {
                        responseData.put(columnName, rs.getString(columnName));
                    }
                    responseDataList.add(responseData);
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
        return responseDataList;
    }

    public String saveAttachment(String msgId, String subject, String attachedFile) {
        String saveStatus = "";
        System.out.println(attachedFile);
        if (attachedFile != null) {
            System.out.println("TEST......");
            try {
                InputStream iss = null;
                String base64Img = attachedFile;
                byte[] imageByts = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Img);
                iss = new ByteArrayInputStream(imageByts);
                System.out.println("ISS : " + iss);
                String attachQry = "INSERT INTO lhssys_msg_attachment(MSG_ID,SLNO, ATTACHMENT_NAME,ATTACHMENT_PATH,ATTACHMENT) VALUES (?,?,?,?,?)";
                PreparedStatement attachPrepare = connection.prepareStatement(attachQry);
                attachPrepare.setString(1, msgId);
                attachPrepare.setString(2, "1");
                attachPrepare.setString(3, subject);
                attachPrepare.setString(4, "LCOM IMAGE");
                attachPrepare.setBinaryStream(5, iss, iss.available());
                int attachCount = attachPrepare.executeUpdate();
                if (attachCount > 0) {
                    saveStatus = "success";
                } else {
                    saveStatus = "error";
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return saveStatus;
    }

    public HashMap<String, Object> getAttachedImage(String msgId, String slno) {
        HashMap<String, Object> attachedResponse = new HashMap<String, Object>();
        try {
            String attachmentQry = "SELECT attachment from lhssys_msg_attachment a where a.msg_id = '" + msgId + "'";
            System.out.println("MSG ID :" + msgId);
            InputStream attachedIss = null;
            PreparedStatement ps = connection.prepareStatement(attachmentQry);
            ResultSet rs = ps.executeQuery();
            while (rs != null && rs.next()) {
                attachedIss = rs.getBlob(1).getBinaryStream();
                attachedResponse.put("attachedImage", Util.getImgstreamToBytes(attachedIss));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return attachedResponse;
    }
}
