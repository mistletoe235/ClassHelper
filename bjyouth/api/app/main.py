import os
import bjyouth
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/get/')
async def hello_world():
    
    u = request.args.get('username')
    p = request.args.get('password')
    res = await bjyouth.main(u,p)
    return res

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 80)))