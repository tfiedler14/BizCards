![alt text](https://github.com/tfiedler14/BizCards/blob/master/assets/logo1.png "Bizcards")

# BizCards
A quick way to create an online presence and connect with potential employers. 

# Problem/Objectives
College students have a lot of pressure to network and form relationships with potential employers. Students spend time and money writing and printing business cards, cover letters, and resumes. 

Recruiters get stacks of business cards, resumes and a mountain of unstructured emails with networking materials which creates a need for organization. This application creates a uniform way to receive students’ contact information and qualifications. 

Our application allows users to create an electronic business card to facilitate networking connections. 

# Prototype 
![alt text](https://github.com/tfiedler14/BizCards/blob/master/assets/finDesign.png "prototype")

# Current Design 
![alt text](https://github.com/tfiedler14/BizCards/blob/master/assets/curDesign.png "prototype")
*for brevity some of the screen weren't included*
# WebUI For Profile
![alt text](https://github.com/tfiedler14/BizCards/blob/master/assets/WebGUI.png "prototype")

# Implementation
1. React Native
  - Works both for iOS and Android 
  
2. Firebase
  - Authorization
  - Database
  
3. Website (Heroku, NodeJS, Bootstrap, EJS)
  - Introduction of the app- http://bizcards.tools/
  - Shows a user information


# Some Notes
1. Limitation
  - Due to the  circumstance, we were unable to implement some of our stretch goal functionality.

# Usage
Permission is need to build off this repo.


# Run The code:
#### create .env file (follow .env-example syntax)
#####
###### API_KEY=XXXXXXXX
###### AUTH_DOMAIN=XXXXXXX
###### DATABASE_URL=XXXXX
###### PROJECT_ID=XXXXX
###### MESSAGE_SENDER_ID=XXXXXX
###### APP_ID=XXXXX
#####
#### place .env in the same location as .env-example (Mac view hidden files: CMD Shift .)
#### Run yarn install; yarn start
###### (IF YOU HAVE NODE MODULES)--> rm -rf node_modules && yarn install; expo install react-native-gesture-handler; yarn start
#### If you have any issues clear your watchman cache and it should work 

# Attributions
Login and Signup were adapted from https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574 

Change password/email was adapted from https://github.com/ProProgramming101/expo-firebase-auth-change-password/blob/master/screens/TestScreen.js 

