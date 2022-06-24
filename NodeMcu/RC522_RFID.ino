
#include <ESP8266WiFi.h>
const char* ssid = "test";                  //WIFI名称和密码
const char* password = "testtest";


#include <PubSubClient.h>
#define  mqtt_server   ""       //百度天工物接入MQTT网址，到 https://console.bce.baidu.com/iot2/hub/ 注册
#define  port  1883                  //端口号 
#define  clientId            ""     //登录的id
#define  mqtt_username       ""        //用户名
#define  mqtt_password       "c"      //密码



WiFiClient espClient;
PubSubClient client(espClient);




char msg_buf[200];  
char dataTemplate1[] = "{\"id\":%d}"; //信息模板1
char msgJson[75];                                 //要发送的json格式的数据
unsigned short json_len = 0;                      //json长度

int id = 0;



void setup_wifi() {

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


//消息回调函数，即接收消息后的函数
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();


}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Attempt to connect
    if (client.connect(clientId, mqtt_username, mqtt_password)) {
      Serial.println("connected");
    } 
    
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}




#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 15
#define RST_PIN 0

MFRC522 rfid(SS_PIN, RST_PIN); //实例化类

// 初始化数组用于存储读取到的NUID 
byte nuid[4];

void setup() { 
  Serial.begin(9600);

  setup_wifi();           //设置wifi的函数，连接wifi
  client.setServer(mqtt_server, port);//设置mqtt服务器
  client.setCallback(callback); //mqtt消息处理


  
  SPI.begin(); // 初始化SPI总线
  rfid.PCD_Init(); // 初始化 MFRC522 
}

void loop() {
  digitalWrite(2, LOW);
  if (!client.connected()) {
    reconnect();
  }

  client.loop();



  // 找卡
  if ( ! rfid.PICC_IsNewCardPresent())
    return;

  // 验证NUID是否可读
  if ( ! rfid.PICC_ReadCardSerial())
    return;

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);


  // 将NUID保存到nuidPICC数组
  for (byte i = 0; i < 4; i++) {
    nuid[i] = rfid.uid.uidByte[i];
  }   

  Serial.print("十进制UID：");
    id = 0;
    id = 16777216*nuid[0]+65536*nuid[1]+256*nuid[2]+nuid[3];
    char strid[10];
    itoa(id,strid,10);

    Serial.print(id,DEC);
    Serial.println();

  // 使放置在读卡区的IC卡进入休眠状态，不再重复读卡
  rfid.PICC_HaltA();

  // 停止读卡模块编码
  rfid.PCD_StopCrypto1();

  if(id>0)  {
    String str;
    for(int i =0;i<strlen(strid);i++){        
        str += String((char)strid[i]);
    }
    const char * message = str.c_str();

    client.publish("aid",message);
  }

  delay(1000);
  
}
