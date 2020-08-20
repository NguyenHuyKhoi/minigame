import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN} from '../utils/palette'
export default class HeaderText extends Component{
    render(){
        return (
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:30,fontWeight:'bold',color:GREEN,textTransform: 'uppercase'}}>{this.props.label}</Text>
            </View>
        )
    }
}