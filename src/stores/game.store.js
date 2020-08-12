
import {observable,action} from 'mobx'
class GameStore{
    @observable game_id=null;
    @observable current_round_index=null;
    @observable round_number=null;
    @observable join_code=null;
    @observable team_number=null;
    @observable chat_team=null;
    @observable chat_all=null;
    @observable teams=new Map();
    @observable current_round=null;

    @action updateGame=(game)=>{
        console.log('Game store :',game)
        if (game.game_id!==null) this.game=game.game_id;
        if (game.current_round_index!==null) this.current_round_index=game.current_round_index;
        if (game.round_number!==null) this.round_number=game.round_number;
        if (game.join_code!==null) this.join_code=game.join_code;
        if (game.team_number!==null) this.team_number=game.team_number;

        console.log('Update game :',this.toString())
    }

    toString=()=>{
        return ('game_id : '+this.game+
            '  ,current_round_index : '+this.current_round_index+
            '  ,round_number : '+this.round_number+
            '  ,join_code : '+this.join_code)
    }
}

const gameStore = new GameStore();
export default gameStore 



