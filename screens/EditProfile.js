import React, { useState } from "react";
import styled, { css } from "@emotion/native";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, FlatList, Alert, KeyboardAvoidingView } from "react-native";
import { Card, Icon } from 'react-native-elements';
import * as firebaseApp from "firebase"
import ModalSelector from 'react-native-modal-selector'



class CreateCardScreen extends React.Component {

    presetMedias = [
        { key: "facebook", link: "https://www.facebook.com/" },
        { key: "github", link: "https://github.com/" },
        { key: "twitter", link: "https://twitter.com/" },
        { key: "linkedIn", link: "https://linkedIn.com/in/" },
    ]
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
            timeStamp: "",
            addMediaDialog: false,
            addMediaInput: false,
            mediaInput: {},
            pendingAdd: false,
            editActive: false

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
    handleAddDomain = this.handleAddDomain.bind(this);
    handleCancelAdd = this.handleCancelAdd.bind(this);
    handleSaveLink = this.handleSaveLink.bind(this);
    handleExistingInteraction = this.handleExistingInteraction.bind(this);

    handleCancelAdd() {
        this.setState({
            addMediaDialog: false,
            addMediaInput: false,
            mediaInput: {}
        })
    }
    handleAddLink() {
        console.log(this.presetMedias)
        this.setState({
            addMediaDialog: true
        })

// <<<<<<< HEAD
    }
    handleAddDomain(domainKey, domainLink, edit) {

        console.log("made it to domain")
        temp = this.state.socialMedias
        insert = { key: domainKey, link: domainLink }
        userLink = ""
        this.setState({
            addMediaInput: true,
            addMediaDialog: false,
            mediaInput: insert,
            editActive: edit
        })

        console.log("curr", insert)
// =======
//     handleAddLink() {
        
// >>>>>>> 0f817a96972b14c0c0fd6b0b2fc2674bbf3de73a
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
            //Mobile
            temp[2].Mobile = field
        }
        if (index == 3) {
            //Bio
            temp[3].Bio = field
        }

        this.setState({
            profile: temp,
        })

