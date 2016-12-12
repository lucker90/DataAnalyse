package com.buaa.lucker.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.buaa.lucker.service.PersonService;
@Controller
@RequestMapping("/Person")
public class PersonController {
	//@Resource 
	@Autowired
    @Qualifier("PersonService")
	private PersonService personService;
	
	@RequestMapping(value ="/getInteract",method = RequestMethod.POST)
	@ResponseBody
	public Map getInteract(HttpServletRequest req, HttpServletResponse resp){
		Map map=new HashMap();
		String id = req.getParameter("id").trim();
		String cengshu = req.getParameter("cengshu").trim();
//		personService
		map.put("id", id);
		map.put("cengshu", cengshu);
		return map;
	}
}
