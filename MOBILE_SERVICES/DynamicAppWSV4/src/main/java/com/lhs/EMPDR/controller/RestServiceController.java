/*
 * To change this license header, choose License Headers in Project Properties
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.JSONResult.DataInfoListJSON;
import com.lhs.EMPDR.JSONResult.FileUploadStatus;
import com.lhs.EMPDR.JSONResult.TableDetailJSON;
import com.lhs.EMPDR.Model.CodeValueModel;
import com.lhs.EMPDR.Model.MapOfKeyValueJSON;
import com.lhs.EMPDR.Model.ValueClassModel;
import com.lhs.EMPDR.connection.RSconnectionProvider;
import com.lhs.EMPDR.dao.DynamicDashboardDAO;
import com.lhs.EMPDR.dao.CallProcedureInJDBC;
import com.lhs.EMPDR.dao.SaveAllEntryDao;
import com.lhs.EMPDR.dao.SaveEntryDao;
import com.lhs.EMPDR.dao.TaskManagementDAO;
import com.lhs.EMPDR.dao.TourPlanManagmentDAO;
import com.lhs.EMPDR.dao.ValidateEnrtryDao;

import com.lhs.EMPDR.dao.retailerDashboardDAO;
import com.lhs.EMPDR.restDAO.AddonCalculation;
import com.lhs.EMPDR.restDAO.DateManipulationDAO;
import com.lhs.EMPDR.restDAO.FindArrayOfRecord;
import com.lhs.EMPDR.restDAO.FindDataInfoArrayDAO;
import com.lhs.EMPDR.utility.RestURIconstants;
import com.lhs.EMPDR.utility.U;
import java.sql.Connection;
import java.sql.PreparedStatement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author kirti.misal
 */
@Controller
public class RestServiceController {

