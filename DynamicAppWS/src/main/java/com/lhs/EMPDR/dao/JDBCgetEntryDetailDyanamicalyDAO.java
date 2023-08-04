/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.EntryDetailDynamicModel;
import com.lhs.EMPDR.utility.SqlUtil;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCgetEntryDetailDyanamicalyDAO {

    Connection connection;
    String user_code;

    public JDBCgetEntryDetailDyanamicalyDAO(Connection connection) {
        this.connection = connection;
    }

    HashMap<String, String> values = new HashMap<String, String>();//col name,col value
    HashMap<String, byte[]> imgMap = new HashMap<String, byte[]>();
    HashMap<String, String> displayColList = new HashMap<String, String>();
    ArrayList<String> fileId = new ArrayList<String>();
    String table_name;
    String UPDATE_KEY;

    public List<EntryDetailDynamicModel> getDetailOfEntry(String seq_no, String updateKey) {
        List<EntryDetailDynamicModel> list = new ArrayList<EntryDetailDynamicModel>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer sql = new StringBuffer();
        sql.append("select u.*,t.update_key from lhssys_portal_data_dsc_update u,lhssys_portal_table_dsc_update t where ");
        sql.append("u.seq_no=" + seq_no + " and t.seq_no=" + seq_no + " ORDER BY U.COLUMN_SLNO");
        System.out.println("sql=="+sql);
        try {

            ps = connection.prepareStatement(sql.toString());

            rs = ps.executeQuery();

            if (rs != null && rs.next()) {

                do {
                    EntryDetailDynamicModel model = new EntryDetailDynamicModel();
                    table_name = rs.getString("table_name");
                    UPDATE_KEY = rs.getString("update_key");
                    displayColList.put(rs.getString("column_name"), rs.getString("column_type"));
                    model.setColumn_desc(rs.getString("column_desc"));
                    model.setColumn_name(rs.getString("Column_name"));
                    model.setColumn_type(rs.getString("Column_type"));
                    model.setRef_lov_table_col(rs.getString("Ref_lov_table_col"));
                    model.setItem_help_property(rs.getString("Item_help_property"));
                    model.setColumn_select_list_value(rs.getString("column_select_list_value"));
//                    if (rs.getString("Column_type").contains("IMG")) {
//                        String file_id=values.get(rs.getString("column_name"));
//                        model.setImg(imgMap.get(file_id));
//                    } else {
//                        model.setValue(values.get(rs.getString("column_name")));
//                    }

                    String status = rs.getString("Status");

                    if (rs.getString("Status") != null && !status.contains("F")) {
                        list.add(model);
                    }

                } while (rs.next());
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            try {
                rs.close();
            } catch (SQLException ex) {
                Logger.getLogger(JDBCgetEntryDetailDyanamicalyDAO.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                ps.close();
            } catch (SQLException ex) {
                U.log("error"+ex);
            }
        }
        

        getValueOfEntry(updateKey, seq_no);

        for (Map.Entry m : values.entrySet()) {
//            System.out.println(m.getKey() + " " + m.getValue());
        }
        for (int j = 0; j < list.size(); j++) {
            EntryDetailDynamicModel model = list.get(j);
            if (model.getColumn_type().contains("IMG")) {
                String file_id = values.get(model.getColumn_name());
                model.setImg(imgMap.get(file_id));
            } else {
                //   if(!model.getColumn_name().contains("COL6"))
                //    {
              /*  if (model.getRef_lov_table_col() != null) {
                    String refLocSql = " SELECT 'SELECT DISTINCT ' || DISPLAY_VALUE || ' FROM ' || TABLE_NAME || ' WHERE 1=1 ' || 'AND '|| column_name||' = '\n"
                            + "        FROM VIEW_PORTAL_UPLOAD_TBL_LOV_GEN\n"
                            + " WHERE UPPER(TRIM(TABLE_NAME || '.' || COLUMN_NAME)) = \n"
                            + "       UPPER('" + model.getRef_lov_table_col() + "')";

                    U.log("refLocSql :  " + refLocSql);
                    String codeSql = "";
                    String whereclause = "";
                    try {
                        ps = connection.prepareStatement(refLocSql);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            U.log("before append codeSQL  :  " + rs.getString(1));
                            whereclause = values.get(model.getColumn_name());
//                            U.log("whereclause column Name : " + model.getColumn_name() + "     whereclause value : " + values.get(model.getColumn_name()));
                            U.log("FETCH LOV VALUE SQL : " + rs.getString(1));
                            if (whereclause.contains("#")) {
                                whereclause = whereclause.split("#")[0];
                            }
                            codeSql = rs.getString(1) + "'" + whereclause + "'";

                        }
                    } catch (Exception e) {
                        U.log(e);
                    }
                    U.log("codeSql=" + codeSql);
                    U.log("whereclause=" + whereclause);
                    findLovValue(codeSql);

                    if (model.getItem_help_property() != null && !model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setValue(findLovValue(codeSql));
                    } else if (model.getItem_help_property() != null && model.getItem_help_property().equalsIgnoreCase("AS")) {
                        model.setValue(whereclause);
                    }

                } //  }
                else {
                    if (model.getItem_help_property().contains("H") && model.getColumn_select_list_value() != null) {
                        try {
//                            U.log("*****" + values.get(model.getColumn_name()) + "::::::" + model.getColumn_name());

//                            System.out.println(model.getColumn_name() + "=null values==" + values.get(model.getColumn_name()));
                            String val;
                            val = SqlUtil.getValue(connection, values.get(model.getColumn_name()), model.getColumn_select_list_value(), user_code);
//                            U.log("value of H===" + val);
                            model.setValue(val);
                        } catch (SQLException ex) {
                        }
                    } else {*/
                        model.setValue(values.get(model.getColumn_name()));
                   /* }
                }*/
            }
        }
        return list;
    }

    public void getValueOfEntry(String updateKeyValue, String seq_no) {
        InputStream imgStream = null;
        PreparedStatement ps;
        ResultSet rs;
        StringBuffer sql = new StringBuffer();
        U.log("table name : " + table_name);
        sql.append("select * from " + table_name + " where ROWNUM = 1 AND ");
        sql.append(UPDATE_KEY + " = '" + updateKeyValue + "'");//+" and dynamic_table_seq_id="+seq_no);
        System.out.println("GET ENTRY DETAILS SQL :  " + sql.toString());
        try {
            ps = connection.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            int columnCount = md.getColumnCount();
            if (rs != null && rs.next()) {
                do {
                    for (int i = 1; i <= columnCount; i++) {
                        String colmnName = md.getColumnName(i);
                        if (colmnName.contains("USER_CODE")) {
                            user_code = rs.getString(colmnName);
                        }
                        if (displayColList.get(colmnName) != null) {
                            if (!displayColList.get(colmnName).contains("IMG")) {
//                                U.log("colmnName::::" + colmnName + "  " + rs.getString(colmnName));
                                values.put(colmnName, rs.getString(colmnName));
                            } else {
//                                U.log("colmnName::::" + colmnName + "  " + rs.getString(colmnName));
                                values.put(colmnName, rs.getString(colmnName));
                                fileId.add(rs.getString(colmnName));

                            }
                        }
                    }
                } while (rs.next());

            }
        } catch (Exception e) {
            U.log(e);
        }
        String imgSql ="";
        U.log("fileId=" + fileId.size());
        if (fileId.size() > 0) {

            imgSql = "select * from lhssys_portal_upload_file where 1=1 ";
            for (int i = 0; i < fileId.size(); i++) {
                imgSql.concat(" or file_id=" + fileId.get(i));
            }

            U.log("GET IMAGE SQL : " + imgSql);

            byte img[];
            try {
                ps = connection.prepareStatement(imgSql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    do {
                        if (rs.getBinaryStream("STORE_FILE") != null) {
                            imgStream = rs.getBinaryStream("STORE_FILE");
//                        if (rs.getBinaryStream("store_file") != null) {
//                            imgStream = rs.getBinaryStream("store_file");
                        } else {
                            imgStream = getClass().getResourceAsStream("/defualtDp.png");
                        }
                        //imgMap.put(colmnName,);

                        //  Blob b = rs.getBlob(2);
                        //  byte barr[] = new byte[(int)b.length()]; //create empty array
                        //  barr = b.getBytes(1,(int)b.length());
//   FileOutputStream fout = new FileOutputStream("D:\\photo\\sonoo"+rs.getString("File_id")+".jpg");
//   fout.write(Util.getImgstreamToBytes(imgStream));
//fout.close();
                        imgMap.put(rs.getString("File_id"), Util.getImgstreamToBytes(imgStream));
                    } while (rs.next());
                }
            } catch (Exception e) {
                U.log(e);
            }
        }
    }

    public String findLovValue(String sql) {
        String code = "";
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                code = rs.getString(1);
            }
        } catch (Exception e) {

        }

        return code;
    }
}
