// ==UserScript==
// @name         Bilibili随机播放
// @namespace    https://attect.sudio/
// @version      2
// @description  随机播放B站分P视频
// @author       Attect
// @match        https://www.bilibili.com/video/av*
// @require      https://s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js
// @updateURL    https://github.com/Attect/Bilibili-HTML5-Random-Play/raw/master/bilibili-random-play.js
// @downloadURL  https://github.com/Attect/Bilibili-HTML5-Random-Play/raw/master/bilibili-random-play.js
// @grant        none
// ==/UserScript==

//DEBUG开关
var debugMode = false;

/**
 * 所有分P
 * @type {Array}
 */
var allPart = [];

/**
 * 随机队列
 * @type {Array}
 */
var randomList = [];

/**
 * 是否处于随机播放状态
 * @type {boolean}
 */
var randomStatus = false;

/**
 * 随机按钮
 */
var randomButton;

/**
 * 当前播放分P
 * @type {number}
 */
var currentPart = 1;

/**
 * 自动点击列表Flag，用于防止随机下一个时触发取消随机播放的事件
 * @type {boolean}
 */
var autoLickList = false;

/**
 * 给video加入的播放结束事件
 */
var videoEventFunction = function(){
    print("video play end");
    if(randomStatus) setTimeout(function(){playNext()},1000);
    setTimeout(function(){addVideoEvent();},2000);
};

function afterReady(){
}

/**
 * 当页面加载完成
 */
function afterLoad(){
    //获得当前分P数
    currentPart = parseInt(getUrlParam("p",1));
    if(isNaN(currentPart)) currentPart = 1;
    print("当前分P:" + currentPart);
    //获得所有列表分P
    allPart = $("ul.list-box li");
    print("分P数量："+allPart.length);
    print("分Pa数量："+$("ul.list-box li a").length);
    if(allPart.length < 4) return;//小于指定数量分P则不提供随机播放功能
    afterListInit();
    //保持对Video的结束事件监听
    addVideoEvent();
}

/**
 * 当分P列表加载完成后调用
 * 也用于防止和其它插件冲突
 */
function afterListInit(){
    setTimeout(function(){
        if($("ul.list-box li a").length>0){
            initRandomButton();
            injectList();
        }else{
            afterListInit();
        }
    });
}

/**
 * 给video对象添加播放完成事件
 * 顺便替换原来播放器中的“下一个”按钮功能
 */
function addVideoEvent(){
    print("addVideoEvent");
    getVideoTag().removeEventListener("ended", videoEventFunction);
    getVideoTag().addEventListener("ended", videoEventFunction);
    if($(".bilibili-player-video-btn-next").data("randomReplace")!== true){
        $(".bilibili-player-video-btn-next").data("randomReplace",true);
        let bindAction = function(){
            if(typeof $(".bilibili-player-video-btn-next").data("events") == "undefined"){
                setTimeout(function(){bindAction();},100);
                return;
            }
            //移除原始事件
            $(".bilibili-player-video-btn-next").off("click");
            $(".bilibili-player-video-btn-next").on("click",function(){
                if(randomStatus){
                    playNext();
                }else{
                    $($("ul.list-box li a")[currentPart++])[0].click();
                }
            });
            print("已更新“下一个”按钮事件");
        };
        setTimeout(function(){bindAction();},100);
    }
}

/**
 * 初始化随机播放按钮
 */
function initRandomButton(){
    console.log("initRandomButton");
    randomButton = $("<a style='margin-left:1rem'>随机播放:Off</a>");
    randomButton.click(function(){toggleRandom()});
    randomButton.insertBefore($(".range-box>.cur-page"));
}

/**
 * 给分P列表中的所有项添加点击事件
 */
function injectList(){
    //给分P列表注册点击事件
    let list = $("ul.list-box li a");
    for(let i=0;i<list.length;i++){
        $(list[i]).on("click",function(){
            if(randomStatus && !autoLickList){ //如果手动点击分P列表，则自动取消随机播放
                toggleRandom();
            }
            autoLickList = false;
        });
    }

}

/**
 * 切换随机播放状态
 */
function toggleRandom(){
    print("toggleRandom");
    randomStatus = !randomStatus;
    if(randomStatus === true){
        randomButton.text("随机播放:On");
        addVideoEvent();
        //安排随机播放列表
        flashRandomList();
    }else{
        randomButton.text("随机播放:Off");
    }

}

/**
 * 播放下一个随机分P
 */
function playNext(){
    if(randomList.length===0) flashRandomList();//此处可改进是否整个列表随机循环
    let nextPart = randomList.shift();
    print("将随机播放分P:"+nextPart);
    currentPart = nextPart;
    autoLickList = true;
    $($("ul.list-box li a")[nextPart-1])[0].click();
    setTimeout(function(){
        addVideoEvent();
    },200);
}

/**
 * 随机队列产生
 */
function flashRandomList(){
    for(let i=0;i<allPart.length;i++){
        if((i+1) === currentPart) continue;//跳过当前分P
        randomList[i] = i+1;
    }
    //抽牌随机
    for(let i=0,len=randomList.length;i<randomList.length;i++){
        let randomIndex = i + Math.floor(Math.random() * (len - i));
        let temp = i+1;
        randomList[i] = randomList[randomIndex];
        randomList[randomIndex] = temp;
    }
}

function print(content){
    if(debugMode) console.log("[Bilibili随机播放]"+content);
}

function getVideoTag(){
    return document.getElementsByTagName("video")[0];
}

//获得当前网址所有参数
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//获得指定网址参数
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){ //实际上这里效果不太理想
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

//指定范围随机数生成
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        default:
            return 0;
    }
}

//基础初始化
(function() {
    'use strict';
    $(document).ready(function(){afterReady();});
    $(window).load(function(){afterLoad();});
})();

