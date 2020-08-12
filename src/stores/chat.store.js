
import {observable,action, flow, computed} from 'mobx'
import userStore from './user.store';
class ChatStore{
    @observable chat_id=null;
    @observable game_id=null;
    @observable team_index=null;
    @observable chat_type=null;
    @observable messages=[];

   
    @action updateChat= async (chat)=>{
        this.chat_id=chat.chat_id;
        this.game_id=chat.game_id;
        this.team_index=chat.team_index;
        this.chat_type=chat.chat_type;
        this.messages=chat.messages;
    }

    toString=()=>{
        return ('chat_id : '+this.chat_id+
            '  ,game_id : '+this.game_id+
            '  ,team_index : '+this.team_index+
            '  ,chat_type : '+this.chat_type+
            '   ,messages : '+this.messages)
    }
}

const chatStore = new ChatStore();
export default chatStore



