package com.buaa.lucker.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.dao.MessageDao;
import com.buaa.lucker.dao.PersonDao;
import com.buaa.lucker.pojo.Edge;
import com.buaa.lucker.pojo.person;

@Service("PersonService") 
public class PersonService {
	@Resource  
    private PersonDao personDao;
	//获取交互用户
	public List<Edge> getInteract(String id)
	{
		List<Edge> result=new ArrayList<Edge>();
		result=personDao.getInteractDao(Integer.valueOf(id));
		return result;
	}
	//获取好友
	public List<Edge> getFriends(String id){
		List<Edge> result=new ArrayList<Edge>();
		result=personDao.getFriendsDao(Integer.valueOf(id));
		return result;
	}
	public List<person> getInformation(){
		List<person> result=new ArrayList<person>();
		result=personDao.getInformation();
		return result;
	}
	
}
