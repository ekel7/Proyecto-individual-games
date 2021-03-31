import axios from 'axios';
export const search_Game = 'SEARCH_GAME';
export const show_Games = 'SEARCH_GAMES';
export const load_Genres = 'LOAD_GENRES';
export const load_Platforms = 'LOAD_PLATFORMS';
export const load_Single_Game_Data = 'LOAD_SINGLE_GAME_DATA'

export const searchGame = (searchQuery) => async (dispatch)=> {
        try{
            let result = await axios.get('http://localhost:3001/videogames/search?name='+ searchQuery)
            console.log(searchQuery)
            let data = result.data;
            console.log('action searchGame llamada. datos: '+data)
            dispatch({
                type: search_Game,
                payload: data,
            })
        }catch(err){
            console.error(err)
        }
        
        
    }

export const showGames = (offset) => async (dispatch) => {
        try{
            let result = await axios.get('http://localhost:3001/videogames?offset=' + offset)
            let data = result.data.items;
            console.log('action showGames llamada. datos: '+data)
            
            dispatch({
                type: show_Games,
                payload: data,
            })
        }catch(err){
            console.log(err)
        }
        
    }

export const loadGenres = () => async (dispatch) => {
    try{
        let result = await axios.get('http://localhost:3001/genres')
        let data = result.data
        console.log('genres loaded')
        dispatch({
            type: load_Genres,
            payload: data
        })
    }catch(err){
        console.log(err)
    }
}

export const loadPlatforms = () => async (dispatch) => {
    try{
        let result = await axios.get('http://localhost:3001/platforms')
        let data = result.data
        console.log('platforms loaded')
        dispatch({
            type: load_Platforms,
            payload: data
        })
    }catch(err){
        console.log(err)
    }
}

export const loadSingleGameData = (id) => async (dispatch) => {
    try{
        let result = await axios.get('http://localhost:3001/videogames/search/id?id=' + id)
        let data = result.data
        console.log('gameInfo loaded')  
        dispatch({
            type:load_Single_Game_Data,
            payload: data
        })
    }catch(err){
        console.error(err)
    }
}