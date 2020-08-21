import {observable,action, computed, when} from 'mobx'
import {length} from '../utils/custom_func'
import userStore from './user.store';
class GameStore{
   


    @observable game=null;
    @observable game_list=null;
    @observable chat_type='team'
    @observable is_finished =false 
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
        return gameStore.chat_type==='all'?
                 gameStore.game.team_number:gameStore.user_team_index
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

    @computed get current_quiz(){
        if (this.current_round===null) return null;
        return this.current_round.quizzes[this.current_round.current_quiz_index]
    }

    @computed get current_chat(){
        return this.game.chats[this.user_chat_index]
    }

    @computed get is_keyword_answer_time(){
        return (gameStore.current_round.current_quiz_index===-1)
    }

    @computed get is_answered_by_user(){
        if (this.current_quiz.answers==undefined 
         || this.current_quiz.answers==null ) return false;
        return (this.current_quiz.answers.filter(
            answer=>answer.user_id===userStore.user.user_id
        ).length > 0)
    }

    @computed get is_keyword_answered_by_user(){
        if (this.current_round.keyword.answers==undefined
        || this.current_round.keyword.answers==null) return false
        
        return (this.current_round.keyword.answers.filter(
            answer=>answer.user_id===userStore.user.user_id
        ).length > 0)
    }

    @computed get is_available_to_answer_keyword(){
        if (gameStore.current_round===null) return false;
        return (
            gameStore.user_team_index!==-1
            && !gameStore.current_round.keyword.is_solved
            && !gameStore.is_keyword_answered_by_user)
    }

    @computed get is_available_to_answer_quiz(){

        console.log('is_available_to_answer_quiz user_team_index :',   gameStore.user_team_index)
        console.log('is_available_to_answer_quiz  is_keyword_answer_time:',   gameStore.is_keyword_answer_time)
        console.log('is_available_to_answer_quiz is_solved:',   gameStore.current_quiz.is_solved )
        console.log('is_available_to_answer_quiz is_answered_by_user :',   gameStore.is_answered_by_user )
        console.log('is_available_to_answer_quiz current_round :',   gameStore.current_round )
        if (gameStore.current_round===null) return false;
        return (
            gameStore.user_team_index!==-1
            && !gameStore.is_keyword_answer_time
            && !gameStore.current_quiz.is_solved 
            && !gameStore.is_answered_by_user 


        )
    }

    @computed get picked_quizzes_number(){
        return gameStore.current_round.quizzes.filter(quiz=>quiz.is_picked).length
    }

    @action countDownAnswerTime(){
        this.current_round.remaining_time_answer--;
        console.log('remainingTime: ',this.current_round.remaining_time_answer)
    }

    @action finishGame=()=>{
        this.is_finished=true;
    }
    
    @action updateGame=(game)=>{
        this.game=game;
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
        return ('GameStore toString()',this.game)
    }
}

const gameStore = new GameStore();
export default gameStore 



