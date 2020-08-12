
import {observable,action} from 'mobx'
import {create,persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native';
class UserStore{
    @persist @observable user_name=null;
    @persist @observable password=null;
    @persist @observable user_id=null;
    @action updateUser=(user)=>{
        console.log('updateUser :',user)
        this.user_name=user.user_name;
        this.password=user.password;
        this.user_id=user.user_id;
    }

     toString=()=>{
        return ('user_name : '+this.user_name+
            '  ,password : '+this.password+
            '  ,user_id : '+this.user_id)
    }
}

export const hydrate = create({
    storage : AsyncStorage,
    jsonify :true
});

const userStore = new UserStore();
hydrate('userStore',userStore)
console.log('userStore hydrate :',userStore.user_name)
export default userStore 



