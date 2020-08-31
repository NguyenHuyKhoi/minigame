import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput
} from 'react-native'

import gameStore from '../stores/game.store'
import userStore from '../stores/user.store'
import {observer} from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper'
import Button from '../components/button.component'
import TextLink from '../components/text_link.component'
import HeaderText  from '../components/header_text.component'
import WordRowText from '../components/word_row_text.component'
import KeywordAnswerModal from '../components/keyword_answer_modal.component'
import { GRAY } from '../utils/palette'
import uIStore from '../stores/ui.store'
import AnswerQuizDetailModal from '../components/answered_quiz_detail_modal.component'
@observer
export default class AllQuizScreen extends Component{

    constructor(props){
        super(props)
        this.state={
            keyword_answer:''
        }
    }

    goToAnswer=(quiz)=>{
        console.log('GoToAnswer()')
    }
    
    openAnsweredQuizDetail=(quiz)=>{
        uIStore.updateAnsweredQuizDetailModalData(quiz)
        uIStore.openAnsweredQuizDetailModal();
    }

    renderQuizzes=()=>{
        return (
            gameStore.current_round.quizzes.map(quiz=>
                <View style={{margin:3}} key={quiz.quiz_index}>         
                    <WordRowText 
                        quiz={quiz}
                        openAnsweredQuizDetail={()=>this.openAnsweredQuizDetail(quiz)}
                        />
                </View>
            )
        )
    }



    updateKeywordAnswer=(text)=>{
        this.setState({
            ...this.state,
            keyword_answer:text
        })
    }


    sendKeywordAnswer=async ()=>{
        if (this.state.keyword_answer===''){
             Alert.alert('Answer is empty .');
            return 
        }

        let keyword_answer=this.state.keyword_answer
        uIStore.closeKeywordAnswerModal()
        console.log('keywordAnswer ',keyword_answer)
        await fireStoreHelper.sendKeywordAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            content:keyword_answer,
            team_index:gameStore.user_team_index,
            answer_time:gameStore.remaining_time,
            user:userStore.user
        });


 
        if (gameStore.current_round.keyword.correct_answer.toUpperCase()===keyword_answer.toUpperCase()){
            Alert.alert("Correct Keyword answer .Your team earned "+gameStore.score_of_keyword+" pts .")
            await fireStoreHelper.confirmKeywordSolver({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                user:userStore.user,
                team_index:gameStore.user_team_index!==-1?gameStore.user_team_index:null,
                team_name:gameStore.user_team!==null?gameStore.user_team.team_name:null
                
            })

            await fireStoreHelper.openAllHintPiece({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            await fireStoreHelper.openAllCorrectAnswers({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            gameStore.switchToAnswerQuiz({
                quiz:null,
                next_round:true
            })
            
        }
        else {
             Alert.alert("Wrong keyword answer ...")
        }

     

        
    }

    render(){
        return (
            <View style={[styles.container]}>
                    {console.log('AnswerQuizDetailOnAllQuiz :',uIStore.answered_quiz_detail_modal_data)}
                    {uIStore.answered_quiz_detail_modal_data!==null?
                        <AnswerQuizDetailModal
                            visible={uIStore.answered_quiz_detail_modal_open}
                            closeModal={()=>uIStore.closeAnsweredQuizDetailModal()}
                            quiz={uIStore.answered_quiz_detail_modal_data}
                        />
                        :null
                    }
                    <KeywordAnswerModal
                        visible={uIStore.keyword_answer_modal_open}
                        closeModal={()=>uIStore.closeKeywordAnswerModal()}
                        sendKeywordAnswer={()=>this.sendKeywordAnswer()}
                        updateKeywordAnswer={(text)=>this.updateKeywordAnswer(text)}/>

                    <View style={{position:'absolute',right:10,bottom:10}}>
                        <Button custom_width={100}
                            onPress={()=>uIStore.openKeywordAnswerModal()}
                            disabled={!gameStore.is_available_to_answer_keyword}
                            hight_light={gameStore.is_available_to_answer_keyword}
                            label="Answer Keyword"/>
                    </View>
                    <View style={styles.header}>
                        <HeaderText label={gameStore.current_round.topic.toUpperCase()}></HeaderText>
                        <TextLink label={'View keyword answers'}
                            onPressLink={this.props.onPressKeywordAnswerLink}> </TextLink>
                        <WordRowText quiz={gameStore.current_round.keyword}

                        />
                    </View>

                    <View style={styles.body}>
                        <View style={styles.all_quiz_container}>
                            {
                                this.renderQuizzes()
                            }
                    </View>
            </View>

                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:GRAY,
        alignItems:'center',
        marginTop:10
    },
    header:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        alignItems:'center'
    },
    body:{
        flex:4,
        justifyContent:'center',
        alignItems:'center',
        alignItems:'center'
    },
    all_quiz_container:{
        alignItems:'center'
    }
})