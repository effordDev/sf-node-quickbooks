const { 
     decrypt, 
     toHash
} = require('./crypto')

const validate = (req, res, next) => {
     
     if (!req.headers.fromapex) {
          return res.status(401).send('Invalid Headers');
     }
  
     if (req.headers.fromapex.length !== 18) {
          return res.status(401).send('Invalid Headers');
     }

     const {
          sfOrgId,
          SecretHash,
          ENC_KEY, 
          IV 
     } = process.env

     const decryptedBody = JSON.parse(decrypt(req.body.content, ENC_KEY, IV))

     const {
          userId,
          todaysDate,
          orgId,
          key
     } = decryptedBody

     if (req.headers.fromapex !== userId) {
          return res.status(401).send('Invalid Headers');
     }
     if (userId.length !== 18) {
          return res.status(401).send('Invalid userId');
     }

     const utcDate = new Date().toISOString().split('T')[0]

     if (todaysDate !== utcDate) {
          return res.status(401).send('Invalid Date');
     }
     if (orgId !== sfOrgId) {
          return res.status(401).send('Invalid Org');
     }
     if (toHash(key) !== SecretHash) {
          return res.status(401).send('Invalid Hash');
     }

     next()
}

module.exports = {
     validate
}