import firestore from '@react-native-firebase/firestore'
import users from '../sample_data/users'
import games from '../sample_data/games'
import chats from '../sample_data/chats'
import teams from '../sample_data/teams'
import rounds from '../sample_data/rounds'
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
            games.forEach((game,index)=>{
               this.db.collection('games').doc(''+index)
                    .set(game)
                    .then(console.log('added game :',game));
            })
    };

    pushChatsData=async ()=>{
        await 
            chats.forEach((chat,index)=>{
            this.db.collection('chats').doc(''+index)
                    .set(chat)
                    .then(console.log('added chat :',chat));
            })
    }

    pushTeamsData=async ()=>{
        await 
            teams.forEach((team,index)=>{
                this.db.collection('teams').doc(''+index)
                    .set(team)
                    .then(console.log('added teams :',team))
            })
    }

    
    pushRoundsData=async ()=>{
        await rounds.forEach((round)=>{
            console.log('addingToFireStore :',round)
            this.db.collection('rounds').doc(''+round.round_id)
                .set({
                    round_id:round.round_id,
                    game_id:round.game_id,
                    round_index:round.round_index,
                    quiz_number:round.quiz_number,
                    key_word:round.key_word,
                    topic:round.topic,
                    current_quiz_index:round.current_quiz_index

                });
            round.quizzes.forEach((quiz)=>{
                this.db.collection('rounds').doc(''+round.round_id)
                    .collection('quizzes')
                    .doc(''+quiz.quiz_id)
                    .set({
                        quiz_id:quiz.quiz_id,
                        content:quiz.content,
                        correct_answer:quiz.correct_answer,
                        is_answered:quiz.is_answered,
                    });
                quiz.answers.forEach((answer)=>{
                    this.db.collection('rounds').doc(''+round.round_id)
                        .collection('quizzes')
                        .doc(''+quiz.quiz_id)
                        .collection('answers')
                        .doc(''+answer.answer_id)
                        .set({
                            answer_id:answer.answer_id,
                            content:answer.content,
                            user_id:answer.user_id,
                            user_name:answer.user_name,
                            team_index:answer.team_index,
                            is_correct:answer.is_correct
                        })
                })
            }) 
    })
    }
    pushAllData=()=>{
        this.pushUsersData();
        this.pushGamesData();
        this.pushChatsData();
        console.log('preparing addTeams :',teams)
        this.pushTeamsData();
        this.pushRoundsData();
    }
}

const pushTestData=new PushTestData();
export default pushTestData;