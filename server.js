const express = require('express')
const app = express()
const request = require('request')
var popularObject
var searchObject
var ratedObject
const api = "https://api.themoviedb.org/3/movie/popular?api_key=9dbfde2a8b6e92417ef7a6cc5cb516fd&language=en-US&page=1"
const ratedApi = "https://api.themoviedb.org/3/movie/top_rated?api_key=9dbfde2a8b6e92417ef7a6cc5cb516fd&language=en-US&page=1"


request(api, function (err, response, body) {
    popularObject = JSON.parse(body)
})

app.listen(8080, () => {
    console.log('Server Started on http://localhost:8080')
    console.log('Press CTRL + C to stop server')
})

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', { movie: popularObject })
})


app.get('/movie/:movieId', (req, res) => {
    let id = req.params.movieId
    let index
    for (let i = 0; i < popularObject.results.length; i++) {
        if (popularObject.results[i].id === Number(id)) {
            index = i
        }
    }
    res.render('id', { mov: popularObject.results[index] })
})

app.get('/search', (req, res) => {
    const q = req.query.search
    let searchApi = "https://api.themoviedb.org/3/search/movie?api_key=9dbfde2a8b6e92417ef7a6cc5cb516fd&query=" + q
    request(searchApi, function (err, response, body) {
        searchObject = JSON.parse(body)
        res.render('search', { movie: searchObject }) // I have to put this here or it will only render once I refresh it
    })
})

app.get('/search/:searchid', (req, res) => {
    let searchid = req.params.searchid
    let index
    for (let i = 0; i < searchObject.results.length; i++) {
        if (searchObject.results[i].id === Number(searchid)) {
            index = i
        } // API object returns every movie that includes the search so I do not need to put a .include function
    }
    res.render('id', { mov: searchObject.results[index] })
})

app.get('/toprated', (req, res) => {
    request(ratedApi, function (err, response, body) {
        ratedObject = JSON.parse(body)
        res.render('toprated', { movie: ratedObject })
    })
})

app.get('/toprated/:topratedid', (req, res) => {
    let topratedid = req.params.topratedid
    let index
    for (let i = 0; i < ratedObject.results.length; i++) {
        if (ratedObject.results[i].id === Number(topratedid)) {
            index = i
        }
    }
    res.render('id', { mov: ratedObject.results[index] })
})