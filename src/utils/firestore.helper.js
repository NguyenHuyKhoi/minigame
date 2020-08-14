import database from '@react-native-firebase/database'
import userStore from '../stores/user.store';
import gameStore from '../stores/game.store';
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
        console.log('user data:',Object.values(users.val())[0])   
        userStore.updateUser(Object.values(users.val())[0])
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
        this.db.ref('games/'+filter.game_id)
            .on('value',snapshot=>{
            //    console.log('findGame :',snapshot.val())
                gameStore.updateGame(snapshot.val())
            })
    }

    chooseTeam=async (data)=>{
        console.log('chooseTeamData :',data)
        const member_count=gameStore.game.teams[data.team_index].members.length;

        this.db.ref('games/'+data.game_id+'/teams/'+data.team_index+'/members/'+member_count)
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
        this.db.ref('games/'+data.game_id+'/chats/'+data.chat_index+'/messages/')
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
        this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+data.quiz_index+'/answers/'+gameStore.current_quiz.answers.length)
            .set({
                answer_index:gameStore.current_quiz.answers.length,
                content:data.content,
                team_index:data.team_index,
                user_id:data.user.user_id,
                user_name:data.user.user_name
            })
            .then(()=>console.log('Send answer successfully '))
    }

    confirmSolver=async (data)=>{
        console.log('confirmSolverData :',data)
        this.db.ref('games/'+data.game_id+'/rounds/'+data.round_index+'/quizzes/'+data.quiz_index)
            .update({
                is_solved:true,
                solved_by_user_id:data.user.user_id,
                solved_by_team_index:data.team_index,
            })
            .then(()=>console.log('confirm solver successfully '))
    }


}

const fireStoreHelper=new FireStoreHelper();
export default fireStoreHelper;