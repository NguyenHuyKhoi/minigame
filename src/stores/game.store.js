
import {observable,action} from 'mobx'
class GameStore{
    @observable game_id=null;
    @observable creator_id=null;
    @observable round_number=null;
    @observable join_code=null;
    @action updateGame=(game)=>{
        console.log('Game store :',game)
        this.game=game.game_id;
        this.creator_id=game.create_id;
        this.round_number=game.round_number;
        this.join_code=game.join_code;
    }

    toString=()=>{
        return ('game_id : '+this.game+
            '  ,creator_id : '+this.creator_id+
            '  ,round_number : '+this.round_number+
            '  ,join_code : '+this.join_code)
    }
}

const gameStore = new GameStore();
export default gameStore 



