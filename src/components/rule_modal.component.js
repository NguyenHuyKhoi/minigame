import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput 
} from 'react-native'

import {GREEN, WHITE, DARK} from '../utils/palette'
import Button from './button.component'
import gameStore from '../stores/game.store'
import HeaderText from './header_text.component'
class TextRow extends Component{
    render(){
        return (
            <Text style={{fontSize:16,fontWeight:'bold',marginVertical:2,alignContent:'flex-start'}}>{this.props.text}</Text>
        )
    }
}
export default class RuleModal extends Component{

    render(){
        const score =gameStore.game.score;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}>
                <View style={styles.container}>
                    <View style={styles.modal_view}>
                        <View style={styles.body}>
                            <HeaderText label='Rules'/>
                            <TextRow text={'Score for per quiz     : '+score.score_per_quiz+' pts'}/>
                            <TextRow text={'If you chosen this quiz : '+score.score_per_picked_quiz+' pts'}/>
                            <TextRow text={'Score for keyword : '+
                                score.score_for_finally_guess_keyword+' + '+
                                score.bonus_per_quiz_on_guessing_keyword_early +' * unanswered quiz number '+' pts'}/>
                            <TextRow text={'But if guessing it wrong, you must be stop round'}/>
                            <TextRow text={'Score of team is total of all members on all rounds '}/>
                            <TextRow text={'Team with higher score will win .... '}/>
                            
                        </View>
                       
                        <View style={styles.footer}>
                            <Button 
                                custom_width={120}
                                label='Yes'
                                onPress={this.props.closeModal}/>
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
        backgroundColor: WHITE,
        borderRadius: 20,
        flexDirection:'column',
        alignItems:'center',
        padding:10,
    
      },
      body:{
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
  
      },

      footer:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',

        paddingVertical:10
    }
})