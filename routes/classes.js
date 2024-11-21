const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { classes , teachers } = require('../db'); // Assuming you have this import for the class model

const {authenticateAdmin} = require("./middleware");

const app = express();



// Route to get all teachers
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        //calculate
        const skip = (page - 1) * limit;

        // Fetch teachers with pagination
        const all_classes = await classes.find()
            .skip(skip) // Skip the first 'skip' records
            .limit(limit); // Limit to 'limit' records

        const totalclasses = await classes.countDocuments();

        res.json({
            all_classes,
            extra: {
                totalclasses,
                totalPages: Math.ceil(totalclasses / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching classes" });
    }
});

router.put("/update/:id",authenticateAdmin,async (req, res) => {
    const classesid = req.params.id;
    try {
        const single_class = await classes.findById(classesid);

        if (!single_class) {
            return res.status(404).json({ msg: "Classes not found" });
        }


        let updateData = {};

        if (req.body.name !== "") {
            updateData.name = req.body.name;
        }

        if (req.body.subject !== "") {
            updateData.teacherId = req.body.teacherId;
        }
        if (req.body.studentCount !== "") {
            updateData.studentCount = req.body.studentCount;
        }

        const teacher = await teachers.findOne({ 
            _id: req.body.teacherId,
            $or: [
                { deleted: { $ne: true } }, // deleted is not true, meaning false or undefined
                { deleted: { $exists: false } } // deleted field does not exist
            ]       
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found or has been deleted' });
        }

        // update
        const updatedclasses = await classes.findByIdAndUpdate(
            classesid,
            updateData,
            {
                new: true, // Return the updated document
            }
        );

        if (!updatedclasses) {
            return res.status(404).json({ msg: "Class not updated" });
        }

        res.json({
            msg: "Class updated successfully",
            teacher: updatedclasses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating classes" , error: error.message} );
    }

});

router.delete("/delete/:id",authenticateAdmin, async (req, res) => {
    const classId = req.params.id;

    try {
        
        const deleteclass = await classes.findByIdAndDelete(classId);

        if (!deleteclass) {
            return res.status(404).json({ msg: "class does not exist" });
        }

        res.json({ msg: "class deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting class" });
    }

});

router.post('/create',authenticateAdmin,async(req,res)=>{

    try {
        const { name, studentCount, teacherId } = req.body;

        // Validate the incoming data
        if (!name || !teacherId) {
            return res.status(400).json({ message: 'Class name and teacher ID are required' });
        }

        const teacher = await teachers.findOne({ 
            _id: teacherId,
            $or: [
                { deleted: { $ne: true } }, // deleted is not true, meaning false or undefined
                { deleted: { $exists: false } } // deleted field does not exist
            ]        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found or has been deleted' });
        }

        // Create a new class
        const newClass = await classes.create({
            name,
            studentCount: studentCount || 0, // If student count is not provided, default to 0
            teacherId
        });

        return res.status(201).json({
            message: 'Class created successfully',
            data: newClass
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' , error:error.message });
    }

})

module.exports = router;
