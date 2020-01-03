const config = require('./config.js')
const fs = require('fs')
const twit = require('twit')
const T = new twit(config)

function getRandomJoke() {
    let jokesFile = fs.readFileSync('jokes.json')
    let jokes = JSON.parse(jokesFile)
    
    let r = Math.floor(Math.random() * jokes.jokes.length)
    return jokes.jokes[r]
}

function tweetRandomJoke() {
    let joke = getRandomJoke()
    
    T.post(
        'statuses/update',
        {status: joke},
        function(err, data, response) {
            if (err) {
                // Duplicate tweet
                if (err.code === 187) {
                    console.log('duplicate tweet')
                    tweetRandomJoke()
                }
            } else {
                console.log('We Tweeted!')
            }
        }
    )
}

tweetRandomJoke()
setInterval(tweetRandomJoke, 1000*60*60)
