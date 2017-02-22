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

import com.buaa.lucker.pojo.Message;
import com.buaa.lucker.service.MessageService;

@Controller
@RequestMapping("/Message")
public class MessageController {
	@Autowired
    @Qualifier("MessageService")
    private MessageService messageService;
	
	@RequestMapping(value ="/GetMessageByKeyWord",method = RequestMethod.POST)
	@ResponseBody
	public Map getMessageByKeyWord(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map resultMap=new HashMap();		
		List<Message> messages = new ArrayList<Message>();
		//Map messageMap=new HashMap();
		//System.out.println(req);
		String keyword=req.getParameter("keyword").trim();
		//System.out.println(keyword);
		messages=messageService.getMessages(keyword);
		resultMap.put("starttime", messages.get(0).getTime());
		resultMap.put("endtime", messages.get(messages.size()-1).getTime());
		List<String> timelist=new ArrayList<String>();
		for(int i=0;i<messages.size();i++)
		{
			timelist.add(messages.get(i).getTime());
			System.out.println(messages.get(i).getTime());
		}
		resultMap.put("timelist", timelist);
		List<Map> nodes=new ArrayList<Map>();//节点集合
		List<Map> links=new ArrayList<Map>();//边集合
		/*if(messages.size()>0)
		{
			String source=String.valueOf(messages.get(0).getSenderid());
			String target=String.valueOf(messages.get(0).getRecipientid());
			//添加节点
			if(!isListMap(nodes,source))
			{
				Map t=new HashMap<>();
				t.put("name", source);
				t.put("value", 1);
				t.put("size", 1);
				nodes.add(t);
			}
			if(!isListMap(nodes,target))
			{
				Map t=new HashMap<>();
				t.put("name", target);
				t.put("value", 1);
				t.put("size", 1);
				nodes.add(t);
			}
			//添加边
			Map maplink1=new HashMap<>();
			maplink1.put("source", source);
			maplink1.put("target", target);
			maplink1.put("weight", 1.0);
			links.add(maplink1);
//			Map maplink2=new HashMap<>();
//			maplink2.put("target", source);
//			maplink2.put("source", target);
//			maplink2.put("weight", String.valueOf(1));
//			links.add(maplink2);
		}*/
		
		for(int i=0;i<messages.size();i++)
		{	
			String source=String.valueOf(messages.get(i).getSenderid());
			String target=String.valueOf(messages.get(i).getRecipientid());
			//System.out.println(source+","+target);
			//List<Map> listt=new ArrayList<Map>();
			//添加边
			int flag=0;
			for(int j=0;j<links.size();j++)
			{
				if(links.get(j).get("source").equals(source)&&links.get(j).get("target").equals(target))
				{
					double w=(double)links.get(j).get("weight")+1;
					links.get(j).put("weight", w);
					flag=1;
				}
				if(links.get(j).get("source").equals(target)&&links.get(j).get("target").equals(source))
				{
					double w=(double)links.get(j).get("weight")+1;
					links.get(j).put("weight", w);
					flag=1;
				}
			}
			if(flag==0)
			{
				Map maplink1=new HashMap<>();
				maplink1.put("source", source);
				maplink1.put("target", target);
				maplink1.put("weight", 1.0);
				links.add(maplink1);
			}
//			for(int j=0;j<listt.size();j++)
//				links.add(listt.get(j));
		}
		//添加节点，包括节点大小
		for(int i=0;i<links.size();i++)
		{
			String source=(String) links.get(i).get("source");
			String target=(String) links.get(i).get("target");
			//System.out.println(source+","+target+","+links.get(i).get("weight"));
			//double weight=(double) links.get(i).get("weight");
			double weight=1.0;
			int flag1=0;
			int flag2=0;
			for(int j=0;j<nodes.size();j++)
			{
				if(nodes.get(j).get("name").equals(source))
				{
					double value=(double)nodes.get(j).get("value");
					double size=(double)nodes.get(j).get("size");
					nodes.get(j).put("value", value+weight);
					nodes.get(j).put("size", size+weight);
					flag1=1;
				}
				if(nodes.get(j).get("name").equals(target))
				{
					double value=(double)nodes.get(j).get("value");
					double size=(double)nodes.get(j).get("size");
					nodes.get(j).put("value", value+weight);
					nodes.get(j).put("size", size+weight);
					flag2=1;
				}
			}
			if(flag1==0)
			{
				Map t=new HashMap<>();
				t.put("name", source);
				t.put("value", 1.0);
				t.put("size", 1.0);
				t.put("category", 0);
				nodes.add(t);
			}
			if(flag2==0)
			{
				Map t=new HashMap<>();
				t.put("name", target);
				t.put("value", 1.0);
				t.put("size", 1.0);
				t.put("category", 0);
				nodes.add(t);
			}
		}
//		for(int j=0;j<nodes.size();j++)
//		{
//			System.out.println(nodes.get(j).get("name")+":"+nodes.get(j).get("value")+":"+nodes.get(j).get("size"));
//		}
		resultMap.put("nodes", nodes);
		resultMap.put("links", links);
		
		resultMap.put("messages", messages);
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		return resultMap;
	}
	
	
	//判断是否为list中的节点
	public boolean isList(List<String> list,String node)
	{
		boolean flag=false;
		for(int i=0;i<list.size();i++)
		{
			if(list.get(i).equals(node))
				flag=true;
		}
		return flag;
	}
	//判断是否为listmap中的节点
	public boolean isListMap(List<Map> list,String node)
	{
		boolean flag=false;
		for(int i=0;i<list.size();i++)
		{
			if(list.get(i).get("name").equals(node))
				flag=true;
		}
		return flag;
	}
}
