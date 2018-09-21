'use strict';

const functions = require('firebase-functions');
const {actionssdk} = require('actions-on-google');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
      reset(agent);
      agent.add(`Welcome to my agent!`);
  }
  
  function reset(agent) {
      agent.data = { count: 0 };
      console.log("reset");
  }
 
  function fallback(agent) {
      agent.add(`I'm sorry, can you try again?`);
  }
  
  function anotherTask(agent) {
    //   let conv = agent.conv();
    //   conv.ask('Please choose an item:');
    //   agent.add(conv);
      
      const count = addOne(agent);
      agent.add(`${count}`);
  }

  function addOne(agent) {
      const countObj = agent.getContext('count');

      var count = 1;
      if (countObj !== null) count = countObj.parameters.count + 1;
      
    agent.setContext({
        name: 'count',
        lifespan: 1,
        parameters:{'count': count}
    });
      
      return count;
  }

  function resetTask(agent) {
      reset(agent);
      agent.add(`reseted`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('another', anotherTask);
  intentMap.set('reset', resetTask);
  agent.handleRequest(intentMap);
});

