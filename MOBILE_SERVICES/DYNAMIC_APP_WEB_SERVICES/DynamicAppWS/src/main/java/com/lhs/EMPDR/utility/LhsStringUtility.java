package com.lhs.EMPDR.utility;

import com.lhs.javautilities.enumerators.SubStringPosition;
import java.util.HashMap;
import java.util.Set;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author bhawna.agrawal
 */
public class LhsStringUtility {

    /**
     * This method is used to check whether a given String is null or not
     *
     * @param comparionValue String value to check if it is null
     * @return <code>true</code> if comparionValue is null and
     * <code>false</code> if comparionValue is not null
     */
    public boolean isNull(String comparionValue) {
        boolean nullValue = true;
        try {
            if (comparionValue != null && !"".equals(comparionValue) && !"null".equalsIgnoreCase(comparionValue) && comparionValue.length() > 0) {
                nullValue = false;
            }
        } catch (NullPointerException npe) {
        } catch (Exception ex) {
        }
        return nullValue;
    }// end method

    /**
     * This method is used to get substring from front or back of the string
     *
     * @param position Position defines whether to subString from starting or
     * ending of a String. <Code>SubStringPosition.FRONT</code> indicates
     * subString from front <Code>SubStringPosition.BACK</code> indicates
     * subString from back
     *
     * @param txtstring String value to substring
     * @param startIndex Index from where to subString
     * @param endPosition Position until where to subString
     * @return String SubString value
     */
    public String getSubString(SubStringPosition position, String txtstring, int startIndex, int endPosition) {
        String returnString = null;
        try {
            if (0 <= startIndex) {
                switch (position) {
                    case FRONT:
                        returnString = txtstring.substring(startIndex, endPosition);
                        break;
                    case BACK:
                        returnString = txtstring.substring(0, txtstring.length() - endPosition);
                        break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnString;
    }// end method

    /**
     * This method is used to check if given String is present in another
     * String(same as oracle INSTR function)
     *
     * @param value Original String value
     * @param stringToFind String which is to be found in original value
     * @return <code>true</code> if value contains stringToFind and
     * <code>false</code> if value does not contain stringToFind
     */
    public Boolean checkIndexOf(String value, String stringToFind) {
        boolean returnValue = false;
        try {
            if (value.contains(stringToFind)) {
                returnValue = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnValue;
    }//end method

    /**
     * This method is used to decode specified String like decode method used in
     * oracle
     *
     * @param obj Object which is to be decoded i.e. replaced with some other
     * value (same as oracle decode method)
     * @param map Contains values and their replacement in key value pair
     * @param defaultValue
     * @return value associated with that object or defaultValue
     */
    public Object oracleDecode(Object obj, HashMap<Object, Object> map, Object defaultValue) {
        try {
            if (obj != null) {
                if (map != null && map.size() > 0) {
                    Set<Object> keySet = map.keySet();
                    if (keySet.contains(obj)) {
                        return map.get(obj);
                    } else if (defaultValue != null) {
                        return defaultValue;
                    }
                }
            }
        } catch (Exception e) {
        }
        return null;
    }//end method

    /**
     * Converts first character of all words to uppercase and rest lowercase
     *
     * @param value
     * @return
     */
    public String toInitCap(String value) {
        char[] initChars = value.toLowerCase().toCharArray();
        boolean charFoundSpcl = false;
        for (int i = 0; i < initChars.length; i++) {
            if (!charFoundSpcl && Character.isLetter(initChars[i])) {
                initChars[i] = Character.toUpperCase(initChars[i]);
                charFoundSpcl = true;
            } else if (Character.isWhitespace(initChars[i]) || '_' == initChars[i]) { // You can add other  Special character here
                charFoundSpcl = false;
            }
        }
        return String.valueOf(initChars);
    }//end method

    /**
     * Removes comma or 'Â' present in any String
     * @param value
     * @return
     */
    public String removeComma(String value) {
        String returnValue = value;
        if (!this.isNull(value)) {
            if (value.contains(",")) {
                returnValue = value.replace(",", "");
            }
            if (value.contains("Â")) {
                returnValue = value.replace("Â", "");
            }
        }
        return returnValue;
    }
}
