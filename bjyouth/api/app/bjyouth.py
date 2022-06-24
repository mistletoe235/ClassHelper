async def main(u,p):
    from PIL import Image
    from urllib import parse
    from bs4 import BeautifulSoup as bs
    import json
    import time
    from io import BytesIO
    import requests 
    s=requests.Session()
    import base64
    from Crypto.Cipher import PKCS1_v1_5 as Cipher_pksc1_v1_5
    from Crypto.PublicKey import RSA


    username = u
    password = p

    # key是公钥

    key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD5uIDebA2qU746e/NVPiQSBA0Q'
    key += '3J8/G23zfrwMz4qoip1vuKaVZykuMtsAkCJFZhEcmuaOVl8nAor7cz/KZe8ZCNIn'
    key += 'bXp2kUQNjJiOPwEhkGiVvxvU5V5vCK4mzGZhhawF5cI/pw2GJDSKbXK05YHXVtOA'
    key += 'mg17zB1iJf+ie28TbwIDAQAB'

    public_key = '-----BEGIN PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----'


    HEADER={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0'}
    HOME_url = "https://www.bjyouth.net"
    LOGIN_url = "https://www.bjyouth.net/site/loginnn"

    # 加密函数
    def encrpt(password, public_key):
        rsakey = RSA.importKey(public_key)
        cipher = Cipher_pksc1_v1_5.new(rsakey)
        cipher_text = base64.b64encode(cipher.encrypt(password.encode()))
        return cipher_text.decode()

    home_get = s.get(HOME_url,headers=HEADER).text
    soup = bs(home_get,'html.parser')

    cap_url = soup.body.select('.all')[0].form.select('.field-login-verifycode')[0].select('#login-verifycode-image')[0]['src']
    cap_url = HOME_url+cap_url
    #print(cap_url)

    res_img = s.get(cap_url)
    image = Image.open(BytesIO(res_img.content))
    image = image.convert('L')
    image.save('captcha.png')
    import ddddocr

    ocr = ddddocr.DdddOcr()
    with open('captcha.png', 'rb') as f:
        img_bytes = f.read()
    res = ocr.classification(img_bytes)
    CAPTCHA = res
    print('验证码',res)


    username_en = encrpt(username, public_key)
    password_en = encrpt(password, public_key)
    post_data={
        'Login[username]':username_en,
        'Login[password]':password_en,
        'Login[verifyCode]':CAPTCHA,
    }
    post_data = parse.urlencode(post_data)

    POST_header = {
    'authority': 'www.bjyouth.net',
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'origin': 'https://www.bjyouth.net',
    'referer': 'https://www.bjyouth.net/',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Microsoft Edge";v="101"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 Edg/101.0.1210.39',
    'x-requested-with': 'XMLHttpRequest',
    }


    login_res = s.post(LOGIN_url,headers=POST_header,data=post_data)
    cookies=requests.utils.dict_from_cookiejar(login_res.cookies)

    print(cookies['PHPSESSID'])
    return cookies['PHPSESSID']

