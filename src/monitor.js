const express = require('express')
const app = express();
const axios = require('axios');
const rp = require('request-promise');
const port = 8081;



function event(){
    let date = new Date();
    return (date.getFullYear()
        + "-"
        + date.getMonth()
        + "-"
        + date.getDate()
        + " "
        + date.getHours()
        + ":"
        + date.getMinutes()
        + ":"
        + date.getSeconds())
}

const notify = function(service, status) {

    const url = "https://discord.com/api/webhooks/783469293986644018/8C1f0f5OimTVC5gXsI7LUL83ohu_a5obw0A0XtUoDeJ9kQNKhMomk1TSHKTjLzNBvBP3";
    axios
        .post(url, {
            "content": `[${event()}] ${service} ${status}`})
        .catch(error => console.error(error));
}

app.listen(port);