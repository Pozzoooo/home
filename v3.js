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

  function anotherTask(agent) {
      const count = addOne(agent);
      agent.add(`${count}`);
  }

  function addOne(agent) {
      const countObj = agent.getContext('count');

      var count = 1;
      if (countObj !== null) count = countObj.parameters.count + 1;
      
      agent.setContext({
        name: 'count',
        lifespan: 10,
        parameters:{'count': count}
      });

      return count;
  }

  function resetTask(agent) {
      reset(agent);
      agent.add(`reseted`);
  }

  function reset(agent) {
      agent.setContext({
        name: 'count',
        lifespan: 0
      });
  }

  let intentMap = new Map();
  intentMap.set('another', anotherTask);
  intentMap.set('reset', resetTask);
  agent.handleRequest(intentMap);
});

