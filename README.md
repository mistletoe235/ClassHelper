# 班助——班级管理助手
# 导论大作业
## 一.功能
    获取北邮信息门户校内通知，获取北京共青团青年大学习完成情况，通过安卓手机NFC或RC522硬件模块进行刷卡签到，文件上传到微信云存储进行共享
    演示视频 https://www.bilibili.com/video/BV1jL4y1P7QA

## 二.代码
    1. miniprogram
        微信小程序代码，导入即可，需要开通微信云开发，NFC仅支持的安卓设备可用
        代码中包含MQTT的连接信息和微信云托管的代码需要自行填入
        使用的MQTT服务器为百度天工物接入，网址为 https://console.bce.baidu.com/iot2/hub/ 进入后登录，登录后跳转的页面不是对应页面，需要再次输入网址进入

    2. NodeMcu 
        nodemcu硬件代码，需要填入MQTT连接信息、WiFi信息等

    3. BUPT_news 
        北邮信息门户爬虫代码，包含登录VPN，可在校外使用，需要输入VPN用户名密码及信息门户用户名密码
        tomemfire.py为上传到数据库的代码，需要填入数据库信息
        我使用的是 memfiredb 一个免费的PostgreSQL数据库，是一个新推出的数据库，功能较少（https://memfiredb.com/）
        get_news.py 和 tomemfire.py 我部署在一个云服务器

        api文件夹为微信云托管的代码，部署后用于从数据库获取新闻（微信小程序nodejs调用pg模块总是失败不知道为什么）

    4. bjyouth
        文件夹中的api文件夹同样为微信云托管代码，其中用户名密码使用了RSA加密，爬虫登陆后返回cooike，微信小程序通过cookie获取信息。

    微信云托管部分均可使用已备案的云服务器替换
    爬虫部分使用了 ddddocr （https://github.com/sml2h3/ddddocr）模块识别验证码，在此感谢

