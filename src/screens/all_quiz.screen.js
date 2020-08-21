import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
    TextInput
} from 'react-native'

import gameStore from '../stores/game.store'
import userStore from '../stores/user.store'
import {observer} from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper'
import answerTimerStore from '../stores/answer_timer.store'

@observer
export default class AllQuizScreen extends Component{

    constructor(props){
        super(props)
        this.state={
            modal_visible:false,
            keyword_answer:''
        }
    }

    goToAnswer=(quiz)=>{
        console.log('GoToAnswer()')
        // if (!quiz.is_picked) {
        //     Alert.alert('This quiz is not picked ...')
        //     return 
        // }

        // this.props.navigation.navigate('answer',{
        //     quiz_index:quiz.quiz_index,
        //     is_solved:quiz.is_solved
        // })
    }
    

    renderQuizzes=()=>{
        return (
            gameStore.current_round.quizzes.map(quiz=>
                <TouchableOpacity style={{marginVertical:10}}
                    onPress={()=>this.goToAnswer(quiz)}>
                    <Text >Quiz  {quiz.quiz_index} :
                         {quiz.is_picked ? quiz.is_solved ?quiz.correct_answer :'?????????':'No picked '}</Text>
                </TouchableOpacity>    
            )
        )
    }

    onPressKeyWorkAnswer=()=>{
        this.setState({
            modal_visible:!this.state.modal_visible
        })
    }

    updateKeywordAnswer=(text)=>{
        console.log('updateKeywordAnswer :',text)
        this.setState({
            ...this.state,
            keyword_answer:text
        })
    }

    sendKeywordAnswer=async ()=>{
        if (this.state.keyword_answer===''){
             Alert.alert('answer is empty ');
            return 
        }

        let keyword_answer=this.state.keyword_answer
        await this.closeKeywordModal()

        // if (gameStore.current_round.keyword.is_solved){
        //     Alert.alert('Keyword has been guessed successfully ..., can answered more ')
        //     return 
        // }

        // if (gameStore.is_keyword_answered_by_user){
        //     Alert.alert('You answers keyword ...,can answered more ')
        //     return ;
        // }
       

        
     
        console.log('keywordAnswer ',keyword_answer)
        await fireStoreHelper.sendKeywordAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            content:keyword_answer,
            team_index:gameStore.user_team_index,
            answer_time:answerTimerStore.remaining_time,
            user:userStore.user
        });

         Alert.alert('Submit keyword answer successfully:',keyword_answer);

        if (gameStore.current_round.keyword.correct_answer===keyword_answer){
             Alert.alert("Correct Keyword answer ...")
            await fireStoreHelper.confirmKeywordSolver({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                user:userStore.user,
                team_index:gameStore.user_team_index,
            })

            await fireStoreHelper.openAllHintPiece({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            await fireStoreHelper.openAllCorrectAnswers({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            const next_indexes =fireStoreHelper.findNextIndexes({
                keyword_guessed:true
            })

            if (next_indexes===null) {
                gameStore.finishGame();
                return ;
            }

            await fireStoreHelper.chooseQuiz({
                game_id:gameStore.game.game_id,
                round_index:next_indexes.round_index,
                quiz_index:next_indexes.quiz_index
            })
        }
        else {
             Alert.alert("wrong answer ...")
        }

     

        
    }

    closeKeywordModal=async ()=>{
        await this.setState({
            keyword_answer:'',
            modal_visible:false
        })
    }
    render(){
        const { modal_visible } = this.state;
        return (
            <View style={[styles.container,{backgroundColor:'transparent'}]}>
                  <View style={{width:'100%',flexDirection:'row',backgroundColor:'transparent',justifyContent:'flex-end'}}>
                    <TouchableOpacity 
                        style={{width:100,height:40,borderRadius:10,justifyContent:'center',alignItems:'center',
                        backgroundColor:gameStore.is_available_to_answer_keyword?'green':'gray'}}
                        disabled={!gameStore.is_available_to_answer_keyword}

                        onPress={()=>this.onPressKeyWorkAnswer()}>
                        <Text>Answer keyword</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.renderQuizzes()
                }

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal_visible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Enter your guessing keyword, note that you only can answer once</Text>
                            <TextInput 
                                value={this.state.keyword_answer}
                                onChangeText={(text)=>this.updateKeywordAnswer(text)}></TextInput>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {this.closeKeywordModal()}}>
                                <Text style={styles.textStyle}>Answer later </Text>
                            </TouchableOpacity>

                             <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {this.sendKeywordAnswer()}}>
                                <Text style={styles.textStyle}>Answer now !</Text>
                            </TouchableOpacity>
                         </View>
                    </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'center'
    },
    modalButtonsContainer:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})