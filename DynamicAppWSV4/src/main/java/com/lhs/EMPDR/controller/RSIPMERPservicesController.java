/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.GenericActivityJSON;
import com.lhs.EMPDR.JSONResult.GenericContractorNameJson;
import com.lhs.EMPDR.JSONResult.GenericProjectListJSON;
import com.lhs.EMPDR.JSONResult.WBSLocationJSON;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.JDBCActivityListDAO;
import com.lhs.EMPDR.dao.JDBCContractorNameDAO;
import com.lhs.EMPDR.dao.JDBCLocationWBSnameDAO;
import com.lhs.EMPDR.dao.JDBCProjectListDAO;
import com.lhs.EMPDR.utility.U;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author premkumar.agrawal
 */
@Controller
public class RSIPMERPservicesController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetProjectList")
    public @ResponseBody
    GenericProjectListJSON projectList(@PathVariable("dbVersion") String dbVersion,@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws ParseException, Exception {
        Connection c = null;
        GenericProjectListJSON json = new GenericProjectListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password,dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetActivityList")
    public @ResponseBody
    GenericActivityJSON activityList(@PathVariable("dbVersion") String dbVersion,@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) {
        Connection c = null;
        GenericActivityJSON json = new GenericActivityJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password,dbVersion);;
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetLocationName")
    public @ResponseBody
    WBSLocationJSON locationWBSname(@RequestParam("costCode") String costCode,
            @PathVariable("dbVersion") String dbVersion,@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno
    ) {
        WBSLocationJSON json = new WBSLocationJSON();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password,dbVersion);;
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetContractorName")
    public @ResponseBody
    GenericContractorNameJson ContractorName(@RequestParam("supplierName") String ContractorNameModel,
            @PathVariable("dbVersion") String dbVersion,@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno
    ) {
        GenericContractorNameJson json = new GenericContractorNameJson();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password,dbVersion);;
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
