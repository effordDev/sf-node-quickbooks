require('dotenv').config()

const OAuthClient = require('intuit-oauth')
const path = require('path')
const express = require('express')

const app = require('../utilities/cors').whitelisting(express())

const {
    sfConn,
    sfCreateSobject
} = require('../utilities/sf')

const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
console.log(__dirname);
console.log(publicDirPath);

const oauthClient = new OAuthClient({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  environment: process.env.environment,
  redirectUri: process.env.redirectUri,
});

const { validate } = require('../utilities/auth')

app.use(express.json())
app.use(express.static(publicDirPath))

app.post('/authUri', validate, async (req, res) => {

    console.log('authuri hit')

    const authUri = oauthClient.authorizeUri({
        scope: [
            OAuthClient.scopes.Accounting,
            OAuthClient.scopes.Payment,
            OAuthClient.scopes.OpenId, 
            OAuthClient.scopes.Profile,
            OAuthClient.scopes.Email,
            OAuthClient.scopes.Phone,
            OAuthClient.scopes.Address,
        ],
        state: 'testState',
    });
    
    res.send( authUri )
})

app.get('/callback', async (req, res) => {

    try {
        
        const authResponse = await oauthClient.createToken(req.url)

        const oauth2_token_json = authResponse.getJson()
    
        const {
            sfLoginUrl,
            sfUsername,
            sfPassword,
            sfToken
        } = process.env
    
        const connectionResult = await sfConn(
            sfLoginUrl,
            sfUsername,
            sfPassword,
            sfToken 
        )
    
        const record = {
            Access_Token__c: oauth2_token_json.access_token,
            Refresh_Token__c: oauth2_token_json.refresh_token,
            Authorization_Response__c: JSON.stringify(oauth2_token_json)
        }
    
        const recordResult = await sfCreateSobject(
            connectionResult.conn, 
            'Quickbook_Access__c', 
            record
        )

        console.log(recordResult);
            

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(`
            <html>
                <head>
                    <title>
                        Return to Salesforce
                    </title>
                </head>
                <body>
                    <a 
                        style="font-size: 40px;"
                        href="${process.env.ALLOWED_01}"
                    >Return to Salesforce</a>
                </body>
            </html>`
       )
       res.end()

    } catch (error) {
        console.log(error)
        return res.status(500).send('Server Error')
    }
})

app.listen(port, () => {
    console.log(`server is running on port 📡 ${port}`)
})
