package com.buaa.lucker.dao;

import java.util.List;

import com.buaa.lucker.pojo.Edge;
import com.buaa.lucker.pojo.person;

public interface PersonDao {
	List<Edge> getInteractDao(Integer id);
	List<Edge> getFriendsDao(Integer id);
	List<person> getInformation();
}
