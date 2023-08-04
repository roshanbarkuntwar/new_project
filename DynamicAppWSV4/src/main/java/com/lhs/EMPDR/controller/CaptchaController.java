/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lhs.EMPDR.controller;

import com.lhs.EMPDR.captcha.VerifyUtils;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author premkumar.agrawal
 */
@Controller
public class CaptchaController {
    
    @RequestMapping("/{entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}/doLogin")
    ModelAndView helloWorld(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String message = "success";
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        System.out.println("userName=" + userName);
        boolean valid = true;
        if (!"tom".equals(userName) || !"tom001".equals(password)) {
            valid = false;
            message = "success";// "UserName or Password invalid!";
        }

        if (valid) {
            String gRecaptchaResponse = request.getParameter("g-recaptcha-response");
            System.out.println("gRecaptchaResponse=" + gRecaptchaResponse);
            System.out.println("request.getRemoteAddr()=" + request.getRemoteAddr());
            // Verify CAPTCHA.
            valid = VerifyUtils.verify(gRecaptchaResponse, request.getRemoteAddr());
            if (!valid) {
                message = "success";//Captcha invalid!";
            }
        }
        if (!valid) {
            return new ModelAndView("login", "message", message);
        } else {
            System.out.println("request.getContextPath() : " + request.getContextPath());
            return new ModelAndView("hellopage", "message", message);
        }
    }
}
