package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.AppKeyAuthentication;
import com.lhs.EMPDR.JSONResult.AppTypeListJSON;
import com.lhs.EMPDR.JSONResult.LoginAuthentication;
import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.ResetPasswordJSON;
import com.lhs.EMPDR.Model.AppKeyAuthenticationModel;
import com.lhs.EMPDR.Model.KeyGenerator;
import com.lhs.EMPDR.Model.LoginModel;
import com.lhs.EMPDR.Model.OTPResponseModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCAppKeyVerificationDAO;
import com.lhs.EMPDR.dao.JDBCAppTypeListDAO;
import com.lhs.EMPDR.dao.JDBCForgotpassword;
import com.lhs.EMPDR.dao.JDBCSendOTPDAO;
import com.lhs.EMPDR.dao.JDBCUserLoginDAO;
import com.lhs.EMPDR.utility.Util;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import static org.springframework.util.FileCopyUtils.BUFFER_SIZE;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller

public class JSONController {

    private Util utl = new Util();

    @RequestMapping("/checkServerStatus")
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
            String dbVersion = "orcl";
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/checkServerStatus")
    public @ResponseBody
    HashMap<String, String> checkServerStatus1() {
        Connection c = null;
        HashMap<String, String> serverDetails = new HashMap<String, String>();
        serverDetails.put("status", "OK");
        return serverDetails;
    }

//UserId and password verification
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/login")
    public @ResponseBody
    LoginModel loginUSer(@PathVariable(value = "dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userId") String userID,
            @RequestParam("password") String password, @RequestParam("deviceId") String deviceId,
            @RequestParam("deviceName") String deviceName, @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "notificationToken", required = false) String notificationToken,
            @RequestParam(value = "appkeyValidationFlag", required = false) String appkeyValidationFlag,
            @RequestParam(value = "appKey", required = false) String appKey,
            @RequestParam(value = "OTPFlag", required = false) String OTPFlag,
            @RequestParam(value = "buildVersion", required = false) String buildVersion) throws Exception {
        LoginModel login = null;
        Connection c = null;
        try {
//            System.out.println("inside logsendOTPin controller   ======>>>>>>>");
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            login = obj.authenticateUser(userID, password, deviceId, deviceName, notificationToken, appKey, appkeyValidationFlag, OTPFlag, type, buildVersion);
//            System.out.println("getempCode=="+login.getEmp_code());
            LoginAuthentication user = new LoginAuthentication();
            user.setModel(login);
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
        System.out.println("loginmodel........" + login.getMessage());
        return login;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/login")
    public @ResponseBody
    LoginModel loginUSerr(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userId") String userID,
            @RequestParam("password") String password, @RequestParam("deviceId") String deviceId,
            @RequestParam("deviceName") String deviceName, @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "notificationToken", required = false) String notificationToken,
            @RequestParam(value = "appkeyValidationFlag", required = false) String appkeyValidationFlag,
            @RequestParam(value = "appKey", required = false) String appKey,
            @RequestParam(value = "OTPFlag", required = false) String OTPFlag,
            @RequestParam(value = "buildVersion", required = false) String buildVersion) throws Exception {
        LoginModel login = null;
        Connection c = null;

        System.out.println("Inside Login Controller--->");
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, null);;
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            login = obj.authenticateUser(userID, password, deviceId, deviceName, notificationToken, appKey, appkeyValidationFlag, OTPFlag, type, buildVersion);
            System.out.println("getempCode==" + login.getEmp_code());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/guestLogin")
    public @ResponseBody
    LoginModel guestLogin(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userName") String username, @RequestParam("email") String email, @RequestParam("mobileNo") String mobileno,
            @RequestParam(value = "deviceId", required = false) String deviceId, @RequestParam(value = "deviceName", required = false) String deviceName,
            @RequestParam(value = "notificationToken", required = false) String notificationToken) throws Exception {
        LoginModel login = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);;
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/changePassword", method = RequestMethod.POST)
    public @ResponseBody
    MessageJSON changePassword(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("userId") String userID, @RequestParam("loginId") String loginId,
            @RequestParam("acccode") String acccode,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword, @RequestParam("json") String json, @RequestParam("loginUserFlag") String loginUserFlag) throws Exception {
        Connection c = null;
        MessageJSON objj = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            JDBCUserLoginDAO obj = new JDBCUserLoginDAO(c);
            objj = obj.changePassword(userID, oldPassword, newPassword, json, acccode, loginUserFlag, loginId);
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
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/apptypelist")
    public @ResponseBody
    AppTypeListJSON apptypelist(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode) throws Exception {
        Connection c = null;
        AppTypeListJSON result = new AppTypeListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCAppTypeListDAO obj = new JDBCAppTypeListDAO(c);
            result = obj.AppTypeList(userCode);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/hashmap")
    public @ResponseBody
    HashMap<String, ArrayList<String>> hashmap(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws Exception {
        Connection c = null;
        HashMap<String, ArrayList<String>> map = new HashMap<String, ArrayList<String>>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/AppkeyValidation")
    public @ResponseBody
    AppKeyAuthenticationModel appkeyAuth(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("appkey") String appkey) throws Exception {
        Connection c = null;
        AppKeyAuthenticationModel auth = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/forgotPassword")
    public @ResponseBody
    KeyGenerator forgotPassword(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("emailId") String emailId) throws SQLException {
        Long startTime = System.currentTimeMillis();
        Connection c = null;
        KeyGenerator k = new KeyGenerator();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/resetPasword")
    public @ResponseBody
    Map<String, String> resetPassword(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String dbpassword, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("loginId") String userId, @RequestParam("password") String password) throws ParseException, SQLException {
        Map<String, String> output = new LinkedHashMap<String, String>();
        String result = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);;
            JDBCForgotpassword f = new JDBCForgotpassword(c);
            result = f.resetPassword(userId, password);
            if (!utl.isNull(result)) {
                output.put("updateStatus", result);
            } else {
                output.put("updateStatus", "error");
            }
        } catch (Exception e) {
            output.put("updateStatus", "error");
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                }
            }
        }
        return output;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/doDownload", method = RequestMethod.GET)
    public void doDownload(@RequestParam("filePath") String filePath, HttpServletRequest request, HttpServletResponse response) throws IOException {

        System.out.println("filePath--> " + filePath);
        ServletContext context = request.getServletContext();
        String fullPath = filePath;
        File downloadFile = new File(fullPath);
        FileInputStream inputStream = new FileInputStream(downloadFile);
        String mimeType = context.getMimeType(fullPath);
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }
        System.out.println("MIME type: " + mimeType);
        response.setContentType(mimeType);
        response.setContentLength((int) downloadFile.length());
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=\"%s\"", downloadFile.getName());
        response.setHeader(headerKey, headerValue);
        OutputStream outStream = response.getOutputStream();
        byte[] buffer = new byte[BUFFER_SIZE];
        int bytesRead = -1;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }
        inputStream.close();
        outStream.close();
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/logOutEntry")
    public @ResponseBody
    String logOut(@PathVariable(value = "dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userID) throws Exception {
        String logOutStr = "";
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);;
            JDBCUserLoginDAO loginDAO = new JDBCUserLoginDAO(c);
            logOutStr = loginDAO.logOutEntry(userID);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/sendOTP")
    public @ResponseBody
    OTPResponseModel sendOTP(@PathVariable(value = "dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("loginId") String loginId) {
        OTPResponseModel output = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            JDBCSendOTPDAO sendOTPDAO = new JDBCSendOTPDAO(c);
            output = sendOTPDAO.sendOTP(loginId);
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

        return output;
    }// End Method

}
