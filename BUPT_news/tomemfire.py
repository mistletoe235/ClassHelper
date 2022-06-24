import psycopg2
from get_news import allnews , issaved
#数据库连接信息
db = psycopg2.connect(
                        user="",
                        password="",
                        host="47.102.127.65",
                        port=5433,
                        dbname="")

cursor = db.cursor()

for i in range(15):
    if(not issaved[i]):
        newsid = allnews[i]['newsid']
        title = "'"+allnews[i]['title']+ "'"
        author = "'" +allnews[i]['author'] + "'"
        time = "'" + allnews[i]['time'] + "'"
        detail = "'" + allnews[i]['detail'] + "'"
        seq = (newsid, title, author, time, detail)
        sqlstr = "INSERT INTO news(newsid,title,author,time,detail) VALUES ({})".format( ','.join(seq) )
        print(sqlstr)
        cursor.execute(sqlstr)



db.commit()

 
# 关闭数据库连接
db.close()