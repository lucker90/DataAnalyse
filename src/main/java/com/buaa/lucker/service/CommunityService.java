package com.buaa.lucker.service;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.buaa.lucker.Variable;
import com.buaa.lucker.dao.CommunityDao;
import com.buaa.lucker.pojo.Edge;
import com.buaa.lucker.pojo.MapEntry;
import com.buaa.lucker.pojo.NodeInteract;
import com.buaa.lucker.pojo.RealComm;

@Service("CommunityService") 
public class CommunityService {
	
	@Resource  
    private CommunityDao commDao; 
	/**获取整个图结构
	 * @param 
	 * @return 图结构map
	 */
	public Map<String, ArrayList<MapEntry>> getWholeGraph()
	{
		Map<String, ArrayList<MapEntry>> WholeGraphmap = new HashMap<String, ArrayList<MapEntry>>();
		//获取整个图
		List list=new ArrayList<>();
		list=commDao.getGraph();
		//将整个图存入WholeGraphmap//单向的
		for(int j=0;j<list.size();j++)
		{
			Edge edge=(Edge) list.get(j);
//			System.out.println(edge.getSource()+","+edge.getTarget()+","+edge.getWeight());
			String source=String.valueOf(edge.getSource());
			String target=String.valueOf(edge.getTarget());
			double weight=(double)edge.getWeight();
			
			MapEntry mapEntry1 = new MapEntry(target, weight);
			MapEntry mapEntry2 = new MapEntry(source, weight);
			if(WholeGraphmap.containsKey(source))
			{
				int flag=0;
				for(int i=0;i<WholeGraphmap.get(source).size();i++)
				{
					if(WholeGraphmap.get(source).get(i).getIdentifier().equals(target))
					{
						MapEntry mapEntrySum=new MapEntry(target,WholeGraphmap.get(source).get(i).getWeight()+weight);
						WholeGraphmap.get(source).remove(i);
						WholeGraphmap.get(source).add(mapEntrySum);
						//WholeGraphmap.get(source).set(i, mapEntrySum);
						flag=1;
						break;
					}
				}
				if(flag==0)
					WholeGraphmap.get(source).add(mapEntry1);
			}
			else if(WholeGraphmap.containsKey(target))
			{
				int flag=0;
				for(int i=0;i<WholeGraphmap.get(target).size();i++)
				{
					if(WholeGraphmap.get(target).get(i).getIdentifier().equals(source))
					{
						MapEntry mapEntrySum=new MapEntry(source,WholeGraphmap.get(target).get(i).getWeight()+weight);
						WholeGraphmap.get(target).remove(i);
						WholeGraphmap.get(target).add(mapEntrySum);
						//WholeGraphmap.get(target).set(i, mapEntrySum);
						flag=1;
						break;
					}
				}
				if(flag==0)
					WholeGraphmap.get(target).add(mapEntry2);
			}
			else
			{
				ArrayList<MapEntry> listin = new ArrayList<MapEntry>();
				listin.add(mapEntry1);
				WholeGraphmap.put(source, listin);
			}
		}
		//变成双向的
		List<String> listin=new ArrayList<String>();
		for(String key:WholeGraphmap.keySet())
		{
			for(MapEntry entry : WholeGraphmap.get(key))
			{
//				System.out.println(key+","+entry.getIdentifier()+","+entry.getWeight());
				listin.add(key+","+entry.getIdentifier()+","+String.valueOf(entry.getWeight()));
			}
		}
		for(int i=0;i<listin.size();i++)
		{
			String[] str=listin.get(i).split(",");
			if(WholeGraphmap.containsKey(str[1]))
				WholeGraphmap.get(str[1]).add(new MapEntry(str[0], Double.parseDouble(str[2])));
			else
			{
				ArrayList<MapEntry> listinin = new ArrayList<MapEntry>();
				listinin.add(new MapEntry(str[0], Double.parseDouble(str[2])));
				WholeGraphmap.put(str[1], listinin);
			}
		}
//		for(String key:WholeGraphmap.keySet())
//		{
//			for(MapEntry entry : WholeGraphmap.get(key))
//			{
//				System.out.println(key+","+entry.getIdentifier()+","+entry.getWeight());
//			}
//		}
		return WholeGraphmap;
	}
	//获取所有节点
	public List<String> getAllNode()
	{
		List<Integer> allnodet=new ArrayList<Integer>();
		List<String> allnode=new ArrayList<String>();
		allnodet=commDao.getNode();
		for(int i=0;i<allnodet.size();i++)
		{
			//System.out.println(allnodet.get(i));
			allnode.add(String.valueOf(allnodet.get(i)));
		}
		return allnode;
	}
	//获取某一类社区的节点集合
	public Map<String,List<String>> getNodeofCat()
	{
		Map<String,List<String>> result=new HashMap<String,List<String>>();
		List<RealComm> resultt=new ArrayList<RealComm>();
		if(Variable.getRealCommCat()==1)
			resultt=commDao.getNodeCat1();
		else
			resultt=commDao.getNodeCat2();
		//System.out.println(result.size());
		for(int i=0;i<resultt.size();i++)
		{
			List<String> t=new ArrayList<String>();
			String[] nodes=resultt.get(i).getNodes().split(",");
			for(int j=0;j<nodes.length;j++)
				t.add(nodes[j]);
			result.put(resultt.get(i).getType(), t);
			//System.out.println(resultt.get(i).getType()+":"+t);
		}
		return result;
	}
	//原来的查询交互特征
	public int getInterFeature_old(String node1,String node2)
	{
		int result=0;
		result=commDao.getInterNum(Integer.parseInt(node1), Integer.parseInt(node2)).get(0);
		return result;
	}
	//新的查询交互特征
	public int getInterFeature(String node1,String node2)
	{
		int result=0;
		//System.out.println(node1+","+node2);
		result=commDao.getInterNum_new(Integer.parseInt(node1), Integer.parseInt(node2)).get(0);
		return result;
	}
	//原来的话题特征提取
	public List<String> getTopicFeature_old(String node)
	{
		List<String> result=new ArrayList<String>();
		result=commDao.getSubject(Integer.parseInt(node));
		return result;
	}
	//新的话题特征提取
	public double getTopicFeature(String id1,String id2)
	{
		double result=0.0;
		//System.out.println(id1+","+id2);
		result=Double.parseDouble(commDao.getSubject_new(Integer.parseInt(id1),Integer.parseInt(id2)).get(0));
		return result;
	}
	//原来的是否抄送过相同邮件
	public int getEmailFeature_old(String node1,String node2)
	{
		int result=0;
		
		List<Integer> tlist1=new ArrayList<Integer>();
		List<String> list1=new ArrayList<String>();
		tlist1=this.commDao.getMessageid(Integer.parseInt(node1));
		for(int i=0;i<tlist1.size();i++)
			list1.add(String.valueOf(tlist1.get(i)));
		
		List<Integer> tlist2=new ArrayList<Integer>();
		List<String> list2=new ArrayList<String>();
		tlist2=this.commDao.getMessageid(Integer.parseInt(node2));
		for(int i=0;i<tlist2.size();i++)
			list2.add(String.valueOf(tlist2.get(i)));
		
		for(int i=0;i<list1.size();i++)
		{
			for(int j=0;j<list2.size();j++)
			{
				if(list1.get(i).equals(list2.get(j)))
				{
					result++;
					//break;
				}
			}
		}
		return result;
	}
	//新的是否抄送过相同邮件
	public int getEmailFeature(String id1,String id2)
	{
		int result=0;
		result=commDao.getMessageid_new(Integer.parseInt(id1),Integer.parseInt(id2)).get(0);
		return result;
	}
	//原来的是否有直接交互
	public int getCloserFeature_old(String node1,String node2)
	{
		int result=0;
		result=this.commDao.getCloser(Integer.parseInt(node1),Integer.parseInt(node2)).get(0);
		return result;
	}
	//原来的是否有直接交互
	public int getCloserFeature(String id1, String id2) {
		int result = 0;
		result = this.commDao.getCloser_new(Integer.parseInt(id1), Integer.parseInt(id2)).get(0);
		return result;
	}
	/*获取某个节点的邻居节点以及交互次数
	 * */
	public HashMap<String, Double> getNeighbors(String node){
		HashMap<String, Double> result=new HashMap<String,Double>();
		List<NodeInteract> resultt=new ArrayList<NodeInteract>();
		resultt=this.commDao.getNeighbor(Integer.parseInt(node));
		
		for(int i=0;i<resultt.size();i++)
		{
			//System.out.println(resultt.get(i).getId()+","+resultt.get(i).getCount());
			result.put(String.valueOf(resultt.get(i).getId()), (double)resultt.get(i).getCount());
		}
		return result;
	}
}
