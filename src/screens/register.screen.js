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
export default class RegisterScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            user_name :'',
            password:''
        }
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
    }
    
    register=async ()=>{
        if (this.validateUserInputs()){
            var user=await fireStoreHelper.registerUser(this.state.user_name,this.state.password);
            if (user===null){
                Alert.alert('sign in failed ')
            }
            else {
                Alert.alert('Sign in successfully')
                this.props.navigation.navigate('login')
            }
        }
        

    }
    render(){
        return (
            <View>
                <TextInput placeholder='user_name'  onChangeText={user_name=>{this.setState({user_name})}} />
                <TextInput placeholder='password'  onChangeText={password=>{this.setState({password})}} />
                <TouchableOpacity onPress={this.register} >
                    <Text >Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}