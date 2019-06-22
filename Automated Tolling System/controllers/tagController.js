const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

router.get('/',(req,res)=>{
    res.render("tag/addOrEdit",{
        viewTitle : "Insert Car UID"
    });
});


router.get('/list', (req, res) => {
    findRecord(req,res);
});

function findRecord(req, res) {

    var fullUrl = req.originalUrl;
    var IDD = fullUrl.substring(fullUrl.length - 8, fullUrl.length);

    Tag.findOne({tagID: IDD},function(err, result){
        if(err){
            console.log(err);
        }
        if(result){
            if(IDD.length==8){
            res.render("tag/list",{
                viewTitle : "Here's your information",
                thisTagID : result.tagID,
                thisCarType : result.carType,
                thisPlateNo : result.plateNo,
                thisTollCredit : result.tollCredit
                });
            }
        }
        else{
            res.render("tag/addOrEdit", {
                viewTitle : "Incorrect UID. Please try again."
                });
        }
    });
}

module.exports = router;