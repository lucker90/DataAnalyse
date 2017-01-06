package com.buaa.lucker.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Stack;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


import com.buaa.lucker.Variable;
import com.buaa.lucker.pojo.MapEntry;
import com.buaa.lucker.pojo.PageRankNode;
import com.buaa.lucker.service.CommunityService;


import com.buaa.lucker.measure;


@Controller
@RequestMapping("/Community")
public class CommunityController {
	//初始化路径
	private static String JarPath = CommunityController.class.getProtectionDomain().getCodeSource().getLocation().getPath();	
	private static String CurrentPath = JarPath.substring(0,JarPath.lastIndexOf("/"));
	private static String SrcPath = CurrentPath + "/../../../../../";
	@Autowired
    @Qualifier("CommunityService")
    private CommunityService commService;
	
	@RequestMapping(value ="/getConnection",method = RequestMethod.POST)
	@ResponseBody
	public Map getConnection(HttpServletRequest req, HttpServletResponse resp){
		//种子集
		String seeds=req.getParameter("seedset").trim();
		String[] seedset=seeds.split(",");
		List<String> seedsetlist=new ArrayList<String>();
		for(int i=0;i<seedset.length;i++)
			seedsetlist.add(seedset[i]);
		
		List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
		List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
		List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构
		
		getConnectionOnly(seedsetlist,listSeedsets,listConnections,listSubMap);
		
		Map resultMap=new HashMap();
		resultMap.put("seedsets", listSeedsets);
		resultMap.put("Connections", listConnections);
		//设置全局变量
		Variable.setSeedsets(listSeedsets); //当前连通的种子集
        Variable.setConnections(listConnections);//连通种子集对应的连通图
        Variable.setSubGraphMaps(listSubMap);
       
		return resultMap;
	}
	
