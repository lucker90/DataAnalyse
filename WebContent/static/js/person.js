/***************************************用户信息****************************/
//获取用户基本信息
function getUserBasicInfo(){
	$("#grid_10").empty();
	var div_searchinfo="<div id='searchinfo' style='margin-left:10px; margin-top:10px' >" +
	                       "节点id <input class='txt_id' type='text'/>&nbsp&nbsp&nbsp"+
	                       "<button id='btn_searchinfo' type='button' onclick='getUserInfo()'>查询</button>&nbsp&nbsp&nbsp"
			           "</div>"
    $("#grid_10").append(div_searchinfo);
}
/***************************************社交网络****************************/
//好友网络
function getFriendNetwork(){
	
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
	$.ajax({
		url :"../../Person/getInteract",
		data:{
			id:id,
			cengshu:cengshu
		},
		type : 'post',
		async: true,
		success : function(data){
			alert("success");
		}
	});
}
/***************************************社区****************************/
var commData=null;
var topcount=5;//显示top5
var similaritycount=5;//显示跟种子集最相似的前5个节点
var categoriescount=5;//五种分类
//社区发现
function CommunityDetection(){
	//切换界面至社区发现
	$("#grid_10").empty();
	var div_operateall="<div style='margin-left:10px; margin-top:10px' class='operate_all'>"
	+"种子集 <input class='txt_seedset' type='text'/>&nbsp&nbsp&nbsp"
	+"<button class='btn_conntction' type='button' onclick='getConnection()'>连通图</button>&nbsp&nbsp&nbsp"
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
			var select_Conn="<select id='select_Conn'></select>&nbsp&nbsp&nbsp";
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
			var commDe_btn="<button class='btn_commdetc' type='button' onclick='CommDetection()'>社区发现</button>&nbsp&nbsp&nbsp"
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
			var result_div="<div style='width: 100%; height:40px; margin-top:10px; margin-left:10px' class='result_div'></div>";
			$("#grid_10").append(result_div);
			var basicinfo_btn="<button style='width: 180px; height:35px; margin-left:10px; background-color:#C0C0C0;' class='btn_getBasicInfo' type='button' onclick='getBasicInfo()'>社区信息</button>";
			//var drawGraph_btn="<button class='btn_DrawGraph' type='button' onclick='DrawGraph()'>绘制社区</button>";
			var commanalysis_btn="<button style='width: 180px; height:35px; background-color:#C0C0C0;' class='btn_commanalysis' type='button' onclick='CommAnalysis()'>社区分析</button>";
			$(".result_div").append(basicinfo_btn);
			//$(".result_div").append(drawGraph_btn);
			$(".result_div").append(commanalysis_btn);
			//默认显示基本信息
			commData=data;
			var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
			$("#grid_10").append(maingraph_div);
			getBasicInfo();
		}
	});
}
//显示信息及绘制社区图
function getBasicInfo()
{
	$("#main").empty();
	var basicgraph_div="<div id='comm_graph' style='width:700px; height:480px; float:left;'></div>"+
	                   "<div id='comm_info' style='width:300px; height:480px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
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
//社区结果分析////////////////////
function CommAnalysis()
{
	$("#main").empty();
	
}