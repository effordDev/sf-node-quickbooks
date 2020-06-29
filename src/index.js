const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('', (req, res) => {
    console.log(req) //see what the request looks like

    res.send('sent from node :)')
    // res.render()

})

app.get('/test/:id', (req, res) => {

    const _id = req.params.id
    console.log(_id) //see what the request ID looks like

    if(req.params.id.length > 5) {
        res.send('The id sent is: ' + req.params.id)
    } else {
        console.log('no ID provided, returning 404')
        res.status(404).send()
    }

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})