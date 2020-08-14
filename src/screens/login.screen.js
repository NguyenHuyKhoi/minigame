import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native'

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
                  console.log('hydrate userStore ',userStore.user)
                  if (userStore.user!==null){
                     this.props.navigation.navigate('home')
            }}
            )
    }
    login= async ()=>{
        if (this.validateUserInputs()){
            var result=await fireStoreHelper.loginUser(this.state.user_name,this.state.password);
            if (!result) {
                Alert.alert('Login failed');
            }
            else {
                Alert.alert('Login successfully')
                this.props.navigation.navigate('home')
            }
        }

    }
    render(){
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