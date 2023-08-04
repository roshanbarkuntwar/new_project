/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.JSONResult;

import com.lhs.EMPDR.Model.ImageModal;
import java.util.ArrayList;

/**
 *
 * @author kirti.misal
 */
public class DependentImageJSON {
    ArrayList<ImageModal> dependentImages;

    public ArrayList<ImageModal> getDependentImages() {
        return dependentImages;
    }

    public void setDependentImages(ArrayList<ImageModal> dependentImages) {
        this.dependentImages = dependentImages;
    }
    
}
