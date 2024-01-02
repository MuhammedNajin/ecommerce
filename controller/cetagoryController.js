

module.exports.loadCategory = (req, res) => {
    try {
        return Catagery.find()
        .then((data) => {
            if(data) {
            res.render('Catagery', {cetagorys: data});
            } 
        })
        
    } catch (error) {
        console.log(error);
    }
}

// add cetagory

module.exports.AddCetogory = (req, res) => {
    try {

        const data = req.body.data;
        if(data) {
            const cetagory = new Catagery({
                name: data,
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