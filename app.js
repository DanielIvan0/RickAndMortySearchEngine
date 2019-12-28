/*Getting packages*/
const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const PORT = 3000
const urlGenerator = (obj, section, sign) => {
    let url = `https://rickandmortyapi.com/api/${section}/${sign}`
    for(let i = 0; i < Object.keys(obj).length; i++){
        if(obj[Object.keys(obj)[i]] != ''){
            let aux = ''
            url += `${Object.keys(obj)[i]}=${obj[Object.keys(obj)[i]]}`
            for(let j = i + 1; j < Object.keys(obj).length; j++)
                aux += obj[Object.keys(obj)[j]]
            if(aux != '')
                url += '&'
        }
    }
    return url
}
const emptyHandler = obj => {
    for(item in obj){
        if(typeof obj[`${item}`] === "string" && obj[`${item}`] === ''){
            obj[`${item}`] = '...'
        }else if(Array.isArray(obj[`${item}`]) || typeof obj[`${item}`] === 'object'){
            emptyHandler(obj[`${item}`])
        }
    }
}
/*Get index from API*/
const indexHandler = (obj, index) => {
    let aux = ''
    for(let i = 0; i < obj.length; i++){
        for(let j = 0; j < obj[i][index].length; j++){
            aux += /[0-9]+/i.exec(obj[i][index][j]) + ', '
        }
        obj[i][index] = aux.slice(0, aux.length - 2)
        aux = ''
    }
    return obj
}

/**/
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
hbs.registerPartials(`${__dirname}/views/partials`)

/*index server rendering*/
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/characters', (req, res) => {
    res.render('characters')
})
/*Sends character info to ...*/
app.post('/charactersInfo', async (req, res) => {
    /*Treatment request*/
    fetch(urlGenerator(req.body, 'character', '?').replace(/ /g, '+')).then(async data => {
        /*Response-handling*/
        const response = await data.json()
        emptyHandler(response.results)
        indexHandler(response.results, 'episode')
        res.render('charactersInfo', response)/*Send response*/
    }).catch(error => res.render('error', error.message))/*Error-handling*/
})

app.get('/episodes', (req, res) => {
    res.render('episodes')
})

app.post('/episodesInfo', async (req, res) => {
    /*Request-handling*/
    fetch(urlGenerator(req.body, 'episode', '?').replace(/ /g, '+')).then(async data => {
        /*Response-handling*/
        const response = await data.json()
        res.render('episodesInfo', response)/*Send response*/
    }).catch(error => res.render('error', error.message))/*Error-handling*/
})

app.get('/locations', (req, res) => {
    res.render('locations')
})

app.post('/locationsInfo', async (req, res) => {
    /*Request-handling*/
    fetch(urlGenerator(req.body, 'location', '?').replace(/ /g, '+')).then(async data => {
        /*Response-handling*/
        const response = await data.json()
        res.render('locationsInfo', response)
    }).catch(e => res.render('error', e.message))/*Error-handling*/
})

app.listen(PORT, () => {
    console.log('Server up and running on PORT', PORT)
})