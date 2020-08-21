import {
    Alert 
} from 'react-native'

import database from '@react-native-firebase/database'
import userStore from '../stores/user.store';
import gameStore from '../stores/game.store';
import {length,parseValues} from './custom_func'
import answerTimer from '../stores/answer_timer.store';

class FireStoreHelper {
    constructor(){
        this.db=database();
    }

    loginUser=async (user_name,password)=>{
        console.log('FireStoreHelper loginUsers',user_name,password)

        const users= await 
            this.db.ref('users')
                .orderByChild('credential')
                .equalTo(user_name+'-'+password)
                .once('value');
        

        if (users.val()===null) return false;
        console.log('user data:',parseValues(users.val())[0])   
        userStore.updateUser(parseValues(users.val())[0])
        return true
    }

    registerUser=async (user_name,password)=>{
        console.log('FireStoreHelper registerUser',user_name,password)
        const users = await 
            this.db.ref('users')
                .orderByChild('user_name')
                .equalTo(user_name)
                .once('value')

        console.log('registerUser log :',users.val())
        if (users.val()!==null) return false ;

        const newRef=await 
            this.db.ref('users')
                .push();

        console.log('new user key :',newRef.key)

        newRef.set({
            user_id:newRef.key,
            user_name:user_name,
            password:password,
            credential:user_name+'-'+password
        })
        .then(()=>console.log("Adding user successfully"))
        
        return true;

    }

    getGamesList=async ()=>{
        console.log('FireStoreHelper getGameList')
        const games = await 
            this.db.ref('metadata_games')
                .on('value',snapshot=>{
                    console.log('gameList :',snapshot.val())
                    gameStore.updateGameList(snapshot.val())
                })    
    };

    findGame=async (filter)=>{
        await this.db.ref('games/'+filter.game_id)
            .on('value',snapshot=>{
                gameStore.updateGame(snapshot.val())
            })

        await this.db.ref('games/'+filter.game_id)
            .on('child_changed',snapshot=>{
                if (snapshot.key!=='answer_timer') return ;
                console.log('child_changed_snapshot',snapshot.val())
                answerTimer.stop();
                answerTimer.start(snapshot.val().start_time)
            })
    }

    chooseTeam=async (data)=>{
        console.log('chooseTeamData :',data)
        let member_count=length(gameStore.game.teams[data.team_index].members);

        console.log('memberCountChooseTeam:',member_count)
        await this.db.ref('games/'+data.game_id+'/teams/'+data.team_index+'/members/'+member_count)
            .set({
                member_index:member_count,
                user_id:data.user.user_id,
                user_name:data.user.user_name,
                score:0
            })
            .then(()=>console.log('adding user to team ',data.team_index))
    }   

    sendMessage=async (data)=>{
        console.log('sendMessageData :',data)
        await this.db.ref('games/'+data.game_id+'/chats/'+data.chat_index+'/messages/')
            .push({
                content:data.message,
                time_stamp:23235,
                user_id:data.user.user_id,
                user_name:data.user.user_name
            })
            .then(()=>console.log('send message successfully '))
    }

