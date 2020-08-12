import firestore from '@react-native-firebase/firestore'
import chatStore from '../stores/chat.store';
import userStore from '../stores/user.store';
import { get } from 'mobx';
import { teamAStore, teamBStore } from '../stores/team.store';
import roundStore from '../stores/round.store';
class FireStoreHelper {
    constructor(){
        this.db=firestore();
    }
    loginUser=async (user_name,password)=>{
        var db=firestore();

        console.log('FireStoreHelper loginUsers',user_name,password)

        const users= await 
            db.collection('users')
                .where('user_name','==',user_name)
                .where('password','==',password)
                .get();

        console.log('user size :',users.size)
        if (users.size===0) return null;
        console.log('finding user :',users.docs[0].data())
        return (users.docs[0].data())  ;    
    }

    registerUser=async (user_name,password)=>{
        console.log('FireStoreHelper registerUser',user_name,password)
        const users = await 
            this.db.collection('users')
            .where('user_name','==',user_name)
            .get();
        if (users.size>0) return null ;

        const usersNumber =await 
            (await this.db.collection('users').get()).size;
        console.log('userNumber : '+usersNumber)

        const createUser = await   
            this.db.collection('users').doc(''+usersNumber).set({
                user_name:user_name,
                password:password,
                user_id:usersNumber
            });

        console.log('create user :',createUser);
        return ({
            user_name :user_name,
            password: password
        });

    }

    getGamesList=async ()=>{
        console.log('FireStoreHelper getGameList')
        const games = await 
            this.db.collection('games')
                .get();

       games.forEach(documentSnapshot=>{
            console.log('FireStoreHelper getGameList',documentSnapshot.data())
        });
        
        return games.docs;
        
    };

    findTeam= async (filter)=>{
        console.log('findTeamFilter :',filter)
        const teams=await this.db.collection('teams')
            .where('game_id','==',filter.game_id)
            .where('team_index','==',filter.team_index)
            .get();

        if (teams.size===0) return null;

        const team_id=teams.docs[0].data().team_id;

        await this.db.collection('teams')
            .doc(''+team_id)
            .onSnapshot((querySnapshot)=>{
                let team=querySnapshot.data();
                console.log('findTeamInfo :',team)
                if (filter.team_index===0){
                    teamAStore.updateTeam(team)
                }
                else {
                    teamBStore.updateTeam(team)
                }
                console.log('get realtimeChat:',team)
            },
            (error)=>{
                console.log('getRealtimeChat error :',error)
            });
    }

    findRound= async (filter)=>{
        console.log('findRoundFilter :',filter)
        const rounds=await this.db.collection('rounds')
            .where('game_id','==',filter.game_id)
            .where('round_index','==',filter.round_index)
            .get();

        if (rounds.size===0) return null;

        const round_id=rounds.docs[0].data().round_id;

        await this.db.collection('rounds')
            .doc(''+round_id)
            .onSnapshot((querySnapshot)=>{
                let round=querySnapshot.data();
                console.log('findRoundInfo :',querySnapshot)
                querySnapshot.ref.collection('quizzes').get()
                    .then((quizzes)=>
                        quizzes.docs.forEach((quiz)=>{
                            console.log('findQuizInfo :',quiz.data())
                        }));
                
                roundStore.updateRound(round);
            },
            (error)=>{
                console.log('findRound error :',error)
            });
    }


    chooseTeam=async (team,user)=>{
        console.log('chooseTeam :',team,user)
        team.members.push({
            id:team.members.length,
            user_id:user.user_id,
            user_name:user.user_name,
            score :0
        })

        await 
            this.db.collection('teams').doc(''+team.team_id)
                .update({
                    members:team.members
                })
    }
   
    findChat=async (filter)=>{
        console.log('findChatFilter :',filter)
        const chats =await this.db.collection('chats')
            .where('game_id','==',filter.game_id)
            .where('team_index','==',filter.team_index)
            .where('chat_type','==',filter.chat_type)
            .get();

        if (chats.size===0) return null;

        const chat_id=chats.docs[0].data().chat_id;
     
        await this.db.collection('chats')
            .doc(''+chat_id)
            .onSnapshot((querySnapshot)=>{
                let chat=querySnapshot.data();
                chatStore.updateChat(chat);
                console.log('get realtimeChat:',chat)
            },
            (error)=>{
                console.log('getRealtimeChat error :',error)
            });
    }
    

    sendNewMessage=async (message)=>{
        console.log('sendNewMessage :',chatStore.chat_id);
        const chat =await 
            this.db.collection('chats').doc(''+chatStore.chat_id)
                .get();
        console.log('number message :',chat.data());

        console.log('message before added ',chat.data().messages);

        const msgs = chat.data().messages.push({
            content:message,
            user_name:userStore.user_name,
            user_id:userStore.user_id,
            team_index:0,
            message_id:chat.data().messages.length
        });

        console.log('message after added ',chat.data().messages);

        await   
            this.db.collection('chats').doc(''+chatStore.chat_id)
                .update({
                    messages:chat.data().messages
                })
    }
}

const fireStoreHelper=new FireStoreHelper();
export default fireStoreHelper;