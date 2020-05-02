import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, FlatList, Alert, KeyboardAvoidingView } from "react-native";
import { Card, CheckBox, Icon } from 'react-native-elements';
import * as firebaseApp from "firebase"
import moment from 'moment';


class CreateCardScreen extends React.Component {

    constructor(props) {
        super(props);
        this.userInfo = firebaseApp.database().ref("/users/" + this.props.user.uid)

        this.state = {
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
        this.listenForUser(this.userInfo)
    }

    async listenForUser(userInfo) {
        tempState = []
        var loadprofile = []
        var loadsocialMedias = []
        var time = ""
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
            console.log("nestedPro", loadprofile)
            this.setState({
                profile: loadprofile,
                socialMedias: loadsocialMedias,
                timeStamp: time
            })
            console.log(this.state)

            console.log("IP", this.state.profile[0].FullName)
            console.log("nestedMed", loadsocialMedias)

        })

        console.log("profile", loadprofile)
        console.log("medias", loadsocialMedias)

        console.log("state", this.state)

    }

    listenForUser = this.listenForUser.bind(this);
    handleProfileEdit = this.handleProfileEdit.bind(this);
    handleAddLink = this.handleAddLink.bind(this);

    handleAddLink() {
        
    }

    handleProfileEdit(field, index) {
        // currState = this.state
        temp = this.state.profile
        console.log(temp)

        if (index == 0) {
            //fullname
            temp[0].FullName = field
        }
        if (index == 1) {
            //email
            temp[1].Email = field
        }
        if (index == 2) {
            //fullname
            temp[2].Mobile = field
        }
        if (index == 3) {
            //fullname
            temp[3].Bio = field
        }
        // date =  moment().format('YYYY-MM-DD hh:mm:ss')
        // temp.timeStamp = date
        this.setState({
            profile: temp,
            timeStamp: moment().format('YYYY-MM-DD hh:mm:ss')
        })

        console.log("new State", this.state.profile)

    }
    handleCancel = () => {
        console.log("Hit")
        this.props.navigation.goBack();
    }

    handleProfileSave() {
        temp = this.state.profile;
        console.log(temp)
        validSave = true
        if (temp[0].FullName.trim() == "") {
            validSave = false
        }
        if (temp[1].Email.trim() == "") {
            validSave = false
        }
        if (temp[2].Mobile.trim() == "") {
            validSave = false
        }
        if (temp[3].Bio.trim() == "") {
            validSave = false
        }

        if (validSave) {
            console.log("finalState", this.state)
            return firebaseApp.database().ref("/users/" + this.props.user.uid).update(this.state).then(() => {
                Alert.alert("Save Successful", "The adjusts you've made on your profile have been saved!");
                this.props.navigation.navigate('Profile')
            })
        } else {
            Alert.alert("Save Unsuccessful", "Please make sure you have entered valid entries for all primary information fields!");

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Titlebar>
                    <Avatar source={require("../assets/profile.png")} />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                        <Title>Cancel</Title>
                    </TouchableOpacity>
                </Titlebar>
                <View style={styles.primaryContainer}>
                    <Card
                        title='Edit Primary Information'
                        titleStyle={{ color: '#137AC2' }}
                        containerStyle={styles.primaryCard} >
                        <View style={{ flexDirection: 'row' }} >
                            <Image source={require("../assets/defaultProfPic.png")}
                                style={{ top: 5, left: 0, width: 65, height: 65, resizeMode: 'contain', borderRadius: 15 }}>
                            </Image>
                            <View style={{ flexDirection: 'column', }} >
                                <View style={{ flexDirection: 'row', }} >
                                    <Text style={{ color: '#137AC2', textAlignVertical: 'center', left: 0 }}>Full Name: </Text>
                                    <TouchableOpacity style={{ backgroundColor: '#FFF', borderColor: '#000', right: 0 }}>
                                        <TextInput containerStyle={{ width: '100%' }} value={this.state.profile[0].FullName} onChangeText={fullName => this.handleProfileEdit(fullName, 0)} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <Text style={{ color: '#137AC2', textAlignVertical: 'center' }}>Email: </Text>
                                    <TouchableOpacity >
                                        <TextInput containerStyle={{ width: '100%', alignSelf: 'flex-end' }} value={this.state.profile[1].Email} onChangeText={Email => this.handleProfileEdit(Email, 1)} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <Text style={{ color: '#137AC2', textAlignVertical: 'center' }}>Mobile: </Text>
                                    <TouchableOpacity >
                                        <TextInput containerStyle={{ width: '100%', alignSelf: 'flex-end' }} value={this.state.profile[2].Mobile} onChangeText={Mobile => this.handleProfileEdit(Mobile, 2)} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <Text style={{ color: '#137AC2', textAlignVertical: 'center' }}>Bio: </Text>
                                    <TouchableOpacity >
                                        <TextInput containerStyle={{ width: '100%', alignSelf: 'flex-end' }} value={this.state.profile[3].Bio} onChangeText={Bio => this.handleProfileEdit(Bio, 3)} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </Card>
                    <Card
                        title='Edit Social Media Information'
                        titleStyle={{ color: '#137AC2' }}
                        containerStyle={styles.primaryCard} >

                        {this.state.socialMedias.length == 0 ?
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.handleAddLink()}>
                                <Icon name='account-plus' type='material-community' />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingLeft: 10, paddingTop: 5, textAlignVertical: 'bottom' }}>Add social media link</Text>
                            </TouchableOpacity>
                            : <FlatList data={this.state.socialMedias} keyExtractor={item => item.name} renderItem={({ item }) => <Text>{item}</Text>} />


                        }
                    </Card>
                </View>
                <KeyboardAvoidingView style={styles.avoidingContainer} >
                    <TouchableOpacity style={styles.saveBtn} onPress={() => this.handleProfileSave()}>
                        <Text style={styles.saveText}>Save Profile</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }

}

const Titlebar = styled.View`
	width: 100%;
	margin-top: 50px;
    padding-left: 80px;
    margin-bottom: 25px;
`

const Avatar = styled.Image`
	width: 44px;
	height: 44px;
	margin-left: 20px;
	position: absolute;
	top: 0;
	left: 0;
`
const Title = styled.Text`
    font-size: 20px;
    font-weight: 500;
    margin-top: 5px;
    color: black;
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
        alignSelf: 'center',
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
        borderColor: "#137AC2",
        borderWidth: 5,
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 10,
        margin: 10,
    },
    mediaContainer: {
        position: 'relative',
        width: '90%',
        height: '45%',
        marginBottom: 0,
    },
    saveBtn: {
        position: 'absolute',
        bottom: 15,
        width: "80%",
        backgroundColor: "#137AC2",
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
    },
    avoidingContainer: {
        flex: 1,
    }
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateCardScreen)
