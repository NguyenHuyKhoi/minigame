
import {observable,action} from 'mobx'
import {create,persist } from 'mobx-persist'
import { AsyncStorage } from 'react-native';
class UserStore{
    @persist('object') @observable user=null;
    @action updateUser=(user)=>{
        console.log('updateUser :',user)
        this.user=user
        console.log('complete update user :',this.user)
    }

     toString=()=>{
        return ('UserStore toString() : '+this.user) 
    }
}

export const hydrate = create({
    storage : AsyncStorage,
    jsonify :true
});

const userStore = new UserStore();
hydrate('userStore',userStore)
console.log('userStore hydrate :',userStore.user)
export default userStore 



