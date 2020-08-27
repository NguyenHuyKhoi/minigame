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
                <View style={{margin:3}}>         
                    <WordRowText 
                        content={quiz.correct_answer}
                        is_show_content={quiz.is_solved}
                        is_disable={quiz.is_picked && !quiz.is_solved}/>
                </View>
            )
        )
    }

    openModal=()=>{
        uIStore.openKeywordAnswerModal()
    }

    closeModal=()=>{
        uIStore.closeKeywordAnswerModal()
    }

    updateKeywordAnswer=(text)=>{
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

        console.log('keywordAnswer ',keyword_answer)
        await fireStoreHelper.sendKeywordAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            content:keyword_answer,
            team_index:gameStore.user_team_index,
            answer_time:gameStore.remaining_time,
            user:userStore.user
        });

         Alert.alert('Submit keyword answer successfully:',keyword_answer);

         this.closeModal()
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

            gameStore.switchToAnswerQuiz({
                quiz:null,
                next_round:true
            })
            
        }
        else {
             Alert.alert("wrong answer ...")
        }

     

        
    }

    render(){
        return (
            <View style={[styles.container]}>

                    <KeywordAnswerModal
                        visible={uIStore.keyword_answer_modal_open}
                        closeModal={()=>this.closeModal()}
                        sendKeywordAnswer={()=>this.sendKeywordAnswer()}
                        updateKeywordAnswer={(text)=>this.updateKeywordAnswer(text)}/>

                    <View style={{position:'absolute',right:10,bottom:10}}>
                        <Button custom_width={100}
                            onPress={()=>this.openModal()}
                            disabled={!gameStore.is_available_to_answer_keyword}
                            hight_light={gameStore.is_available_to_answer_keyword}
                            label="Answer Keyword"/>
                    </View>
                    <View style={styles.header}>
                        <HeaderText label={gameStore.current_round.topic.toUpperCase()}></HeaderText>
                        <TextLink label={'View keyword answers'}
                            onPressLink={this.props.onPressKeywordAnswerLink}> </TextLink>
                        <WordRowText content={gameStore.current_round.keyword.correct_answer}
                            is_show_content={gameStore.current_round.keyword.is_solved}
                            is_disable={gameStore.current_round.keyword.is_picked
                                && !gameStore.current_round.keyword.is_solved}
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