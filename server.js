//// Creating the server ////
// Define named constants
const START_ARG_NUM = 2
const DEFAULT_PORT = 3000
const HTTP_STATUS_OK = 200
const HTTP_STATUS_NOT_FOUND = 404
const CONTENT_TYPE_TEXT_PLAIN = 'text/plain'
const HEADS = 'heads'
const TAILS = 'tails'

import { createRequire } from 'module';
const require = createRequire(import.meta.url)

const express = require('express')
const app = express()

const minimist = require('minimist')
const { exit } = require('process')

const allArguments = minimist(process.argv.slice(START_ARG_NUM))
const argPort = allArguments['port']

const port = argPort || process.env.PORT || DEFAULT_PORT

import { coinFlip, coinFlips, countFlips, flipACoin } from './coin.mjs'

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
})

// Check endpoint
app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200
    // Respond with status message "OK"
    res.statusMessage = 'OK'
    res.writeHead( res.statusCode, { 'Content-Type' : CONTENT_TYPE_TEXT_PLAIN })
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

// One flip
app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(HTTP_STATUS_OK).json({
        'flip': flip
    })
})

// Multi flip
app.get('/app/flips/:number', (req, res) => {
    var coinFlipsResult = coinFlips(req.params.number)
    var coinFlipsResultSummary = countFlips(coinFlipsResult)

    res.status(HTTP_STATUS_OK).json({
        'raw': coinFlipsResult,
        'summary': coinFlipsResultSummary
    })
});

// Flip for heads
app.get('/app/flip/call/heads', (req, res) => {
    res.status(HTTP_STATUS_OK).json(flipACoin(HEADS))
})

// Flip for tails
app.get('/app/flip/call/tails', (req, res) => {
    res.status(HTTP_STATUS_OK).json(flipACoin(TAILS))
})

// Default response for any request not addressed by the defined endpoints
app.use(function (req, res) {
    res.status(HTTP_STATUS_NOT_FOUND).send('404 NOT FOUND')
})