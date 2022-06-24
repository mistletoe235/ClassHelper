from PIL import Image
from urllib import parse
from bs4 import BeautifulSoup as bs
import json
import time
from io import BytesIO
import requests 
s=requests.Session()

#VPN的账号密码
USERNAME1 = ''
PASSWORD1 = ''
#信息门户的账号密码
USERNAME2 = ''
PASSWORD2 = ''
#微信小程序token获取地址，需要填入appid和secret
token_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=&secret='
#微信云开发环境
ENV = ''
#微信推送模板id
TEMID = ''

HEADER={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'}
POST_HEADER = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0','Content-Type': 'application/x-www-form-urlencoded'}
VPN_url = "https://webvpn.bupt.edu.cn/do-login"
GETURL_url = "https://webvpn.bupt.edu.cn/user/portal_groups"
IMG_src='https://webvpn.bupt.edu.cn/http/77726476706e69737468656265737421f1e2559469327d406a468ca88d1b203b/authserver/captcha?captchaId='


# 登录VPN
VPNpasswd={'username': USERNAME1,
        'password': PASSWORD1}
s.post(VPN_url,headers=HEADER,data=VPNpasswd)
# 获取信息门户网址
INFO_url = json.loads(s.get(GETURL_url,headers=HEADER).text)
INFO_url = INFO_url['data'][0]['resource'][0]['redirect']
INFO_url= 'https://webvpn.bupt.edu.cn' + INFO_url
# print(INFO_url)

#获取execution、BASE_url
INFO_get = s.get(INFO_url,headers=HEADER).text
soup = bs(INFO_get,'html.parser')

base = soup.head.script.string
base0 = int(base.find('__vpn_app_hostname_data = "'))
base1 = int(base.find('var __vpn_app_protocol_data'))
BASE_url = base[base0+27:base1-3]
BASE_url = 'https://webvpn.bupt.edu.cn/http/'+ BASE_url

#获取验证码id
INFO_get2 = s.get(BASE_url,headers=HEADER).text
soup = bs(INFO_get2,'html.parser')
CAP_ = soup.find_all('script',type="text/javascript")[1].next_sibling.next_sibling.string
# pos = int(CAP_.find("id: '"))
# CAP_ = CAP_[pos+5:pos+15]
CAP_id = ''
for item in CAP_:
    if(item>='0' and item<='9'):
        CAP_id=CAP_id + item
# print(CAP_id)
CAP_id = CAP_id[:10]
for inp in soup.form.find_all('input'):
        if(inp.get('name'))=='execution':
            EXECUTION=inp.get('value')
# print(EXECUTION)


# 识别验证码
IMG_src = BASE_url + '/authserver/captcha?captchaId='+CAP_id
# print(IMG_src)
response = s.get(IMG_src)
image = Image.open(BytesIO(response.content))
image = image.convert('L')
image.save('captcha.png')
# CAPTCHA = ''
import ddddocr

ocr = ddddocr.DdddOcr()
with open('captcha.png', 'rb') as f:
    img_bytes = f.read()
res = ocr.classification(img_bytes)
CAPTCHA = res
print('验证码',res)


#登录信息门户
POST_url = BASE_url+'/authserver/login'
post_data={
    'username':USERNAME2,
    'password':PASSWORD2,
    'submit':'登录',
    'type':'username_password',
    '_eventId':'submit',
    'captcha':CAPTCHA,
    'execution':EXECUTION

}
post_data = parse.urlencode(post_data)


p=s.post(POST_url,headers=POST_HEADER,data=post_data)

time.sleep(1)

#获取校内通知
NEWS_url = INFO_url + 'list.jsp?urltype=tree.TreeTempUrl&wbtreeid=1154'
s.get(NEWS_url,headers=HEADER)
time.sleep(1)
news = s.get(NEWS_url,headers=HEADER).text
# print(news)
soup = bs(news,'html.parser')
raw_info = soup.find('ul', class_='newslist list-unstyled')
info_all=raw_info.find_all('a')

with open ('saved_detail.txt') as f:    #查看保存过的所有新闻
        content = f.read()
saved_list = content.split("\n")
issaved = {}

#获取新闻详细内容
def get_detail(herf):
    detail = ''
    url = INFO_url + herf
    soup =bs( s.get(url).text,'html.parser')
    r_detail = soup.find('div','v_news_content')
    r_detail = r_detail.children
    for line in r_detail:
        detail = detail + line.get_text()
    
    #获取附件
    attach = soup.find(class_='battch')

    attach_url = attach.find_all('a')
    if  attach_url:     #如果有附件
    
        attachtext = attach.text + '微信小程序不支持下载，请复制链接至浏览器下载'
        url = {}
        for i in range(len(attach_url)):
            url[i] = 'https://webvpn.bupt.edu.cn'+attach_url[i].get('href')
            attachtext = attachtext + '\n'  + url[i]

        detail = detail + attachtext

    return detail

#获取微信access_token
def getAccess_token():
    url = token_URL
    access_token = json.loads(s.get(url).text)['access_token']
    return access_token
#获取微信openid
def get_Openid(author):
    url = "https://api.weixin.qq.com/tcb/databasequery?access_token={}".format( getAccess_token() )
    payload = json.dumps({
        "env":ENV,
        "query":"db.collection('openID').limit(100).get()"
    })

    res = json.loads(s.post(url, data=payload).text)['data']
    userinfo = {}
    openid=[]
    for i in range(len(res)):
        userinfo[i]=json.loads(res[i])
        if("subscribed" in userinfo[i]  and  userinfo[i]["subscribed"] ):
            if( author in userinfo[i]["chosen_author"] ):
                openid.append(userinfo[i]["_id"])
                print('成功添加订阅用户')
        else:
            openid.append(userinfo[i]["_id"])
    return openid


#发送消息推送
def send_message(title,author,time,detail):

    url = "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token={}".format( getAccess_token() )
    OPENID = get_Openid(author)
    for i in range(len(OPENID)):
        payload = json.dumps({
        "touser": OPENID[i],
        "template_id": TEMID,
        "page": "pages/noticeDetail/noticeDetail?title={}&author={}&time={}&detail={}".format(title,author,time,detail),
        #"miniprogram_state": "trial",  #是否为体验版
        "data": {
            "thing1": {
            "value": title[:20]
            },
            "thing4": {
            "value": author
            }
        }
        })

        res = s.post(url, data=payload)
    print(res.text)

#把数据整理到allnews
allnews = {}
for i in range(15):
    allnews[i] = {}

    allnews[i]['title'] = info_all[i].get('title')
    allnews[i]['href'] = info_all[i].get('href')
    allnews[i]['newsid'] = allnews[i]['href'][-5:]
    allnews[i]['author'] = raw_info.find_all('span', class_='author')[i].text
    allnews[i]['time'] = raw_info.find_all('span', class_='time')[i].text
    for saved in saved_list:    #查看是否保存过
        if(allnews[i]['newsid'] == saved):
            issaved[i] = True
            break
        else:
            issaved[i] = False
    if(issaved[i]):
        allnews[i]['detail'] = ""
    else:
        allnews[i]['detail'] = get_detail(allnews[i]['href'])   
        with open ('saved_detail.txt','a') as f:
            f.write('\n'+str(allnews[i]['newsid']))

        # 发送微信消息推送
        send_message(allnews[i]['title'],allnews[i]['author'],allnews[i]['time'],allnews[i]['detail'])
        
    print(allnews[i]['detail'])

