import firestore from '@react-native-firebase/firestore'
// import chatStore from '../stores/chat.store';
import userStore from '../stores/user.store';
import { get } from 'mobx';
// import { teamAStore, teamBStore } from '../stores/team.store';
// import roundStore from '../stores/round.store';
import gameStore from '../stores/game.store';
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

    gameDataSync= async (filter)=>{
        const gameRef=this.db.collection('games').doc(''+filter.game_id)
        gameRef.onSnapshot(
            (game)=>{
                gameStore.updateGame({
                    game_id:game.data().game_id,
                    round_number:game.data().round_number,
                    team_number:game.data().team_number,
                    current_round_index:game.data().current_round_index,  
                })
            },
            (error)=>{
                console.log(error)
            }
        )

        gameStore.updateGame({
            chat_team:{
                ...gameStore.chat_team,
                chat_type:'team',
                team_index:filter.team_index,
            }
        })
        
        this.db.collection('games').doc(''+filter.game_id)
            .collection('chats').doc(''+filter.team_index)
            .collection('messages')
            .onSnapshot(
                (messages)=>{
                console.log('chats :',messages.docs.map(message=>message.data()))
                gameStore.updateGame({
                    chat_team:{
                        ...gameStore.chat_team,
                        messages : messages.docs.map(message=>message.data())
                    }
                })
                }
                ,
                ()=>{}
            )  

        console.log('team_number :',gameStore.team_number);
        for (let team_index=0;team_index<2;team_index++){
            this.db.collection('games').doc(''+filter.game_id)
                    .collection('teams').doc(''+team_index)
                    .onSnapshot(
                        (team)=>{
                            console.log('adding team ',team.data())
                            gameStore.updateGame({
                                teams :gameStore.teams.set(team_index,{
                                    team_index:team.team_index,
                                    team_name:team.team_name,
                                    max_count_member:team.max_count_member
                                })
                            })

                           console.log('teams added :', gameStore.teams.get(team_index))
                        }
                )

            this.db.collection('games').doc(''+filter.game_id)
                    .collection('teams').doc(''+team_index)
                    .collection('members')
                    .onSnapshot(
                        (members)=>{
                            gameStore.updateGame({
                                teams :gameStore.teams.set(team_index,{
                                    ...gameStore.teams.get(team_index),
                                    members:members.docs.map(snap=>snap.data())
                                })
                            })
                        }
                )
        }

        this.db.collection('games').doc(''+filter.game_id)
            .collection('rounds').doc(''+gameStore.current_round_index)
            .onSnapshot(
                (round)=>{
                    gameStore.updateGame({
                        current_round:{
                            round_index:round.data().round_index,
                            topic:round.data().topic,
                            current_quiz_index:round.data().current_quiz_index,
                            quiz_number:round.data().quiz_number
                        }
                    })
                }
            );

        for (let quiz_index=0;quiz_index<gameStore.current_round.quiz_number;quiz_index){
            
        }


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