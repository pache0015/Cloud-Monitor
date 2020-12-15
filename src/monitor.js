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

function poll(serviceName, url, currentNotification, priorNotification) {

    axios.get(url).then(res => {


        if (res.status ==200){

            statusChanger(currentNotification, true)

            if ( !(currentNotification.value===priorNotification.value) ){
                notificarPorDiscord(serviceName, "está activo");
                console.log(serviceName, "está activo" );
                statusChanger(priorNotification, currentNotification.value);
                statusChanger(currentNotification, true);
            }
        }
    }).catch( error => {
        console.log(error);
    })
}

app.listen(port);