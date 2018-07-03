'use Strict'


var versioning=require('../../app/models/version');
exports.checkAppUpgradation =function(req,res)
{
var currentver=req.body.version;
//null check
if(currentver==undefined||currentver==null||currentver<1)
{
return;
}

var Status = {
    NOUPDATE: 0,
    SUGGESTUPDATE: 1,
    FORCEUPDATE: 2
};

var ForceCount=0;

versioning.find({},function(err,result)
{
    console.log(result);
if(err)
{
    return console.log(err);
}

if(result==null)
{
    return console.log(result);
}
else
{
    result.forEach(function(item,index) {
      
        if(currentver < item.Ver)
        {
           if(item.Force === true)
           {
               ForceCount++;
           }

        }

    });
    if(ForceCount === 0)
    {
     return  res.status(200).send({status:Status.NOUPDATE,msg:'No Update Required',Version:currentver});
    }
    else if(ForceCount>=1)
    {
        return  res.status(200).send({status:Status.FORCEUPDATE,msg:'Update your App',Version:currentver});
    }
    else
    {
        console.log('some Error Occured');
    }
    
}


});




}