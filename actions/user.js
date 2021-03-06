import Firebase, { db } from '../config/Firebase.js'
import * as firebaseApp from "firebase"
import moment from 'moment';
// define types

export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_CONFIRM_PASSWORD = 'UPDATE_CONFIRM_PASSWORD'
export const UPDATE_NAME = 'UPDATE_NAME'
export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'

// actions
const date = moment().format('YYYY-MM-DD hh:mm:ss')
export const updateEmail = email => {
	return {
		type: UPDATE_EMAIL,
		payload: email
	}
}

export const updatePassword = password => {
	return {
		type: UPDATE_PASSWORD,
		payload: password
	}
}

export const updateConfirmPassword = cfrmPassword => {
	return {
		type: UPDATE_CONFIRM_PASSWORD,
		payload: cfrmPassword
	}
}

export const updateName = name => {
	return {
		type: UPDATE_NAME,
		payload: name
	}
}

export const login = () => {
	return async (dispatch, getState) => {
		try {
			const { email, password } = getState().user
			if(email === undefined){
				throw "Email is Required!"
			}
			if(password === undefined){
				throw "Password is Required!"
			}
			const response = await Firebase.auth().signInWithEmailAndPassword(email, password)

			dispatch(getUser(response.user.uid))
		} catch (e) {
			alert(e)
		}
	}
}

export const getUser = uid => {
	return async (dispatch, getState) => {
		try {
			const user = await db
				.collection('users')
				.doc(uid)
				.get()

			dispatch({ type: LOGIN, payload: user.data() })
		} catch (e) {
			alert(e)
		}
	}
}

export const signup = (user) => {
	return async (dispatch, getState) => {
		try {
			const { email, password, cfrmPassword, name } = getState().user
			const response = user
			if (response.user.uid) {

				const user = {
					uid: response.user.uid,
					name: name,
					email: email
				}
				db.collection('users')
					.doc(response.user.uid)
					.set(user)

				firebaseApp.database().ref().child("users/" + user.uid).set({
					profile:[
						{
						   FullName: user.name
						},
						{
						   Email: user.email,
						   checked:true
						},
						{
						   Mobile:"",
						   checked:false
						},
						{
							Bio: "",
							checked: false
						}
					 ],
					 medias:[{}],
					 timeStamp: date
				});

				dispatch({ type: SIGNUP, payload: user, payload: name })
			}
		} catch (e) {
			alert(e)
		}
	}
}
