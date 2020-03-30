const twitterConfig = require('./config/twitter.api.config.js')

const axios = require('axios')
const twit = require('twit')
const T = new twit(twitterConfig)

const ERR_CODES = {
    // https://developer.twitter.com/en/docs/basics/response-codes
    too_long: 186,  // The tweet is too long for twitter
    duplicate: 187  // Twitter thinks this was sent too recently
}

/**
 * Obtains a random joke from the API and tweets it using the given function
 * @param {function} tweet the function to be used to send the tweet
 */
const getRandomJoke = async sendTweet => {
    try {
        const res = await axios.get('http://mmurphy.co.uk/jokes/api/random', {
            params: {
                adult: true
            }
        })

        if (res.status === 200) {
            sendTweet(res.data.text)
        } else {
            // There has been an issue obtaining a joke from the API
        }
    }
    catch (err) {
        console.error(err)
    }
}

const tweetRandomJoke = text => {
    T.post('statuses/update', { status: text }, (err, data, response) => {
        if (err) {
            if (err.code in Object.values(ERR_CODES)) {
                // Fetch another joke and try again if Twitter complains
                getRandomJoke(tweetRandomJoke)
            } else {
                console.error(`Other error ${err.code}`)
            }
        }
    })
}

// Send out an initial tweet, then periodically
getRandomJoke(tweetRandomJoke)

const fourHours = 4000*60*60
setInterval(() => getRandomJoke(tweetRandomJoke), fourHours)
