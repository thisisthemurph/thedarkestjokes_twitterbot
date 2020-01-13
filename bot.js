const twitterConfig = require('./config/twitter.api.config.js')
const jokeApiConfig = require('./config/joke.api.config.js')

const axios = require('axios')
const twit = require('twit')
const T = new twit(twitterConfig)

const getRandomJoke = () => {
    try {
        return axios.get(jokeApiConfig.randomJokeUrl)
    } catch (err) {
        console.error(err)
    }
}

const tweetRandomJoke = () => {
    getRandomJoke()
        .then(response => {
            const joke = response.data.text

            T.post('statuses/update', {status: joke}, (err, data, response) => {
                if (err) {
                    // This error code indicates that an identical 
                    // tweet has been sent recently
                    if (err.code === 187) {
                        tweetRandomJoke()
                    } else {
                        console.error('other error ' + err.code)
                    }
                }
            })
        })
        .catch(err => {
            console.error('There was an error obtaining a random joke')
            console.error(err)
        })
}

// The code above will run evry hour. starting instantly
const evryHour = 1000*60*60
setInterval(tweetRandomJoke, evryHour)
tweetRandomJoke()
