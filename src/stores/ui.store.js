import {observable,action} from 'mobx'
class UIStore{
    @observable choose_quiz_modal_open = false
    @observable keyword_answer_modal_open = false
    @action closeChooseQuizModal=()=>{
        this.choose_quiz_modal_open=false
    }

    @action openChooseQuizModal=()=>{
        this.choose_quiz_modal_open=true
    }

    @action closeKeywordAnswerModal=()=>{
        this.keyword_answer_modal_open=false
    }

    @action openKeywordAnswerModal=()=>{
        this.keyword_answer_modal_open=true
    }

}

const uIStore = new UIStore();
export default uIStore 



