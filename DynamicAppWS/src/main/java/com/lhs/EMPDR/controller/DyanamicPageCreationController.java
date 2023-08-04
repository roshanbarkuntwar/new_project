/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.JSONResult.GraphDetailJSON;
import com.lhs.EMPDR.JSONResult.GraphLabelDetailJSON;
import com.lhs.EMPDR.JSONResult.GraphTabListJSON;
import com.lhs.EMPDR.JSONResult.MessageJSON;
import com.lhs.EMPDR.JSONResult.NotificationJSON;
import com.lhs.EMPDR.JSONResult.OfflineFormJSON;
import com.lhs.EMPDR.JSONResult.RecordInfoJSON;
import com.lhs.EMPDR.JSONResult.SubTabListJSON;
import com.lhs.EMPDR.JSONResult.TableDescGridJSON;
import com.lhs.EMPDR.JSONResult.TableDescJSON;

import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.JSONResult.TableDetailOfflineJSON;
import com.lhs.EMPDR.JSONResult.TabularFormDataJSON;
import com.lhs.EMPDR.JSONResult.UpdatedLocationJSON;
import com.lhs.EMPDR.JSONResult.ValueJSON;
import com.lhs.EMPDR.JSONResult.WBSLocationJSON;
import com.lhs.EMPDR.JSONResult.WelcomeMsgJSON;
import com.lhs.EMPDR.Model.DetailInfoModel;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.Model.EntryDetailDynamicModel;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.Model.GraphDetailModel;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;

