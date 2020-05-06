import React from 'react'
import styled, { css } from "@emotion/native"
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native'
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
		this.userID = this.props.navigation.getParam('userUid');
		this.userInfo = firebaseApp.database().ref("/users/" + this.userID);
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

	componentWillMount() {

		setTimeout(() => {
			this.setState({
				isLoading: false,
			})
		},
			10)
	}

	componentWillUpdate(){
		this.userID = this.props.user.uid
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
		userInfoCheck = this.userInfo.toString()
		console.log("listenForuser", userInfoCheck)
		if (userInfoCheck.includes("undefined")) {
			this.userInfo = firebaseApp.database().ref("/users/" + this.props.user.uid)
			userInfo = this.userInfo
		}

		tempState = []
		var loadprofile = []
		var loadsocialMedias = []
		var time = ""

		await userInfo.on("value", dataSnapshot => {
			console.log()
			dataSnapshot.forEach(child => {
				if (child.key == 'profile') {
					var proArray = child.val()
					proArray.forEach((item) => {
						loadprofile.push(item)
					})
				}
				else if (child.key == 'medias') {
					var mediaArray = child.val()
					socialSet = new Set()
					loadsocialMedias = mediaArray.filter(function(item) {
						if(!socialSet.has(item.site)){
							socialSet.add(item.site)
							return true
						}else{
							return false
						}
					})
				} else {
					time = child.val()
				}
			})
			this.setState({
				profile: loadprofile,
				socialMedias: loadsocialMedias,
				timeStamp: time
			})
		})



	}

	handleSignout = () => {
		firebase.auth().signOut()
		this.props.navigation.navigate('Login')
	}

	render() {
		// const userUid = this.props.navigation.getParam('userUid'); //added
		
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

				<ScrollView style={styles.scrollContainer}>
					<View >
						<Card
							title='Current Card'
							titleStyle={{ color: '#137AC2' }}
							containerStyle={styles.primaryCard}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }} >
								<View style={{ width: '50%', left: 0 }}>
									<View style={styles.cardStyle}>
										<Text style={styles.text}>Name: </Text>
										<Text style={{ fontWeight: "bold", }}>{this.state.profile[0].FullName}</Text>
									</View>
									{this.state.profile[1].checked ? (<View style={styles.cardStyle}>
										<Text style={styles.text}>Email: </Text>
										<Text style={{ fontWeight: "bold", }}>{this.state.profile[1].Email}</Text>
									</View> ): <></> }
									
									{this.state.profile[2].checked ? 
									(<View style={styles.cardStyle}>
										<Text style={styles.text} >Mobile: </Text>
										<Text style={{ fontWeight: "bold", }}>{this.state.profile[2].Mobile}</Text>
									</View>) : <></>}

									{this.state.profile[3].checked ? (<View style={styles.cardStyle}>
										<Text style={styles.text}  >Bio: </Text>
										<Text style={{ fontWeight: "bold", }}>{this.state.profile[3].Bio}</Text>
									</View>) : <></>}
								</View>

								<View style={{ width: '50%', right: 0 }}>
									<Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1A1E9C', alignSelf: 'center' }} >Social Media: </Text>
									{(this.state.socialMedias.length === 0) ?
										(<Text></Text>)
										:
										(<FlatList data={this.state.socialMedias} extraData={this.state} keyExtractor={item => item.site} key={item => item.site} renderItem={({ item }) => {
											if(item.checked){
												return(<TouchableOpacity onPress={() => { WebBrowser.openBrowserAsync(item.link) }} style={{ margin: 5, padding: 8, alignItems: 'center', backgroundColor: "#47ceff", borderColor: '#D0D0D0', borderRadius: 10, borderWidth: 1 }}>
												<Text style={{ color: '#FFF', fontWeight: "bold", fontSize: 12 }}>{item.site}</Text>
											</TouchableOpacity>)
											}
										 }} />)
									}
								</View>
							</View>
						</Card>

						<View style={styles.divider}>
							<Text style={{ color: '#137AC2', textAlign: 'center' }}>Want the ability to save multiple custom cards? Start your premium subscription now!</Text>
						</View>
						<View style={{ alignItems: 'center' }}>
							<Card
								title='Scan barcode for access to profile hub'
								titleStyle={{ color: '#137AC2' }}
								containerStyle={styles.primaryCard}
							>
								<View style={{ alignItems: 'center'}}>
									<QRCodeBlock>
										<TouchableOpacity onPress={this._handlePressButtonAsync}>
											{console.log("HELLO", this.userID)}
											{this.userID != undefined ? <QRCode
												logo={require("../assets/profile.png")}
												codeStyle='square'
												content={`http://bizcards.tools/profile/` + this.userID}
											/> : <QRCode
											logo={require("../assets/profile.png")}
											codeStyle='square'
											content={`http://bizcards.tools/profile/` + this.props.user.id}
										/> }
										</TouchableOpacity>
									</QRCodeBlock>
								</View>

							</Card>

						</View>
					</View>


					<TouchableOpacity
						onPress={() => this.props.navigation.navigate('Settings')}
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							width: 70,
							position: 'absolute',
							top: 5,
							right: 10,
							height: 70,
						}}
					>
						<AddIcon source={require("../assets/gear.png")} />
					</TouchableOpacity>

				</ScrollView>
				<FloatingAction
					style={{ marginLeft: 30, }}
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
			</Container >
		)

	}

	_handlePressButtonAsync = async () => {
		var userUid = this.props.navigation.getParam('userUid'); //added
		if(userUid == undefined){
			userUid = this.props.user.uid
		}
		let result = await WebBrowser.openBrowserAsync('http://bizcards.tools/profile/' + userUid);
		this.setState({ result });
	};
}

const Container = styled.View`
	flex: 1;
	background-color: white;
`

const QRCodeBlock = styled.View`
	padding-top: 10%;
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

    divider: {
        position: 'relative',
        marginTop: 10,
        marginBottom: 10,
        padding: 0,
        width: '75%',
		top: 0,
		alignSelf:'center'
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
		alignItems: 'center',
		justifyContent: 'center',
		left: 0,
		marginBottom: 40,
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
	},
	socialMedia: {
		flexDirection: 'column',
	},
	socialCardStyle: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	scrollContainer: {
		flexGrow: 1,
		flexDirection: 'column'
	},
})

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Profile)
