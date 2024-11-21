const express = require("express");
const router = express.Router();
const z = require("zod");
const multer = require("multer");
const fs = require("fs/promises");
const { students , classes } = require("../db");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
require("dotenv").config(); // Load environment variables

const {authenticateAdmin} = require("./middleware");

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const app = express();
const upload = multer({ dest: "uploads/" });


router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        //calculate
        const skip = (page - 1) * limit;

        // Fetch teachers with pagination
        const all_students = await students.find()
            .skip(skip) // Skip the first 'skip' records
            .limit(limit); // Limit to 'limit' records

        const totalstudents = await students.countDocuments();

        res.json({
            all_students,
            extra: {
                totalstudents,
                totalPages: Math.ceil(totalstudents / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching students" });
    }
});

// Route to get student by id
router.get("/id/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        // Find the student by ID
        const student = await students.findById(studentId);

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        res.json({
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching student" });
    }
});


// Route for update student data
router.put("/update/:id",authenticateAdmin, upload.single("image"), async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await students.findById(studentId);

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        let updateData = {};
        let imageUrl = null;

        if (req.file) {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "students",
                public_id: `student_${student.name}`,
            });

            imageUrl = uploadResult.secure_url;

            // Clean up local file
            await fs.unlink(req.file.path);
        }

        if (req.body.name !== "") {
            updateData.name = req.body.name;
        }

        if (req.body.classId !== "") {
            const single_class = await classes.findById(req.body.classid);

            if (!single_class) {
                return res.status(404).json({ msg: "Class not exist" });
            }

            updateData.classId = req.body.classid;
        }

        if (req.file) {
            updateData.profileImageUrl = imageUrl;
        }

        // Update student
        const updatedStudent = await students.findByIdAndUpdate(
            studentId,
            updateData,
            {
                new: true, // Return the updated document
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({ msg: "Student not found" });
        }

        res.json({
            msg: "Student updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating student" , error : error.message });
    }
});


// Route to delete student by id )
router.delete("/delete/:id", authenticateAdmin,async (req, res) => {
    const studentId = req.params.id;

    try {
        const student = await students.findById(studentId);

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        student.deleted = true;

        // Save the student with the updated 'deleted' status
        await student.save();

        res.json({ msg: "Student deleted successfully", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting student" });
    }
});


// Route to add a new student
router.post("/addstudent",authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
        const validatedata = z.object({
            name: z.string().nonempty("Name is required"),
            email: z.string().email("Invalid email format"),
            classId: z.string().nonempty("Class reference is required"),
            image: z.any().optional(),
        }).parse({
            name: req.body.name,
            email: req.body.email,
            classId: req.body.classid,
            image: req.file,
        });

        const { name, email, classId } = validatedata;

        const single_class = await classes.findById(classId);

        if (!single_class) {
            return res.status(404).json({ msg: "Class not exist" });
        }


        let imageUrl = null;
        if (req.file) {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "students",
                public_id: `student_${name}`,
            });

            imageUrl = uploadResult.secure_url;

            // Clean up local file
            await fs.unlink(req.file.path);
        }

        const incert_student = await students.create({
            name,
            email,
            classId,
            profileImageUrl: imageUrl,
        });

        res.status(201).json({
            msg: "Student added successfully",
            student: incert_student,
        });
    } catch (err) {
        res.json({
            msg: "Error occurred",
            error: err.errors || err.message,
        });
    }
});

module.exports = router;
