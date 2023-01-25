import {  createStore } from "redux";


const defaultState ={
    isAuthorized: false,
    isAuthenticated: false,
    userRole : ""
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
    
        default:
            return state
    }
}

export const MyStore = createStore(loginReducer);