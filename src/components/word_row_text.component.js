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
            <View 
                style={{width:char_cell_size.width,height:char_cell_size.height,
                    justifyContent:'center',alignItems:'center',
                    borderWidth:1,borderColor:BLUE}}>
                {
                    this.props.is_solved ?
                    <Text>{this.props.char}</Text>
                        :this.props.is_picked?
                        <Image source={null} style={{flex:1,backgroundColor:DARK,aspectRatio:1,resizeMode:'stretch'}} />
                            : <Image source={HIDDEN_IMG} style={{flex:1,aspectRatio:1,resizeMode:'stretch'}} />


                }
            </View>
        )
    }
}

export default class WordRowText extends Component{
    render(){
        const quiz=this.props.quiz;
        const correct_answer=quiz.correct_answer.toUpperCase().split('')
        const is_picked=quiz.is_picked ;
        const is_solved =quiz.is_solved;

        // quiz has 3 status : 
        //not picked                => question mark background
        //picked and can't solved   => gray background
        //picked and solved         => transparent background 
        return (
            <TouchableOpacity style={{flexDirection:'row'}}
                // disabled={!is_solved}
                onPress={this.props.openAnsweredQuizDetail}>
                {
                    correct_answer.map(char=>{
                        return (    
                            <CharCell char={char} is_picked={is_picked} is_solved={is_solved}/>
                    )})
                }
            </TouchableOpacity>
        )
    }
}