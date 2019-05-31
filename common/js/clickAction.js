$(function(){

'use strict';

	//ローカルストレージにデータを保存する関数
	var saveStrMemo = function(aSaveObj) {
		var str = JSON.stringify(aSaveObj);
		localStorage.setItem('memo',str);
	};

	//スクロールの関数
	var scroll = function(aHrefId) {
		$('html,body').animate({scrollTop:$(aHrefId).offset().top});
	};

	//display:none;のクラスを外す関数
	var removeDisplayNone = function(aId) {
		$(aId).removeClass('disp--none');
	};

	//display:none;のクラスを付与する関数
	var addDisplayNone = function(aId) {
		$(aId).addClass('disp--none');
	};


	//曜日
	var youbiData = ['sun','mon','tue','wed','thu','fri','sat'],
		len = youbiData.length;

	//今日の日付を取得
	var today = new Date(),
		year = today.getFullYear(),
		month = today.getMonth()+1,
		date = today.getDate(),
		youbiIndex = today.getDay(),
		ms = today.getTime();


	//昨日の日付を取得
	var yesterday = new Date(year, month, date - 1),
		yesterdayYear = yesterday.getFullYear(),
		yesterdayMonth = yesterday.getMonth(),
		yesterdayDate = yesterday.getDate();

	//昨日かどうか判定
	var youbiIndexYesterday = youbiIndex===0 ? 6 : youbiIndex-1,
		youbiToday = youbiData[youbiIndex],
		youbiYesterday = youbiData[youbiIndexYesterday];

	//表示する日付の文字列(今日)
	var dateToday = year + '/' + month + '/' + date;

	//表示する日付の文字列(昨日)
	var dateYesterday = yesterdayYear + '/' + yesterdayMonth + '/' + yesterdayDate;


	//過去の日付を取得
	var agoDate = function(aAgoDay) {
		var ago = new Date();
		ago.setDate(date-aAgoDay);
		var agoDate = ago.getDate(),
			agoMonth = ago.getMonth()+1,
			agoYear = ago.getFullYear(),
			agoYoubi = ago.getDay(),
			showAgo =  agoYear + '/' + agoMonth + '/' + agoDate;

		var agoShowData = {'date':agoDate,'month':agoMonth,'year':agoYear,'show':showAgo, 'youbi':agoYoubi};

		return agoShowData;
	};

	//データを取り出す
	var strData = getStrMemo();

	//一番初めの読み込みの時はstrDataに何も無いので、初期値をローカルストレージに保存
	if(!strData) {

		var ShowFirstView = function() {
			this.initialize.apply(this, arguments);
		};

		/**
		* 初期化
		*/
		ShowFirstView.prototype.initialize = function() {
			this.elmFirstView = document.getElementById('js-firstView');
			this.elmBody = document.querySelector('body');
			this.divOverlay = document.createElement("div");
			this.buttonClose = document.getElementById('button--close');
		};

		/**
		* 実行
		*/
		ShowFirstView.prototype.run = function() {
			this.setEvent();
		};

		/**
		* firstviewを削除
		*/
		ShowFirstView.prototype.removeFirstView = function() {
			var that = this;
			this.elmBody.removeChild(that.divOverlay);
			this.elmFirstView.parentNode.removeChild(that.elmFirstView);
		}


		/**
		* イベントをセット
		*/
		ShowFirstView.prototype.setEvent = function() {
			//紹介文を表示する
			this.elmFirstView.className = 'firstView';

			//オーバーレイ用のHTMLを生成
			this.divOverlay.id = 'js-firstView--overlay';
			this.divOverlay.className = 'firstView__overlay';
			this.elmBody.appendChild(this.divOverlay);

			//firstView--overlayをフェードインさせる
			this.divOverlay.className = 'firstView__overlay firstView__overlay--fadein';

			var that = this;
			this.buttonClose.onclick = function() {
				that.divOverlay.className = 'firstView disp--none';
				that.buttonClose.className = 'disp--none';
				that.elmFirstView.className = 'firstView__overlay firstView__overlay--fadeout';
				setTimeout(function() {
					that.elmBody.removeChild(that.divOverlay);
					that.elmFirstView.parentNode.removeChild(that.elmFirstView);
				}, 2000);
			};

		};


		window.onload = function() {
			var showFirstView = new ShowFirstView();
			showFirstView.run();
		};



		//初期値を設定
		strData = [
			{ youbi:'sun', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'mon', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'tue', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'wed', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'thu', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'fri', memo:'', graph:["0","0","0","0","0"], date:''},
			{ youbi:'sat', memo:'', graph:["0","0","0","0","0"], date:''}
		];

		//今日から何日前かをagoDiffに格納
		var fYoubi = [0,1,2,3,4,5,6],
			agoDiff = [];
		for(var fCnt=0,fLen=fYoubi.length;fCnt<fLen;++fCnt){
			if(fYoubi[fCnt]>youbiIndex){
				agoDiff[fCnt] = youbiIndex + 7 - fYoubi[fCnt];
			}
			else{
				agoDiff[fCnt] = youbiIndex - fYoubi[fCnt];	
			}
		}

		//日付を追加
		for(var dCnt=0,dLen=agoDiff.length;dCnt<dLen;++dCnt){
			strData[dCnt].date = agoDate(agoDiff[dCnt]).show;
		}

		//初期値を保存
		saveStrMemo(strData);
	}



	//一週間前の日付を取得
	var showWeekAgo =  agoDate(7).show;


	//過去6日間の日付データを配列に格納
	var compareAgoData = function(){
		var compareArray = [];
		for(var cnt=0;cnt<7;++cnt){
			compareArray.push({'compare':getCompareData(agoDate(cnt).year,agoDate(cnt).month,agoDate(cnt).date), 'youbi':youbiData[agoDate(cnt).youbi], 'show':agoDate(cnt).show});
		}
		return compareArray;
	};


	//日または月で20以下のデータを取得
	var getCompareData = function(aYear,aMonth,aDate){
		var date = aDate,
			month = aMonth;
		if(aDate < 10){
			date = '0' + aDate; 
		}
		else if(aMonth < 10){
			month = '0' + aMonth; 
		}

		var compareData = String(aYear) + String(month) + String(date);

		return compareData;
	};

	compareAgoData = compareAgoData();

	//1週間前以前のデータを削除して直近の１週間の日付を入れる
	for(var cnt=0;cnt<len;++cnt){
		var compareArray = strData[cnt].date.split('/');
		var compareStrData = getCompareData(compareArray[0],compareArray[1],compareArray[2]);

		//１週間前よりも古いデータがあったら差し替える
		if(compareStrData < compareAgoData[6].compare){
			strData[cnt].memo = '';
			strData[cnt].graph = [0,0,0,0,0];
			for(var cnt2=0;cnt2<7;++cnt2){
				if(strData[cnt].youbi===compareAgoData[cnt2].youbi){
					strData[cnt].date = compareAgoData[cnt2].show;
				}
			}
		}
	}
	saveStrMemo(strData);

	//日付の古い順で並び替える
	strData.sort(function(a,b){
		var aGetDate = a.date.split('/'),
			bGetDate = b.date.split('/');
		for(var cnt=1;cnt<3;++cnt){
			if(aGetDate[cnt]<10){
				aGetDate[cnt]= 0 + aGetDate[cnt];
			}
			if(bGetDate[cnt]<10){
				bGetDate[cnt]= 0 + bGetDate[cnt];
			}
		}

		var aDate = aGetDate[0] + aGetDate[1] + aGetDate[2],
			bDate = bGetDate[0] + bGetDate[1] + bGetDate[2];

		if(aDate < bDate) return -1;
		if(aDate > bDate) return 1;
		return 0;
	});

	//ローカルストレージに保管したメモの内容を表示する関数
	var showStrMemo = function(){
		//判定用の変数を定義
		var memoExist,
			textVacant,
			last6daysHtml = '',
			todayHtml = '',
			todayFlag = false;


		for(var cnt=0;cnt<len;++cnt){

			if(strData[cnt].memo) {
				memoExist = '';
				textVacant = '';
			}
			else {
				memoExist = ' memo--none';
				textVacant = 'メモは入力されていません。';
			}


			//棒グラフのデータを格納
			var barGraphHtml = '',
				e = '';
			for(var barCnt=0,barLen=strData[cnt].graph.length;barCnt<barLen;++barCnt){
				e = ' e0' + barCnt;
				barGraphHtml += '<span class="w' + strData[cnt].graph[barCnt] + e + '"></span>';
			}

			if(strData[cnt].youbi!==youbiToday){
				last6daysHtml += '<li class="' + strData[cnt].youbi + memoExist + '"><a><p>' + textVacant + strData[cnt].memo  + '</p><div class="graph">' + barGraphHtml + '</div><div class="date">' + strData[cnt].date + ' ' + strData[cnt].youbi.toUpperCase() + '</div></a></li>';
			}
			else{
				if(textVacant){
					textVacant = '今日の' + textVacant;
				}
				todayHtml = '<div id="js-todayInner" class="' + strData[cnt].youbi + memoExist + '"><a><p>' + textVacant + strData[cnt].memo  + '</p><div class="graph">' + barGraphHtml + '</div><div class="date">' + strData[cnt].date + ' ' + strData[cnt].youbi.toUpperCase() + '</div></a>';
			}
		}

		//今日と過去6日間のメモをそれぞれ別の場所に表示
		$('#js-todayInner').replaceWith(todayHtml);
		$('#js-last6days ul').replaceWith('<ul>' + last6daysHtml + '</ul>');

		//合計のグラフを描く（graph.js内の関数）
		drawGraph();
	};


	//読み込み時の表示
	showStrMemo();

	var hideUpperArea = function(){
		//表示エリアを非表示に
		$('header').addClass('disp--none');
		$('#js-last6days').addClass('disp--none');
		$('#js-graphToday').addClass('disp--none');
	};

	var showUpperArea = function(){
		//表示エリアを表示
		$('header').removeClass('disp--none');
		$('#js-last6days').removeClass('disp--none');
		$('#js-graphToday').removeClass('disp--none');
	};

	//★追加ボタンを押した時
	$('#js-navBtn--add,#button--close').on('click',function(){

		//表示エリアを非表示に
		hideUpperArea();

		var checkMemoToday,checkMemoYesterday;

		//今日または昨日のメモが空かどうか調べる
		for(var cnt=0; cnt<len; ++cnt){
			if(strData[cnt].youbi===youbiToday){
				checkMemoToday = strData[cnt].memo === '' ? true : false;
			}
			else if(strData[cnt].youbi===youbiYesterday){
				checkMemoYesterday = strData[cnt].memo === '' ? true : false;
			}
		}

		//今日と昨日のメモが既に追加されている時にアラートを出す関数
		var showAddAlert = function(){

			//データを取り出す
			strData = getStrMemo();

			//アラート部分を表示する
			removeDisplayNone('#js-alert');

			$('#js-alert').html('<p class="alert__text">昨日と今日のメモはすでに追加されています。<br>編集しますか？</p><div class="alert__radio">' + radioTodayYesterday + '</div><div class="alert__btn"><button id="js-alert__btn--edit">編集</button><button id="js-alert__btn--cancel">キャンセル</button></div>');
			$('#js-alert__btn--edit').on('click',function(){

			//曜日を取得
			$getRadioVal = $('[name=whichday]:checked').val();

				//編集画面を表示
				showEditForm($getRadioVal);
				saveEditData($getRadioVal);
				saveStrMemo(strData);
				
				//アラートを非表示に
				addDisplayNone('#js-alert');

				//フォームに飛ぶ
				scroll('#js-form');
			});

			//★アラートのキャンセルボタンを押した時
			$('#js-alert__btn--cancel').on('click',function(){

				//表示エリアを表示
				showUpperArea();

				//alert部分を非表示に
				$('#js-alert').replaceWith('<div id="js-alert"></div>');
			});
		};


		//フォームかアラートを表示
		var radioYesterday = '<label><input type="radio" name="whichday" checked="checked" value="' + youbiYesterday + '">昨日</label>',
			radioToday = '<label><input type="radio" name="whichday" checked="checked" value="' + youbiToday + '">今日</label>',
			radioTodayYesterday = '<label><input type="radio" name="whichday" value="' + youbiYesterday + '">昨日</label> <label><input type="radio" name="whichday" checked="checked" value="' + youbiToday + '">今日</label>';

		//メモに両方とも入っていたらアラート
		if(!checkMemoToday && !checkMemoYesterday){
			scroll('#js-alert');
			showAddAlert();
		}
		//空だったらフォーム
		else{
			//display:noneを外してフォームを表示
			removeDisplayNone('#js-form');

			$('#js-formTitle').text('メモを追加');

			scroll('#js-form');

			//追加ボタンの表示
			$('#form__btn--replace').replaceWith('<button id="form__btn--add" disabled>メモを追加する</button>');
			
			//ラジオボタンの表示
			if(checkMemoToday && !checkMemoYesterday){
				$('#js-formRadio').html(radioToday);
			}
			else if(checkMemoYesterday && !checkMemoToday){
				$('#js-formRadio').html(radioYesterday);
			}
			else{
				$('#js-formRadio').html(radioTodayYesterday);
			}

			//ラジオボタンを表示する
			removeDisplayNone('#js-formRadio');

			saveAddFormData();
		}
	});


	var $getMemoVal,$getRadioVal,getGraphVal;

	//追加の時のフォームの内容を保存する関数
	var saveAddFormData = function(){

		//テキストリア、ラジオボタンの値を取得
		$('#js-form').on('click','#form__btn--add' ,function(){
			$getMemoVal = $('#js-formTextarea').val();
			//改行コード
			$getMemoVal = $getMemoVal.replace(/\n/g,'<br>').replace(/\r/g,'');
			$getRadioVal = $('[name=whichday]:checked').val();
			getGraphVal = getEmotionVal();

			var getDate = $getRadioVal===youbiToday ? dateToday : dateYesterday;

			for(var cnt=0;cnt<len;++cnt){
				if(strData[cnt].youbi===$getRadioVal){
					strData[cnt].memo = $getMemoVal;
					strData[cnt].date = getDate;
					strData[cnt].graph = getGraphVal;
				}
			}

			//保存の際の処理
			afterSave();

		});
	};


	//感情のデータを取得する関数
	var getEmotionVal = function(){
		var emotion =[],
			e = '',
			$data = '';
		for(var cnt=0;cnt<5;++cnt){
			e = '#e0' + cnt;
			$data = $(e).val();
			if(!$data){
				$data = 0;
			}
			emotion.push($data);
		}
		return emotion;
	};

	//メモがあるかどうか判定
	var cntExistMemo = function(){
		var existMemoCnt = 0;
		for(var mCnt=0;mCnt<len;++mCnt){
		    if(strData[mCnt].memo){
		        existMemoCnt++;
		    }
	    }
	    return existMemoCnt;
    };

	//★編集ボタンを押した時
	$('#js-navBtn--edit').on('click',function(){
		var existMemoCnt = cntExistMemo();
		if(!existMemoCnt){
			alert('編集できるメモがありません');
		}
		else{
			addClassEdit();
		}
	});

	//.editを付与する
	var addClassEdit = function(){
		$('#js-last6days li,#js-todayInner').removeClass('delete');
		$('#js-last6days li,#js-todayInner').not('.memo--none').addClass('edit');
		$('.edit a').attr('href','#');
	};

	//編集マークのついているエリアをクリックした時
	$('#js-last6days,#js-today').on('click','.edit a' ,function(){
		var $clickIndex = $('.edit a').index(this);
		var $getClassYoubi = $('.edit a').parent()[$clickIndex].className.substr(0,3);
		showEditForm($getClassYoubi);
		saveEditData($getClassYoubi);
		saveStrMemo(strData);
	});


	//編集画面を表示する関数
	var showEditForm = function(aYoubi){
		//フォームのエリアを表示
		removeDisplayNone('#js-form');

		//表示エリアを非表示に
		hideUpperArea();

		//ラジオボタンを非表示に
		addDisplayNone('#js-formRadio');

		scroll('#js-form');
		
		var editDate,editMemo,editGraph;
		for(var cnt=0;cnt<len;++cnt){
			if(strData[cnt].youbi===aYoubi){
				editDate = strData[cnt].date;
				editMemo = strData[cnt].memo;
				editGraph = strData[cnt].graph;
			}
		}
		$('#js-formTitle').text(editDate + 'のメモを編集中');
		$('#form__btn--replace').replaceWith('<button id="form__btn--save">この内容で保存する</button>');
		$('#js-formTextarea').val(editMemo);

		var e = '';

		//感情のパーセントをそれぞれのインプットに入れる
		for(var gCnt=0,gLen=editGraph.length;gCnt<gLen;++gCnt){
			e = '#e0' + gCnt;
			$(e).val(editGraph[gCnt]);
		}
	};

	//★キャンセルボタンを押した時
	$('#form__btn--cancel').on('click',function(){
		//表示エリアを表示
		showUpperArea();
		//データを空にしてフォームを非表示、上に移動
		clearValData();
	});


	//編集の時のフォームの内容を保存する関数
	var saveEditData = function(aYoubi){
		$('#form__btn--save').on('click',function(){
		//$('#btn').on('click','#form__btn--save',function(){
			$getMemoVal = $('#js-formTextarea').val();
			//改行コード
			$getMemoVal = $getMemoVal.replace(/\n/g,'<br>').replace(/\r/g,'');

			getGraphVal = getEmotionVal();

			for(var cnt=0;cnt<len;++cnt){
				if(aYoubi===strData[cnt].youbi){
					strData[cnt].memo = $getMemoVal;
					strData[cnt].graph = getGraphVal;
				}
			}

			//保存の際の処理
			afterSave();
		});
	};


	//★削除ボタンを押した時
	$('#js-navBtn--delete').on('click',function(){
		var existMemoCnt = cntExistMemo();
		if(!existMemoCnt){
			alert('削除できるメモがありません');
		}
		else{
			addClassDelete();
		}
	});

	var addClassDelete = function(){
		//メモが入っているリストにのみ削除マークがつく
		$('#js-last6days li,#js-todayInner').removeClass('edit');
		$('#js-last6days li,#js-todayInner').not('.memo--none').addClass('delete');
		$('.delete a').attr('href','#');
		var $getClassYoubi = '';
		var $clickIndex = '';
	};

	//削除マークのついている過去6日間のエリアをクリックした時
	$('#js-last6days,#js-today').on('click','.delete a',function(){

		// 削除の確認 OKの場合  確認ダイアログの表示
		if(window.confirm('削除しても良いですか？')){
			var $clickIndex = $('.delete a').index(this);
			var $getClassYoubi = $('.delete a').parent()[$clickIndex].className.substr(0,3);
			for(var cnt=0;cnt<len;++cnt){
				if(strData[cnt].youbi===$getClassYoubi){
					strData[cnt].memo = '';
					for(var gCnt=0,gLen=strData[cnt].graph.length;gCnt<gLen;++gCnt){
						strData[cnt].graph[gCnt] = '';
					}
				}
			}
		}
		// キャンセルの場合
		else{
			window.alert('削除しませんでした'); 
		}
			afterSave();
	});



	//保存の際の処理
	var afterSave = function(){

		//入力された値を保存
		saveStrMemo(strData);

		//データを取り出す
		strData = getStrMemo();

		//取得した値を空にしてフォームを非表示、上に移動
		clearValData();
	};


	var clearValData = function(){
		//メモを表示
		showUpperArea();

		//保管したデータを表示
		showStrMemo();

		//取得した値を空に
		$('#js-formTextarea').val('');
		$('[name=whichday]:checked').val('');
		$('input').val('');

		//ボタンのIDを元に戻す
		$('#form__btn--add').replaceWith('<button id="form__btn--replace"></button>');
		$('#form__btn--save').replaceWith('<button id="form__btn--replace"></button>');

		//残りの文字数を元に戻す
		$('#js-alert--nokori').text('');

		//インプットのアラートを消す
		$('#js-alert--percent').text('');
		$('#js-alert--percent2').text('');

		//フォーム部分を非表示に
		addDisplayNone('#js-form');

		//上に場所移動
		scroll('#top');	
	};
});