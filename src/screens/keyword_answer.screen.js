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
import { parseValues } from '../utils/custom_func';
import Button from '../components/button.component'
import HeaderText from '../components/header_text.component'
import TextLink from '../components/text_link.component'
import Answer from '../components/answer.component'

import { GRAY, BLACK } from '../utils/palette';
import WordRowText from '../components/word_row_text.component';
import RemainTime from '../components/remain_time.component';

@observer
export default class KeywordAnswerScreen extends Component{

    constructor(props){
        super(props);
    }

    
    renderQuiz =()=>{
        return (
            <Text>Please guess keyword</Text>
        )
    }

    renderAnswers=()=>{
        let round=gameStore.current_round
        if (round==null) return null;

        let answers=parseValues(round.keyword.answers);
        return (
            answers!==null?answers.map(answer =>
                <Answer 
                    on_left={answer.team_index===0} 
                    is_true={gameStore.current_round && answer.content===gameStore.current_round.keyword.correct_answer} 
                    answer={answer}
                />
            
            )
            :<Text style={{fontSize:20,color:BLACK,marginHorizontal:20}}>No one have yet answer keyword ,be first !</Text>
        )
    }

    goToChat=()=>{
        this.props.navigation.navigate('chat')
    }

    goToAnswer=()=>{
        this.props.navigation.navigate('answer')
    }

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }
    render(){
       // const params=this.props.navigation.state.params;
        return (
            ///only 2 teams 
            <View style={styles.container}>
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

                    <HeaderText label={'Guess Keyword To Win !!!'}/>
                    <View style={{width:'100%',flexDirection:'column',alignItems:'center'}}>
                        <WordRowText 
                            content={gameStore.current_round.keyword.correct_answer}
                            is_show_content={gameStore.current_round.keyword.is_solved}
                            is_disable={gameStore.current_round.keyword.is_picked && 
                                !gameStore.current_round.keyword.is_solved}/>
                    </View>
                    {/* <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:'70%',fontSize:18,color:BLACK,textAlign: 'center'}}>
                            {!gameStore.is_keyword_answer_time?gameStore.current_quiz.content:''}
                        </Text>
                    </View> */}

                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                        <TextLink 
                            font_size={24}
                            label={gameStore.game.teams[0].team_name}
                            onPressLink={()=>this.props.navigation.navigate('choose_team')}/>
            
                        <TextLink 
                            onPressLink={()=>this.goToAnswer()} label='View current quiz'/>

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
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        paddingVertical:10,
        backgroundColor:GRAY
    },
    scroll_view:{
        flex:1,
        flexDirection:'column'
    },    
    body:{
        flex:1,
        flexDirection:'column' 
    },
})