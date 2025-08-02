import { createContext, useContext, useReducer } from 'react';

export type Status = "idle" | "fetching" | "ready" | "error" ;

export interface Question {
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuestionResponse {
    response_code: number;
    results: Question[];
}


interface QuizContext {
    state: QuizState,
    dispatch: React.Dispatch<QuizAction>
}

interface QuizState {
    gameStatus: Status,
    question: Question | null,
    userAnswer: string | null
}

const initialState : QuizState = {
    gameStatus: "idle",
    question: null,
    userAnswer: null
}

type QuizAction = 
    { type: "setStatus"; payload: Status } | 
    { type: "setQuestion"; payload: Question} |
    { type: "setUserAnswer"; payload: string}


const QuizContext = createContext<QuizContext>({
    state: initialState,
    dispatch: () => null
});

function QuizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "setQuestion":
        return {...state, question: action.payload};
    case "setStatus":
        return {...state, gameStatus: action.payload};
    case "setUserAnswer":
        return {...state, userAnswer: action.payload};
    default:
        throw new Error("Unknown action");
  }
}

export function QuizProvider({children}: {children: React.ReactNode}) {
    const [state, dispatch] = useReducer(QuizReducer, initialState);

    return(
        <QuizContext.Provider value={{state, dispatch}}>
            {children}
        </QuizContext.Provider>
    )
}

export function useQuiz() {
    return useContext(QuizContext);
}

