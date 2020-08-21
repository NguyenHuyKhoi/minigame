import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN, WHITE, BLACK,GRAY} from '../utils/palette'
import userStore from '../stores/user.store'

export default class MemberCell extends Component{
    render(){
        return (
            <View style={[styles.container,{ backgroundColor:this.props.index%2===0?GRAY:WHITE}]}>
                <View style={styles.row1}>
                    <Text style={styles.text}>{this.props.index+1}</Text>
                </View>
                <View style={styles.row2}>
                    <Text style={[styles.text,
                            {fontWeight:this.props.member.user_id===userStore.user.user_id?'bold':'normal',
                            color:this.props.member.user_id===userStore.user.user_id?GREEN:BLACK}]}> 
                            {this.props.member.user_name} </Text>
                    <Text style={styles.text}>Score : {this.props.member.score}</Text>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        height:40,
        flexDirection:'row',
        justifyContent:'space-around',
    },
    row1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    row2:{
        flex:5,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    text:{
        color:BLACK,
        fontSize:16
    }
})


