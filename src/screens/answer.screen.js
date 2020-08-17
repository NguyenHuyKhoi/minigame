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
            answer :'',
            quiz :null
        }
    }


    updateAnswer=(answer)=>{
        this.setState({
            answer:answer
        })
    }
    
    renderQuiz =()=>{
        const params=this.props.navigation.state.params
        let quiz=null 
    //    if (params.quiz_index!==null)  quiz=gameStore.current_round.quizzes[params.quiz_index] else 
        quiz=gameStore.current_quiz;  
        return (
            <Text>{quiz.content}</Text>
        )
    }
    renderAnswers=()=>{
        const params=this.props.navigation.state.params
        console.log('paramsOnAnswer ',params)
        const round =gameStore.current_round ;
        
        let quiz =null 
      //  if (params.quiz_index!==null) quiz=gameStore.current_round.quizzes[params.quiz_index] else 
        quiz=gameStore.current_quiz; 

        console.log('renderAnswers - currentQuiz :',quiz);

        let answers=null
        if (quiz.answers!==null && quiz.answers!==undefined) answers= Object.values(quiz.answers);
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


    
    sendAnswer=async  ()=>{
        if (this.state.answer===''){
             Alert.alert('answer is empty ');
            return 
        }

        // if (gameStore.current_quiz.is_solved){
        //     Alert.alert('This quiz has been solved ..., can answered more ')
        //     return 
        // }

        // if (gameStore.is_answered_by_user){
        //     Alert.alert('You answers this quiz ...,can answered more ')
        //     return ;
        // }
       

      
     
        await fireStoreHelper.sendAnswer({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            quiz_index:gameStore.current_quiz.quiz_index,
            content:this.state.answer,
            team_index:gameStore.user_team_index,
            user:userStore.user
        });

         Alert.alert('Submit answer successfully :'+this.state.answer);

        if (gameStore.current_quiz.correct_answer===this.state.answer){
             Alert.alert("Correct answer ...")
            await fireStoreHelper.confirmSolver({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                quiz_index:gameStore.current_quiz.quiz_index,
                user:userStore.user,
                team_index:gameStore.user_team_index,
            })

            await fireStoreHelper.openHintPiece({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
            })

            const next_quiz = gameStore.current_round.current_quiz_index<gameStore.current_round.quiz_number-1?
                gameStore.current_round.current_quiz_index+1:-1

            if (next_quiz===-1){
                 Alert.alert("Solve all quizzes, please guess keyword now ")
                return ;
            }

            await fireStoreHelper.nextQuiz({
                game_id:gameStore.game.game_id,
                round_index:gameStore.current_round.round_index,
                quiz_index:next_quiz,
            })
        }
        else {
             Alert.alert("Wrong answer")
        }

        this.setState({
            answer:''
        })

        
    }

    goToChat=()=>{
        this.props.navigation.navigate('chat')
    }

    goToGame=()=>{
        this.props.navigation.navigate('game')
    }
    render(){
       // const params=this.props.navigation.state.params;
        return (
            ///only 2 teams 
            <View style={styles.container}>
              
                <View style={{width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                   
                    <View style={{flex:10}}>    
                     {this.renderQuiz()}
                    </View>
                
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
           

                    {
                        !gameStore.current_quiz.is_solved 
                        && !gameStore.is_answered_by_user &&
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
                    }

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