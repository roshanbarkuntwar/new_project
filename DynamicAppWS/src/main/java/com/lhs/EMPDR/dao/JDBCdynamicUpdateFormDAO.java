/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCdynamicUpdateFormDAO {

    Connection connection;
    HashMap<String, String> values = new HashMap<String, String>();//col name,col value
    HashMap<String, byte[]> imgMap = new HashMap<String, byte[]>();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    HashMap<String, String> columnTableName = new HashMap<String, String>();
    ArrayList<String> fileId = new ArrayList<String>();
    String table_name;
    String sysdate = null;
    String imgDataType = "LONG";
    String[] UPDATE_KEY = null;//use as a primary key
    String newFormInstance = "";

    public JDBCdynamicUpdateFormDAO(Connection connection) {
        this.connection = connection;
    }
    String USER_CODE = "";

    public RecordInfoJSON getRecordDetailForUpdateForm(String seqNo, String userCode, String updateKey) throws SQLException {
        Date sysdate = new Date();
        USER_CODE = userCode.toUpperCase();

        SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
        String formattedDate = formatter.format(sysdate);
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        list = getDetailOfEntry("LONG", seqNo, updateKey, userCode);
        RecordInfoJSON json = new RecordInfoJSON();
        json.setRecordsInfo(list);
        json.setNewFormInstance(newFormInstance);
        return json;
    }

    public List<DyanamicRecordsListModel> getDetailOfEntry(String imgDataType, String seq_no, String updateKey, String userCode) throws SQLException {
        //getValueOfEntry(seq_id);
        // Date sysdate = new Date();
        imgDataType = "BLOB";
        USER_CODE = userCode.toUpperCase();
        this.imgDataType = imgDataType;
        String EMPCODE = "";
        // SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        // String formattedDate = formatter.format(sysdate);
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql = new StringBuffer();
        String newFormInstanceQuery = "";

        sql.append("select u.*,TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS') as systemdate,t.dependent_next_entry_seq ,t.update_key, t.new_form_instance"
                + " from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql.append("u.seq_no=" + seq_no + " and t.seq_no=" + seq_no + " order by u.column_slno");
        System.out.println("GET UPDATE ENTRY DETAILS SQL : " + sql.toString());
        System.out.println("UPDATE KEY VALUE : " + updateKey);
        List<DyanamicRecordsListModel> list = new ArrayList<DyanamicRecordsListModel>();
        try {

            PreparedStatement ps9 = connection.prepareStatement("SELECT EMP_CODE from USER_MAST U WHERE U.USER_CODE ='" + userCode + "'");
            ResultSet rs9 = ps9.executeQuery();
            if (rs9 != null && rs9.next()) {
                EMPCODE = rs9.getString(1);
            }
            System.out.println("EMP_CODE = " + EMPCODE);

            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                try {
                    newFormInstanceQuery = rs.getString("new_form_instance");
                    if (newFormInstanceQuery != null && !newFormInstanceQuery.isEmpty() && !newFormInstanceQuery.equals("")) {
                        newFormInstanceQuery = newFormInstanceQuery.replace("'USER_CODE'", "'" + USER_CODE + "'").replace("'EMPCODE'", "'" + EMPCODE + "'");
                        System.out.println("newFormInstanceQuery: " + newFormInstanceQuery);
                        try {
                            PreparedStatement ps2 = connection.prepareStatement(newFormInstanceQuery);
                            ResultSet rsNewForm = ps2.executeQuery();
                            if (rsNewForm != null && rsNewForm.next()) {
                            } else {
                            }
                        } catch (Exception e) {
//                        U.log("New Form Instance Exception !!" + e.getMessage());
                            String ValidatedMsgArr[] = e.getMessage().split(":");
                            String ValidatedMsgArr1[] = ValidatedMsgArr[1].trim().split("ORA-");
                            newFormInstance = ValidatedMsgArr1[0].trim();
//                        System.out.println("newFormInstance 1" + newFormInstance);
                        }
                    } else {
                        newFormInstance = "T#OK";
                    }
                } catch (Exception e) {
//                    e.printStackTrace();
                    U.log("NEW FORM INSTANCE NOT FOUND..!");
                    newFormInstance = "T#OK";
                }
                do {
                    DyanamicRecordsListModel model = new DyanamicRecordsListModel();

                    table_name = rs.getString("table_name");
                    displayColList.put(rs.getString("column_name"), rs.getString("column_type"));
                    sysdate = rs.getString("systemdate");
                    String keyArr = rs.getString("update_key");
                    columnTableName.put(rs.getString("column_name"), rs.getString("table_name"));
//                    System.out.println("UPDATE_KEY : " + keyArr);
                    if (keyArr != null && !keyArr.isEmpty()) {
                        UPDATE_KEY = keyArr.split("#");
                    }
                    model.setColumn_desc(rs.getString("column_desc"));
                    model.setColumn_name(rs.getString("Column_name"));
                    model.setColumn_type(rs.getString("Column_type"));
                    model.setREF_LOV_TABLE_COL(rs.getString("Ref_lov_table_col"));
                    model.setSLNO(rs.getString("SLNO"));
                    String column_catg = (rs.getString("Column_catg"));
                    if (column_catg != null) {
                        ps = connection.prepareStatement("select " + column_catg + " columnHeading from dual");
                        ResultSet rs1 = ps.executeQuery();
                        if (rs1 != null && rs1.next()) {
                            do {
                                column_catg = rs1.getString("columnHeading");

                            } while (rs1.next());
                        }
                    } else {
                        column_catg = "";
                    }

                    model.setColumn_catg(column_catg);
                    model.setColumn_default_value(rs.getString("Column_default_value"));
                    model.setColumn_size(rs.getString("Column_size"));
                    model.setEntry_by_user(rs.getString("Entry_by_user"));
                    model.setNullable(rs.getString("Nullable"));
                    model.setStatus(rs.getString("Status"));
                    model.setTable_name(rs.getString("Table_name"));
                    model.setUpdation_process(rs.getString("Updation_process"));
                    model.setItem_help_property(rs.getString("item_help_property"));
                    model.setREF_LOV_WHERE_CLAUSE(rs.getString("REF_LOV_WHERE_CLAUSE"));
                    model.setColumn_select_list_value(rs.getString("column_select_list_value"));
                    model.setDependent_row_logic(rs.getString("Dependent_row_logic"));
                    model.setFrom_value(rs.getString("From_value"));
                    model.setTo_value(rs.getString("To_value"));
                    model.setEditor_flag(rs.getString("Editor_flag"));
                    model.setExcel_upload(rs.getString("Excel_upload"));
                    model.setDecimal_digit(rs.getString("Decimal_digits"));
                    model.setTool_tip(rs.getString("Tool_tip"));
//                    model.setColumn_validate(rs.getString("column_validate"));
                    model.setDependent_nulable_logic(rs.getString("dependent_nulable_logic"));
                    model.setHeading_flag(rs.getString("heading_flag"));
                    model.setAuto_calculation(rs.getString("auto_calculation"));
                    model.setDependent_next_entry_seq(rs.getString("dependent_next_entry_seq"));
                    model.setSession_column_flag(rs.getString("session_column_flag"));
                    model.setDependent_column_name(rs.getString("dependent_column_name"));
                    if (rs.getString("dependent_row") != null) {
                         String dependentRowArray[] = rs.getString("dependent_row").split("#");

                        String dependentRowString = "";
                        for (int i = 0; i < dependentRowArray.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + dependentRowArray[i];
                            } else {
                                dependentRowString = dependentRowString + dependentRowArray[i];
                            }
                        }
                        String sql1 = "select column_name from LHSSYS_PORTAL_DATA_DSC_UPDATE where seq_no = " + seq_no
                                + " AND slno in (" + dependentRowString + ")";
                        System.out.println("dependent row query==>" + sql1);
                        ps = connection.prepareStatement(sql1);
                        ResultSet RS = ps.executeQuery();
                        if (RS != null && RS.next()) {
                            model.setDependent_row(RS.getString("column_name"));
                        }
                    } else {
                        model.setDependent_row(rs.getString("dependent_row"));
                    }

                    //for drop down
                    if (rs.getString("item_help_property").contains("H") || rs.getString("item_help_property").contains("D")) {
                        String selectquery = rs.getString("column_select_list_value");
                        if (selectquery != null) {
                            selectquery = selectquery.replace("USER_CODE", userCode);
                        }
                        selectquery = "select " + selectquery + " from dual";
                        PreparedStatement ps2 = connection.prepareStatement(selectquery);
                        ResultSet rs2 = ps2.executeQuery();
                        if (rs2 != null && rs2.next()) {
                            model.setDropdownVal(rs2.getString(1));
                        }
                    } else if (rs.getString("item_help_property") != null && rs.getString("item_help_property").contains("AS")) {
                        JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(connection);
                        String autoCompleteString = dao.getAutoCompleteData(seq_no, rs.getString("Column_name"), "", userCode);
                        model.setDropdownVal(autoCompleteString);
                    }
                    if (rs.getString("Column_DESC").toLowerCase().contains("Entry Format Seq".toLowerCase())) {
                        model.setValue(rs.getString("Column_default_value"));
                    } else if (rs.getString("Column_default_value") != null) {
                        String defaultValue = rs.getString("Column_default_value");
                        if (defaultValue.equalsIgnoreCase("sysdate") || defaultValue.equalsIgnoreCase("'sysdate'")) {
                            model.setValue(sysdate);
                        } else if (defaultValue.contains("USER_CODE")) {
                            model.setValue(USER_CODE);
                        } else if (defaultValue.contains("EMP_CODE")) {
                            String getEMPCODE_SQL = "select EMP_CODE from user_mast where user_code='" + USER_CODE + "'";
                            Statement st = connection.createStatement();
                            ResultSet defaultRs = st.executeQuery(getEMPCODE_SQL);
                            String EMP_CODE = "";
                            if (defaultRs != null && defaultRs.next()) {
                                EMP_CODE = defaultRs.getString(1);
                                model.setValue(EMP_CODE);
                            }
                        } else if (defaultValue.contains("(")
                                && defaultValue.contains(")")
                                && !defaultValue.contains("get_generate_code_TBL")) {
                            String projectSql = "select " + defaultValue + " from dual";

                            System.out.println("sqlll==" + projectSql);
                            Statement st = connection.createStatement();
                            ResultSet defaultRs = st.executeQuery(projectSql);
                            String retailer_seq = "";
                            if (defaultRs != null && defaultRs.next()) {
                                retailer_seq = defaultRs.getString(1);
                                U.log("DEFAULT VALUE GENARTED USING Column_default_value DUAL  : " + retailer_seq);
                            }
                            if (retailer_seq != null && !retailer_seq.isEmpty()) {
                                if (retailer_seq.contains("~")) {
                                    model.setValue(retailer_seq.split("~")[0].trim());
                                    model.setCodeOfValue(retailer_seq.split("~")[1].trim());
                                } else {
                                    model.setValue(retailer_seq);
                                }
                            } else {
                                model.setValue("");
                            }
//                        
                        } else if (defaultValue.contains("ACC_FOLLOW_TRAN_SEQ")) {
                            String seqSql = "select acc_follow_tran_seq.nextval from dual";
                            String seq = "";
                            try {
                                PreparedStatement ps1 = connection.prepareStatement(seqSql);
                                ResultSet rs1 = ps1.executeQuery();
                                if (rs1.next()) {
                                    seq = rs1.getString(1);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            model.setValue(seq);
                        } else if (defaultValue != null) {
                            model.setValue(rs.getString("Column_default_value"));
                        }
                    }
                    if (rs.getString("column_validate") != null && rs.getString("DATA_SAVE_ERROR_MESSAGE") != null) {
                        String dependentRowColumn = "";
                        String columnValidateSQL = rs.getString("column_validate");
                        String columnValidateArrCols[] = null;
                        String columnValidateArr[] = null;
                        if (columnValidateSQL.contains("~~")) {
                            columnValidateArr = columnValidateSQL.split("~~");
                            columnValidateArrCols = columnValidateArr[1].split("#");
                            dependentRowColumn = columnValidateArr[1];
                        } else {
                            columnValidateArrCols = rs.getString("DATA_SAVE_ERROR_MESSAGE").split("#");
                        }

                        String dependentRowString = "";
                        for (int i = 0; i < columnValidateArrCols.length; i++) {
                            if (i != 0) {
                                dependentRowString = dependentRowString + "," + columnValidateArrCols[i];
                            } else {
                                dependentRowString = dependentRowString + columnValidateArrCols[i];
                            }
                        }
                        String sqlValidate = "select column_name, slno from LHSSYS_PORTAL_DATA_DSC_UPDATE where slno in \n"
                                + "(" + dependentRowString + ") and seq_no=" + seq_no;
                        System.out.println("columnValidateArrColsSQL : " + sql);

                        PreparedStatement preparedStatement = connection.prepareStatement(sqlValidate);
                        ResultSet resultSet = preparedStatement.executeQuery();
                        int count = 0;
                        if (resultSet != null && resultSet.next()) {
                            do {
                                for (int i = 0; i < columnValidateArrCols.length; i++) {
                                    if (columnValidateArrCols[i].equalsIgnoreCase(resultSet.getString("slno"))) {
                                        columnValidateArrCols[i] = resultSet.getString("column_name");
                                    }
                                }
                                if (count != 0) {
                                    dependentRowColumn = dependentRowColumn + "#" + resultSet.getString("column_name");
                                } else {
                                    dependentRowColumn = resultSet.getString("column_name");
                                }
                                count++;
                            } while (resultSet.next());
                        }

                        String val = "";
                        for (int i = 0; i < columnValidateArrCols.length; i++) {
                            if (i != 0) {
                                val = val + "#" + columnValidateArrCols[i];
                            } else {
                                val = columnValidateArrCols[i];
                            }
                        }
                        model.setColumn_validate(val);
                    } else {
                        model.setColumn_validate(rs.getString("column_validate"));
                    }
                    String status = rs.getString("Status");
                    if (rs.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            rs.close();
            ps.close();
        }

        // if(dependentSeqNo!=null){
        getValueOfEntry(updateKey + "", list);

        for (Map.Entry m : values.entrySet()) {
//            System.out.println(m.getKey() + " " + m.getValue());
        }
        try {
            for (int j = 0; j < list.size(); j++) {
                DyanamicRecordsListModel model = list.get(j);
                if (model.getColumn_type().contains("IMG") || model.getColumn_type().contains("VIDEO")) {
                    if (columnTableName.get(model.getColumn_name()).contains("DOC_TRAN")) {
                        model.setValue(Base64.encode(imgMap.get(model.getColumn_name())));
                    } else {
                        String file_id = values.get(model.getColumn_name());
                        model.setValue(Base64.encode(imgMap.get(file_id)));
                    }
                } else //   if(!model.getColumn_name().contains("COL6"))
                //    {
                /*  if (model.getREF_LOV_TABLE_COL() != null) {
                String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' || TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                        + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n"
                        + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) = \n"
                        + "       UPPER('" + model.getREF_LOV_TABLE_COL() + "')";

                U.log("refLocSql==" + refLocSql);
                String codeSql = "";
                try {
                    ps = connection.prepareStatement(refLocSql);
                    rs = ps.executeQuery();
                    String whereclause = "";
                    if (rs != null && rs.next()) {
                        U.log("before append codeSQL==" + rs.getString(1));
                        whereclause = values.get(model.getColumn_name());
                        if (whereclause != null && whereclause.contains("#")) {
                            whereclause = whereclause.split("#")[0];
                        }
                        codeSql = rs.getString(1) + "'" + whereclause + "'";

                    }
                    U.log("codeSql=" + codeSql);

                    String val = SqlUtil.findLovValue(codeSql, whereclause, connection);

                    if (model.getItem_help_property() != null && !model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setCodeOfValue(whereclause);
                        model.setValue(val);
                    } else if (model.getItem_help_property() != null && model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setValue(whereclause);
                    }
                } catch (Exception e) {
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException e) {
                        }
                    }
                }
            } //  }
            else //  if(values.get(model.getColumn_default_value())!=null&&!values.get(model.getColumn_default_value()).contains("sysdate"))
            {*/ if (values.get(model.getColumn_name()) != null && !model.getColumn_name().contains("LASUPDATE")) {
                    model.setValue(values.get(model.getColumn_name()));
                }

                if (model.getColumn_type() != null && model.getColumn_type().equalsIgnoreCase("DATE")) {
                    model.setValue(values.get(model.getColumn_name()).split(" ")[0]);
                }
                if (model.getColumn_type() != null && model.getColumn_type().equalsIgnoreCase("DATETIME")) {
                    if (values.get(model.getColumn_name()) != null && !values.get(model.getColumn_name()).isEmpty()) {
                        model.setValue(values.get(model.getColumn_name()));
                    }
                }

                //for code-value
                /*   if (model.getItem_help_property().contains("H") && model.getColumn_select_list_value() != null) {
                    System.out.println(userCode + "===" + model.getColumn_name() + "=null values==" + values.get(model.getColumn_name()));
                    String val = SqlUtil.getValue(connection, values.get(model.getColumn_name()), model.getColumn_select_list_value(), userCode);

                    U.log("value of H===" + val);
                    model.setValue(val);

                }

            }*/
            }
        } catch (Exception e) {
        }
        // }
        return list;
    }

    public void getValueOfEntry(String upadteKeyValue, List<DyanamicRecordsListModel> list) {
        InputStream imgStream = null;
        PreparedStatement ps = null;
        ResultSet rs;
        StringBuffer sql = new StringBuffer();
        U.log("table name : " + table_name);
        U.log("update key : " + UPDATE_KEY);
        sql.append("select * from " + table_name + " where 1=1");
        String upadteKeyValueArr[] = UPDATE_KEY;
        if (upadteKeyValue != null && !upadteKeyValue.isEmpty()) {
            upadteKeyValueArr = upadteKeyValue.split("#");
        }

        String[] upadteKeyTypeArr = new String[UPDATE_KEY.length];

        for (DyanamicRecordsListModel model : list) {
            for (int i = 0; i < UPDATE_KEY.length; i++) {
                if (model.getColumn_name().equalsIgnoreCase(UPDATE_KEY[i])) {
                    upadteKeyTypeArr[i] = model.getColumn_type();
                }
            }
        }

        for (int i = 0; i < UPDATE_KEY.length; i++) {
            try {
                if (upadteKeyTypeArr[i] != null && !upadteKeyTypeArr[i].isEmpty()) {
                    if (upadteKeyTypeArr[i].equalsIgnoreCase("DATE")) {
                        sql.append(" and " + UPDATE_KEY[i] + "=to_date('" + upadteKeyValueArr[i] + "','dd-mm-rrrr')");
                    } else if (upadteKeyTypeArr[i].equalsIgnoreCase("DATETIME")) {
                        sql.append(" and " + UPDATE_KEY[i] + "=to_date('" + upadteKeyValueArr[i] + "','dd-mm-rrrr HH:mm:ss')");
                    } else {
                        sql.append(" and " + UPDATE_KEY[i] + "='" + upadteKeyValueArr[i] + "'");
                    }
                } else {
                    sql.append(" and " + UPDATE_KEY[i] + "='" + upadteKeyValueArr[i] + "'");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        U.log("entry detail sql : " + sql.toString());

        try {

            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
//            int year = 2014, month = 10, day = 31;
//            Calendar cal = Calendar.getInstance();
//            cal.set(Calendar.YEAR, year);
//            cal.set(Calendar.MONTH, month - 1); // <-- months start at 0.
//            cal.set(Calendar.DAY_OF_MONTH, day);

            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            if (rs != null && rs.next()) {
                do {
                    for (int i = 1; i <= columnCount; i++) {
                        String colmnName = md.getColumnName(i);
                        String columnType = md.getColumnTypeName(i);
                        if (displayColList.get(colmnName) != null) {
                            if (!displayColList.get(colmnName).contains("IMG")) {
                                values.put(colmnName, rs.getString(colmnName));
                            } else {
                                values.put(colmnName, rs.getString(colmnName));
                                fileId.add(rs.getString(colmnName));
                            }
                        }
                        if (columnType.equalsIgnoreCase("date")) {
//                            try {
//                                java.sql.Date dbSqlDate = rs.getDate(colmnName);
//                                values.put(colmnName, sdf.format(dbSqlDate));
//                                System.out.println("columnType---> " + columnType + " dbSqlDate--> " + sdf.format(dbSqlDate));
//                            } catch (Exception e) {
////                                e.printStackTrace();
//                                System.out.println("ERORR--> " + e.getMessage());
//                            }

                            try {
                                java.util.Date date;
                                Timestamp timestamp = rs.getTimestamp(colmnName);
                                if (timestamp != null) {
                                    date = new java.util.Date(timestamp.getTime());
                                    values.put(colmnName, sdf.format(date));
                                    System.out.println("columnType---> " + colmnName + " dbSqlDate--> " + sdf.format(date));
                                } else {
                                    java.sql.Date dbSqlDate = rs.getDate(colmnName);
                                    values.put(colmnName, sdf.format(dbSqlDate));
                                    System.out.println("columnType---> " + colmnName + " dbSqlDate--> " + sdf.format(dbSqlDate));
                                }
                            } catch (Exception e) {
                                System.out.println("SET DATE VALUE EXCEPTION :" + e.getMessage());
                            }
                        }
                    }
                } while (rs.next());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        StringBuffer imgSql = new StringBuffer();
        if (fileId.size() > 0) {
            if (table_name.equalsIgnoreCase("lhssys_portal_app_tran")) {
                imgSql.append("select * from lhssys_portal_upload_file where 1=1 ");
                for (int i = 0; i < fileId.size(); i++) {
                    imgSql.append(" or file_id=").append(fileId.get(i));
                }
                byte img[];
                try {
                    ps = connection.prepareStatement(imgSql.toString());
                    rs = ps.executeQuery();
                    if (rs != null && rs.next()) {
                        do {
                            if (rs.getBinaryStream("STORE_FILE") != null) {
                                imgStream = rs.getBinaryStream("STORE_FILE");
                            } else {
                                imgStream = getClass().getResourceAsStream("/defualtDp.png");
                            }
                            imgMap.put(rs.getString("File_id"), Util.getImgstreamToBytes(imgStream));
                        } while (rs.next());
                    }
                } catch (Exception e) {
                } finally {
                    if (ps != null) {
                        try {
                            ps.close();
                        } catch (SQLException e) {
                        }
                    }
                }
            }
        }
        //---------------------------------------  
        Set<String> keySet = columnTableName.keySet();
        Iterator<String> iterator = keySet.iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            String imgColumnTableName = columnTableName.get(key);
            if (imgColumnTableName != null && !imgColumnTableName.isEmpty()) {
                if (imgColumnTableName.contains("DOC_TRAN")) {
                    String doc_code = imgColumnTableName.split("~")[1];
                    String img_sql = "SELECT DD.*, D.DOC_DESC FROM doc_tran D, doc_tran_image DD WHERE"
                            + " D.USER_CODE = '" + USER_CODE + "' "
                            + " AND D.DOC_CODE = " + values.get(doc_code)
                            + " AND DD.DOC_CODE = D.DOC_CODE AND DD.DOC_SLNO = D.DOC_SLNO";
                    try {
                        System.out.println("img_sql--> " + img_sql);
                        ps = connection.prepareStatement(img_sql);
                        rs = ps.executeQuery();

                        if (rs != null && rs.next()) {
                            do {
                                if (rs.getBinaryStream("doc_image") != null) {
                                    imgStream = rs.getBinaryStream("doc_image");
                                }
                                imgMap.put(key, Util.getImgstreamToBytes(imgStream));
                                System.out.println("imgMap.put --> " + key);
                            } while (rs.next());
                        }

                    } catch (SQLException ex) {
                        Logger.getLogger(JDBCdynamicUpdateFormDAO.class.getName()).log(Level.SEVERE, null, ex);
                    }

                } else {

                }
            }
        }
        //---------------------------------------  
    }

}
