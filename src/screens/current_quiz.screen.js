import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity
    
} from 'react-native'
import gameStore from '../stores/game.store'
import { observer } from 'mobx-react'

@observer
export default class CurrentQuizScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:100,height:40,borderRadius:10,backgroundColor:'green',justifyContent:'center',alignItems:'center'}}
                        onPress={this.props.onPressAnswer}>
                        <Text>Answer</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>
                        {gameStore.current_quiz.content}
                    </Text>
                </View>
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    }
})