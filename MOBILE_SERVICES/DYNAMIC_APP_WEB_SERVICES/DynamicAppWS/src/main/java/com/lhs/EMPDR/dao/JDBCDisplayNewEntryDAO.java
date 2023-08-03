/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.Model.GetEntryDetailModel;
import com.lhs.EMPDR.Model.ListOfEntries;
import com.lhs.EMPDR.Model.ListOfReportingSummaryModel;
import com.lhs.EMPDR.Model.NewEntryModel;
import com.lhs.EMPDR.Model.ReportingDateList;
import com.lhs.EMPDR.Model.ReportingSummaryByDate;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCDisplayNewEntryDAO {

    Connection connection;

    public JDBCDisplayNewEntryDAO(Connection c) {
        this.connection = c;
    }

    public HashMap<String, String> displayDyanamicEntryDetail(String userCode, int seqID, int fileId) throws SQLException {

        List<GetEntryDetailModel> list = new ArrayList<GetEntryDetailModel>();
        HashMap<String, String> obj = new HashMap<String, String>();
        String result = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuilder stringBuffer = new StringBuilder();
        try {
            stringBuffer.append("select  l.col1,l.col2,c.cost_name col3,l.col4,a.activity_type_name col5\n"
                    + ",w.wbs_name col6,m.acc_name col7,l.col8 ,f.file_id,f.store_file ,l.seq_id \n"
                    + "from lhssys_portal_app_tran l , LHSSYS_PORTAL_UPLOAD_FILE f,cost_mast c,"
                    + "activity_type_mast a,project_wbs_body w,acc_mast m where\n"
                    + " l.seq_id=" + seqID + " and f.file_id=" + fileId + "\n"
                    + "and UPPER(TRIM(l.col2))=UPPER('" + userCode + "')and UPPER(TRIM(c.cost_Code))=UPPER(l.col3)  \n"
                    + "and UPPER(TRIM(a.activity_type))=UPPER(l.col5) and UPPER(TRIM(m.acc_code))=UPPER(l.col7) \n"
                    + " and w.rowid=REGEXP_SUBSTR(l.col6,'[^#]+',1,1)  ");

            ps = connection.prepareStatement(stringBuffer.toString());
            //    ps.setString(1, userCode);
            rs = ps.executeQuery();
            U.log("executed1");
            if (rs != null && rs.next()) {

                do {
                    InputStream imgStream = null;

                    if (rs.getBlob("store_file") != null) {
                        imgStream = rs.getBlob("store_file").getBinaryStream();
                    } else {
                        imgStream = getClass().getResourceAsStream("/defualtDp.png");
                    }

                    GetEntryDetailModel model = new GetEntryDetailModel();
                    model.setCol2(rs.getString("col2"));
                    model.setCol4(rs.getString("col4"));
                    model.setCol5(rs.getString("col5"));
                    model.setCol7(rs.getString("col7"));
                    model.setCol3(rs.getString("col3"));
                    model.setCol6(rs.getString("col6"));
                    model.setCol8(rs.getString("col8"));
                    model.setCol9(Util.getImgstreamToBytes(imgStream));

                    list.add(model);
                    result = "new entries value are inserted sucessfully";

                    obj.put("col2", rs.getString("col2"));
                    obj.put("col3", rs.getString("col3"));
                    obj.put("col4", rs.getString("col4"));
                    obj.put("col5", rs.getString("col5"));
                    obj.put("col6", rs.getString("col6"));
                    obj.put("col7", rs.getString("col7"));
                    obj.put("col8", rs.getString("col8"));
                    obj.put("col9", Util.getImgstreamToBytes(imgStream).toString());
                } while (rs.next());

            }
        } catch (SQLException e) {
            result = "new entries value are not inserted ";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return obj;
    }

    public HashMap<String, String> displayDyanamicEntryDetailEmpty(String userCode, int seqID, int fileId) throws SQLException {

        List<GetEntryDetailModel> list = new ArrayList<GetEntryDetailModel>();
        HashMap<String, String> obj = new HashMap<String, String>();
        String result = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuilder stringBuffer = new StringBuilder();
        try {
            stringBuffer.append("select l.col1,l.col2, l.col3, l.col4, l.col5, l.col6, l.col7 "
                    + "from lhssys_portal_app_tran l "
                    + " where l.seq_id = " + seqID + " and l.col9 = " + fileId + " and UPPER(TRIM(l.col2)) = UPPER('" + userCode + "')");

            ps = connection.prepareStatement(stringBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    GetEntryDetailModel model = new GetEntryDetailModel();
                    U.log("executed");
                    model.setCol2(rs.getString("col2"));
                    model.setCol4(rs.getString("col4"));
                    model.setCol5(rs.getString("col5"));
                    model.setCol7(rs.getString("col7"));
                    model.setCol3(rs.getString("col3"));
                    model.setCol6(rs.getString("col6"));

                    list.add(model);
                    result = "new entries value are selected";

                    obj.put("col2", rs.getString("col2"));
                    obj.put("col3", rs.getString("col3"));
                    obj.put("col4", rs.getString("col4"));
                    obj.put("col5", rs.getString("col5"));
                    obj.put("col6", rs.getString("col6"));
                    obj.put("col7", rs.getString("col7"));
                } while (rs.next());
            }
        } catch (SQLException e) {
            result = "new entries value are not selected";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return obj;
    }

    public ListOfEntries displayEntryDetail(String userCode, int seqID, int fileId) throws SQLException {

        ListOfEntries obj = new ListOfEntries();
        List<NewEntryModel> list = new ArrayList<NewEntryModel>();

        String result = "";
        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuilder stringBuffer = new StringBuilder();
        try {
            stringBuffer.append("select  l.col1,l.col2,c.cost_name col3,l.LASTUPDATE col4,a.activity_type_name col5\n"
                    + ",REGEXP_SUBSTR(l.col6,'[^#]+',1,2) col6,m.acc_name col7,l.col8 ,f.file_id,f.store_file ,l.seq_id \n"
                    + "from lhssys_portal_app_tran l , LHSSYS_PORTAL_UPLOAD_FILE f,cost_mast c,activity_type_mast a,acc_mast m\n"
                    + "where\n"
                    + " l.seq_id=" + seqID + " and f.file_id=" + fileId + "\n"
                    + "and UPPER(TRIM(l.col2))=UPPER('" + userCode + "')and UPPER(TRIM(c.cost_Code))=UPPER(l.col3)  \n"
                    + "and UPPER(TRIM(a.activity_type))=UPPER(l.col5) and UPPER(TRIM(m.acc_code))=UPPER(l.col7) ");

            U.log(stringBuffer.toString());

            ps = connection.prepareStatement(stringBuffer.toString());
            rs = ps.executeQuery();
            U.log("executed1");
            if (rs != null && rs.next()) {
                do {
                    InputStream imgStream = null;
                    if (rs.getBlob("store_file") != null) {
                        imgStream = rs.getBlob("store_file").getBinaryStream();
                    } else {
                        imgStream = getClass().getResourceAsStream("/defualtDp.png");
                    }

                    NewEntryModel model = new NewEntryModel();
                    U.log("executed");
                    model.setUserCode(rs.getString("col2"));
                    model.setDateTime(rs.getString("col4"));
                    model.setActivityCode(rs.getString("col5"));
                    model.setContractorCode(rs.getString("col7"));
                    model.setProjectCode(rs.getString("col3"));
                    model.setWBSName(rs.getString("col6"));
                    model.setRemark(rs.getString("col8"));
                    model.setSeqId(rs.getString("seq_id"));
                    model.setDp(Util.getImgstreamToBytes(imgStream));
                    model.setMessage("new entries value are inserted sucessfully");
                    list.add(model);
                    result = "new entries value are inserted sucessfully";
                } while (rs.next());
                obj.setListOfEntries(list);
            }
        } catch (SQLException e) {
//            model.setMessage("Not insert new entry");
            result = "new entries value are not inserted ";
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return obj;
    }

    public List<ReportingDateList> getReportingDateListByType(String userCode, String apptype) throws SQLException {

        List<ReportingDateList> list = new ArrayList<ReportingDateList>();

        PreparedStatement prepareStatement = null;
        ResultSet resultSet = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            stringBuffer.append("select distinct to_char(to_date(l.col4, 'dd-mm-yyyy HH24:MI:SS' ), 'rrrr-mm-dd') reportDate\n"
                    + "   from lhssys_portal_app_tran l\n"
                    + "   where UPPER(TRIM(l.user_code)) = UPPER('" + userCode.toUpperCase() + "') and l.col1=" + apptype + "\n"
                    + "     order by to_char(to_date(l.col4, 'dd-mm-yyyy HH24:MI:SS'), 'rrrr-mm-dd')");

            U.log("GET CALENDER ENTRY DATES SQL :  " + stringBuffer.toString() + "\n userCode :  " + userCode + "  apptye  :  " + apptype);
            prepareStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = prepareStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    ReportingDateList reportingDateList = new ReportingDateList();
//                    reportingDateList.setFoo("bar");
//                    reportingDateList.setDate(resultSet.getString("reportDate"));
                    reportingDateList.setStartTime(resultSet.getString("reportDate"));
                    reportingDateList.setEndTime(resultSet.getString("reportDate"));
                    reportingDateList.setTitle("EVENT");
                    reportingDateList.setAllDay("false");
                    list.add(reportingDateList);

                } while (resultSet.next());
            }
        } catch (SQLException e) {
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException e) {
                }
            }
        }
        return list;
    }

    public List<ReportingDateList> getReporingDateList(String userCode) throws SQLException {

        List<ReportingDateList> list = new ArrayList<ReportingDateList>();
        U.log("userCode===" + userCode);
        PreparedStatement prepareStatement = null;
        ResultSet resultSet = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            stringBuffer.append(
                    "select distinct to_char(to_date(l.col4, 'mm-dd-yyyy'), 'rrrr-mm-dd') reportDate\n"
                    + "   from lhssys_portal_app_tran l\n"
                    + "   where UPPER(TRIM(l.col2)) = UPPER('SHASHANK')\n"
                    + "     order by to_char(to_date(l.col4, 'mm-dd-yyyy'), 'rrrr-mm-dd')"
            );

            prepareStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = prepareStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {

                do {
                    ReportingDateList reportingDateList = new ReportingDateList();
//                    reportingDateList.setFoo("bar");
//                    reportingDateList.setDate(resultSet.getString("reportDate"));
                    list.add(reportingDateList);

                } while (resultSet.next());
            }
        } catch (SQLException e) {
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException e) {
                }
            }
        }
        return list;
    }

    public ListOfReportingSummaryModel getEntryListByDate(String userCode, String reportDate) throws SQLException {

        ListOfReportingSummaryModel obj = new ListOfReportingSummaryModel();
        List<ReportingSummaryByDate> list = new ArrayList<ReportingSummaryByDate>();

        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            stringBuffer.append("select l.col1,l.col2,l.col3,l.LASTUPDATE col4,l.col5,l.col6,l.col7,l.col8 ,f.file_id,f.store_file ,l.seq_id \n"
                    + "            from lhssys_portal_app_tran l , LHSSYS_PORTAL_UPLOAD_FILE f\n"
                    + "            where UPPER(TRIM(col2)) = UPPER('" + userCode + "')\n"
                    + "            AND COL4 = '" + reportDate + "' and f.user_code=l.col2\n"
                    + "            and f.file_id*(-1)= l.seq_id  ORDER BY l.seq_id DESC");

            ps = connection.prepareStatement(stringBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    InputStream imgStream = null;
                    if (rs.getBlob("store_file") != null) {
                        imgStream = rs.getBlob("store_file").getBinaryStream();
                    } else {
                        imgStream = getClass().getResourceAsStream("/defualtDp.png");
                    }
                    ReportingSummaryByDate reportingSummaryByDate = new ReportingSummaryByDate();

                    reportingSummaryByDate.setUserCode(rs.getString("col2"));
                    reportingSummaryByDate.setDateTime(rs.getString("col4"));
                    reportingSummaryByDate.setActivityCode(rs.getString("col5"));
                    reportingSummaryByDate.setContractorCode(rs.getString("col7"));
                    reportingSummaryByDate.setProjectCode(rs.getString("col3"));
                    reportingSummaryByDate.setRemark(rs.getString("col8"));
                    reportingSummaryByDate.setWBSName(rs.getString("col6"));
                    reportingSummaryByDate.setFileId(rs.getString("file_id"));
                    reportingSummaryByDate.setSeqId(rs.getString("seq_id"));
                    reportingSummaryByDate.setDp(Util.getImgstreamToBytes(imgStream));

                    list.add(reportingSummaryByDate);
                } while (rs.next());
                obj.setList(list);
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return obj;
    }

    public ListOfReportingSummaryModel getEntryListByDateType(String userCode, String reportDate, String apptype) throws SQLException {

        ListOfReportingSummaryModel obj = new ListOfReportingSummaryModel();
        List<ReportingSummaryByDate> list = new ArrayList<ReportingSummaryByDate>();

        PreparedStatement ps = null;
        ResultSet rs = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            stringBuffer.append("select l.col1,l.col2,l.col3,l.LASTUPDATE col4,l.col5,l.col6,l.col7,l.col8 ,f.file_id,f.store_file ,l.seq_id \n"
                    + "            from lhssys_portal_app_tran l , LHSSYS_PORTAL_UPLOAD_FILE f\n"
                    + "            where UPPER(TRIM(col2)) = UPPER('" + userCode + "')\n"
                    + "            AND COL4 = '" + reportDate + "' and l.col1='" + apptype + "' and f.user_code=l.col2\n"
                    + "            and f.file_id*(-1)= l.seq_id  ORDER BY l.seq_id DESC");

            ps = connection.prepareStatement(stringBuffer.toString());
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                do {
                    InputStream imgStream = null;
                    if (rs.getBlob("store_file") != null) {
                        imgStream = rs.getBlob("store_file").getBinaryStream();
                    } else {
                        imgStream = getClass().getResourceAsStream("/defualtDp.png");
                    }
                    ReportingSummaryByDate reportingSummaryByDate = new ReportingSummaryByDate();

                    reportingSummaryByDate.setUserCode(rs.getString("col2"));
                    reportingSummaryByDate.setDateTime(rs.getString("col4"));
                    reportingSummaryByDate.setActivityCode(rs.getString("col5"));
                    reportingSummaryByDate.setContractorCode(rs.getString("col7"));
                    reportingSummaryByDate.setProjectCode(rs.getString("col3"));
                    reportingSummaryByDate.setRemark(rs.getString("col8"));
                    reportingSummaryByDate.setWBSName(rs.getString("col6"));
                    reportingSummaryByDate.setFileId(rs.getString("file_id"));
                    reportingSummaryByDate.setSeqId(rs.getString("seq_id"));
                    reportingSummaryByDate.setDp(Util.getImgstreamToBytes(imgStream));

                    list.add(reportingSummaryByDate);
                } while (rs.next());
                obj.setList(list);
            }
        } catch (SQLException e) {
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (SQLException e) {
                }
            }
        }
        return obj;
    }

    public String getCountReporingType(String seqNo, String userCode) throws SQLException {

        String n = "0";
        PreparedStatement prepareStatement = null;
        ResultSet resultSet = null;
        StringBuffer stringBuffer = new StringBuffer();
        try {
            stringBuffer.append("select COUNT(*) count from lhssys_portal_app_tran WHERE TRIM(COL1)= "
                    + seqNo + " AND upper(USER_CODE) = '" + userCode.toUpperCase() + "'");
            prepareStatement = connection.prepareStatement(stringBuffer.toString());
            resultSet = prepareStatement.executeQuery();
            if (resultSet != null && resultSet.next()) {
                do {
                    n = resultSet.getString("count");
                } while (resultSet.next());
            }
        } catch (SQLException e) {
        } finally {
            if (prepareStatement != null) {
                try {
                    prepareStatement.close();
                } catch (SQLException e) {
                }
            }
        }
        return n;
    }
}
