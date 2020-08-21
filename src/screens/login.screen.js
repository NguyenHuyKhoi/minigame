import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet
} from 'react-native'

import fireStoreHelper from '../utils/firestore.helper'
import userStore from '../stores/user.store'
import {hydrate} from '../stores/user.store'
import Button from '../components/button.component'
import UserInput from '../components/user_input.component'
import TextLink from '../components/text_link.component'
import {USER_NAME_IC,PASSWORD_IC} from '../assets/index'
import Orientation from 'react-native-orientation-locker'
import { GRAY } from '../utils/palette'

export default class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            user_name :'',
            password:''
        };

        Orientation.lockToLandscape();


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
            <View style={styles.container}>
                <View style={{flex:2}}/>
                <View style={styles.login_container}>
                    <UserInput 
                        margin_bottom={20}
                        placeholder='user_name' 
                        onChangeText={user_name=>{this.setState({user_name})}} 
                        icon={USER_NAME_IC}
                        />
                    <UserInput 
                        margin_bottom={20}
                        placeholder='password'  
                        onChangeText={password=>{this.setState({password})}} 
                        icon={PASSWORD_IC}
                        />
                    <Button onPress={()=>this.login()}  label='LOGIN'/>

                    <TextLink onPressLink={()=>this.props.navigation.navigate('register')}  label='Not have a account, register ?'/>
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
    login_container:{
        flex:3,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    }
})