# Bilibili-HTML5-Random-Play
基于TamperMonkey的B站网页端随机播放功能插件。

B站新版网页看起来不错，但依然没有增加随机播放功能，一些分P巨多的音乐视频合集播放器来就很尴尬，只能顺序播放。

为了解决这个问题我开发了这个插件，主要为了自己的这个视频 https://www.bilibili.com/video/av25961856

## 安装
点击这里开始安装： https://github.com/Attect/Bilibili-HTML5-Random-Play/raw/master/bilibili-random-play.user.js

或者自己查看bilibili-random-play.user.js的源代码弄进TamperMonkey里

## 使用方法
在右侧 __视频选集__ 的右边会增加一个 __随机播放__ 开关，点击它切换随机播放状态

## 实现特性
1. 不重复的随机播放
1. 对播放器中的下一个按钮也有效
1. 如果用户点击了分P，会自动取消随机播放
1. 如果视频分P小于4个则不会启用本插件所有功能
1. 带自动更新（待测试）

## 支持的浏览器 与 兼容
只要你的浏览器能装上 __TamperMonkey__ ，理论上都可以使用本插件。

不过我只在 __Chrome__ 上测试。

仅适用于哔哩哔哩(Bilibili)的 __新版__ 网页。不过开发本插件时B站的新版网页还未完全完成，因此有可能会因为官方修改前端网页而导致本插件失效

本插件与 __哔哩哔哩助手__ 和 __pakku__ 弹幕插件互相兼容

## 关于代码编写
闲暇时间里直接在浏览器里写的，技术也不太行，代码有点混乱。但如果你想自己修改的话还是很简单的。其它插件的作者也可以简单看一看弄懂原理整合到自己的插件中。