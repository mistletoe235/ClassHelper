import os
from fastapi import FastAPI
import psycopg2


app = FastAPI()



@app.get("/list")
async def root():


    db = psycopg2.connect(
                        user="",
                        password="",
                        host="",
                        port=5433,
                        dbname="")

    cursor = db.cursor()  
    getlist = 'SELECT title,time,detail FROM news ORDER BY newsid DESC LIMIT 30;'
    cursor.execute(getlist)
    
    rows=cursor.fetchall()
    print(rows)
    db.close()
    return rows