	//未处理种子集进行社区发现，返回值为f1指标	
	@RequestMapping(value ="/getCommunityBefore",method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunityBefore(HttpServletRequest req, HttpServletResponse resp) throws ClassNotFoundException, SQLException, IOException, ParseException{
		Map resultMap=new HashMap();
		//获取种子集存入list
		String connSeed =req.getParameter("seedset").trim();
		List<String> SubSeed=new ArrayList<String>();
		String[] strs=connSeed.split(",");
		for(int i=0;i<strs.length;i++)
			SubSeed.add(strs[i]);
		//重新寻找种子集所在的连通图，得到连通图结构和图节点
		List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
		List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
		List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构
		
		getConnectionOnly(SubSeed,listSeedsets,listConnections,listSubMap);
		//设置全局变量
		Variable.setSeedsets(listSeedsets); // 当前连通的种子集
		Variable.setConnections(listConnections);// 连通种子集对应的连通图
		Variable.setSubGraphMaps(listSubMap);
		/////进行社区发现
		Map[] maps=new Map[listSeedsets.size()];
		for(int i=0;i<listSeedsets.size();i++)
		{
			String[] s=new String[listSeedsets.get(i).size()];
			for(int j=0;j<listSeedsets.get(i).size();j++)
				s[j]=listSeedsets.get(i).get(j);
			Map map=new HashMap();
			getCommunityOnly(map,listSubMap.get(i),listConnections.get(i),listSeedsets.get(i),s,"improved");
			map.put("seedset", listSeedsets.get(i));
			maps[i]=map;
		}
		resultMap.put("result", maps);
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		return resultMap;
	}
	
	//处理种子集进行社区发现
	@RequestMapping(value ="/getCommunityAfter",method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunityAfter(HttpServletRequest req, HttpServletResponse resp) throws ClassNotFoundException, SQLException, IOException, ParseException{
		Map resultMap=new HashMap();
		//获取种子集存入list
		String connSeed =req.getParameter("seedset").trim();
		List<String> SubSeed=new ArrayList<String>();
		String[] strs=connSeed.split(",");
		for(int i=0;i<strs.length;i++)
			SubSeed.add(strs[i]);
		//重新寻找种子集所在的连通图，得到连通图结构和图节点
		List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
		List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
		List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构
		
		getConnectionOnly(SubSeed,listSeedsets,listConnections,listSubMap);
		//设置全局变量
		Variable.setSeedsets(listSeedsets); // 当前连通的种子集
		Variable.setConnections(listConnections);// 连通种子集对应的连通图
		Variable.setSubGraphMaps(listSubMap);
		/////进行社区发现
		Map[] maps=new Map[listSeedsets.size()];
		for(int i=0;i<listSeedsets.size();i++)
		{
			String[] s=new String[listSeedsets.get(i).size()];
			for(int j=0;j<listSeedsets.get(i).size();j++)
				s[j]=listSeedsets.get(i).get(j);
			//对种子集做一下处理
			List<String> seedset=new ArrayList<String>();
			seedset=dealSeedSet(listSeedsets.get(i));
			Map map=new HashMap();
			getCommunityOnly(map,listSubMap.get(i),listConnections.get(i),seedset,s,"improved");
			map.put("seedset", listSeedsets.get(i));
			maps[i]=map;
		}
		resultMap.put("result", maps);
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		return resultMap;
	}
	
	//获取社区，社区发现可视化那个模块	
	@RequestMapping(value ="/getCommunityyouhua",method = RequestMethod.POST)
	@ResponseBody
	//目前没用
	public Map getCommunityyouhua(HttpServletRequest req, HttpServletResponse resp) throws ClassNotFoundException, SQLException, IOException{
		Map resultMap=new HashMap();
		//当前研究的种子集，并转化为list
		String connSeed =req.getParameter("conntction").trim();
		List<String> SubSeed=new ArrayList<String>();
		String[] strs=connSeed.split(",");
		for(int i=0;i<strs.length;i++)
			SubSeed.add(strs[i]);
		//System.out.println("种子集目前尺寸："+SubSeed.size());
		//分别找到对应的连通图的节点和图结构
		List<List<String>> seedsets=new ArrayList<List<String>>();
		List<List<String>> connections=new ArrayList<List<String>>();
		List<Map<String, ArrayList<MapEntry>>> listSubMap=new ArrayList<Map<String, ArrayList<MapEntry>>>();
		seedsets=Variable.getSeedsets();
		connections=Variable.getConnections();
		listSubMap=Variable.getSubGraphMaps();
		int index=findConnforSeed(connSeed,seedsets);
		List<String> SubNodes=new ArrayList<String>();
		//System.out.println(index);
		SubNodes=connections.get(index);//所研究种子集对应的连通图节点
		Map<String, ArrayList<MapEntry>> SubGraph=new HashMap<String, ArrayList<MapEntry>>();
		SubGraph=listSubMap.get(index);//所研究种子集对应的连通图结构
		
		
		//处理种子集，选择和种子集联系紧密的top1/2和种子集点组成种子集再去扩展////////////如果种子集处理不需要则此处可以省略掉
		HashMap<String, Double> seeds = new HashMap<String, Double>();
		List<PageRankNode> seedsNode=new ArrayList<PageRankNode>();
		for(int i=0;i<SubSeed.size();i++)
		{
			//seeds.put(SubSeed.get(i),Double.MAX_VALUE);
			HashMap<String, Double> seedst=new HashMap<String,Double>();
			seedst=commService.getNeighbors(SubSeed.get(i));//查找邻居，返回值为节点ID和交互次数
			for(String key:seedst.keySet())
			{
				if(!seeds.containsKey(seedst.get(key)))
					seeds.put(key, seedst.get(key));
			}
		}
		PageRankVector(seeds,seedsNode);//排序
		//System.out.println(seedsNode);
		for(int i=0;i<seedsNode.size()/2&&i<2;i++)//////添加邻居1/2的节点
		{
			if(!SubSeed.contains(seedsNode.get(i).getIdentifier()))
				SubSeed.add(seedsNode.get(i).getIdentifier());
		}
		System.out.println("处理后的种子节点为："+SubSeed);	
			
		//应用改进的pagerank算法得到各个节点的pagerank值
		List<PageRankNode> subrankedList = new ArrayList<PageRankNode>();
		List<PageRankNode> similarityList=new ArrayList<PageRankNode>();//各个节点和种子集的相似性
		similarityList=rank3(Variable.iterations, Variable.DumpingFactor,SubGraph,SubNodes,SubSeed,subrankedList);
		//System.out.println("种子集目前尺寸："+SubSeed.size());
		Collections.sort(similarityList);//对节点相似性进行排序
		resultMap.put("similarity", similarityList);//添加节点和种子集的相似性
		//开始计算导率
		List<String> conList=new ArrayList<String>();
		List<List<String>> community=new ArrayList<List<String>>();
		double[] edges=new double[2];
		//int count=0;
		//System.out.println(subrankedList.size());
		for(int i=0;i<subrankedList.size();i++)
		{
			//判断节点是否为种子节点
			int flag=0;
			for(int j=0;j<strs.length;j++)
			{
				if(strs[j].equals(subrankedList.get(i).getIdentifier()))
				{
					flag=1;
					break;
				}		
			}
			if(flag==0)
			{
				SubSeed.add(subrankedList.get(i).getIdentifier());//将节点加入到了种子节点中
				edges=getEdges(SubSeed,SubGraph);
				double conductance;
				conductance=edges[0]/edges[1];
				
				if(isConnected(SubSeed,Variable.getAllnode()))
				{
					System.out.println("导率为："+String.valueOf(conductance));
					conList.add(String.valueOf(conductance));
					List<String> comm=new ArrayList<String>();
					for(int j=0;j<SubSeed.size();j++)
						comm.add(SubSeed.get(j));
					community.add(comm);
				}
				System.out.println("种子集目前尺寸："+SubSeed.size());
			}
		}
		//System.out.println("种子集目前尺寸："+SubSeed.size());
		////// 寻找最优社区
		double minCons = 1.0;
		List<String> bestComm = new ArrayList<String>();
		int count = 0;
		int size = 100;
		for(int i=0;i<conList.size();i++) {
			// 选取导率最小的社区//////////////////
			if (Double.parseDouble(conList.get(i)) <=minCons) {
				minCons = Double.parseDouble(conList.get(i));
				bestComm = community.get(i);
			}
			// 选取固定大小的社区//////////////////有问题
			/*
			 * if(linecomm.split(",").length==100) { bestComm=linecomm; break; }
			 */
		}
		String comm="";
		int i=0;
		if(bestComm.size()>0)
		{
			for(i=0;i<bestComm.size()-1;i++)
				comm=comm+bestComm.get(i)+",";
			comm=comm+bestComm.get(i);
		}
		resultMap.put("conductance", minCons);//////////添加导率
		System.out.println("最小的导率为：" + minCons);
		System.out.println("最优的社区为：" + comm);
		//返回社区结果
		resultMap.put("type", "force");////////添加图的类型:力的导向图
		List<Map> commnode=new ArrayList<Map>();
		List<PageRankNode> Nodedegree=new ArrayList<PageRankNode>();
		for(i=0;i<bestComm.size();i++)
		{
			Map mapt=new HashMap<>();
			mapt.put("name", bestComm.get(i));
			
			double weight=0;
			for(MapEntry entry:SubGraph.get(bestComm.get(i)))
			{
				weight=weight+entry.getWeight();
			}
			mapt.put("value", weight);
			mapt.put("size", weight);
			mapt.put("category", 0);
			commnode.add(mapt);
			PageRankNode p=new PageRankNode(bestComm.get(i),weight);
			Nodedegree.add(p);
			
		}
		Collections.sort(Nodedegree);
		resultMap.put("top", Nodedegree);////////添加节点按顺序
		resultMap.put("nodes", commnode);/////////添加节点
		List<Map> commlink=new ArrayList<Map>();
		for(i=0;i<bestComm.size();i++)
		{
			for(int j=i+1;j<bestComm.size();j++)
			{
				for(String key:SubGraph.keySet())
				{
					if(bestComm.get(i).equals(key))
					{
						int flag=0;
						for(MapEntry entry:SubGraph.get(key))
						{
							if(entry.getIdentifier().equals(bestComm.get(j)))
							{
								Map mapt=new HashMap<>();
								mapt.put("source", key);
								mapt.put("target", entry.getIdentifier());
								mapt.put("weight", entry.getWeight());
								commlink.add(mapt);
								flag=1;
							}
						}
						if(flag==1)
							break;
					}
					else if(bestComm.get(j).equals(key))
					{
						int flag=0;
						for(MapEntry entry:SubGraph.get(key))
						{
							if(entry.getIdentifier().equals(bestComm.get(i)))
							{
								Map mapt=new HashMap<>();
								mapt.put("source", key);
								mapt.put("target", entry.getIdentifier());
								mapt.put("weight", entry.getWeight());
								commlink.add(mapt);
								flag=1;
							}
						}
						if(flag==1)
							break;
					}
					else
						continue;
				}
			}
		}
		resultMap.put("links", commlink);////////////添加边
		resultMap.put("size", bestComm.size());///////添加社区尺寸
		//计算评价指标
		getRealCommunity();//获取真实社区
		measure m=new measure();
		HashMap<String,Double> precisionRatio=m.getPrecision(bestComm);//查准率，返回值为13个
		HashMap<String,Double> recallRatio=m.getRecall(bestComm);//查全率，返回值为13个
		HashMap<String,Double> NMIS=m.getNMIS(bestComm);//NMI指标
		double p=0.0;//查准率
		double r=0.0;//查全率
		double f1=0.0;//f1指标
		double NMI=0.0;//NMI指标
		String cat=null;
		//根据f1指标确定查准率和查全率的值
		for(String key:precisionRatio.keySet())
		{
			double t=m.getF1(precisionRatio.get(key),recallRatio.get(key));
			System.out.println(key+":"+precisionRatio.get(key)+","+recallRatio.get(key)+","+t);
			if(t>f1)
			//if(t>f1&&!key.equals("base"))
			{
				f1=t;
				p=precisionRatio.get(key);
				r=recallRatio.get(key);
				cat=key;
			}
		}
		/*for(String key:NMIS.keySet())
			System.out.println(key+":"+NMIS.get(key));*/
		NMI=NMIS.get(cat);
		System.out.println("社区的查准率为："+p);
		System.out.println("社区的查全率为："+r);
		System.out.println("社区的f1指标为："+f1);
		System.out.println("社区的NMI指标为："+NMI);	
		System.out.println("种子集对应的连通图"+SubNodes.size());
		
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		
		return resultMap;
	}
	@RequestMapping(value ="/getCommunity",method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunity(HttpServletRequest req, HttpServletResponse resp) throws ClassNotFoundException, SQLException, IOException, ParseException{
		Map resultMap=new HashMap();
		//当前研究的种子集，并转化为list
		String connSeed =req.getParameter("conntction").trim();
		List<String> SubSeed=new ArrayList<String>();
		String[] strs=connSeed.split(",");
		for(int i=0;i<strs.length;i++)
			SubSeed.add(strs[i]);
		//System.out.println("种子集目前尺寸："+SubSeed.size());
		//分别找到对应的连通图的节点和图结构
		List<List<String>> seedsets=new ArrayList<List<String>>();
		List<List<String>> connections=new ArrayList<List<String>>();
		List<Map<String, ArrayList<MapEntry>>> listSubMap=new ArrayList<Map<String, ArrayList<MapEntry>>>();
		seedsets=Variable.getSeedsets();
		connections=Variable.getConnections();
		listSubMap=Variable.getSubGraphMaps();
		int index=findConnforSeed(connSeed,seedsets);
		List<String> SubNodes=new ArrayList<String>();
		//System.out.println(index);
		SubNodes=connections.get(index);//所研究种子集对应的连通图节点
		Map<String, ArrayList<MapEntry>> SubGraph=new HashMap<String, ArrayList<MapEntry>>();
		SubGraph=listSubMap.get(index);//所研究种子集对应的连通图结构
		
		
		//处理种子集，选择和种子集联系紧密的top1/2和种子集点组成种子集再去扩展////////////如果种子集处理不需要则此处可以省略掉
		/*HashMap<String, Double> seeds = new HashMap<String, Double>();
		List<PageRankNode> seedsNode=new ArrayList<PageRankNode>();
		for(int i=0;i<SubSeed.size();i++)
		{
			//seeds.put(SubSeed.get(i),Double.MAX_VALUE);
			HashMap<String, Double> seedst=new HashMap<String,Double>();
			seedst=commService.getNeighbors(SubSeed.get(i));//查找邻居，返回值为节点ID和交互次数
			for(String key:seedst.keySet())
			{
				if(!seeds.containsKey(seedst.get(key)))
					seeds.put(key, seedst.get(key));
			}
		}
		PageRankVector(seeds,seedsNode);//排序
		//System.out.println(seedsNode);
		for(int i=0;i<seedsNode.size()/2&&i<5;i++)//////添加邻居1/2的节点
		{
			if(!SubSeed.contains(seedsNode.get(i).getIdentifier()))
				SubSeed.add(seedsNode.get(i).getIdentifier());
		}
		System.out.println("处理后的种子节点为："+SubSeed);*/
		//处理种子集
		List<String> listSeed=new ArrayList<String>();
		listSeed=dealSeedSet(SubSeed);
		
		resultMap.put("seedset", listSeed);
		//进行社区发现
		getCommunityOnly(resultMap,SubGraph,SubNodes,listSeed,strs,"improved");
		
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		
		return resultMap;
	}
	
	//返回不同跳数下的社区识别结果
	@RequestMapping(value ="/getCommunityTiaoshu",method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunityTiaoshu(HttpServletRequest req, HttpServletResponse resp) throws ClassNotFoundException, SQLException, IOException, ParseException{
		Map resultMap=new HashMap();
		String tiaoshu_start=req.getParameter("tiaoshu_start").trim();
		String tiaoshu_end=req.getParameter("tiaoshu_end").trim();
		String seedset=req.getParameter("seedset").trim();
		//将初始的种子节点转换为list
		List<String> SubSeed=new ArrayList<String>();
		String[] strs=seedset.split(",");
		for(int i=0;i<strs.length;i++)
			SubSeed.add(strs[i]);	
		//开始对不同跳数每个连通的种子集进行社区识别
		for(int tiaoshu=Integer.parseInt(tiaoshu_start);tiaoshu<=Integer.parseInt(tiaoshu_end);tiaoshu++)
		{
			//重新寻找种子集所在的连通图，得到连通图结构和图节点
			List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
			List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
			List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构
			getConnectionOnly(SubSeed, listSeedsets, listConnections, listSubMap,tiaoshu);
			// 设置全局变量
			Variable.setSeedsets(listSeedsets); // 当前连通的种子集
			Variable.setConnections(listConnections);// 连通种子集对应的连通图
			Variable.setSubGraphMaps(listSubMap);
			//开始社区识别
			Map[] maps=new Map[listSeedsets.size()];
			for(int i=0;i<listSeedsets.size();i++)
			{
				String[] s=new String[listSeedsets.get(i).size()];
				for(int j=0;j<listSeedsets.get(i).size();j++)
					s[j]=listSeedsets.get(i).get(j);
				//对种子集做一下处理
				List<String> seedset_deal=new ArrayList<String>();
				seedset_deal=dealSeedSet(listSeedsets.get(i));
				Map map=new HashMap();
				getCommunityOnly(map,listSubMap.get(i),listConnections.get(i),seedset_deal,s,"improved");
				map.put("seedset_deal", listSeedsets.get(i));
				maps[i]=map;
			}
			resultMap.put(tiaoshu, maps);
		}
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		return resultMap;
	}	
	
	//按照种子集的数目和大小范围随机生成种子集
	@RequestMapping(value ="/getRandomSeedsets",method = RequestMethod.POST)
	@ResponseBody
	public Map getRandomSeedsets(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException{
		Map resultMap=new HashMap();
		int count=Integer.parseInt(req.getParameter("seedset_count").trim());
		int small=Integer.parseInt(req.getParameter("seedset_small").trim());
		int big=Integer.parseInt(req.getParameter("seedset_big").trim());
		// 获取所有节点
		List<String> allnode = new ArrayList<String>();
		allnode = this.commService.getAllNode();
		int n=allnode.size();
		List<String> allseeds=new ArrayList<String>();
		List<List<String>> resultlist=new ArrayList<List<String>>();
		for(int i=0;i<count;i++)
		{
			//随机确定种子集的大小(small-big范围内的数)
			Random rand = new Random();
			int random=rand.nextInt(big-small+1)+small;
	        boolean[]  bool = new boolean[n];
	        int randInt = 0;
			List<String> randomlist=new ArrayList<String>();
			//生成random个不重复的随机数
			for(int j=0;j<random;j++)
			{
				do {
	                   randInt  = rand.nextInt(n);
	               }while(bool[randInt]);
	            bool[randInt] = true;
	            randomlist.add(allnode.get(randInt));
			}
			resultlist.add(randomlist);
		}
		resultMap.put("random", resultlist);
		//转为json格式
		ObjectMapper mapper=new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		return resultMap;
	}
	
	//传统算法识别社区
	@RequestMapping(value ="/getCommunityTraditional",method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunityTraditional(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException, JsonMappingException, IOException, ClassNotFoundException, SQLException, ParseException{
		Map resultMap=new HashMap();
		String connSeed=req.getParameter("seedset").trim();
		connSeed=connSeed.substring(1, connSeed.length()-1);
		String[] strs=connSeed.split(",");
		
		//获取种子集存入list
		//String connSeed = req.getParameter("seedset").trim();
		List<String> SubSeed = new ArrayList<String>();
		//String[] strs = connSeed.split(",");
		for (int i = 0; i < strs.length; i++)
			SubSeed.add(strs[i]);
		// 重新寻找种子集所在的连通图，得到连通图结构和图节点
		List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
		List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
		List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构

		getConnectionOnly(SubSeed, listSeedsets, listConnections, listSubMap);
		// 设置全局变量
		Variable.setSeedsets(listSeedsets); // 当前连通的种子集
		Variable.setConnections(listConnections);// 连通种子集对应的连通图
		Variable.setSubGraphMaps(listSubMap);
		///// 进行社区发现
		Map[] maps = new Map[listSeedsets.size()];
		for (int i = 0; i < listSeedsets.size(); i++) {
			String[] s = new String[listSeedsets.get(i).size()];
			for (int j = 0; j < listSeedsets.get(i).size(); j++)
				s[j] = listSeedsets.get(i).get(j);
			// 对种子集做一下处理
			List<String> seedset = new ArrayList<String>();
			seedset = dealSeedSet(listSeedsets.get(i));
			Map map = new HashMap();
			getCommunityOnly(map, listSubMap.get(i), listConnections.get(i), seedset, s,"traditional");
			map.put("seedset", listSeedsets.get(i));
			maps[i] = map;
		}
		resultMap.put("result", maps);
		// 转为json格式
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValueAsString(resultMap);
		
		return resultMap;
	}
	
	//改进算法识别社区
	@RequestMapping(value = "/getCommunityImproved", method = RequestMethod.POST)
	@ResponseBody
	public Map getCommunityImproved(HttpServletRequest req, HttpServletResponse resp) throws JsonGenerationException,JsonMappingException, IOException, ClassNotFoundException, SQLException, ParseException {
		Map resultMap = new HashMap();
		String connSeed = req.getParameter("seedset").trim();
		connSeed = connSeed.substring(1, connSeed.length() - 1);
		String[] strs = connSeed.split(",");

		// 获取种子集存入list
		// String connSeed = req.getParameter("seedset").trim();
		List<String> SubSeed = new ArrayList<String>();
		// String[] strs = connSeed.split(",");
		for (int i = 0; i < strs.length; i++)
			SubSeed.add(strs[i]);
		// 重新寻找种子集所在的连通图，得到连通图结构和图节点
		List<List<String>> listSeedsets = new ArrayList<List<String>>();/// 所有连通种子集
		List<List<String>> listConnections = new ArrayList<List<String>>();// 所有连通节点
		List<Map<String, ArrayList<MapEntry>>> listSubMap = new ArrayList<Map<String, ArrayList<MapEntry>>>();// 连通图结构

		getConnectionOnly(SubSeed, listSeedsets, listConnections, listSubMap);
		// 设置全局变量
		Variable.setSeedsets(listSeedsets); // 当前连通的种子集
		Variable.setConnections(listConnections);// 连通种子集对应的连通图
		Variable.setSubGraphMaps(listSubMap);
		///// 进行社区发现
		Map[] maps = new Map[listSeedsets.size()];
		for (int i = 0; i < listSeedsets.size(); i++) {
			String[] s = new String[listSeedsets.get(i).size()];
			for (int j = 0; j < listSeedsets.get(i).size(); j++)
				s[j] = listSeedsets.get(i).get(j);
			// 对种子集做一下处理
			List<String> seedset = new ArrayList<String>();
			seedset = dealSeedSet(listSeedsets.get(i));
			Map map = new HashMap();
			getCommunityOnly(map, listSubMap.get(i), listConnections.get(i), seedset, s, "improved");
			map.put("seedset", listSeedsets.get(i));
			maps[i] = map;
		}
		resultMap.put("result", maps);
		// 转为json格式
		ObjectMapper mapper = new ObjectMapper();
		mapper.writeValueAsString(resultMap);

		return resultMap;
	}
	
    /*单纯的连通性判断函数 没有跳数
	 * seedsetlist:文本框输入的节点集合
	 * listSeedsets:所有的连通种子集
	 * listConnections：所有连通图的节点
	 * listSubMap：所有连通图结构
	 */
	public void getConnectionOnly(List<String> seedsetlist,List<List<String>> listSeedsets,List<List<String>> listConnections,List<Map<String, ArrayList<MapEntry>>> listSubMap)
	{
		//获取整个图
		Map<String, ArrayList<MapEntry>> WholeGraphmap = new HashMap<String, ArrayList<MapEntry>>();
		WholeGraphmap = this.commService.getWholeGraph();
		// 获取所有节点
		List<String> allnode = new ArrayList<String>();
		allnode = this.commService.getAllNode();
		// 设置全局变量
		Variable.setWholeMap(WholeGraphmap);// 整个图结构
		Variable.setAllnode(allnode);// 所有节点

		// 连通性判断
		findConnectedSeed(listSeedsets,WholeGraphmap, allnode, seedsetlist);
		findConnectedSubgraph(listConnections,WholeGraphmap, allnode, seedsetlist, listSeedsets);
		
		findSubGraphs(listSubMap,listConnections);
		////////////
		for (int i = 0; i < listSeedsets.size(); i++) {
			for (int j = 0; j < listSeedsets.get(i).size(); j++)
				System.out.print(listSeedsets.get(i).get(j) + ",");
			System.out.println();
			for (int j = 0; j < listConnections.get(i).size(); j++)
				System.out.print(listConnections.get(i).get(j) + ",");
			System.out.println();
		}
	}
	
	/*单纯的连通性判断函数，有跳数
	 * seedsetlist:文本框输入的节点集合
	 * listSeedsets:所有的连通种子集
	 * listConnections：所有连通图的节点
	 * listSubMap：所有连通图结构
	 * tiaoshu:跳数
	 */
	public void getConnectionOnly(List<String> seedsetlist,List<List<String>> listSeedsets,List<List<String>> listConnections,List<Map<String, ArrayList<MapEntry>>> listSubMap,int tiaoshu)
	{
		//获取整个图
		Map<String, ArrayList<MapEntry>> WholeGraphmap = new HashMap<String, ArrayList<MapEntry>>();
		WholeGraphmap = this.commService.getWholeGraph();
		// 获取所有节点
		List<String> allnode = new ArrayList<String>();
		allnode = this.commService.getAllNode();
		// 设置全局变量
		Variable.setWholeMap(WholeGraphmap);// 整个图结构
		Variable.setAllnode(allnode);// 所有节点

		// 连通性判断
		findConnectedSeed(listSeedsets,WholeGraphmap, allnode, seedsetlist,tiaoshu);
		findConnectedSubgraph(listConnections,WholeGraphmap, allnode, seedsetlist, listSeedsets,tiaoshu);
		
		findSubGraphs(listSubMap,listConnections);
		////////////
		for (int i = 0; i < listSeedsets.size(); i++) {
			for (int j = 0; j < listSeedsets.get(i).size(); j++)
				System.out.print(listSeedsets.get(i).get(j) + ",");
			System.out.println();
			for (int j = 0; j < listConnections.get(i).size(); j++)
				System.out.print(listConnections.get(i).get(j) + ",");
			System.out.println();
		}
	}
	
	/*对种子集进行处理,进行扩展//////原来的处理方式
	* SubSeed:未处理的种子集
	 * 返回值：处理后的种子集
	*/
	private List<String> dealSeedSet(List<String> SubSeed) {
		List<String> result = new ArrayList<String>();
		HashMap<String, Double> seeds = new HashMap<String, Double>();
		List<PageRankNode> seedsNode = new ArrayList<PageRankNode>();

		for (int i = 0; i < SubSeed.size(); i++) {
			//if (!seeds.containsKey(SubSeed.get(i)))
			  //   seeds.put(SubSeed.get(i), Double.MAX_VALUE);
			// result.add(SubSeed.get(i));
			HashMap<String, Double> seedst = new HashMap<String, Double>();
			seedst = commService.getNeighbors(SubSeed.get(i));// 查找邻居，返回值为节点ID和交互次数
			for (String key : seedst.keySet()) {
				if (!seeds.containsKey(key))
					seeds.put(key, seedst.get(key));
			}
		}
		PageRankVector(seeds, seedsNode);// 排序
		// System.out.println(seedsNode);
		for (int i = 0; i < seedsNode.size()/2 && i<20; i++)////// 添加邻居1/2的节点
		//for (int i = 0; i < seedsNode.size() ; i++)////// 添加邻居1/2的节点
		{
			if (!result.contains(seedsNode.get(i).getIdentifier()))
				result.add(seedsNode.get(i).getIdentifier());
		}
		// 再把初始种子集点添加进去
		for (int i = 0; i < SubSeed.size(); i++) {
			if (!result.contains(SubSeed.get(i)))
				result.add(SubSeed.get(i));
		}
		System.out.println("处理后的种子节点为：" + result);
		return result;
	}
	/*种子集处理.找到种子节点邻居中度最大的节点和种子集点一起组成种子节点
	 * SubSeed:未处理的种子集
	 * 返回值：处理后的种子集
	 * */
	private List<String> dealSeedSetsecond(List<String> SubSeed) {
		List<String> result = new ArrayList<String>();
		HashMap<String, Double> seeds = new HashMap<String, Double>();
		List<PageRankNode> seedsNode = new ArrayList<PageRankNode>();
		int count=0;
		for(int i=0;i<SubSeed.size();i++)
		{
			HashMap<String, Double> seedst = new HashMap<String, Double>();
			seedst = commService.getNeighbors(SubSeed.get(i));// 查找邻居，返回值为节点ID和交互次数
			count=count+seedst.size();			
		}
		if(count>20)
			return SubSeed;
		for (int i = 0; i < SubSeed.size(); i++) {
			seeds.put(SubSeed.get(i), Double.MAX_VALUE);
			// result.add(SubSeed.get(i));
			HashMap<String, Double> seedst = new HashMap<String, Double>();
			seedst = commService.getNeighbors(SubSeed.get(i));// 查找邻居，返回值为节点ID和交互次数
			for (String key : seedst.keySet()) {
				if (!seeds.containsKey(seedst.get(key)))
					seeds.put(key, seedst.get(key));
			}
		}
		PageRankVector(seeds, seedsNode);// 排序
		// System.out.println(seedsNode);
		for (int i = 0; i < 2; i++)// 选取度最高的点和节点组成社区
		{
			if (!result.contains(seedsNode.get(i).getIdentifier()))
				result.add(seedsNode.get(i).getIdentifier());
		}
		// 再把初始种子集点添加进去
		for (int i = 0; i < SubSeed.size(); i++) {
			if (!result.contains(SubSeed.get(i)))
				result.add(SubSeed.get(i));
		}
		System.out.println("处理后的种子节点为：" + result);
		return result;
	}
	/*种子集处理.找到种子节点二层邻居中度最大的节点和种子集点一起组成种子节点
	 * SubSeed:未处理的种子集
	 * 返回值：处理后的种子集
	 * */
	private List<String> dealSeedSetthird(List<String> SubSeed) {
		List<String> result = new ArrayList<String>();
		HashMap<String, Double> seeds = new HashMap<String, Double>();
		List<PageRankNode> seedsNode = new ArrayList<PageRankNode>();

		for (int i = 0; i < SubSeed.size(); i++) {
			seeds.put(SubSeed.get(i), Double.MAX_VALUE);
			// result.add(SubSeed.get(i));
			HashMap<String, Double> seedst = new HashMap<String, Double>();
			seedst = commService.getNeighbors(SubSeed.get(i));// 查找邻居，返回值为节点ID和交互次数
			for (String key : seedst.keySet()) {
				if (!seeds.containsKey(seedst.get(key)))
					seeds.put(key, seedst.get(key));
			}
			//看二层节点
			for(String key : seedst.keySet())
			{
				HashMap<String, Double> seedstin = new HashMap<String, Double>();
				seedstin = commService.getNeighbors(key);
				for (String keyin : seedstin.keySet()) {
					if (!seeds.containsKey(seedstin.get(keyin)))
						seeds.put(keyin, seedstin.get(keyin));
				}
			}
		}
		PageRankVector(seeds, seedsNode);// 排序
		// System.out.println(seedsNode);
		for (int i = 0; i < 2; i++)// 选取度最高的点和节点组成社区
		{
			if (!result.contains(seedsNode.get(i).getIdentifier()))
				result.add(seedsNode.get(i).getIdentifier());
		}
		// 再把初始种子集点添加进去
		for (int i = 0; i < SubSeed.size(); i++) {
			if (!result.contains(SubSeed.get(i)))
				result.add(SubSeed.get(i));
		}
		System.out.println("处理后的种子节点为：" + result);
		return result;
	}
	
	/*单纯的识别社区函数
	 * resultMap:返回值
	 * SubGraph：连通子图结构
	 * SubNodes：联通节点
	 * SubSeed：种子集
	 * strs：最初种子集切割后的数组
	 * type:区别是改进的算法还是传统的算法
	 */
	private void getCommunityOnly(Map resultMap,Map<String, ArrayList<MapEntry>> SubGraph,List<String> SubNodes,List<String> SubSeedlist,String[] strs,String type) throws ClassNotFoundException, SQLException, IOException, ParseException{
		List<String> SubSeed=new ArrayList<String>();
		for(int i=0;i<SubSeedlist.size();i++)
			SubSeed.add(SubSeedlist.get(i));
		//应用改进的pagerank算法得到各个节点的pagerank值
		List<PageRankNode> subrankedList = new ArrayList<PageRankNode>();
		List<PageRankNode> similarityList = new ArrayList<PageRankNode>();// 各个节点和种子集的相似性
		if(type.equals("improved"))
			similarityList = rank3(Variable.iterations, Variable.DumpingFactor, SubGraph, SubNodes, SubSeed, subrankedList);
		else
			similarityList=rank1(Variable.iterations, Variable.DumpingFactor, SubGraph, SubNodes, SubSeed, subrankedList);
		// System.out.println("种子集目前尺寸："+SubSeed.size());
		Collections.sort(similarityList);// 对节点相似性进行排序
		resultMap.put("similarity", similarityList);// 添加节点和种子集的相似性
		// 开始计算导率
		List<String> conList = new ArrayList<String>();
		List<List<String>> community = new ArrayList<List<String>>();
		double[] edges = new double[2];
		// int count=0;
		// System.out.println(subrankedList.size());
		//先把种子集点加入到community中
		/*List<String> commT = new ArrayList<String>();
		for (int j = 0; j < SubSeed.size(); j++)
			commT.add(SubSeed.get(j));
		conList.add(String.valueOf(1.0));
		community.add(commT);*/
		//从subrankedList删除种子集
		for (int i = 0; i < SubSeed.size(); i++) {
			for(int j=0;j<subrankedList.size();j++)
			{
				if(subrankedList.get(j).equals(SubSeed.get(i)))
				{
					subrankedList.remove(j);
					break;
				}
			}
		}
		for (int i = 0; i < subrankedList.size(); i++) {
			// 判断节点是否为种子节点
//			int flag = 0;
//			for (int j = 0; j < strs.length; j++) {
//				if (strs[j].equals(subrankedList.get(i).getIdentifier())) {
//					flag = 1;
//					break;
//				}
//			}
			//if (flag == 0) {
				SubSeed.add(subrankedList.get(i).getIdentifier());// 将节点加入到了种子节点中
				edges = getEdges(SubSeed, SubGraph);
				double conductance;
				conductance = edges[0] / edges[1];

				if (isConnected(SubSeed, Variable.getAllnode())) {
					System.out.println("导率为：" + String.valueOf(conductance));
					conList.add(String.valueOf(conductance));
					List<String> comm = new ArrayList<String>();
					for (int j = 0; j < SubSeed.size(); j++)
						comm.add(SubSeed.get(j));
					community.add(comm);
				}
				System.out.println("种子集目前尺寸：" + SubSeed.size());
			//}
		}
		// System.out.println("种子集目前尺寸："+SubSeed.size());
		////// 寻找最优社区
		double minCons = 1.0;
		List<String> bestComm = new ArrayList<String>();
		int count = 0;
		int size = 100;
		for (int i = 0; i < conList.size(); i++) {
			// 选取导率最小的社区//////////////////
			if (Double.parseDouble(conList.get(i)) <= minCons) {
				minCons = Double.parseDouble(conList.get(i));
				bestComm = community.get(i);
			}
			// 选取固定大小的社区//////////////////有问题
			/*
			 * if(linecomm.split(",").length==100) { bestComm=linecomm; break; }
			 */
		}
		String comm = "";
		int i = 0;
		if (bestComm.size() > 0) {
			for (i = 0; i < bestComm.size() - 1; i++)
				comm = comm + bestComm.get(i) + ",";
			comm = comm + bestComm.get(i);
		}
		resultMap.put("conductance", minCons);////////// 添加导率
		System.out.println("最小的导率为：" + minCons);
		System.out.println("最优的社区为：" + comm);
		// 返回社区结果
		resultMap.put("type", "force");//////// 添加图的类型:力的导向图
		List<Map> commnode = new ArrayList<Map>();
		List<PageRankNode> Nodedegree = new ArrayList<PageRankNode>();
		for (i = 0; i < bestComm.size(); i++) {
			Map mapt = new HashMap<>();
			mapt.put("name", bestComm.get(i));

			double weight = 0;
			for (MapEntry entry : SubGraph.get(bestComm.get(i))) {
				weight = weight + entry.getWeight();
			}
			mapt.put("value", weight);
			mapt.put("size", weight);
			mapt.put("category", 0);
			commnode.add(mapt);
			PageRankNode p = new PageRankNode(bestComm.get(i), weight);
			Nodedegree.add(p);

		}
		Collections.sort(Nodedegree);
		resultMap.put("top", Nodedegree);//////// 添加节点按顺序
		resultMap.put("nodes", commnode);///////// 添加节点
		List<Map> commlink = new ArrayList<Map>();
		for (i = 0; i < bestComm.size(); i++) {
			for (int j = i + 1; j < bestComm.size(); j++) {
				for (String key : SubGraph.keySet()) {
					if (bestComm.get(i).equals(key)) {
						int flag = 0;
						for (MapEntry entry : SubGraph.get(key)) {
							if (entry.getIdentifier().equals(bestComm.get(j))) {
								Map mapt = new HashMap<>();
								mapt.put("source", key);
								mapt.put("target", entry.getIdentifier());
								mapt.put("weight", entry.getWeight());
								commlink.add(mapt);
								flag = 1;
							}
						}
						if (flag == 1)
							break;
					} else if (bestComm.get(j).equals(key)) {
						int flag = 0;
						for (MapEntry entry : SubGraph.get(key)) {
							if (entry.getIdentifier().equals(bestComm.get(i))) {
								Map mapt = new HashMap<>();
								mapt.put("source", key);
								mapt.put("target", entry.getIdentifier());
								mapt.put("weight", entry.getWeight());
								commlink.add(mapt);
								flag = 1;
							}
						}
						if (flag == 1)
							break;
					} else
						continue;
				}
			}
		}
		resultMap.put("links", commlink);//////////// 添加边
		resultMap.put("size", bestComm.size());/////// 添加社区尺寸
		// 计算评价指标
		getRealCommunity();// 获取真实社区
		measure m = new measure();
		HashMap<String, Double> precisionRatio = m.getPrecision(bestComm);// 查准率，返回值为13个
		HashMap<String, Double> recallRatio = m.getRecall(bestComm);// 查全率，返回值为13个
		HashMap<String, Double> NMIS = m.getNMIS(bestComm);// NMI指标
		double p = 0.0;// 查准率
		double r = 0.0;// 查全率
		double f1 = 0.0;// f1指标
		double NMI = 0.0;// NMI指标
		String cat = null;
		// 根据f1指标确定查准率和查全率的值
		for (String key : precisionRatio.keySet()) {
			double t = m.getF1(precisionRatio.get(key), recallRatio.get(key));
			System.out.println(key + ":" + precisionRatio.get(key) + "," + recallRatio.get(key) + "," + t);
			//if (t > f1)
			if(t>f1&&!key.equals("base"))
			{
				f1 = t;
				p = precisionRatio.get(key);
				r = recallRatio.get(key);
				cat = key;
			}
		}
		/*
		 * for(String key:NMIS.keySet())
		 * System.out.println(key+":"+NMIS.get(key));
		 */
		NMI = NMIS.get(cat);
		System.out.println("社区的查准率为：" + p);
		System.out.println("社区的查全率为：" + r);
		System.out.println("社区的f1指标为：" + f1);
		System.out.println("社区的NMI指标为：" + NMI);
		System.out.println("种子集对应的连通图" + SubNodes.size());
		resultMap.put("f1", f1);
	}

	/*查找真实社区
	 * */
	private void getRealCommunity() throws SQLException, IOException
	{
		Map<String,List<String>> realComm=new HashMap<>();
		//String[] cats={"base","cat01","cat02","cat03","cat04","cat05","cat06","cat07","cat08","cat09","cat10","cat11","cat12","cat13"};
		//for(int i=0;i<cats.length;i++)
		//{
		realComm=this.commService.getNodeofCat();
			//realComm.put(cats[i], list);
			//System.out.println(list);
		//}
		Variable.setRealComm(realComm);;
		/*//新建文件，realcomm1.txt和realcomm2.txt
		File file1=new File(SrcPath+"realcomm/realcomm1.txt");
		if(!file1.exists())
			file1.createNewFile();
		File file2=new File(SrcPath+"realcomm/realcomm2.txt");
		if(!file2.exists())
			file2.createNewFile();
		//总共的类别
		String[] cats={"base","cat01","cat02","cat03","cat04","cat05","cat06","cat07","cat08","cat09","cat10","cat11","cat12","cat13"};
		//String[] cats={"cat01","cat02","cat03","cat04","cat05","cat06","cat07","cat08","cat09","cat10","cat11","cat12","cat13"};
		//开始写入文件
		PrintWriter pw1 = null;
		PrintWriter pw2 = null;
		try {
			pw1 = new PrintWriter(file1);
			pw2 = new PrintWriter(file2);
			for(int i=0;i<cats.length;i++)
			{
				//一个人同意的社区
				List<String> list1=new ArrayList<String>();							
				ResultSet result1=connection.selectCats(cats[i],1);
				//将节点写入list
				while(result1.next())
				{
					String s=result1.getString(1);
					String r=result1.getString(2);
					if(!isCommunity(s,list1))
						list1.add(s);
					if(!isCommunity(r,list1))
						list1.add(r);
				}
				result1.close();
				//将list中的节点写入文件
				System.out.println(cats[i]+"的长度为："+list1.size());
				pw1.print(cats[i]+":");
				for(int j=0;j<list1.size();j++)
					pw1.print(list1.get(j)+",");
				pw1.println();
				//两个人同意的社区
				List<String> list2=new ArrayList<String>();			
				ResultSet result2=connection.selectCats(cats[i],2);
				while(result2.next())
				{
					String s=result2.getString(1);
					String r=result2.getString(2);
					if(!isCommunity(s,list2))
						list2.add(s);
					if(!isCommunity(r,list2))
						list2.add(r);
				}
				result2.close();
				System.out.println(cats[i]+"的长度为："+list2.size());
				pw2.print(cats[i]+":");
				for(int j=0;j<list2.size();j++)
					pw2.print(list2.get(j)+",");				
				pw2.println();
			}	
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}	
		pw1.close();
		pw2.close();*/
	}	
	
	/*寻找种子集的连通分量 没有跳数
	 * map:整个图结构
	 * allnode：所有节点
	 * seed：未判断连通行的种子集点集合
	 * resultlist：返回值 所有连通的种子集
	 * */
	public void findConnectedSeed(List<List<String>> resultlist, Map<String, ArrayList<MapEntry>> map,List<String> allnode,List<String> seed)
	{
		int count=0;//连通图下标
		//List<List<String>> resultlist=new ArrayList<List<String>>();
		//将所有节点放入list中
		int n=allnode.size();
		//设定遍历标志数组并初始化为0
		int[] visited=new int[n];
		for(int i=0;i<n;i++)
		{
			visited[i]=0;
		}
		//非递归的深度优先搜索
		Stack stack=new Stack();
		for(int i=0;i<seed.size();i++)
		{
			int index=findIndex(seed.get(i),allnode);
			if(visited[index]==0)
			{
				visited[index]=1;//设为已访问
				if(count>=resultlist.size())
				{
					List<String> list=new ArrayList<String>();
					list.add(seed.get(i));
					resultlist.add(list);
				}
				else
				{
					resultlist.get(count).add(seed.get(i));
				}
				count++;
				stack.push(seed.get(i));//起始节点进栈
				while(!stack.isEmpty())
				{
					String node=stack.peek().toString();
					//设置标志位看node是否存在未被访问的邻居节点
					boolean flag=false;
					//System.out.println(node);
					for(MapEntry entry : map.get(node))
					{
						if(visited[findIndex(entry.getIdentifier(),allnode)]==0)
						{
							//如果是种子节点则写入
							if(isSeed(seed,entry.getIdentifier()))
							{
								resultlist.get(count-1).add(entry.getIdentifier());
								//writeSeeds.println(entry.getIdentifier());//写入文件
							}
							visited[findIndex(entry.getIdentifier(),allnode)]=1;//设为已访问
							stack.push(entry.getIdentifier());
							flag=true;
						}
					}
					if(flag==false)
						stack.pop();
				}
			}
		}
		//return resultlist;
	}
	/*寻找种子集的连通分量 有跳数 实际上还没有做跳数处理
	 * map:整个图结构
	 * allnode：所有节点
	 * seed：未判断连通行的种子集点集合
	 * resultlist：返回值 所有连通的种子集
	 * */
	public void findConnectedSeed(List<List<String>> resultlist, Map<String, ArrayList<MapEntry>> map,List<String> allnode,List<String> seed,int tiaoshu)
	{
		int count=0;//连通图下标
		//List<List<String>> resultlist=new ArrayList<List<String>>();
		//将所有节点放入list中
		int n=allnode.size();
		//设定遍历标志数组并初始化为0
		int[] visited=new int[n];
		for(int i=0;i<n;i++)
		{
			visited[i]=0;
		}
		//非递归的深度优先搜索
		Stack stack=new Stack();
		for(int i=0;i<seed.size();i++)
		{
			int index=findIndex(seed.get(i),allnode);
			if(visited[index]==0)
			{
				visited[index]=1;//设为已访问
				if(count>=resultlist.size())
				{
					List<String> list=new ArrayList<String>();
					list.add(seed.get(i));
					resultlist.add(list);
				}
				else
				{
					resultlist.get(count).add(seed.get(i));
				}
				count++;
				stack.push(seed.get(i));//起始节点进栈
				while(!stack.isEmpty())
				{
					String node=stack.peek().toString();
					//设置标志位看node是否存在未被访问的邻居节点
					boolean flag=false;
					//System.out.println(node);
					for(MapEntry entry : map.get(node))
					{
						if(visited[findIndex(entry.getIdentifier(),allnode)]==0)
						{
							//如果是种子节点则写入
							if(isSeed(seed,entry.getIdentifier()))
							{
								//if(shortPaths.get(k).get(findIndex(entry.getIdentifier(),allnode))<=tiaoshu)
								resultlist.get(count-1).add(entry.getIdentifier());
								//writeSeeds.println(entry.getIdentifier());//写入文件
							}
							visited[findIndex(entry.getIdentifier(),allnode)]=1;//设为已访问
							stack.push(entry.getIdentifier());
							flag=true;
						}
					}
					if(flag==false)
						stack.pop();
				}
			}
		}
		//return resultlist;
	}
	
	/*寻找每个种子集的最大连通子图  没有跳数
	 * map：整个图结构
	 * allnode：所有节点
	 * seed：种子集点
	 * listSeedsets：所有连通的种子集点
	 * resultlist：返回值
	 * */
	public void findConnectedSubgraph(List<List<String>> resultlist,Map<String, ArrayList<MapEntry>> map,List<String> allnode,List<String> seed,List<List<String>> listSeedsets)
	{
		//List<List<String>> resultlist=new ArrayList<List<String>>();
		//针对每个种子节点做一下操作
		for(int count=0;count<listSeedsets.size();count++)
		{
			//设定遍历标志数组并初始化为0
			int[] visited=new int[allnode.size()];
			for(int i=0;i<allnode.size();i++)
			{
				visited[i]=0;
			}
			//读取每个种子节点存入list
			List<String> seedlist=new ArrayList<String>();
			seedlist=listSeedsets.get(count);
			//每个连通图
			List<String> resultIn=new ArrayList<String>();
			//非递归方式寻找种子集的最大连通子图
			Stack stack=new Stack();
			//获得种子节点与其他所有节点的最短路径
			List<List<Integer>> shortPaths=new ArrayList<List<Integer>>();
			for(int i=0;i<seedlist.size();i++)
			{
				List<Integer> shortPath=new ArrayList<Integer>();
				shortPath=Dijkstra(seedlist.get(i),map,allnode);
				shortPaths.add(shortPath);
			}
			for(int i=0;i<seedlist.size();i++)
			{
				//获得该节点与图中所有其他节点的最短路径Dijkstra
				//int tiaoshu=0;//记录与种子集的跳数
				int index=findIndex(seedlist.get(i),allnode);//huodexiaobiao
				if(visited[index]==0)
				{
					visited[index]=1;//设为已访问
					resultIn.add(seedlist.get(i));
					stack.push(seedlist.get(i));//起始节点进栈
					while(!stack.isEmpty())
					{
						String node=stack.peek().toString();
						//设置标志位看node是否存在未被访问的邻居节点
						boolean flag=false;
						//tiaoshu++;
						for(MapEntry entry : map.get(node))
						{
							if(visited[findIndex(entry.getIdentifier(),allnode)]==0)
							{
								//判断最短路径是否小于3
								int flagPath=0;
								for(int k=0;k<seedlist.size();k++)
								{
									//System.out.println(shortPaths.get(k).get(findIndex(entry.getIdentifier())));
									//if(shortPaths.get(k).get(findIndex(entry.getIdentifier()))<=3)
									//{
									    flagPath=1;
									    break;
									//}
								}
								if(flagPath==1)
								{
									resultIn.add(entry.getIdentifier());
								}
								//if(!isSeed(seedlist,entry.getIdentifier()))
								visited[findIndex(entry.getIdentifier(),allnode)]=1;//设为已访问
								stack.push(entry.getIdentifier());
								flag=true;
							}
						}
						if(flag==false)
							stack.pop();
					}
				}
			}
			resultlist.add(resultIn);
		}
		//return resultlist;
	}
	/*寻找每个种子集的最大连通子图 有跳数
	 * map：整个图结构
	 * allnode：所有节点
	 * seed：种子集点
	 * listSeedsets：所有连通的种子集点
	 * resultlist：返回值
	 * */
	public void findConnectedSubgraph(List<List<String>> resultlist,Map<String, ArrayList<MapEntry>> map,List<String> allnode,List<String> seed,List<List<String>> listSeedsets,int tiaoshu)
	{
		//List<List<String>> resultlist=new ArrayList<List<String>>();
		//针对每个种子节点做一下操作
		for(int count=0;count<listSeedsets.size();count++)
		{
			//设定遍历标志数组并初始化为0
			int[] visited=new int[allnode.size()];
			for(int i=0;i<allnode.size();i++)
			{
				visited[i]=0;
			}
			//读取每个种子节点存入list
			List<String> seedlist=new ArrayList<String>();
			seedlist=listSeedsets.get(count);
			//每个连通图
			List<String> resultIn=new ArrayList<String>();
			//非递归方式寻找种子集的最大连通子图
			Stack stack=new Stack();
			//获得种子节点与其他所有节点的最短路径
			List<List<Integer>> shortPaths=new ArrayList<List<Integer>>();
			for(int i=0;i<seedlist.size();i++)
			{
				List<Integer> shortPath=new ArrayList<Integer>();
				shortPath=Dijkstra(seedlist.get(i),map,allnode);
				shortPaths.add(shortPath);
			}
			for(int i=0;i<seedlist.size();i++)
			{
				//获得该节点与图中所有其他节点的最短路径Dijkstra
				//int tiaoshu=0;//记录与种子集的跳数
				int index=findIndex(seedlist.get(i),allnode);//huodexiaobiao
				if(visited[index]==0)
				{
					visited[index]=1;//设为已访问
					resultIn.add(seedlist.get(i));
					stack.push(seedlist.get(i));//起始节点进栈
					while(!stack.isEmpty())
					{
						String node=stack.peek().toString();
						//设置标志位看node是否存在未被访问的邻居节点
						boolean flag=false;
						//tiaoshu++;
						for(MapEntry entry : map.get(node))
						{
							if(visited[findIndex(entry.getIdentifier(),allnode)]==0)
							{
								//判断最短路径是否小于3
								int flagPath=0;
								for(int k=0;k<seedlist.size();k++)
								{
									//System.out.println(shortPaths.get(k).get(findIndex(entry.getIdentifier())));
									if(shortPaths.get(k).get(findIndex(entry.getIdentifier(),allnode))<=tiaoshu)
									{
									    flagPath=1;
									    break;
									}
								}
								if(flagPath==1)
								{
									resultIn.add(entry.getIdentifier());
								}
								//if(!isSeed(seedlist,entry.getIdentifier()))
								visited[findIndex(entry.getIdentifier(),allnode)]=1;//设为已访问
								stack.push(entry.getIdentifier());
								flag=true;
							}
						}
						if(flag==false)
							stack.pop();
					}
				}
			}
			resultlist.add(resultIn);
		}
		//return resultlist;
	}
	
	/*寻找下标的函数
	 * */
	public int findIndex(String node,List<String> allnode)
	{
		for(int i=0;i<allnode.size();i++)
		{
			if(allnode.get(i).equals(node))
				return i;
		}
		return -1;
	}
	
	/*判断是否为list中的节点
	 * */
	public boolean isSeed(List<String> list,String node)
	{
		boolean flag=false;
		for(int i=0;i<list.size();i++)
		{
			if(list.get(i).equals(node))
				flag=true;
		}
		return flag;
	}
	
	/*Dijkstra求图中所有节点到某一节点的所有最短路径
	 * node:研究的节点
	 * map：图结构
	 * allnode：所有节点
	 * */
	public List<Integer> Dijkstra(String node,Map<String, ArrayList<MapEntry>> map,List<String> allnode)
	{
		List<Integer> dist=new ArrayList<Integer>();//存放最短路径
		List<Integer> s=new ArrayList<Integer>();//判断是否已存入该点到集合S
		int MAX=Integer.MAX_VALUE;
		int n=allnode.size();
		int index=findIndex(node,allnode);
		for(int i=0;i<n;i++)
		{
			dist.add(0);
			s.add(0);
		}
		int p=0;
		for(int k=0;k<n;k++)
		{
			//判断节点node到下标为k的节点是否有路径的路径
			int flag=0;
			for(MapEntry entry : map.get(node))
			{
			    if(entry.getIdentifier().equals(allnode.get(k)))
			    {
			    	flag=1;
			    	break;
			    }
			}
			if(flag==1)
			    dist.set(k, 1);
			else if(flag==0 && index!=k)
			    dist.set(k, MAX);
			else
			    dist.set(k, 0);
			s.set(k, -1);
		}
		s.set(index, 0);
		dist.set(index, 0);
		for(int m=0;m<n-1;m++)
		{
			int u=min(dist,s);
			p++;
			s.set(u, p);
			for(int i=0;i<n;i++)
			{
				if(s.get(i)==-1)
				{
					 //判断下表为u是否有到下标为i的路径
					int t;
					int flag=0;
					for(MapEntry entry : map.get(allnode.get(u)))
					{
					    if(entry.getIdentifier().equals(allnode.get(i)))
					    {
							flag = 1;
							break;
						}
					}
					if (flag == 1)
						t = 1;
					else if (flag == 0 && u != i)
						t = MAX;
					else
						t = 0;
					if (dist.get(u) != MAX && t != MAX) {
						if (dist.get(u) + t < dist.get(i))
							dist.set(i, dist.get(u) + t);
					}
				}
			}
		}
		return dist;
	}
	
	/*我也不记得这是干嘛的了，反正有用
	 * */
	public int min(List<Integer> dist, List<Integer> s) {
		int min = 0;
		for (int i = 0; i < dist.size(); i++) {
			while (s.get(min) != -1) {
				min++;
			}
			if (s.get(i) == -1) {
				if (dist.get(i) < dist.get(min))
					min = i;
			}
		}
		return min;
	}
	
	/*根据图节点得到图结构
	 * listConnections：图的节点
	 * listresult：返回值，当前节点所对应的图结构
	 * */
	public void findSubGraphs(List<Map<String, ArrayList<MapEntry>>> listresult, List<List<String>> listConnections){
		//List<Map<String, ArrayList<MapEntry>>> listresult=new ArrayList<Map<String, ArrayList<MapEntry>>>();
		Map<String, ArrayList<MapEntry>> Wholemap = new HashMap<String, ArrayList<MapEntry>>();
		Wholemap=Variable.getWholeMap();
		for(int i=0;i<listConnections.size();i++)
		{
			List<String> nodes=listConnections.get(i);
			Map<String, ArrayList<MapEntry>> Submap = new HashMap<String, ArrayList<MapEntry>>();
			for(String key:Wholemap.keySet())
			{
				if(isSeed(nodes,key))
				{
					for(MapEntry entry : Wholemap.get(key))
					{
						if(isSeed(nodes,entry.getIdentifier()))
						{
							//写入submap
							if(Submap.containsKey(key))
							{
								if(! Submap.get(key).contains(entry))
								{
									Submap.get(key).add(entry);
								}	
							}
							else
							{
								ArrayList<MapEntry> list = new ArrayList<MapEntry>();
								list.add(entry);
								Submap.put(key, list);
							}	
						}				
					}
				}
			}	
			listresult.add(Submap);
		}
		//return listresult;
	}	
	
	/*寻找当前研究的种子集所对应的连通图
	 * seed:当前研究的种子集
	 * seedsets：当前所有的连通的种子集
	 * 返回值：当前研究种子集所在的下标
	 * */
	public int findConnforSeed(String seed,List<List<String>> seedsets)
	{
		for(int i=0;i<seedsets.size();i++)
		{
			String seedsearch="";
			for(int j=0;j<seedsets.get(i).size();j++)
				seedsearch=seedsearch+seedsets.get(i).get(j)+",";
			if(seedsearch.equals(seed+","))
				return i;
		}
		return -1;
	}
	
	/*迭代PageRank算法ֵ
	 *     iterations:迭代次数
	 *     dampingFactor:阿尔法
	 *     mapSub:连通子图
	 *     list:种子节点
	 */
	//传统pagerank算法
	public List<PageRankNode> rank1(int iterations, double dampingFactor,Map<String, ArrayList<MapEntry>> mapSub,List<String> listnode,List<String> list,List<PageRankNode> resultList) throws ClassNotFoundException, UnsupportedEncodingException, SQLException, ParseException
	{	
		HashMap<String, Double> lastRanking = new HashMap<String, Double>();
	    HashMap<String, Double> nextRanking = new HashMap<String, Double>();
	        
	    //初始化lastRanking为0
	    for (String key : mapSub.keySet()) 
	    {
	        lastRanking.put(key, 0.0);
	        for(MapEntry entry : mapSub.get(key))
	        {
	            if(!mapSub.containsKey(entry.getIdentifier()))
	            	lastRanking.put(entry.getIdentifier(), 0.0);
	           }            		
	    }
	    //初始化lastRanking为节点分之一
	    Double startRank = 1.0 / lastRanking.size();
	    for (String key : mapSub.keySet()) 
	    {
	        lastRanking.put(key, startRank);
	        for(MapEntry entry : mapSub.get(key))
	        {
	            if(!mapSub.containsKey(entry.getIdentifier()))
	            	lastRanking.put(entry.getIdentifier(), startRank);
	        }           		
	    } 
	    double dampingFactorComplement = 1.0 - dampingFactor;    
	    //迭代iterations次
	    for (int times = 0; times < iterations; times++)
	    {
	    	//初始化nextRanking为0
	        for (String key : mapSub.keySet()) 
	        {
	        	nextRanking.put(key, 0.0);
	            for(MapEntry entry : mapSub.get(key))
	            {
	                if(!mapSub.containsKey(entry.getIdentifier()))
	                	nextRanking.put(entry.getIdentifier(), 0.0);
	            }
	        }
	        //pagerank迭代
	        for(String key :mapSub.keySet())
	        {
	        	for(MapEntry entry : mapSub.get(key))
	        	{
	        		double t;
	        		t=nextRanking.get(entry.getIdentifier())+lastRanking.get(key)/mapSub.get(key).size();
	        		nextRanking.put(entry.getIdentifier(), t);
	        	}      		
	        }
	    	for(String key : nextRanking.keySet())
	    	{    			
	    		nextRanking.put(key, dampingFactor*nextRanking.get(key)+dampingFactorComplement*startRank);	    				
	    	}
	        //将nextRanking值赋给lastRanking
	        for (String identifier : nextRanking.keySet()) 
	        {
	        	lastRanking.put(identifier, nextRanking.get(identifier));
	        }
	        //lastRanking=nextRanking;
	        //System.out.println("��"+times+"�ε��");
	        ///for (String identifier : lastRanking.keySet())
	        //{
	        //	System.out.println(identifier+","+lastRanking.get(identifier));
	        //}      	
	    } 
	    List<PageRankNode> similarityList=new ArrayList<PageRankNode>();
	    System.out.println(iterations + " pagerank迭代结束...");       
	    PageRankVector(lastRanking,resultList); 
	    return similarityList;
	}
	/*考虑相似性的pagerank迭代
	 * iterations：迭代次数 dampingFactor：阿尔法参数 mapSub：连通子图图结构 listnode：所有节点
	 * list：种子节点
	 * resultList:各个节点的pagerank值
	 */
	public  List<PageRankNode> rank3(int iterations, double dampingFactor,Map<String, ArrayList<MapEntry>> mapSub, List<String> listnode, List<String> list,List<PageRankNode> resultList) throws ClassNotFoundException, SQLException, IOException{
		HashMap<String, Double> lastRanking = new HashMap<String, Double>();
		HashMap<String, Double> nextRanking = new HashMap<String, Double>();
		// List<String> listnode=new ArrayList<String>();
		// 初始化lastranking为0
		for (String key : mapSub.keySet()) {
			lastRanking.put(key, 0.0);
			for (MapEntry entry : mapSub.get(key)) {
				if (!mapSub.containsKey(entry.getIdentifier()))
					lastRanking.put(entry.getIdentifier(), 0.0);
			}
		}
		// 初始化lastranking为节点分之一
		Double startRank = 1.0 / lastRanking.size();
		for (String key : mapSub.keySet()) {
			lastRanking.put(key, startRank);
			for (MapEntry entry : mapSub.get(key)) {
				if (!mapSub.containsKey(entry.getIdentifier()))
					lastRanking.put(entry.getIdentifier(), startRank);
			}
		}
		double dampingFactorComplement = 1.0 - dampingFactor;
		// 获取节点相似性
		HashMap<String, Double> similarity = new HashMap<String, Double>();
		double sum = 0;
		// 单线程实现相似性向量/////////////////////整个算一个节点和种子节点的相似性
		/*
		 * for(String key : lastRanking.keySet()) { double s=getS(key,list);
		 * sum=sum+s; similarity.put(key, s);
		 * //System.out.println(similarity.get(key)); }
		 */
		// 单线程实现相似性向量/////////////////////分别算各个特征的相似性向量，归一化后再相加，再归一化（归一化在后边）
		getSimilarity(list, lastRanking, similarity);// 获取相似性向量，返回值为该向量所有元素的和（种子集，各个节点）；
		// pagerank迭代10次
		for (int times = 0; times < iterations; times++) {
			// 初始化nextranking为0
			for (String key : mapSub.keySet()) {
				nextRanking.put(key, 0.0);
				for (MapEntry entry : mapSub.get(key)) {
					if (!mapSub.containsKey(entry.getIdentifier()))
						nextRanking.put(entry.getIdentifier(), 0.0);
				}
			}
			// pagerank
			for (String key : mapSub.keySet()) {
				for (MapEntry entry : mapSub.get(key)) {
					double t;
					t = nextRanking.get(entry.getIdentifier()) + lastRanking.get(key) / mapSub.get(key).size();
					nextRanking.put(entry.getIdentifier(), t);
				}
			}
			//
			for (String key : nextRanking.keySet()) {
				nextRanking.put(key,
						dampingFactor * nextRanking.get(key) + dampingFactorComplement * similarity.get(key));
			}
			// 将nextranking值赋给lastranking
			for (String identifier : nextRanking.keySet()) {
				lastRanking.put(identifier, nextRanking.get(identifier));
			}
		}
		List<PageRankNode> similarityList=new ArrayList<PageRankNode>();
        for(String key:similarity.keySet())
        {
        	PageRankNode p=new PageRankNode(key,similarity.get(key));
        	similarityList.add(p);
        }
		System.out.println(iterations + " pagerank迭代结束...");
		PageRankVector(lastRanking,resultList);
		//System.out.println("haha"+resultList.size());
		return similarityList;
	}
	
	/*PageRankֵ值排序
	 * LastRanking：未排序的
	 * resultList：已排好序的
	 */
	public void PageRankVector(final HashMap<String, Double> LastRanking,List<PageRankNode> resultList) {
		//List<PageRankNode> nodeList = new LinkedList<PageRankNode>();
		for (String identifier : LastRanking.keySet()) {
			PageRankNode node = new PageRankNode(identifier, LastRanking.get(identifier));
			resultList.add(node);
		}
		Collections.sort(resultList);
		System.out.println("各个节点pagerank值为：");
		for (int i=0;i<resultList.size();i++)
		{
		    System.out.println(resultList.get(i).getIdentifier()+","+resultList.get(i).getRank());
		}
		//return resultList;
	}
	
	/*计算相似性向量
     * seeds:种子集
     * lastRanking: 存放各个节点
     * similarity:存放相似性，最后需要改变
     * 返回值为最终向量的和
     */
    public void getSimilarity(List<String> seeds,HashMap<String, Double> lastRanking,HashMap<String, Double> similarity) throws ClassNotFoundException, SQLException, IOException
    {
//    	FileWriter writer=null;
//  		File f=new File(SrcPath+"similarity.txt");
//  		if(!f.exists())
//  			f.createNewFile();
//  		PrintWriter out =null;
    	//ComputeSimilarity com=new ComputeSimilarity();
    	
    	//先计算交互相似性 并对其归一化
    	HashMap<String, Double> interact = new HashMap<String, Double>();
    	for(String key : lastRanking.keySet())
    	{
    		//种子集做特殊处理
    		if(isSeed(seeds,key))
    		{
    			interact.put(key, 0.0);
    			continue;
    		}
    		Double countInter=getInterCount(key,seeds);//该节点跟种子集的交互总次数
    		interact.put(key, countInter);//写入交互记录的map中
    		System.out.println("节点"+key+"和种子集的交互向量："+countInter);
    	}
    	Normalization(interact);//归一化
    	//计算话题相似性
    	//System.out.println("种子集为"+seeds);
    	HashMap<String, Double> topic = new HashMap<String, Double>();
    	for(String key : lastRanking.keySet())
    	{
    		//种子集做特殊处理
    		if(isSeed(seeds,key))
    		{
    			topic.put(key, 0.0);
    			continue;
    		}
    		Double countTopic=getTopicCount(key,seeds);//该节点跟种子集的交互总次数
    		topic.put(key, countTopic);//写入交互记录的map中
    		System.out.println("节点"+key+"和种子集的话题向量："+countTopic);
    	}
    	Normalization(topic);//归一化
    	//是否抄送过同一篇邮件
    	HashMap<String, Double> sameEmail = new HashMap<String, Double>();
    	for(String key : lastRanking.keySet())
    	{
    		//种子集做特殊处理
    		if(isSeed(seeds,key))
    		{
    			sameEmail.put(key, 0.0);
    			continue;
    		}
    		Double countSameEmail=getSameEmailCount(key,seeds);//该节点跟种子集的交互总次数
    		sameEmail.put(key, countSameEmail);//写入交互记录的map中
    		System.out.println("节点"+key+"和种子集的抄送同一篇邮件："+countSameEmail);
    	}
    	Normalization(sameEmail);//归一化
    	//是否相邻并联系紧密
    	HashMap<String, Double> IsCloser = new HashMap<String, Double>();
    	for(String key : lastRanking.keySet())
    	{
    		//种子集做特殊处理
    		if(isSeed(seeds,key))
    		{
    			IsCloser.put(key, 0.0);
    			continue;
    		}
    		Double countIsCloser=getIsCloserCount(key,seeds);//该节点跟种子集的交互总次数
    		IsCloser.put(key, countIsCloser);//写入交互记录的map中
    		System.out.println("节点"+key+"和种子集的是否相邻并联系紧密："+countIsCloser);
    	}
    	Normalization(IsCloser);//归一化
    	//对所有特征进行合并并归一化
    	for(String key : lastRanking.keySet())
    	{
    		Double s=Variable.wOfInteract*interact.get(key)+Variable.wOfTopic*topic.get(key)+Variable.wOfSameEamil*sameEmail.get(key)+Variable.wOfIsCloser*IsCloser.get(key);
    		System.out.println("节点"+key+"和种子集的相似性为："+s);
//    		try{
//      			writer=new FileWriter(f,true);
//      			out=new PrintWriter(writer);
//      			out.println(key+"和种子集的相似性为："+s);
//        	}catch(IOException e)
//      		{
//      			e.printStackTrace();
//      		}
//      		writer.close();
//      		out.close();
    		similarity.put(key, s);
    	}
    	Normalization(similarity);//归一化
    	//将种子节点的元素值设高////////////////////////
    	for(String key : lastRanking.keySet())
    	{
    		if(isSeed(seeds,key))
    			similarity.put(key, 1.0);
    	}
    	//return sum;
    }
   
    /*归一化Double
     * hs:有待归一化的向量
     * */
    public void Normalization(HashMap<String, Double> hs)
    {
    	Double sum=0.0;
    	//对向量进行归一化处理
    	for(String key : hs.keySet())
    		sum=sum+hs.get(key);
    	for(String key : hs.keySet())
    	{
    		if(sum==0)
    			hs.put(key, 0.0);
    		else
    			hs.put(key, hs.get(key)/sum);
    	}
    }

    ///////////////////////////*********计算相似性************///////////////////////////////
  	/*返回节点和种子节点之间总的交互次数
  	 * key:待研究的节点
  	 * seeds：种子节点
  	 * */
  	public Double getInterCount(String key,List<String> seeds) throws SQLException, ClassNotFoundException
  	{
  		Double result=0.0;
  		for(int i=0;i<seeds.size();i++)
  		{
  			result=result+this.commService.getInterFeature(key, seeds.get(i));
  		}
  		return result;		
  	}
  	
  	/*返回节点和种子节点之间的话题相似性
  	 ** key:待研究的节点
  	 * seeds：种子节点
  	 * */
  	public Double getTopicCount (String key,List<String> seeds) throws SQLException, ClassNotFoundException, IOException
  	{
  		Double result=0.0;
  		for(int i=0;i<seeds.size();i++)
  		{
  			result=result+getTopic(key,seeds.get(i));
  		}
  		return result;		
  	}
 
  	/*返回节点和种子节点之间是否抄送过同一篇邮件
  	 * key:待研究的节点
  	 * seeds：种子节点
  	 * */
  	public Double getSameEmailCount (String key,List<String> seeds) throws SQLException, ClassNotFoundException, IOException
  	{
  		Double result=0.0;
  		for(int i=0;i<seeds.size();i++)
  		{
  			result=result+getsameEmail(key,seeds.get(i));
  		}
  		return result;		
  	}
  	
  	/*返回节点和种子节点之间相邻并且联系紧密的数目
  	 * key:待研究的节点
  	 * seeds：种子节点
  	 * */
  	public Double getIsCloserCount (String key,List<String> seeds) throws SQLException, ClassNotFoundException, IOException
  	{
  		Double result=0.0;
  		for(int i=0;i<seeds.size();i++)
  		{
  			result=result+getCloser(key,seeds.get(i));
  		}
  		return result;		
  	}  	
 
  	private Double getTopic(String node1, String node2)
  	{
  		double result=0.0;
  		result=result+this.commService.getTopicFeature(node1,node2);
  		return result;
  	}
  	/////////原来的
  	/*话题特征
     * node1:节点1
     * node2:节点2
     * */
  	/*private Double getTopic(String node1, String node2) throws SQLException, ClassNotFoundException, IOException {
  		double result=0.0;
  		/////////自己分析话题
  		//去停用词直接计算相似性,去掉the a an等
  		// 先获取停用的英文单词
  		List<String> stopword=new ArrayList<String>();
  		String t=null;
  		File f=new File(Variable.path+"stopword.txt");
  		BufferedReader br=new BufferedReader(new FileReader(f));
  		while((t=br.readLine())!=null)
  		{
  			t=t.trim();
  			stopword.add(t);
  		}
  		br.close();
  		//开始查找消息
  		List<String> list1=new ArrayList<String>();
  		list1=this.commService.getTopicFeature(node1);//////////这个可能需要去除掉空的
  		List<String> list2=new ArrayList<String>();
  		list2=this.commService.getTopicFeature(node2);
  		int count=0;
  		for(int i=0;i<list1.size();i++)
  		{
  			if(list1.get(i)!=null&&list1.get(i)!="")
  			{
  				for(int j=0;j<list2.size();j++)
  				{
  					if(list2.get(j)!=null&list2.get(j)!="")
  					{
  						count++;
  						String s1=DeleteStopWordEnglish(stopword,list1.get(i));
  						String s2=DeleteStopWordEnglish(stopword,list2.get(j));
  						result=result+similarByCosEnglish(s1,s2);
  					}
  				}
  			}
  		}
//  		ResultSet resultset1=connection.selectSubject(node1);
//  		while(resultset1.next())
//  		{
//  			String s=resultset1.getString(1);
//  			if(s!=null&&s!="")
//  				list1.add(s);
//  		}
//  		resultset1.close();
//  		int count=0;
//  		ResultSet resultset2=connection.selectSubject(node2);
//  		while(resultset2.next())
//  		{
//  			String s=resultset2.getString(1);
//  			if(s!=null&&s!="")
//  			{
//  				String s1=DeleteStopWordEnglish(stopword,s);
//  				count++;
//  				for(int i=0;i<list1.size();i++)
//  				{			
//  					String s2=DeleteStopWordEnglish(stopword,list1.get(i));
//  					result=result+similarByCosEnglish(s1,s2);
//  				}
//  			}
//  		}
//  		resultset2.close();
  		if(list1.size()==0||count==0)
  			return 0.0;
  		result=result/(list1.size()*count);
  		return result;
  	}*/
  	
    
  	/*去停用词函数,去英文
     * stopword:停用词
     * str：需要去除停用词的字符串
     */
  	public String DeleteStopWordEnglish(List<String> stopword,String str)
  	{
  		String result="";
  		// 先要处理英文
  		//System.out.println("原邮件为："+str);
  		str=str.replaceAll("[\\p{Punct}\\pP]", " ");//去除标点
  		//System.out.println("去掉标点之后为："+str);
  		String[] strs=str.split(" ");
  		for(int i=0;i<strs.length;i++)
  		{
  			String s=strs[i].toLowerCase();//全部变为小写		
  			if(!isSeed(stopword,s))
  			{
  				result=result+s+" ";
  			}
  		}
  		//for(int i=0;i<stopword.size();i++)
  			//str=str.replaceAll(stopword.get(i), "");
  		//System.out.println("去停用此之后为："+result);
  		return result;
  	}
	
  	/*英文文本的相似性cos值
	 * str1:字符串1
	 * str2:字符串2
	 */
	public double similarByCosEnglish(String str1,String str2)
	{
		Map<String,int[]> vectorSpace=new HashMap<String,int[]>();
		int[] itemCountArray=null;
		String strArray[]=str1.split(" ");
		for(int i=0;i<strArray.length;++i)
		{
			if(vectorSpace.containsKey(strArray[i]))
				++(vectorSpace.get(strArray[i])[0]);
			else
			{
				itemCountArray=new int[2];
				itemCountArray[0]=1;
				itemCountArray[1]=0;
				vectorSpace.put(strArray[i], itemCountArray);
			}				
		}
		strArray=str2.split(" ");
		for(int i=0;i<strArray.length;++i)
		{
			if(vectorSpace.containsKey(strArray[i]))
				++(vectorSpace.get(strArray[i])[1]);
			else
			{
				itemCountArray=new int[2];
				itemCountArray[0]=0;
				itemCountArray[1]=1;
				vectorSpace.put(strArray[i], itemCountArray);
			}				
		}
		double vector1Modulo=0.0;
		double vector2Modulo=0.0;
		double vectorProduct=0.0;
		Iterator iter=vectorSpace.entrySet().iterator();
		while(iter.hasNext())
		{
			Map.Entry entry=(Map.Entry)iter.next();
			itemCountArray=(int[])entry.getValue();
			vector1Modulo+=itemCountArray[0]*itemCountArray[0];
			vector2Modulo+=itemCountArray[1]*itemCountArray[1];
			vectorProduct+=itemCountArray[0]*itemCountArray[1];
		}
		if(vectorProduct==0)
			return 0.0;
		else
		{
			vector1Modulo=Math.sqrt(vector1Modulo);
			vector2Modulo=Math.sqrt(vector2Modulo);
			return (vectorProduct/(vector1Modulo*vector2Modulo));
		}
	}
   
	/*
     * 是否在同一批邮件中
     * node1:节点1
     * mode2:节点2
     */
	public Integer getsameEmail(String node1, String node2) throws ClassNotFoundException, SQLException {
		//Double result=0.0;
		//邮件id一样，并且有相同的发件人
		int count=this.commService.getEmailFeature(node1,node2);		
		//if(count!=0)
			//System.out.println(count);
		//if(count>=1)
			//result=1.0;	
		return count;
	}
   
	/*是否有过直接邮件交互
     * node1:节点1
     * node2:节点2
     * */
	public Integer getCloser(String node1,String node2) throws ClassNotFoundException, SQLException
	{
		//Double result=0.0;
		//邮件id一样，并且有相同的发件人
		int count=0;
		count=this.commService.getCloserFeature(node1, node2);
		//if(count>0)
			//result=1.0;
		return count;
	}
	
	/*计算导率用的参数，两类边的数量
	 * list：社区
	 * map：整个图结构
     */
    public  double[] getEdges(List<String> list,Map<String, ArrayList<MapEntry>> map)
    {
    	//定义Subgraph
//    	Map<String, ArrayList<MapEntry>> Subgraph=new HashMap<String, ArrayList<MapEntry>>();
//    	Subgraph=getSubGraph();
    	double[] array=new double[2];//array[0]为社区内节点指向社区外节点的边array[1]min(社区内的边，社区外的边)
    	double in=0.0;
    	double out=0.0;
    	
    	//System.out.println(inEdges+","+outEdges+","+conduct);
    	for (String key : map.keySet())
    	{
    		if(isSeed(list,key))
    		{
    			for(MapEntry entry : map.get(key))
    			{
    				if(!isSeed(list,entry.getIdentifier()))
    					array[0]=array[0]+entry.getWeight();
    				else
    					in=in+entry.getWeight();
    			}
    		}
    		else
    		{
    			for(MapEntry entry : map.get(key))
    			{
    				if(isSeed(list,entry.getIdentifier()))
    					array[0]=array[0]+entry.getWeight();	
    				else
    					out=out+entry.getWeight();
    			}
    		}		
    	}
    	if(in>out)
    		array[1]=out+array[0];
    	else
    		array[1]=in+array[0];
    	return array;
    }
  
    /*连通行判断ͨ
   * list:判断对象
   * allnode：所有节点
   */
    public boolean isConnected(List<String> list,List<String> allnode) throws IOException
    {
    	Map<String, ArrayList<MapEntry>> mapGraph=new HashMap<String, ArrayList<MapEntry>>();
    	mapGraph=Variable.getWholeMap();
    	int n=allnode.size();
  ///////int n=list.size();
    	//初始化每个节点状态为未访问
    	int[] visited=new int[n];
    	for(int i=0;i<n;i++)
    	{
    		visited[i]=0;
    	}
    	//初始化栈
    	Stack stack=new Stack();
    	for(int i=0;i<list.size();i++)
    	{
   			int index=findIndex(list.get(i),allnode);
    		///////int index=findIndex(list.get(i),list);
    		if(visited[index]==0)
    		{
    			if(i!=0)
    				return false;
    			else
    			{
    				visited[index]=1;//设访问位为1
    				stack.push(list.get(i));//入栈
    				while(!stack.isEmpty())
    				{
    					String node=stack.peek().toString();
    					
    					boolean flag=false;
    					if(mapGraph.containsKey(node))
    					{
    						for(MapEntry entry : mapGraph.get(node))
    						{
    							if(visited[findIndex(entry.getIdentifier(),allnode)]==0)
    							///////if(visited[findIndex(entry.getIdentifier(),list)]==0)
    							{
    								visited[findIndex(entry.getIdentifier(),allnode)]=1;//访问位为1
    								///////visited[findIndex(entry.getIdentifier(),list)]=1;
    								if(findIndex(entry.getIdentifier(),list)!=-1)
    								{
    									stack.push(entry.getIdentifier());
    									flag=true;
    								}
    							}
    						}
    					}
    					if(flag==false)
    						stack.pop();
    				}
    			}
    		}
    	}
    	return true;
    }
}
