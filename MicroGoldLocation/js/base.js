/**
 * Created by Administrator on 2016/1/12.
 */

$(function(){
    $(window).resize(function(){
        changeBg();
    })
    var changeBg = function(){
        //获取要操作的dom元素
        var $sliderItems = $("#scroll-carousel > .carousel-inner > .item");
        // 判断屏幕是否是小屏幕
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
                //防止由小图变大时，小图仍然存在

                $itemDom.css("backgroundImage","url('"+$itemDom.data("lgImage")+"')");
            }
        })
        //获得元素
        var navTab = $(".nav-tabs");
        var navTabItems = $(".nav-tabs").children();
        //计算宽度
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
            // 不要阻止默認事件
            $('.news-title h3').text($(this).data('title'));

        });
    }
    changeBg();



})