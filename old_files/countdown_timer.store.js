
import {observable,action} from 'mobx'
import fireStoreHelper from '../utils/firestore.helper'
import gameStore from './game.store'
import userStore from './user.store'
class CountDownTimerStore{
    @observable remaining_time=null
    @observable type=null
    @observable update_by_user_id=null
    @observable durations=null

    @observable is_running=false
    @observable time_outs=[];

    @action countDown=async ()=>{
        if (!this.is_running) return ;
        this.remaining_time--;

        if (this.remaining_time<=0 ){
            this.stop();
            // if (gameStore.game.answer_timer.update_by_user_id===-1){
            //     //no one update answer timer when time out a quiz 

            //     // time_out a quiz 

            //     //update_by_user_id set by user_id to prevent others update answer timer again 
            //     await fireStoreHelper.updateCountDownTimer({
            //         game_id:gameStore.game.game_id,
            //         start_time:(new Date()).toString(),
            //         update_by_user_id:userStore.user.user_id
            //     })

            //     let next_indexes=fireStoreHelper.findNextIndexes({
            //         keyword_guessed:false
            //     });
            //     console.log('nextIndexes ',next_indexes)
            //     if (next_indexes===null) {
            //         gameStore.finishGame();
            //         return ;
            //     }

            //     await fireStoreHelper.chooseQuiz({
            //         game_id:gameStore.game.game_id,
            //         round_index: next_indexes.round_index,
            //         quiz_index:next_indexes.quiz_index
            //     });

            

            //     //after all other users fail when update , set update_by_user_id === -1 for next answer timer update .
            //     setTimeout(()=>{
            //         fireStoreHelper.resetUpdateByUserIdValue({
            //             game_id:gameStore.game.game_id,
            //             update_by_user_id:-1
            //         })
            //     },3000);
            //}
            return ;

            //time_out a keyword 
        }
        
        this.time_outs.push(setTimeout(()=>this.countDown(),1000))
    }

    @action stop=()=>{
        console.log('stopCountdownTimer :')
        this.is_running=false
        this.time_outs.forEach(time_out=>{
            clearTimeout(time_out)
        })
        this.time_outs=[];
    }

    @action start=(data)=>{
        console.log('startCountdownTimer :',data)
        this.reset(data);
        this.countDown();
    }

    @action reset=(data)=>{
        console.log('resetCountdownTimer :',data)
        this.is_running=true
        this.remaining_time=data.duration*1000;
        this.type=data.type
        this.update_by_user_id=data.update_by_user_id;
        this.durations=data.durations
    }
}

const countDownTimerStore =new CountDownTimerStore();

export default countDownTimerStore 




