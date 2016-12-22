package com.buaa.lucker.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.buaa.lucker.pojo.Edge;
import com.buaa.lucker.pojo.MapEntry;
import com.buaa.lucker.pojo.NodeInteract;
import com.buaa.lucker.pojo.RealComm;

@Repository
public interface CommunityDao {
	List<Edge> getGraph();//查询图
	List<Integer> getNode();//查询节点
	//相似性计算
	List<Integer> getInterNum(Integer node1,Integer node2);//交互次数
	List<String> getSubject(Integer node);
	List<Integer> getMessageid(Integer node);
	List<Integer> getCloser(Integer node1,Integer node2);
	//真实社区
	List<RealComm> getNodeCat1();
	List<RealComm> getNodeCat2();
	//查找某个节点的邻居及交互次数
	List<NodeInteract> getNeighbor(Integer node);
}
