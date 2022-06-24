FROM tiangolo/uwsgi-nginx-flask:python3.8

COPY ./app /app

RUN pip install -r /app/requirements.txt && pip install opencv-python && apt update && apt install libgl1-mesa-glx -y