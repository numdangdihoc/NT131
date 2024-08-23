// Require would make available the 
// express package to be used in 
// our code 
const express = require("express"); 
  
// Creates an express object 
const app = express(); 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');

var temp_global = 0;
var humi_global = 0;
var CO_global = 0;
var dust_global = 0;
//-----
var init_flag = 0;
var temp_max = temp_min = -100;
var humi_max = humi_min = -100;
var CO_max = CO_min = -100;
var dust_max = dust_min = -100;

var temp_js = {"max": temp_max, "min": temp_min, "date_max":"", "date_min":""} ;
var humi_js = {"max": humi_max, "min": humi_min,"date_max": "", "date_min":""};
var CO_js = {"max": CO_max, "min": CO_min,"date_max":"","date_min":""};
var dust_js = {"max": dust_max, "min": dust_min, "date_max":"", "date_min":""};
// ---- record
const MAX_RECORDS = 10;
let temperatureRecords = [];
let humiRecords = [];
let CoRecords = [];
let dustRecords = [];
let arrayCount = 0;
//-----
// It listens to HTTP get request.  
// Here it listens to the root i.e '/' 
const publicPath = 'E:/Code/NhungNhung';
//const publicPath = '/var/www/html/nt131';
app.use(express.static(publicPath))
app.get('/', (req, res) => {
    //const indexPath = '/var/www/html/nt131/index.html';
    const indexPath = 'E:/Code/NhungNhung/index.html';
    res.sendFile(indexPath);
});
app.get('/api/data', (req, res) => {
    
    const data = {
        temp: temp_global,
        humi: humi_global,
        CO_ppm: CO_global,
        dust_ppm: dust_global
    };
   
    res.json(data);
});
app.post('/api/data', (req, res) => {
    // Lấy dữ liệu gửi lên từ yêu cầu POST
    const {temp, humi,co, dust} = req.body;
    console.log(temp, humi, co, dust);
    temp_global = temp;
    humi_global = humi;
    CO_global = co;
    dust_global = dust;
    var date = new Date();
    date = formatDate(date);
    if(init_flag === 0){
        init_flag = 1;
        temp_max = temp_min = temp;
        humi_max = humi_min = humi;
        CO_max = CO_min = co;
        dust_max = dust_min = dust;
        temp_js = {"max": temp_max, "min": temp_min, "date_max": date,"date_min":date} ;
        humi_js = {"max": humi_max, "min": humi_min, "date_max": date,"date_min":date};
        CO_js = {"max": CO_max, "min": CO_min, "date_max": date, "date_min":date};
        dust_js = {"max": dust_max, "min": dust_min, "date_max": date,"date_min":date};
    }
    else {
        updateMinMax(temp, humi, co, dust, date);
    }
    var tmp_re = [date, temp];
    var hum_re = [date, humi];
    var co_re = [date, co];
    var dus_re = [date, dust]
    addTemperatureRecord(tmp_re, hum_re, co_re, dus_re);
    
    // Trả về dữ liệu nhận được dưới dạng JSON
    //res.json(receivedData);
    
    console.log(temperatureRecords);
    res.send(`200 OK with ${temp}- ${humi}-${co} and ${dust} at  ${date} `);
});
// -------- min max showing
app.get('/api/maxmin', (req, res) => {
    
    const data = {
        temp: temp_js ,
        humi: humi_js,
        CO: CO_js,
        dust: dust_js 
    }
    res.json(data);
});

//---
app.get('/api/record',(req, res) =>{
    const data = {
        temp: temperatureRecords,
        humi: humiRecords,
        CO: CoRecords,
        dust: dustRecords
    }
    res.json(data);

});
//----
function updateMinMax(val_temp, val_humi, val_co, val_dust, date){
    // min 
    if(val_temp < temp_min) {
        temp_min = val_temp;
        temp_js["min"] = temp_min;
        temp_js["date_min"] = date;
    }
    if (val_co < CO_min) {
        CO_min = val_co;
        CO_js["min"] = CO_min;
        CO_js["date_min"] = date;
     }
    if(val_humi < humi_min){
        humi_min = val_humi;
        humi_js["min"] = humi_min;
        humi_js["date_min"] = date;
    }
    if(val_dust < dust_min) {
        dust_min = val_dust;
        dust_js["min"] = dust_min;
        dust_js["date_min"] = date;
        
    }

    //----- max update -----
    if(val_temp > temp_max) {
        temp_max = val_temp;
        temp_js["max"] = temp_max;
        temp_js["date_max"] = date;
    }
    if (val_co > CO_max) {
        CO_max = val_co;
        CO_js["max"] = CO_max;
        CO_js["date_max"] = date;
     }
    if(val_humi > humi_max){
        humi_max = val_humi;
        humi_js["max"] = humi_max;
        humi_js["date_max"] = date;
    }
    if(val_dust > dust_max) {
        dust_max = val_dust;
        dust_js["max"] = dust_max;
        dust_js["date_max"] = date;
        
    }

    

};

function formatDate(date) {
    // Tính toán múi giờ hiện tại và múi giờ GMT+7
    const localOffset = date.getTimezoneOffset();
    const gmt7Offset = -7 * 60; // GMT+7 làm tiêu chuẩn
    const offsetDiff = localOffset - gmt7Offset;

    // Chuyển múi giờ
    const localTime = date.getTime();
    const gmt7Time = localTime + offsetDiff * 60 * 1000;
    const gmt7Date = new Date(gmt7Time);

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const day = String(gmt7Date.getDate()).padStart(2, '0');
    const month = String(gmt7Date.getMonth() + 1).padStart(2, '0');
    const year = gmt7Date.getFullYear();
    const hours = String(gmt7Date.getHours()).padStart(2, '0');
    const minutes = String(gmt7Date.getMinutes()).padStart(2, '0');
    const seconds = String(gmt7Date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
//-----
function addTemperatureRecord(temp, humi, co, dust) {
    if (arrayCount === MAX_RECORDS) {
        temperatureRecords.shift(); // Xóa phần tử cũ nhất
        CoRecords.shift();
        humiRecords.shift();
        dustRecords.shift();
    } else {
        arrayCount++;
    }
    temperatureRecords.push(temp);
    humiRecords.push(humi);
    CoRecords.push(co);
    dustRecords.push(dust);
    
}


app.listen(3000, () => { 
  
  // Print in the console when the 
  // servers starts to listen on 3000 
  console.log("Listening to port 3000"); 
});