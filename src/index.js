const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('', (req, res) => {
    //console.log(req) //see what the request looks like

    res.send('sent from node :)')
    // res.render()

})

app.get('/message/:message', (req, res) => {

    const _message = req.params.message
    console.log(_message) //see what the request ID looks like

    if(_message) {
        res.send('The _message sent is: ' + _message)
    } else {
        console.log('no _message provided, returning 404')
        res.status(404).send()
    }

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})