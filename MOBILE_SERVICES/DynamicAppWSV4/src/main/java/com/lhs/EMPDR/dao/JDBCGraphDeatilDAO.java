/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.BatchFilemodel;
import com.lhs.EMPDR.Model.GraphDetailModel;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.PreDefinedValue;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCGraphDeatilDAO {

    Connection c;
    List<String> gdata = new ArrayList<String>();

    public void addData(String data) {
        gdata.add(data);
    }

    public JDBCGraphDeatilDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public List<GraphDetailModel> getGraphDetail(String seqNo, String portletId) {
        List<GraphDetailModel> list = new ArrayList<GraphDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
        PreDefinedValue val;
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "select d.seq_id,d.sql_text,d.batch_file,d.alert_desc,d.subject,d.user_code,d.heading1,d.heading2,d.heading3,d.heading4,d.heading5,d.heading6,\n"
                + "d.heading7,d.heading8,d.heading9,d.heading10,d.heading11,d.heading12,d.portlet_id,d.color_CODE_FORMAT,d.data_type1,d.data_type2,d.data_type3,d.data_type4\n"
                + ",d.data_type5,d.data_type6,d.data_type7,d.data_type8,d.data_type9,d.data_type10,d.data_type11,d.data_type12,\n"
                + "d.font_size,d.color_code_format from LHSSYS_ALERT_DIRECT_EMAIL d where upper(portlet_id)=upper('" + portletId + "')and seq_id=" + seqNo;
        U.log("getGraphDetail SQL : " + sql);
        try {
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    GraphDetailModel model = new GraphDetailModel();
                    for (int i = 1; i <= 12; i++) {
                        if (rs.getString("data_type" + i) != null) {
                            if (!rs.getString("data_type" + i).contains("X")) {
                                model.addSeries(rs.getString("heading" + i));
                            } else {
                                val = new PreDefinedValue(rs.getString("heading" + i).toLowerCase());
                                if (rs.getString("heading" + i).toLowerCase().contains("period")) {
                                    model.setLabels(val.EngMonth);
                                }
                            }
                        }
                    }
                    String datasql = rs.getString("sql_text");
                    PreparedStatement ps1 = null;
                    try {
                        ps1 = c.prepareStatement(datasql);
                        ResultSet rs1 = ps1.executeQuery();
                        ResultSetMetaData rsmd = rs1.getMetaData();
                        U.log(datasql + "=columns: " + rsmd.getColumnCount());
                        int count = rsmd.getColumnCount();

                        ArrayList<String> arr;
                        if (rs1 != null && rs1.next()) {
                            do {
                                arr = new ArrayList<String>();
                                for (int i = 1; i < count; i++) {

                                    if (rs1.getString(i) != null) {
                                        arr.add(rs1.getString(i));
                                    }
                                }
                                graphData.add(arr);
                            } while (rs1.next());
                        }
                        model.setGraphdata(graphData);
                    } catch (Exception e) {
                        U.errorLog(e);
                    } finally {
                        if (ps1 != null) {
                            try {
                                ps1.close();
                            } catch (Exception e) {
                                U.errorLog(e);
                            }
                        }
                    }
                    U.log(rs.getString("color_code_format"));
                    String[] clr = rs.getString("color_code_format").split(",");
                    for (int j = 0; j < clr.length; j++) {
                        model.addcolor(clr[j].replaceAll("'", ""));
                    }
                    String[] fnt = rs.getString("font_size").split("~");

                    for (int j = 0; j < fnt.length; j++) {
                        model.addfont(fnt[j].replaceAll("'", ""));
                    }

                    //  model.setFont(rs.getString("font_size"));
                    //model.setBatchFile(rs.getString("batch_file"));
                    List<BatchFilemodel> graphTypeList = new ArrayList<BatchFilemodel>();
                    String batchFile[] = rs.getString("batch_file").split("#");
                    for (int i = 0; i < batchFile.length; i++) {
                        BatchFilemodel batchmodel = new BatchFilemodel();
                        batchmodel.setGraphType(batchFile[i]);
                        graphTypeList.add(batchmodel);
                    }

                    model.setGraphTypeList(graphTypeList);

                    list.add(model);

                } while (rs.next());
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return list;
    }

    public Connection getC() {
        return c;
    }

    public void setC(Connection c) {
        this.c = c;
    }

    public List<GraphLabelDetailModel> getGraphDetailData(String seqNo, String userCode) {
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        PreparedStatement ps = null;
        ResultSet rs;
        String sql = "";
        PreparedStatement ps1 = null;
        ResultSet rs1;
        String sql1 = "select d.sql_text from LHSSYS_ALERT_DIRECT_EMAIL d where  seq_id=" + seqNo;
        try {
            sql1 = sql1.replace("USER_CODE", userCode);
            ps1 = c.prepareStatement(sql1);
            rs1 = ps1.executeQuery();
            if (rs1 != null && rs1.next()) {
                sql = rs1.getString(1);
            }
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps1 != null) {
                try {
                    ps1.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }

        List<GraphLabelDetailModel> list = new ArrayList<GraphLabelDetailModel>();
        List<ArrayList> graphData = new ArrayList<ArrayList>();
        List<String> label = new ArrayList<String>();
        String datasql = sql;
        try {
            U.log(datasql);
            ps = c.prepareStatement(datasql);
            rs = ps.executeQuery();
            ResultSetMetaData md = rs.getMetaData();
            ResultSetMetaData rsmd = rs.getMetaData();
            int count = rsmd.getColumnCount();
            U.log(count);
            int p = 1;
            ArrayList<String> arr;
            if (rs != null && rs.next()) {
                do {
                    arr = new ArrayList<String>();
                    for (int i = 1; i <= count; i++) {
                        if (rs.getString(i) != null) {
                            arr.add(rs.getString(i));
                            U.log(md.getColumnName(i));
                            if (p == 1) {
                                label.add(md.getColumnName(i));
                            }
                        }
                    }
                    graphData.add(arr);
                    p++;
                } while (rs.next());
            }
            model.setGraphLabelData(graphData);
            model.setSeries(label);
        } catch (SQLException e) {
            U.errorLog(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        list.add(model);
        return list;
    }
}
