const express = require("express");
const router = express.Router();
const z = require("zod");
const multer = require("multer");
const fs = require("fs/promises");
const { teachers } = require("../db");
const cloudinary = require("cloudinary").v2;
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

// Route to get all teachers
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        //calculate
        const skip = (page - 1) * limit;

        // Fetch teachers with pagination
        const all_teachers = await teachers
            .find()
            .skip(skip) // Skip the first 'skip' records
            .limit(limit); // Limit to 'limit' records

        const totalTeachers = await teachers.countDocuments();

        res.json({
            all_teachers,
            extra: {
                totalTeachers,
                totalPages: Math.ceil(totalTeachers / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching teachers" });
    }
});



// Route to get teacher by id
router.get("/id/:id", async (req, res) => {
    try {
        const teacherId = req.params.id;

        // Find the teacher by ID
        const teacher = await teachers.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ msg: "Teacher not found" });
        }

        res.json({
            teacher,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching teacher" });
    }
});



// Route for updating teachers data
router.put("/update/:id",authenticateAdmin, upload.single("image"), async (req, res) => {
    const teacherId = req.params.id;
    try {
        const teacher = await teachers.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ msg: "Teacher not found" });
        }


        let updateData = {};
        let imageUrl = null;
        if (req.file) {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "teachers",
                public_id: `teacher_${teacher.name}`,
            });

            imageUrl = uploadResult.secure_url;

            // Clean up local file
            await fs.unlink(req.file.path);
        }

        if (req.body.name !== "") {
            updateData.name = req.body.name;
        }

        if (req.body.subject !== "") {
            updateData.subject = req.body.subject;
        }
        if (req.file) {
            updateData.profileImageUrl = imageUrl;
        }

        // update
        const updatedTeacher = await teachers.findByIdAndUpdate(
            teacherId,
            updateData,
            {
                new: true, // Return the updated document
            }
        );

        if (!updatedTeacher) {
            return res.status(404).json({ msg: "Teacher not found" });
        }

        res.json({
            msg: "Teacher updated successfully",
            teacher: updatedTeacher,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating teacher" });
    }

});


// Route to delete teacher by id
router.delete("/delete/:id", authenticateAdmin,async (req, res) => {
    const teacherId = req.params.id;

    try {

        const teacher = await teachers.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ msg: "Teacher not found" });
        }

        teacher.deleted = true;

        // Save the teacher with the updated 'deleted' status
        await teacher.save();

        res.json({ msg: "Teacher deleted successfully", teacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error deleting teacher" });
    }

});


const teacher_input = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email format"),
    subject: z.string(),
    image: z.any().optional(),
});

//  Route to add new teacher
router.post("/addteacher",authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
        const validatedata = teacher_input.parse({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            image: req.file,
        });

        // Extract validated data
        const { name, email, subject } = validatedata;
        let imageUrl = null;
        if (req.file) {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "teachers",
                public_id: `teacher_${name}`,
            });

            imageUrl = uploadResult.secure_url;

            // Clean up local file
            await fs.unlink(req.file.path);
        }
        // const saltRounds = 10;
        // const hashpassword = await bcrypt.hash(password,saltRounds);

        const incert_teacher = await teachers.create({
            name,
            email,
            subject,
            profileImageUrl: imageUrl,
        });

        console.log(incert_teacher);

        res.status(201).json({
            msg: "Teacher added successfully",
            teacher: incert_teacher,
        });
    } catch (err) {
        res.json({
            msg: "Error occurred" + err,
            error: err.errors || err.message,
        });
    }
});

module.exports = router;
