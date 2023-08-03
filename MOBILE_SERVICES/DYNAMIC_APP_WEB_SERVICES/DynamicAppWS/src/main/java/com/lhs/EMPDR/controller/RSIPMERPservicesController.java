/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.GenericActivityJSON;
import com.lhs.EMPDR.JSONResult.GenericContractorNameJson;
import com.lhs.EMPDR.JSONResult.GenericProjectListJSON;
import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.JSONResult.WBSLocationJSON;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCActivityListDAO;
import com.lhs.EMPDR.dao.JDBCAppKeyVerificationDAO;
import com.lhs.EMPDR.dao.JDBCContractorNameDAO;
import com.lhs.EMPDR.dao.JDBCDyanamicTableInfoDAO;
import com.lhs.EMPDR.dao.JDBCLocationWBSnameDAO;
import com.lhs.EMPDR.dao.JDBCProjectListDAO;
import com.lhs.EMPDR.dao.JDBCUserLoginDAO;
import com.lhs.EMPDR.utility.U;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author premkumar.agrawal
 */
@Controller
public class RSIPMERPservicesController {

    @RequestMapping(value = "users", method = RequestMethod.GET)
    public String startJsp() {
        return "/AppUsers";
    }

    @RequestMapping("/getUsers")
    public @ResponseBody
    ArrayList<HashMap<String, String>> getUsers() {
        Connection c = null;
        ArrayList<HashMap<String, String>> json = new ArrayList<HashMap<String, String>>();
        try {
            String entity = "LC";
            String dbName = "lhscare";
            String password = "lhscare";
            String domainName = "192.168.100.235";
            String portno = "1521";
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO dao = new JDBCAppKeyVerificationDAO(c);
            json = dao.getAppCofigrationDetail();
        } catch (Exception e) {
            System.out.println("exception -->" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/resetLhsCareAppKey")
    public @ResponseBody
    HashMap<String, String> resetLhsCareAppKey(@RequestParam(value = "appKey", required = false) String appKey, 
            @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        HashMap<String, String> json = new HashMap<String, String>();
        try {
            String entity = "LC";
            String dbName = "lhscare";
            String password = "lhscare";
            String domainName = "192.168.100.235";
            String portno = "1521";
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO dao = new JDBCAppKeyVerificationDAO(c);
            json = dao.resetLhsCareAppKey(appKey,userCode);
        } catch (Exception e) {
            System.out.println("exception -->" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/resetUserAppKeyValidation")
    public @ResponseBody
    HashMap<String, String> resetUserAppKeyValidation(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,@RequestParam(value = "appKey", required = false) String appKey, 
            @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        HashMap<String, String> json = new HashMap<String, String>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO dao = new JDBCAppKeyVerificationDAO(c);
            json = dao.resetUserAppKeyValidation(appKey, userCode);
        } catch (Exception e) {
            System.out.println("exception -->" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/getAppKeyUsers")
    public @ResponseBody
    ArrayList<HashMap<String, String>> getAppKeyUsers(@RequestParam("seqNo") String seqNo, @RequestParam("status") String status) {
        Connection c = null;
        ArrayList<HashMap<String, String>> json = new ArrayList<HashMap<String, String>>();
        try {
            String entity = "LC";
            String dbName = "lhscare";
            String password = "lhscare";
            String domainName = "192.168.100.235";
            String portno = "1521";
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO dao = new JDBCAppKeyVerificationDAO(c);
            json = dao.getAppKeyUsers(seqNo, status);
        } catch (Exception e) {
            System.out.println("exception -->" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getAppUsers")
    public @ResponseBody
    ArrayList<HashMap<String, String>> getAppUsers(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) {
        Connection c = null;
        ArrayList<HashMap<String, String>> json = new ArrayList<HashMap<String, String>>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAppKeyVerificationDAO dao = new JDBCAppKeyVerificationDAO(c);
            json = dao.getAppUsers();
        } catch (Exception e) {
            System.out.println("exception =" + e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/GetProjectList")
    public @ResponseBody
    GenericProjectListJSON projectList(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws ParseException, Exception {
        Connection c = null;
        GenericProjectListJSON json = new GenericProjectListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCProjectListDAO dao = new JDBCProjectListDAO(c);
            List<GenericCodeNameModel> list = dao.getProjectList();
            json.setProjectList(list);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/GetActivityList")
    public @ResponseBody
    GenericActivityJSON activityList(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) {
        Connection c = null;
        GenericActivityJSON json = new GenericActivityJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCActivityListDAO dao = new JDBCActivityListDAO(c);
            List<GenericCodeNameModel> list = dao.getActivityList();
            json.setActivityList(list);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/GetLocationName")
    public @ResponseBody
    WBSLocationJSON locationWBSname(@RequestParam("costCode") String costCode,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno
    ) {
        WBSLocationJSON json = new WBSLocationJSON();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCLocationWBSnameDAO dao = new JDBCLocationWBSnameDAO(c);
            List<GenericCodeNameModel> list = dao.getLocationWBSname(costCode);
            json.setLocationList(list);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/GetContractorName")
    public @ResponseBody
    GenericContractorNameJson ContractorName(@RequestParam("supplierName") String ContractorNameModel,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno
    ) {
        GenericContractorNameJson json = new GenericContractorNameJson();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCContractorNameDAO dao = new JDBCContractorNameDAO(c);
            List<GenericCodeNameModel> list = dao.getContractorName(ContractorNameModel);
            json.setContractorName(list);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                    c = null;
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return json;
    }
}
