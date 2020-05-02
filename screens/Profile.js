import React from 'react'
import styled, { css } from "@emotion/native"
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { FloatingAction } from "react-native-floating-action";
import firebase from 'firebase'
import * as WebBrowser from 'expo-web-browser';
require('firebase/auth')

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		}
	}
	componentWillMount() {
		setTimeout(() => {
			this.setState({
				isLoading: false
			})
		},
		10)
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

		if(this.state.isLoading) {
			return(
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
							this.props.navigation.navigate('EditProfile')
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
	padding-top: 50%;
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
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 150,
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Profile)
