import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN, WHITE} from '../utils/palette'
export default class TeamTitle extends Component{
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.col1}>

                </View>
                <View style={styles.col2}>
                    <Text onPress={this.props.chooseTeam}
                        style={{fontSize:24,color:WHITE}}>{this.props.team.team_name}</Text>
                </View>
                <View style={styles.col3}>
                    <Text style={{color:WHITE,fontSize:16}}>Score : {this.props.score} </Text>
                </View> 
                    
            </View>
        )


    }
}

const styles=StyleSheet.create({
    container:{
        height:40,
        flexDirection:'row',
        backgroundColor:GREEN
    },
    col1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    col2:{
        flex:4,
        justifyContent:'center',
        alignItems:'center',
    },
    col3:{
        flex:2,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',

    }
})