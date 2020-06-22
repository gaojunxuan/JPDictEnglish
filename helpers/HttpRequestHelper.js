import md5 from 'react-native-md5';
import axios from 'axios';

const appid = "20160211000011632";
const key = "NvduVsfjpNEclI03Sbei";
export class HttpRequestHelper {
    static jpToCn(text, callback) {
        var random = (Math.abs(Math.random() * 10000000000)) | 0;
        var sign = md5.hex_md5(appid + text + random + key);
        var uri = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${escape(text)}&from=jp&to=zh&appid=${appid}&salt=${random}&sign=${sign}`;
        var request =  axios.get(uri)
                            .then((response) => { callback(response.data) } )
                            .catch((error) => console.error(error)); 
    }
    static cnToJp(text, callback) {
        var random = (Math.abs(Math.random() * 10000000000)) | 0;
        var sign = md5.hex_md5(appid + text + random + key);
        var uri = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${escape(text)}&from=zh&to=jp&appid=${appid}&salt=${random}&sign=${sign}`;
        var request =  axios.get(uri)
                            .then((response) => { callback(response.data) } )
                            .catch((error) => console.error(error)); 
    }
    static translate(text, src, dst, callback, errorCallback=(e) => console.log(e)) {
        var random = (Math.abs(Math.random() * 10000000000)) | 0;
        var sign = md5.hex_md5(appid + text + random + key);
        var uri = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${escape(text)}&from=${src}&to=${dst}&appid=${appid}&salt=${random}&sign=${sign}`;
        var request =  axios.get(uri)
                            .then((response) => { callback(response.data) } )
                            .catch((error) => errorCallback(error)); 
    }
    static getEasyNews(callback, errorCallback=(e) => console.log(e)) {
        var request =  axios.get("https://slwspfunc.azurewebsites.net/api/GetNHKEasyNews?code=85lAgvwtrq9DfbDWpH6krQtNL8UkRtTsIjFuE7uyXVGfZLCrFt6VTw==")
                            .then((response) => callback(response.data))
                            .catch((error) => errorCallback(error)); 
    }
    static getDailySentences(callback, errorCallback=(e) => console.log(e)) {
        for (var i = 0; i < 3; i++) {
            var list = [];
            var request =  axios.get("http://api.skylark-workshop.xyz/api/GetDailySentence?code=fi6c4bz3w5LkUnl8hGT0V4n/PoKBq7KH3Ly8za8HC4b/r8QRfj/zzw==&index=" + i.toString())
                                .then((response) => { list.push(response.data); callback(list); } )
                                .catch((error) => errorCallback(error)); 
        }
        
    }
    static getNHKRadioNews(callback, errorCallback=(e) => console.log(e)) {
        var request =  axios.get("http://api.skylark-workshop.xyz/api/GetNHKRadio?code=NjIR9q6QzPOo29fPMCIZhuyie35aFxAgikYYwV5oFw5QzMVaUtSo6A==&getItemsCount=true")
                            .then((response) => {
                                var list = [];
                                for(var i = 0; i < response.data; i++) {
                                    var itemRequest =  axios.get(`http://api.skylark-workshop.xyz/api/GetNHKRadio?code=NjIR9q6QzPOo29fPMCIZhuyie35aFxAgikYYwV5oFw5QzMVaUtSo6A==&speed=normal&index=${i}`)
                                                            .then((itemResponse) => { 
                                                                list.push(itemResponse.data);
                                                                callback(list);
                                                             })
                                                            .catch((itemError) => console.error(itemError)); 
                                }
                            })
                            .catch((error) => errorCallback(error)); 
    }
}