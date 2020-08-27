import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'

import {GREEN, WHITE, GRAY, BLACK, RED,BLUE, DARK} from '../utils/palette'

import { HIDDEN_IMG } from '../assets'
const char_cell_size={
    width:25,
    height:25
}
export class CharCell extends Component{
    render(){
        return (
            <TouchableOpacity 
                style={{width:char_cell_size.width,height:char_cell_size.height,
                    justifyContent:'center',alignItems:'center',
                    borderWidth:1,borderColor:BLUE}}>
                {
                    this.props.is_show_content ?
                    <Text>{this.props.char}</Text>
                        :this.props.is_disable?
                        <Image source={null} style={{flex:1,backgroundColor:DARK,aspectRatio:1,resizeMode:'stretch'}} />
                            : <Image source={HIDDEN_IMG} style={{flex:1,aspectRatio:1,resizeMode:'stretch'}} />


                }
            </TouchableOpacity>
        )
    }
}

export default class WordRowText extends Component{
    render(){
        const content=this.props.content.toUpperCase().split('')
        const is_show_content=this.props.is_show_content ;
        const is_disable =this.props.is_disable;

        return (
            <View style={{flexDirection:'row'}}>
                {
                    content.map(char=>{
                        return (    
                            <CharCell char={char} is_show_content={is_show_content} is_disable={is_disable}/>
                    )})
                }
            </View>
        )
    }
}