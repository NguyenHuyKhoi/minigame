import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput 
} from 'react-native'

import {GREEN, WHITE} from '../utils/palette'
import Button from './button.component'
import gameStore from '../stores/game.store'
export default class KeywordAnswerModal extends Component{

    render(){
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}>
                <View style={styles.container}>
                    <View style={styles.modal_view}>
                        <View style={styles.body}>
                            <Text >Note that you only can answer once : </Text>
                            <TextInput style={styles.text_input}   autoCapitalize='characters'
                                onChangeText={text=>this.props.updateKeywordAnswer(text)}
                            />
                        </View>
                       
                        <View style={styles.footer}>
                            <Button 
                                custom_width={120}
                                label='Answer Later'
                                onPress={this.props.closeModal}/>

                            <Button 
                                custom_width={120}
                                label='Answer Now'
                                onPress={this.props.sendKeywordAnswer}/>

                        </View>
                </View>
                </View>
        </Modal>
        )
    }
}

const styles=StyleSheet.create({

    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
      },
      modal_view: {
        width:'50%',
        height:'50%',
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 20,
        flexDirection:'column',
        alignItems:'center'
      },
      body:{
        flex:2,
        width:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
      },
      text_input:{
          height:40,
          width:'60%',
          marginVertical:10,
          paddingHorizontal:10,
          paddingVertical:0,
          fontSize:25,
          color:GREEN,
          borderWidth:1,
          borderColor:GREEN
      },

      footer:{
        flex:1,
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-around',
        alignItems:'center'
    },
})