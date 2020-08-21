import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    StyleSheet
} from 'react-native'


import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import Button from '../components/button.component'
import UserInput from '../components/user_input.component'
import TextLink from '../components/text_link.component'
import {USER_NAME_IC,PASSWORD_IC} from '../assets/index'
import Orientation from 'react-native-orientation-locker'
import { GRAY } from '../utils/palette'

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
              <View style={styles.container}>
                <View style={{flex:2}}/>
                <View style={styles.register_container}>
                    <UserInput 
                      margin_bottom={20}
                        placeholder='Username' 
                        onChangeText={user_name=>{this.setState({user_name})}} 
                        icon={USER_NAME_IC}
                        />
                    <UserInput
                      margin_bottom={20} 
                        placeholder='Password'  
                        onChangeText={password=>{this.setState({password})}} 
                        icon={PASSWORD_IC}
                        />
                    <Button onPress={()=>this.register()}  label='REGISTER'/>

                    <TextLink onPressLink={()=>this.props.navigation.navigate('login')}  label='Register successfully, login ?'/>
                </View>
                <View style={{flex:2}}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        backgroundColor:GRAY
    },
    register_container:{
        flex:3,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    }
})