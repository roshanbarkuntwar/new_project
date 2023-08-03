/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.DashboardResultJSON;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.JSONResult.GraphDetailJSON;
import com.lhs.EMPDR.JSONResult.GraphLabelDetailJSON;
import com.lhs.EMPDR.JSONResult.GraphTabListJSON;
import com.lhs.EMPDR.JSONResult.ItemListJSON;
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
import com.lhs.EMPDR.Model.AddonModel;
import com.lhs.EMPDR.Model.CardWithGridModel;
import com.lhs.EMPDR.Model.DetailInfoModel;
import com.lhs.EMPDR.Model.DyanamicRecordsListModel;
import com.lhs.EMPDR.Model.EntryDetailDynamicModel;
import com.lhs.EMPDR.Model.GenericCodeNameModel;
import com.lhs.EMPDR.Model.GraphDetailModel;
import com.lhs.EMPDR.Model.GraphLabelDetailModel;

import com.lhs.EMPDR.Model.GraphTabListModel;
import com.lhs.EMPDR.Model.HeadingValueOfTable;
import com.lhs.EMPDR.Model.HotSeatVRNOModel;
import com.lhs.EMPDR.Model.ListOfDependentRowValueModel;
import com.lhs.EMPDR.Model.NotificationModel;
import com.lhs.EMPDR.Model.ReportCountModel;
import com.lhs.EMPDR.Model.SubTabOfReportModel;
import com.lhs.EMPDR.Model.TableDetailForOfflineModel;
import com.lhs.EMPDR.Model.TabularFormEntryDetailModel;
import com.lhs.EMPDR.Model.TermsAndCondition;
import com.lhs.EMPDR.Model.ValidateValueModel;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.DashboardDAO;
import com.lhs.EMPDR.dao.JDBCAPICallDAO;
import com.lhs.EMPDR.dao.JDBCAddEntryDyanamicallyDAO;
import com.lhs.EMPDR.dao.JDBCAddonParamDAO;
import com.lhs.EMPDR.dao.JDBCCallLastUpdateProcedureDAO;
import com.lhs.EMPDR.dao.JDBCDeleteEntryDAO;
import com.lhs.EMPDR.dao.JDBCDependentRowLogicDAO;
import com.lhs.EMPDR.dao.JDBCDyanamicTableInfoDAO;
import com.lhs.EMPDR.dao.JDBCDyanamicTableValueDAO;
import com.lhs.EMPDR.dao.JDBCGPSTrackingDAO;
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
import com.lhs.EMPDR.dao.JDBCfindItemListDAO;
import com.lhs.EMPDR.dao.JDBCgetEntryDetailDyanamicalyDAO;
import com.lhs.EMPDR.dao.JDBCgetLOVDyanamicallyDAO;
import com.lhs.EMPDR.dao.JDBCgetTableAllRowsDAO;
import com.lhs.EMPDR.dao.JDBCgetTabularFormEntrydetailDAO;
import com.lhs.EMPDR.dao.JDBCsubTypeOfReport;
import com.lhs.EMPDR.dao.JDBCupdateEntryDyanmicDAO;
import com.lhs.EMPDR.dao.JDBCupdateHotSeatEntryDyanmicDAO;
import com.lhs.EMPDR.dao.TermsAndConditionDAO;

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
public class DyanamicPageCreationController {

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getCrmDashbordDetail")
    public @ResponseBody
    DashboardResultJSON getCrmDashbordDetail(
            @PathVariable("dbVersion") String dbVersion,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("accCode") String accCode,
            @RequestParam("userCode") String userCode,
            @RequestParam(value = "seqNo", required = false) String seqNo,
            @RequestParam(value = "module", required = false) String module,
            @RequestParam(value = "entityCode", required = false) String entityCode, @RequestParam(value = "empCode", required = false) String empCode, @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode) {
        Connection c = null;
        DashboardResultJSON json = null;
        try {

//            long startTime = System.currentTimeMillis();
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            DashboardDAO dao = new DashboardDAO(c);
            json = dao.getDashbordDetail(userCode, accCode, module, empCode, entityCode, geoOrgCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            e.printStackTrace();
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getTableDetail")
    public @ResponseBody
    TableDetailJSON tableInfo(@PathVariable("dbVersion") String dbVersion,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("appType") String appType,
            @RequestParam("userCode") String userCode,
            @RequestParam(value = "empCode", required = false) String empCode,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam(value = "loginFlag", required = false) String loginFlag,
            @RequestParam(value = "loginId", required = false) String loginId,
            @RequestParam(value = "appKey", required = false) String appKey) {
        Connection c = null;
        TableDetailJSON json = null;
        try {
//            long startTime = System.currentTimeMillis();
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDyanamicTableInfoDAO dao = new JDBCDyanamicTableInfoDAO(c);
            json = dao.TableDetail(appType, userCode, empCode, dbName, geoOrgCode, loginFlag, loginId, appKey);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//           U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            e.printStackTrace();
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
    
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/refreshReportCount")
    public @ResponseBody
    ArrayList<ReportCountModel> refreshRepCount(@PathVariable("dbVersion") String dbVersion,
            @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("appType") String appType,
            @RequestParam("userCode") String userCode,
            @RequestParam(value = "empCode", required = false) String empCode,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam(value = "loginFlag", required = false) String loginFlag,
            @RequestParam(value = "loginId", required = false) String loginId) {
        Connection c = null;
        ArrayList<ReportCountModel> json = new ArrayList<ReportCountModel>();
        try {
//            long startTime = System.currentTimeMillis();
                System.out.println("refreshReportCount");
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDyanamicTableInfoDAO dao = new JDBCDyanamicTableInfoDAO(c);
            json = dao.refreshRepCount(userCode, empCode,loginId,appType);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//           U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            e.printStackTrace();
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/tableDetailForOffline")
    public @ResponseBody
    TableDetailJSON TableDetailForOffline(@PathVariable("dbVersion") String dbVersion,
            @PathVariable("dbName") String dbName,
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
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDyanamicTableInfoDAO dao = new JDBCDyanamicTableInfoDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
            //  List<TableDetailModel> list = dao.TableDetail(appType, userCode);
            json = dao.TableDetailForOffline(appType, userCode);
            //  json.setTable_Detail(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/addEntryForm")
    public @ResponseBody
    RecordInfoJSON RecordDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode, @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam("accCode") String accCode, @RequestParam(value = "sessionMapValue", required = false) String sessionMapValue, @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            U.log("Seq_no :::::" + seqNo);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
            json = dao.recordsDetail(entity, seqNo, userCode, accCode, searchText, sessionMapValue, geoOrgCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {

            U.log(e);
        } finally {
            if (c != null) {
                try {
                    c.close();
                } catch (SQLException ex) {
                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
                }
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/reportFilterForm")
    public @ResponseBody
    RecordInfoJSON ReportFilterDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode,
            @RequestParam(value = "accCode", required = false) String accCode, @RequestParam(value = "userFlag", required = false) String userFlag) throws Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGetRecordDetailDAO dao = new JDBCGetRecordDetailDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
//            if (entity.equals("CPT")) {
//                entity = "CP";
//            }
            json = dao.reportFilterDetail(entity, seqNo, userCode, accCode, userFlag);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GetRecordDetailforUpdate")
    public @ResponseBody
    RecordInfoJSON recordDetailforUpdate(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode,
            @RequestParam("seqId") int seqId, @RequestParam("fileId") int fileId) throws Exception {
//        long startTime = System.currentTimeMillis();
        JDBCGetRecordDetailDAO dao = null;
        RecordInfoJSON json = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            dao = new JDBCGetRecordDetailDAO(c);
//        NewEntryModel model= dao.displayEntryDetail(userCode);
            List<DyanamicRecordsListModel> list = dao.getRecordDetailForUpdateForm(seqNo, userCode, seqId, fileId);
            json = new RecordInfoJSON();
            json.setRecordsInfo(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.log(e);
        } finally {
            if (c != null) {
                c.close();
                c = null;
            }
        }
        return json;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateErpApprovalDetails")
    public @ResponseBody
    RecordInfoJSON updateErpApprovalDetails(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode, @RequestParam("slno") String slno) throws Exception {
        Connection c = null;
        RecordInfoJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateErpApprovalData")
    public @ResponseBody
    HashMap<String, String> updateTaskStatus(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno, @RequestParam("updateKey") String updateKey,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode, @RequestParam("slno") String slno, @RequestParam("value") String value) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/tableTabList")
    public @ResponseBody
    GraphTabListJSON tableTabList(@RequestParam(value = "userCode", required = false) String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("portletId") String portletId,
            @RequestParam("seqNo") String seqNo) {
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/graphTabList")
    public @ResponseBody
    GraphTabListJSON getGraphTab(@RequestParam(value = "userCode", required = false) String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("portletId") String portletId,
            @RequestParam("seqNo") String seqNo) {
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGraphTabDAO dao = new JDBCGraphTabDAO(c);
            List<GraphTabListModel> list = dao.graphTabList(portletId, seqNo, userCode);
            json = new GraphTabListJSON();
            json.setTabList(list);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/graphDetail")
    public @ResponseBody
    GraphDetailJSON getGraphDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("portletId") String portletId) {
        Connection c = null;
        GraphDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGraphDeatilDAO dao = new JDBCGraphDeatilDAO(c);
            List<GraphDetailModel> list = dao.getGraphDetail(seqNo, portletId);
            json = new GraphDetailJSON();
            json.setGraphDetail(list);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/shortReportType")
    public @ResponseBody
    GraphTabListJSON shortReportTab(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        GraphTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCShortReportTab dao = new JDBCShortReportTab(c);
            List<GraphTabListModel> list = dao.getShortReportTab(seqNo);
            json = new GraphTabListJSON();
            json.setTabList(list);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/shortReportSubType")
    public @ResponseBody
    SubTabListJSON subTabOfShortReport(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        SubTabListJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCsubTypeOfReport dao = new JDBCsubTypeOfReport(c);
            List<SubTabOfReportModel> SubTabList = dao.getSubTabList(seqId);
            json = new SubTabListJSON();
            json.setSubTab(SubTabList);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/shortReportDetail")
    public @ResponseBody
    ValueJSON shortReportDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam("slNo") String slNo) throws SQLException {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        ValueJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCShortReportDetailDAO dao = new JDBCShortReportDetailDAO(c);
            String val = dao.getDetail(seqId, slNo);
            json = new ValueJSON();
            json.setValue(val);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/dyanamicWelcomeMsg")
    public @ResponseBody
    WelcomeMsgJSON dyanamicWelcomeMsg(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tabId") String tabId, @RequestParam("userName") String userName) {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        WelcomeMsgJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCWelcomeMsgDAO dao = new JDBCWelcomeMsgDAO(c);
            String msg = dao.getMsg(tabId, userName);
            json = new WelcomeMsgJSON();
            json.setWelcomeMsg(msg);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getGraphLabelDetail")
    public @ResponseBody
    GraphLabelDetailJSON getGraphLabelDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        GraphLabelDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGraphDeatilDAO dao = new JDBCGraphDeatilDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getGraphDetailData(seqNo, userCode);
            json = new GraphLabelDetailJSON();
            json.setGraphGabelDetail(model);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/tableLabelDetail")
    public @ResponseBody
    GraphLabelDetailJSON tableLabelDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        GraphLabelDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getGraphDetailData(seqNo, userCode);
            json = new GraphLabelDetailJSON();
            json.setGraphGabelDetail(model);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/tableLabelPagedDetail")
    public @ResponseBody
    GraphLabelDetailJSON tableLabelPagedDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "vrno", required = false) String vrno,
            @RequestParam("pageNo") int pageNo, @RequestParam(value = "valueFormat", required = false) String valueFormat,
            @RequestParam(value = "searchText", required = false) String searchText,
            @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam(value = "JSON", required = false) String filterDataJSON
    ) {
        Connection c = null;
        GraphLabelDetailJSON json = new GraphLabelDetailJSON();
        try {
            System.out.println("");
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getPagedGraphDetailData(seqNo, userCode, pageNo, valueFormat, searchText, vrno, accCode, geoOrgCode, filterDataJSON);
            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/cardListDetail")
    public @ResponseBody
    GraphLabelDetailModel cardListDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "vrno", required = false) String vrno,
            @RequestParam("entityCode") String entityCode, @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "consigneeCode", required = false) String consigneeCode, @RequestParam(value = "divCode", required = false) String divCode,
            @RequestParam(value = "valueFormat", required = false) String valueFormat
    ) {
        Connection c = null;
        GraphLabelDetailModel model = new GraphLabelDetailModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
//            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getPagedGraphDetailData(seqNo, userCode, pageNo, valueFormat);
            int pageNo = 0;
            model = dao.getCardListDetailData(seqNo, userCode, pageNo, valueFormat, entityCode, accCode, vrno, consigneeCode, divCode);

        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/cardWithGridDetails")
    public @ResponseBody
    List<CardWithGridModel> cardWithGridDetails(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam(value = "vrno", required = false) String vrno,
            @RequestParam("entityCode") String entityCode, @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "valueFormat", required = false) String valueFormat, @RequestParam(value = "empCode", required = false) String empCode,
            @RequestParam(value = "targetEntity", required = false) String targetEntity,
            @RequestParam(value = "divCode", required = false) String divCode
    ) {
        Connection c = null;
        List<CardWithGridModel> model = new ArrayList<CardWithGridModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
//            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getPagedGraphDetailData(seqNo, userCode, pageNo, valueFormat);
            int pageNo = 0;
            model = dao.getcardWithGridDetails(seqNo, userCode, pageNo, valueFormat, entityCode, accCode, vrno, empCode, targetEntity, divCode);

        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/hotSeatVRNO")
    public @ResponseBody
    HotSeatVRNOModel hotSeatVRNO(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "userCode", required = false) String userCode) {
        Connection c = null;
        HotSeatVRNOModel reusult = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCHotSeatVRNODAO dao = new JDBCHotSeatVRNODAO(c);
            reusult = dao.getVRNOData(userCode);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/filterRefreshReportData")
    public @ResponseBody
    FileUploadStatus FilterRefreshReportData(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("divCode") String divCode, @RequestParam("accYear") String accYear,
            @RequestParam("JSON") String filterDataJSON,
            @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam(value = "userFlag", required = false) String userFlag) throws ParseException {
        Connection c = null;
        FileUploadStatus model = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCCallLastUpdateProcedureDAO dao = new JDBCCallLastUpdateProcedureDAO(c);
            model = new FileUploadStatus();
            String reusult = dao.filterRefreshReportData(seqId, userCode, entityCode, divCode, accYear, filterDataJSON, accCode, userFlag, geoOrgCode);
            model.setStatus(reusult);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/searchedReportData")
    public @ResponseBody
    GraphLabelDetailJSON searchedReportData(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("pageNo") int pageNo, @RequestParam("searchText") String searchText) {
        Connection c = null;
        GraphLabelDetailJSON json = new GraphLabelDetailJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableLableDetailDAO dao = new JDBCTableLableDetailDAO(c);
            List<GraphLabelDetailModel> model = (List<GraphLabelDetailModel>) dao.getSearchedGraphData(seqNo, userCode, pageNo, searchText);

            json.setGraphGabelDetail(model);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/CallLastUpdateProcedure")
    public @ResponseBody
    FileUploadStatus CallLastUpdateProcedure(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId, @RequestParam(value = "userCode", required = false) String userCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("divCode") String divCode, @RequestParam("accYear") String accYear) {
        Connection c = null;

        FileUploadStatus model = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCCallLastUpdateProcedureDAO dao = new JDBCCallLastUpdateProcedureDAO(c);
            model = new FileUploadStatus();
            String reusult = dao.callProcedureLastupdate(seqId, userCode, entityCode, divCode, accYear);
            model.setStatus(reusult);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getPlaceOrderNetValue")
    public @ResponseBody
    HashMap<String, String> getPlaceOrderNetValue(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam(value = "accCode", required = false) String accCode,
            String divCode, @RequestParam("totalAmt") String totalAmt) {
        Connection c = null;
        HashMap<String, String> res = new HashMap<String, String>();
        String result = "";
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCCallLastUpdateProcedureDAO dao = new JDBCCallLastUpdateProcedureDAO(c);
            result = dao.getPlaceOrderNetValue(seqNo, accCode, totalAmt);
            res.put("result", result);
//            model.setStatus(result);
//            return res;
        } catch (Exception e) {
            U.errorLog(e);
        }
        return res;
    }

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getUserLOV")
    public @ResponseBody
    ArrayList<GenericCodeNameModel> getUserLOV(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo,
            //                        @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam("userCode") String userCode) throws SQLException {
        Connection c = null;
        ArrayList<GenericCodeNameModel> json = new ArrayList<GenericCodeNameModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getUserLOV(seqNo);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getLOVDyanamically")
    public @ResponseBody
    WBSLocationJSON getLOVDyanamically(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("uniqueID") String uniqueID, @RequestParam("forWhichColmn") String forWhichColmn,
            @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam("userCode") String userCode, @RequestParam(value = "geoOrgCode", required = false) String goeOrgCode,
            @RequestParam(value = "loginUserFlag", required = false) String loginUserFlag,
            @RequestParam(value = "accCode", required = false) String accCode,
            @RequestParam(value = "accYear", required = false) String accYear) throws SQLException {
//        long startTime = System.currentTimeMillis();

        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("===== open lov === " + goeOrgCode);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getLovDyanamically(uniqueID, forWhichColmn, whereClauseValue, userCode, goeOrgCode, accCode, loginUserFlag, accYear);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getReportFilterLOV")
    public @ResponseBody
    WBSLocationJSON getReportFilterLOV(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("uniqueID") String uniqueID, @RequestParam("forWhichColmn") String forWhichColmn,
            @RequestParam(value = "whereClauseValue", required = false) String whereClauseValue,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam("userCode") String userCode) throws SQLException {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        WBSLocationJSON json = new WBSLocationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            JDBCgetLOVDyanamicallyDAO dao = new JDBCgetLOVDyanamicallyDAO(c);
            json = dao.getReportFilterLOV(uniqueID, forWhichColmn, whereClauseValue, userCode, geoOrgCode);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/addEntryDyanamically", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addEntryDyanamically(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("isAddonTempEntry==>>>" + isAddonTempEntry);
            JDBCAddEntryDyanamicallyDAO dao1 = new JDBCAddEntryDyanamicallyDAO(c);
            fileUploadStatus = dao1.addEntry(jsonString, isAddonTempEntry);
        } catch (Exception e) {
            U.log("Exception : " + e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/addMultipleEntry", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus addMultipleEntry(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("jsonString") String jsonString, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry,
            @RequestParam(value = "flag", required = false) String flag, @RequestParam(value = "headSeqId", required = false) String headSeqId) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCMultipleAddEntryDAO dao1 = new JDBCMultipleAddEntryDAO(c);
            fileUploadStatus = dao1.addMultipleEntry(jsonString, flag, isAddonTempEntry, headSeqId);
            U.log("jsonFlag=========" + jsonString);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getEntryDetailDyanamically")
    public @ResponseBody
    List<EntryDetailDynamicModel> getEntryDetailDyanamically(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tableSeqNo") String seq_no, @RequestParam("updateKey") String updateKey) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        List<EntryDetailDynamicModel> valueList = new ArrayList<EntryDetailDynamicModel>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCgetEntryDetailDyanamicalyDAO dao = new JDBCgetEntryDetailDyanamicalyDAO(c);
            valueList = dao.getDetailOfEntry(seq_no, updateKey);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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
    //getRecordDetailForUpdateForm

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateEntryForm")
    public @ResponseBody
    RecordInfoJSON getRecordDetailForUpdateForm(@RequestParam("userCode") String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("tableSeqNo") String seq_no,
            @RequestParam("updateKey") String updateKey, @RequestParam(value = "acccode", required = false) String acccode, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        System.out.println("UPDATE KEY: " + updateKey);
        Connection c = null;
        RecordInfoJSON json = new RecordInfoJSON();
        try {

            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("(seq_no, userCode, updateKey, acccode,isAddonTempEntry)" + seq_no + " " + userCode + " " + updateKey + "  " + acccode + " " + isAddonTempEntry);
            JDBCdynamicUpdateFormDAO dao = new JDBCdynamicUpdateFormDAO(c);
            json = dao.getRecordDetailForUpdateForm(seq_no, userCode, updateKey, acccode, isAddonTempEntry);
            //  json.setRecordsInfo(valueList);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");

        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/itemList")
    public @ResponseBody
    ItemListJSON findItemList(@RequestParam("userCode") String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("tableSeqNo") String seq_no,
            @RequestParam("updateKey") String updateKey, @RequestParam(value = "accCode", required = false) String acccode,
            @RequestParam(value = "searchText", required = false) String searchText) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        ItemListJSON json = new ItemListJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCfindItemListDAO dao = new JDBCfindItemListDAO(c);

            json = dao.getRecordDetailForUpdateForm(seq_no, userCode, updateKey, acccode, searchText);
            //  json.setRecordsInfo(valueList);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updateEntryDyanamically(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry, @RequestParam(value = "DOCTYPE", required = false) String docType,
            @RequestParam(value = "headSeqId", required = false) String headSeqId,
            @RequestParam(value = "user_level", required = false) String user_level,
            @RequestParam(value = "appr_status", required = false) String appr_status,
            @RequestParam(value = "userCode", required = false) String userCode) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("appr_status====" + appr_status);
            JDBCupdateEntryDyanmicDAO dao1 = new JDBCupdateEntryDyanmicDAO(c);
            String status = dao1.UpdateGivenEntry(jsonString, isAddonTempEntry, headSeqId, docType, user_level, appr_status, userCode);
            fileUploadStatus.setStatus(status);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/updateHotSeatEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus updateHotSeatEntryDyanamically(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCupdateHotSeatEntryDyanmicDAO dao1 = new JDBCupdateHotSeatEntryDyanmicDAO(c);
            String status = dao1.UpdateGivenEntry(jsonString, entity);
            fileUploadStatus.setStatus(status);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/entryDetailInTabular")
    public @ResponseBody
    TabularFormDataJSON entryDetailInTabular(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("vrno") String vrno, @RequestParam("searchText") String searchText,
            @RequestParam("accCode") String accCode) throws SQLException, Exception {
        Connection c = null;
        TabularFormDataJSON json = new TabularFormDataJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCgetTabularFormEntrydetailDAO dao = new JDBCgetTabularFormEntrydetailDAO(c);
//            if (entity.equals("CPT")) {
//                entity = "CP";
//            }
            TabularFormEntryDetailModel model = dao.getDetailOfEntry(entity, seqNo, vrno, userCode, accCode, searchText);
            json.setRecordInfo(model);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/deleteEntry")
    public @ResponseBody
    MessageJSON deleteEntry(@RequestParam("seqId") String seqId, @RequestParam("seqNo") String seqNo,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDeleteEntryDAO dao = new JDBCDeleteEntryDAO(c);
            String s = dao.deleteEntry(seqId, seqNo);
            json.setResult(s);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/multipleUpdateEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus multipleUpdateEntryInfo(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("jsonString") String jsonString, @RequestParam(value = "updateKey", required = false) String updateKey,
            @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry,
            @RequestParam(value = "headSeqId", required = false) String headSeqId) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {

            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCUpdateMultipleEntryDAO dao1 = new JDBCUpdateMultipleEntryDAO(c);
            String status = dao1.UpdateEntry(jsonString, isAddonTempEntry, headSeqId, updateKey);
            fileUploadStatus.setStatus(status);
//            long endTime = System.currentTimeMillis();
//            long finalTime = endTime - startTime;
//            U.log("serviceTime=" + finalTime / 1000.0 + " sec");
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
        return fileUploadStatus;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/offlineFormInfo")
    public @ResponseBody
    OfflineFormJSON OffilineFormInfoDAO(@RequestParam("userCode") String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("apptype") String apptype,
            @RequestParam("accCode") String accCode,
            @RequestParam("searchText") String searchText) {
        Connection c = null;
        OfflineFormJSON json = new OfflineFormJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCOffilineFormInfoDAO dao = new JDBCOffilineFormInfoDAO(c);
//            if (entity.equals("CPT")) {
//                entity = "CP";
//            }
            json = dao.offlineTableDetail(entity, apptype, userCode, accCode, searchText, "");
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/dependantRowValue")
    public @ResponseBody
    ValueClassModel dependentRowLogic(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode,
            @RequestParam(value = "empCode", required = false) String empCode) throws SQLException {
        Connection c = null;
        ValueClassModel model = new ValueClassModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("whereClauseValue : " + whereClauseValue);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.getRowVal(uniquKey, forWhichcolmn, whereClauseValue, geoOrgCode, empCode);
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
        return model;
    }

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/selfDependantRowValue")
    public @ResponseBody
    ListOfDependentRowValueModel selfDependantRowValue(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue) throws SQLException {
        Connection c = null;
        ListOfDependentRowValueModel model = new ListOfDependentRowValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.selfDependantRowValue(uniquKey, forWhichcolmn, whereClauseValue);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getDetailInformation")
    public @ResponseBody
    DetailInfoModel getDetailInformation(@RequestParam("uniquKey") String uniquKey,
            @RequestParam("forWhichcolmn") String forWhichcolmn,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("whereClauseValue") String whereClauseValue) throws SQLException {
        Connection c = null;
        DetailInfoModel model = new DetailInfoModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.getDetailInformation(uniquKey, forWhichcolmn, whereClauseValue);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/validateValue")
    public @ResponseBody
    ValidateValueModel validateValue(@RequestParam("SeqNo") String SeqNo,
            @RequestParam("valueToValidate") String valueToValidate,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("colSLNO") String colSLNO) throws SQLException {

        Connection c = null;
        String ValidatedMsg = "";
        ValidateValueModel model = new ValidateValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            U.log("colSLNO:-   " + colSLNO + " valueToValidate  :-  " + valueToValidate);
            JDBCDependentRowLogicDAO dao = new JDBCDependentRowLogicDAO(c);
            model = dao.validateValue(SeqNo, colSLNO, valueToValidate);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/tableAllRowsDetail")
    public @ResponseBody
    TableDetailOfflineJSON allTableRowsDetail(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("tableName") String tableName) throws SQLException {
        Connection c = null;
        TableDetailOfflineJSON json = new TableDetailOfflineJSON();;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            TableDetailForOfflineModel model = new TableDetailForOfflineModel();
            JDBCgetTableAllRowsDAO dao = new JDBCgetTableAllRowsDAO(c);
            model = dao.tableRows(tableName);
            json = new TableDetailOfflineJSON();
            json.setTableDetail(model);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/GPStracking")
    public @ResponseBody
    MessageJSON GPStracking(@RequestParam("userCode") String userCode, @RequestParam("lat") String lat,
            @RequestParam("deviceId") String deviceId, @RequestParam("DeviceName") String DeviceName,
            @RequestParam("lng") String lng, @RequestParam("location") String location,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("locationDate") String locationDate) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCGPSTrackingDAO dao = new JDBCGPSTrackingDAO(c);
            String status = dao.insertGPS(seqNo, userCode, lat, lng, location, locationDate, deviceId, DeviceName);
            json.setResult(status);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/notificationCount")
    public @ResponseBody
    MessageJSON notificationCount(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCNotificationCountDAO dao = new JDBCNotificationCountDAO(c);
            int count = dao.getNotificationCount(userCode, seqNo);
            json.setResult(String.valueOf(count));
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/saveSourceDestLocation")
    public @ResponseBody
    MessageJSON saveSourceDestLocation(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo,
            @RequestParam("sourceLat") String sourceLat,
            @RequestParam("destLat") String destLat,
            @RequestParam("sourceLong") String sourceLong,
            @RequestParam("destLong") String destLong,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        MessageJSON json = new MessageJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCLocationTrackingDAO dao = new JDBCLocationTrackingDAO(c);
            json = dao.saveSourceDestLocation(userCode, seqNo, sourceLat, sourceLong, destLat, destLong);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/getUpdatedLocation")
    public @ResponseBody
    ArrayList<UpdatedLocationJSON> getUpdatedLocation(@RequestParam("userCode") String userCode,
            @RequestParam("seqId") String seqId,
            @RequestParam("seqNo") String seqNo,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        ArrayList<UpdatedLocationJSON> json = new ArrayList<UpdatedLocationJSON>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCLocationTrackingDAO dao = new JDBCLocationTrackingDAO(c);
            json = dao.getUpdatedLocation(userCode, seqNo, seqId);
        } catch (Exception e) {
            U.errorLog(e);
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

//    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/notification")
//    public @ResponseBody
//    NotificationJSON notification(@RequestParam("userCode") String userCode,
//            @RequestParam("seqNo") String seqNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
//            @PathVariable("password") String password, @PathVariable("entity") String entity,
//            @PathVariable("dburl") String domainName,
//            @PathVariable("portNo") String portno) throws SQLException {
//        Connection c = null;
//        NotificationJSON json = new NotificationJSON();
//        try {
//            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
//            JDBCNotificationDAO dao = new JDBCNotificationDAO(c);
//            List<NotificationModel> modelList = dao.getNotifications(userCode, seqNo);
//            json.setModel(modelList);
//        } catch (Exception e) {
//            U.log(e);
//        } finally {
//            if (c != null) {
//                try {
//                    c.close();
//                    c = null;
//                } catch (SQLException ex) {
//                    Logger.getLogger(DyanamicPageCreationController.class.getName()).log(Level.SEVERE, null, ex);
//                }
//            }
//        }
//        return json;
//    }
    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/notification")
    public @ResponseBody
    ArrayList<HashMap<String, String>> notification(@RequestParam("userCode") String userCode,
            @RequestParam("seqNo") String seqNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam(value = "login_user_flag", required = false) String login_user_flag,
            @RequestParam(value = "acc_code", required = false) String acc_code,
            @RequestParam(value = "geoOrgCode", required = false) String geoOrgCode
    ) throws SQLException {
        Connection c = null;
        ArrayList<HashMap<String, String>> json = new ArrayList<HashMap<String, String>>();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCNotificationDAO dao = new JDBCNotificationDAO(c);
            json = dao.getCrmNotification(userCode, seqNo, login_user_flag, acc_code, geoOrgCode);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/forceNotification")
    public @ResponseBody
    NotificationJSON forceNotification(@RequestParam("userCode") String userCode, @RequestParam("seqNo") String seqNo,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName, @PathVariable("password") String password,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        NotificationJSON json = new NotificationJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCNotificationDAO dao = new JDBCNotificationDAO(c);
            List<NotificationModel> modelList = dao.getForceNotifications(userCode, seqNo);
            json.setModel(modelList);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/reportDrillDown")
    public @ResponseBody
    TableDescJSON getTableDesc(@RequestParam("value") String value,
            @RequestParam("seqId") String seqId,
            @RequestParam("slNo") String slNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno) throws SQLException {
        Connection c = null;
        TableDescJSON json = new TableDescJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableDescDAO dao = new JDBCTableDescDAO(c);
            json = dao.getTableDesc(seqId, slNo, value);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/reportDrillDownGrid")
    public @ResponseBody
    TableDescGridJSON getTableDescGrid(@RequestParam("columnName") String columnName,
            @RequestParam("value") String value, @RequestParam("seqId") String seqId,
            @RequestParam("pageNo") int pageNo,
            @RequestParam("searchText") String searchText,
            @RequestParam(value = "valueFormat", required = false) String valueFormat,
            @RequestParam("slNo") String slNo, @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam(value = "JSON", required = false) String filterDataJSON) throws SQLException {
        Connection c = null;
        TableDescGridJSON json = new TableDescGridJSON();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCTableDescDAO dao = new JDBCTableDescDAO(c);
            json = dao.TableDescGridJSON(seqId, slNo, value, columnName, pageNo, searchText, valueFormat, filterDataJSON);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/APICall")
    public @ResponseBody
    String APICall(@RequestParam("userCode") String userCode,
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
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
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCAPICallDAO dao = new JDBCAPICallDAO(c);

            if (entity.equals("CPT")) {
                entity = "CP";
            }
            json = dao.setAPICall(clientID, data_Type, attachedData);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/findTermsCondition")
    public @ResponseBody
    TermsAndCondition findTermsCondition(
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("seqId") String seqId,
            @RequestParam(value = "searchText", required = false) String searchText) {
        Connection c = null;
        TermsAndCondition json = new TermsAndCondition();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            TermsAndConditionDAO dao = new TermsAndConditionDAO(c);

            if (entity.equals("CPT")) {
                entity = "CP";
            }
            json = dao.getTermsValue(seqId, entityCode, searchText);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/findAddonParam")
    public @ResponseBody
    AddonModel findAddonParam(
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("entityCode") String entityCode, @RequestParam("seqId") String seqId,
            @RequestParam(value = "searchText", required = false) String searchText) {
        Connection c = null;
        AddonModel json = new AddonModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCAddonParamDAO dao = new JDBCAddonParamDAO(c);

            if (entity.equals("CPT")) {
                entity = "CP";
            }
            json = dao.getAddonValue(seqId, entityCode, searchText);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/dyanamicTable")
    public @ResponseBody
    HeadingValueOfTable dyanamicTable(
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("accCode") String accCode,
            @RequestParam("isChildSeq") String isChildSeq,
            @RequestParam(value = "consigneeCode", required = false) String consigneeCode, @RequestParam(value = "divCode", required = false) String divCode,
            @RequestParam("entityCode") String entityCode, @RequestParam("seqId") String seqId) {
        Connection c = null;
        HeadingValueOfTable json = new HeadingValueOfTable();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCDyanamicTableValueDAO dao = new JDBCDyanamicTableValueDAO(c);

            if (entity.equals("CPT")) {
                entity = "CP";
            }
            json = dao.getdyanamicTableHV(entityCode, seqId, accCode, isChildSeq, consigneeCode, divCode);
        } catch (Exception e) {
            U.errorLog(e);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/multipleDeleteEntryInfo", method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus multipleDeleteEntryInfo(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("jsonString") String jsonString, @RequestParam(value = "updateKey", required = false) String updateKey, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry, @RequestParam(value = "headSeqId", required = false) String headSeqId) throws SQLException, Exception {
//        long startTime = System.currentTimeMillis();
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            U u = new U(c);
            JDBCUpdateMultipleEntryDAO dao1 = new JDBCUpdateMultipleEntryDAO(c);
            String status = dao1.DeleteEntry(jsonString, isAddonTempEntry, headSeqId, updateKey);
            fileUploadStatus.setStatus(status);
        } catch (Exception e) {
            U.errorLog(e);
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
    
    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/Apptracking", method = RequestMethod.POST)
    public @ResponseBody
    MessageJSON GPStrackingNew(
            @PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
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

//            if (seqNo.equals("107")) {
//                String writeFlag = write_file(seqNo, userCode, deviceId, DeviceName, seqNo, dataTosend, locSummary, c);
//                System.out.println("FILE WRITE " + writeFlag);
//                json.setStatus("success");
//                json.setResult("success");
//
//            } else {
                c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
                JDBCGPSTrackingDAO dao = new JDBCGPSTrackingDAO(c);
                json = dao.insertData(seqNo, userCode, deviceId, DeviceName, jsonStr, dataTosend, locSummary);
//            }
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
}
