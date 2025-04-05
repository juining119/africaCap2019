var nowTab = 0;
var totalTab = 3;
var swipeTime = 0.5;
var loopTime = 2.5;
var ease;
var swiping = false;
var spacing = 1.5;
var intervalID;

window.onload = init;

function init()
{
    ease = Power3.easeOut;
    
    for ( var i = 0 ; i < totalTab; i++)
    {
        $("#swipe_con"+i).data({
            "nowAt":0,
            "total":4
        });
    }
    $(".dot0").click( function(){   gotoDot(0);}    );
    $(".dot1").click( function(){   gotoDot(1);}    );
    $(".dot2").click( function(){   gotoDot(2);}    );
    $(".dot3").click( function(){   gotoDot(3);}    );


    $(".swipe_con").swipe({
        threshold: 50,
        swipe:function(event, direction, distance, duration, fingerCount, fingerData, currentDirection) 
        {
            if ( !swiping )
            {
                if ( direction == "left" )
                    nextBox();
                else if ( direction == "right" )
                    previousBox();
            }
        }
    });

    gotoTab(0);
    showDot($("#swipe_con"+nowTab));
    resetInterval();
}

function nextBox()
{
    var div = $("#swipe_con"+nowTab);
    div.data({"nowAt":div.data("nowAt")+1});
    runBox(div);
}

function previousBox()
{
    var div = $("#swipe_con"+nowTab);
    div.data({"nowAt":div.data("nowAt")-1});
    runBox(div);
}

function runBox(div)
{
    swiping = true;
    var tarLeft = -$(".swipe_con").width() * spacing * div.data("nowAt");
    TweenMax.to( div.find(".swipe_sub"), swipeTime, {left:tarLeft, ease:ease, onComplete:endFunction, onCompleteParams:[div]});
    showDot(div);
    resetInterval();
}

function endFunction (div)
{
    swiping = false;
    if ( div.data("nowAt") > div.data("total") -1 )
        div.data({"nowAt":0});
    else if ( div.data("nowAt") < 0 )
        div.data({"nowAt":div.data("total")-1});
    var tarLeft = -$(".swipe_con").width() * spacing * div.data("nowAt");
    div.find(".swipe_sub").css({"left":tarLeft});
}

function resetInterval()
{
    window.clearTimeout( intervalID );
    intervalID = window.setInterval( nextBox, loopTime*1000 );
}

function showDot( div )
{
    var nowAt = div.data("nowAt");
    var total = div.data("total");

    var n = nowAt;
    if ( n > total-1)
        n -= total;
    else if ( n < 0 )
        n += total;

    for (var i = 0 ; i < total ; i++)
    {
        if ( n == i )
            div.find(".dot"+i).addClass("dot_now");
        else
            div.find(".dot"+i).removeClass("dot_now");
    }
}

function gotoDot( d )
{
    var div = $("#swipe_con"+nowTab);
    div.data({"nowAt":d});
    runBox(div);
}


function gotoTab( tab )
{
    if ( tab != nowTab)
    {
        TweenMax.to( $("#swipe_con"+nowTab), 0.5, {y:0, opacity:0, ease:Power3.easeIn, onComplete:endTabFunction, onCompleteParams:[$("#swipe_con"+nowTab)] });
        nowTab = tab;
        $("#swipe_con"+nowTab).show();
        $("#swipe_con"+nowTab).css({"opacity":0});
        TweenMax.fromTo( $("#swipe_con"+nowTab), 0.5, {y:0, opacity:0}, {delay:0.5, y:0, opacity:1, ease:Power3.easeOut});
        
        showDot($("#swipe_con"+nowTab));
        resetInterval();
    }

    for (var i = 0 ; i < totalTab ; i++)
    {
        if ( nowTab == i )
            $(".tab"+i).addClass("tab_now");
        else
            $(".tab"+i).removeClass("tab_now");
    }
}

function endTabFunction( tab )
{
    tab.hide();
}
