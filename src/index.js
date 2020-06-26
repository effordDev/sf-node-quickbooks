const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.get('', (req, res) => {
    console.log(req.body) //see what the request looks like

    res.send('sent from node :)')
    // res.render()

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})