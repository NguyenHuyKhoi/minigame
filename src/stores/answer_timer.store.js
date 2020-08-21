
import {observable,action} from 'mobx'
import fireStoreHelper from '../utils/firestore.helper'
import gameStore from './game.store'
import userStore from './user.store'
class AnswerTimerStore{
    @observable remaining_time=null
    @observable is_running=false

    @observable time_outs=[];

    @action countDown=async ()=>{
        if (!this.is_running) return ;
        this.remaining_time--;
        console.log('countDownAnswerTimer :',this.remaining_time)

        if (this.remaining_time<=0 ){
            this.stop();
            if (gameStore.game.answer_timer.update_by_user_id===-1){
                //no one update answer timer when time out a quiz 
                

                // time_out a quiz 

                //update_by_user_id set by user_id to prevent others update answer timer again 
                await fireStoreHelper.updateAnswerTimer({
                    game_id:gameStore.game.game_id,
                    start_time:(new Date()).toString(),
                    update_by_user_id:userStore.user.user_id
                })

                let next_indexes=fireStoreHelper.findNextIndexes({
                    keyword_guessed:false
                });
                console.log('nextIndexes ',next_indexes)
                if (next_indexes===null) {
                    gameStore.finishGame();
                    return ;
                }

                await fireStoreHelper.chooseQuiz({
                    game_id:gameStore.game.game_id,
                    round_index: next_indexes.round_index,
                    quiz_index:next_indexes.quiz_index
                });

            

                //after all other users fail when update , set update_by_user_id === -1 for next answer timer update .
                setTimeout(()=>{
                    fireStoreHelper.resetUpdateByUserIdValue({
                        game_id:gameStore.game.game_id,
                        update_by_user_id:-1
                    })
                },3000);
            }
            return ;

            //time_out a keyword 
        }
        
        this.time_outs.push(setTimeout(()=>this.countDown(),1000))
    }

    @action stop=()=>{
        console.log('stopAnswerTimer :')
        this.is_running=false
        this.time_outs.forEach(time_out=>{
            clearTimeout(time_out)
        })
        this.time_outs=[];
    }

    @action start=(start_time_string)=>{
        console.log('startAnswerTimer :')
        this.reset(start_time_string);
        this.countDown();
    }

    @action reset=(start_time_string)=>{
        console.log('resetAnswerTimer :')
        this.is_running=true;

        let start_time_date =new Date(start_time_string)
        let current_time_date=new Date();

        let start_time=start_time_date.getTime();
        let answer_duration=gameStore.is_keyword_answer_time?
            gameStore.game.keyword_answer_time*1100:
            gameStore.game.answer_time_per_quiz*1100
        let end_time=start_time+answer_duration;

        let current_time=current_time_date.getTime();

        this.remaining_time=Math.floor((end_time-current_time)/1000);
        console.log('answerTimerOnStart ',gameStore.game.answer_time_per_quiz)
        console.log('answerTimerOnStart ',this.remaining_time)
    }
}

const answerTimerStore =new AnswerTimerStore();

export default answerTimerStore 




