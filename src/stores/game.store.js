
import {observable,action, computed} from 'mobx'
import userStore from './user.store';
class GameStore{
    @observable game=null;
    @observable game_list=null;
    @observable chat_type='team'

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

    @computed get current_quiz(){
        if (this.current_round===null) return null;
        return this.current_round.quizzes[this.current_round.current_quiz_index]
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
        return (!gameStore.current_round.keyword.is_solved
            && !gameStore.is_keyword_answered_by_user)
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



