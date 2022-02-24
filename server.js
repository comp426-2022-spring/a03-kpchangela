//// Creating the server ////

import { createRequire } from 'module';
const require = createRequire(import.meta.url)

const express = require('express')
const app = express()

const minimist = require('minimist')
const { exit } = require('process')

const allArguments = minimist(process.argv.slice(2))
const argPort = allArguments['port']

const port = argPort || process.env.PORT || 3000

import { coinFlip, coinFlips, countFlips, flipACoin } from './coin.mjs'

const server = app.listen(port, () => { console.log('App listening on port %PORT%'.replace('%PORT%', port)) })

// Default response for any request not addressed by the defined endpoints
app.use(function (req, res) {
    res.status(404).send('404 NOT FOUND')
})

// Check endpoint
app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200
    // Respond with status message "OK"
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' })
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

// One flip
app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({
        'flip': flip
    })
})

// Multi flips
app.get('/app/flips/:number', (req, res) => {
    var coinFlipsResult = coinFlips(req.params.number)
    var coinFlipsResultSummary = countFlips(coinFlipsResult)
    res.status(200).json({
        'raw': coinFlipsResult,
        'summary': coinFlipsResultSummary
    })
});

// Flip for heads
app.get('/app/flip/call/heads', (req, res) => { res.status(200).json(flipACoin('heads')) })

// Flip for tails
app.get('/app/flip/call/tails', (req, res) => { res.status(200).json(flipACoin('tails')) })
