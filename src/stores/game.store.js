import {observable,action, computed, when} from 'mobx'
import {length} from '../utils/custom_func'
import userStore from './user.store';

import {
    Alert
} from 'react-native'
import fireStoreHelper from '../utils/firestore.helper';
import uIStore from './ui.store';
class GameStore{
   


    @observable game=null;
    @observable game_list=null;
    @observable chat_type='team'
    @observable is_finished =false 

    @observable remaining_time=null
    @observable is_running_timer =null
    constructor(){
    }

    @computed get user_team_index(){
        console.log('lengthTeams :',length(this.game.teams))
        if (length(this.game.teams)===0) return -1;

        const res=this.game.teams.filter(team => 
            length(team.members)>0 
            && team.members.filter(member =>  member.user_id===userStore.user.user_id ).length>0     
        )

        if (res.length===0) return -1;
        console.log('userStore :',userStore.user.user_name)
        console.log('user_team_index',res[0].team_index)
        return res[0].team_index;
    }

    @computed get user_chat_index(){
        return this.chat_type==='all'?
                 this.game.team_number:this.user_team_index
    }

    @computed get current_round(){
        if (this.game===null) return null;
        return this.game.rounds[this.game.current_round_index]
    }

    @computed get pick_random_team(){
        let arr=this.game.teams.filter(team=>
            length(team.members)<team.max_members);
        if (length(arr)===0) return -1;
        return arr[0].team_index;
    }

    @computed get pick_random_quiz(){
        if (!this.current_round) return null;
        const arr= this.current_round.quizzes.filter(quiz=>!quiz.is_picked);
        if (arr.length===0) return null;
        return (arr[Math.floor(Math.random()*arr.length)])
    }

    @computed get current_quiz(){
        if (this.current_round===null) return null;
        return this.current_round.quizzes[this.current_round.current_quiz_index]
    }

    @computed get current_chat(){
        return this.game.chats[this.user_chat_index]
    }

    @computed get is_keyword_answer_time(){
        return (this.current_round.current_quiz_index===-1)
    }

    @computed get is_answered_by_user(){
        if (this.current_quiz.answers==undefined 
         || this.current_quiz.answers==null ) return false;
        return (this.current_quiz.answers.filter(
            answer=>answer.user_id===userStore.user.user_id
        ).length > 0)
    }

    @computed get is_keyword_answered_by_user(){
        if (this.current_round.keyword.answers===undefined
        || this.current_round.keyword.answers===null) return false
        
        return (this.current_round.keyword.answers.filter(
            answer=>answer.user_id===userStore.user.user_id
        ).length > 0)
    }

    @computed get is_available_to_answer_keyword(){
        if (this.current_round===null) return false;
        if (this.user_team_index===-1) return false; 
        if (this.current_round.keyword.is_solved) return false ;
        if (this.is_keyword_answered_by_user) return false 
        return true; 
    }

    @computed get is_available_to_answer_quiz(){
        if (this.current_round===null) return false;
        if (this.user_team_index===-1) return false;
        if (this.is_keyword_answer_time) return false 
        if (this.current_quiz.is_solved) return false  
        if (this.is_answered_by_user) return false  
        return true
    }

    @computed get picked_quizzes_number(){
        return this.current_round.quizzes.filter(quiz=>quiz.is_picked).length
    }

    @computed get out_of_quizzes(){
        return (this.current_round.quizzes.filter(quiz=>quiz.is_picked).length
                ===this.current_round.quiz_number)
    }


    @computed get enable_join_game(){
        console.log('enable_join_game',this.game===null,this.game.countdown_timer.type)
        return (this.game 
        && this.game.countdown_timer.type!=='not_start_by_anyone'
        && this.game.countdown_timer.type!=='choose_team')
    }

    @observable time_outs=[];

  

    @action finishGame=()=>{
        this.is_finished=true;
    }
    
    @action updateGame=(game)=>{
        this.game={...game};
    }

    @action updateTeam=(team_index)=>{
        this.team_index=team_index;
    }

    @action updateGameList=(game_list)=>{
        this.game_list=game_list
    }

    @action updateChatType=(chat_type)=>{
        this.chat_type=chat_type
    }

    toString=()=>{
        return ('this toString()',this.game)
    }

    @action countDown=()=>{
        if (!this.is_running_timer) return ;
        this.remaining_time--;

        if (this.remaining_time<=0 ){
            this.stopCountdownTimer();
            this.updateCountdownTimer();
            return ;
        }
        
        this.time_outs.push(setTimeout(()=>this.countDown(),1000))
    }

