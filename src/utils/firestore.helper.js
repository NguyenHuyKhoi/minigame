import {
    Alert 
} from 'react-native'

import database from '@react-native-firebase/database'
import userStore from '../stores/user.store';
import gameStore from '../stores/game.store';
import {length,parseValues} from './custom_func'

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

    listenGameChange=async (filter)=>{
        await this.db.ref('games/'+filter.game_id)
            .on('value',snapshot=>{
                gameStore.updateGame(snapshot.val())
        })
    }

    // listenQuizSolver=async(filter)=>{
    //     this.db.ref('games/'+filter.game_id+'/rounds/'+filter.round_index)
    //         .on('child_changed',snapshot=>{
    //             if (snapshot.key!=='current_quiz_index') return ;
    //             console.log('Current_quiz_index changed data :',snapshot.val());
    //            // this.db.ref('games/'+filter.game_id+'/rounds/'+filter.round_index+)
    //         })
    // }

    listenCountdownTimerChange=async(filter)=>{
        await this.db.ref('games/'+filter.game_id+'/countdown_timer/')
            .on('value',snapshot=>{
                const data=snapshot.val();
                if (gameStore.game.is_finished!==undefined
                    && gameStore.game.is_finished===true) return;
                if (data.type==='not_start_by_anyone') {
                    // no one join game before ,so this user can start count-down timer for choosing team :
                    let date =new Date();
                    fireStoreHelper.updateCountdownTimer({
                         game_id:gameStore.game.game_id,
                         duration:gameStore.game.countdown_timer.durations.choose_team,
                         type:'choose_team',
                         update_by_user_id:userStore.user.user_id,
                         start_at: date.toString()
                     })


                }
                else 
                // not reset update_by_user_id action
                if (data.update_by_user_id!==-1 ){
                    gameStore.startCountdownTimer(data)
                }

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
        const message_count=length(gameStore.current_chat.messages)
        await this.db.ref('games/'+data.game_id+'/chats/'+data.chat_index+'/messages/'+message_count)
            .set({
                content:data.message,
                message_time:data.message_time,
                user_id:data.user.user_id,
                user_name:data.user.user_name,
                team_index:data.team_index
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
                solved_by_user_name:data.user.user_name,
                solved_by_team_index:data.team_index,
                solved_by_team_name:data.team_name
            })
            .then(()=>console.log('confirm solver successfully '))

        let info=gameStore.user_info_in_team;
        console.log('confirmSolver team_index :',gameStore.user_team_index)
        console.log('confirmSolver member_index :',gameStore.user_member_index)
        console.log('confirmSolver user_info_in_team :',gameStore.user_info_in_team)
        console.log('confirmSolver score_of_current_quiz :',gameStore.score_of_current_quiz)
        await this.db.ref('games/'+data.game_id+'/teams/'+data.team_index+'/members/'+info.member_index)
            .update({
                score:info.score+gameStore.score_of_current_quiz
            })
    }

    confirmKeywordSolver=async (data)=>{
        console.log('confirmKeywordSolverData :',data)
        await this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/keyword/')
            .update({
                is_solved:true,
                solved_by_user_id:data.user.user_id,
                solved_by_user_name:data.user.user_name,
                solved_by_team_index:data.team_index,
                solved_by_team_name:data.team_name
            })
            .then(()=>console.log('confirm solver successfully '))

        let info=gameStore.user_info_in_team;

      
    
            await this.db.ref('games/'+data.game_id+'/teams/'+data.team_index+'/members/'+info.member_index)
                .update({
                    score:info.score+gameStore.score_of_keyword
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
                is_picked_by_user_id:data.is_picked_by_user_id!==undefined?
                        data.is_picked_by_user_id:null
            })

    }

    chooseRound=async(data)=>{
        console.log('chooseRoundData :',data)
        await this.db.ref('games/'+data.game_id)
            .update({
                current_round_index:data.round_index,
            })
    }

    

    updateCountdownTimer=async (data)=>{
        await this.db.ref('games/'+data.game_id+'/countdown_timer/')
            .update({
                duration:data.duration,
                update_by_user_id:data.update_by_user_id,
                type:data.type,
                start_at:data.start_at
            })

        if (data.type!=='choose_team')
            setTimeout(()=>{
                this.resetUpdateByUserIdValue({
                    game_id:gameStore.game.game_id,
                    update_by_user_id:-1
                })
            },3000);
    }

    resetUpdateByUserIdValue=async (data)=>{
        console.log('resetUpdateBy...',data)
        await this.db.ref('games/'+data.game_id+'/countdown_timer/')
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

    finishGame=async (data)=>{
        console.log('finish Game ',data);
        await this.db.ref('games/'+data.game_id)
            .update({
                is_finished:true
            })
    }


}

const fireStoreHelper=new FireStoreHelper();
export default fireStoreHelper;