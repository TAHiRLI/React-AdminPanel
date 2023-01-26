import {  createStore } from "redux";


const defaultState ={
    isAuthorized: false,
    isAuthenticated: false,
    userRole : "",
    isLoading: false
}

const loginReducer = (state=defaultState, action)=>{

    switch (action.type) {
        case "SUBMIT_LOGIN":
            console.log('submit login calisdi')
            return {
                ...state,
                isAuthenticated: true,
                isAuthorized:true,
                userRole:"Admin"
            }
        case "LOGOUT":
            return {
                ...state, 
                isAuthenticated: false,
                isAuthorized:false,
                userRole:"  "
            }
            case "LOADED":
                return {
                    ...state, 
                    isLoading: false
                }
                case "LOADING":
                    return {
                        ...state, 
                        isLoading: true
                    }
    
        default:
            return state
    }
}

export const MyStore = createStore(loginReducer);