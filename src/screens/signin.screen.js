import React,{Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native'


export default class SignInScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            username :'',
            password:''
        }
    };

    signin=()=>{
    }

    render(){
        return (
            <View>
                <TextInput placeholder='username'  onChangeText={username=>{this.setState({username})}} />
                <TextInput placeholder='password'  onChangeText={password=>{this.setState({password})}} />
                <TouchableOpacity onPress={this.signin} >
                    <Text >Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}