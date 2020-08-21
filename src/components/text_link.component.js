import React,{Component} from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native'
import {BLUE} from '../utils/palette'

export default class TextLink extends Component{
    render(){
        return(
            <TouchableOpacity 
                onPress={this.props.onPressLink} >
                <Text style={{color:BLUE,
                fontSize:this.props.font_size!==undefined?this.props.font_size:16}}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        )
    }
}
