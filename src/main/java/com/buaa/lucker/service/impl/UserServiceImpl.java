package com.buaa.lucker.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.dao.IUserDao;
import com.buaa.lucker.pojo.User;
import com.buaa.lucker.service.IUserService;

@Service("userService")  
public class UserServiceImpl implements IUserService {  
    @Resource  
    private IUserDao userDao;  
    @Override  
    public User getUserById(String userName) {  
        // TODO Auto-generated method stub  
        return this.userDao.selectByPrimaryKey(userName);  
    }  
  
}  
