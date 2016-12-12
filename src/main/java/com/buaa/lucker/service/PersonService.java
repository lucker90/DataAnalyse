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
	public List<String> getInteractNet(String id,String cengshu)
	{
		List<String> result=new ArrayList<String>();
		//result=personDao.getInteract(id,cengshu);
		return result;
	}
}
