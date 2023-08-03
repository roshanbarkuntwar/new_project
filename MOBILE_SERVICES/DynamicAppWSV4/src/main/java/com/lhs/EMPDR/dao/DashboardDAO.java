/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.DashboardResultJSON;
import com.lhs.EMPDR.Model.DashboardModel;
import com.lhs.EMPDR.utility.U;
import com.lhs.EMPDR.utility.Util;
import java.io.InputStream;
import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * {"tab":[{"name":"No Of
 * Client","count":"45","depenDentNextentry":null,"seqNo":"13.1","icon":"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"},{"name":"Open
 * Contract","count":"12
 * MT","depenDentNextentry":null,"seqNo":"13.2","icon":"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"},{"name":"Sales
 * YTD","count":"16587.961","depenDentNextentry":"9","seqNo":"13.3","icon":"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACAVBMVEUAAAD/VVX/UUP/UET/Tkb/QED/UUT+T0X+T0X/UEX9UEX+T0X+TkX+T0X+T0X+T0X/TkP/SkD+T0X+T0X+T0X+T0X/T0b9UEX/Ukf/T0X+T0X+T0X/UEf9T0T9UEb+UEb+T0X9TkX/T0X/TkX/T0X/TkX+T0X/TU3/UEb/Tkb+T0X/T0X/TkX+T0X/TkP/UEb/UET9T0b/T0b/UUb/TUf/TkT+T0X+T0X/UUP/AAD/T0T/T0X+T0X/UET/UEb+T0X/UEj+TkX+T0X+T0X/UEX9TkX/UEX+T0X/TkT/gID+T0X9TkX/UED+TkX/T0T/T0T+T0b9T0b/Tkb+UEX+T0T/TUD/UUb+T0X/SUn/VUn+T0X+T0T9T0X/UUX+T0X/T0b/SUn/TUT/UUb/UEX/VUf/UEb+T0X/TEX+T0b+T0X9UEX/TkX9UEX+T0T9Tkb9T0X/UkL+T0X/T0T/UEX+T0X9UET+UEX+T0X+T0X/S0v9T0X/ZjP+T0X/VTn+T0X/TUP/T0X9T0b/VVX9T0X/Tkf/TkT/T0b/T0b+TkX9T0X/Tkb+T0b+T0X+T0X+UET+T0X/T0b/Tkb/UEX9TkX/TUb+T0X+T0b+T0X/T0b/TkT9TkT9T0b+T0X/UEX/UUP/UEb+T0X+T0b/QED+T0T/UUT+T0X+T0X9T0X/T0P+T0UAAACZwhEJAAAAqXRSTlMAAzlAPggp4OxGk9LAx8G4SBjo+O+/V4YZevr+NqiAsM6mUXJ3aPsKUGL1Z2/kLmZwpW4WMmWuuSYBXmTmaWPrILb943aCc+JsAsycEMNHWreEX73YFCzTDhXEvpg/1zcHHkxDEknPJaz2jU6Qr4+IH9t4MPSdyvzLEYEF8Qm0NWuSBoUkUmpU0JR80eHVzekdRV2MId7n2XExmaG1WRMzsdwE8jzF7Z8q2AVkpAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiCBQLKAe3P0/IAAAC4klEQVRYw+2WaVfTQBSGpwK2okJl14gosggCZWmRQoRaEEQUKotUQRYRFYEqtoKCoIALioALuIG4L++/dJK0hGyQUz949PT50klu7tPOnTuTEhIixH+EYUuYHsIjNPK3GqEP0zZ1QSS279DDTkSpC6Jh1jXTXYj56wLECsTFJwQpEEkMbgoRAkm79zB7/6wGydgXjCA2JcB+HNApSD2oXgOk6ROkMxmZoiDukJ8sZBt0CQ4zyFGtQS7y9AgsDPLVi1iAQi1BkXVtaJPkSwQ2FGsJjqwlyfIlghKY7BqC0kBamSxfuhfYdUWQ1eCokFguz6eCCscax9ZF5UXkDVmKfFkfgIk3awg4Q7IynwqcRpFKqqjSEHAGZb78PHAch39HVdckyZ+1sCcU+aT2ZJ30Rh1SSNCcOm00sqgJXlAvVJKOGlzRIq7CjZLONIpjM6IcDl7QJFmb5g3yW1ApXpxFKyG8wF1vFqk/t4FAugrn0dbOC/QjFVzo4GvQmR8gvYXeteclNHZ2cXFDQ44EGvYLui/aei7xinQqYCUHde9lblBpodFw+YsxURBcuUqbDH3X3JyCCvoHBgaMGPR4PNdvcP3PFhcMAZF20nXTI4GGOYG3Ar6mW8MjuH2H+IsotrLVyYyO0c/Su7Bo1GA8FxNc297r4A8Uv2AC970cbZgkZIr+tlLkWr1KemCaRusUXU9CHmTjodfrFzwKTNPpJv0xvmpChrT/Izwm3TPMoJ08EbY0L8h8OttBeYY5QuYBn5semQvNqjB4TqZp4gvyEj56/Wr9FBexxJ2IeD1FipGq3gpvUELeUsE7YsF7RdRE9Xmu4V4yxtKRKgWwEXf7UJowkrOMFWEwilmNZvyABaHZw5jYRUV0lcUK/Wb3JJPxUaudP+FzOCFfyr6iSiX6jfbl0pwTfeWa+6HoO/Bjvg/4aVALry6b6Cq4Sog2hrQlYGSmX/OBxV+1ZBNWreObPRIixL/Gb785a4krFUM6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA4LTIwVDExOjQwOjA3KzAyOjAwgUlJ+QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wOC0yMFQxMTo0MDowNyswMjowMPAU8UUAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC"},{"name":"Target
 * YTD","count":"52659","depenDentNextentry":"5103","seqNo":"13.4","icon":"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"}],"graphdata":{"data":[[null,"119","1857.6"],[null,"150","2066.32"],[null,"176","1936.53"],["1182.39","245","4466.94"],["2941.14","215","6260.57"],["1789","340",null],["2329.3","364",null],["3251.18","429",null],["8694.91","506",null],["2765.38",null,null],["2625.1",null,null],["2796.68",null,null]],"labes":["Sales
 * LY","Target","sales
 * YTD"],"series":["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]}}{"tab":[{"name":"No
 * Of
 * Client","count":"45","depenDentNextentry":null,"seqNo":"13.1","icon":"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"},{"name":"Open
 * Contract","count":"12
 * MT","depenDentNextentry":null,"seqNo":"13.2","icon":"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"},{"name":"Sales
 * YTD","count":"16587.961","depenDentNextentry":"9","seqNo":"13.3","icon":"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"},{"name":"Target
 * YTD","count":"52659","depenDentNextentry":"5103","seqNo":"13.4","icon":"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"}],"graphdata":{"data":[[null,"119","1857.6"],[null,"150","2066.32"],[null,"176","1936.53"],["1182.39","245","4466.94"],["2941.14","215","6260.57"],["1789","340",null],["2329.3","364",null],["3251.18","429",null],["8694.91","506",null],["2765.38",null,null],["2625.1",null,null],["2796.68",null,null]],"labes":["Sales
 * LY","Target","sales
 * YTD"],"series":["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"]}}
 *
 * @author anjali.bhendarkar
 */
public class DashboardDAO {

    Connection connection;

    public DashboardDAO(Connection connection) {
        this.connection = connection;
        U u = new U(this.connection);
    }

    public DashboardResultJSON getDashbordDetail(String userCode, String accCode, String module, String empCode, String entityCode, String geoOrgCode) {
        DashboardResultJSON json = new DashboardResultJSON();
        List<DashboardModel> modelList = new ArrayList<DashboardModel>();
        List<HashMap<String, Object>> hashMapList = new ArrayList<HashMap<String, Object>>();
        HashMap<String, Object> graphdata = new HashMap<String, Object>();
        ArrayList<String> graphHeading = new ArrayList<String>();
        ArrayList<String> graphSQL = new ArrayList<String>();
        PreparedStatement ps = null;
        ResultSet rs;
        String moduleSeqNo = "";

        String moduleQuery = "select seq_no from lhssys_portal_table_dsc_update t where t.status = 'T' and t.first_screen = 'D' and t.module like '%" + module + "%' ";
        System.out.println("get crm dashboard seq==> " + moduleQuery);
        try {
            ps = connection.prepareStatement(moduleQuery);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                moduleSeqNo = rs.getString(1);
            }
        } catch (Exception e) {
        }
        if (moduleSeqNo != "" && moduleSeqNo != null) {
            String dashboardDataSql = "";
            String graphDataSql = "";
            String acc_year = "";
            String bodyTextSql = "";
            String sql = "select * from lhssys_alert_direct_email where seq_id=" + moduleSeqNo;
            U.log("dashboardDataSql==" + sql);
            try {
                ps = connection.prepareStatement(sql);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    dashboardDataSql = rs.getString("sql_text");
                    graphDataSql = rs.getString("pl_sql_text");
//                bodyTextSql = rs.getString("body_text");
                    graphSQL.add(rs.getString("pl_sql_text"));
                    graphSQL.add(rs.getString("email_sql_text"));
                    graphSQL.add(rs.getString("To_email_sql_id"));
                    for (int i = 1; i < 12; i++) {
                        if (rs.getString("Heading" + i) != null) {
                            graphHeading.add(rs.getString("Heading" + i));
                        }
                    }

                }

                String getAccYearSQL = "SELECT AA.YRBEGDATE , AA.ACC_YEAR, (SELECT B.ACC_YEAR FROM ACC_YEAR_MAST B  "
                        + " WHERE SUBSTR(B.ACC_YEAR,4,2) = SUBSTR(AA.ACC_YEAR, 0, 2)and B.ENTITY_CODE='" + entityCode + "') PRE_ACC_YEAR FROM (SELECT A.ACC_YEAR,A.YRBEGDATE FROM ACC_YEAR_MAST A "
                        + " WHERE  to_char(to_date(SUBSTR( sysdate, 1,10),'dd-mm-yyyy') ) between A.YRBEGDATE AND A.YRENDDATE ORDER BY ACC_YEAR DESC) AA";

                U.log("getAccYearSQL : " + getAccYearSQL);
                String currentAccYearDate = "";
                String currentAccYear = "";
                String preAccYear = "";
                ps = connection.prepareStatement(getAccYearSQL);
                rs = ps.executeQuery();
                if (rs != null && rs.next()) {
                    currentAccYearDate = rs.getString(1);
                    currentAccYear = rs.getString(2);
                    preAccYear = rs.getString(3);
                }
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                Date curDate = format.parse("2018-04-01");

                format = new SimpleDateFormat("dd MMMM yyyy");
                currentAccYearDate = format.format(curDate);
                U.log("==" + currentAccYearDate);
                String query = "";
                int count = dashboardDataSql.split("~").length;
                for (int i = 0; i < count; i++) {
                    DashboardModel dashboardModel = new DashboardModel();
//                U.log("dashboardDataSql==>" + dashboardDataSql);
                    query = dashboardDataSql.split("~")[i];
                    U.log("query==>" + query);

                    U.log(currentAccYearDate + "==" + empCode + "==" + entityCode + "==" + accCode);
                    query = query.replaceAll("TODATE", currentAccYearDate).replaceAll("EMPCODE", empCode).replaceAll("ENTITYCODE", entityCode).replaceAll("ACCCODE", accCode).replaceAll("STAKE_HOLDER_CODE", empCode).replaceAll("GEOORGCODE", geoOrgCode);

                    U.log("query after replace==>" + query);
                    try {
                        ps = connection.prepareStatement(query);
                        rs = ps.executeQuery();
                        if (rs != null && rs.next()) {
                            U.log("rs.getString(\"CLIENT_COUNT\")==>" + rs.getString("CLIENT_COUNT"));
//                dashboardModel.setClient_name(rs.getString("Client_name"));
//                dashboardModel.setAddress(rs.getString("ADDRESS"));
                            if (rs.getString("CLIENT_COUNT") != null && rs.getString("CLIENT_COUNT") != "") {
                                dashboardModel.setCount(rs.getString("CLIENT_COUNT"));
                            } else {
                                dashboardModel.setCount("0");
                            }
                            dashboardModel.setName(rs.getString("name"));
//                dashboardModel.setDeal_count(rs.getString("DEAL_COUNT"));
//                dashboardModel.setMessage(rs.getString("MESSAGE"));
//                dashboardModel.setPotential(rs.getString("POTENTIAL"));
//                dashboardModel.setTarget(rs.getString("TARGET"));
                            modelList.add(dashboardModel);
                        }

                    } catch (Exception e) {
                        U.errorLog(query + "\nexception==" + e);
                        modelList.add(dashboardModel);
                    }
                }

                //For graph
                for (String gQuery : graphSQL) {
                    if (gQuery != null && gQuery.length() > 1) {
                        graphdata = new HashMap<String, Object>();
                        graphDataSql = gQuery;
                        graphDataSql = graphDataSql.replaceAll("'EMPCODE'", "'" + empCode + "'");
                        graphDataSql = graphDataSql.replaceAll("'ENTITYCODE'", "'" + entityCode + "'");
                        graphDataSql = graphDataSql.replaceAll("'ACCYEAR'", "'" + currentAccYear + "'");
                        graphDataSql = graphDataSql.replaceAll("'PRE_ACCYEAR'", "'" + preAccYear + "'");

                        U.log("Graph SQL=--> " + graphDataSql);
                        ps = connection.prepareStatement(graphDataSql);
                        ResultSet resultSet = ps.executeQuery();
                        ArrayList<ArrayList<String>> data = new ArrayList<ArrayList<String>>();
                        ArrayList<String> series = new ArrayList<String>();
                        ArrayList<String> labes = new ArrayList<String>();
                        if (resultSet != null && resultSet.next()) {
                            do {
                                ArrayList<String> row = new ArrayList<String>();
                                row.add(resultSet.getString("sales_LAST_YR"));
                                row.add(resultSet.getString("sales_target"));
                                row.add(resultSet.getString("sales_TILL_DT"));
                                data.add(row);
                                series.add(resultSet.getString("MONTH_CHAR"));
                            } while (resultSet.next());
                            labes.add("Sales LY");
                            labes.add("Target");
                            labes.add("sales YTD");
                        }

                        graphdata.put("data", data);
                        graphdata.put("series", series);
                        graphdata.put("labes", labes);
                        hashMapList.add(graphdata);
                    }
                }

                //for icons
                InputStream imgStream = null;
                String iconSql = "select * from lhssys_portal_table_dsc_update where seq_no like'%" + moduleSeqNo + ".%'";
                U.log("\n iconSQL=>>" + iconSql + "\n******\n");
                ps = connection.prepareStatement(iconSql);
                rs = ps.executeQuery();

                if (rs != null && rs.next()) {
                    do {
                        for (DashboardModel model : modelList) {
                            if (model.getName().equals(rs.getString("table_desc"))) {
                                if (rs.getBlob("icon_image") != null) {
                                    model.setIcon(Util.getImgstreamToBytes(rs.getBlob("icon_image").getBinaryStream()));
                                }
                                model.setDepenDentNextentry(rs.getString("dependent_next_entry_seq"));
                                model.setSeqNo(rs.getString("seq_no"));
                            }
                        }
                    } while (rs.next());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        json.setGraphdata(graphdata);
        json.setHashMapList(hashMapList);
        json.setTab(modelList);
        json.setHeadingOfGraph(graphHeading);
        return json;
    }
}
