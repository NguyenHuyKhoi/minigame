import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {GREEN} from '../utils/palette'
import { observer } from 'mobx-react'
import gameStore from '../stores/game.store'

@observer
export default class RemainTime extends Component{
    render(){
        return (
            <View style={{width:'100%',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:16,fontWeight:'bold',color:GREEN
                }}>
                    Remain :{gameStore.remaining_time} s
                </Text>

            </View>
        )
    }
}