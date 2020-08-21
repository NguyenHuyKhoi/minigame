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
            <View style={{height:50,width:'100%',justifyContent:'center',alignItems:'center',backgroundColor:GREEN}}>
                    <Text onPress={this.props.chooseTeam}
                        style={{fontSize:24,color:WHITE}}>{this.props.team.team_name}</Text>
            </View>
        )
    }
}