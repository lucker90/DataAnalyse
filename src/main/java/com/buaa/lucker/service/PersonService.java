package com.buaa.lucker.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.dao.MessageDao;
import com.buaa.lucker.dao.PersonDao;
import com.buaa.lucker.pojo.Edge;

@Service("PersonService") 
public class PersonService {
	@Resource  
    private PersonDao personDao;
	
	public List<Edge> getInteract(String id)
	{
		List<Edge> result=new ArrayList<Edge>();
		result=personDao.getInteractDao(id);
		return result;
	}
	
}
