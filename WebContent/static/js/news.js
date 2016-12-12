/***************************************消息传播图*******************************/
var messages;
function Search(){
	//切换界面至社区发现
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
			messages=data["messages"];
			var maingraph_div="<div id='main' style='width: 100%;height:500px;'></div>";
			$("#grid_10").append(maingraph_div);
			drawMessage();
		}
	});
}
//绘制某个消息的传播图
function drawMessage(){
	$("#main").empty();
	var basicgraph_div="<div id='comm_graph' style='width:700px; height:480px; float:left;'></div>"+
	                   "<div id='comm_info' style='width:300px; height:480px; float:left; margin-left:15px; font-size:15px; color:blue'>" +
	                       "<p id='p_info'></p>"+
	                       "<p id='p_important_top5'></p>"+
	                       "<p id='p_similarity_top5'></p>"+
	                   "</div>";
	$("#main").append(basicgraph_div);
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
		nodes : commData.nodes,
		links : commData.links,
		minRadius : 5,
		maxRadius : 8,
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
