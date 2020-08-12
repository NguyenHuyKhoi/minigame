import firestore from '@react-native-firebase/firestore'
import users from '../sample_data/users'
import games from '../sample_data/games'

class PushTestData {

    constructor(){
        this.db=firestore();
    }
     pushUsersData=async ()=>{
        await 
            users.forEach((user,index)=>{
                this.db.collection('users').doc(''+index)
                    .set(user)
                    .then(console.log('added user :',user));
            })
    }

    pushGamesData=async ()=>{
        await 
            games.forEach(async (game)=>{
                const gameRef= this.db.collection('games').doc(''+game.game_id)
                await gameRef.set({
                    game_id:game.game_id,
                    round_number:game.round_number,
                    join_code:game.join_code,
                    current_round_index:game.current_round_index,
                    team_number:game.team_number
                });

                await game.chats.forEach(async (chat)=>{
                    const chatRef=gameRef.collection('chats').doc(''+chat.team_index);
                    await chatRef.set({
                            chat_type:chat.chat_type,
                            team_index:chat.team_index,
                        });
                
                    await chat.messages.forEach((message)=>{
                        chatRef.collection('messages').doc(''+message.time_stamp)
                            .set(message)
                        })
                })

                await game.teams.forEach(async (team)=>{
                    const teamRef=gameRef.collection('teams').doc(''+team.team_index)
                    await teamRef.set({
                            team_index:team.team_index,
                            team_name:team.team_name,
                            max_count_member:team.max_count_member
                        });
                    
                    await team.members.forEach(async (member)=>{
                        await teamRef.collection('members').doc(''+member.member_index)
                            .set(member)
                    })
                })

                await game.rounds.forEach(async (round)=>{
                    const roundRef=gameRef.collection('rounds').doc(''+round.round_index)
                    await roundRef.set({
                        round_index:round.round_index,
                        topic:round.topic,
                        key_word:round.key_word,
                        current_quiz_index:round.current_quiz_index,
                        quiz_index:round.quiz_number
                    });

                    await round.quizzes.forEach(async (quiz)=>{
                        const quizRef=roundRef.collection('quizzes').doc(''+quiz.quiz_index)
                        await quizRef.set({
                            quiz_index:quiz.quiz_index,
                            content:quiz.content,
                            correct_answer:quiz.correct_answer
                        })
                        
                        await quiz.answers.forEach(async (answer)=>{
                            await quizRef.collection('answers').doc(''+answer.answer_index)
                                .set(answer)
                        })
                       
                    });
                })
               
            })
    }
    pushAllData=()=>{
        this.pushUsersData();
        this.pushGamesData();
    }
}

const pushTestData=new PushTestData();
export default pushTestData;