const express = require('express')
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router();
//const rp = require('request-promise');

const port = 8081;
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/api', router);

let monitoringIsActivated = true;

let currentunqNotification = {value:true};
let currentloggerNotification = {value:true};
let currentnewsletterNotification = {value:true};

let priorunqNotification = {value:null};
let priorloggerNotification = {value:null};
let priornewsletterNotification = {value:null};


function statusChanger(varObj, newValue) {
    varObj.value = newValue;
}

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
function inspectServices(){
    poll("UNQfy", 'http://localhost:8080/api/activated', currentunqNotification, priorunqNotification);
    //poll("Logger", 'http://localhost:8083/logging/isAlive', currentloggerNotification, priorloggerNotification);
    //poll("Newsletter", 'http://localhost:8085/api/isAlive', currentnewsletterNotification, priornewsletterNotification);
}
router.get("/status", (req,res) => {
    res.status(200);
    inspectServices();
})

router.get("/activate", (req,res) => {
    res.status(200);
    monitoringIsActivated = true;
    res.json("Monitoring activated");
})
router.get("/deactivate", (req,res) => {
    res.status(200);
    monitoringIsActivated = false;
    res.json("Monitoring is not activated");
})

function poll(serviceName, url, currentNotification, priorNotification) {
    axios.get(url).then(res => {
        if (res.status ==200){
            statusChanger(currentNotification, true)
            if ( !(currentNotification.value===priorNotification.value) ){
                notify(serviceName, "Is activated");
                statusChanger(priorNotification, currentNotification.value);
                statusChanger(currentNotification, true);
            }
        }
    }).catch( error => {
        statusChanger(currentNotification, false)
        if ( !(currentNotification.value===priorNotification.value) ){
            notify(serviceName, "Is not activated");
            statusChanger(priorNotification, currentNotification.value);
            statusChanger(currentNotification, false);
        }
    })
}

const inspectStatus = function(){
    if(monitoringIsActivated){
        inspectServices()
    }
}
setInterval(inspectStatus, 5000);

const server = app.listen(port, () => {
    console.log("Server running");
});