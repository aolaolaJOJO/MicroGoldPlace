/**
 * Created by Administrator on 2016/1/12.
 */

$(function(){
    $(window).resize(function(){
        changeBg();
    })
    var changeBg = function(){
        //��ȡҪ������domԪ��
        var $sliderItems = $("#scroll-carousel > .carousel-inner > .item");
        // �ж���Ļ�Ƿ���С��Ļ
        var isSmallScreen = $(window).width() < 640;
        //console.log($(window).width());

        $sliderItems.each(function(i,el){
            var $itemDom = $(el);
            $itemDom.empty();
            //console.log(itemDom);
            if(isSmallScreen){
                var $img = $("<img src='"+$itemDom.data("smImage")+"'/>");
                console.log($img);
                $itemDom.append($img);
            }else {
                //��ֹ��Сͼ���ʱ��Сͼ��Ȼ����

                $itemDom.css("backgroundImage","url('"+$itemDom.data("lgImage")+"')");
            }
        })
        //���Ԫ��
        var navTab = $(".nav-tabs");
        var navTabItems = $(".nav-tabs").children();
        //������
        var width =20;
        //console.log(navTabItems);
        navTabItems.each(function(num, el){
            width += $(el).width();
            console.log(width);
        })
        //console.log(navTab.parent().width());
        if(width > navTab.parent().width()){
            $(navTab).css("width",width);
            $(navTab).parent().css("overflow-x","scroll");
        }else {
            $(navTab).css("width","auto");
            $(navTab).parent().css("overflow-x","hidden");
        }

        $('.news-tabs a').click(function(e) {
            // e.preventDefault();
            // e.stopPropagation();
            // ��Ҫ��ֹĬ�J�¼�
            $('.news-title h3').text($(this).data('title'));

        });
    }
    changeBg();



})