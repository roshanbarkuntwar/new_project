/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.restDAO;

import com.lhs.EMPDR.utility.U;
import com.sun.org.apache.bcel.internal.generic.RETURN;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author kirti.misal
 */
public class DateManipulationDAO {

    Connection c;
    String returnDate;

    public DateManipulationDAO(Connection c) {
        this.c = c;
    }

    public String findDate() {
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            //TO_CHAR(sysdate, 'DD-MM-YYYY  HH24:MI:SS')
            //TO_DATE(sysdate, 'DD-MM-YYYY  HH24:MI:SS')
//           String sql="select TO_DATE(TO_CHAR(vrdate, 'DD-MM-YYYY  HH24:MI:SS'), 'DD-MM-YYYY  HH24:MI:SS') from order_head where vrno='SQ18O17-001'";
            String sql = " select TO_CHAR(VALIDUPTO_DATE,'DD-MM-YYYY') from ORDER_HEAD where VRNO='SQ18O22-001'";
            ps = c.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs != null && rs.next()) {
                returnDate = rs.getString(1);
            }
        } catch (Exception e) {
            U.log(e);
        } finally {
            try {
                c.close();
            } catch (SQLException ex) {
                Logger.getLogger(DateManipulationDAO.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return returnDate;
    }

}
