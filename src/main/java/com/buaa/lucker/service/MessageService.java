package com.buaa.lucker.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.dao.MessageDao;
import com.buaa.lucker.pojo.Message;

@Service("MessageService") 
public class MessageService {
	@Resource  
    private MessageDao messageDao;
	
	public List<Message> getMessages(String keyword){
		List<Message> result=messageDao.getMessages(keyword);
		return result;
	}
}
