require('dotenv').config();
const { Router, query } = require('express');
const axios = require('axios')
const { Videogame, Genre } = require('../db')
const {v4: uuidv4} = require('uuid')
const {
    API_KEY
} = process.env;
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getVideogames = (pageNumber) => {
    
   return axios.get(`https://api.rawg.io/api/games?page=${pageNumber}&page_size=40&key=${API_KEY}`);
}

const getGenres = async () => {
    let result = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
    let data = result.data.results;

    data.forEach(async item => {
        await Genre.findOrCreate({
            where: {
                name: item.name,
            }

        })
    });
}

const getPageNumber = (offset) => {
    let pageSize = 40;
    return (offset / pageSize) + 1
}

const getDBGames = async () => {
    let gameList = [];
    try{
        let query = await Videogame.findAll({include:'genres'});
        
        query.forEach(item => {
            
            gameList.push(item.dataValues)
        })
        return gameList;
    }catch(err){
        console.error(err);
    }
    

}

const getEntirePage = async (offset) => {
    try{
        let page = getPageNumber(offset)
        let requests = [getVideogames(page), getVideogames(page + 1), getVideogames(page + 2)];

        let responses = await Promise.all(requests)

        let arrayDB = await getDBGames()
        let arrayApi = responses.map(x => x.data.results).flat();

        let joined = arrayDB.concat(arrayApi).slice(0, 120)

        console.log(joined[119])
        
        return joined;

    }catch(err){
        console.error(err)  
    }
    

    return [];
    
}



router.get('/videogames', async (req, res) => {
    let offset = req.query.offset;
    
    let gamesList = await getEntirePage(offset)

    let response = {
        offset: offset,
        items: gamesList
    }
    res.json(response);

    getGenres();
})


router.get('/videogames/search', async (req, res) => {
    let searchTerm = req.query.name; //AÑADIR 'name=blablabla' a la request
    let searchResults = []
    let searchGames = async () => {
        console.log(searchTerm)
        let data = await axios.get(`https://api.rawg.io/api/games?search=${searchTerm}?key=${API_KEY}`)
        let results = data.data.results
        console.log(results[5].name)
        for (let i = 0; i < results.length; i++) {
            searchResults.push(results[i])
            console.log('+++++++++' + results[i].name)
        }
        return results;
    }

    let games = await searchGames();

    if (searchResults.length > 0) {
        res.send(games)
    } else {
        res.send('We did not found any games with your search term. Sorry :(')
    }


});

var platformParser = (obj) => {
    let itemsList = [];
    obj.platforms.forEach(item => {
        itemsList.push(item.platform.name)
    })
    console.log(obj.platforms)
    return itemsList;
}

var genreParser = (obj) => {
    let itemsList = [];
    obj.genres.forEach(item => {
        console.log(item.name)
        itemsList.push(item.name)
    })
    return itemsList;
}

var genreParserDB = (obj) => {
    let itemsList = [];
    obj.forEach(item => {
        itemsList.push(item.dataValues.name)
    })
    return itemsList;
}


router.get('/videogames/search/id', async (req, res) => {   //Solucionar el parrafo de descripción, quitar etiquetas HTML
    let searchId = req.query.id;
    let searchResult = {};
    
    
    if(searchId.length < 7){
        try {
            let searchById = async () => {
                let result = await axios.get(`https://api.rawg.io/api/games/${searchId}?key=${API_KEY}`)
                let data = result.data;
    
                let platforms = platformParser(data);
                let genres = genreParser(data);
    
                searchResult = {
                    name: data.name,
                    description: data.description_raw,
                    rating: data.rating,
                    launchDate: data.released,
                    platforms: platforms,
                    genres: genres,
                    background_image: data.background_image
                }
                console.log(searchResult.name)
            }
            await searchById();
        } catch (err) {
            console.error(err)
            res.sendStatus(500)
        }
    }else{
        try {
            let searchOnDB = async () => {
                let result = await Videogame.findByPk(searchId,{include: 'genres'})
                console.log(result)
    
                let platforms = result.dataValues.platforms;
                let genres = genreParserDB(result.genres);
                
                console.log(platforms)
                console.log(genres)
                searchResult = {
                    name: result.dataValues.name,
                    description: result.dataValues.description,
                    rating: result.dataValues.rating,
                    released: result.dataValues.launchDate,
                    platforms: platforms,
                    genres: genres,
                    background_image: result.dataValues.background_image
                }
                console.log(searchResult.name)
            }
            await searchOnDB();
            
        } catch (err) {
            console.error(err)
            res.sendStatus(500)
        }
    }
    
    res.send(searchResult)
})

router.get('/genres', async (req, res) => {
    
    let genreList = [];


    try {
        let showGenres = async () => {
            let query = await Genre.findAll();

            query.forEach(item => {
                console.log('+++++++++++++++++++++' + item.dataValues.name)
                genreList.push(item.dataValues.name)
            })



        }

        await showGenres();
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
    console.log('--------------' + genreList[0])
    res.send(genreList);
})

router.get('/platforms', async (req, res) => {
    
    let platformList = [];
    try {
        let getPlatforms = async () => {
            let result = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`)
            let data = result.data.results
            data.forEach(item => {
                console.log('+' + item.name)
                platformList.push(item.name)
            })
        }
        await getPlatforms();
        console.log('---' + platformList[0])
        res.send(platformList);
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
    
})



router.post('/videogame', async (req, res) => {
    let game = req.body;
    try {
        let createdGame = await Videogame.create({
            name: game.name,
            id: uuidv4(),
            description: game.description,
            released: game.date,
            rating: game.rating,
            platforms: game.platforms,
            background_image: game.background_image
        })
        console.log(createdGame)
        res.send(createdGame) 
        let array = game.genres
        array.forEach(async item => {
            let genre = await Genre.findOne({where:{name:item}})
            genre.setGames(createdGame)
        })
    } catch (err) {
        console.log(err)
    }

   
})

module.exports = router;

/*
Problemas:
 *Mostrar los géneros en /genres
 *parrafo de descripción
 *

*/

/*
GET https://api.rawg.io/api/genres
GET https://api.rawg.io/api/games/{id}
*/