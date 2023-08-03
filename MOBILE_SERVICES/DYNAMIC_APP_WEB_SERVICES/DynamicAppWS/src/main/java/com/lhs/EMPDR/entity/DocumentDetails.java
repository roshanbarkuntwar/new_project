/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.entity;

import java.io.InputStream;

/**
 *
 * @author dhanshri.paradkar
 */
public class DocumentDetails {
    
    private String docType;
    
    private byte[] docInputStream;

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public byte[] getDocInputStream() {
        return docInputStream;
    }

    public void setDocInputStream(byte[] docInputStream) {
        this.docInputStream = docInputStream;
    }

    
    
}
