
import {observable,action,computed} from 'mobx'
import userStore from './user.store'


class TeamStore{
    @observable game_id=null;
    @observable team_id=null;
    @observable team_index=null;
    @observable team_name=null;
    @observable max_member_count=null;
    @observable members =[];
    @computed get isTeamOfUser(){
        const res=this.members.filter(user=>user.user_id===userStore.user_id);
        console.log('isTeamOfUser',res);
        return res.length>0 ;
    }

    @action updateTeam=async (team)=>{
        console.log('TeamA store :',team)
        this.game_id=team.game_id;
        this.team_id=team.team_id;
        this.team_index=team.team_index;
        this.team_name=team.team_name;
        this.max_member_count=team.max_member_count;
        this.members=team.members;
    }

    toString=()=>{
        return ('game_id : '+this.game_id+
            '  ,team_id : '+this.team_id+
            '  ,team_index : '+this.team_index+
            '  ,team_name : '+this.team_name+
            '  ,max_member_count '+this.max_member_count+
            '  ,members :'+this.members)
    }
}

const teamAStore = new TeamStore();
const teamBStore = new TeamStore();
export {teamAStore,teamBStore} 



