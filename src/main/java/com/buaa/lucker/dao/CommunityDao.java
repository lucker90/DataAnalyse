package com.buaa.lucker.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.buaa.lucker.pojo.Edge;
import com.buaa.lucker.pojo.MapEntry;

@Repository
public interface CommunityDao {
	List<Edge> getGraph();//查询图
	List<Integer> getNode();//查询节点
	List<Integer> getInterNum(Integer node1,Integer node2);//交互次数
	List<String> getSubject(Integer node);
	List<Integer> getMessageid(Integer node);
	List<Integer> getCloser(Integer node1,Integer node2);
	List<String> getNodeCat(String cat);
}
