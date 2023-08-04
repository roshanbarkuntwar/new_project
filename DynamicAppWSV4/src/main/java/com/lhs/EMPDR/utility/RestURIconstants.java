/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.utility;

/**
 *
 * @author kirti.misal
 */
public class RestURIconstants {

    //global 
    public static final String PATH_URL = "/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}";

    public static final String GET_RETAILER_DASHBOARD = "/retailerDashboard";

    public static final String ADDON_CALCULATION = "/addonCalculation";//record in key=column_name value pair

    public static final String SAVE_ENTRY = "/saveEntry";

    public static final String FIND_NEXT_SEQID = "/getNextSeqId";

    public static final String SAVE_ALL_ENTRY = "/saveAllEntry";

    public static final String CALL_SAVE_PROCEDURE = "/callSaveProcedure";

    public static final String CALL_SAVE_PROCEDURE2 = "/callSaveProcedure2";
    //save data from one table to another.
    public static final String CALL_ADDON_CALCULATION_PROCEDURE = "/callAddonCalculationProcedure";//For addon calculation.

    public static final String FETCH_RECORD_ARRAY = "/fetchRecordsArray";//record in key=column_name value pair

    public static final String FIND_DATA_INFO = "/findDataInfoArray";

    public static final String GET_TASK_TABS = "/getTaskTabs";

    public static final String GET_TASK_LIST = "/getTaskList";

    public static final String GET_TASK_STATUS_LIST = "/getTaskStatusList";

    public static final String UPDATE_TASK_STATUS = "/updateTaskStatus";

    public static final String UPDATE_TASK_STATUS_REMARK = "/updateTaskStatusRemark";

    public static final String SYSDATE = "/sysdate";

    public static final String TEXTBAND_ATTRIBUTE = "/textband_attribute";
    
    public static final String COLLAPSE_ATTRIBUTE = "/collapse_attribute";
    
    public static final String UPDATE_LOCATION = "/updateLocation";
    
    public static final String KPI_ATTRIBUTE = "/kpi_attribute";

}
