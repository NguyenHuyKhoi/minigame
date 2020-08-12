import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native'

import pushTestData from '../utils/push_test_data.hepler'
import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import {hydrate} from '../stores/user.store'

export default class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            user_name :'',
            password:''
        };


    };

    validateUserInputs=()=>{
        if (this.state.user_name===''){
            Alert.alert('user_name empty')
            return false;
        }
        else  if (this.state.password===''){
            Alert.alert('Password empty')
            return false;
        }
        return true;
    };


    componentDidMount=()=>{
        hydrate('userStore',userStore)
            .then(userStore=>{
                  if (userStore.user_name!==null && userStore.password!==null){
                     this.props.navigation.navigate('home')
            }}
            )
    }
    login= async ()=>{
        if (this.validateUserInputs()){
            var user=await fireStoreHelper.loginUser(this.state.user_name,this.state.password);
            console.log('user in login :',user)
            if (user===null) {
                Alert.alert('Login failed');
            }
            else {
                userStore.updateUser(user);
                Alert.alert('Login successfully')
                this.props.navigation.navigate('home')
            }
        }

    }
    render(){
        console.log('tracking userStore login :',userStore.user_name);
        return (
            <View>
                <TextInput placeholder='user_name'  onChangeText={user_name=>{this.setState({user_name})}} />
                <TextInput placeholder='password'  onChangeText={password=>{this.setState({password})}} />
                <TouchableOpacity onPress={this.login} >
                    <Text >Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('register')}} >
                    <Text >Create Account</Text>
                </TouchableOpacity>
            </View>
        )
    }
}