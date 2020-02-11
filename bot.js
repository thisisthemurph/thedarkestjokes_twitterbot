const twitterConfig = require('./config/twitter.api.config.js')
const jokeApiConfig = require('./config/joke.api.config.js')

const axios = require('axios')
const twit = require('twit')
const T = new twit(twitterConfig)

const ERR_CODES = {
    // https://developer.twitter.com/en/docs/basics/response-codes
    too_long: 186,  // The tweet is too long for twitter
    duplicate: 187  // Twitter thinks this was sent too recently
}

const getRandomJoke = tweet => {
    const ax = axios.create({
        baseURL: jokeApiConfig.baseURL,
        timeout: 1000,
        params: {
            adult: true
        }
    })

    ax.get('/random')
        .then(result => tweet(result.data.text))
        .catch(err => console.error(err))
}

const tweetText = text => {
    T.post('statuses/update', { status: text }, (err, data, response) => {
        if (err) {
            if (err.code in Object.values(ERR_CODES)) {
                getRandomJoke(tweetText)
            } else {
                console.error(`Other error ${err.code}`)
            }
        }
    })
}

// Send out an initial tweet, then periodically
getRandomJoke(tweetText)

const fourHours = 4000*60*60
setInterval(() => getRandomJoke(tweetText), fourHours)
