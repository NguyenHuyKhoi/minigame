
import {observable,action} from 'mobx'
class RoundStore{
    @observable round_id=null;
    @observable game_id=null;
    @observable quiz_number=null;
    @observable key_word=null;
    @observable topic=null;
    @observable current_quiz_index=null;
    @observable quizzes =[];
    @action updateRound=(round)=>{
        console.log('Round store :',round)
        this.round_id=round.round_id;
        this.game_id=round.game_id;
        this.quiz_number=round.quiz_number;
        this.key_word=round.key_word;
        this.topic=round.topic;
        this.current_quiz_index=round.current_quiz_index;
        this.quizzes=round.quizzes;
        
    }

    toString=()=>{
        return ('Round_id : '+this.round_id+
            '  ,game_id : '+this.game_id+
            '  ,quiz_number : '+this.quiz_number+
            '  ,key_word : '+this.key_word+
            '  ,topic : '+this.topic+
            '  ,current_quiz_index : '+this.current_quiz_index+
            '  ,quizzes : '+this.quizzes)
    }
}

const roundStore = new RoundStore();
export default roundStore 