    /*
    It contains list which shown on dashbord and sql present in'defualt_populate_data'.
    It contains menu list which are in lhssys_portal_table_dsc_update by seq_no.    
     */
    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.GET_RETAILER_DASHBOARD, method = RequestMethod.GET)
    public @ResponseBody
    TableDetailJSON retailerDashboard(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo, @RequestParam("accCode") String accCode,
            @RequestParam("empCode") String empCode, @RequestParam("userCode") String userCode
    ) {
        Connection c = null;
        TableDetailJSON json = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);

            retailerDashboardDAO dao = new retailerDashboardDAO(c);
            json = dao.getRetailerDashboardInfo(seqNo, accCode, empCode, userCode);
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.SAVE_ENTRY, method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus saveEntry(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString, @RequestParam(value = "DOCTYPE", required = false) String DOCTYPE, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry
    ) {
//        System.out.println("SAVE ENTRY CONTROLLER" + jsonString);
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            System.out.println("isAddonTempEntry==>>>" + isAddonTempEntry + "  DOCTYPE  " + DOCTYPE);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            SaveEntryDao dao1 = new SaveEntryDao(c);
            U.log("fileUploadStatus--"+ fileUploadStatus.getStatus());
            fileUploadStatus = dao1.saveEntry(jsonString, isAddonTempEntry, DOCTYPE);
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.SAVE_ALL_ENTRY, method = RequestMethod.POST)
    public @ResponseBody
    FileUploadStatus saveAllEntry(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("jsonString") String jsonString, @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry,
            @RequestParam(value = "flag", required = false) String flag, @RequestParam(value = "headSeqId", required = false) String headSeqId) {
        System.out.println("SAVE ALL ENTRY CONTROLLER");
        FileUploadStatus fileUploadStatus = new FileUploadStatus();
        Connection c = null;
        try {
            System.out.println("isAddonTempEntry==>>>" + isAddonTempEntry);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            SaveAllEntryDao dao1 = new SaveAllEntryDao(c);
            fileUploadStatus = dao1.saveAllEntry(jsonString, flag, isAddonTempEntry, headSeqId);
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.TEXTBAND_ATTRIBUTE)
    public @ResponseBody
    HashMap<String, Object> textAttrib(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo, @RequestParam("acc_code") String acc_code,
            @RequestParam("entity_code") String entity_code, @RequestParam(value = "geo_org_code", required = false) String geo_org_code
    ) {
        Connection c = null;
        HashMap<String, Object> result = new HashMap<String, Object>();
        try {
            System.out.println("isAddonTempEntry==>>>" + seqNo);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            DynamicDashboardDAO dao1 = new DynamicDashboardDAO(c);
            result = dao1.getTextBandAttribute(seqNo, acc_code, entity_code, geo_org_code);
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
        return result;
    }
    
    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.KPI_ATTRIBUTE)
    public @ResponseBody
    HashMap<String, Object> kpiAttrib(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo, @RequestParam("acc_code") String acc_code,
            @RequestParam("entity_code") String entity_code, @RequestParam(value = "geo_org_code", required = false) String geo_org_code,
            @RequestParam("userCode") String user_code, @RequestParam("emp_code") String emp_code
    ) {
        Connection c = null;
        HashMap<String, Object> result = new HashMap<String, Object>();
        try {
            System.out.println("user_code : - "+ user_code + " emp_code - "+ emp_code);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            DynamicDashboardDAO dao1 = new DynamicDashboardDAO(c);
            result = dao1.getKpiAttribute(seqNo, acc_code, entity_code, geo_org_code, user_code, emp_code);
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
        return result;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.COLLAPSE_ATTRIBUTE)
    public @ResponseBody
    ArrayList<Object> collapseAttrib(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo, @RequestParam("acc_code") String acc_code,
            @RequestParam("entity_code") String entity_code, @RequestParam(value = "geo_org_code", required = false) String geo_org_code
    ) {
        Connection c = null;
        ArrayList result = new ArrayList();
        try {
            System.out.println("isAddonTempEntry==>>>" + seqNo);
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            DynamicDashboardDAO dao1 = new DynamicDashboardDAO(c);
            result = dao1.getCollapseAttribute(seqNo, acc_code, entity_code, geo_org_code);
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
        return result;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.FIND_NEXT_SEQID, method = RequestMethod.GET)
    public @ResponseBody
    String findNextSeqId(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("column_name") String column_name) {
        Connection c = null;
        String vcm = "";
        TableDetailJSON json = null;

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            retailerDashboardDAO dao = new retailerDashboardDAO(c);
            vcm = dao.getNextSeqId(seqNo, column_name);
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

        return vcm;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.CALL_SAVE_PROCEDURE, method = {RequestMethod.GET, RequestMethod.POST})
    public @ResponseBody
    CodeValueModel saveOneTableToAnother(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("seqId") Integer seqId,
            @RequestParam(value = "accYear", required = false) String accYear,
            @RequestParam(value = "isSendEmail", required = false) boolean isSendMail,
            @RequestParam(value = "isPushNotif", required = false) boolean isPushNotif,
            @RequestParam(value = "seqNo", required = false) String seqNo,
            @RequestParam(value = "json", required = false) String json) {

        System.out.println("call sav procedure==accyear" + accYear + " sendemial=" + isSendMail +"seqNo==" + seqNo + "json =="+json + "issendPushNotif=="+ isPushNotif );
        Connection c = null;
        CodeValueModel model = new CodeValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            CallProcedureInJDBC dao = new CallProcedureInJDBC(c);
            model.setValue(dao.callProcedure(seqId, accYear, isSendMail ,isPushNotif,seqNo,json));
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
    
    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.CALL_SAVE_PROCEDURE2, method = {RequestMethod.GET, RequestMethod.POST})
    public @ResponseBody
    CodeValueModel saveProcedureWithEmailAndPushNotf(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("seqId") String seqId,
            @RequestParam(value = "accYear", required = false) String accYear,
            @RequestParam(value = "isSendEmail", required = false) String isSendMail,
            @RequestParam(value = "isPushNotif", required = false) String isPushNotif,
            @RequestParam(value = "seqNo", required = false) String seqNo,
            @RequestParam(value = "json", required = false) String json) {

        System.out.println("call sav procedure seqId=="+ seqId +"==accyear" + accYear + " sendemial=" + isSendMail +"seqNo==" + seqNo + "json =="+json + "issendPushNotif=="+ isPushNotif );
        Connection c = null;
        CodeValueModel model = new CodeValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            CallProcedureInJDBC dao = new CallProcedureInJDBC(c);
            model.setValue(dao.callProcedure(Integer.parseInt(seqId), accYear, Boolean.valueOf(isSendMail) , Boolean.valueOf(isPushNotif),seqNo,json));
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.CALL_ADDON_CALCULATION_PROCEDURE, method = RequestMethod.GET)
    public @ResponseBody
    CodeValueModel addoncalculationByprocedure(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno,
            @RequestParam("flag") String flag,
            @RequestParam("seqId") Integer seqId){

        Connection c = null;
        CodeValueModel model = new CodeValueModel();
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            CallProcedureInJDBC dao = new CallProcedureInJDBC(c);
            model.setValue(dao.callAddonCalculationProcedure(seqId,flag));
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.FETCH_RECORD_ARRAY, method = RequestMethod.GET)
    public @ResponseBody
    String findRecordArray(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("primeryKeyValue") String primeryKeyValue,
            @RequestParam("isAddonTempEntry") String isAddonTempEntry) {

        Connection c = null;
//         FindArrayOfRecord findArrayOfRecord =new FindArrayOfRecord(c);
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            FindArrayOfRecord findArrayOfRecord = new FindArrayOfRecord(c);
            findArrayOfRecord.getArrayOfRecords(primeryKeyValue, seqNo, isAddonTempEntry);
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
        return "success";
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.ADDON_CALCULATION, method = RequestMethod.GET)
    public @ResponseBody
    MapOfKeyValueJSON addonCalculation(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("primeryKeyValue") String primeryKeyValue,
            @RequestParam("isAddonTempEntry") String isAddonTempEntry) {
        Connection c = null;
        MapOfKeyValueJSON keyValueJSON = new MapOfKeyValueJSON();

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            AddonCalculation ac = new AddonCalculation(c);
            keyValueJSON = ac.addoncalculation(primeryKeyValue, seqNo, isAddonTempEntry);
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
                c.commit();
                c.close();
            } catch (SQLException ex) {
                Logger.getLogger(RestServiceController.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        TableDetailJSON json = null;
        return keyValueJSON;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.FIND_DATA_INFO, method = RequestMethod.GET)
    public @ResponseBody
    DataInfoListJSON findDataInfoArray(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("primeryKeyValue") String primeryKeyValue, @RequestParam("userCode") String userCode, @RequestParam("accCode") String accCode,
            @RequestParam(value = "isAddonTempEntry", required = false) String isAddonTempEntry, @RequestParam(value = "entity_code", required = false) String entity_code,
            @RequestParam(value = "tcode", required = false) String tcode, @RequestParam(value = "approvedby", required = false) String approvedby) {
        Connection c = null;
        DataInfoListJSON dataInfoListJSON = new DataInfoListJSON();

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            FindDataInfoArrayDAO dataInfoDao = new FindDataInfoArrayDAO(c);
            dataInfoListJSON = dataInfoDao.getDataInfoList(primeryKeyValue, seqNo, isAddonTempEntry, userCode, accCode, entity_code, tcode, approvedby);
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
                c.commit();
                c.close();
            } catch (SQLException ex) {
                Logger.getLogger(RestServiceController.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return dataInfoListJSON;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.SYSDATE, method = RequestMethod.GET)
    public @ResponseBody
    String getsysdate(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password,
            @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno
    ) {
        Connection c = null;
        String result = null;

        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
            DateManipulationDAO dataInfoDao = new DateManipulationDAO(c);
            result = dataInfoDao.findDate();
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
                if (c != null) {
                    c.commit();
                    c.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(RestServiceController.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return result;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.GET_TASK_TABS, method = RequestMethod.GET)
    public @ResponseBody
    HashMap<String, Object> getTaskTabs(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqNo") String seqNo,
            @RequestParam("userCode") String userCode, @RequestParam("filterParam") String filterParam) throws Exception {
        HashMap<String, Object> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            taskTabs = obj.getTaskTabs(userCode, seqNo, filterParam);
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
        return taskTabs;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.GET_TASK_LIST, method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<HashMap<String, Object>> getTaskList(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("seqId") String seqId,
            @RequestParam("userCode") String userCode, @RequestParam("taskPriority") String taskPriority,
            @RequestParam("filterParam") String filterParam, @RequestParam(value = "taskStatus", required = false) String taskStatus) throws Exception {
        ArrayList<HashMap<String, Object>> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            taskTabs = obj.getTaskList(userCode, seqId, taskPriority, filterParam);
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
        return taskTabs;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.GET_TASK_STATUS_LIST, method = RequestMethod.GET)
    public @ResponseBody
    ArrayList<HashMap<String, Object>> getTaskStatusList(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("userCode") String userCode) throws Exception {
        ArrayList<HashMap<String, Object>> taskTabs = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            taskTabs = obj.getTaskStatusList(userCode, taskSeqNo);
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
        return taskTabs;
    }

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.UPDATE_TASK_STATUS, method = RequestMethod.GET)
    public @ResponseBody
    HashMap<String, String> updateTaskStatus(@PathVariable("dbName") String dbName, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @RequestParam("userCode") String userCode,
            @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("taskStatus") String taskStatus,
            @RequestParam("taskPersent") String taskPersent,
            @RequestParam("taskCode") String taskCode,
            @RequestParam("remark") String remark,
            @RequestParam("assignorEmpCode") String assignorEmpCode
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);

            resStatus = obj.updateTaskStatus(userCode, taskSeqNo, taskStatus, remark, taskPersent, taskCode, assignorEmpCode);

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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.UPDATE_TASK_STATUS_REMARK, method = RequestMethod.GET)
    public @ResponseBody
    HashMap<String, String> updateTaskStatusRemark(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @RequestParam("userCode") String userCode,
            @RequestParam("taskSeqNo") String taskSeqNo,
            @RequestParam("taskSlno") String taskSlno,
            @RequestParam("remark") String remark
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            resStatus = obj.updateTaskStatusRemark(userCode, remark, taskSeqNo, taskSlno);
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

    @RequestMapping(value = RestURIconstants.PATH_URL + RestURIconstants.UPDATE_LOCATION, method = RequestMethod.GET)
    public @ResponseBody
    HashMap<String, String> updateLocation(@PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword, @PathVariable("dbVersion") String dbVersion,
            @RequestParam("userCode") String userCode,
            @RequestParam("location") String location,
            @RequestParam("latitude") String latitude,
            @RequestParam("longitude") String longitude,
            @RequestParam("user") String user,
            @RequestParam("table") String table,
            @RequestParam("update_key") String update_key
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            resStatus = obj.updateLocation(userCode, latitude, longitude, location, user, table, update_key);
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

    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/validateEntry")
    public @ResponseBody
    HashMap<String, Object> validateEntry(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("seqNo") String seqNo, @RequestParam("userCode") String userCode,
            @RequestParam(value = "userFlag", required = false) String userFlag,
            @RequestParam("filterParam") String filterParam) throws Exception {

        Connection connection = null;
        HashMap<String, Object> json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
//            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
//            json = dao.extractFile(fileId);

            ValidateEnrtryDao dao = new ValidateEnrtryDao(connection);
            json = dao.validateEnrtry(userCode, seqNo, filterParam, userFlag);

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
    
    @RequestMapping(value = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/validateIsExist")
    public @ResponseBody
    HashMap<String, String> validateIsExist(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("password") String password, @PathVariable("entity") String entity,
            @PathVariable("dburl") String domainName, @PathVariable("portNo") String portno,
            @RequestParam("isExistQuery") String isExistQuery, @RequestParam("value") String value
          ) throws Exception {

        Connection connection = null;
        HashMap<String, String> json = null;
        try {
            connection = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, password, dbVersion);
//            JDBCVideoDAO dao = new JDBCVideoDAO(connection);
//            json = dao.extractFile(fileId);

            ValidateEnrtryDao dao = new ValidateEnrtryDao(connection);
           json =  dao.validateExist(isExistQuery, value);
//            json = dao.validateEnrtry(userCode, seqNo, filterParam, userFlag);

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

    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/reAssignTask")
    public @ResponseBody
    HashMap<String, String> reAssignTask(@PathVariable("dbVersion") String dbVersion, @PathVariable("dbName") String dbName,
            @PathVariable("entity") String entity, @PathVariable("dburl") String domainName,
            @PathVariable("portNo") String portno, @PathVariable("password") String dbpassword,
            @RequestParam("taskSeqNo") String taskSeqNo, @RequestParam("reAssignData") String reAssignData
    ) throws Exception {
        HashMap<String, String> resStatus = null;
        System.out.println("reAssignData");
        System.out.println("reAssignData: " + reAssignData);
        Connection c = null;
        try {
            c = RSconnectionProvider.getConnection(entity, domainName, portno, dbName, dbpassword, dbVersion);
            TaskManagementDAO obj = new TaskManagementDAO(c);
            resStatus = obj.reAssignTask(taskSeqNo, reAssignData);
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
}
