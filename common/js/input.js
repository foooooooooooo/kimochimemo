$(function(){

	'use strict';

	//文字数が最大の時に保管しておく変数を定義
	var $strText;

	//テキストエリアの文字を数える
	var keyDownFunc = function(aKey){
		var key_code = aKey.keyCode,
			rimitNum = 100,
			$getText,
			$textLength = '',
			$showLength = '';

		if(key_code){
			setTimeout(function(){
				$getText = $('#form__textarea').val();
				$textLength = $getText.length;
				$showLength = rimitNum - $textLength;
				$('#js-alert--nokori').replaceWith('<p id="alert--nokori">残りの文字数:' + $showLength + '字</p>');
				
				//文字数がぴったりの時の文字列をstrTextに保管
				if($showLength===0){
					$strText = $getText;
				}

				//文字数が溢れる時は、保管していた時のstrTextを表示
				if($showLength<1){
					$('#form__textarea').val($strText);

					//強制的に残りの文字数を0文字とする
					$('#js-alert--nokori').replaceWith('<p id="js-alert--nokori">残りの文字数:0字</p>');
					$('#js-alert--limit').addClass('att');
				}

				//ボタンの表示
				buttonOnOff($textLength,'textarea--ok');

			},50);
		}
	};

	if(document.addEventListener){
		document.addEventListener('keydown', keyDownFunc);
	}


	//テキストエリア選択時にインプット部分の点滅を止める
	$('#form__textarea').on('focus',function(){
		$('#js-alert--percent').removeClass('att');
		$('#js-alert--percent2').removeClass('att');
	});


	//ナビのボタンを押した時
    $('header a,#button--close').on('click',function(){
		//初期値を指定
		$('dd input').val(0);
    });

    //アラートメッセージを表示
    var showInputAlertMessage = function(aPerVal){

		//入力された%が0以下・または数字以外の場合
		var perValAlert = aPerVal<0 ? '0より大きい数で入力してください。': '';
		var perValNumAlert = isNaN(aPerVal) ? '数字で入力してください。':'';
		var alertFlag = false;

		$('#js-alert--percent2').text(perValAlert);
		$('#js-alert--percent2').text(perValNumAlert);

		//アラートを点滅させて、値を0にする(trueを渡す)		
		if(perValAlert || perValNumAlert){
			$('#js-alert--percent2').addClass('att');
			alertFlag = true;
		}

		//エラーがあればフラグがtrue
		return alertFlag;
	};

    //残りのパーセントのアラートメッセージを表示
    var showInputRestAlertMessage = function(aRestPerVal){

		if(aRestPerVal===0){
			$('#js-alert--percent').text('ちょうど100%です。');
			$('#js-alert--percent').removeClass('att');
		}
		else if(aRestPerVal<0){
			$('#js-alert--percent').text('100%を超えています。' + Math.abs(aRestPerVal) + '%削ってください。');
			$('#js-alert--percent').addClass('att');
		}
		else{
			$('#js-alert--percent').text('残り' + aRestPerVal + '%です。');
			$('#js-alert--percent').addClass('att');
		}
    };

    //パーセントの合計を取得して100%であればinput--okのclassを付与
	var getPercentTotal = function(){
    	var $perVal = 0,
			restPerVal = '',
			alertFlag = false;

		$perVal = $(this).val();

		//アラートメッセージを表示
		alertFlag = showInputAlertMessage($perVal);

		if(alertFlag){
			$(this).val('0');
		}

		//パーセントの合計
		var perValTotal = Number(0);

		for(var cnt=0;cnt<5;cnt++){
			//選択されている前までの%を足す
			perValTotal += Number($('dd input').eq(cnt).val());
		}


		//残りの%を出す
		restPerVal = 100 - perValTotal;

		//残りのパーセントについてのアラートメッセージを表示
		showInputRestAlertMessage(restPerVal);


		//inputの合計が100%であればtrue
		var inputTotal = restPerVal===0 ? true : false ;
		buttonOnOff(inputTotal,'input--ok');
	};


    $('dd input').on('blur',getPercentTotal);

    //ボタンの表示・非表示
    var buttonOnOff = function(aVal,aAddClass){
		if(aVal){
			$('#form button').addClass(aAddClass);
		}
		else{
			$('#form button').removeClass(aAddClass);
	    	$('#form__btn--add,#form__btn--save').attr('disabled','disabled');			
		}

	    $('.textarea--ok.input--ok').removeAttr('disabled','');
    };


    //ボタンをクリックした時
	$('#button').on('click',function(){
		var emotionHtml ='',
			$perData = 0,
			totalPerData = 0;

		for(var cnt=0;cnt<5;cnt++){
			e = '#e0' + cnt;
			$perData = $(e).val();
			totalPerData += parseInt($perData);
			emotionHtml += '<span class="w' + $perData + '"></span>';
		}
		$('#result').replaceWith('<div id="result">' + emotionHtml + '</div>');
	});
});