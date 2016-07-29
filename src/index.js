var APP_ID = UNDEFINED;

var AlexaSkill = require('./AlexaSkill');
var https = require('https');

var GameShelf = function() {
  AlexaSkill.call(this, APP_ID);
};

GameShelf.prototype = Object.create(AlexaSkill.prototype);
GameShelf.prototype.constructor = GameShelf;

GameShelf.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
  + ", sessionId: " + session.sessionId);
};

GameShelf.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log("Gameshelf onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  if(!session.user.accessToken) {
    response.tellWithLinkAccount("You must have a linked game shelf account to use this skill. Please use the alexa app to link your account.");
  } else {
    var speechOutput = "Welcome to Game shelf, how many players do you have?";
    var repromptText = "How many players do you have?";

    response.ask(speechOutput, repromptText);
  };
};

GameShelf.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
  + ", sessionId: " + session.sessionId);
};

GameShelf.prototype.intentHandlers = {
  "OneshotGameShelfIntent": function (intent, session, response) {
    if(!session.user.accessToken) {
      response.tellWithLinkAccount("You must have a linked game shelf account to use this skill. Please use the alexa app to link your account.");
    } else {
      if (isNaN(intent.slots.players.value)) {
          repromptText = "How many players do you have?";
          speechOutput = "I'm sorry, I didn't understand that number. " + repromptText;
          response.ask(speechOutput, repromptText);
          return;
      }

      getGameFromGameShelf(intent, session, response);
    };
  },

  "DialogGameShelfIntent": function (intent, session, response) {
    if (isNaN(intent.slots.players.value)) {
        repromptText = "How many players do you have?";
        speechOutput = "I'm sorry, I didn't understand that number. " + repromptText;
        response.ask(speechOutput, repromptText);
        return;
    }

    getGameFromGameShelf(intent, session, response);
  }
};

var getGameFromGameShelf = function(intent, session, response) {
  var options = {
    host: "quiet-refuge-93160.herokuapp.com",
    path: "/api/v1/usersgames/random",
    method: "GET",
    headers: {
      "accessToken": session.user.accessToken,
      "players": intent.slots.players.value
    }
  }

  https.get(options, function(res) {
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function() {
      var parsed = JSON.parse(body);
      console.log(parsed.game.name);
      if(parsed.game.name === undefined) {
        var answer = "Sorry, I couldn't find a game that matches your needs."
        response.tellWithCard(answer, "Gameshelf", answer);
      } else {
        var answer = "You should play " + parsed.game.name
        response.tellWithCard(answer, "Gameshelf", answer);
      }
    });
  })

  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};

exports.handler = function (event, context) {
  var gameshelf = new GameShelf();
  gameshelf.execute(event, context);
};
