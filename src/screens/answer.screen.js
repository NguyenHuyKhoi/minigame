import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native'

import gameStore from '../stores/game.store';
import userStore from '../stores/user.store'
import {observer}from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper';
import {parseValues} from '../utils/custom_func'
import Button from '../components/button.component'
import HeaderText from '../components/header_text.component'
import TextLink from '../components/text_link.component'
import Answer from '../components/answer.component'
import RemainTime from '../components/remain_time.component'
import { GRAY,BLACK } from '../utils/palette';
import UserInput from '../components/user_input.component';
import { ANSWER_IC } from '../assets';
import WordRowText from '../components/word_row_text.component';
import ChooseNextQuizModal from '../components/choose_next_quiz_modal.component'
import uIStore from '../stores/ui.store';
@observer
export default class AnswerScreen extends Component{

    constructor(props){
        super(props);
        this.state={
            answer :'',
            quiz :null
        }
    }


    updateAnswer=(answer)=>{
        this.setState({
            answer:answer
        })
    }
    
    renderAnswers=()=>{
        let answers=null
        if (gameStore.is_keyword_answer_time){
            answers=parseValues(gameStore.current_round.keyword.answers)
        }
        else {
            answers=parseValues(gameStore.current_quiz.answers);
        }
        return (
            answers!==null?answers.map(answer =>
                    <Answer on_left={answer.team_index===0} 
                    is_true={gameStore.current_quiz && answer.content.toUpperCase()===gameStore.current_quiz.correct_answer.toUpperCase()} 
                    answer={answer}/>
            )
            :null
        )
    }


    
    sendAnswer=async  ()=>{
        if (this.state.answer===''){
             Alert.alert('Answer is empty .');
            return 
        }

     
        await fireStoreHelper.sendAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            quiz_index:gameStore.current_quiz.quiz_index,
            content:this.state.answer,
            team_index:gameStore.user_team_index,
            answer_time:gameStore.remaining_time,
            user:userStore.user
        });


        if (gameStore.current_quiz.correct_answer.toUpperCase()===this.state.answer.toUpperCase()){
             Alert.alert("Correct answer ... Your team earned "+gameStore.score_of_current_quiz+" pts .")
            await fireStoreHelper.confirmSolver({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                quiz_index:gameStore.current_quiz.quiz_index,
                user:userStore.user,
                team_index:gameStore.user_team_index!==-1?gameStore.user_team_index:null,
                team_name:gameStore.user_team!==null?gameStore.user_team.team_name:null
            })


            //after confirmSolver , no users can send answers and update answer time ,exclude solver 
            await fireStoreHelper.openHintPiece({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            //check if out of quizzes :
            if (gameStore.out_of_quizzes){
                gameStore.switchToAnswerKeyword()
                this.props.navigation.navigate('keyword_answer');
            }
            else {
                await uIStore.openChooseQuizModal();
                gameStore.switchToChooseQuiz();
            }
        }
        else {
             Alert.alert("Wrong answer ...")
        }

        this.setState({
            answer:''
        })

        
    }

    goToChat=()=>{
        this.props.navigation.navigate('chat')
    }

    goToKeywordAnswer=()=>{
        this.props.navigation.navigate('keyword_answer')
    }

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }

    onPressQuiz=async (quiz)=>{
        await uIStore.closeChooseQuizModal();

        await gameStore.switchToAnswerQuiz({
            next_round:false,
            quiz:quiz,
            is_picked_by_user_id:userStore.user.user_id
        }) 

     
    }

    render(){
       // const params=this.props.navigation.state.params;
        return (
            ///only 2 teams 
   
            <View style={styles.container}>
                <ChooseNextQuizModal
                        visible={uIStore.choose_quiz_modal_open}
                        quizzes={gameStore.current_round.quizzes}
                        onPressQuiz={(quiz)=>this.onPressQuiz(quiz)}/>

                <ScrollView style={styles.scroll_view}>
                    <View style={{position:'absolute',left:10,top:0}}>
                        <Button custom_width={100}
                            onPress={()=>this.goToGame()}
                            label="Game"/>
                    </View>

                    <View style={{position:'absolute',right:10,top:0}}>
                        <Button custom_width={100}
                            onPress={()=>this.goToChat()}
                            label="Chat"/>
                    </View>

                    <HeaderText label={gameStore.is_keyword_answer_time?
                        'Go to keyword screen'
                        :'Quiz ' + gameStore.current_quiz.quiz_index}/>

                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:'70%',fontSize:18,color:BLACK,textAlign: 'center'}}>
                            {!gameStore.is_keyword_answer_time?gameStore.current_quiz.content:''}
                        </Text>
                        {!gameStore.is_keyword_answer_time?
                            <WordRowText 
                                quiz={gameStore.current_quiz}/>
                            :null
                        }
                    </View>

                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                        <TextLink 
                            font_size={24}
                            label={gameStore.game.teams[0].team_name}
                            onPressLink={()=>this.props.navigation.navigate('choose_team')}/>
            
                        <TextLink 
                            onPressLink={()=>this.goToKeywordAnswer()} label='View keyword answers'/>

                        <TextLink 
                            font_size={24}
                            label={gameStore.game.teams[1].team_name}
                            onPressLink={()=>this.props.navigation.navigate('choose_team')}
                        />

                    </View>

                    <View style={styles.body}>
                            {
                                this.renderAnswers()
                            }
                    </View>
                </ScrollView>

                <RemainTime/>
                {gameStore.is_available_to_answer_quiz
                &&
                    <View style={styles.footer}>
                        <View style={{flex:1,marginRight:10}}>
                            <UserInput 
                                icon={ANSWER_IC}
                                placeholder="You only answer once..."
                                onChangeText={(text)=>this.updateAnswer(text)} />
                        </View>

                        <Button 
                            custom_width={80}
                            label='Send'
                            onPress={()=>this.sendAnswer()}/>
                    </View>
                }

            </View>
      
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        marginTop:10,
        backgroundColor:GRAY
    },
    scroll_view:{
        flex:1,
        flexDirection:'column'
    },
    body:{
        flex:1,
        flexDirection:'column',
       
    },
    footer:{
        width:'100%',
        flexDirection:'row',
        padding:10
      //  backgroundColor:'red'
    }
})