import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN, WHITE, BLACK,GRAY, RED} from '../utils/palette'
import userStore from '../stores/user.store'

export default class Message extends Component{
    ///date is time of message (such as : 2020-08-21T14:16:10+07:00 ) 
    renderTime=(time)=>{
        if (time===undefined || time ===null) return '';
        let date=new Date(time)
        let hour=date.getHours();
        let minute=date.getMinutes();
        let second=date.getSeconds();
        if (hour<10) hour='0'+hour;
        if (minute<10) minute='0'+minute;
        if (second<10) second='0'+second
        return (
            hour+':'+minute+':'+second+' s'
        )
    }
    render(){
        const {message,on_left,chat_type,is_me,is_opposite_team}=this.props;
        console.log('messageRender:',message,on_left,chat_type,is_me,is_opposite_team)
        return (
            <View style={[styles.container,{
                alignItems:on_left?'flex-start':'flex-end'
            }]}>
                <Text style={{fontSize:12,color:BLACK}}>
                    {this.renderTime(message.message_time)}
                </Text>

                <Text style={{fontSize:16,color:BLACK}}>
                        {is_me?'Me':message.user_name} 
                        {chat_type==='all' && is_opposite_team?
                            '(#)':''}
                </Text>

                <Text style={{
                        fontSize:16,
                        color:BLACK,
                        borderRadius:5,
                        maxWidth:'45%',
                        padding:10,
                        backgroundColor:WHITE,
                        textAlign:on_left?'left':'right'
                }}>
                        {message.content}
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
    }
})


