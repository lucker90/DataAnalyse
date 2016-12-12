package com.buaa.lucker.dao;

import java.util.List;

import com.buaa.lucker.pojo.Message;

public interface MessageDao {
	List<Message> getMessages(String keyword);
}
