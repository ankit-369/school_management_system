const express = require('express');
const router = express.Router()


const app = express();

router.get('/',(req,res)=>{

    res.json({
        msg:"u r inside students route"
    })
})

module.exports = router;
