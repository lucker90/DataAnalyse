package com.buaa.lucker.dao;

import java.util.List;

import com.buaa.lucker.pojo.Edge;

public interface PersonDao {
	List<Edge> getInteractDao(String id);
}
