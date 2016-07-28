# gameshelf-alexaskill

## Gameshelf Link
[Github Link](https://github.com/kbedell/gameshelf)

## Description
Gameshelf Alexa skill works in conjunction with the Gameshelf Rails application. Users can use the Alexa skill to ask their Echo to retrieve a random game from their list based on the number of players they tell Alexa.

## Functionality
* Users must link to their Gameshelf account the first time through the Link Account Card that is presented in the mobile app Echo App
* Users can either use a 'one-shot' intent or open a dialog to retrieve a random game

## Dependencies
This skill assumes the following:
* You are using the Gameshelf Rails application up, and running
* You've set up login with Amazon on the Game Shelf application
* You are hosting the skill on Amazon Lambda

## Install Instructions
These instructions assume Gameshelf is up, and running with Login with Amazon set-up

1. Clone down the repo from github: https://github.com/kbedell/gameshelf-alexaskill
2. Create a new lambda function. Please refer to [Amazon's Instructions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function) DO NOT UPLOAD YOUR CODE JUST YET! (You can choose inline code, and just leave it as the default.)
3. Create a new skill in the developer portal. Please refer to [Amazon's Instructions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/deploying-a-sample-skill-to-aws-lambda#Creating a New Skill for the Sample on the Developer Portal)
4. Make the following edits to your index.js file
    -  Enter your app id in the APP_ID variable: `var APP_ID = UNDEFINED;`
    -  Update the `getGameFromGameShelf` function to use the host that you are using. By default it points to the current live version of Gameshelf:
    ```
    ...
    var getGameFromGameShelf = function(intent, session, response) {
      var options = {
        host: "YOUR HOST HERE",
        path: "/api/v1/usersgames/random",
        method: "GET",
        headers: {
          "accessToken": session.user.accessToken,
          "players": intent.slots.players.value
        }
      }
    ...
    ```
5. Zip up the index.js, and AlexaSkill.js
6. Go back to [Amazon Lambda](https://console.aws.amazon.com/lambda), and upload the zip file
