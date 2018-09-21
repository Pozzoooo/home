// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {actionssdk} = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const app = actionssdk({debug: true});

app.intent('Default Welcome Intent', (conv) => {
    reset();
    conv.add(`Welcome to my agent!`);
});

app.intent('Default Fallback Intent', (conv) => {
    conv.add(`I'm sorry, can you try again?`);
});

app.intent('another', (conv) => {
    const count = addOne(conv);
    conv.add(`${count}`);
    //   agent.ask(`keep it up!`);
});

app.intent('reset', (conv) => {
    reset(conv);
    conv.add(`reseted`);   
});

function reset(conv) {
    conv.data = { count: 0 };
    console.log("reset");
}

function addOne(conv) {
    if (typeof conv.data == 'undefined') reset(conv);
    const count = conv.data.count + 1;
    conv.data.count = count;
    return count;
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