        console.log("new State", this.state.profile)

    }
    handleURLEdit(url) {
        input = { key: this.state.mediaInput["key"], link: url }
        this.setState({
            pendingAdd: true,
            mediaInput: input
        })
    }
    handleSaveLink() {
        input = {site:this.state.mediaInput["key"] , link:this.state.mediaInput["link"], checked:false}
        
        console.log("input", input)
        medias = this.state.socialMedias
        sites = medias.map(function (item) { return item.site; })
        console.log("site", input["site"])
        console.log(sites.indexOf(input["site"]))
        if(sites.indexOf(input["site"]) >= 0){
            var removeIndex = medias.map(function(item) { return item.site; }).indexOf(input["site"]);
            medias.splice(removeIndex, 1)
        }
        medias.push(input)
        this.setState({
            socialMedias: medias,
            pendingAdd: false,
            addMediaDialog: false,
            addMediaInput: false,
            editActive:false,
            mediaInput: {}
        })

        alert("Your link has been successfully saved")
    }

    handleDeleteLink(){
        input = this.state.mediaInput
        medias = this.state.socialMedias
        var removeIndex = medias.map(function(item) { return item.site; }).indexOf(input["key"]);
        // remove object
        medias.splice(removeIndex, 1)
        console.log(medias)

        this.setState({
            socialMedias: medias,
            pendingAdd: false,
            addMediaDialog: false,
            addMediaInput: false,
            mediaInput: {},
            editActive: false,
        })

        alert("Your link has been successfully deleted")
    }
    handleExistingInteraction(existingLink) {
        console.log(existingLink)
        this.handleAddDomain(existingLink.site, existingLink.link, true)
    }

    handleCancel = () => {
        console.log("Hit")
        if (this.state.pendingAdd == true) {
            alert("you're not saving the new link")
        }
        this.props.navigation.goBack();
    }

    handleProfileSave() {
        temp = this.state.profile;
        currState = this.state;
        profileError = false;
        validSave = true
        if (temp[0].FullName.trim() == "") {
            validSave = false
            profileError = true
            console.log("FullName")
        }
        if (temp[1].Email.trim() == "") {
            validSave = false
            profileError = true
            console.log("Email")

        }
        if (temp[2].Mobile.trim() == "") {
            validSave = false
            profileError = true
            console.log("Mobile")

        }
        if (temp[3].Bio.trim() == "") {
            validSave = false
            profileError = true
            console.log("Bio")

// <<<<<<< HEAD
        }
        if(currState.editActive == true || currState.pendingAdd == true){
            validSave = false
        }
        stateToSave = [{"medias": currState.socialMedias},
                        {"profile": currState.profile}]
        if (validSave) {
            firebaseApp.database().ref("/users/"+this.props.user.uid + "/profile/").update(this.state.profile);
            return firebaseApp.database().ref("/users/" + this.props.user.uid + "/medias/").set(this.state.socialMedias).then(() => {
// =======
//         if (validSave) {
//             console.log("finalState", this.state)
//             return firebaseApp.database().ref("/users/" + this.props.user.uid).update(this.state).then(() => {
// >>>>>>> 0f817a96972b14c0c0fd6b0b2fc2674bbf3de73a
                Alert.alert("Save Successful", "The adjusts you've made on your profile have been saved!");
                this.props.navigation.navigate('Profile')
            })
        } else {
            if(currState.editActive == true && profileError == false){
                Alert.alert("Wait a minute!", "Please finish editing your current link before saving")
            } else{
                Alert.alert("Save Unsuccessful", "Please make sure you have entered valid entries for all primary information fields!");

            }
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
                                        <TextInput containerStyle={{ width: '100%', alignSelf: 'flex-end' }} keyboardType={'name-phone-pad'} value={this.state.profile[2].Mobile} onChangeText={Mobile => this.handleProfileEdit(Mobile, 2)} />
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
                    <View style={styles.divider}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.handleAddLink()}>
                            <Icon name='account-plus' type='material-community' />
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingLeft: 10, paddingTop: 5, textAlignVertical: 'bottom' }}>Add social media link</Text>
                        </TouchableOpacity>

                        {this.state.addMediaDialog ?
                            <>
                                <View style={{ alignItems: 'flex-end' }} >
                                    <TouchableOpacity onPress={() => this.handleCancelAdd()}>
                                        <Text style={{ color: '#D0D0D0', fontWeight: "300" }} >X</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <ModalSelector
                                        data={this.presetMedias}
                                        initValue="Domain"
                                        keyExtractor={item => item.key}
                                        labelExtractor={item => item.key}
                                        onChange={(option) => this.handleAddDomain(option.key, option.link, false)}
                                    />
                                </View>

                            </>
                            : <></>}
                        {this.state.addMediaInput ?
                            <>
                                <View style={{ alignItems: 'flex-end' }} >
                                    <TouchableOpacity onPress={() => this.handleCancelAdd()}>
                                        <Text style={{ color: '#D0D0D0', fontWeight: "300" }} >X</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'left', paddingBottom: 5 }}>{this.state.mediaInput["key"]} profile URL:</Text>
                                    <TextInput style={{ borderBottomColor: "#D0D0D0" }} value={this.state.mediaInput["link"]} onChangeText={url => this.handleURLEdit(url)}></TextInput>
                                </View>
                                {this.state.editActive ?
                                    <>
                                        <View style={{ justifyContent:'center', flexDirection:"row" }} >
                                            <TouchableOpacity style={{ padding: 3, backgroundColor: "#032c8e", borderRadius: 15, alignItems: 'center', margin:2 }} onPress={() => this.handleSaveLink()} >
                                                <Text style={{ textAlignVertical: 'center', color:'#FFF'}} > Update Link</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{padding:3, backgroundColor: "#e64940", borderRadius: 15, alignItems: 'center', margin:2  }} onPress={() => this.handleDeleteLink()} >
                                                <Text style={{ textAlignVertical: 'center', color:'#FFF' }} > Delete Link</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </> :
                                    <>
                                        <View style={{ alignItems: 'center' }} >
                                            <TouchableOpacity style={{ backgroundColor: "#032c8e", borderRadius: 25, alignItems: 'center' }} onPress={() => this.handleSaveLink()} >
                                                <Text style={{ textAlignVertical: 'center' }} > Save Link</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                }


                            </> : <></>}

                    </View>

                    <Card
                        title='Edit Social Media Information'
                        titleStyle={{ color: '#137AC2' }}
                        containerStyle={styles.primaryCard} >

                        {this.state.socialMedias.length == 0 ?
// <<<<<<< HEAD
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingLeft: 10, paddingTop: 5, textAlignVertical: 'bottom' }}>Add social media link</Text>
                            : <FlatList  data={this.state.socialMedias} extraData={this.state} keyExtractor={item => item.site} renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => this.handleExistingInteraction(item)} style={{ margin: 5, padding: 8, alignItems: 'center', backgroundColor: "#47ceff", borderColor: '#D0D0D0', borderRadius: 25, borderWidth: 2 }}>
                                    <Text style={{ color: '#FFF', fontWeight: "bold", fontSize: 20 }}>{item.site}</Text>
                                </TouchableOpacity>
                            } />
// =======
//                             <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.handleAddLink()}>
//                                 <Icon name='account-plus' type='material-community' />
//                                 <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingLeft: 10, paddingTop: 5, textAlignVertical: 'bottom' }}>Add social media link</Text>
//                             </TouchableOpacity>
//                             : <FlatList data={this.state.socialMedias} keyExtractor={item => item.name} renderItem={({ item }) => <Text>{item}</Text>} />


// >>>>>>> 0f817a96972b14c0c0fd6b0b2fc2674bbf3de73a
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
    inputBox: {
        width: "80%",
        fontWeight: 'bold',
        backgroundColor: "#EFEFEF",
        color: "#032c8e",
        borderRadius: 20,
        height: 55,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    divider: {
        position: 'relative',
        alignSelf: 'center',
        marginTop: 7,
        marginBottom: 7,
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
