$(function(){
	'use strict';

    drawGraph();

    //ボタンを押した時、再描画
    $('#form__btn--add,#form__btn--save').on('click',function(){
        drawGraph();
    });

});
