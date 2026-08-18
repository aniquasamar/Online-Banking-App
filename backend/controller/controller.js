const dbService = require("../services/db.service");

const getData = async (req, res, schema) => {
  try {
    const dbRes = await dbService.findAllRecord(schema);
    return res.status(200).json({
      message: 'Record Found',
      data: dbRes
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

const createData = async (req,res,schema) => {
  try{
    const data = req.body;
    const dbRes = await dbService.createNewRecord(data,schema);
    res.status(200).json({
        message : "Data inserted successfully!",
        success : true,
        data : dbRes
    })
  }catch(error){
    if(error.code === 11000){
        res.status(422).json({
        message : "Already exist",
        success : false,
        error
    })
    }
    else{
        res.status(500).json({
        message : "Internal server error",
        success : false,
        error
    })
    }
  }
}

module.exports = {
    createData,
    getData
}