import com.lhs.EMPDR.Model.GraphTabListModel;
import com.lhs.EMPDR.Model.HotSeatVRNOModel;
import com.lhs.EMPDR.Model.LatLongModel;
import com.lhs.EMPDR.Model.ListOfDependentRowValueModel;
import com.lhs.EMPDR.Model.NotificationModel;
import com.lhs.EMPDR.Model.SubTabOfReportModel;
import com.lhs.EMPDR.Model.TableDetailForOfflineModel;
import com.lhs.EMPDR.Model.TabularFormEntryDetailModel;
import com.lhs.EMPDR.Model.ValidateValueModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.AddEntryDAO;
import com.lhs.EMPDR.dao.JDBCAPICallDAO;
import com.lhs.EMPDR.dao.JDBCCallLastUpdateProcedureDAO;
import com.lhs.EMPDR.dao.JDBCDeleteEntryDAO;
import com.lhs.EMPDR.dao.JDBCDependentRowLogicDAO;
import com.lhs.EMPDR.dao.JDBCDyanamicTableInfoDAO;
import com.lhs.EMPDR.dao.JDBCGPSTrackingDAO;
import com.lhs.EMPDR.dao.JDBCGetEmpGeofenceDAO;
import com.lhs.EMPDR.dao.JDBCGetRecordDetailDAO;
import com.lhs.EMPDR.dao.JDBCGraphDeatilDAO;
import com.lhs.EMPDR.dao.JDBCGraphTabDAO;
import com.lhs.EMPDR.dao.JDBCHotSeatVRNODAO;
import com.lhs.EMPDR.dao.JDBCLocationTrackingDAO;
import com.lhs.EMPDR.dao.JDBCMultipleAddEntryDAO;
import com.lhs.EMPDR.dao.JDBCNotificationCountDAO;
import com.lhs.EMPDR.dao.JDBCNotificationDAO;
import com.lhs.EMPDR.dao.JDBCOffilineFormInfoDAO;
import com.lhs.EMPDR.dao.JDBCShortReportDetailDAO;
import com.lhs.EMPDR.dao.JDBCShortReportTab;
import com.lhs.EMPDR.dao.JDBCTableDescDAO;
import com.lhs.EMPDR.dao.JDBCTableLableDetailDAO;
import com.lhs.EMPDR.dao.JDBCUpdateMultipleEntryDAO;
import com.lhs.EMPDR.dao.JDBCWelcomeMsgDAO;
import com.lhs.EMPDR.dao.JDBCdynamicUpdateFormDAO;
import com.lhs.EMPDR.dao.JDBCgetEntryDetailDyanamicalyDAO;
import com.lhs.EMPDR.dao.JDBCgetLOVDyanamicallyDAO;
import com.lhs.EMPDR.dao.JDBCgetTableAllRowsDAO;
import com.lhs.EMPDR.dao.JDBCgetTabularFormEntrydetailDAO;
import com.lhs.EMPDR.dao.JDBCsubTypeOfReport;
import com.lhs.EMPDR.dao.JDBCupdateEntryDyanmicDAO;
import com.lhs.EMPDR.dao.JDBCupdateHotSeatEntryDyanmicDAO;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.attribute.FileTime;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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
public class DyanamicPageCreationController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getTableDetail")
    public @ResponseBody
    TableDetailJSON tableInfo(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("appType") String appType,
            @RequestParam("userCode") String userCode) {
        Connection c = null;
        TableDetailJSON json = null;
        try {
//            long startTime = System.currentTimeMillis();
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDyanamicTableInfoDAO dao = new JDBCDyanamicTableInfoDAO(c);
            json = dao.TableDetail(appType, userCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/tableDetailForOffline")
    public @ResponseBody
    TableDetailJSON TableDetailForOffline(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("appType") String appType,
            @RequestParam("userCode") String userCode) throws Exception {
//        long startTime = System.currentTimeMillis();
        TableDetailJSON json = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDyanamicTableInfoDAO dao = new JDBCDyanamicTableInfoDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
            //  List<TableDetailModel> list = dao.TableDetail(appType, userCode);
            json = dao.TableDetailForOffline(appType, userCode);
            //  json.setTable_Detail(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/addEntryForm")
    public @ResponseBody
    RecordInfoJSON RecordDetail(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode, @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam("accCode") String accCode, @RequestParam(value = "sqlFlag", required = false) String sqlFlag) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
            json = dao.recordsDetail(entity, seqNo, userCode, accCode, searchText, sqlFlag);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/reportFilterForm")
    public @ResponseBody
    RecordInfoJSON ReportFilterDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
//            if (entity.equals("CPT")) {
//                entity = "CP";
//            }
            json = dao.reportFilterDetail(entity, seqNo, userCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/GetRecordDetailforUpdate")
    public @ResponseBody
    RecordInfoJSON recordDetailforUpdate(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode,
            @RequestParam("seqId") int seqId, @RequestParam("fileId") int fileId) throws Exception {
//        long startTime = System.currentTimeMillis();
        JDBCGetRecordDetailDAO dao = null;
        RecordInfoJSON json = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            dao = new JDBCGetRecordDetailDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
            List<DyanamicRecordsListModel> list = dao.getRecordDetailForUpdateForm(seqNo, userCode, seqId, fileId);
            json = new RecordInfoJSON();
            json.setRecordsInfo(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in GetRecordDetailforUpdate ---> " + e.getMessage());
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/tableTabList")
    public @ResponseBody
    GraphTabListJSON tableTabList(@RequestParam(value = "userCode", required = false) String userCode,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("portletId") String portletId,
            @RequestParam("seqNo") String seqNo) {
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGraphTabDAO dao = new JDBCGraphTabDAO(c);
            List<GraphTabListModel> list = dao.tableTabList(portletId, seqNo, userCode);
            json = new GraphTabListJSON();
            json.setTabList(list);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/graphTabList")
    public @ResponseBody
    GraphTabListJSON getGraphTab(@RequestParam(value = "userCode", required = false) String userCode,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("portletId") String portletId,
            @RequestParam("seqNo") String seqNo) {
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGraphTabDAO dao = new JDBCGraphTabDAO(c);
            List<GraphTabListModel> list = dao.graphTabList(portletId, seqNo, userCode);
            json = new GraphTabListJSON();
            json.setTabList(list);
        } catch (Exception e) {
            System.out.println("exception in graphTabList ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/graphDetail")
    public @ResponseBody
    GraphDetailJSON getGraphDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("portletId") String portletId) {
        Connection c = null;
        GraphDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGraphDeatilDAO dao = new JDBCGraphDeatilDAO(c);
            List<GraphDetailModel> list = dao.getGraphDetail(seqNo, portletId);
            json = new GraphDetailJSON();
            json.setGraphDetail(list);
        } catch (Exception e) {
            System.out.println("exception in graphDetail ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/shortReportType")
    public @ResponseBody
    GraphTabListJSON shortReportTab(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCShortReportTab dao = new JDBCShortReportTab(c);
            List<GraphTabListModel> list = dao.getShortReportTab(seqNo);
            json = new GraphTabListJSON();
            json.setTabList(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in shortReportType ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/shortReportSubType")
    public @ResponseBody
    SubTabListJSON subTabOfShortReport(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        SubTabListJSON json = null;
        try {
            RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCsubTypeOfReport dao = new JDBCsubTypeOfReport(c);
            List<SubTabOfReportModel> SubTabList = dao.getSubTabList(seqId);
            json = new SubTabListJSON();
            json.setSubTab(SubTabList);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in shortReportSubType ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/shortReportDetail")
    public @ResponseBody
    ValueJSON shortReportDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam("slNo") String slNo) throws SQLException {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        ValueJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCShortReportDetailDAO dao = new JDBCShortReportDetailDAO(c);
            String val = dao.getDetail(seqId, slNo);
            json = new ValueJSON();
            json.setValue(val);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in shortReportDetail ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/dyanamicWelcomeMsg")
    public @ResponseBody
    WelcomeMsgJSON dyanamicWelcomeMsg(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tabId") String tabId, @RequestParam("userName") String userName) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        WelcomeMsgJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCWelcomeMsgDAO dao = new JDBCWelcomeMsgDAO(c);
            String msg = dao.getMsg(tabId, userName);
            json = new WelcomeMsgJSON();
            json.setWelcomeMsg(msg);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in dyanamicWelcomeMsg ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getGraphLabelDetail")
    public @ResponseBody
    GraphLabelDetailJSON getGraphLabelDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        GraphLabelDetailJSON json = null;
        try {
            RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGraphDeatilDAO dao = new JDBCGraphDeatilDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getGraphDetailData(seqNo, userCode);
            json = new GraphLabelDetailJSON();
            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            System.out.println("exception in getGraphLabelDetail---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/tableLabelDetail")
    public @ResponseBody
    GraphLabelDetailJSON tableLabelDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        GraphLabelDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getGraphDetailData(seqNo, userCode);
            json = new GraphLabelDetailJSON();
            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            System.out.println("exception in  tableLabelDetail---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/tableLabelPagedDetail")
    public @ResponseBody
    GraphLabelDetailJSON tableLabelPagedDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("pageNo") int pageNo, @RequestParam(value = "valueFormat", required = false) String valueFormat,
            @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam(value = "JSON", required = false) String filterDataJSON
    ) {
        Connection c = null;
        GraphLabelDetailJSON json = new GraphLabelDetailJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getPagedGraphDetailData(seqNo, userCode, pageNo, valueFormat, searchText, filterDataJSON);
            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("exception in  tableLabelPagedDetail---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/graphDrillDown")
    public @ResponseBody
    GraphLabelDetailModel graphDrillDown(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "valueFormat", required = false) String valueFormat,
            @RequestParam("valueParam") String valueParam,
            @RequestParam("level") String level) {
        Connection c = null;
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            model = dao.getGraphDrillDownData(seqNo, userCode, valueFormat, valueParam, level);
        } catch (Exception e) {
            System.out.println("exception in graphDrillDown ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/hotSeatVRNO")
    public @ResponseBody
    HotSeatVRNOModel hotSeatVRNO(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "docRef", required = false) String docRef) {
        Connection c = null;
        HotSeatVRNOModel reusult = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCHotSeatVRNODAO dao = new JDBCHotSeatVRNODAO(c);
            reusult = dao.getVRNOData(userCode, docRef);
        } catch (Exception e) {
            System.out.println("exception in hotSeatVRNO ---> " + e.getMessage());
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
        return reusult;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/filterRefreshReportData")
    public @ResponseBody
    FileUploadStatus FilterRefreshReportData(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("divCode") String divCode, @RequestParam("accYear") String accYear,
            @RequestParam("JSON") String filterDataJSON) throws ParseException {
        Connection c = null;
        FileUploadStatus model = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCCallLastUpdateProcedureDAO dao = new JDBCCallLastUpdateProcedureDAO(c);
            model = new FileUploadStatus();
            String reusult = dao.filterRefreshReportData(seqId, userCode, entityCode, divCode, accYear, filterDataJSON);
//            U.log("RESULT==>"+reusult);
//            model.
            model.setStatus(reusult);
        } catch (Exception e) {
            System.out.println("exception in filterRefreshReportData ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/searchedReportData")
    public @ResponseBody
    GraphLabelDetailJSON searchedReportData(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("pageNo") int pageNo, @RequestParam("searchText") String searchText) {
        Connection c = null;
        GraphLabelDetailJSON json = new GraphLabelDetailJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getSearchedGraphData(seqNo, userCode, pageNo, searchText);
            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            System.out.println("exception in searchedReportData ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/CallLastUpdateProcedure")
    public @ResponseBody
    FileUploadStatus CallLastUpdateProcedure(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("divCode") String divCode, @RequestParam("accYear") String accYear) {
        Connection c = null;
        FileUploadStatus model = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCCallLastUpdateProcedureDAO dao = new JDBCCallLastUpdateProcedureDAO(c);
            model = new FileUploadStatus();
            String reusult = dao.callProcedureLastupdate(seqId, userCode, entityCode, divCode, accYear);
            model.setStatus(reusult);
        } catch (Exception e) {
            System.out.println("exception in CallLastUpdateProcedure---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getUserLOV")
    public @ResponseBody
    ArrayList<GenericCodeNameModel> getUserLOV(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode) throws SQLException {
        Connection c = null;
        ArrayList<GenericCodeNameModel> json = new ArrayList<GenericCodeNameModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getUserLOV(seqNo);
        } catch (Exception e) {
            System.out.println("exception in getUserLOV ---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getLOVDyanamically")
    public @ResponseBody
    WBSLocationJSON getLOVDyanamically(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("uniqueID") String uniqueID, @RequestParam("forWhichColmn") String forWhichColmn,
            @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam("userCode") String userCode, @RequestParam(value = "accYear", required = false) String accYear,
            @RequestParam(value = "entityCode", required = false) String entityCode) throws SQLException {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getLovDyanamically(uniqueID, forWhichColmn, whereClauseValue, userCode, accYear, entityCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in getLOVDyanamically---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getOfflineLOV")
    public @ResponseBody
    List<WBSLocationJSON> getOfflineLOV(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("userCode") String userCode) throws SQLException {
        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        List<WBSLocationJSON> list = new ArrayList<WBSLocationJSON>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            list = dao.getOfflineLOV(userCode);
        } catch (Exception e) {
            System.out.println("exception in getLOVDyanamically---> " + e.getMessage());
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
        return list;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getSelectDyanamically")
    public @ResponseBody
    WBSLocationJSON getSelectDyanamically(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("uniqueID") String uniqueID, @RequestParam("forWhichColmn") String forWhichColmn,
            @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam("userCode") String userCode, @RequestParam("searchTxt") String searchTxt) throws SQLException {
        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getSelectDyanamically(uniqueID, forWhichColmn, whereClauseValue, userCode, searchTxt);
        } catch (Exception e) {
            System.out.println("exception in getLOVDyanamically---> " + e.getMessage());
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/getReportFilterLOV")
    public @ResponseBody
    WBSLocationJSON getReportFilterLOV(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("uniqueID") String uniqueID, @RequestParam("forWhichColmn") String forWhichColmn,
            @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam("userCode") String userCode) throws SQLException {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getReportFilterLOV(uniqueID, forWhichColmn, whereClauseValue, userCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in getReportFilterLOV---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/addEntryDyanamically", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addEntryDyanamically(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString,
            @RequestParam(value = "sqlFlag", required = false) String sqlFlag) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
//            JDBCAddEntryDyanamicallyDAO dao1 = new JDBCAddEntryDyanamicallyDAO(c);
            AddEntryDAO dao1 = new AddEntryDAO(c);
            if (sqlFlag != null && !sqlFlag.isEmpty()) {
                if (sqlFlag.equals("T")) {
                    System.out.println("sqlFlag-----------> " + sqlFlag);
                    fileUploadStatus = dao1.addEntrySql(jsonString, sqlFlag);
                    System.out.println("fileUploadStatus" + fileUploadStatus.getSqlData());
                } else {
                    fileUploadStatus = dao1.addEntry(jsonString);
                }
            } else {
                fileUploadStatus = dao1.addEntry(jsonString);
            }
        } catch (Exception e) {
            System.out.println("exception in addEntryDyanamically---> " + e.getMessage());
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/addMultipleEntry", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addMultipleEntry(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("jsonString") String jsonString,
            @RequestParam(value = "flag", required = false) String flag) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCMultipleAddEntryDAO dao1 = new JDBCMultipleAddEntryDAO(c);
            fileUploadStatus = dao1.addMultipleEntry(jsonString, flag);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in addMultipleEntry ---> " + e.getMessage());
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getEntryDetailDyanamically")
    public @ResponseBody
    List<EntryDetailDynamicModel> getEntryDetailDyanamically(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tableSeqNo") String seq_no, @RequestParam("updateKey") String updateKey) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        List<EntryDetailDynamicModel> valueList = new ArrayList<EntryDetailDynamicModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetEntryDetailDyanamicalyDAO dao = new JDBCgetEntryDetailDyanamicalyDAO(c);
            valueList = dao.getDetailOfEntry(seq_no, updateKey);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return valueList;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateEntryForm")
    public @ResponseBody
    RecordInfoJSON getRecordDetailForUpdateForm(@RequestParam("userCode") String userCode,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("tableSeqNo") String seq_no,
            @RequestParam("updateKey") String updateKey) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        RecordInfoJSON json = new RecordInfoJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCdynamicUpdateFormDAO dao = new JDBCdynamicUpdateFormDAO(c);
            json = dao.getRecordDetailForUpdateForm(seq_no, userCode, updateKey);
            //  json.setRecordsInfo(valueList);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    //---- /SM/192.168.100.10/1521/VDEMOERP/VDEMOERP/updateEntryInfo
    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updateEntryDyanamically(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString,
            @RequestParam(value = "sqlFlag", required = false) String sqlFlag) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCupdateEntryDyanmicDAO dao1 = new JDBCupdateEntryDyanmicDAO(c);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            String status = "";
            if (sqlFlag != null && !sqlFlag.isEmpty()) {
                if (sqlFlag.equals("T")) {
                    status = dao1.UpdateGivenEntrySql(jsonString, sqlFlag);
                    fileUploadStatus.setSqlData(status);
                } else {
                    status = dao1.UpdateGivenEntry(jsonString);
                    fileUploadStatus.setStatus(status);
                }
            } else {
                status = dao1.UpdateGivenEntry(jsonString);
                fileUploadStatus.setStatus(status);
            }

        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateHotSeatEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updateHotSeatEntryDyanamically(@PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCupdateHotSeatEntryDyanmicDAO dao1 = new JDBCupdateHotSeatEntryDyanmicDAO(c);
            String status = dao1.UpdateGivenEntry(jsonString, entity);
            fileUploadStatus.setStatus(status);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/entryDetailInTabular")
    public @ResponseBody
    TabularFormDataJSON entryDetailInTabular(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("vrno") String vrno, @RequestParam("searchText") String searchText,
            @RequestParam("accCode") String accCode, @RequestParam(value = "sqlFlag", required = false) String sqlFlag) throws SQLException, Exception {
        Connection c = null;
        TabularFormDataJSON json = new TabularFormDataJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCgetTabularFormEntrydetailDAO dao = new JDBCgetTabularFormEntrydetailDAO(c);
            TabularFormEntryDetailModel model = dao.getDetailOfEntry(entity, seqNo, vrno, userCode, accCode, searchText, sqlFlag);
            json.setRecordInfo(model);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/deleteEntry")
    public @ResponseBody
    MessageJSON deleteEntry(@RequestParam("seqId") String seqId, @RequestParam("seqNo") String seqNo,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDeleteEntryDAO dao = new JDBCDeleteEntryDAO(c);
            String s = dao.deleteEntry(seqId, seqNo);
            json.setResult(s);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/multipleUpdateEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus multipleUpdateEntryInfo(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("jsonString") String jsonString) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCUpdateMultipleEntryDAO dao1 = new JDBCUpdateMultipleEntryDAO(c);
            String status = dao1.UpdateEntry(jsonString);
            fileUploadStatus.setStatus(status);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/offlineFormInfo")
    public @ResponseBody
    OfflineFormJSON OffilineFormInfoDAO(@RequestParam("userCode") String userCode,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("apptype") String apptype,
            @RequestParam("accCode") String accCode,
            @RequestParam("searchText") String searchText, @RequestParam(value = "sqlFlag", required = false) String sqlFlag) {
        Connection c = null;
        OfflineFormJSON json = new OfflineFormJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCOffilineFormInfoDAO dao = new JDBCOffilineFormInfoDAO(c);
            json = dao.offlineTableDetail(entity, apptype, userCode, accCode, searchText, sqlFlag);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/dependantRowValue")
    public @ResponseBody
    ValueClassModel dependentRowLogic(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue) throws SQLException {
        Connection c = null;
        ValueClassModel model = new ValueClassModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.getRowVal(uniquKey, forWhichcolmn, whereClauseValue);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/selfDependantRowValue")
    public @ResponseBody
    ListOfDependentRowValueModel selfDependantRowValue(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue) throws SQLException {
        Connection c = null;
        ListOfDependentRowValueModel model = new ListOfDependentRowValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.selfDependantRowValue(uniquKey, forWhichcolmn, whereClauseValue);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getDetailInformation")
    public @ResponseBody
    DetailInfoModel getDetailInformation(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue) throws SQLException {
        Connection c = null;
        DetailInfoModel model = new DetailInfoModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.getDetailInformation(uniquKey, forWhichcolmn, whereClauseValue);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/validateValue")
    public @ResponseBody
    ValidateValueModel validateValue(@RequestParam("SeqNo") String SeqNo,
            @RequestParam("valueToValidate") String valueToValidate,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("colSLNO") String colSLNO) throws SQLException {
        Connection c = null;
        String ValidatedMsg = "";
        ValidateValueModel model = new ValidateValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.validateValue(SeqNo, colSLNO, valueToValidate);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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
        return model;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/tableAllRowsDetail")
    public @ResponseBody
    TableDetailOfflineJSON allTableRowsDetail(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tableName") String tableName) throws SQLException {
        Connection c = null;
        TableDetailOfflineJSON json = new TableDetailOfflineJSON();;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            TableDetailForOfflineModel model = new TableDetailForOfflineModel();
            JDBCgetTableAllRowsDAO dao = new JDBCgetTableAllRowsDAO(c);
            model = dao.tableRows(tableName);
            json = new TableDetailOfflineJSON();
            json.setTableDetail(model);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/GPStracking")
    public @ResponseBody
    MessageJSON GPStracking(@RequestParam("userCode") String userCode, @RequestParam("lat") String lat,
            @RequestParam("deviceId") String deviceId, @RequestParam("DeviceName") String DeviceName,
            @RequestParam("lng") String lng, @RequestParam("location") String location,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @PathVariable(value = "para1", required = false) String para1,
            @RequestParam(value = "para2", required = false) String para2,
            @RequestParam(value = "para3", required = false) String para3,
            @RequestParam(value = "para4", required = false) String para4,
            @RequestParam("locationDate") String locationDate) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGPSTrackingDAO dao = new JDBCGPSTrackingDAO(c);
            String status = dao.insertGPS(seqNo, userCode, lat, lng, location, locationDate, deviceId, DeviceName, para1, para2, para3, para4);
            json.setResult(status);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/GPStrackingNew")
    public @ResponseBody
    MessageJSON GPStrackingNew(@RequestParam("userCode") String userCode, @RequestParam("latitude") String lat,
            @RequestParam("deviceId") String deviceId, @RequestParam("DeviceName") String DeviceName,
            @RequestParam("longitude") String lng, @RequestParam("location") String location,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam(value = "para1", required = false) String para1,
            @RequestParam(value = "para2", required = false) String para2,
            @RequestParam(value = "para3", required = false) String para3,
            @RequestParam(value = "para4", required = false) String para4,
            @RequestParam("locationDate") String locationDate) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {

            System.out.println("para1--> " + para1);
            System.out.println("para2--> " + para2);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGPSTrackingDAO dao = new JDBCGPSTrackingDAO(c);
            String status = dao.insertGPS(seqNo, userCode, lat, lng, location, locationDate, deviceId, DeviceName, para1, para2, para3, para4);
            json.setResult(status);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/Apptracking", method = RequestMethod.POST)
    public @ResponseBody
    MessageJSON GPStrackingNew(
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode,
            @RequestParam("deviceId") String deviceId, @RequestParam("DeviceName") String DeviceName,
            @RequestParam(value = "timeData", required = false) String[] jsonStr,
            @RequestParam(value = "dataTosend", required = false) String dataTosend,
            @RequestParam(value = "locSummary", required = false) String locSummary) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {

            System.out.println("jsonStr--> " + jsonStr);

//            for (String str : jsonStr) {
//                System.out.println("str---> " + str);
//            }
//            for (String str : dataTosend) {
            System.out.println("str---> " + dataTosend);
//            }

            if (seqNo.equals("107")) {
                String writeFlag = write_file(seqNo, userCode, deviceId, DeviceName, seqNo, dataTosend, locSummary, c);
                System.out.println("FILE WRITE " + writeFlag);
                json.setStatus("success");
                json.setResult("success");

            } else {
                c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
                JDBCGPSTrackingDAO dao = new JDBCGPSTrackingDAO(c);
                json = dao.insertData(seqNo, userCode, deviceId, DeviceName, jsonStr, dataTosend, locSummary);
            }
//            json.setResult(status);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/notificationCount")
    public @ResponseBody
    MessageJSON notificationCount(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCNotificationCountDAO dao = new JDBCNotificationCountDAO(c);
            int count = dao.getNotificationCount(userCode, seqNo);
            json.setResult(String.valueOf(count));
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/saveSourceDestLocation")
    public @ResponseBody
    MessageJSON saveSourceDestLocation(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("sourceLat") String sourceLat,
            @RequestParam("destLat") String destLat,
            @RequestParam("sourceLong") String sourceLong,
            @RequestParam("destLong") String destLong,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCLocationTrackingDAO dao = new JDBCLocationTrackingDAO(c);
            json = dao.saveSourceDestLocation(userCode, seqNo, sourceLat, sourceLong, destLat, destLong);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getUpdatedLocation")
    public @ResponseBody
    ArrayList<UpdatedLocationJSON> getUpdatedLocation(@RequestParam("userCode") String userCode,
            @RequestParam("seqId") String seqId,
            @RequestParam("seqNo") String seqNo,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        ArrayList<UpdatedLocationJSON> json = new ArrayList<UpdatedLocationJSON>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCLocationTrackingDAO dao = new JDBCLocationTrackingDAO(c);
            json = dao.getUpdatedLocation(userCode, seqNo, seqId);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/notification")
    public @ResponseBody
    NotificationJSON notification(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        NotificationJSON json = new NotificationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCNotificationDAO dao = new JDBCNotificationDAO(c);
            List<NotificationModel> modelList = dao.getNotifications(userCode, seqNo);
            json.setModel(modelList);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/forceNotification")
    public @ResponseBody
    NotificationJSON forceNotification(@RequestParam("userCode") String userCode, @RequestParam("seqNo") String seqNo,
            @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        NotificationJSON json = new NotificationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCNotificationDAO dao = new JDBCNotificationDAO(c);
            List<NotificationModel> modelList = dao.getForceNotifications(userCode, seqNo);
            json.setModel(modelList);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/reportDrillDown")
    public @ResponseBody
    TableDescJSON getTableDesc(@RequestParam("value") String value,
            @RequestParam("seqId") String seqId,
            @RequestParam("slNo") String slNo, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        TableDescJSON json = new TableDescJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableDescDAO dao = new JDBCTableDescDAO(c);
            json = dao.getTableDesc(seqId, slNo, value);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/reportDrillDownGrid")
    public @ResponseBody
    TableDescGridJSON getTableDescGrid(@RequestParam("columnName") String columnName,
            @RequestParam("value") String value, @RequestParam("seqId") String seqId,
            @RequestParam("pageNo") int pageNo,
            @RequestParam("searchText") String searchText,
            @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "valueFormat", required = false) String valueFormat,
            @RequestParam("slNo") String slNo, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "JSON", required = false) String filterDataJSON,
            @RequestParam(value = "rowNum", required = false) String rowNum) throws SQLException {
        Connection c = null;
        TableDescGridJSON json = new TableDescGridJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCTableDescDAO dao = new JDBCTableDescDAO(c);
            json = dao.TableDescGridJSON(seqId, slNo, value, columnName, pageNo, searchText, valueFormat, filterDataJSON, userCode, rowNum);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/APICall")
    public @ResponseBody
    String APICall(@RequestParam("userCode") String userCode,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("clientID") String clientID,
            @RequestParam("data_Type") String data_Type,
            @RequestParam("attachedData") String attachedData) {
        Connection c = null;
        String json = "";
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCAPICallDAO dao = new JDBCAPICallDAO(c);

            if (entity.equals("CPT")) {
                entity = "CP";
            }
            json = dao.setAPICall(clientID, data_Type, attachedData);
        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/getEmployeeVlc")
    public @ResponseBody
    ArrayList<LatLongModel> checkGeoLocationFromGeofence(@RequestParam("userCode") String userCode,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) {
        Connection c = null;
        String latLngArray = null;
        ArrayList<LatLongModel> al = new ArrayList<LatLongModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGetEmpGeofenceDAO dAO = new JDBCGetEmpGeofenceDAO(c);
            al = dAO.getEmpGeofence(userCode);
            System.out.println("latlngArray====>" + latLngArray);
        } catch (Exception ex) {
            ex.getMessage();
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
        return al;
    }

    //checkEmployeeGeofence
    //checkEmployeeGeofence
    @RequestMapping(value = "checkEmployeeGeofence", method = RequestMethod.GET)
    public String checkEmployeeGeofence(
            @RequestParam("currentLocation") String currentLocation,
            @RequestParam("latLngArray") String latLangArray) {
        System.out.println("checkEmpGeofence");
        return "/index";
    }
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateErpApprovalDetails")
    public @ResponseBody
    RecordInfoJSON updateErpApprovalDetails(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode, @RequestParam("slno") String slno) throws Exception {
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
            json = dao.updateErpApprovalDetails(entity, seqNo, userCode, slno);

        } catch (Exception e) {
            System.out.println("exception in  ---> " + e.getMessage());
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/updateErpApprovalData")
    public @ResponseBody
    HashMap<String, String> updateTaskStatus(@PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno, @RequestParam("updateKey") String updateKey,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode, @RequestParam("slno") String slno, @RequestParam("value") String value) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
            resStatus = dao.updateErpApprovalData(entity, seqNo, userCode, slno, updateKey, value);

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
        return resStatus;
    }
    public static String write_file(String seqNo, String userCode, String deviceId, String deviceName, String jsonStr, String dataTosend, String locSummary, Connection c) {
        String status = "F";
        String baseLocPath = "C:" + File.separator + "LOCATION_TRACK_FILE" + File.separator + "LOC_";
        System.out.println("LOCATION 107 TRACKING");
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
                int seq_id = 0;
//                seq_id = U.nextSeqID("LHSSYS_PORTAL_APP_LOC_TRAN", c);

                String content = seqNo + "^" + userCode + "^" + date + "^" + deviceId + "^" + deviceName + "^" + activity
                        + "^" + timestamp + "^" + message + "^" + appVersion + "^" + seqNo + "^" + "sysdate" + "^" + seq_id + "^" + userCode + "^" + "to_date('" + simple.format(result) + "','dd-mm-yyyy hh24:mi:ss')" + "^"
                        + location_datetime + "^" + latitude + "^" + longitude + "^" + location + "^" + batteryLevel + "^" + locSummary + "^\n";

                Calendar cal = Calendar.getInstance();
                int hours = cal.get(Calendar.HOUR_OF_DAY);
                int mintus = cal.get(Calendar.MINUTE);
                int calDate = cal.get(Calendar.DATE);
                int calMonth = cal.get(Calendar.MONTH);
                int calYear = cal.get(Calendar.YEAR);
                String locMonth = "";
                if ((calMonth + 1) < 10) {
                    locMonth = "0" + (calMonth + 1);
                } else {
                    locMonth = String.valueOf(calMonth + 1);
                }
                System.out.println("HRS : " + hours + " : " + mintus);
                String baseLocFileName = calYear + "" + locMonth + "" + calDate + "_" + hours + "_";
                String fileGenTime = "";
                if (mintus >= 0 && mintus < 10) {
                    fileGenTime = baseLocFileName + "00";
                } else if (mintus >= 10 && mintus < 20) {
                    fileGenTime = baseLocFileName + "10";
                } else if (mintus >= 20 && mintus < 30) {
                    fileGenTime = baseLocFileName + "20";
                } else if (mintus >= 30 && mintus < 40) {
                    fileGenTime = baseLocFileName + "30";
                } else if (mintus >= 40 && mintus < 50) {
                    fileGenTime = baseLocFileName + "40";
                } else if (mintus >= 50 && mintus < 60) {
                    fileGenTime = baseLocFileName + "50";
                }
                String filePath = baseLocPath + fileGenTime + ".csv";

                System.out.println("FILE PATH : " + filePath);
                File file = new File(filePath);
                FileTime time = null;

                // if file doesnt exists, then create it
                if (!file.exists()) {
                    file.createNewFile();
                }

                FileWriter fw = new FileWriter(file.getAbsoluteFile(), true);
                BufferedWriter bw = new BufferedWriter(fw);

                bw.write(content);

                bw.close();
                status = "T";
            }
        } catch (IOException e) {
            e.printStackTrace();
            status = "F";
        } catch (Exception t) {
            t.printStackTrace();
        }
        return status;
    }
}
