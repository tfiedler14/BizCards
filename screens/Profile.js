import React from 'react'
import styled, { css } from "@emotion/native"
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Card, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux'
import { FloatingAction } from "react-native-floating-action";
import firebase from 'firebase'
import * as firebaseApp from "firebase"

import * as WebBrowser from 'expo-web-browser';
import { isMoment } from 'moment';
require('firebase/auth')

class Profile extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		const userID = this.props.navigation.getParam('userUid');
		this.userInfo = firebaseApp.database().ref("/users/" + userID);
		this.state = {
			isLoading: true,
			profile: [
				{ FullName: "" },
				{ Email: "", checked: true },
				{ Mobile: "", checked: false },
				{ Bio: "", checked: false }
			],
			socialMedias: [],
			timeStamp: ""
		}
	}

	componentDidMount() {
		this._isMounted = true;
		setTimeout(() => {
			if (this._isMounted) {
				this.setState({
					isLoading: false
				});
			}
		}, 10)
		this.listenForUser(this.userInfo)
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async listenForUser(userInfo) {
		tempState = []
		var loadprofile = []
		var loadsocialMedias = []
		var time = ""
		// console.log("USRINFO", userInfo)
		// console.log("PROPS", this.props)

		await userInfo.on("value", dataSnapshot => {
			dataSnapshot.forEach(child => {
				if (child.key == 'profile') {
					var proArray = child.val()
					proArray.forEach((item) => {
						loadprofile.push(item)
					})
				}
				else if (child.key == 'medias') {
					var mediaArray = child.val()
					mediaArray.forEach((item) => {
						loadsocialMedias.push(item)
					})
				} else {
					time = child.val()
				}
			})
			// console.log("nestedPro", loadprofile)
			if (this._isMounted) {
				this.setState({
					profile: loadprofile,
					socialMedias: loadsocialMedias,
					timeStamp: time
				})
			}
			// console.log(this.state)

			// console.log("IP", this.state.profile[0].FullName)
			// console.log("nestedMed", loadsocialMedias)

		})


		// console.log("profile", loadprofile)
		// console.log("medias", loadsocialMedias)

		// console.log("state", this.state)

	}

	handleSignout = () => {
		firebase.auth().signOut()
		this.props.navigation.navigate('Login')
	}

	render() {
		const userUid = this.props.navigation.getParam('userUid'); //added

		const actions = [
			{
				text: "Set Card",
				icon: require("../assets/addCardIcon.png"),
				name: "card_Add",
				color: '#032c8e',
				buttonSize: 50,
				size: 45,
				position: 2
			},
			{
				text: "Modify Profile",
				icon: require("../assets/editCardIcon.png"),
				name: "card_Modify",
				color: '#032c8e',
				buttonSize: 50,
				size: 45,
				position: 1
			}
		];

		if (this.state.isLoading) {
			return (
				<View style={styles.loading} >
					<ActivityIndicator size='large' color='#C2185B' />
				</View>
			);
		}

		return (
			<Container>
				<Titlebar>
					<Avatar source={require("../assets/profile.png")} />
					<Title>Welcome back,</Title>
					<Name>{this.props.user.name}</Name>

				</Titlebar>
				<View >
					<Card
						title='Current Card'
						titleStyle={{ color: '#137AC2' }}
						containerStyle={styles.primaryCard} >
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
							<View style={styles.imageContainer}>
								<Image
									source={require("../assets/defaultProfPic.png")}
									style={styles.imageView}>
								</Image>
							</View>
							<View style={{ flexDirection: 'column', alignItems: 'flex-start' }} >
								<View style={styles.cardStyle}>
									<Text style={styles.text}>Email: </Text>
									<Text style={{ fontWeight: "bold", }}>{this.state.profile[1].Email}</Text>
								</View>
								<View style={styles.cardStyle}>
									<Text style={styles.text} >Mobile: </Text>
									<Text style={{ fontWeight: "bold", }}>{this.state.profile[2].Mobile}</Text>
								</View>
								<View style={styles.cardStyle}>
									<Text style={styles.text}  >Bio: </Text>
									<Text style={{ fontWeight: "bold", }}>{this.state.profile[3].Bio}</Text>
								</View>
							</View>
						</View>
					</Card>
				</View>
				<View >
					<QRCodeBlock style={styles.qrcodeContainer} >
						<TouchableOpacity onPress={this._handlePressButtonAsync}>
							<QRCode
								logo={require("../assets/profile.png")}
								codeStyle='square'
								content={`http://bizcards.tools/profile/${userUid}`}
							/>
						</TouchableOpacity>
					</QRCodeBlock>
				</View>
				<TouchableOpacity
					onPress={() => this.props.navigation.navigate('Settings')}
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						width: 70,
						position: 'absolute',
						top: 40,
						right: 10,
						height: 70,
					}}
				>
					<AddIcon source={require("../assets/gear.png")} />
				</TouchableOpacity>
				<FloatingAction
					actions={actions}
					color="#032c8e"
					overlayColor="rgba(244, 244, 255, 0.6)"
					onPressItem={name => {
						if (name === "card_Add")
							this.props.navigation.navigate('CreateCard')
						if (name === "card_Modify")
							this.props.navigation.navigate({
								routeName: 'EditProfile',
							})
					}}
				/>
			</Container>
		)

	}

	_handlePressButtonAsync = async () => {
		const userUid = this.props.navigation.getParam('userUid'); //added
		let result = await WebBrowser.openBrowserAsync('http://bizcards.tools/profile/' + userUid);
		this.setState({ result });
	};
}

const Container = styled.View`
	flex: 1;
	background-color: white;
`

const QRCodeBlock = styled.View`
	padding-top: 5%;
`

const Titlebar = styled.View`
	width: 100%;
	margin-top: 50px;
	padding-left: 80px;
`

const Avatar = styled.Image`
	width: 44px;
	height: 44px;
	margin-left: 20px;
	position: absolute;
	top: 0;
	left: 0;
`

const AddIcon = styled.Image`
	width: 30px;
	height: 30px;
`

const LogOut = styled.Text`
	font-size: 15px;
	font-weight: 500;
	width: 60px;
	height: 60px;
	margin-top: 20px;
	margin-right: 20px;
	position: absolute;
	color: #032c8e,
	top: 0;
	right: 0;
`

const Title = styled.Text`
	font-size: 20px;
	font-weight: 500;
	color: #b8bece;
`

const Name = styled.Text`
	font-size: 20px;
	color: #333333;
	font-weight: bold;
`

const styles = StyleSheet.create({
	LogOut: {
		color: "black",
		right: 0
	},
	qrcodeContainer: {
		alignItems: 'center',
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	primaryCard: {
		borderColor: "#137AC2",
		borderWidth: 5,
		backgroundColor: "#FFF",
		borderRadius: 8,
		padding: 10,
		margin: 10,
	},
	cardStyle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	imageView: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		left: 0,
		width: 90,
		height: 90,
		resizeMode: 'contain',
		borderRadius: 15,
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#1A1E9C'
	}
})

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Profile)