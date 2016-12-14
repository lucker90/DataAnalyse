var message;//搜索的消息
var messagesNodes;//节点集合
var messageLinks;//边集合
var nodesizeMin=3;//图节点尺寸最小值
var nodesizeMax=10;//图节点尺寸最大值
var news_starttime;//消息产生时间
var news_endtime;//消息消亡时间
$(document).ready(function () {
	Search();
});
/***************************************消息传播图*******************************/
function Search(){
	//清楚页面内容
	$("#grid_10").empty();
	var div_operateall="<div style='background:white; width: 100%; height:560px' class='operate_all'>"
	+"<div style='margin:auto; height=100px; position: absolute; left:400px; top:400px;'>"
	+"<input  size='30' style='width:200px; height=80px;'class='txt_search' type='text'/>&nbsp&nbsp&nbsp"
	+"<button class='btn_search' type='button' onclick='doSearch()'>搜索</button>"
	+"</div>";
	+"</div>";
	$("#grid_10").append(div_operateall);
	//alert("success");
}
//搜索
function doSearch(){
	var txtsearch=$(".txt_search").val();
	message=txtsearch;//设定搜索的消息内容
	//alert(txtsearch);
	$.ajax({
		url :"../../Message/GetMessageByKeyWord",
		data:{
			keyword:txtsearch
		},
		type : 'post',
		async: true,
		success : function(data){
			$("#grid_10").empty();//清空
			messagesNodes=data["nodes"];
			messagesLinks=data["links"];
			news_starttime=data["starttime"];
			news_endtime=data["endtime"];
			//消息内容显示和图参数选择
			var div_drawinfo="<div id='messinfo' style='margin-left:10px; margin-top:10px' >" +
		                         "<p id='p_messinfo'></p>"+
		                     "</div>"+
		                     "<div id='messpara' style='margin-left:10px; margin-top:10px' >" +
		                         "节点大小 <input style='width:25px' id='txt_nodemin' type='text'/>&nbsp<input style='width:25px' id='txt_nodemax' type='text'>&nbsp&nbsp"+
		                         "<button id='btn_drawmess' type='button' onclick='drawMessage()'>重新绘图</button>&nbsp&nbsp&nbsp"
		                     "</div>"
		    $("#grid_10").append(div_drawinfo);
			drawMessage();
		}
	});
}
//绘制某个消息的传播图
function drawMessage(){
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	$("#main").remove();
	//主要图显示区域，包括图和图信息
    var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
    $("#grid_10").append(maingraph_div);
	var basicgraph_div="<div id='comm_graph' style='width:700px; height:480px; float:left;'></div>"+
	                   "<div id='comm_info' style='width:300px; height:480px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<p id='p_usercount'></p>"+
	                       "<p id='p_news_starttime'></p>"+
	                       "<p id='p_news_endtime'></p>"+
//	                       "爆发时间范围：超过<input style='width:25px' id='txt_baofa_cond' type='text'/>条/<input style='width:25px' id='txt_baofa_danwei' type='text'/>&nbsp&nbsp<button id='btn_baofa' type='button' onclick='search_baofa()'>查询</button>"+
//	                       "<p id='p_baofatime'></p>"+  
	                   "</div>";
	$("#main").append(basicgraph_div);
	$("#p_messinfo").html("消息内容："+message);
	if($("#txt_nodemin").val()!="")
	    nodesizeMin=Number($("#txt_nodemin").val());
	if($("#txt_nodemax").val()!="")
	    nodesizeMax=Number($("#txt_nodemax").val());
	//绘图
	var myChart = echarts.init(document.getElementById('comm_graph'));
    option = {
		title : {
			text : '消息传播图',
			x : 'center',
			y : 'bottom'
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
		//categories : commData.categories,
		nodes : messagesNodes,
		links : messagesLinks,
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
	$("#p_usercount").html("参与用户数："+messagesNodes.length);
	$("#p_news_starttime").html("消息产生时间："+news_starttime);
	$("#p_news_endtime").html("消息消亡时间："+news_endtime);
}
//查询爆发时间，以天为单位
//function search_baofa(){
//	
//}
/***************************************分解图*******************************/
/***************************************消息统计*******************************/
function drawLineGraph(){
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	else{
		//清除页面内容
		$("#grid_10").empty();
		var div_lineGraph="<div id='div_operate'>"+
		                      "<p id='p_timerange'></p>"+//显示消息时间范围
						  "</div>";
		$("#grid_10").append(div_lineGraph);
		$("#p_timerange").html("消息时间范围："+news_starttime+"~"+news_endtime);
	}
	
}
