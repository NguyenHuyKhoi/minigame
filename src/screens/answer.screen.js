import React,{Component}from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native'

import gameStore from '../stores/game.store';
import userStore from '../stores/user.store'
import {observer}from 'mobx-react'
import fireStoreHelper from '../utils/firestore.helper';

@observer
export default class AnswerScreen extends Component{

    constructor(props){
        super(props);
        this.state={
            answer :''
        }
    }


    updateAnswer=(answer)=>{
        this.setState({
            answer:answer
        })
    }
    

    renderAnswers=()=>{
        const round=gameStore.game.rounds[gameStore.game.current_round_index]
        console.log('renderAnswers - currentRound :',round);
        const quiz=round.quizzes[round.current_quiz_index];
        console.log('renderAnswers - currentQuiz :',quiz);

        const answers= Object.values(quiz.answers);
        return (
            answers!==null?answers.map(answer =>
    
                    <View style={[styles.answer_container,{backgroundColor:'transparent',alignItems:answer.team_index%2===0?'flex-start':'flex-end'}]}>
                        <Text>{answer.user_id===userStore.user.user_id?'Me':answer.user_name}</Text>
                        <Text>{answer.content}</Text>
                    </View>
            
            )
            :null
        )
    }


    
    sendAnswer= ()=>{
        
        
        if (this.state.answer===''){
            Alert.alert('answer is empty ');
            return 
        }

        if (gameStore.current_quiz.is_solved){
            Alert.alert('This quiz has been solved ..., can answered more ')
            return 
        }

        if (gameStore.is_answered_by_user){
            Alert.alert('You answers this quiz ...,can answered more ')
            return ;
        }
       

        Alert.alert('Sending answer :',this.state.answer);
     
        fireStoreHelper.sendAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            quiz_index:gameStore.current_quiz.quiz_index,
            content:this.state.answer,
            team_index:gameStore.user_team_index,
            user:userStore.user
        });

        if (gameStore.current_quiz.correct_answer===this.state.answer){
            Alert.alert("Correct answer ...")
            fireStoreHelper.confirmSolver({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                quiz_index:gameStore.current_quiz.quiz_index,
                user:userStore.user,
                team_index:gameStore.user_team_index,
            })
        }

        this.setState({
            answer:''
        })

        
    }

    goToChat=()=>{
        this.props.navigation.navigate('chat')
    }

    goToGame=()=>{
        this.props.navigation.navigate('all_quiz')
    }
    render(){
        return (
            ///only 2 teams 
            <View style={styles.container}>
              
                <View style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{flex:10}}>{gameStore.current_quiz.content}</Text>

                    <View style={{flex:2,justifyContent:'center',alignItems:'center',marginHorizontal:5}}>
                       <TouchableOpacity style={{width:100,height:40,borderRadius:10,backgroundColor:'green',
                                            justifyContent:'center',alignItems:'center'}}
                                    onPress={()=>this.goToGame()}>
                            <Text>Game</Text>
                        </TouchableOpacity>
                   </View>
                   
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                       <TouchableOpacity style={{width:100,height:40,borderRadius:10,backgroundColor:'green',
                                            justifyContent:'center',alignItems:'center'}}
                                    onPress={()=>this.goToChat()}>
                            <Text>Chat</Text>
                        </TouchableOpacity>
                   </View>


        
                </View>
                <View style={{width:'100%',flexDirection:'row'}}>
                   <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                       <Text>{gameStore.game.teams[0].team_name}</Text>
                   </View>
                   <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                       <Text>{gameStore.game.teams[1].team_name}</Text>
                   </View>

                  
                </View>

                <View style={styles.body}>
                    <ScrollView style={{flex:1,padding:10}}>
                        {
                            this.renderAnswers()
                        }
                    </ScrollView>
                </View>
           

                    <View style={styles.footer}>
                        <TextInput 
                         style={styles.answer_edit}
                         value={this.state.answer}
                         onChangeText={(text)=>this.updateAnswer(text)} />

                         <TouchableOpacity style={styles.button} 
                            onPress={()=>this.sendAnswer()}>
                                <Text>Send</Text>
                         </TouchableOpacity>
                    </View>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    header:{
        width:'50%',
        flexDirection:'row',
        alignItems:'center'
    },
    body:{
        flex:1,
        flexDirection:'column',
       
    },
    footer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
      //  backgroundColor:'red'
    },
    answer_edit:{
        flex:8,
        backgroundColor:'gray'
    },
    button:{
        width:100,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10,
    },
    answer_container:{
        marginVertical:10,
        flexDirection:'column'
    }
})