import { createRequire } from 'module';
const require = createRequire(import.meta.url)

const express = require('express')
const app = express()

const minimist = require('minimist')
const { exit } = require('process')


const allArguments = minimist(process.argv.slice(2))
const argPort = allArguments['port']
const port = argPort || process.env.PORT || 3000

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',HTTP_PORT))
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

// Single flip
app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({
        'flip': flip
    })
})

// Multi flip
app.get('/app/flips/:number', (req, res) => {
    var coinFlipsResult = coinFlips(req.params.number)
    var coinFlipsResultSummary = countFlips(coinFlipsResult)
    res.status(200).json({
        'raw': coinFlipsResult,
        'summary': coinFlipsResultSummary
    })
});

app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin('heads'))
})

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin('tails'))
})

const HEADS = 'heads'
const TAILS = 'tails'
const WIN = 'win'
const LOSE = 'lose'

function coinFlip() {
  return (Math.round(Math.random()) == 0) ? HEADS : TAILS
}

function coinFlips(flips) {
  var allFlips = [];

  for (let i = 0; i < flips; i++) {
    allFlips.push(coinFlip())
  }

  return allFlips
}

function countFlips(array) {
  var summary = {
    heads: 0,
    tails: 0
  }
  // TODO: account for undefined input?
  array.forEach(flip => {
    if (flip === HEADS) {
      summary.heads++
    } else if (flip === TAILS) {
      summary.tails++
    }
  })

  // Remove uneccessary properties.
  if (summary.heads == 0) {
    delete summary.heads
  } else if (summary.tails == 0) {
    delete summary.tails
  }

  return summary
}

function flipACoin(call) {
  if (call === HEADS || call === TAILS) {
    var resultsSummary = {
      call: call,
      flip: coinFlip(),
      result: null
    }

    resultsSummary.result = ((resultsSummary.call === resultsSummary.flip) ? WIN : LOSE)
    return resultsSummary
  } else if (call === "" || call == null) {
    throw 'Error: no input.'
  } else {
    throw 'Usage: node guess-flip --call=[heads|tails]'
  }
}