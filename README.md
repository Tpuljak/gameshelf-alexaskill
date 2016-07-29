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
2. Create a new lambda function. Please refer to [Amazon's Instructions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function)
    -  Do not upload your code just yet. Select inline, and leave what is in the box.
5. Create a new skill in the developer portal. Please refer to [Amazon's Instructions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/deploying-a-sample-skill-to-aws-lambda#Creating a New Skill for the Sample on the Developer Portal)
6. Make the following edits to your index.js file
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
7. Zip up the index.js, and AlexaSkill.js
8. Go back to [Amazon Lambda](https://console.aws.amazon.com/lambda), and upload the zip file

### If you are using your own Login with Amazon settings
1. Go to the [Amazon's Developer Console](https://developer.amazon.com/), and navigate to your Login With Amazon Settings (Under Apps & Services)
2. Navigate to the Web settings
3. Add `https://amazon.com`, and your site url as Allowed Origins
4. Add your skill's return URL (example: `https://pitangui.amazon.com/api/skill/link/SOMERNAOMDNUMBER`), and your site's callback URL (example: `https://YOURSITE.COM/users/auth/amazon/callback`)in the Allowed Return URLS
5. Navigate to your Alexa skill
6. Go to the configuration tab, and change Account Linking to 'Yes'
7. Set your URL to the following, filling in the CAPS sections with your own information: `https://www.amazon.com/ap/oa?client_id=CLIENTID&scope=profile&response_type=code&redirect_uri=REDIRECTURL`
8. Enter in your client ID from the Login with Amazon information
9. Set the Scope to be `profile:user_id`
10. Select Auth Code Grant
11. Set Access Token URI to `https://api.amazon.com/auth/o2/token`
12. Paste your client secret from your Login with Amazon information
