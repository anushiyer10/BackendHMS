
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
    const id = req.params.id

    try {

        const updateDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true })

        res.status(200).json({ success: true, message: 'Succesfully Updated', data: updateDoctor })

    } catch (err) {

        res.status(500).json({ success: false, message: 'Failed to update' })
    }
}



export const deleteDoctor = async (req, res) => {
    const id = req.params.id

    try {

        const deleteDoctor = awaitDoctor.findByIdAndDelete(id)

        res.status(200).json({ success: true, message: 'Succesfully Deleted'})

    } catch (err) {

        res.status(500).json({ success: false, message: 'Failed to Delete' })
    }
}




export const getSingleDoctor = async (req, res) => {
    const id = req.params.id

    try {

        const Doctor = await Doctor.findById(id).populate('reviews').select("-password");

        res.status(200).json({ success: true, message: 'Doctor Found', data: Doctor })

    } catch (err) {

        res.status(404).json({ success: false, message: 'NoDoctor Found' })
    }
}

export const getAllDoctor = async (req, res) => {
    const id = req.params.id

    try {
         
        const {query} = req.query;
        let doctors; 

        if(query){
            doctors = await Doctor.find({isApproved: 'approved',$or:[{name:{$regex:query,$options: "i"}} , 
            {specialization:{$regex:query,$options: "i"}}  
             ]
            }).select("-password");
        } else{
             doctors = await Doctor.find({isApproved: 'approved'}).select("-password");
        }
        //const Doctors = await Doctor.find({}).select("-password");

        res.status(200).json({ success: true, message: 'Doctor Found', data:doctors })

    } catch (err) {

        res.status(404).json({ success: false, message: 'Not Found' })
    }
}