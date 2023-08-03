/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.ExtractFileJSON;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;

import com.lhs.EMPDR.Model.EntryListRuntimeModel;
import com.lhs.EMPDR.Model.ListReportingDateModel;
import com.lhs.EMPDR.Model.ReportingDateList;

import com.lhs.EMPDR.connection.RSconnectionProvider;

import com.lhs.EMPDR.dao.JDBCDisplayNewEntryDAO;
import com.lhs.EMPDR.dao.JDBCEntryListRuntimeDAO;
import com.lhs.EMPDR.dao.JDBCNewEntryDAO;
import com.lhs.EMPDR.dao.JDBCOTGDeviceVerificationDAO;
import com.lhs.EMPDR.dao.JDBCVideoDAO;
import com.lhs.EMPDR.dao.JDBCdocumentMngdao;
import com.lhs.EMPDR.dao.JDBCdocumentMngdaoIMPL;

import com.lhs.EMPDR.utility.U;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author premkumar.agrawal
 */
@Controller
public class EntriesController {

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/OTGDeviceVerification")
    public @ResponseBody
    HashMap<String, String> OTGDeviceVerification(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("deviceId") String deviceId) throws IOException {
        Connection connection = null;
        HashMap<String, String> details = new HashMap<String, String>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCOTGDeviceVerificationDAO dao = new JDBCOTGDeviceVerificationDAO(connection);
            details = dao.getDeviceVerificationDetails(deviceId);
        } catch (Exception e) {
            details.put("msg", "Some other error please check input");
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
        return details;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/uplaodFile", method = RequestMethod.POST)
    public @ResponseBody
    HashMap<String, String> uploadFile(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "file", required = false) byte[] file,
            @RequestParam(value = "fileName", required = true) String fileName[],
            @RequestPart("mfile") MultipartFile mfile[],
            @RequestParam(name = "filePath", required = true) String filePath
    ) {
        Connection connection = null;
        HashMap<String, String> result = new HashMap<String, String>();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCOTGDeviceVerificationDAO dao = new JDBCOTGDeviceVerificationDAO(connection);
            result = dao.uploadFile(file, fileName, mfile, filePath);
        } catch (Exception e) {
            result.put("msg", "Some other error please check input");
            System.out.println("Exception in uplaodFile : " + e.getMessage());
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                    connection = null;
                } catch (SQLException ex) {
                }
            }
        }
        return result;

    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/addNewEntryInEmp", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addNewEntryInEmp(@PathVariable("dbName") String dbName,
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
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/updatEntryDetail", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updatEntryDetail(@PathVariable("dbName") String dbName,
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
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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
                    System.out.println("Exception in updatEntryDetail : " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/reportingDateListByType")
    public @ResponseBody
    ListReportingDateModel getReportingDateListByType(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode, @RequestParam("seqNo") String appType) throws Exception {
        ListReportingDateModel listReportingDate = new ListReportingDateModel();
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/dynamicEntryList")//ByDateAndType
    public @ResponseBody
    List<List<EntryListRuntimeModel>> dynamicEntryList(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "vrno", required = false) String vrno, @RequestParam("userCode") String userCode,
            @RequestParam(value = "reportingDate", required = false) String reportingDate,
            @RequestParam(value = "filterParam", required = false) String filterParam,
            @RequestParam("seqNo") String appType) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection connection = null;
        List<List<EntryListRuntimeModel>> list = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCEntryListRuntimeDAO dao = new JDBCEntryListRuntimeDAO(connection);
            list = dao.getEntryList(userCode, reportingDate, appType, vrno, filterParam);
//            U.log("end of function");
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Exception in dynamicEntryList : " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/saveVideo", method = RequestMethod.POST)//ByDateAndType
    public @ResponseBody
    String savevideo(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("file") String file) throws Exception {
        Connection connection = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            String base64Image = file.toString().split(",")[1];
            byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);
            InputStream is = new ByteArrayInputStream(imageBytes);
            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
            dao.insertDocument("testFile", "SHASHANK", "nice docs", "sysFile", is);
        } catch (Exception e) {
            System.out.println("Exception in saveVideo : " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/mediaFile")//ByDateAndType
    public @ResponseBody
    ExtractFileJSON mediaFile(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("file") String fileId) throws Exception {
        U.log("file : " + fileId);
        Connection connection = null;
        ExtractFileJSON json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
            json = dao.extractFile(fileId);
        } catch (Exception e) {
            System.out.println("Exception in mediaFile : " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/searchedEntryList")//ByDateAndType
    public @ResponseBody
    List<List<EntryListRuntimeModel>> searchedEntryList(@PathVariable("dbName") String dbName,
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
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/documentMng", method = RequestMethod.POST)//ByDateAndType
    public @ResponseBody
    FileUploadStatus documentMng(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "jsonString", required = false) String jsonString) throws Exception {
        Connection connection = null;
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
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
