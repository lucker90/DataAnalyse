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
import com.buaa.lucker.pojo.person;
import com.buaa.lucker.service.PersonService;
@Controller
@RequestMapping("/Person")
public class PersonController {
	//@Resource 
	@Autowired
    @Qualifier("PersonService")
	private PersonService personService;
	
	
	@RequestMapping(value ="/getFriends",method = RequestMethod.POST)
	@ResponseBody
	public Map getFriends(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map map=new HashMap();
		List<List<String>> nodelist=new ArrayList<List<String>>();
		List<Edge> edgelist=new ArrayList<Edge>();
		String id = req.getParameter("id").trim();
		String cengshu = req.getParameter("cengshu").trim();
		//记录所有的节点
		List<String> listall=new ArrayList<String>();
		listall.add(id);
		//添加第一层
		List<String> listcurrent=new ArrayList<String>();
		listcurrent.add(id);
		nodelist.add(listcurrent);
		//当前层节点，需要不断的更新
//		List<String> listCurrent=new ArrayList();
//		for(int i=0;i<list.size();i++)
//			listCurrent.add(list.get(i));
		//开始按层查找
		for(int i=1;i<=Integer.parseInt(cengshu);i++){
			listcurrent=new ArrayList<String>();
			for(int j=0;j<nodelist.get(i-1).size();j++)
			{
				String s=(String) nodelist.get(i-1).get(j);
				List<Edge> list=personService.getFriends(s);
				//对list去重
				for(int k=0;k<list.size();k++)
				{
					//插入边
					int flag=0;
					for(int m=0;m<edgelist.size();m++)
					{
						if(edgelist.get(m).getSource().equals(list.get(k).getSource())&&edgelist.get(m).getTarget().equals(list.get(k).getTarget())||edgelist.get(m).getSource().equals(list.get(k).getTarget())&&edgelist.get(m).getTarget().equals(list.get(k).getSource()))
						{
							flag=1;
							break;
						}
					}
					if(flag==0)
					{
//						Edge e=new Edge();
//						e.setSource(Integer.parseInt(s));
//						e.setTarget(Integer.parseInt(list.get(k)));
//						e.setWeight(1);
						list.get(k).setWeight(1);
						edgelist.add(list.get(k));
					}
					if(!isList(listall,String.valueOf(list.get(k).getSource())))
					{
						listcurrent.add(String.valueOf(list.get(k).getSource()));
						listall.add(String.valueOf(list.get(k).getSource()));
					}
					if(!isList(listall,String.valueOf(list.get(k).getTarget())))
					{
						listcurrent.add(String.valueOf(list.get(k).getTarget()));
						listall.add(String.valueOf(list.get(k).getTarget()));
					}
				}
			}
			nodelist.add(listcurrent);
//			for(int j=0;j<listcurrent.size();j++)
//				listall.add(listcurrent.get(j));
		}
		map.put("nodes",nodelist);
		map.put("edges", edgelist);
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(map);
		return map;
	}
	@RequestMapping(value ="/getInteract",method = RequestMethod.POST)
	@ResponseBody
	public Map getInteract(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map map=new HashMap();
		List<List<String>> nodelist=new ArrayList<List<String>>();
		List<Edge> edgelist=new ArrayList<Edge>();
		String id = req.getParameter("id").trim();
		String cengshu = req.getParameter("cengshu").trim();
		//记录所有的节点
		List<String> listall=new ArrayList<String>();
		listall.add(id);
		//添加第一层
		List<String> listcurrent=new ArrayList<String>();
		listcurrent.add(id);
		nodelist.add(listcurrent);
		//当前层节点，需要不断的更新
//		List<String> listCurrent=new ArrayList();
//		for(int i=0;i<list.size();i++)
//			listCurrent.add(list.get(i));
		//开始按层查找
		for(int i=1;i<=Integer.parseInt(cengshu);i++){
			listcurrent=new ArrayList<String>();
			for(int j=0;j<nodelist.get(i-1).size();j++)
			{
				String s=(String) nodelist.get(i-1).get(j);
				List<Edge> list=personService.getInteract(s);
				//对list去重
				for(int k=0;k<list.size();k++)
				{
					//插入边
					int flag=0;
					for(int m=0;m<edgelist.size();m++)
					{
						if(edgelist.get(m).getSource().equals(list.get(k).getSource())&&edgelist.get(m).getTarget().equals(list.get(k).getTarget())||edgelist.get(m).getSource().equals(list.get(k).getTarget())&&edgelist.get(m).getTarget().equals(list.get(k).getSource()))
						{
							flag=1;
							break;
						}
					}
					if(flag==0)
					{
//						Edge e=new Edge();
//						e.setSource(Integer.parseInt(s));
//						e.setTarget(Integer.parseInt(list.get(k)));
//						e.setWeight(1);
						list.get(k).setWeight(1);
						edgelist.add(list.get(k));
					}
					if(!isList(listall,String.valueOf(list.get(k).getSource())))
					{
						listcurrent.add(String.valueOf(list.get(k).getSource()));
						listall.add(String.valueOf(list.get(k).getSource()));
					}
					if(!isList(listall,String.valueOf(list.get(k).getTarget())))
					{
						listcurrent.add(String.valueOf(list.get(k).getTarget()));
						listall.add(String.valueOf(list.get(k).getTarget()));
					}
				}
			}
			nodelist.add(listcurrent);
//			for(int j=0;j<listcurrent.size();j++)
//				listall.add(listcurrent.get(j));
		}
		map.put("nodes",nodelist);
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
	
	@RequestMapping(value ="/getAllInformation",method = RequestMethod.POST)
	@ResponseBody
	public Map getAllInformation(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map map=new HashMap();
		List<person> list=new ArrayList<person>();
		list=personService.getInformation();
		map.put("result", list);
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(map);
		return map;
	}
}
