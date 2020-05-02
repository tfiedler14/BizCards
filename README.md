# BizCards
Customizable Electronic business cards

### Run The code:
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
#
#
#
#
### Barcode Generation Instructions:
###### yarn add react-native-custom-qr-codes-expo
###### import { QRCode } from 'react-native-custom-qr-codes-expo'
###### <QRCode logo={require('./dab.png')} content='http://bizcards.tools/'/>

Login and Signup were adapted from https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574 
Change password/email was adapted from https://github.com/ProProgramming101/expo-firebase-auth-change-password/blob/master/screens/TestScreen.js 

