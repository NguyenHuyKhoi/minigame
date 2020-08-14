
import {observable,action, computed} from 'mobx'
import userStore from './user.store';
class GameStore{
    @observable game=null;
    @observable game_list=null;
    @observable chat_type='team'

    @computed get user_team_index(){
        const res=this.game.teams.filter(team => 
            team.members.filter(member =>  member.user_id===userStore.user.user_id ).length>0
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
        return this.game.rounds[this.game.current_round_index]
    }

    @computed get current_quiz(){
        return this.current_round.quizzes[this.current_round.current_quiz_index]
    }

    @computed get is_answered_by_user(){
        return (this.current_quiz.answers.filter(
            answer=>answer.user_id===userStore.user.user_id
        ).length > 0)
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



