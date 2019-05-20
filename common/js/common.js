$(function(){

    'use strict';

	//ローカルストレージからデータを取り出す関数
	var getStrMemo = function(){
		var str = localStorage.getItem('memo');
		var data = JSON.parse(str);
		return data;
	};

	//共通なので、windowオブジェクト（グローバル変数）として扱う
	window.getStrMemo = getStrMemo;


    //円グラフを描く
    var drawGraph = function() {

        //ローカルストレージからデータを取得
        var strData = getStrMemo();

        var existGraphCnt = 0,
            existMemoCnt = 0,
            graphTotal = [0,0,0,0,0];

        //それぞれのパーセントを足す
        for(var cnt=0,len=strData.length;cnt<len;++cnt){
            for(var gCnt=0,gLen=strData[cnt].graph.length;gCnt<gLen;++gCnt){
                graphTotal[gCnt] += Number(strData[cnt].graph[gCnt]);
            }
            if(strData[cnt].memo){
                existMemoCnt++;
            }
        }

        var percent = [20,20,20,20,20];
        //メモの入力があったら（即ちグラフの入力があったら）
        if(existMemoCnt){
            //グラフの平均値を出す
            for(var aCnt=0,aLen=graphTotal.length;aCnt<aLen;++aCnt){
                percent[aCnt] = graphTotal[aCnt] / existMemoCnt;
            }
        }


        //canvas要素を取得
        var cnv = document.getElementById('js-graphAreaGraph');
        var ctx = cnv.getContext('2d');
     

        //度を求める関数
        var getDegree = function(aPercent){
            
            var degree =[],
                degree2 = '',
                degree1 = -90,
                degreeData = [],
                obj = [];

            for(var cnt=0,len=aPercent.length;cnt<len;++cnt){

                degree = aPercent[cnt]*3.6;
                degree2 = Number(degree1) + Number(degree);

                //角度情報をオブジェクトに格納
                obj = {deg1:degree1,deg2:degree2};

                //次の開始角度に前の終了角度を入れる
                degree1 = degree2;
                degreeData.push(obj);
            }
                return degreeData;
        };

        var degreeData = getDegree(percent);


        //円グラフを描く
        var circleData = [
            {title:'楽しかった',color:'#ea4d62'},
            {title:'面白かった',color:'#fad945'},
            {title:'勉強になった',color:'#7edafd'},
            {title:'普通だった',color:'#60c644'},
            {title:'疲れた',color:'#ccc'}
        ];
        
        var graphDesHtml = '',
            e = '';

        //表示データ
        for(cnt=0,len=circleData.length;cnt<len;++cnt){
            ctx.beginPath();
            ctx.moveTo(200,200);
            ctx.arc(200, 200, 200, degreeData[cnt].deg1*Math.PI/180, degreeData[cnt].deg2*Math.PI/180, false);
            ctx.closePath();
            ctx.fillStyle = circleData[cnt].color;
            ctx.fill();
            e = 'e0' + cnt;
            graphDesHtml += '<span class="' + e +'">■</span> <span>' + circleData[cnt].title + '</span><br>';
        }


        if(!existMemoCnt){
            graphDesHtml = '<p>まだデータは<br>ありません。</p>';
            $('canvas').css('opacity','0.5');
        }
        else{
            $('canvas').css('opacity','1');
        }

        //円の中の表示
        $('#js-graphAreaDes').html('<div class="graph__inner">' + graphDesHtml + '</div>');


        //ウィンドウの横幅が変わる毎にグラフの中の高さを変更
        var $width = $('#js-graphAreaDes').width();
        $('#js-graphAreaDes').css('height',$width+'px');
        $(window).resize(function(){
            var $width = $('#js-graphAreaDes').width();
            $('#js-graphAreaDes').css('height',$width+'px');
        });
    };

    //共通なので、windowオブジェクト（グローバル変数）として扱う
    window.drawGraph = drawGraph;


});
