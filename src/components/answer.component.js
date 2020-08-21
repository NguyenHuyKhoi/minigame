import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN, WHITE, BLACK,GRAY, RED} from '../utils/palette'
import userStore from '../stores/user.store'

export default class Answer extends Component{
    render(){
        console.log('on_left',this.props.on_left)
        return (
            <View style={styles.container}>
                <View style={[styles.row,
                      { justifyContent:this.props.on_left?'flex-start':'flex-end'}]}>
                    <Text style={styles.time}>
                        {this.props.answer.answer_time}
                    </Text>
                </View>

                <View style={[styles.row,
                      { justifyContent:this.props.on_left?'flex-start':'flex-end'}
                    ]}>

                    <Text style={[styles.content,{
                        backgroundColor:this.props.is_true?GREEN:RED,
                        textAlign:this.props.on_left?'left':'right'
                    }]}>
                        {this.props.on_left?
                            this.props.answer.user_name+' : '+this.props.answer.content
                            :this.props.answer.content+' : '+this.props.answer.user_name}
                    </Text>
                </View>
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


