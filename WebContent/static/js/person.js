var nodesizeMin=3;//图节点尺寸最小值
var nodesizeMax=10;//图节点尺寸最大值
/***************************************用户信息****************************/
//获取用户基本信息
function getUserBasicInfo(){
	$("#grid_10").empty();
	var div_searchinfo="<div id='searchinfo' style='margin-left:10px; margin-top:10px' >" +
	                       "节点id <input class='txt_id' type='text'/>&nbsp&nbsp&nbsp"+
	                       "<button id='btn_searchinfo' type='button' onclick='getUserInfo()'>查询</button>&nbsp&nbsp&nbsp"
			           "</div>"+
	                   "<div id='comm_graph' style='width:700px; height:520px; float:left;'></div>"+
		               "<div id='comm_info' style='width:300px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
		                   "<p id='p_email'></p>"+
		                   "<p id='p_location'></p>"+
		                   "<p id='sex'></p>"+
		               "</div>";
    $("#grid_10").append(div_searchinfo);
    //显示所有用户地域分布
    getAllInformation();
}
function getAllInformation(){
	$.ajax({
		url :"../../Person/getAllInformation",
		data:{
			id:id,
			cengshu:cengshu
		},
		type : 'post',
		async: false,
		success : function(data){
			
		}
	});
}
/***************************************社交网络****************************/
//好友网络
function getFriendNetwork(){
	$("#grid_10").empty();
	var div_interactnetwork="<div id='div_interactnetwork' style='margin-left:10px; margin-top:10px' >" +
	                       "节点id <input id='txt_id' type='text'/>&nbsp&nbsp&nbsp"+
	                       "层数 <input id='txt_cengshu' type='text'/>&nbsp&nbsp&nbsp"+
	                       "<button id='btn_interactnetwork' type='button' onclick='DrawFriendsNetwork()'>查询</button>&nbsp&nbsp&nbsp"
			           "</div>"
    $("#grid_10").append(div_interactnetwork);
}
function DrawFriendsNetwork(){
	var id=$("#txt_id").val();
	var cengshu=$("#txt_cengshu").val();
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
    $("#grid_10").append(maingraph_div);
	$.ajax({
		url :"../../Person/getInteract",
		data:{
			id:id,
			cengshu:cengshu
		},
		type : 'post',
		async: false,
		success : function(data){
			var categories=new Array();
			var legend=new Array();
			var nodes=new Array();
			var links=new Array();
			for(var i=0;i<data.nodes.length;i++){
				categories[i]={
			            "name": "第"+String(i)+"层",
			            "keyword": {},
			            "base": "第"+String(i)+"层"
			        };
				legend[i]="第"+String(i)+"层";
				for(var j=0;j<data.nodes[i].length;j++){
					var node=new Object();
					node.name=data["nodes"][i][j];
					node.size=1;
					node.value=1;
					node.category=i;
					nodes[nodes.length]=node;	
				}
			}
			for(var i=0;i<data.edges.length;i++){
				var link=new Object();
				link.source=String(data.edges[i].source);
				link.target=String(data.edges[i].target);
				link.weight=data.edges[i].weight;
				links[links.length]=link;
			}
			//links=data.edges;
			var myChart = echarts.init(document.getElementById('main'));
		    option = {
				title : {
					text : '好友网络图',
					x : 'center',
					y : 'bottom'
				},
				legend : {
				    data : legend,
				    orient : 'vertical',
				    x : 'left'
				},
				tooltip : {
					trigger : 'item',
					formatter : "{b}"
				},
				backgroundColor:'#DCDCDC',
				toolbox : {
					show : true,
					feature : {
						restore : {
							show : true
						},
						magicType : {
							show : true,
							type : [ 'force', 'chord' ],
							option : {
								chord : {
									minRadius : 2,
									maxRadius : 10,
									ribbonType : false,
									itemStyle : {
										normal : {
											label : {
												show : true,
												rotate : true
											},
											chordStyle : {
												opacity : 0.2
											}
										}
									}
								},
								force : {
									minRadius : 10,
									maxRadius : 20,
									itemStyle : {
										normal : {
											label : {
												show : false
											},
											linkStyle : {
												opacity : 3
											}
										}
									}
								}
							}
						},
						saveAsImage : {
							show : true
						}
					}
				},
				noDataEffect : 'none',
				series : [ {
					// FIXME No data
					type : 'force',
				} ],
			};

			option.series[0] = {
				type : 'force',
				name : 'webkit-dep',
				itemStyle : {
					normal : {
						linkStyle : {
							opacity : 3
						}
					}
				},
				categories : categories,
				nodes : nodes,
				links : links,
				minRadius : nodesizeMin,
				maxRadius : nodesizeMax,
				gravity : 1.1,
				scaling : 1.1,
				steps : 20,
				large : true,
				useWorker : true,
				coolDown : 0.995,
				ribbonType : false,
			};
			myChart.setOption(option);
		}
	});
}
//交互网络
function getInteractNetwork(){
	$("#grid_10").empty();
	var div_interactnetwork="<div id='div_interactnetwork' style='margin-left:10px; margin-top:10px' >" +
	                       "节点id <input id='txt_id' type='text'/>&nbsp&nbsp&nbsp"+
	                       "层数 <input id='txt_cengshu' type='text'/>&nbsp&nbsp&nbsp"+
	                       "<button id='btn_interactnetwork' type='button' onclick='DrawInteractNetwork()'>查询</button>&nbsp&nbsp&nbsp"
			           "</div>"
    $("#grid_10").append(div_interactnetwork);
}
function DrawInteractNetwork(){
	var id=$("#txt_id").val();
	var cengshu=$("#txt_cengshu").val();
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
    $("#grid_10").append(maingraph_div);
	$.ajax({
		url :"../../Person/getInteract",
		data:{
			id:id,
			cengshu:cengshu
		},
		type : 'post',
		async: false,
		success : function(data){
			var categories=new Array();
			var legend=new Array();
			var nodes=new Array();
			var links=new Array();
			for(var i=0;i<data.nodes.length;i++){
				categories[i]={
			            "name": "第"+String(i)+"层",
			            "keyword": {},
			            "base": "第"+String(i)+"层"
			        };
				legend[i]="第"+String(i)+"层";
				for(var j=0;j<data.nodes[i].length;j++){
					var node=new Object();
					node.name=data["nodes"][i][j];
					node.size=1;
					node.value=1;
					node.category=i;
					nodes[nodes.length]=node;	
				}
			}
			for(var i=0;i<data.edges.length;i++){
				var link=new Object();
				link.source=String(data.edges[i].source);
				link.target=String(data.edges[i].target);
				link.weight=data.edges[i].weight;
				links[links.length]=link;
			}
			//links=data.edges;
			var myChart = echarts.init(document.getElementById('main'));
		    option = {
				title : {
					text : '交互网络图',
					x : 'center',
					y : 'bottom'
				},
				legend : {
				    data : legend,
				    orient : 'vertical',
				    x : 'left'
				},
				tooltip : {
					trigger : 'item',
					formatter : "{b}"
				},
				backgroundColor:'#DCDCDC',
				toolbox : {
					show : true,
					feature : {
						restore : {
							show : true
						},
						magicType : {
							show : true,
							type : [ 'force', 'chord' ],
							option : {
								chord : {
									minRadius : 2,
									maxRadius : 10,
									ribbonType : false,
									itemStyle : {
										normal : {
											label : {
												show : true,
												rotate : true
											},
											chordStyle : {
												opacity : 0.2
											}
										}
									}
								},
								force : {
									minRadius : 10,
									maxRadius : 20,
									itemStyle : {
										normal : {
											label : {
												show : false
											},
											linkStyle : {
												opacity : 3
											}
										}
									}
								}
							}
						},
						saveAsImage : {
							show : true
						}
					}
				},
				noDataEffect : 'none',
				series : [ {
					// FIXME No data
					type : 'force',
				} ],
			};

			option.series[0] = {
				type : 'force',
				name : 'webkit-dep',
				itemStyle : {
					normal : {
						linkStyle : {
							opacity : 3
						}
					}
				},
				categories : categories,
				nodes : nodes,
				links : links,
				minRadius : nodesizeMin,
				maxRadius : nodesizeMax,
				gravity : 1.1,
				scaling : 1.1,
				steps : 20,
				large : true,
				useWorker : true,
				coolDown : 0.995,
				ribbonType : false,
			};
			myChart.setOption(option);
		}
	});
}
/***************************************社区****************************/
var commData=null;
var topcount=5;//显示top5
var similaritycount=5;//显示跟种子集最相似的前5个节点
var categoriescount=5;//五种分类
//*****社区发现***********／
function CommunityDetection(){
	//切换界面至社区发现
	$("#grid_10").empty();
	var div_operateall="<div style='margin-left:10px; margin-top:10px' class='operate_all'>"
	+"种子集 <input class='txt_seedset' type='text' style='width:100px;height:18px'/>&nbsp&nbsp&nbsp"
	+"<button class='btn_conntction' style='width:80px;height:22px' type='button' onclick='getConnection()'>种子集处理</button>&nbsp&nbsp&nbsp"
	+"</div>";
	$("#grid_10").append(div_operateall);
	//var p_seedset="<p>种子集</p>";
	//$("#operate_all").append(p_seedset);
	
}
//寻找连通图
function getConnection(){
	var seedset=$(".txt_seedset").val();
	$.ajax({
		url :"../../Community/getConnection",
		data:{
			seedset:seedset
		},
		type : 'post',
		async: true,
		success : function(data){
			//添加连通图选择下拉列表，并将连通图加入到列表中 
			//创建select　
			var select_Conn="<select style='height:22px' id='select_Conn'></select>&nbsp&nbsp&nbsp";
			$(".btn_conntction").remove();
			$(".operate_all").append(select_Conn);
			//为select添加options
			var x=document.getElementById("select_Conn");
			for(var i=0;i<data["seedsets"].length;i++)
			{
				var value='';
				var j=0;
				for(j=0;j<data['seedsets'][i].length-1;j++)
				{
					value=value+data['seedsets'][i][j]+",";
				}
				value=value+data['seedsets'][i][j];
				var y=document.createElement('option');
				y.text=value;
				x.add(y,null);
			}
			//添加社区发现按钮
			var commDe_btn="<button class='btn_commdetc' style='width:80px;height:22px' type='button' onclick='CommDetection()'>社区识别</button>&nbsp&nbsp&nbsp"
			$(".operate_all").append(commDe_btn);
		}
	});
}
//社区发现功能
function CommDetection(){
	//alert($("#select_Conn").val());
	//alert($("#select_Conn").find("option:selected").text());
	$.ajax({
		url :"../../Community/getCommunity",
		data:{
			conntction:$("#select_Conn").val()
		},
		type : 'post',
		async: true,
		success : function(data){
			//添加三部分功能，三个按钮即可
			/*var result_div="<div style='width: 100%; height:40px; margin-top:10px; margin-left:10px' class='result_div'></div>";
			$("#grid_10").append(result_div);
			var basicinfo_btn="<button style='width: 180px; height:35px; margin-left:10px; background-color:#C0C0C0;' class='btn_getBasicInfo' type='button' onclick='getBasicInfo()'>社区信息</button>";
			var commanalysis_btn="<button style='width: 180px; height:35px; background-color:#C0C0C0;' class='btn_commanalysis' type='button' onclick='CommAnalysis()'>社区分析</button>";
			$(".result_div").append(basicinfo_btn);
			$(".result_div").append(commanalysis_btn);*/
			//默认显示基本信息
			commData=data;
			var maingraph_div="<div id='main' style='width: 100%;height:550px;margin-top:10px;'></div>";
			$("#grid_10").append(maingraph_div);
			getBasicInfo();
		}
	});
}
//显示信息及绘制社区图
function getBasicInfo()
{
	$("#main").empty();
	var basicgraph_div="<div id='comm_graph' style='width:700px; height:520px; float:left;'></div>"+
	                   "<div id='comm_info' style='width:300px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<p id='p_info'></p>"+
	                       "<p id='p_important_top5'></p>"+
	                       "<p id='p_similarity_top5'></p>"+
	                   "</div>";
	$("#main").append(basicgraph_div);
	//先为节点分类，一共三类，普通节点、重要节点、相似度高的节点
	var nodes=commData["nodes"];
	var topnodes=commData["top"];
	var similaritynodes=commData["similarity"];
	var seedset=$(".txt_seedset").val().split(",");//种子节点
	for(var i=0;i<nodes.length;i++){
		var flagtop=0;
		var flagsimi=0;
		for(var j=1;j<topcount+1&&j<topnodes.length;j++){
			if(nodes[i]["name"]===topnodes[j]["identifier"]){
				nodes[i]["category"]=1;
				flagtop=1;
				break;
			}				
		}
		for(var j=1;j<similaritycount+1&&j<similaritynodes.length;j++){
			if(nodes[i]["name"]===similaritynodes[j]["identifier"]){
				nodes[i]["category"]=2;
				flagsimi=1;
				break;
			}			
		}
		if(flagtop==0&&flagsimi==0)
		    nodes[i]["category"]=0;
		if(flagtop==1&&flagsimi==1)
			nodes[i]["category"]=3;
		for(var j=0;j<seedset.length;j++){
			if(nodes[i]["name"]===seedset[j]){
				nodes[i]["category"]=4;
				break;
			}
		}
	}
	var categories=new Array(categoriescount);
	categories[0]={
            "name": "普通节点",
            "keyword": {},
            "base": "普通节点"
        };
	categories[1]={
            "name": "重要节点",
            "keyword": {},
            "base": "重要节点"
        };
	categories[2]={
            "name": "与种子集最相似的节点",
            "keyword": {},
            "base": "与种子集最相似的节点"
        };
	categories[3]={
            "name": "既重要与种子集相似度也高",
            "keyword": {},
            "base": "既重要与种子集相似度也高"
        };
	categories[4]={
            "name": "种子节点",
            "keyword": {},
            "base": "种子节点"
        };	
	//绘图
	var myChart = echarts.init(document.getElementById('comm_graph'));
    option = {
		title : {
			text : '社区结构图',
			x : 'center',
			y : 'bottom'
		},
		 legend : {
		    data : ['普通节点', '重要节点', '与种子集最相似的节点','既重要与种子集相似度也高','种子节点'],
		    orient : 'vertical',
		    x : 'left'
		},
		tooltip : {
			trigger : 'item',
			formatter : "{b}"
		},
		backgroundColor:'#DCDCDC',
		toolbox : {
			show : true,
			feature : {
				restore : {
					show : true
				},
				magicType : {
					show : true,
					type : [ 'force', 'chord' ],
					option : {
						chord : {
							minRadius : 2,
							maxRadius : 10,
							ribbonType : false,
							itemStyle : {
								normal : {
									label : {
										show : true,
										rotate : true
									},
									chordStyle : {
										opacity : 0.2
									}
								}
							}
						},
						force : {
							minRadius : 10,
							maxRadius : 20,
							itemStyle : {
								normal : {
									label : {
										show : false
									},
									linkStyle : {
										opacity : 3
									}
								}
							}
						}
					}
				},
				saveAsImage : {
					show : true
				}
			}
		},
		noDataEffect : 'none',
		series : [ {
			// FIXME No data
			type : 'force',
		} ],
	};

	option.series[0] = {
		type : 'force',
		name : 'webkit-dep',
		itemStyle : {
			normal : {
				linkStyle : {
					opacity : 3
				}
			}
		},
		categories : categories,
		nodes : nodes,
		links : commData.links,
		minRadius : 3,
		maxRadius : 10,
		gravity : 1.1,
		scaling : 1.1,
		steps : 20,
		large : true,
		useWorker : true,
		coolDown : 0.995,
		ribbonType : false,
	};
	myChart.setOption(option);
	//显示社区信息
	//社区尺寸
	$("#p_info").html("社区尺寸:&nbsp"+commData['size']);
	//重要的前5个节点
	var im_top5="<p>重要节点top5:</p>";
	for(var i=1;i<topcount+1&&i<commData["top"].length;i++){
		im_top5=im_top5+"<p style='margin-left:60px'>"+commData["top"][i]["identifier"]+"("+commData["top"][i]["rank"]+")"+"</p>";
	}
	$("#p_important_top5").html(im_top5);
	//相似度最高的5个节点
	var si_top5="<p>与种子集相似度top5:</p>";
	for(var i=1;i<similaritycount+1&&i<commData["similarity"].length;i++){
		si_top5=si_top5+"<p style='margin-left:60px'>"+commData["similarity"][i]["identifier"]+"("+commData["similarity"][i]["rank"]+")"+"</p>";
	}
	$("#p_similarity_top5").html(si_top5);
}
//**********种子集分析****************//
var before=new Array();
var after=new Array();
var seedsets=new Array();
function SeedsetAnalyse()
{
	//前端元素添加
	$("#grid_10").empty();
	//var shuoming_div="<p style='style='margin-top:5px' id='p_shuoming'>说明：种子节点的度对社区识别结果的影响</p>";
	//$("#grid_10").append(shuoming_div);
	var seedset_div="<div id='seedset_para' style='width:400px; height:520px; float:left;'></div>"+
                    "<div id='seedset_graph' style='width:600px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'></div>";
	$("#grid_10").append(seedset_div);
	//左边参数区
	var seedset_left_div="<div style='margin-left:10px; margin-top:10px' id='operate_para'>"
		                     +"<div>"
		                         +"种子集 <input id='txt_seedset_1' style='width:100px;height:18px' type='text'/>&nbsp"
		                         +"<button id='btn_beforeseedset_1'style='width:60px;height:22px' type='button' onclick='Comm_beforeseedset(this.id)'>未处理</button>&nbsp"
		                         +"<button id='btn_afterseedset_1' style='width:60px;height:22px' type='button' onclick='Comm_afterseedset(this.id)'>处理</button>&nbsp"
		                     +"</div>"
		                 +"</div>"
		                 +"<div id='operate_button'>"
		                     +"<p id='add' style='margin-left:10px' onclick='add_operate()'>+</p>"
		                     +"<button id='btn_compare' style='margin-left:100px;width:100px;height:22px' type='button' onclick='SeedsetAnalyse_Draw_compare()'>对比</button>"
		                 +"</div>";
	$("#seedset_para").append(seedset_left_div);
}
//未处理种子集之前进行社区识别
function Comm_beforeseedset(btn_id)
{
	var strs= new Array();
	strs=btn_id.split("_");
	var index=strs[strs.length-1];
	//var seedset=
	$.ajax({
		url :"../../Community/getCommunityBefore",
		data:{
			seedset:$("#txt_seedset_"+String(index)).val()
		},
		type : 'post',
		async: true,
		success : function(data){
			var index_before=before.length;
			for(var i=0;i<data["result"].length;i++)
			{
				before[i+index_before]=data["result"][i]["f1"];
				seedsets[i+index_before]=data["result"][i]["seedset"];
			}
			
			/*commData=data;
			var maingraph_div="<div id='main' style='width: 100%;height:550px;margin-top:10px;'></div>";
			$("#grid_10").append(maingraph_div);
			getBasicInfo();*/
		}
	});
}
//处理种子集之后进行社区识别
function Comm_afterseedset(btn_id)
{
	var strs= new Array();
	strs=btn_id.split("_");
	var index=strs[strs.length-1];
	$.ajax({
		url :"../../Community/getCommunityAfter",
		data:{
			seedset:$("#txt_seedset_"+String(index)).val()
		},
		type : 'post',
		async: true,
		success : function(data){
			var index_after=after.length;
			for(var i=0;i<data["result"].length;i++)
			{
				after[i+index_after]=data["result"][i]["f1"];
			}
		}
	});
}
function add_operate()
{
	var count=$('#operate_para').find('div').length+1;
	var txt_id='txt_seedset_'+String(count);
	var before_id='btn_beforeseedset_'+String(count);
	var after_id='btn_afterseedset_'+String(count);
	var seedset_para_div="<div>"
                              +"种子集 <input id=add_id style='width:100px;height:18px' type='text'/>&nbsp"
                              +"<button id=before_id style='width:60px;height:22px' type='button' onclick='Comm_beforeseedset(this.id)'>未处理</button>&nbsp"
                              +"<button id=after_id style='width:60px;height:22px' type='button' onclick='Comm_afterseedset(this.id)'>处理</button>&nbsp";
                         +"</div>";
	$("#operate_para").append(seedset_para_div);
    $("#add_id").attr("id",txt_id);
    $("#before_id").attr("id",before_id);
    $("#after_id").attr("id",after_id);
}
//绘制对比图
function SeedsetAnalyse_Draw_compare()
{
//	var xdata=new Array();
//	for(var i=0;i<Math.max(before.length,after.length);i++)
//		xdata[i]=String(i+1);
	var myChart = echarts.init(document.getElementById('seedset_graph'));
	option = {
		title : {
			text : '种子集处理前后结果对比'
			//subtext : '纯属虚构'
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '种子集不处理', '种子集处理' ]
		},
		backgroundColor:'#DCDCDC',
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		calculable : true,
		xAxis : [ {
			type : 'category',
			boundaryGap : false,
			data : seedsets
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [ {
			name : '种子集不处理',
			type : 'line',
			data : before,
		}, {
			name : '种子集处理',
			type : 'line',
			data : after,
		} ]
	};
	myChart.setOption(option);
}
//即时通信特性分析，加跳数，跳数可以自己设定/////////////////////////
var result_tiaoshu=new Array();
var count=0;
function TiaoshuAnalyse()
{
	$("#grid_10").empty();
	var seedset_div="<div id='seedset_para' style='width:400px; height:520px; float:left;'></div>"+
    "<div id='seedset_graph' style='width:600px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'></div>";
	var tiaoshu_div="<div style='margin-top:5px;margin-left:10px;' id='div_tiaoshu'>"+
	                    "跳数选择:&nbsp<input id=txt_tiaoshu_start style='width:30px;height:18px' type='text'/>&nbsp到&nbsp<input id=txt_tiaoshu_end style='width:30px;height:18px' type='text'/>"+
	                "</div>"+
	                "<div id='tiaoshu_left' style='width:400px; height:520px; float:left;'>" +
	                    "<div id='tiaoshu_seeds'>"+
	                    	"<div style='margin-left:10px;margin-top:10px;'>"+
	                    		"种子集 <input id='txt_seedset_1' style='width:100px;height:18px' type='text'/>&nbsp"+
	                    		"<button id='btn_commdete_1' style='width:80px;height:22px' type='button' onclick='tiaoshu_commdete(this.id)'>社区识别</button>&nbsp"+
	                    	"</div>"+
	                    "</div>"+
	                    "<div id='operate_button'>"+
	                    	"<p id='add' style='margin-left:10px;' onclick='tiaoshu_add_operate()'>+</p>"+
	                    	"<button id='btn_compare' style='margin-left:100px;width:80px;height:22px' type='button' onclick='tiaoshuAnalyse_Draw_compare()'>对比</button>"+
	                    "</div>"+
	                "</div>"+
	                "<div id='tiaoshu_right' style='width:600px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'></div>";
	$("#grid_10").append(tiaoshu_div);
}
function tiaoshu_add_operate()
{
	var count=$('#tiaoshu_seeds').find('div').length+1;
	var txt_id='txt_seedset_'+String(count);
	var conndete_id='btn_commdete_'+String(count);
	var seedset_para_div="<div style='margin-left:10px;margin-top:5px;'>"
                              +"种子集 <input id=txt_id style='width:100px;height:18px' type='text'/>&nbsp"
                              +"<button id=conndete_id style='width:80px;height:22px' type='button' onclick='tiaoshu_commdete(this.id)'>社区识别</button>&nbsp"
                         +"</div>";
	$("#tiaoshu_seeds").append(seedset_para_div);
    $("#txt_id").attr("id",txt_id);
    $("#conndete_id").attr("id",conndete_id);
}
//获取跳数范围，分别对不同跳数下数据进行对比
function tiaoshu_commdete(btn_id)
{
	var strs= new Array();
	strs=btn_id.split("_");
	var index=strs[strs.length-1];
	var tiaoshu_start=$("#txt_tiaoshu_start").val();
	var tiaoshu_end=$("#txt_tiaoshu_end").val();
	var seedset=$("#txt_seedset_"+String(index)).val();
	$.ajax({
		url :"../../Community/getCommunityTiaoshu",
		data:{
			tiaoshu_start:tiaoshu_start,
			tiaoshu_end:tiaoshu_end,
			seedset:seedset
		},
		type : 'post',
		async: true,
		success : function(data){
			//如果是第一个种子集，需要新建数组
			if(result_tiaoshu.length==0)
			{
				for(var i=tiaoshu_start;i<=tiaoshu_end;i++)
				{	
					var result_tiaoshu_in = new Array();
					var f1 = 0;
					var num = 0;
					for (var j = 0; j < data[i].length; j++) {
						f1 = f1 + data[i][j]["f1"];
						num++;
					}
					f1 = f1/num;
					result_tiaoshu_in[0] = f1;
					result_tiaoshu[i-tiaoshu_start] = result_tiaoshu_in;
				}
				count++;
		    }
			//如果不是第一个可以直接赋值
			else
			{
				for(var i=tiaoshu_start;i<=tiaoshu_end;i++)
				{
					var f1 = 0;
					var num = 0;
					for (var j = 0; j < data[i].length; j++) {
						f1 = f1 + data[i][j]["f1"];
						num++;
					}
					f1 = f1/num;
					result_tiaoshu[i-tiaoshu_start][count]=f1;
				}
				count++;
			}
		}
	});
}
//绘制统计图,不同跳数的对比
function tiaoshuAnalyse_Draw_compare()
{
	var tiaoshu_start=$("#txt_tiaoshu_start").val();
	var tiaoshu_end=$("#txt_tiaoshu_end").val();
	var tiaoshu_data=new Array();
	var k=0;
	//图例数据
	for(var i=tiaoshu_start;i<=tiaoshu_end;i++)
	{
		tiaoshu_data[k]=i;
		k++;
	}
	// x轴数据
	var xdata=new Array();
	var num_seedset=$('#tiaoshu_seeds').find('div').length;
	for(var i=0;i<num_seedset;i++)
	{
		xdata[i]=$("#txt_seedset_"+String(i+1)).val();
	}
	var myChart = echarts.init(document.getElementById('tiaoshu_right'));
	option = {
		title : {
			text : '不同跳数结果对比'
			//subtext : '纯属虚构'
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : tiaoshu_data
		},
		backgroundColor:'#DCDCDC',
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		calculable : true,
		xAxis : [ {
			type : 'category',
			boundaryGap : false,
			data : xdata
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : addSeries(tiaoshu_start,tiaoshu_end)
	};	
	myChart.setOption(option);
}
function addSeries(tiaoshu_start,tiaoshu_end){
    var serie = [];
    for(var i = tiaoshu_start; i<=tiaoshu_end; i++){
        var item = {
            name:i,
            type: 'line',
            data: result_tiaoshu[i-tiaoshu_start]
        }
        serie.push(item );
    }
     return serie;
}
//结果对比//////////////////////////////////
//f1指标
var result_trad=0;
var result_impr=0;
var linkandcontent=0.5;
function ResultCompare()
{
	$("#grid_10").empty();
	var div_result_para="<div id='result_left' style='width:400px; height:520px; float:left;'>" +
	                        "<div style='margin-top:5px;margin-left:10px;'>"+
    		                   "随机生成种子集数目 <input id='txt_seedset_count' style='width:40px;height:18px' type='text'/>&nbsp"+
    		                "</div>"+
    		                "<div style='margin-top:5px;margin-left:10px;'>"+
		                        "种子集大小范围 <input id='txt_seedset_small'style='width:20px;height:18px' type='text'/>&nbsp到&nbsp<input id='txt_seedset_big' style='width:20px;height:18px' type='text'/>"+
		                    "</div>"+
		                    "<div style='margin-top:5px;margin-left:10px;'>"+
		                        "<button id='btn_generate' style='margin-left:100px;width:80px;height:22px' type='button' onclick='generate_seedsets()'>生成</button>"+
	                        "</div>"+
	                        "<div id='div_randomseedsets'>"+
	                       //"<p id='p_randomseedsets'></p>"+
	                        "</div>"+
                       "</div>"+
                       "<div id='result_right' style='width:600px; height:520px; float:left; margin-left:15px; font-size:15px; color:blue'></div>";
	                        
	$("#grid_10").append(div_result_para);
}
//生成种子集
function generate_seedsets()
{
	$.ajax({
		url :"../../Community/getRandomSeedsets",
		data:{
			seedset_count:$("#txt_seedset_count").val(),
			seedset_small:$("#txt_seedset_small").val(),
			seedset_big:$("#txt_seedset_big").val()
		},
		type : 'post',
		async: true,
		success : function(data){
			if($("#div_randomseedsets").find('p').length!=0)
				$("#div_randomseedsets").empty();
			for(var i=0;i<data["random"].length;i++)
			{
				var content="[";
				for(var j=0;j<data["random"][i].length-1;j++)
				{
					content=content+data["random"][i][j]+",";
				}
				content=content+data["random"][i][data["random"][i].length-1]+"]";	
				var p_rseedset="<p style='margin-left:10px' id='randomseedset_p'></p>";
				$("#div_randomseedsets").append(p_rseedset);
				$("#randomseedset_p").attr("id","randomseedset_p_"+String(i));
				$("#randomseedset_p_"+String(i)).append(content);
			}
			//增加button的按钮
			if($("#div_randomseedsets").find('p').length!=0)
			{
				var btn_operate="<div id='operate_div'>"+
				                    "<button id='btn_traPageRank' style='margin-left:30px;width:100px;height:22px' type='button' onclick='comm_tranditional()'>传统PageRank</button>"+
				                    "<button id='btn_improvePageRank' style='margin-left:30px;width:80px;height:22px' type='button' onclick='comm_improved()'>我的算法</button>"+
				                    "<button id='btn_compare' style='margin-left:30px;width:80px;height:22px' type='button' onclick='algorithm_compare()'>对比</button>"+
				                "</div>";
				$("#div_randomseedsets").append(btn_operate);
			}
		}
	});
}
//传统pagerank算法
function comm_tranditional()
{
	//获取多个种子集
	var n=$("#div_randomseedsets").find('p').length;
	for(var i=0;i<n;i++)
	{
		var seedset=$("#randomseedset_p_"+String(i)).text();
		$.ajax({
			url :"../../Community/getCommunityTraditional",
			data:{
				seedset:seedset
			},
			type : 'post',
			async: false,
			success : function(data){
				var f1=0;
				for(var i=0;i<data["result"].length;i++)
					f1=f1+data["result"][i]["f1"];
				if(result_trad==0)
					result_trad=f1/data["result"].length;
				else
					result_trad=(f1/data["result"].length+result_trad)/2;
			}
		});
	}
}
//改进后的我的算法
function comm_improved()
{
	//获取多个种子集
	var n=$("#div_randomseedsets").find('p').length;
	for(var i=0;i<n;i++)
	{
		var seedset=$("#randomseedset_p_"+String(i)).text();
		$.ajax({
			url :"../../Community/getCommunityImproved",
			data:{
				seedset:seedset
			},
			type : 'post',
			async: false,
			success : function(data){
				var f1=0;
				for(var i=0;i<data["result"].length;i++)
					f1=f1+data["result"][i]["f1"];
				if(result_impr==0)
					result_impr=f1/data["result"].length;
				else
					result_impr=(f1/data["result"].length+result_impr)/2;
			}
		});
	}
}
//绘制对比表格
function algorithm_compare()
{
	var table_result="<table style='margin-top:30px;margin-left:30px' border='1'>"+
	                 "<tr>"+
	                     "<td>算法名称</td>"+
	                     "<td>F1指标</td>"+
	                 "</tr>"+
	                 "<tr>"+
                         "<td>传统PageRank算法</td>"+
                         "<td id='trad_td'></td>"+
                     "</tr>"+
                     "<tr>"+
                         "<td>基于结构和内容的算法</td>"+
                         "<td id='lac_td'></td>"+
                     "</tr>"+
                     "<tr>"+
                         "<td>我的算法</td>"+
                         "<td id='impr_td'></td>"+
                     "</tr>"+
	                 "</table>";
	$("#result_right").append(table_result);
	$("#trad_td").append(result_trad);
	$("#lac_td").append(linkandcontent);
	$("#impr_td").append(result_impr);
}