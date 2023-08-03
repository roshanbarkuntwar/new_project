/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.dao;

import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author premkumar.agrawal
 */
public class JDBCGPSTrackingDAO {

    Connection c;

    public JDBCGPSTrackingDAO(Connection c) {
        this.c = c;
        U u = new U(this.c);
    }

    public String insertGPS(String seqNo, String userCode, String lat, String lng, String location,
            String locationDateTime, String deviceId, String deviceName) {
        PreparedStatement ps = null;

        try {
            int seq_id = 0;
            seq_id = U.nextSeqID("LHSSYS_PORTAL_APP_TRAN", c);
            String sql = "insert into LHSSYS_PORTAL_APP_TRAN (COL1,COL2,LATITUDE,LONGITUDE,LOCATION,COL7,COL8,DYNAMIC_TABLE_SEQ_ID,\n"
                    + "LASTUPDATE,seq_id,user_code,location_DateTime)"
                    + "values('" + seqNo + "','" + userCode + "','" + lat + "','" + lng + "','" + location + "','"
                    + deviceId + "','" + deviceName + "','" + seqNo + "',sysdate," + seq_id + ",'" + userCode + "','" + locationDateTime + "')";
            U.log(sql);
            ps = c.prepareStatement(sql);
            ps.execute();
            U.log("inserted into db");
            return "GPS are saved";

        } catch (Exception e) {
            U.log(e);
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    U.errorLog(e);
                }
            }
        }
        return "GPS not saved";
    }
    
    public MessageJSON insertData(String seqNo, String userCode, String deviceId, String deviceName, String[] jsonStr, String dataTosend, String locSummary) {
        MessageJSON json = new MessageJSON();
        PreparedStatement ps = null;
        System.out.println("LOCATION TRACKING : "+ seqNo);
        int count = 0;
        int resCount = 0;
        System.out.println("LOC SUMMARY : " + locSummary);
        locSummary = (locSummary != null && !locSummary.equals("")) ? locSummary : "";
        System.out.println("LOC SUMMARY :111111 " + locSummary);
        try {

            JSONParser json_parser = new JSONParser();
            JSONObject jsnobject = (JSONObject) json_parser.parse(dataTosend);
            JSONArray jsonArray = (JSONArray) jsnobject.get("locations");

            for (int i = 0; i < 1; i++) {
                JSONObject object = (JSONObject) jsonArray.get(i);

                String date = (object.get("date") == null) ? "" : object.get("date").toString();
                String activity = (object.get("activity") == null) ? "" : object.get("activity").toString();
                String timestamp = (object.get("timestamp") == null) ? "" : object.get("timestamp").toString();
                String latitude = (object.get("latitude") == null) ? "" : object.get("latitude").toString();
                String longitude = (object.get("longitude") == null) ? "" : object.get("longitude").toString();
                String location = (object.get("location") == null) ? "" : object.get("location").toString();
                String message = (object.get("message") == null) ? "" : object.get("message").toString();
                String appVersion = (object.get("appVersion") == null) ? "" : object.get("appVersion").toString();
                String batteryLevel = (object.get("batteryLevel") == null) ? "" : object.get("batteryLevel").toString();
//                System.out.println("timestamp-->" + timestamp + "date-->" + date);
                try {
                    count++;
                    DateFormat simple = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
                    long miliSec = Long.parseLong(date);
                    Date result = new Date(miliSec);
                    String location_datetime = "";
                    try {
                        long miliSec1 = Long.parseLong(timestamp);
                        Date result2 = new Date(miliSec1);
                        location_datetime = simple.format(result2);
                    } catch (Exception e) {
                    }

//                    System.out.println(simple.format(result2));
                    int seq_id = 0;
                    seq_id = U.nextSeqID("LHSSYS_PORTAL_APP_TRAN", c);
                    String sql = "insert into lhssys_portal_app_tran ("
                            + "COL1,COL2,col3,col4,col5,col6,col7,col8,"
                            + "DYNAMIC_TABLE_SEQ_ID,LASTUPDATE,seq_id,user_code,date1,"
                            + "location_datetime,latitude,longitude,location,col9,col50)"
                            + "values('" + seqNo + "','" + userCode + "','" + date + "','" + deviceId + "','" + deviceName + "','" + activity + " # " + timestamp + "','" + message + "','" + appVersion + "','"
                            + seqNo + "'," + "sysdate," + seq_id + ",'" + userCode + "',to_date('" + simple.format(result) + "','dd-mm-yyyy hh24:mi:ss')"
                            + ",'" + location_datetime + "','" + latitude + "','" + longitude + "','" + location + "','" + batteryLevel + "','" + locSummary + "')";
                    U.log(sql);
                    ps = c.prepareStatement(sql);
                    ps.execute();
                    resCount += 1;
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
            System.out.println("result-->" + resCount + "out of " + count);
            json.setResult("success");
            json.setStatus("success");
            json.setCount(count);

        } catch (Exception e) {
            json.setResult("error");
            json.setStatus("error");
            json.setCount(count);
            System.out.println("exception ---> " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                    System.out.println("exception ---> " + e.getMessage());
                }
            }
        }

        return json;
    }
}
