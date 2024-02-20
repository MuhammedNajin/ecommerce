const Catagery = require('../models/cetagory')

module.exports.loadCategory = async (req, res) => {
    try {
        const page = req.query.page;
        const CetageryLength = await Catagery.find();
        return Catagery.find().skip(page * 4).limit(4)
        .then((data) => {
            if(data) {
            res.render('Catagery', {cetagorys: data, page: parseInt(page), cetagoryLength: CetageryLength.length });
            } 
        })
        
    } catch (error) {
        console.log(error);
    }
}

// add cetagory

module.exports.AddCetogory = async (req, res) => {
    try {
        const data = req.body.data
        console.log(data, typeof data);
        const is = await Catagery.findOne({name: data.toLowerCase()});
        if(is) {
          return res.json({fail: true});
        }
        if(data) {
            const cetagory = new Catagery({
                name: data.toLowerCase(),
                isListed: true,

            })

            return cetagory.save()
            .then((saved) => {
                if(saved) {
                  res.json({saved: true});
                }
            })
            .catch((err) => {
                console.log('err');
            })

        } else {
            console.log('data did not recived....');
        }
       

    } catch (error) {
        console.log(error)
    }
}

// 
module.exports.listCetagory = (req, res) => {
    try {
        console.log('Reiched at list?')
        const id = req.body.data;
        console.log(id);
        return Catagery.findOne({_id: id})
        .then((user) => {
            if(user.isListed) {

                return Catagery.updateOne({_id: id},{
                    $set: {
                        isListed: false,
                    }
                })

            } else{
                return Catagery.updateOne({_id: id}, {
                    $set: {
                        isListed: true,
                    }
                })
            }
        })
        .then(() => {
             res.json({listed: true});
        })
        .catch((err) => {
            console.log(err);
        })
        
    } catch (error) {
        console.log(error)
    }
}

// edit cetagory
module.exports.editCetagory = async (req, res) => {
    try {
        const id = req.body.id;
        const data = req.body.data

        console.log(id, data);
        const sameName = await Catagery.findOne({name: data});
        if(sameName) {
           return res.json({fail: true})
        }
        if(id) {
            const update = await Catagery.updateOne({_id: id},{$set:{name: data}})
            if(update) {
                res.json({updated: true});
            } else {
                console.log('not Updated ')
            }
        } else {
            console.log('id did not received')
        }
    } catch (error) {
        console.log(error)
    }
}