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
                <Text style={{color:BLUE}}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        )
    }
}
