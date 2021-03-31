import { search_Game, show_Games, load_Genres, load_Platforms, load_Single_Game_Data } from '../actions/index'

const initialState = {
    currentGameId: '',
    loadedGames: [],
    gameDetail:{},
    loadedGenres: [],
    loadedPlatforms: []
}

function rootReducer(state = initialState, action) {
    if(action.type === search_Game){
        console.log('Reducer searchGame')
        return{
            ...state,
            loadedGames: action.payload
        }
    }
    if(action.type === show_Games){
        console.log('Reducer showGames')
        return{
            ...state,
            loadedGames: action.payload
        }
    }
    if(action.type === load_Genres){
        console.log('Reducer loadGenres')
        return{
            ...state,
            loadedGenres: action.payload
        }
    }
    if(action.type === load_Platforms){
        console.log('Reducer LoadPlatforms')
        return{
            ...state,
            loadedPlatforms: action.payload
        }
    }
    if(action.type === load_Single_Game_Data){
        console.log('reducer load_Single_Game_Data')
        return{
            ...state,
            gameDetail: action.payload
        }
    }
    return state;
}



export default rootReducer;