    @action switchToChooseQuiz=async()=>{
        let timer =gameStore.game.countdown_timer;
        let date =new Date();
        await fireStoreHelper.updateCountdownTimer({
            game_id:gameStore.game.game_id,
            start_at:date.toString(),
            type:'choose_quiz',
            duration:timer.durations.choose_quiz,
            update_by_user_id:userStore.user.user_id
        });
    }

    @action switchToAnswerQuiz=async (data) => {
        // check if moving to next round and finish game :
        let round_index=gameStore.current_round.round_index+(data.next_round===true)
        if (round_index>=gameStore.game.round_number) {
            Alert.alert('Out out rounds , finish game')
            return ;
        }
    
        await fireStoreHelper.chooseRound({
            game_id:gameStore.game.game_id,
            round_index:round_index
        })

        // pick random quiz from this round : 
        let quiz= data.quiz!==null ? data.quiz:gameStore.pick_random_quiz;
        let timer =gameStore.game.countdown_timer;
        if (data.quiz===null) Alert.alert('Pick random quiz  : '+quiz.quiz_index)
            else Alert.alert('You chosen quiz  : '+quiz.quiz_index)

        await fireStoreHelper.chooseQuiz({
            game_id:gameStore.game.game_id,
            round_index:round_index,
            quiz_index:quiz.quiz_index
        })

        let date =new Date();
        await fireStoreHelper.updateCountdownTimer({
            game_id:gameStore.game.game_id,
            start_at:date.toString(),
            type:'answer_quiz',
            duration:timer.durations.answer_quiz,
            update_by_user_id:userStore.user.user_id
        });
    }

    @action switchToAnswerKeyword=async()=>{
         await fireStoreHelper.chooseQuiz({
            game_id:gameStore.game.game_id,
            round_index:gameStore.current_round.round_index,
            quiz_index:-1
        })
        Alert.alert('Time to guess keyword ')

        let timer =gameStore.game.countdown_timer;
        let date =new Date();
        await fireStoreHelper.updateCountdownTimer({
            game_id:gameStore.game.game_id,
            start_at:date.toString(),
            type:'answer_keyword',
            duration:timer.durations.answer_keyword,
            update_by_user_id:userStore.user.user_id
        });
    }


    @action updateCountdownTimer=()=>{
        //if someone updated timer to next stage before ,stop now ;
        let timer =gameStore.game.countdown_timer
        if (timer.update_by_user_id!==-1) return ;
        
        // stages when time out  : 
        //choose_team 
        //=> answer_quiz  <=> answer_quiz 
        //=> (when run out quizzes)=> answer_keyword 
        //=> (on next round)  answer_quiz <=> answer_quiz 
        //=> (when run out rounds ) finish game 
        switch (timer.type){
            case 'choose_team':{
                this.switchToAnswerQuiz({
                    next_round:false,
                    quiz:null
                }) 
                break;
            }

            case 'answer_quiz':{
                if (gameStore.pick_random_quiz===null) {
                   this.switchToAnswerKeyword()
                }
                else {
                   this.switchToAnswerQuiz({
                    next_round:false,
                    quiz:null
                }); 
                }

                break;
            }

            case 'answer_keyword':{
                this.switchToAnswerQuiz({
                    next_round:true,
                    quiz:null
                }); 
                break
            }

            case 'choose_quiz':{
                uIStore.closeChooseQuizModal()
                this.switchToAnswerQuiz({
                    next_round:false,
                    quiz:null
                });
                
                break;
            }

            default : {
                break; 
            }
        }
    }
    @action stopCountdownTimer(){
        console.log('stopCountdownTimer :')
        this.is_running_timer=false
        this.time_outs.forEach(time_out=>{
            clearTimeout(time_out)
        })
        this.time_outs=[];
    }

    @action startCountdownTimer(data){
        this.stopCountdownTimer();

        this.is_running_timer=true

        let date1=new Date(data.start_at);
        let date2=new Date();
        console.log('date1 :',date1.toString())
        console.log('date2 :',date2.toString())
        let second1=date1.getMilliseconds()/1000+data.duration;
        let second2=date2.getMilliseconds()/1000;

        console.log('second1 :',second1);
        console.log('second2 :',second2)
        this.remaining_time=Math.floor(second1-second2); 

        this.countDown();

    }
}

const gameStore = new GameStore();
export default gameStore 



