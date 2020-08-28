import {observable,action} from 'mobx'
class UIStore{
    @observable choose_quiz_modal_open = false
    @observable keyword_answer_modal_open = false
    @observable rule_modal_open = false
    @observable answered_quiz_detail_modal_open = false
    @observable answered_quiz_detail_modal_data=null;

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

    @action closeRuleModal=()=>{
        this.rule_modal_open=false
    }

    @action openRuleModal=()=>{
        this.rule_modal_open=true
    }

    @action closeAnsweredQuizDetailModal=()=>{
        this.answered_quiz_detail_modal_open=false
    }

    @action openAnsweredQuizDetailModal=()=>{
        this.answered_quiz_detail_modal_open=true
    }

    @action updateAnsweredQuizDetailModalData=(quiz)=>{
        this.answered_quiz_detail_modal_data=quiz
    }

}

const uIStore = new UIStore();
export default uIStore 



