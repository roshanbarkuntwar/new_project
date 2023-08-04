package com.lhs.EMPDR.utility;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author aniket.naik
 */
public class GenerateNotification {

    Connection connection;

    public GenerateNotification(Connection connection) {
        this.connection = connection;
    }

    public void sendNotification(JSONObject jsonobj, String seq_no, String generatedProdVRNO) {

        String user_str = "";
        String notification_data_all = "";
        String AUTH_KEY_FCM = "AAAAqTPM8z8:APA91bGVIagFqqDqxKRmp_8iq8VdxPX3yzkUIyp0URXoe6anWMgltTzX2QEyZ9klRYb1Y3jfGwUfb_S8prvVvJkYjLrU7fyGlbVJ07WlEWOp21cu3cW-M-dg8_1rQeSNygGe3WKzhoxL";
        String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";
        String ref_lov_whr_clause = "";
        JSONArray jsonArray = (JSONArray) jsonobj.get("recordsInfo");
        JSONObject json_obj = (JSONObject) jsonArray.get(0);
//        U.log("generatedProdVRNO==>" + generatedProdVRNO);
//        System.out.println("json_obj--->" + json_obj);

        try {
            String query = "SELECT * FROM LHSSYS_PORTAL_DATA_DSC_UPDATE t where t.column_name= 'PUSH_NOTIFICATION' and seq_no=" + seq_no;
            System.out.println("Query----->" + query);
            PreparedStatement pst = connection.prepareStatement(query);
            ResultSet rs = pst.executeQuery();
            if (rs != null && rs.next()) {
                notification_data_all = rs.getString("validate_dependent_columns");
                ref_lov_whr_clause = rs.getString("ref_lov_where_clause");
            }
            for (int i = 0; i < json_obj.size(); i++) {
                Set<Map.Entry<String, Object>> entrySet = json_obj.entrySet();
                for (Map.Entry<String, Object> map : entrySet) {
                    if (ref_lov_whr_clause != null && !ref_lov_whr_clause.isEmpty()) {
//                        U.log("key--->" + map.getKey().toString());;
                        if (map.getKey().contains("VRNO")) {
                            ref_lov_whr_clause = ref_lov_whr_clause.replace("'#VRNO#'", (generatedProdVRNO != null && !generatedProdVRNO.equals("") && !generatedProdVRNO.isEmpty()) ? "'"
                                    + generatedProdVRNO + "'" : (map.getValue() != null) ? "'" + map.getValue().toString() + "'" : "");
                        }

                        if (ref_lov_whr_clause.contains(map.getKey())) {
                            ref_lov_whr_clause = ref_lov_whr_clause.replace("'#" + map.getKey() + "#'", map.getValue() != null ? "'" + map.getValue().toString() + "'" : "");
                        }
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        Statement stmt = null;
        ResultSet rs = null;
        try {
            String notifQuery = ref_lov_whr_clause;
            stmt = connection.createStatement();
            if (notifQuery.contains("~")) {
                CallableStatement cst = null;
                try {
                    String proc = notifQuery.split("~")[1];
                    notifQuery = notifQuery.split("~")[0];
                    System.out.println("~procedure==> " + proc);
                    cst = connection.prepareCall(proc);
                    boolean status = cst.execute();
                    if (!status) {
                        System.out.println("Success");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    cst.close();
                }
            }
            System.out.println("NotifQuery ---- " + notifQuery);
            rs = stmt.executeQuery(notifQuery);
            while (rs != null && rs.next()) {
                String user_token_no = rs.getString(1);
                String message = rs.getString(2);

                String notification_data = notification_data_all;
                if (user_token_no != null && !user_token_no.isEmpty()) {
                    if (notification_data.contains("TokenNo")) {
                        notification_data = notification_data.replaceAll("TokenNo", user_token_no);
                    }

                    if (notification_data.contains("msgdata")) {
                        notification_data = notification_data.replaceAll("'~msgdata'", message);
                    }
                    try {
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
                        wr.write(notification_data);
                        wr.flush();
                        conn.getInputStream();
                        int code = conn.getResponseCode();
                        System.out.println("Response Code For Notif---->" + code);
                    } catch (Exception e) {
                        System.out.println("PUSH NOTIFICATION EXCEPTION..." + e.getMessage());
                        e.printStackTrace();
                    }

                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if(rs != null) {
                try {
                    rs.close();
                } catch (SQLException ex) {
                }
            }            
            if(stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException ex) {
                }
            }
        }

    }

}
