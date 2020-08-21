import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN, WHITE, BLACK,GRAY, RED} from '../utils/palette'
import userStore from '../stores/user.store'

export default class Answer extends Component{
    ///time is second number (such as :90 (s))
    renderTime=(time)=>{
        if (time ===undefined || time===null ) return '';
        let minute=Math.floor(time/60);
        let second=Math.floor(time%60);
        if (minute<10) minute='0'+minute;
        if (second<10) second='0'+second;
        return (
            ''+minute+' : '+second+' s '
        )
    }
    render(){
        const {on_left,answer,is_true}=this.props;
        return (
            <View style={[styles.container,{
                alignItems:on_left?'flex-start':'flex-end'
            }]}>
                <Text style={styles.time}>
                    {this.renderTime(answer.answer_time)}
                </Text>


                <Text style={[styles.content,{
                        backgroundColor:is_true?GREEN:RED,
                        textAlign:on_left?'left':'right'
                    }]}>
                        {on_left?
                            answer.user_name+' : '+answer.content
                            :answer.content+' : '+answer.user_name}
                </Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'column',
        paddingHorizontal:20,
        marginBottom:10
    },
    row:{
        width:'100%',
        flexDirection:'row',
    },
    time:{
        color:BLACK,
        fontSize:16,
        paddingHorizontal:10
    },
    content:{
        color:BLACK,
        width:'45%',
        fontSize:20,
        borderRadius:15,
        padding:10
    }
})


