package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.AppKeyAuthentication;
import com.lhs.EMPDR.JSONResult.AppTypeListJSON;
import com.lhs.EMPDR.JSONResult.LoginAuthentication;
import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.ResetPasswordJSON;
import com.lhs.EMPDR.Model.AppKeyAuthenticationModel;
import com.lhs.EMPDR.Model.KeyGenerator;
import com.lhs.EMPDR.Model.LoginModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCAppKeyVerificationDAO;
import com.lhs.EMPDR.dao.JDBCAppTypeListDAO;
import com.lhs.EMPDR.dao.JDBCForgotpassword;
import com.lhs.EMPDR.dao.JDBCUserLoginDAO;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller

public class JSONController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/checkServerStatus")
    public @ResponseBody
    HashMap<String, String> checkServerStatus() {
        Connection c = null;
        HashMap<String, String> serverDetails = new HashMap<String, String>();
        serverDetails.put("status", "OK");
        return serverDetails;
    }

    @RequestMapping("/getServerDetails")
    public @ResponseBody
    HashMap<String, Object> appAuthKey(@RequestParam("appKey") String appKey,
            @RequestParam("device_id") String device_id,
            @RequestParam("device_name") String device_name) {
        Connection c = null;

        HashMap<String, Object> serverDetails = new HashMap<String, Object>();
        try {
            String entity = "LC";
            String dbName = "lhscare";
            String password = "lhscare";
            String domainName = "192.168.100.235";
            String portno = "1521";
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCUserLoginDAO dao = new JDBCUserLoginDAO(c);
            serverDetails = dao.getAuthServerDetails(appKey, device_id, device_name);
        } catch (Exception e) {
            System.out.println("exception =" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return serverDetails;
    }

//UserId and password verification
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/login")
    public @ResponseBody
    LoginModel loginUSer(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userId") String userID,
            @RequestParam("password") String password, @RequestParam("deviceId") String deviceId,
            @RequestParam("deviceName") String deviceName,
            @RequestParam(value = "appkeyValidationFlag", required = false) String appkeyValidationFlag,
            @RequestParam(value = "appKey", required = false) String appKey,
            @RequestParam(value = "notificationToken", required = false) String notificationToken,
            @RequestParam(value = "loginFlag", required = false) String loginFlag,
            @RequestParam(value = "buildVersion", required = false) String buildVersion,
            @RequestParam(value = "locationTrackingFlag", required = false) String locationTrackingFlag) throws Exception {
        LoginModel login = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            login = obj.authenticateUser(userID, password, deviceId, deviceName, notificationToken, appKey, appkeyValidationFlag, loginFlag, buildVersion, locationTrackingFlag);
            LoginAuthentication user = new LoginAuthentication();
            user.setModel(login);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return login;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/guestLogin")
    public @ResponseBody
    LoginModel guestLogin(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userName") String username, @RequestParam("email") String email, @RequestParam("mobileNo") String mobileno,
            @RequestParam(value = "deviceId", required = false) String deviceId, @RequestParam(value = "deviceName", required = false) String deviceName,
            @RequestParam(value = "notificationToken", required = false) String notificationToken) throws Exception {
        LoginModel login = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            login = obj.guestLogin(username, email, mobileno, deviceId, deviceName, notificationToken);
            LoginAuthentication user = new LoginAuthentication();
            user.setModel(login);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return login;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/changePassword")
    public @ResponseBody
    MessageJSON changePassword(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("userId") String userID,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) throws Exception {
        Connection c = null;
        MessageJSON objj = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            objj = obj.changePassword(userID, oldPassword, newPassword);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return objj;
    }

    //For getting all app type(modeule)
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/apptypelist")
    public @ResponseBody
    AppTypeListJSON apptypelist(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode,
            @RequestParam(value = "entityCodeStr", required = false) String entityCodeStr,
            @RequestParam(value = "loginFlag", required = false) String loginFlag) throws Exception {
        Connection c = null;
        AppTypeListJSON result = new AppTypeListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppTypeListDAO obj = new JDBCAppTypeListDAO(c);
            result = obj.AppTypeList(userCode, entityCodeStr, loginFlag);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return result;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getDivList")
    public @ResponseBody
    AppTypeListJSON getDivList(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode,
            @RequestParam(value = "entityCode") String entityCode) throws Exception {
        Connection c = null;
        AppTypeListJSON result = new AppTypeListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppTypeListDAO obj = new JDBCAppTypeListDAO(c);
            result = obj.divCodeList(userCode, entityCode);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return result;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/hashmap")
    public @ResponseBody
    HashMap<String, ArrayList<String>> hashmap(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws Exception {
        Connection c = null;
        HashMap<String, ArrayList<String>> map = new HashMap<String, ArrayList<String>>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            map.put("1", new ArrayList<String>());
            map.get("1").add("piunam");
            map.get("1").add("piu6nam");
            map.put("LHS", new ArrayList<String>());
            map.get("LHS").add("pi4unam");
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return map;
    }

    //Appkey verification
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/AppkeyValidation")
    public @ResponseBody
    AppKeyAuthenticationModel appkeyAuth(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("appkey") String appkey) throws Exception {
        Connection c = null;
        AppKeyAuthenticationModel auth = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO obj = new JDBCAppKeyVerificationDAO(c);
            auth = obj.AppkeyAunthetication(appkey);
            AppKeyAuthentication user = new AppKeyAuthentication();
            user.setModel(auth);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return auth;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/forgotPassword")
    public @ResponseBody
    KeyGenerator forgotPassword(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("emailId") String emailId) throws SQLException {
        Long startTime = System.currentTimeMillis();
        Connection c = null;
        KeyGenerator k = new KeyGenerator();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCForgotpassword f = new JDBCForgotpassword(c);
            String key = f.getGUIkey(emailId);
            k.setKey(key);
            Long endTime = System.currentTimeMillis();
            k.setRequiredTimeForm_Send_GUI_KEY((int) ((endTime - startTime) / 1000) % 60 + " Sec");
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return k;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/resetPasword")
    public @ResponseBody
    ResetPasswordJSON resetPassword(@PathVariable("dbName") String dbName,
            @PathVariable("password") String dbpassword, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("emailId") String emailId, @RequestParam("password") String password,
            @RequestParam("key") String key) throws ParseException, SQLException {
        Connection c = null;
        ResetPasswordJSON result = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);
            JDBCForgotpassword f = new JDBCForgotpassword(c);
            result = f.setGUIkey(emailId, key, password);
        } catch (Exception e) {
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return result;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/logOutEntry")
    public @ResponseBody
    String logOut(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userID,
            @RequestParam("locationTrackingFlag") String locationTrackingFlag) throws Exception {
        String logOutStr = "";
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword);;
            JDBCUserLoginDAO loginDAO = new JDBCUserLoginDAO(c);
            logOutStr = loginDAO.logOutEntry(userID, locationTrackingFlag);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return logOutStr;
    }
}
