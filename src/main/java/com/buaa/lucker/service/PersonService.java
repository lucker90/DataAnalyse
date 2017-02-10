package com.buaa.lucker.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.dao.MessageDao;
import com.buaa.lucker.dao.PersonDao;

@Service("PersonService") 
public class PersonService {
	@Resource  
    private PersonDao personDao;
	
	public List<String> getInteract(String id)
	{
		List<String> result=new ArrayList<String>();
		result=personDao.getInteractDao(id);
		return result;
	}
	
}
