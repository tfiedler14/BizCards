import React, { Component, Fragment, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, TextInput, Keyboard, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { passwordReset } from '../config/Firebase'

const ForgotPassword = props => {
    const [email, setEmail] = useState('');

    const sendHandler = () => {
        Keyboard.dismiss();
        passwordReset(email).then(function () {
            props.navigation.navigate({
                routeName: 'EmailSent',
                params: {
                    userEmail: email,
                }
            })
        }
        ).catch(function (error) {
            Alert.alert(
                'Invalid Email Address',
                'Please Enter a Valid Email Address',
                [
                    { text: 'OK', onPress: () => { } },
                    //console.log('OK Pressed')
                ],
                { cancelable: false }
            )
        })
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.tinyLogo}
                source={require('../assets/logo1M.png')}
            />
            <Text style={styles.MainText}>Forgot Your Password?</Text>
            <View style={styles.iconContainer}>
                <View style={styles.textInput} >
                    <View><Ionicons style={styles.searchIcon} name="md-mail" size={30} /></View>
                    <TextInput
                        style={styles.textStyle}
                        placeholder="Please enter email"
                        placeholderTextColor="#8BB8CE"
                        onChangeText={text => setEmail(text)}
                        underlineColorAndroid="transparent"
                        autoCapitalize='none'
                    />
                </View>
            </View>
            <TouchableOpacity
                style={styles.sendButton}
                title='Submit'
                color="#2E8B57"
                onPress={sendHandler}
                color='black'
            >
                <Text style={styles.sendText}>Reset Your Password</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button
                    title="Remembered Your Password? Login"
                    onPress={() => { props.navigation.navigate('Login') }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tinyLogo: {
        marginBottom: 30
    },
    MainText: {
        fontWeight: "bold",
        height: 50,
        color: "black",
        fontSize: 30,
        marginLeft: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonContainer: {
        width: 250,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    textInput: {
        flexDirection: 'row',
        width: "80%",
        fontWeight: 'bold',
        backgroundColor: "#EFEFEF",
        color: "#032c8e",
        borderRadius: 20,
        height: 55,
        width: 300,
        marginBottom: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton: {
        width: "80%",
        backgroundColor: '#032c8e',
        borderRadius: 20,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    sendText: {
        color: 'white',
        fontSize: 15,
    },
    buttonContainer: {
        margin: 10,
    },
    searchIcon: {
        margin: 15,
    },
    textStyle: {
        fontSize: 15,
    }
})
export default ForgotPassword;
