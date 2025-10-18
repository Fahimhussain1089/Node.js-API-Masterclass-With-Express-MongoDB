const Bootcamp = require('../models/Bootcamp');

//@desc    Get all bootcamps
//@route   GET /api/v1/bootcamps
//@access  Public

exports.getBootcamps = async(req, res,next) => {
    // res.status(200).json({success:true,msg:'hussain'});
     try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({success: true , data: bootcamp});
    } catch (err) {
        res.status(400).json({success:false});
    }  
     res.status(200).json({success:true,msg:`Get bootcamp ${req.params.id}`});
}


//@desc    Get single bootcamps
//@route   GET /api/v1/bootcamps/:id
//@access  Public

exports.getBootcamp = async (req, res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success: true , data: bootcamp});
    } catch (err) {
        res.status(400).json({success:false});
    }

   
}

//@desc    create new   bootcamps
//@route   POST /api/v1/bootcamps
//@access  Private

exports.createBootcamp = async(req, res,next) => {
    console.log(req.body);
    //  res.status(200).json({success:true,msg:'Create new bootcamp'});
    const bootcamp = await Bootcamp.create(req.body).then(bootcamp=>{
        res.status(201).json({
            success:true,
            data:bootcamp
        });
    }).catch(err=>{
        res.status(400).json({
            success:false
        });
    });
    res.status(200).json({success:true,msg:bootcamp});

}

//@desc    update  single bootcamps
//@route   put /api/v1/bootcamps/:id
//@access  Private

exports.updateBootcamp = async (req, res,next) => {
    // res.status(200).json({success:true,msg:`Update bootcamp ${req.params.id}`});
    const bootcamp = Bootcamp.findByIdAndUpdate(req.params.id
    ,req.body,{
        new:true,
        runValidators:true
    }).then(bootcamp=>{
        if(!bootcamp){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:bootcamp});
    }
    ).catch(err=>{
        res.status(400).json({success:false});
    }
    );

}

//@desc    delete  single bootcamps
//@route   delete /api/v1/bootcamps/:id
//@access  Private

exports.deleteBootcamp = async (req, res,next) => {
        // res.status(200).json({success:true,msg:`Delete bootcamp ${req.params.id} ` });
    Bootcamp.findByIdAndDelete(req.params.id).then(bootcamp=>{
        if(!bootcamp){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:{}});
    }
    ).catch(err=>{
        res.status(400).json({success:false});
    }
    );
    

}


