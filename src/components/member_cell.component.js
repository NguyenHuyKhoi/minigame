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
                <View style={styles.col1}>
                    <Text style={styles.text}>{this.props.index+1}</Text>
                </View>
                <View style={styles.col2}>
                    <Text style={[styles.text,
                            {fontWeight:this.props.member.user_id===userStore.user.user_id?'bold':'normal',
                            color:this.props.member.user_id===userStore.user.user_id?GREEN:BLACK}]}> 
                            {this.props.member.user_name} </Text>
                   
                </View>

                <View style={styles.col3}>
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
    },
    col1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    col2:{
        flex:4,
        justifyContent:'center',
        alignItems:'center'
    },
    col3:{
        flex:2,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    text:{
        color:BLACK,
        fontSize:16
    }
})


