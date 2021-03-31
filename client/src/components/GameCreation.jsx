import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import { loadGenres, loadPlatforms } from '.././actions'

const CreateGame = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
`;

const FormWrapper = styled.div`
    width: 50%;
    height: 100%;
    background-color: black;
    color: white;
    padding-left: 20px;
    .input{
        margin: 10px;
    }

    text-align: left;

`;

const PropertiesWrapper = styled.div`
    background-color: grey;
    height: 500px;
    width: 50%;
    color: white;
    
`

const GenreButton = styled.button`
    color: #4242db;
    width: 15%;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #595bee;
    border-radius: 3px;

    :hover {
        background-color: grey;
        color: white;
    }
`

const PlatformButton = styled.button`
    color: #4242db;
    width: 15%;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #595bee;
    border-radius: 3px;

    :hover {
        background-color: grey;
        color: white;
    }

`

const GenresDisplay = styled.div`
    display:flex;
    flex-direction: column;
    

`;

const PlatformsDisplay = styled.div`
    display:flex;
    flex-direction: column;

`;




export function GameCreation(){
    const [input, setInput] = useState({
        name: '',
        description: '',
        date: 0,
        rating: '',
        genres: [],
        platforms: [],
        background_image: ''
    })
    
    
    
    const dispatch = useDispatch();
    
   

    useEffect(() => {
        dispatch(loadGenres());
        dispatch(loadPlatforms())
    },[genres])
    
    const handleInputChange = function(e) {
        setInput({
            ...input,                        
             [e.target.name]: e.target.value  
            });
    }
    
    var platforms = useSelector((state) => state.loadedPlatforms)
    var genres = useSelector((state) => state.loadedGenres)
    

    
    
    
    const handleAddGenre = () => {

        let selectedGenre = null;

        if(document.querySelector('#genreSelect') !== null){
            selectedGenre = document.querySelector('#genreSelect').value
        }

        var joined = input.genres.concat(selectedGenre)
        setInput({
            ...input,
            genres: joined
        })
    }

    const handleAddPlatform = () => {

        let selectedPlatform = null;

        if(document.querySelector('#platformSelect') !== null){
            selectedPlatform = document.querySelector('#platformSelect').value
        }

        let joined = input.platforms.concat(selectedPlatform)
        setInput({
            ...input,
            platforms: joined
        })
    }
    
    const handleSubmit = function(e) {
        e.preventDefault();
        console.log('handleSubmit ejecutado')
        axios.post('http://localhost:3001/videogame', input)
            .then(response => console.log(response.data)) 
            .catch(error  => console.log(error))
            
    }

    const handleRemoveItem = function (e) {
        e.preventDefault();
        let filtered = [];
        if(e.target.name === 'genre'){
            filtered = input.genres.filter(item => item !== e.target.value)
            setInput({
                ...input,
                genres: filtered
            })
        }else{
            filtered = input.platforms.filter(item => item !== e.target.value)
            setInput({
                ...input,
                platforms: filtered
            })
        }
        
    }
    


    

    
    return (
        <CreateGame>
            <FormWrapper>
                <p className='titulo'>Create a Game:</p>
                <form onSubmit={handleSubmit}>
                    <label className='subtitle'>Name: </label>
                    <input 
                        className='input' type="text" name="name" onChange={handleInputChange} value={input['name']}  />
                    <br></br>
                    <label className='subtitle'>Description: </label>
                    <input  
                        className='input' type="text" name="description" onChange={handleInputChange} value={input['description']}/>
                    <br></br>
                    <label className='subtitle'>Release Date:</label>
                    <input
                        className='input' type='date' name='date' onChange={handleInputChange} value={input['date']}/>
                    <br></br>
                    <label className='subtitle'>Rating:</label>
                    <input
                       className='input' type='text' name='rating' onChange={handleInputChange} value={input['rating']}/>
                    <br></br>
                    <label className='subtitle'>Background Image:</label>
                    <input
                        className='input' type='text' name='background_image' onChange={handleInputChange} value={input['background_image']}/>
                    <br></br>
                    <label className='genero'>Genres: </label>
                    <select className='input' id='genreSelect' name='genres'>
                        <option value="hello">--Please choose the Genres--</option>
                        {
                            genres.length && genres.map(item => {
                                return(
                                <option value={item}>{item}</option>
                                )
                        })
                    }
                    </select>
                    
                    <button type="button" onClick={handleAddGenre}>Add Genre</button>
                    <br></br>
                    <label className='platformsLabel'>Platforms: </label>
                    <select className='input' id='platformSelect'>
                        <option value="hello">--Please choose the Platforms--</option>
                        {
                            platforms.length && platforms.map(item => {
                                return(
                                <option value={item}>{item}</option>
                                )
                        })
                    }
                    </select>
                    
                    <button type="button" onClick={handleAddPlatform}>Add Platform</button>
                    <br></br>
                  <input type="submit" value='Create Game' name="Enviar" />
                </form>

            </FormWrapper>
            <PropertiesWrapper>
                <GenresDisplay>
                    <h4>Selected Genres:</h4>
                    <br></br>
                    {
                        input.genres.length && input.genres.map(item => {
                            return (
                                <GenreButton name='genre' value ={item} onClick={handleRemoveItem}>{item}</GenreButton>
                            )
                        })
                    }
                </GenresDisplay>
                <PlatformsDisplay>
                    <h4>Selected Platforms</h4>
                    <br></br>
                    {
                        input.platforms.length && input.platforms.map(item => {
                            console.log(item)
                            return (
                                <PlatformButton name='platform' value={item} onClick={handleRemoveItem} >{item}</PlatformButton>
                            )
                        })
                    }
                </PlatformsDisplay>
                    
            </PropertiesWrapper>
        </CreateGame>
    )
}