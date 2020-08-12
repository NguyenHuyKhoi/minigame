export default [
    {
        'game_id':0,
        'round_number':2,
        'team_number':2,
        'join_code':'23123',
        'current_round_index':0,
        'chats':[
            {
                'chat_type':'team',
                'team_index':0,
                'messages':[
                    {
                        'time_stamp':'82385',
                        'content':'I am user1',
                        'user_name':'user1',
                        'user_id':1
                    },
                    {
                        'time_stamp':'8285',
                        'content':'I am user0',
                        'user_name':'user0',
                        'user_id':0
                    }
                ]
            },
            {
                'chat_type':'team',
                'team_index':1,
                'messages':[
                    {
                        'time_stamp':'2385',
                        'content':'I am user3',
                        'user_name':'user3',
                        'user_id':3
                    },
                    {
                        'time_stamp':'885',
                        'content':'I am user4',
                        'user_name':'user4',
                        'user_id':4
                    }
                ]
            },
            {
                'chat_type':'all',
                'team_index':-1,
                'messages':[
                    {
                        'time_stamp':'852385',
                        'content':'I am in team 0',
                        'user_name':'user0',
                        'user_id':0,
                        'team_index':0
                    },
                    {
                        'time_stamp':'85',
                        'content':'I am in team 1',
                        'user_name':'user4',
                        'user_id':4,
                        'team_index':1
                    },
                    {
                        'time_stamp':'5',
                        'content':'I am in team 1',
                        'user_name':'user3',
                        'user_id':3,
                        'team_index':1
                    }
                ]
            },
        ],
        'teams':[
            {
                'team_index':0,
                'team_name':'TeamA',
                'max_count_member':4,
                'members':[
                    {
                        'member_index':0,
                        'user_id':0,
                        'user_name':'user0',
                        'score':0
                    },
                    {
                        'member_index':1,
                        'user_id':1,
                        'user_name':'user1',
                        'score':0
                    },
                    {
                        'member_index':2,
                        'user_id':2,
                        'user_name':'user2',
                        'score':0
                    },
                ]
            },
            {
                'team_index':1,
                'team_name':'TeamB',
                'max_count_member':4,
                'members':[
                    {
                        'member_index':0,
                        'user_id':3,
                        'user_name':'user3',
                        'score':0
                    },
                    {
                        'member_index':1,
                        'user_id':4,
                        'user_name':'user4',
                        'score':0
                    },
                    {
                        'member_index':2,
                        'user_id':5,
                        'user_name':'user5',
                        'score':0
                    },
                ]
            }
        ],
        'rounds':[
            {
                'round_index':0,
                'topic':'International',
                'key_word':'UNICEF',
                'current_quiz_index':0,
                'quiz_number':4,
                'quizzes':[
                    {
                        'quiz_index':0,
                        'content':'Quiz 0 : what is social unit of people that is structured and managed to meet a need or to pursue collective goals',
                        'correct_answer':'Organization',
                        'answers':[
                            {
                                'answer_index':0,
                                'user_id':'0',
                                'user_name':'user0',
                                'team_index':0,
                                'content':'Team',
                                'is_correct':false
        
                            },
                            {
                                'answer_index':1,
                                'user_id':'1',
                                'user_name':'user1',
                                'team_index':0,
                                'content':'Group',
                                'is_correct':false
        
                            },
                            {
                                'answer_index':2,
                                'user_id':'5',
                                'user_name':'user5',
                                'team_index':1,
                                'content':'Organization',
                                'is_correct':true
        
                            }
                        ],
                        'is_answered':false,
                    },
                    {
                        'quiz_index':1,
                        'content':'Quiz 1: The biggest associations of nations in the worlds ',
                        'correct_answer':'United Nation',
                        'answers':[
                            {
                                'answer_index':0,
                                'user_id':'0',
                                'user_name':'user0',
                                'team_index':0,
                                'content':'United Nation',
                                'is_correct':true
        
                            }
                        ],
                        'is_answered':true
                    },
                    {
                        'quiz_index':2,
                        'content':'quiz 2 : A 6 year-old boy called ...',
                        'correct_answer':'Child',
                        'answers':[
                            {
                                'answer_index':0,
                                'user_id':'0',
                                'user_name':'user0',
                                'team_index':0,
                                'content':'Young',
                                'is_correct':false
        
                            },
                            {
                                'answer_index':0,
                                'user_id':'3',
                                'user_name':'user3',
                                'team_index':1,
                                'content':'Child',
                                'is_correct':true
        
                            }
                        ],
                        'is_answered':false
                    },
                    {
                        'quiz_index':3,
                        'content':'quiz 3 : A one year after WW2 ending.',
                        'correct_answer':'1946',
                        'answers':[
                            {
                                'answer_index':0,
                                'user_id':'0',
                                'user_name':'user0',
                                'team_index':0,
                                'content':'1950',
                                'is_correct':false
        
                            },
                            {
                                'answer_index':0,
                                'user_id':'4',
                                'user_name':'user4',
                                'team_index':1,
                                'content':'1946',
                                'is_correct':true
        
                            }
                        ],
                        'is_answered':false
                    }
                ]
                    
            }
        ]
    }
]