package com.buaa.lucker.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.buaa.lucker.pojo.Edge;
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
	public Map getInteract(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map map=new HashMap();
		Map<String,List> nodemap=new HashMap<String,List>();
		List<Edge> edgelist=new ArrayList<Edge>();
		String id = req.getParameter("id").trim();
		String cengshu = req.getParameter("cengshu").trim();
		//记录所有的节点
		List<String> listall=new ArrayList<String>();
		listall.add(id);
		//添加第一层
		List<String> listcurrent=new ArrayList<String>();
		listcurrent.add(id);
		nodemap.put("0", listcurrent);
		//当前层节点，需要不断的更新
//		List<String> listCurrent=new ArrayList();
//		for(int i=0;i<list.size();i++)
//			listCurrent.add(list.get(i));
		//开始按层查找
		for(int i=1;i<=Integer.parseInt(cengshu);i++){
			listcurrent=new ArrayList<String>();
			for(int j=0;j<nodemap.get(String.valueOf(i-1)).size();j++)
			{
				String s=(String) nodemap.get(String.valueOf(i-1)).get(j);
				List<String> list=personService.getInteract(s);
				//对list去重
				for(int k=0;k<list.size();k++)
				{
					if(!isList(listall,list.get(k)))
					{
						listcurrent.add(list.get(k));
						Edge e=new Edge();
						e.setSource(Integer.parseInt(s));
						e.setTarget(Integer.parseInt(list.get(k)));
						e.setWeight(1);
						edgelist.add(e);
					}
				}
			}
			nodemap.put(String.valueOf(i), listcurrent);
			for(int j=0;j<listcurrent.size();j++)
				listall.add(listcurrent.get(j));
		}
		map.put("nodes",nodemap);
		map.put("edges", edgelist);
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(map);
		return map;
	}
	public boolean isList(List<String> list,String s){
		for(int i=0;i<list.size();i++){
			if(s.equals(list.get(i)))
				return true;
		}
		return false;
	}
}
