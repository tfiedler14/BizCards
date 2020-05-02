import React from 'react'
import styled, { css } from "@emotion/native"
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Button } from 'react-native'
import { Card } from 'react-native-elements';
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/auth')

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPassword: "",
            newPassword: "",
            newEmail: "",
        };
    }

	handleSignout = () => {
		firebase.auth().signOut()
		this.props.navigation.navigate('Login')
    }
    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
      }
    onChangePassword = () => {
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = firebase.auth().currentUser;
          user.updatePassword(this.state.newPassword).then(() => {
            Alert.alert("Password was changed");
          }).catch((error) => { console.log(error.message); });
        }).catch((error) => { console.log(error.message) });
      }
    
    onChangeEmail = () => {
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = firebase.auth().currentUser;
          user.updateEmail(this.state.newEmail).then(() => {
            Alert.alert("Email was changed");
          }).catch((error) => { console.log(error.message); });
        }).catch((error) => { console.log(error.message) });
      }

	render() {
		return (
			<Container style={styles.container}>
				<Titlebar>
					<Avatar source={require("../assets/profile.png")} />
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                        <Title>Cancel</Title>
                    </TouchableOpacity>
				</Titlebar>
                <TouchableOpacity
                   onPress={this.handleSignout}
                   style={{
                       alignItems:'center',
                       justifyContent:'center',
                       width:70,
                       position: 'absolute',                                          
                       top: 40,                                                    
                       right: 10,
                       height:70,
                     }}
                >
                <AddIcon source = {require("../assets/logOut.png")} />
                </TouchableOpacity>
				<View style={styles.primaryContainer}>
                    <Text>Enter password to change password or email</Text> 
                <TextInput style={styles.textInput} value={this.state.currentPassword}
                placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
                onChangeText={(text) => { this.setState({currentPassword: text}) }}
                />

                <TextInput style={styles.textInput} value={this.state.newPassword}
                placeholder="New Password" autoCapitalize="none" secureTextEntry={true}
                onChangeText={(text) => { this.setState({newPassword: text}) }}
                />

                <Button title="Change Password" onPress={this.onChangePassword} />

                <TextInput style={styles.textInput} value={this.state.newEmail}
                placeholder="New Email" autoCapitalize="none" keyboardType="email-address"
                onChangeText={(text) => { this.setState({newEmail: text}) }}
                />

                <Button title="Change Email" onPress={this.onChangeEmail} />

                <TouchableOpacity style={styles.saveBtn} onPress={() => {
                firebase
                    .auth()
                    .currentUser.delete()
                    .then(this.props.navigation.navigate('Login'))
                    .catch(error => {
                    console.log('User not deleted.');
                    });
                }}>
                    <Text style={styles.saveText}>Delete Account</Text>
                </TouchableOpacity>
                </View>
			</Container>
		)
	}
}

const Container = styled.View`
	flex: 1;
	background-color: white;
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

const LogOut = styled.Image`
	width: 44px;
    height: 44px;
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
    margin-top: 5px;
    color: black;
`

const Name = styled.Text`
	font-size: 20px;
	color: #333333;
	font-weight: bold;
`

const styles = StyleSheet.create({
	container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    header: {
        position: 'absolute',
        top: 0,
        height: 25,
        width: '100%',
        borderBottomColor: "#FFF"
    },
    primaryContainer: {
        position: 'relative',
        top: 50,
        width: '90%',
        marginBottom: 10,
        padding: 0,
        backgroundColor: "#FFF",
    },
    divider: {
        position: 'relative',
        marginTop: 0,
        marginBottom: 10,
        padding: 0,
        width: '75%',
        top: 0
    },
    primaryCard: {
        borderColor: "#FFF",
        backgroundColor: "#032c8e",
        borderRadius: 8,
        padding: 10,
        margin: 0,
    },
    mediaContainer: {
        position: 'relative',
        width: '90%',
        height: '45%',
        marginBottom: 0,
    },
    saveBtn: {
        width: "80%",
        backgroundColor: "#032c8e",
        borderRadius: 25,
        height: 50,
        alignSelf: 'center',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    saveText: {
        color: "white"
    }
})

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Settings)