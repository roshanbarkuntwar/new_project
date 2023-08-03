/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.CountOfReportingType;
import com.lhs.EMPDR.JSONResult.ExtractFileJSON;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;

import com.lhs.EMPDR.Model.EntryListRuntimeModel;
import com.lhs.EMPDR.Model.ListOfEntries;
import com.lhs.EMPDR.Model.ListOfReportingSummaryModel;
import com.lhs.EMPDR.Model.ListReportingDateModel;
import com.lhs.EMPDR.Model.ReportingDateList;

import com.lhs.EMPDR.connection.RSconnectionProvider;

import com.lhs.EMPDR.dao.JDBCDisplayNewEntryDAO;
import com.lhs.EMPDR.dao.JDBCEntryListRuntimeDAO;
import com.lhs.EMPDR.dao.JDBCNewEntryDAO;
import com.lhs.EMPDR.dao.JDBCVideoDAO;
import com.lhs.EMPDR.dao.JDBCdocumentMngdao;
import com.lhs.EMPDR.dao.JDBCdocumentMngdaoIMPL;

import com.lhs.EMPDR.utility.U;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import java.sql.Connection;
import java.sql.SQLException;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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
public class EntriesController {

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/addNewEntryInEmp", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addNewEntryInEmp(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") int seqNo, @RequestParam("date") String date,
            @RequestParam("Desc") String Desc, @RequestParam("fileName") String fileName,
            @RequestParam("sysFileName") String sysFileName, @RequestParam("projectCode") String projectCode,
            @RequestParam("activityCode") String activityCode, @RequestParam("userCode") String userCode,
            @RequestParam("WBSName") String WBSName, @RequestParam("contractorCode") String contractorCode,
            @RequestParam("remark") String remark,
            @RequestParam("lattitude") String lattitude, @RequestParam("longitude") String longitude,
            @RequestParam("address") String address, @RequestParam("file") String file) throws IOException {
//        long startTime = System.currentTimeMillis();
        Connection connection = null;
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            String name = "imageDemo.png";
            String base64Image = file;//.split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            InputStream is = new ByteArrayInputStream(imageBytes);

            if (!file.isEmpty()) {

                JDBCNewEntryDAO dao = new JDBCNewEntryDAO(connection);
                String message = "no error";
                try {
                    if (WBSName == null) {
                        WBSName = " ";
                    }
                    if (lattitude == null) {
                        lattitude = " ";
                    }
                    if (longitude == null) {
                        longitude = " ";
                    }
                    if (address == null) {
                        address = " ";
                    }
                    if (remark == null) {
                        remark = "  ";
                    }
                    message = dao.addNewEntry(seqNo, userCode, projectCode, date, activityCode, WBSName, contractorCode, remark, is, fileName, sysFileName, Desc, lattitude, longitude, address);
                } catch (Exception e) {
                    U.log(e);
                }
                U.log("Message===" + message);
                fileUploadStatus.setStatus("insert data");
                return fileUploadStatus;
            } else {
                fileUploadStatus.setStatus("You failed to update " + name + " because the file was empty.");
            }
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updatEntryDetail", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updatEntryDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") int seqId, @RequestParam("date") String date,
            @RequestParam("Desc") String Desc, @RequestParam("fileName") String fileName,
            @RequestParam("sysFileName") String sysFileName,
            @RequestParam("projectCode") String projectCode,
            @RequestParam("activityCode") String activityCode,
            @RequestParam("userCode") String userCode, @RequestParam("WBSName") String WBSName,
            @RequestParam("contractorCode") String contractorCode, @RequestParam("remark") String remark,
            @RequestParam("lattitude") String lattitude, @RequestParam("longitude") String longitude,
            @RequestParam("address") String address, @RequestParam("file") String file) throws IOException {
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            String name = "imageDemo.png";
            String base64Image = file;//.split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            InputStream is = new ByteArrayInputStream(imageBytes);
            if (!file.isEmpty()) {
                JDBCNewEntryDAO dao = new JDBCNewEntryDAO(connection);
                String message = "no error";
                try {
                    if (WBSName == null) {
                        WBSName = " ";
                    }
                    if (lattitude == null) {
                        lattitude = " ";
                    }
                    if (longitude == null) {
                        longitude = " ";
                    }
                    if (address == null) {
                        address = "  ";
                    }
                    if (remark == null) {
                        remark = "  ";
                    }
                    message = dao.updateEntryDetail(seqId, seqId * (-1), userCode, projectCode, date, activityCode, WBSName, contractorCode, remark, is, fileName, sysFileName, Desc, lattitude, longitude, address);
                } catch (Exception e) {
                    U.log(e);
                }
                U.log("Message  : " + message);
                fileUploadStatus.setStatus("updated data");
                return fileUploadStatus;
            } else {
                fileUploadStatus.setStatus("You failed to update " + name + " because the file was empty.");
                return fileUploadStatus;
            }
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return fileUploadStatus;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetEntryDetail")
    public @ResponseBody
    ListOfEntries DisplayEntry(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode, @RequestParam("seqId") int seqId,
            @RequestParam("fileId") int fileId) throws Exception {
        Connection connection = null;
        ListOfEntries obj = new ListOfEntries();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            obj = dao.displayEntryDetail(userCode, seqId, fileId);
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return obj;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getReportingDateList")
    public @ResponseBody
    ListReportingDateModel getReportingDateList(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode) throws Exception {
        ListReportingDateModel listReportingDate = new ListReportingDateModel();
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            List<ReportingDateList> reportingDate = dao.getReporingDateList(userCode);
            listReportingDate.setReportingDate(reportingDate);
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return listReportingDate;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/reportingDateListByType")
    public @ResponseBody
    //apptype==seq_no
    ListReportingDateModel getReportingDateListByType(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode, @RequestParam("seqNo") String appType) throws Exception {
        ListReportingDateModel listReportingDate = new ListReportingDateModel();
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            List<ReportingDateList> reportingDate = dao.getReportingDateListByType(userCode, appType);
            listReportingDate.setReportingDate(reportingDate);
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return listReportingDate;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/countOfReportingType")
    public @ResponseBody
    CountOfReportingType countOfReportingType(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode) throws Exception {
//        long startTime = System.currentTimeMillis();
        CountOfReportingType rs = new CountOfReportingType();
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            String count = dao.getCountReporingType(seqNo, userCode);
            rs.setCount(count);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("Count serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return rs;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getEntryListByDate")
    public @ResponseBody
    ListOfReportingSummaryModel getReportingSummaryByDate(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode, @RequestParam("reportingDate") String reportingDate) throws Exception {
        Connection connection = null;
        ListOfReportingSummaryModel listOfReportingSummary = new ListOfReportingSummaryModel();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            listOfReportingSummary = dao.getEntryListByDate(userCode, reportingDate);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return listOfReportingSummary;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getEntryListByDateAndType")
    public @ResponseBody
    ListOfReportingSummaryModel getEntryListByDateAndType(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode, @RequestParam("reportingDate") String reportingDate,
            @RequestParam("seqNo") String appType) throws Exception {
        Connection connection = null;
        ListOfReportingSummaryModel listOfReportingSummary = new ListOfReportingSummaryModel();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCDisplayNewEntryDAO dao = new JDBCDisplayNewEntryDAO(connection);
            listOfReportingSummary = dao.getEntryListByDateType(userCode, reportingDate, appType);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return listOfReportingSummary;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/dynamicEntryList")//ByDateAndType
    public @ResponseBody
    List<List<EntryListRuntimeModel>> dynamicEntryList(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "vrno", required = false) String vrno, @RequestParam("userCode") String userCode,
            @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "reportingDate", required = false) String reportingDate,
            @RequestParam("seqNo") String appType) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection connection = null;
        List<List<EntryListRuntimeModel>> list = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCEntryListRuntimeDAO dao = new JDBCEntryListRuntimeDAO(connection);
            list = dao.getEntryList(userCode, reportingDate, appType, vrno, accCode);
//            U.log("end of function");
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return list;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/saveVideo", method = RequestMethod.POST)//ByDateAndType
    public @ResponseBody
    String savevideo(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("file") String file) throws Exception {
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            String base64Image = file.toString().split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            InputStream is = new ByteArrayInputStream(imageBytes);
            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
            dao.insertDocument("testFile", "SHASHANK", "nice docs", "sysFile", is);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return "Hello";
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/mediaFile")//ByDateAndType
    public @ResponseBody
    ExtractFileJSON mediaFile(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("file") String fileId) throws Exception {
        U.log("file : " + fileId);
        Connection connection = null;
        ExtractFileJSON json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
            json = dao.extractFile(fileId);
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {

                }
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/searchedEntryList")//ByDateAndType
    public @ResponseBody
    List<List<EntryListRuntimeModel>> searchedEntryList(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "vrno", required = false) String vrno,
            @RequestParam("userCode") String userCode, @RequestParam("searchText") String searchText,
            @RequestParam("fromDate") String fromDate, @RequestParam("toDate") String toDate,
            @RequestParam(value = "reportingDate", required = false) String reportingDate,
            @RequestParam("seqNo") String appType) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection connection = null;
        List<List<EntryListRuntimeModel>> list = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCEntryListRuntimeDAO dao = new JDBCEntryListRuntimeDAO(connection);
            list = dao.searchedEntryList(userCode, reportingDate, appType, vrno, searchText, fromDate, toDate);
//            U.log("end of function");
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return list;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/documentMng", method = RequestMethod.POST)//ByDateAndType
    public @ResponseBody
    FileUploadStatus documentMng(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "jsonString", required = false) String jsonString) throws Exception {
        Connection connection = null;
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCdocumentMngdao dao = new JDBCdocumentMngdaoIMPL(connection);
            String s = dao.manageDoc(jsonString);
            fileUploadStatus.setStatus(s);
        } catch (Exception e) {
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return fileUploadStatus;
    }
}