    sendAnswer=async (data)=>{
        console.log('SendAnswerData :',data)
        let answer_index=length(gameStore.current_quiz.answers)

        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+data.quiz_index+'/answers/'+answer_index)
            .set({
                answer_index:answer_index,
                content:data.content,
                team_index:data.team_index,
                user_id:data.user.user_id,
                user_name:data.user.user_name,
                answer_time:data.answer_time
            })
            .then(()=>console.log('Send answer successfully '))
    }
    sendKeywordAnswer=async (data)=>{
        console.log('SendKeywordAnswerData :',data)
        let answer_index=length(gameStore.current_round.keyword.answers)
      
        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/keyword/answers/'+answer_index)
            .set({
                answer_index:gameStore.answer_index,
                content:data.content,
                team_index:data.team_index,
                user_id:data.user.user_id,
                user_name:data.user.user_name
            })
            .then(()=>console.log('Send keyword answer successfully '))
    }


    confirmSolver=async (data)=>{
        console.log('confirmSolverData :',data)
        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+data.quiz_index)
            .update({
                is_solved:true,
                solved_by_user_id:data.user.user_id,
                solved_by_team_index:data.team_index,
            })
            .then(()=>console.log('confirm solver successfully '))
    }

    confirmKeywordSolver=async (data)=>{
        console.log('confirmKeywordSolverData :',data)
        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/keyword/')
            .update({
                is_solved:true,
                solved_by_user_id:data.user.user_id,
                solved_by_team_index:data.team_index,
            })
            .then(()=>console.log('confirm solver successfully '))
    }

    chooseQuiz=async(data)=>{
        console.log('chooseQuizData :',data)
        await this.db.ref('games/'+data.game_id)
            .update({
                current_round_index:data.round_index,
            })

        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index)
            .update({
                current_quiz_index:data.quiz_index,
            })

        if (data.quiz_index!==-1)
        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+data.quiz_index)
            .update({
                is_picked:true,
            })

    }

    updateAnswerTimer=async (data)=>{
        console.log('updateAnswerTimer :',data)
        await this.db.ref('games/'+data.game_id+'/answer_timer/')
            .update({
                start_time:data.start_time,
                update_by_user_id:data.update_by_user_id
            })
    }

    resetUpdateByUserIdValue=async (data)=>{
        console.log('resetUpdateBy...',data)
        await this.db.ref('games/'+data.game_id+'/answer_timer/')
            .update({
                update_by_user_id:data.update_by_user_id
            })
    }

  

    openHintPiece=async (data)=>{
        console.log('openHintPiece ',data)
        let piece_status =gameStore.current_round.hint_image.piece_status;
        console.log('piece_status',piece_status)

        if (piece_status.filter(item=>item===1).length===length(piece_status)) return ;
        
        let rand=Math.floor(Math.random()*10)+2;
        let step=0;
        let i=0;
        console.log(`rand = ${rand}, step = ${step}, i =${i}`)
        while (true){
            if (piece_status[i]===0) step++;
            if (step===rand) break; 
            if (i===piece_status.length-1) i=0 ;    
                else i++;
            console.log(`rand = ${rand}, step = ${step}, i =${i}`)
        }
        console.log(`rand = ${rand}, step = ${step}, i =${i}`)

        piece_status[i]=piece_status[i]===0?1:0;

        piece_status.forEach((value,index)=>console.log(' index =',index,value))

        piece_status.forEach(async (value,index) =>{
            await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/hint_image/piece_status')
            .update({
                [index]:value
            })
        })


    }

    openAllHintPiece=async (data)=>{
        console.log('openAllHintPiece ',data)
        let piece_status =gameStore.current_round.hint_image.piece_status;
        await piece_status.forEach(async (value,index) =>{
            await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/hint_image/piece_status')
            .update({
                [index]:1
            })
        })


    }

    openAllCorrectAnswers=async (data)=>{
        console.log('openAllCorrectAnswers ',data)
        await gameStore.current_round.quizzes.forEach(async (quiz,index) =>{
            await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+index)
            .update({
                is_solved :true
            })
        })


    }


    notifyAnswerTimeOut=async (data)=>{
        await this.db.ref('games/'+data.game_id+'/answer_timer/')
            .update({
                start_time:data.start_time,
                current_quiz_index:data.current_quiz_index
            })
    }

    findNextIndexes=(data)=>{
        console.log('findNextIndexes :',data)
        if (data.keyword_guessed){
            //move next round
            if (gameStore.game.current_round_index<gameStore.game.round_number-1){
                return {
                    quiz_index:0,
                    round_index:gameStore.current_round.round_index+1
                }
            }
            else return null
        }
        else {
            //move next quiz 
            if (gameStore.picked_quizzes_number<gameStore.current_round.quiz_number){
                return {
                    quiz_index:gameStore.current_round.current_quiz_index+1,
                    round_index:gameStore.current_round.round_index
                }
            }
            else if (!gameStore.is_keyword_answer_time) return {
                quiz_index:-1,
                round_index:gameStore.current_round.round_index
            } 
            else if (gameStore.game.current_round_index<gameStore.game.round_number-1){
                    return {
                        quiz_index:0,
                        round_index:gameStore.current_round.round_index+1
                    }
                }
            else return null
        }
        
    }
}

const fireStoreHelper=new FireStoreHelper();
export default fireStoreHelper;