// 云函数入口文件
const cloud = require('wx-server-sdk')
const JSEncrypt = require('node-jsencrypt')
cloud.init()


var pubkey = "";
    pubkey = '-----BEGIN PUBLIC KEY-----';
    pubkey += 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD5uIDebA2qU746e/NVPiQSBA0Q';
    pubkey += '3J8/G23zfrwMz4qoip1vuKaVZykuMtsAkCJFZhEcmuaOVl8nAor7cz/KZe8ZCNIn';
    pubkey += 'bXp2kUQNjJiOPwEhkGiVvxvU5V5vCK4mzGZhhawF5cI/pw2GJDSKbXK05YHXVtOA';
    pubkey += 'mg17zB1iJf+ie28TbwIDAQAB';
    pubkey += '-----END PUBLIC KEY-----';


function unlock (content) {
            var encryptor = new JSEncrypt() // 创建加密对象实例
            encryptor.setPublicKey(pubkey) //设置公钥
            return encryptor.encrypt(content) // 对内容进行加密
        }
// 云函数入口函数
exports.main = async (event, context) => {

  return {
    enusernm:unlock(event.username),
    enpasswd:unlock(event.password)
  }
}