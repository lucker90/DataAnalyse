var message;//搜索的消息
var messagesNodes;//节点集合
var messageLinks;//边集合
var nodesizeMin=3;//图节点尺寸最小值
var nodesizeMax=10;//图节点尺寸最大值
var news_starttime;//消息产生时间
var news_endtime;//消息消亡时间
var time_list;//时间序列
$(document).ready(function () {
	Search();
});
/***************************************消息传播图*******************************/
var categoriescount=1;
function Search(){
	//清楚页面内容
	$("#grid_10").empty();
	var div_operateall="<div style='background:white; width: 100%; height:560px' class='operate_all'>"+
	                       "<div style='margin:auto; height=100px; position: absolute; left:400px; top:400px;'>"+
	                           "<input  size='30' style='width:200px; height=80px;'class='txt_search' type='text'/>&nbsp&nbsp&nbsp"+
	                           "<button class='btn_search' type='button' onclick='doSearch()'>搜索</button>"+
	                       "</div>"+
	                   "</div>";
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
			time_list=data["timelist"];
//			//添加html元素
//			drawMessage_addhtml();
//			//绘制消息传播图
//			drawMessage();
			add_drwaMessage();
		}
	});
}
function add_drwaMessage()
{
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	else{
		//添加html元素
		drawMessage_addhtml();
		//绘制消息传播图
		drawMessage();
	}
}
//添加页面布局
function drawMessage_addhtml(){
	
	//$("#main").remove();
	//清除页面内容
	$("#grid_10").empty();
	var div_drawinfo="<div id='messinfo' style='margin-left:10px; margin-top:10px' >" +
                         "<p id='p_messinfo'></p>"+
                     "</div>"+
                     "<div id='messpara' style='margin-left:10px; margin-top:10px' >" +
                         "节点大小 <input style='width:25px' id='txt_nodemin' type='text'/>&nbsp<input style='width:25px' id='txt_nodemax' type='text'>&nbsp&nbsp"+
                         "<button id='btn_drawmess' type='button' onclick='drawMessage()'>重新绘图</button>&nbsp&nbsp&nbsp"
                     "</div>"
    $("#grid_10").append(div_drawinfo);
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
}
//绘制某个消息的传播图
function drawMessage(){
	
//	if(nodesizeMin==null||nodesizeMin==''||isNaN(nodesizeMin))
//		nodesizeMin=3;
//	if(nodesizeMax==null||nodesizeMax==''||isNaN(nodesizeMax))
//		nodesizeMax=10;
	if($("#txt_nodemin").val()!="")
	    nodesizeMin=Number($("#txt_nodemin").val());
	if($("#txt_nodemax").val()!="")
	    nodesizeMax=Number($("#txt_nodemax").val());
	
	var categories=new Array(categoriescount);
	categories[0]={
            "name": "普通节点",
            "keyword": {},
            "base": "普通节点"
        };
	
	//绘图
	var myChart = echarts.init(document.getElementById('comm_graph'));
    option = {
		title : {
			text : '消息传播图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : ['普通节点'],
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
	$("#p_news_starttime").html("消息产生时间："+news_starttime.substr(0,16));
	$("#p_news_endtime").html("消息消亡时间："+news_endtime.substr(0,16));
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
		var div_lineGraph="<div id='div_operate' style='margin-left:10px; margin-top:10px'>"+
		                      "<p id='p_timerange'></p>"+//显示消息时间范围
		                      "时间范围:<input id='start_time' class='laydate-icon' onclick='set_start()'>&nbsp<input id='end_time' class='laydate-icon' onclick='set_end()'>&nbsp&nbsp&nbsp&nbsp"+
		                      "按&nbsp<select id='time_interval'><option value ='年'>年</option><option value ='月'>月</option><option value='日'>日</option><option value='时'>时</option></select>&nbsp分割&nbsp&nbsp&nbsp&nbsp&nbsp"+
		                      "<button id='btn_drawLineGraph' type='button' onclick='doDrawLineGraph()'>绘制折线图</button>"+
						  "</div>";
		$("#grid_10").append(div_lineGraph);
		$("#p_timerange").html("消息时间范围："+news_starttime.substr(0,16)+"~"+news_endtime.substr(0,16));
	}	
}
//时间点击控件格式设置
function set_start(){
	laydate({
		  elem: '#start_time',
		  format: 'YYYY-MM-DD hh:mm', // 分隔符可以任意定义，该例子表示只显示年月
		  festival: true, //显示节日
		  istime: true,
//		  choose: function(datas){ //选择日期完毕的回调
//		    alert('得到：'+datas);
//		  }
		});
}
function set_end(){
	laydate({
		  elem: '#end_time',
		  format: 'YYYY-MM-DD hh:mm', // 分隔符可以任意定义，该例子表示只显示年月
		  festival: true, //显示节日
		  istime: true,
//		  choose: function(datas){ //选择日期完毕的回调
//		    alert('得到：'+datas);
//		  }
		});
}
//执行绘制折线图
function doDrawLineGraph(){
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'>"+
                          "<div id='comm_graph' style='width:700px; height:480px; float:left;'></div>"+
	                      "<div id='comm_info' style='width:300px; height:480px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
//	                           "<p id='p_usercount'>haha</p>"+
//	                           "<p id='p_news_starttime'></p>"+
//	                           "<p id='p_news_endtime'></p>"+ 
	                       "</div>"+
	                   "</div>";
	$("#grid_10").append(maingraph_div);
	//对数据进行处理，看是按照年月日统计
	var time_inter=$("#time_interval").val();
	var start_time=$("#start_time").val();
	var end_time=$("#end_time").val();
	
	
	
	
	var myChart = echarts.init(document.getElementById('comm_graph'));
	option = {
		title : {
			text : '未来一周气温变化',
			subtext : '纯属虚构'
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '最高气温', '最低气温' ]
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
			data : [ '周一', '周二', '周三', '周四', '周五', '周六', '周日' ]
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value} °C'
			}
		} ],
		series : [ {
			name : '最高气温',
			type : 'line',
			data : [ 11, 11, 15, 13, 12, 13, 10 ],
			markPoint : {
				data : [ {
					type : 'max',
					name : '最大值'
				}, {
					type : 'min',
					name : '最小值'
				} ]
			},
			markLine : {
				data : [ {
					type : 'average',
					name : '平均值'
				} ]
			}
		}, {
			name : '最低气温',
			type : 'line',
			data : [ 1, -2, 2, 5, 3, 2, 0 ],
			markPoint : {
				data : [ {
					name : '周最低',
					value : -2,
					xAxis : 1,
					yAxis : -1.5
				} ]
			},
			markLine : {
				data : [ {
					type : 'average',
					name : '平均值'
				} ]
			}
		} ]
	};
	myChart.setOption(option);
		                    
}
