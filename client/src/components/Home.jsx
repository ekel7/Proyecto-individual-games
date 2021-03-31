import React,{ useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showGames, searchGame, loadGenres } from '../actions/index'
import GameCard from './GameCard';
import Parent from './Card_Components/Parent';
import styles from 'styled-components'
import '../styles/Home.css'

export function Home(){
    const [input, setInput] = useState({
        name: ''
    })
    /**
     * El front pagina de a 20 elementos.
     * El back devuelve lotes de 120 elementos.
     * Mouse without borders
     */
    const [pageState, setPage] = useState({
        number:1,
        items: [],
        size: 20,
        offset: 0,
        batch: 1
    })

    const dispatch = useDispatch();

    var games = useSelector((state) => state.loadedGames)
    var genres = useSelector((state) => state.loadedGenres)
    
    useEffect(() => {
        dispatch(showGames(pageState.offset))    
        dispatch(loadGenres())
            
    }, [])

    useEffect(() => {
        setPage({
            ...pageState,
            items: getSlicedGames(pageState.number)
        })
    }, [games])
    
    function handleChange(e){
        console.log('handleChange funcionando')
        setInput({
            ...input,
            name: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log('handleSubmit llamado')
        dispatch(searchGame(input.name))
    }

    function handleGenreFilter(){
        let selectedGenre = null;

        if(document.querySelector('.genres') !== null){
            selectedGenre = document.querySelector('.genres').value
        }

        let filteredGames = games.filter(item => {
            let currentGenres = item.genres.map(item => item.name)
            console.log(currentGenres)
            let isGenrePresent = false;
            currentGenres.forEach(item => {
                if(selectedGenre === item){
                    isGenrePresent = true;
                }
            })
            return isGenrePresent;
        });
        console.log(filteredGames)

        setPage({
            ...pageState,
            items: filteredGames
        })

        if(selectedGenre === 'hello'){
            setPage({
                ...pageState,
                items: games
            })
        }
        return filteredGames;

    }

    function handleAuthorFilter(){
        let selectedAuthor = null;

        if(document.querySelector('.author') !== null){
            selectedAuthor = document.querySelector('.author').value
        }
        
        let filteredGamesAPI = games.filter(item => {
            if(typeof item.id === 'number'){
            return true;
            }
        });
        console.log(filteredGamesAPI);

        let filteredGamesDB = games.filter(item => {
            if(item.id.length > 7){
                return true;
            }
        })
        console.log(filteredGamesDB);

        if(selectedAuthor === 'User'){
            setPage({
            ...pageState,
            items: filteredGamesDB
        })
        }
        if(selectedAuthor === 'Game_Dev'){
            setPage({
                ...pageState,
                items: filteredGamesAPI
            })
        }

        if(selectedAuthor === 'no'){
            setPage({
                ...pageState,
                items: games
            })
        }
        return filteredGamesAPI;
    }
    

    function handleOrder(){
        let selectedOrdering = null;

        if(document.querySelector('.order') !== null){
            selectedOrdering = document.querySelector('.order').value
        }

        function alphabeticalOrderAsc(array) {
            let alphaArray = array.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
    
    
                return 0;
            })
            return alphaArray;
        }
    
        function alphabeticalOrderDesc(array) {
            let alphaArray = array.sort(function (a, b) {
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
    
    
                return 0;
            })
            return alphaArray;
        }
        //4.7
        //2013-03-01
        function ratingOrderAsc(array) {
            
            let ascArray = array.sort(function (a, b) {
                let date1 = new Date(a.released)
                let date2 = new Date(b.released)
                return date1 - date2;
            });
            
            return ascArray;
        }
    
        function ratingOrderDesc(array) {
            let descArray = array.sort(function (a, b) {
                let date1 = new Date(a.released)
                let date2 = new Date(b.released)
                return date2 - date1;
            })
            
            return descArray;
        }

        let orderedGames = []
        switch(selectedOrdering) {
            case 'AlphaAsc':
                orderedGames = alphabeticalOrderAsc(games)
                break;
            case 'AlphaDesc':
                orderedGames = alphabeticalOrderDesc(games)
                break;
            case 'RatingAsc':
                orderedGames = ratingOrderAsc(games)
                break;
            case 'RatingDesc':
                orderedGames = ratingOrderDesc(games)
                break;
            default:
                setPage({
                    ...pageState,
                    items: games
                })
        }

        setPage({
            ...pageState,
            items: orderedGames
        })
    
    }
    
    function getStartIndex(pageNumber){
        return (pageNumber * pageState.size) - pageState.size;
    } 

    function getEndIndex(pageNumber){
        return getStartIndex(pageNumber) + pageState.size;
    }

    function getSlicedGames(currentPage) {
        return games.slice(getStartIndex(currentPage), getEndIndex(currentPage));
    }

    function isFirstPage() {
        return pageState.number === 1
    }

    function offsetIsBelowBatchNumber(newBatch, newOffset){
        //Esta funcion verifica si el offset nuevo(después de tocar 'prev') es menor que el offset mínimo para la tanda o lote actual.
        //Por ejemplo, estando en la página 1 del lote 3, habremos visto 240 juegos en total.
        //Si tocamos prev, el nuevo offset será 220, lo cual es menor al offset mínimo para el lote 3(240)
        //Entonces devuelve true, y debe pedir el lote anterior al backend.
        return newOffset <= games.length * newBatch
    }

    function getMaxPageNumber(){
        //escalabilidad
        return games.length / pageState.size;
    }

    function moveOffsetToStartOfNewBatch(newBatch){
        //Esta función mueve el offset al inicio de la tanda nueva de juegos, es decir, si estamos en la tanda 3,
        //hay que traer del back la tanda 2 de 120 juegos. Entonces le pedimos al back por medio de showGames
        //la cantidad maxima de juegos a paginar(120) multiplicada por el numero de lote nuevo(2), 
        //menos la cantidad maxima de juegos a paginar(120), esto quedaria como showGames(120), 
        //lo que nos traería del backend los juegos que siguen después de los 120 primeros juegos.
        return  (games.length * newBatch) - games.length;
    }

    function prev() {
        let newOffset = pageState.offset - pageState.size;
        // Si llegamos al pincipio no va a hacer nada
        if(newOffset < 0) return;
        let newBatch = pageState.batch - 1;
        // Si la proxima pagina esta dentro del lote entonces no cargamos mas juegos
        let shouldGetMoreGames = isFirstPage() ? offsetIsBelowBatchNumber(newBatch, newOffset) : false;
        // Si debemos traer más juegos, entonces asignar a la página el número más alto dentro del lote; sino restarle uno al número actual
        let currentPage = shouldGetMoreGames ? getMaxPageNumber() : pageState.number - 1;

        setPage({
            ...pageState,
            number: currentPage,
            items: shouldGetMoreGames ? [] : getSlicedGames(currentPage),
            offset: newOffset,
            batch: shouldGetMoreGames ? newBatch : pageState.batch
        })

        if(shouldGetMoreGames) {
            //Si hay que traer mas juegos, hay que mover el offset al inicio de la tanda actual de juegos
            newOffset = moveOffsetToStartOfNewBatch(newBatch)
            dispatch(showGames(newOffset))
        }
    }

    function next(){

        let newOffset = pageState.offset + pageState.size;
        let newBatch = pageState.batch + 1;
        let shouldGetMoreGames = newOffset >= games.length * pageState.batch;
        let currentPage = shouldGetMoreGames ? 1 : pageState.number + 1;

        setPage({
            ...pageState,
            number: currentPage,
            items: shouldGetMoreGames ? [] : getSlicedGames(currentPage), //Si hay que traer mas juegos, asigna un array vacío hasta que se dispare el useEffect con los juegos nuevos.
            offset: newOffset,
            batch: shouldGetMoreGames ? newBatch : pageState.batch //Si hay que traer mas juegos, avanza de lote
        });

        if(shouldGetMoreGames) {
            dispatch(showGames(newOffset))
        }
    }

    
  
    var { name } = input;
    var currentGames = pageState.items;

    return(
        
        <div className='home__Wrapper'>
            <h4>Videogame Search and Creation</h4>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div>
                        <label className='label' htmlFor='title'>Buscar por Nombre:  </label>
                       <input
                            type='text'
                            id='title'
                            placeholder='Busca un juego...'
                            value={ name }
                            autoComplete='off'
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <button type='submit'>Buscar</button>
                </form>
                <br></br>
                <span>Filter By Genre:</span>
                <select className='genres' name='genres'>
                        <option value="hello">--No Filter--</option>
                        {
                            genres.length && genres.map(item => {
                                return(
                                <option value={item}>{item}</option>
                                )
                        })
                    }
                </select>
                <button type="button" onClick={handleGenreFilter}>Apply Filter</button>
                <hr></hr>
                <span>Filter by Author: </span>
                <select className = 'author' name= 'author'>
                    <option value='no'>---No Filter---</option>
                    <option value='User'>User</option>
                    <option value='Game_Dev'>Game Developer</option>
                </select>
                <button type='button' onClick={handleAuthorFilter}>Apply Filter</button>
                <hr></hr>
                <span>Order By:  </span>
                <select className='order'>
                    <option value='no'>---No Ordering---</option>
                    <option value='AlphaAsc'>Alphabetical A-Z</option>
                    <option value='AlphaDesc'>Alphabetical Z-A</option>
                    <option value='RatingAsc'>Rating - High to Low</option>
                    <option value='RatingDesc'>Rating - Low to High</option>
                </select>
                <button type='button' onClick={handleOrder}>Apply Order</button>
            <Parent 
                games={currentGames}
            />
            <button onClick={prev}>Anterior</button>
            <button onClick={next}>Siguiente</button>

        </div>
    )
}  

//Agregar numeros de pagina y componente Loading