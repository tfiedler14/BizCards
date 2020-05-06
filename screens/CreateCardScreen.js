import React from "react";
import styled, { css } from "@emotion/native";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StyleSheet, Text, Image, TextInput, TouchableOpacity, View, FlatList, Alert } from "react-native";
import { Card, CheckBox } from 'react-native-elements';
import * as firebaseApp from "firebase"
import Profile from "./Profile";


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

            this.setState({
                profile: loadprofile,
                socialMedias: loadsocialMedias,
                timeStamp: time
            })

        })



    }

    handleClick = this.handleClick.bind(this);
    listenForUser = this.listenForUser.bind(this);
    handleProfileClick = this.handleProfileClick.bind(this);
    handleProfileSave = this.handleProfileSave.bind(this);

    handleClick(name) {

        const data = this.state.socialMedias;
        const index = data.findIndex(x => x.site === name);
        data[index].checked = !data[index].checked;
        this.setState({
            socialMedias: data
        });
    }

    handleProfileClick(field) {
        temp = this.state.profile
        if (field == this.state.profile[1]) {
            temp[1].checked = !field.checked
        }
        if (field == this.state.profile[2]) {
            temp[2].checked = !field.checked
        }
        if(field == this.state.profile[3]){
            temp[3].checked = !field.checked
        }
        this.setState({
            profile: temp
        })

    }
    handleCancel = () => {
        console.log("Hit")
        this.props.navigation.goBack();
    }

    handleProfileSave() {
        temp = this.state.profile;
        currState = this.state;
        profileError = false;
        validSave = true
        firebaseApp.database().ref("/users/" + this.props.user.uid + "/profile/").set(this.state.profile);
        return firebaseApp.database().ref("/users/" + this.props.user.uid + "/medias/").set(this.state.socialMedias).then(() => {
            Alert.alert("Save Successful", "The adjusts you've made on your profile have been saved!");
            
        }).then(this.props.navigation.navigate('Profile'))

    }

    render() {
        return (
            <View style={styles.container}>
                <Titlebar>
                    <Avatar source={require("../assets/profile.png")} />
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Profile')}>
                        <Title>Cancel</Title>
                    </TouchableOpacity>
                </Titlebar>
                <View style={styles.primaryContainer}>
                    <Card
                        title='Primary Information'
                        titleStyle={{ color: '#137AC2' }}
                        containerStyle={styles.primaryCard} >
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}} >
                                <View style={{width: '50%', flexDirection:'column', alignItems:'flex-start'}}>
                                    <Text style={{ textAlignVertical:'center', width: '95%', backgroundColor:'#47ceff', textAlign:'left',  padding: 12, marginTop:7, marginBottom:7, fontWeight: "bold", textAlign: 'center' }} >Full Name:</Text>
                                    <Text style={{ textAlignVertical:'center', width: '95%', backgroundColor:'#47ceff', textAlign:'left',  padding: 13, marginTop:7, marginBottom:9,fontWeight: "bold", textAlign: 'center', borderRadius:5 }}>Email: </Text>
                                    <Text style={{ textAlignVertical:'center', width: '95%', backgroundColor:'#47ceff', textAlign:'left',  padding: 13, marginTop:5, marginBottom:9,fontWeight: "bold", textAlign: 'center', borderRadius:5 }}>Mobile: </Text>
                                    <Text style={{ textAlignVertical:'center', width: '95%', backgroundColor:'#47ceff', textAlign:'left',  padding: 13, marginTop:5, marginBottom:10,fontWeight: "bold", textAlign: 'center', borderRadius:5 }} >Bio: </Text>
                                </View>
                                <View style={{width:'50%', flexDirection:'column', alignItems:'flex-start'}}>
                                    <CheckBox containerStyle={{  width: '95%', alignSelf: 'flex-end' }} right iconRight title={<Text style={{ padding: 3, marginTop:0, fontWeight: "bold", textAlign: 'center' }}>{this.state.profile[0].FullName}</Text>} checked={true} />
                                    <CheckBox containerStyle={{  width: '95%', alignSelf: 'flex-end' }} right iconRight title={<Text style={{ padding: 3, marginTop:0, fontWeight: "bold", }}>{this.state.profile[1].Email}</Text>} onPress={() => this.handleProfileClick(this.state.profile[1])} checked={this.state.profile[1].checked} />
                                    <CheckBox containerStyle={{  width: '95%', alignSelf: 'flex-end' }} right iconRight title={<Text style={{ padding: 3, marginTop:0, fontWeight: "bold", }}>{this.state.profile[2].Mobile}</Text>} onPress={() => this.handleProfileClick(this.state.profile[2])} checked={this.state.profile[2].checked} />
                                    <CheckBox containerStyle={{  width: '95%', alignSelf: 'flex-end' }} right iconRight title={<Text style={{ padding: 3, marginTop:0, fontWeight: "bold", }}>{this.state.profile[3].Bio}</Text>} onPress={() => this.handleProfileClick(this.state.profile[3])} checked={this.state.profile[3].checked} />
                                </View>

                        </View>

                    </Card>
                </View>

                <View style={styles.divider}>
                    <Text style={{ color: '#137AC2', textAlign: 'center' }}>Chose which social media profiles you'd like to attach to this card!</Text>
                </View>

                <View style={styles.mediaContainer} >
                    <Card
                        containerStyle={styles.primaryCard} >
                        {this.state.socialMedias.length != 0 ? <FlatList data={this.state.socialMedias} extraData={this.state} keyExtractor={item => item.site} renderItem={({ item }) => <CheckBox containerStyle={{}} right iconRight title={item.site} key={item.site} onPress={() => this.handleClick(item.site)} checked={item.checked} />} /> :
                            <Text style={{ color: "#137AC2", padding: 5, fontWeight: "bold", textAlign: 'center' }}>Please add socialMedia links to enable bizCard customization</Text>
                        }

                    </Card>

                    <TouchableOpacity style={styles.saveBtn} onPress={() => this.handleProfileSave()}>
                        <Text style={styles.saveText}>Save Card</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: "#FFF",
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