var message;//搜索的消息
var messagesNodes;//节点集合
var messageLinks;//边集合
var nodesizeMin=3;//图节点尺寸最小值
var nodesizeMax=10;//图节点尺寸最大值
var news_starttime;//消息产生时间
var news_endtime;//消息消亡时间
var time_list;//时间序列
var messages;//整个消息信息
$(document).ready(function () {
	Search();
});
/***************************************消息传播图*******************************/
var categoriescount=1;
function Search(){
	//清楚页面内容
	$("#grid_10").empty();
	var div_operateall="<div style='background:white; width: 100%; height:560px' class='operate_all'>"+
	                       "<div style='margin:auto; height=150px; position: absolute; left:400px; top:400px;'>"+
	                           "<input  size='30' style='width:200px; height=120px;'class='txt_search' type='text'/>&nbsp&nbsp&nbsp"+
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
			messages=data["messages"];
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
/////按照时间分解
var timefenjie_current=0;
var timefenjie_messages=new Array();
var timefenjie_nodes=new Array();
var timefenjie_links=new Array();
var timefenjie_categories=new Array();
var timefenjie_legenddata=new Array();
//还原需要的参数
var timefenjie_huanyuan_nodes=new Array();
var timefenjie_huanyuan_links=new Array();
var timefenjie_huanyuan_categories=new Array();
var timefenjie_huanyuan_legenddata=new Array();

/*var tiaoshu=1;//默认按照1跳进行分割
var tiaoshufenjie_messagesqian=new Array();
var tiaoshufenjie_messageshou=new Array();
var tiaoshufenjie_messagesindex=0;
var tiaoshufenjie_nodes=new Array();
var tiaoshufenjie_links=new Array();
var tiaoshufenjie_categories=new Array();
var tiaoshufenjie_legenddata=new Array();
//还原需要的参数
var tiaofenjie_huanyuan_messages=new Array();
var tiaoshufenjie_huanyuan_nodes=new Array();
var tiaoshufenjie_huanyuan_links=new Array();
var tiaoshufenjie_huanyuan_categories=new Array();
var tiaoshufenjie_huanyuan_legenddata=new Array();*/
function fenjie_time(){
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	else{
		//清除页面内容
		$("#grid_10").empty();
		var div_drawinfo="<div id='messinfo' style='margin-left:10px; margin-top:10px' >" +
                             "<p id='p_messinfo'></p><p id='p_timerange'></p>"+
                         "</div>"+
                         "<div id='div_messfennjie' style='margin-left:10px; margin-top:10px' >" +
                             "按 <input style='width:25px' id='txt_number' type='text'/>&nbsp<select id='time_interval'><option value ='年'>年</option><option value ='月'>月</option><option value='日'>日</option><option value='时'>时</option></select>&nbsp分割&nbsp&nbsp&nbsp&nbsp&nbsp"+
                             "<button id='btn_drawmess' type='button' onclick='draw_timefenjie()'>分解</button>&nbsp&nbsp&nbsp"
                         "</div>"
        $("#grid_10").append(div_drawinfo);
		$("#p_messinfo").html("消息内容："+message);
		$("#p_timerange").html("时间范围："+news_starttime.substr(0,16)+"--"+news_endtime.substr(0,16));
	}
}
function draw_timefenjie(){
	//初始化其他参数，将其归零
	timefenjie_messages=new Array();
	timefenjie_current=0;
	timefenjie_nodes=new Array();
	timefenjie_links=new Array();
	timefenjie_categories=new Array();
	timefenjie_legenddata=new Array();
	
	timefenjie_huanyuan_messages=new Array();
	timefenjie_huanyuan_nodes=new Array();
	timefenjie_huanyuan_links=new Array();
	timefenjie_huanyuan_categories=new Array();
	timefenjie_huanyuan_legenddata=new Array();
	$("#main").remove();
	
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
    $("#grid_10").append(maingraph_div);
	var basicgraph_div="<div id='timefenjie_graph' style='width:700px; height:460px; float:left;'></div>"+
	                   "<div id='timefenjie_button' style='width:300px; height:460px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<button id='timefenjie_next' type='button' onclick='timefenjie_next()'>下一步</button>&nbsp&nbsp&nbsp" +
	                       "<button id='timefenjie_huanyuan' type='button' onclick='timefenjie_huanyuan()'>还原</button>&nbsp&nbsp&nbsp" +
	                   "</div>";
	$("#main").append(basicgraph_div);
	//除了添加按钮之类，初始化显示的为第一步
	timefenjie_next();
}
function timefenjie_next(){
	var timefenjie_start=timeadd(news_starttime,timefenjie_current*$("#txt_number").val(),$("#time_interval").val());//当前需要加入的起始时间
	timefenjie_current++;//当前步数加1
	var timefenjie_end=timeadd(news_starttime,timefenjie_current*$("#txt_number").val(),$("#time_interval").val());//当前需要加入的终止时间
	//如果timefenjie_start还要还要大于news_endtime,则终止，终止的方式是删除下一步按钮
	var endDate=new Date(news_endtime.replace(/-/g,"/"));
	//遍历messages，如果时间在范围内则显示，不在则不显示
	for(var i=0;i<messages.length;i++)
	{
		var messageDate=new Date(messages[i]["time"].substr(0,16).replace(/-/g,"/"));
		if(messageDate.getTime() >= timefenjie_start.getTime()&&messageDate.getTime() <= timefenjie_end.getTime())
		{
		    //先看之前的消息中有没有，有的话则权值+1，否则新生成一个message对象
			var flag=0;
			var j=0;
			for(j=0;j<timefenjie_messages.length;j++)
			{
				if(String(messages[i]["senderid"])===timefenjie_messages[j].source&&String(messages[i]["recipientid"])===timefenjie_messages[j].target)
				{
					flag=1;
					break;
				}
				if(String(messages[i]["senderid"])===timefenjie_messages[j].target&&String(messages[i]["recipientid"])===timefenjie_messages[j].source)
				{
					flag=1;
					break;
				}
			}
			if(flag==1)
			{
				timefenjie_messages[j].weight=timefenjie_messages[j].weight+1;
			}
			else{
				var message=new Object();
			    message.source=String(messages[i]["senderid"]);
			    message.target=String(messages[i]["recipientid"]);
			    message.weight=1;
			    timefenjie_messages[timefenjie_messages.length]=message;
			}		
		}	
	}
	//清除图像并绘制新的图像
	//var timefenjie_nodes=new Array();
	//var timefenjie_links=new Array();
	for(var i=0;i<timefenjie_messages.length;i++){
		var flagstart=0;
		var flagend=0;
		var indexstart=0;
		var indexend=0;
		var j=0;
		for(j=0;j<timefenjie_nodes.length;j++){
			if(timefenjie_nodes[j].name===timefenjie_messages[i].source){
				flagstart=1;
				indexstart=j;
				//break;
			}
			if(timefenjie_nodes[j].name===timefenjie_messages[i].target){
				flagend=1;
				indexend=j;
				//break;
			}
		}
		if(flagstart==1){
//			timefenjie_nodes[indexstart].size=timefenjie_nodes[indexstart].size+timefenjie_messages[i].weight;	
//			timefenjie_nodes[indexstart].value=timefenjie_nodes[indexstart].value+timefenjie_messages[i].weight;
			timefenjie_nodes[indexstart].size=timefenjie_nodes[indexstart].size+1;	
			timefenjie_nodes[indexstart].value=timefenjie_nodes[indexstart].value+1;
		}
		if(flagend==1){
//			timefenjie_nodes[indexend].size=timefenjie_nodes[indexend].size+timefenjie_messages[i].weight;
//			timefenjie_nodes[indexend].value=timefenjie_nodes[indexend].value+timefenjie_messages[i].weight;
			timefenjie_nodes[indexend].size=timefenjie_nodes[indexend].size+1;
			timefenjie_nodes[indexend].value=timefenjie_nodes[indexend].value+1;
		}
		if(flagstart==0){
			var node=new Object();
			node.name=timefenjie_messages[i].source;
//			node.size=timefenjie_messages[i].weight;
//			node.value=timefenjie_messages[i].weight;
			node.size=1;
			node.value=1;
			node.category=timefenjie_current-1;
			timefenjie_nodes[timefenjie_nodes.length]=node;
		}
		if(flagend==0){
			var node=new Object();
			node.name=timefenjie_messages[i].target;
//			node.size=timefenjie_messages[i].weight;
//			node.value=timefenjie_messages[i].weight;
			node.size=1;
			node.value=1;
			node.category=timefenjie_current-1;
			timefenjie_nodes[timefenjie_nodes.length]=node;
		}
	}
	timefenjie_links=timefenjie_messages;
	timefenjie_categories[timefenjie_categories.length]={
            "name": "第"+(timefenjie_current-1)+"步",
            "keyword": {},
            "base": "第"+(timefenjie_current-1)+"步"
        };
	timefenjie_legenddata[timefenjie_legenddata.length]="第"+(timefenjie_current-1)+"步";
	//记录下第0跳的情况，用于还原
	if(timefenjie_current==1){
		timefenjie_huanyuan_nodes=new Array();
		timefenjie_huanyuan_links=new Array();
		timefenjie_huanyuan_categories=new Array();
		timefenjie_huanyuan_legenddata=new Array();
		for(var i=0;i<timefenjie_nodes.length;i++){
			var node=new Object();
			node.name=timefenjie_nodes[i].name;
			node.size=timefenjie_nodes[i].size;
			node.value=timefenjie_nodes[i].value;
			node.category=timefenjie_nodes[i].category
			timefenjie_huanyuan_nodes[i]=node;
		}	
		for(var i=0;i<timefenjie_links.length;i++){
			var message=new Object();
		    message.source=timefenjie_links[i].source;
		    message.target=timefenjie_links[i].target;
		    message.weight=timefenjie_links[i].weight;
		    timefenjie_huanyuan_links[i]=message;
		}	
		for(var i=0;i<timefenjie_categories.length;i++)
			timefenjie_huanyuan_categories[i]=timefenjie_categories[i];
		for(var i=0;i<timefenjie_legenddata.length;i++)
			timefenjie_huanyuan_legenddata[i]=timefenjie_legenddata[i];
		for(var i=0;i<timefenjie_messages.length;i++)
			timefenjie_huanyuan_messages[i]=timefenjie_messages[i];
	}
	var myChart = echarts.init(document.getElementById('timefenjie_graph'));
    option = {
		title : {
			text : '消息传播时间分解图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : timefenjie_legenddata,
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
		categories : timefenjie_categories,
		nodes : timefenjie_nodes,
		links : timefenjie_links,
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
	if(timefenjie_end.getTime()>endDate.getTime())
	{
		//alert("已经是最后一跳！");
		$("#timefenjie_next").hide();
		return;
	}
}
//时间相加，起始时间、终止时间、间隔、单位
function timeadd(start,interval,danwei){
	var startdate=new Date();
	if(start instanceof Date){
		startdate.setFullYear(start.getFullYear());
		startdate.setMonth(start.getMonth());
		startdate.setDate(start.getDate());
		startdate.setHours(start.getHours());
		startdate.setMinutes(start.getMinutes());
		//startdate=new Date(start.getFullYear()+"/"+start.getMonth()+"/"+start.getDate()+" "+start.getHours()+":"+start.getMinutes());
	}
	else
	    startdate = new Date(start.replace(/-/g,"/"));
	//var enddate = new Date(end.replace(/-/g,"/"));
	switch(danwei) 
	{
	    case   "年"   :   {  
	    	startdate.setFullYear(startdate.getFullYear()+interval);  
	    	return   startdate;  
	    	break;  
	    } 
	    case   "月"   :   {  
	    	startdate.setMonth(startdate.getMonth()+interval);  
            return   startdate;  
            break;  
	    }  
	    case   "日"   :   {  
	    	startdate.setDate(startdate.getDate()+interval);  
            return   startdate;  
            break;  
	    }
	    case   "时"   :   {  
	    	startdate.setHours(startdate.getHours()+interval);  
            return   startdate;  
            break;  
	    }
	    default   :   {    
            return   startdate;  
            break;  
	    }  
	}
}
//还原为第一跳的时候
function timefenjie_huanyuan(){
	var myChart = echarts.init(document.getElementById('timefenjie_graph'));
    option = {
		title : {
			text : '消息传播时间分解图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : timefenjie_huanyuan_legenddata,
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
		categories : timefenjie_huanyuan_categories,
		nodes : timefenjie_huanyuan_nodes,
		links : timefenjie_huanyuan_links,
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
	//将当前的跳数设置为第一跳还原后的情况
	timefenjie_current=1;
	timefenjie_messages=new Array();
	timefenjie_nodes=new Array();
	timefenjie_links=new Array();
	timefenjie_categories=new Array();
	timefenjie_legenddata=new Array();
	for(var i=0;i<timefenjie_huanyuan_nodes.length;i++)
		timefenjie_nodes[i]=timefenjie_huanyuan_nodes[i];
	for(var i=0;i<timefenjie_huanyuan_links.length;i++)
		timefenjie_links[i]=timefenjie_huanyuan_links[i];
	for(var i=0;i<timefenjie_huanyuan_categories.length;i++)
		timefenjie_categories[i]=timefenjie_huanyuan_categories[i];
	for(var i=0;i<timefenjie_huanyuan_legenddata.length;i++)
		timefenjie_legenddata[i]=timefenjie_huanyuan_legenddata[i];
	for(var i=0;i<timefenjie_huanyuan_messages.length;i++)
		timefenjie_messages[i]=timefenjie_huanyuan_messages[i];
	//显示下一跳的按钮
	$("#timefenjie_next").show();
	
}
/////按照跳数分解
var tiaoshufenjie_current=0;
var tiaoshufenjie_flagArray=new Array();
var tiaoshufenjie_nodes=new Array();
var tiaoshufenjie_links=new Array();
var tiaoshufenjie_categories=new Array();
var tiaoshufenjie_legenddata=new Array();
var tiaoshufenjie_currentceng=new Array();
//还原参数
var tiaoshufenjie_huanyuan_flagArray=new Array();
var tiaoshufenjie_huanyuan_nodes=new Array();
var tiaoshufenjie_huanyuan_links=new Array();
var tiaoshufenjie_huanyuan_categories=new Array();
var tiaoshufenjie_huanyuan_legenddata=new Array();
var tiaoshufenjie_huanyuan_currentceng=new Array();
function fenjie_tiaoshu(){
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	else{
		//对flag数组进行初始化为0
		for(var i=0;i<messagesNodes.length;i++)
			tiaoshufenjie_flagArray[i]=0;
		for(var i=0;i<messagesNodes.length;i++)
			tiaoshufenjie_huanyuan_flagArray[i]=0;
		//清除页面内容
		$("#grid_10").empty();
		var div_drawinfo="<div id='messinfo' style='margin-left:10px; margin-top:10px' >" +
                             "<p id='p_messinfo'></p><p id='p_tiaoshurange'></p>"+
                         "</div>"+
                         "<div id='div_messfennjie' style='margin-left:10px; margin-top:10px' >" +
                             "按跳数分解分解 "+
                             "<button id='btn_drawmess' type='button' onclick='draw_tiaoshufenjie()'>分解</button>&nbsp&nbsp&nbsp"
                         "</div>"
        $("#grid_10").append(div_drawinfo);
	}
}
function draw_tiaoshufenjie(){
	tiaoshufenjie_current=0;
	tiaoshufenjie_nodes=[];
	tiaoshufenjie_links=[];
	tiaoshufenjie_categories=[];
	tiaoshufenjie_legenddata=[];
	tiaoshufenjie_currentceng=[];
	for(var i=0;i<messagesNodes.length;i++)
		tiaoshufenjie_flagArray[i]=0;
	
	tiaoshufenjie_huanyuan_nodes=[];
	tiaoshufenjie_huanyuan_links=[];
	tiaoshufenjie_huanyuan_categories=[];
	tiaoshufenjie_huanyuan_legenddata=[];
	tiaoshufenjie_huanyuan_currentceng=[];
	for(var i=0;i<messagesNodes.length;i++)
		tiaoshufenjie_huanyuan_flagArray[i]=0;
	$("#main").remove();
	var maingraph_div="<div id='main' style='width: 100%;height:600px;'></div>";
    $("#grid_10").append(maingraph_div);
	var basicgraph_div="<div id='tiaoshufenjie_graph' style='width:700px; height:500px; float:left;'></div>"+
	                   "<div id='tiaoshufenjie_button' style='width:300px; height:500px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<button id='tiaoshufenjie_next' type='button' onclick='tiaoshufenjie_next()'>下一步</button>&nbsp&nbsp&nbsp" +
	                       "<button id='tiaoshufenjie_huanyuan' type='button' onclick='tiaoshufenjie_huanyuan()'>还原</button>&nbsp&nbsp&nbsp" +
	                   "</div>";
	$("#main").append(basicgraph_div);
	if(	tiaoshufenjie_current==0){
		// 找时间最早的几个节点，第一步没有边
		tiaoshufenjie_current++;
		var time = messages[0].time;
		var nodeout = new Object;
		nodeout.name = String(messages[0].senderid);
		nodeout.size = 0;
		nodeout.value = 0;
		nodeout.category=tiaoshufenjie_current-1;
		tiaoshufenjie_nodes[tiaoshufenjie_nodes.length] = nodeout;
		tiaoshufenjie_currentceng[tiaoshufenjie_currentceng.length]=String(messages[0].senderid);
		tiaoshufenjie_flagArray[findIndex(messages[0].senderid)] = 1;
		for (var i = 0; i < messages.length; i++) {
			if (messages[i].time === time&& inArray(messages[i].senderid, tiaoshufenjie_nodes) == -1) {
				var node = new Object;
				node.name = String(messages[i].senderid);
				node.size = 0;
				node.value = 0;
				nodeout.category=tiaoshufenjie_current-1
				tiaoshufenjie_nodes[tiaoshufenjie_nodes.length] = node;
				//当前层节点加入
				tiaoshufenjie_currentceng[tiaoshufenjie_currentceng.length]=String(messages[i].senderid);
				// 将标记位设置成已加入
				tiaoshufenjie_flagArray[findIndex(messages[i].senderid)] = 1;
			}
			if (messages[i].time !== time)
				break;
		}
		tiaoshufenjie_categories[tiaoshufenjie_categories.length] = {
			"name" : "第" + (tiaoshufenjie_current - 1) + "步",
			"keyword" : {},
			"base" : "第" + (tiaoshufenjie_current - 1) + "步"
		};
		tiaoshufenjie_legenddata[tiaoshufenjie_legenddata.length] = "第"
				+ (tiaoshufenjie_current - 1) + "步";
		drawGraph();// 绘图
		// 对还原的变量进行记录
		tiaoshufenjie_huanyuan_nodes = [];
		tiaoshufenjie_huanyuan_links = [];
		tiaoshufenjie_huanyuan_categories = [];
		tiaoshufenjie_huanyuan_legenddata = [];
		tiaoshufenjie_huanyuan_currentceng=[];
		for (var i = 0; i < tiaoshufenjie_nodes.length; i++) {
			var node = new Object();
			node.name = tiaoshufenjie_nodes[i].name;
			node.size = tiaoshufenjie_nodes[i].size;
			node.value = tiaoshufenjie_nodes[i].value;
			node.category = tiaoshufenjie_nodes[i].category;
			tiaoshufenjie_huanyuan_nodes[i] = node;
		}
		for (var i = 0; i < tiaoshufenjie_links.length; i++) {
			var message = new Object();
			message.source = tiaoshufenjie_links[i].source;
			message.target = tiaoshufenjie_links[i].target;
			message.weight = tiaoshufenjie_links[i].weight;
			tiaoshufenjie_huanyuan_links[i] = message;
		}
		for (var i = 0; i < tiaoshufenjie_categories.length; i++)
			tiaoshufenjie_huanyuan_categories[i] = tiaoshufenjie_categories[i];
		for (var i = 0; i < tiaoshufenjie_legenddata.length; i++)
			tiaoshufenjie_huanyuan_legenddata[i] = tiaoshufenjie_legenddata[i];
		for (var i = 0; i < tiaoshufenjie_currentceng.length; i++)
			tiaoshufenjie_huanyuan_currentceng[i] = tiaoshufenjie_currentceng[i];
		for (var i = 0; i < tiaoshufenjie_flagArray.length; i++)
			tiaoshufenjie_huanyuan_flagArray[i] = tiaoshufenjie_flagArray[i];
	}
	else{
		tiaoshufenjie_next();
	}
}
function tiaoshufenjie_next(){
	tiaoshufenjie_current++;
	var currentceng=new Array();
	for(var i=0;i<tiaoshufenjie_currentceng.length;i++){
		for(var j=0;j<messagesNodes.length;j++){
			if(tiaoshufenjie_flagArray[j]==0){//未访问过
				//看是否是同层的
				for(var k=0;k<messagesLinks.length;k++){
					if(tiaoshufenjie_currentceng[i]===messagesLinks[k].source&&messagesNodes[j].name===messagesLinks[k].target||tiaoshufenjie_currentceng[i]===messagesLinks[k].target&&messagesNodes[j].name===messagesLinks[k].source){
						//新建边加1；节点+1，新建节点并将访问为设为1
						//边
						var link=new Object();
						link.source=messagesLinks[k].source;
						link.target=messagesLinks[k].target;
						link.weight=messagesLinks[k].weight;
						tiaoshufenjie_links[tiaoshufenjie_links.length]=link;
						//节点+1
						var index1=inArray(tiaoshufenjie_currentceng[i],tiaoshufenjie_nodes);
						tiaoshufenjie_nodes[index1].size=tiaoshufenjie_nodes[index1].size+1;
						tiaoshufenjie_nodes[index1].value=tiaoshufenjie_nodes[index1].value+1;
//						var flag=0;
//						for(var n=0;n<tiaoshufenjie_currentceng.length;n++){
//							if(messagesNodes[j].name===tiaoshufenjie_currentceng[n]){
//								flag=1;
//								break;
//							}
//						}
//						if(flag==0){
						//添加节点
						var node=new Object();
						node.name=messagesNodes[j].name;
						node.size=1;
						node.value=1;
						node.category=tiaoshufenjie_current-1;
						tiaoshufenjie_nodes[tiaoshufenjie_nodes.length]=node;
						tiaoshufenjie_flagArray[j]=1;
						currentceng[currentceng.length]=messagesNodes[j].name;	
//						}
//						else{
//							var index2=inArray(messagesNodes[j].name,tiaoshufenjie_nodes);
//							tiaoshufenjie_nodes[index2].size=tiaoshufenjie_nodes[index2].size+1;
//							tiaoshufenjie_nodes[index2].value=tiaoshufenjie_nodes[index2].value+1;
//						}
					}
				}
			}
			//如果是同层的,并且访问过
			/*else{
				//看是否是同层的
				var flag=0;
				for(var n=0;n<tiaoshufenjie_currentceng.length;n++){
					if(messagesNodes[j].name===tiaoshufenjie_currentceng[n]){
						flag=1;
						break;
					}
				}
				//同层
				if(flag==1){
					var link=new Object();
					link.source=tiaoshufenjie_currentceng[i];
					link.target=messagesNodes[j].name;
					for(var k=0;k<messagesLinks.length;k++){
						if(tiaoshufenjie_currentceng[i]===messagesLinks[k].source&&messagesNodes[j].name===messagesLinks[k].target||tiaoshufenjie_currentceng[i]===messagesLinks[k].target&&messagesNodes[j].name===messagesLinks[k].source){
							link.weight=messagesLinks[k].weight;
						}
					}
					tiaoshufenjie_links[tiaoshufenjie_links.length]=link;
				}
			}*/
		}
	}
	tiaoshufenjie_categories[tiaoshufenjie_categories.length] = {
			"name" : "第" + (tiaoshufenjie_current - 1) + "步",
			"keyword" : {},
			"base" : "第" + (tiaoshufenjie_current - 1) + "步"
		};
	tiaoshufenjie_legenddata[tiaoshufenjie_legenddata.length] = "第"
			+ (tiaoshufenjie_current - 1) + "步";
	tiaoshufenjie_currentceng=[];
	for(var i=0;i<currentceng.length;i++)
		tiaoshufenjie_currentceng[i]=currentceng[i];
	if(currentceng.length==0)
	{
		//alert("已经是最后一跳！");
		$("#tiaoshufenjie_next").hide();
		return;
	}
	drawGraph();
	
	/*for(var i=0;i<messagesLinks.length;i++){
		for(var j=0;j<tiaoshufenjie_currentceng.length;j++){
			//边的终点和节点相等，并且终点没有访问过，则将节点加入到节点集合，节点大小一个加1一个新生成为1，添加一条边并且边的权值+1
			if(tiaoshufenjie_currentceng[j]===messagesLinks[i].source&&inArray(messagesLinks[i].target, tiaoshufenjie_nodes) == -1){
				//添加新节点
				var node=new Object();
				node.name=messagesLinks[i].target;
				node.size=1;
				node.value=1;
				node.category=tiaoshufenjie_current-1;
				tiaoshufenjie_nodes[tiaoshufenjie_nodes.length]=node;
				currentceng[currentceng.length]=messagesLinks[i].target;
				//为老节点大小+1
				var senderindex=inArray(messagesLinks[i].source, tiaoshufenjie_nodes);
				tiaoshufenjie_node[senderindex].size=tiaoshufenjie_node[senderindex].size+1;
				tiaoshufenjie_node[senderindex].value=tiaoshufenjie_node[senderindex].value+1;
				//添加新边
				var link=new Object;
				link.source=tiaoshufenjie_currentceng[j];
				link.target=messagesLinks[i].target;
				link.weight=1;
				tiaoshufenjie_links[tiaoshufenjie_links.length]=link;
			}
			//边的终点和节点相等，但是访问过，则为两个节点大小+1，老边权值+1
			else if(tiaoshufenjie_currentceng[j]===messagesLinks[i].source&&inArray(messagesLinks[i].target, tiaoshufenjie_nodes) != -1){
				//为两个节点大小加+
				var senderid=inArray(messages[i].senderid, tiaoshufenjie_nodes);
				var recpid=inArray(messages[i].recipientid, tiaoshufenjie_nodes);
				tiaoshufenjie_nodes[senderid].size=tiaoshufenjie_nodes[senderid].size+1;
				tiaoshufenjie_nodes[senderid].value=tiaoshufenjie_nodes[senderid].value+1;
				tiaoshufenjie_nodes[recpid].size=tiaoshufenjie_nodes[recpid].size+1;
				tiaoshufenjie_nodes[recpid].value=tiaoshufenjie_nodes[recpid].value+1;
				//边权值加+
				for(var k=0;k<tiaoshufenjie_links.length;k++){
					if(tiaoshufenjie_links[i].source===tiaoshufenjie_currentceng[j])
				}
			}
		
		}
	}*/
	//在确定边
}
function inArray(s,array){
	for(var i=0;i<array.length;i++){
		if(String(s)===array[i].name)
			return i;
	}
	return -1;
}
function findIndex(s){
	for(var i=0;i<messagesNodes.length;i++){
		if(messagesNodes[i]===s)
			return i;
	}
	return -1;
}
//是否全为1
function isAllOne(array){
	for(var i=0;i<array.length;i++){
		if(array[i]==0)
			return 0;
	}
	return 1;
}
function drawGraph(){
	var myChart = echarts.init(document.getElementById('tiaoshufenjie_graph'));
    option = {
		title : {
			text : '消息传播跳数分解图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : tiaoshufenjie_legenddata,
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
		categories : tiaoshufenjie_categories,
		nodes : tiaoshufenjie_nodes,
		links : tiaoshufenjie_links,
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
function tiaoshufenjie_huanyuan(){
	//将当前的跳数设置为第一跳还原后的情况
	tiaoshufenjie_current=1;
	tiaoshufenjie_nodes = [];
	tiaoshufenjie_links = [];
	tiaoshufenjie_categories = [];
	tiaoshufenjie_legenddata = [];
	tiaoshufenjie_currentceng=[];
	for (var i = 0; i < tiaoshufenjie_huanyuan_nodes.length; i++) {
		var node = new Object();
		node.name = tiaoshufenjie_huanyuan_nodes[i].name;
		node.size = tiaoshufenjie_huanyuan_nodes[i].size;
		node.value = tiaoshufenjie_huanyuan_nodes[i].value;
		node.category = tiaoshufenjie_huanyuan_nodes[i].category;
		tiaoshufenjie_nodes[i] = node;
	}
	for (var i = 0; i < tiaoshufenjie_huanyuan_links.length; i++) {
		var message = new Object();
		message.source = tiaoshufenjie_huanyuan_links[i].source;
		message.target = tiaoshufenjie_huanyuan_links[i].target;
		message.weight = tiaoshufenjie_huanyuan_links[i].weight;
		tiaoshufenjie_links[i] = message;
	}
	for (var i = 0; i < tiaoshufenjie_huanyuan_categories.length; i++)
		tiaoshufenjie_categories[i] = tiaoshufenjie_huanyuan_categories[i];
	for (var i = 0; i < tiaoshufenjie_huanyuan_legenddata.length; i++)
		tiaoshufenjie_legenddata[i] = tiaoshufenjie_huanyuan_legenddata[i];
	for (var i = 0; i < tiaoshufenjie_huanyuan_currentceng.length; i++)
		tiaoshufenjie_currentceng[i] = tiaoshufenjie_huanyuan_currentceng[i];
	for (var i = 0; i < tiaoshufenjie_huanyuan_flagArray.length; i++)
		tiaoshufenjie_flagArray[i] = tiaoshufenjie_huanyuan_flagArray[i];
	drawGraph();
	//显示下一跳的按钮
	$("#tiaoshufenjie_next").show();
}
/*function fenjie_tiaoshu(){
	tianshufenjie_messages=new Array();
	//先判断是否搜索了消息
	if(message==null){
		alert("请先搜索消息");
		top.location='NewsTransmission.html';
	}
	else{
		//清除页面内容
		$("#grid_10").empty();
		var div_drawinfo="<div id='messinfo' style='margin-left:10px; margin-top:10px' >" +
                             "<p id='p_messinfo'></p><p id='p_tiaoshurange'></p>"+
                         "</div>"+
                         "<div id='div_messfennjie' style='margin-left:10px; margin-top:10px' >" +
                             "按 <input style='width:25px' id='txt_number' type='text'/> 跳分解(默认1跳) "+
                             "<button id='btn_drawmess' type='button' onclick='draw_tiaoshufenjie()'>分解</button>&nbsp&nbsp&nbsp"
                         "</div>"
        $("#grid_10").append(div_drawinfo);
		//对消息按照跳进行统计
		var current=messages[0];
		var ms=new Array();
		var m=new Object();
		m.source=String(current["senderid"]);
		m.target=String(current["recipientid"]);
		m.weight=current["time"];
		ms[0]=m;
		tiaoshufenjie_messagesqian[0]=ms;
		var j=1;
		for(var i=1;i<messages.length;i++){
			if(current["time"].substr(0,16)===messages[i]["time"].substr(0,16)){
				var mIn=new Object();
				mIn.source=String(messages[i]["senderid"]);
				mIn.target=String(messages[i]["recipientid"]);
				mIn.weight=messages[i]["time"];
				tiaoshufenjie_messagesqian[j-1][tiaoshufenjie_messagesqian[j-1].length]=mIn;
			}
			else{
				var msIn=new Array();
				var mIn=new Object();
				mIn.source=String(messages[i]["senderid"]);
				mIn.target=String(messages[i]["recipientid"]);
				mIn.weight=messages[i]["time"];
				msIn[0]=mIn;
				tiaoshufenjie_messagesqian[j]=msIn;
				current=messages[i];
				j++;
			}
		}
		$("#p_messinfo").html("消息内容："+message);
		$("#p_tiaoshurange").html("跳数："+String(j));
	}
}
function draw_tiaoshufenjie(){
	//初始化其他参数，将其归零
	tiaoshufenjie_current=0;
	tiaoshufenjie_nodes=[];
	tiaoshufenjie_links=[];
	tiaoshufenjie_categories=[];
	tiaoshufenjie_legenddata=[];
	tiaoshufenjie_messageshou=[];
	
	tiaoshufenjie_huanyuan_messages=[];
	tiaoshufenjie_huanyuan_nodes=[];
	tiaoshufenjie_huanyuan_links=[];
	tiaoshufenjie_huanyuan_categories=[];
	tiaoshufenjie_huanyuan_legenddata=[];
	$("#main").remove();
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
    $("#grid_10").append(maingraph_div);
	var basicgraph_div="<div id='tiaoshufenjie_graph' style='width:700px; height:460px; float:left;'></div>"+
	                   "<div id='tiaoshufenjie_button' style='width:300px; height:460px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<button id='tiaoshufenjie_next' type='button' onclick='tiaoshufenjie_next()'>下一步</button>&nbsp&nbsp&nbsp" +
	                       "<button id='tiaoshufenjie_huanyuan' type='button' onclick='tiaoshufenjie_huanyuan()'>还原</button>&nbsp&nbsp&nbsp" +
	                   "</div>";
	$("#main").append(basicgraph_div);
	tiaoshufenjie_next();
}
function tiaoshufenjie_next(){
	tiaoshufenjie_current++;
	var tiaoshu_input=$("#txt_number").val();
	if(tiaoshu_input===""||tiaoshu===null)
		tiaoshu=1;
	else
		tiaoshu=tiaoshu_input;
	//按照跳数进行分割
	for(var i=(tiaoshufenjie_current-1)*tiaoshu;i<tiaoshufenjie_messagesqian.length&&i<tiaoshufenjie_current*tiaoshu;i++){
		for(var k=0;k<tiaoshufenjie_messagesqian[i].length;k++){
			var flag=0;
			var j=0;
			for(j=0;j<tiaoshufenjie_messageshou.length;j++)
			{
				if(String(tiaoshufenjie_messagesqian[i][k].source)===String(tiaoshufenjie_messageshou[j].source)&&String(tiaoshufenjie_messagesqian[i][k].target)===String(tiaoshufenjie_messageshou[j].target))
				{
					flag=1;
					break;
				}
				if(String(tiaoshufenjie_messagesqian[i][k].target)===String(tiaoshufenjie_messageshou[j].source)&&String(tiaoshufenjie_messagesqian[i][k].source)===String(tiaoshufenjie_messageshou[j].target))
				{
					flag=1;
					break;
				}
			}
			if(flag==1)
			{
				tiaoshufenjie_messageshou[j].weight=tiaoshufenjie_messageshou[j].weight+1;
			}
			else{
				var message=new Object();
			    message.source=String(tiaoshufenjie_messagesqian[i][k].source);
			    message.target=String(tiaoshufenjie_messagesqian[i][k].target);
			    message.weight=1;
			    tiaoshufenjie_messageshou[tiaoshufenjie_messageshou.length]=message;
			}
			
		}	
	}
	//计算图像之类的
	for(var i=0;i<tiaoshufenjie_messageshou.length;i++){
		var flagstart=0;
		var flagend=0;
		var indexstart=0;
		var indexend=0;
		var j=0;
		//tiaoshufenjie_nodes
		for(j=0;j<tiaoshufenjie_nodes.length;j++){
			if(tiaoshufenjie_nodes[j].name===tiaoshufenjie_messageshou[i].source){
				flagstart=1;
				indexstart=j;
				//break;
			}
			if(tiaoshufenjie_nodes[j].name===tiaoshufenjie_messageshou[i].target){
				flagend=1;
				indexend=j;
				//break;
			}
		}
		if(flagstart==1){
			tiaoshufenjie_nodes[indexstart].size=tiaoshufenjie_nodes[indexstart].size+1;	
			tiaoshufenjie_nodes[indexstart].value=tiaoshufenjie_nodes[indexstart].value+1;
		}
		if(flagend==1){
			tiaoshufenjie_nodes[indexend].size=tiaoshufenjie_nodes[indexend].size+1;
			tiaoshufenjie_nodes[indexend].value=tiaoshufenjie_nodes[indexend].value+1;
		}
		if(flagstart==0){
			var node=new Object();
			node.name=tiaoshufenjie_messageshou[i].source;
			node.size=1;
			node.value=1;
			node.category=tiaoshufenjie_current-1;
			tiaoshufenjie_nodes[tiaoshufenjie_nodes.length]=node;
		}
		if(flagend==0){
			var node=new Object();
			node.name=tiaoshufenjie_messageshou[i].target;
//			node.size=tiaoshufenjie_messageshou[i].weight;
//			node.value=tiaoshufenjie_messageshou[i].weight;
			node.size=1;
			node.value=1;
			node.category=tiaoshufenjie_current-1;
			tiaoshufenjie_nodes[tiaoshufenjie_nodes.length]=node;
		}
	}
	tiaoshufenjie_links=tiaoshufenjie_messageshou;
	tiaoshufenjie_categories[tiaoshufenjie_categories.length]={
            "name": "第"+(tiaoshufenjie_current-1)+"步",
            "keyword": {},
            "base": "第"+(tiaoshufenjie_current-1)+"步"
        };
	tiaoshufenjie_legenddata[tiaoshufenjie_legenddata.length]="第"+(tiaoshufenjie_current-1)+"步";
	//记录下第0跳的情况，用于还原
	if(tiaoshufenjie_current==1){
		tiaoshufenjie_huanyuan_nodes=[];
		tiaoshufenjie_huanyuan_links=[];
		tiaoshufenjie_huanyuan_categories=[];
		tiaoshufenjie_huanyuan_legenddata=[];
		tiaoshufenjie_huanyuan_messages=[];
		for(var i=0;i<tiaoshufenjie_nodes.length;i++){
			var node=new Object();
			node.name=tiaoshufenjie_nodes[i].name;
			node.size=tiaoshufenjie_nodes[i].size;
			node.value=tiaoshufenjie_nodes[i].value;
			node.category=tiaoshufenjie_nodes[i].category;
			tiaoshufenjie_huanyuan_nodes[i]=node;
		}		
		for(var i=0;i<tiaoshufenjie_links.length;i++){
			var message=new Object();
		    message.source=tiaoshufenjie_links[i].source;
		    message.target=tiaoshufenjie_links[i].target;
		    message.weight=tiaoshufenjie_links[i].weight;
		    tiaoshufenjie_huanyuan_links[i]=message;
		}	
		for(var i=0;i<tiaoshufenjie_categories.length;i++)
			tiaoshufenjie_huanyuan_categories[i]=tiaoshufenjie_categories[i];
		for(var i=0;i<tiaoshufenjie_legenddata.length;i++)
			tiaoshufenjie_huanyuan_legenddata[i]=tiaoshufenjie_legenddata[i];
		for(var i=0;i<tiaoshufenjie_messageshou.length;i++){
			var message=new Object();
		    message.source=tiaoshufenjie_messageshou[i].source;
		    message.target=tiaoshufenjie_messageshou[i].target;
		    message.weight=tiaoshufenjie_messageshou[i].weight;
		    tiaoshufenjie_huanyuan_messages[i]=message;
		}
	}
	var myChart = echarts.init(document.getElementById('tiaoshufenjie_graph'));
    option = {
		title : {
			text : '消息传播跳数分解图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : tiaoshufenjie_legenddata,
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
		categories : tiaoshufenjie_categories,
		nodes : tiaoshufenjie_nodes,
		links : tiaoshufenjie_links,
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
	if(tiaoshufenjie_current*tiaoshu>=tiaoshufenjie_messagesqian.length)
	{
		//alert("已经是最后一跳！");
		$("#tiaoshufenjie_next").hide();
		return;
	}
}
function tiaoshufenjie_huanyuan(){
	var myChart = echarts.init(document.getElementById('tiaoshufenjie_graph'));
    option = {
		title : {
			text : '消息传播跳数分解图',
			x : 'center',
			y : 'bottom'
		},
		legend : {
		    data : tiaoshufenjie_huanyuan_legenddata,
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
		categories : tiaoshufenjie_huanyuan_categories,
		nodes : tiaoshufenjie_huanyuan_nodes,
		links : tiaoshufenjie_huanyuan_links,
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
	//将当前的跳数设置为第一跳还原后的情况
	tiaoshufenjie_current=1;
	tiaoshufenjie_messageshou=[];
	tiaoshufenjie_nodes=[];
	tiaoshufenjie_links=[];
	tiaoshufenjie_categories=[];
	tiaoshufenjie_legenddata=[];
	for(var i=0;i<tiaoshufenjie_huanyuan_nodes.length;i++)
		tiaoshufenjie_nodes[i]=tiaoshufenjie_huanyuan_nodes[i];
	for(var i=0;i<tiaoshufenjie_huanyuan_links.length;i++)
		tiaoshufenjie_links[i]=tiaoshufenjie_huanyuan_links[i];
	for(var i=0;i<tiaoshufenjie_huanyuan_categories.length;i++)
		tiaoshufenjie_categories[i]=tiaoshufenjie_huanyuan_categories[i];
	for(var i=0;i<tiaoshufenjie_huanyuan_legenddata.length;i++)
		tiaoshufenjie_legenddata[i]=tiaoshufenjie_huanyuan_legenddata[i];
	for(var i=0;i<tiaoshufenjie_huanyuan_messages.length;i++)
		tiaoshufenjie_messageshou[i]=tiaoshufenjie_huanyuan_messages[i];
	//显示下一跳的按钮
	$("#tiaoshufenjie_next").show();
}*/
/***************************************消息统计*******************************/
var xdata=new Array();
var ydata=new Array();
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
		                      "按 <input style='width:25px' id='txt_number' type='text'/>&nbsp<select id='time_interval'><option value ='年'>年</option><option value ='月'>月</option><option value='日'>日</option><option value='时'>时</option></select>&nbsp分割&nbsp&nbsp&nbsp&nbsp&nbsp"+
		                      "<button id='btn_drawLineGraph' type='button' onclick='doDrawLineGraph()'>绘制统计图</button>"+
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
	xdata=new Array();
	ydata=new Array();
	var maingraph_div="<div id='main' style='width: 100%;height:500px;'>"+
					      "<div id='line_graph' style='width: 100%;height:480px; float:left;'></div>"+
                         // "<div id='line_graph' style='width:700px; height:480px; float:left;'></div>"+
	                      //"<div id='line_info' style='width:300px; height:480px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
//	                           "<p id='p_usercount'>haha</p>"+
//	                           "<p id='p_news_starttime'></p>"+
//	                           "<p id='p_news_endtime'></p>"+ 
	                       "</div>"+
	                   "</div>";
	$("#grid_10").append(maingraph_div);
	//对数据进行处理，看是按照年月日统计
	var time_number=$("#txt_number").val();
	var time_inter=$("#time_interval").val();
	var start_time=$("#start_time").val();
	var end_time=$("#end_time").val();
	var startDate=new Date(start_time.replace(/-/g,"/"));
	var endDate=new Date(end_time.replace(/-/g,"/"));
	var start=timeadd(startDate,0,time_inter);;
	var end=timeadd(start,parseInt(time_number),time_inter);
	for(var i=0;i<messages.length;){
		if(start.getTime()>endDate.getTime())
			break;
		//var indexin=i;
		var count=0;
		var messageDatein=new Date(messages[i].time.substr(0,16).replace(/-/g,"/"));
		if(messageDatein.getTime()<start.getTime()){
			i++;
			continue;
		}
			
		//获取xdata
//		if(end.getTime()>=endDate.getTime())
//			xdata[xdata.length]=getxdata(start,time_inter)+"-"+getxdata(endDate,time_inter);
//		else
		xdata[xdata.length]=getxdata(start,time_inter)+"-"+getxdata(end,time_inter);
		var flagin=0;
		while(i<messages.length&&messageDatein.getTime()>=start.getTime()&&messageDatein.getTime()<=end.getTime()){
			flagin=1;
			count++;
			i++;
			if(i<messages.length)
				messageDatein=new Date(messages[i].time.substr(0,16).replace(/-/g,"/"));		
		}
//		if(flagin==0)
//			i++;
		ydata[ydata.length]=count;
		//i=indexin;
		start=timeadd(start,parseInt(time_number),time_inter);
		end=timeadd(start,parseInt(time_number),time_inter);
	}
	var myChart = echarts.init(document.getElementById('line_graph'));
	option = {
		title : {
			text : '消息统计图',
			subtext : ''
		},
		tooltip : {
			trigger : 'axis'
		},
//		legend : {
//			data : [ '最高气温', '最低气温' ]
//		},
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
		series : [ {
			name : '消息统计',
			type : 'line',
			data : ydata,
//			markPoint : {
//				data : [ {
//					type : 'max',
//					name : '最大值'
//				}, {
//					type : 'min',
//					name : '最小值'
//				} ]
//			},
//			markLine : {
//				data : [ {
//					type : 'average',
//					name : '平均值'
//				} ]
//			}
		} ]
	};
	myChart.setOption(option);		                    
}
function getxdata(time,danwei){
	switch(danwei) 
	{
	    case   "年"   :   {  
	    	return   time.getFullYear();  
	    	break;  
	    } 
	    case   "月"   :   {  
            return   time.getFullYear()+"-"+String(parseInt(time.getMonth())+1);  
            break;  
	    }  
	    case   "日"   :   {   
            return   time.getFullYear()+"-"+String(parseInt(time.getMonth())+1)+"-"+time.getDate();  
            break;  
	    }
	    case   "时"   :   {   
            return   time.getFullYear()+"-"+String(parseInt(time.getMonth())+1)+"-"+time.getDate()+" "+time.getHours();   
            break;  
	    }
	    default   :   {    
            return   time;  
            break;  
	    }  
	}
}
