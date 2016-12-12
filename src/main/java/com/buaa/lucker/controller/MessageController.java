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
		//System.out.println(req);
		String keyword=req.getParameter("keyword").trim();
		//System.out.println(keyword);
		messages=messageService.getMessages(keyword);
		List<String> nodes=new ArrayList<String>();
		List<Map> links=new ArrayList<Map>();
		for(int i=0;i<messages.size();i++)
		{
			
			String source=String.valueOf(messages.get(i).getSenderid());
			String target=String.valueOf(messages.get(i).getRecipientid());
			System.out.println(source+","+target);
			//添加节点
			if(!isList(nodes,source))
				nodes.add(String.valueOf(source));
			if(!isList(nodes,target))
				nodes.add(String.valueOf(target));
			if(i==0)
			{
				Map maplink1=new HashMap<>();
				maplink1.put("source", source);
				maplink1.put("target", target);
				maplink1.put("weight", String.valueOf(1));
				links.add(maplink1);
				Map maplink2=new HashMap<>();
				maplink2.put("target", source);
				maplink2.put("source", target);
				maplink2.put("weight", String.valueOf(1));
				links.add(maplink2);
			}
			List<Map> listt=new ArrayList<Map>();
			//添加边
			for(int j=0;j<links.size();j++)
			{
				if(links.get(j).get("source").equals(source)&&links.get(j).get("target").equals(target))
				{
					int w=Integer.parseInt((String)links.get(j).get("weight"))+1;
					links.get(j).put("weight", String.valueOf(w));
				}
				else if(links.get(j).get("source").equals(target)&&links.get(j).get("target").equals(source))
				{
					int w=Integer.parseInt((String)links.get(j).get("weight"))+1;
					links.get(j).put("weight", String.valueOf(w));
				}
				else
				{
					Map maplink1=new HashMap<>();
					maplink1.put("source", source);
					maplink1.put("target", target);
					maplink1.put("weight", String.valueOf(1));
					listt.add(maplink1);
					Map maplink2=new HashMap<>();
					maplink2.put("target", source);
					maplink2.put("source", target);
					maplink2.put("weight", String.valueOf(1));
					listt.add(maplink2);
				}
			}
			for(int j=0;j<listt.size();j++)
				links.add(listt.get(j));
		}
		resultMap.put("nodes", nodes);
		resultMap.put("links", links);
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
}
