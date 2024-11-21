const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config(); // Load environment variables


const mongoDBUrl = process.env.MONGODB_URL;
mongoose.connect(mongoDBUrl);

const admin_schema = new Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,   
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const student_schema = new Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
      },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
      },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class reference is required']
      },
    profileImageUrl : String,
    createdAt: {
        type: Date,
        default: Date.now
      }
  });

const teacher_schema = new Schema({
  name:{
    type:String,
    required:[true,'teacher name is required'],
    trim:true
  },
  email:{
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  subject:{
    type:String,
    required: [true,"subject is required for teacher"],
    trim:true
  },
  profileImageUrl : String,
  deleted: {
    type: Boolean,
    default: false, // Initially, the teacher is not deleted
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const classes_schema = new Schema({
    name:{
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
        validate: {
          validator: function(v) {
            // Optional: Validate class name format (e.g., 'Grade 10A')
            return /^(Grade|Class)\s\d+[A-Z]?$/.test(v);
          },
          message: 'Class name should be in format like "Grade 10A" or "Class 12B"'
        }
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', 
        required: [true, 'Teacher reference is required']
      },
    studentCount: {
        type: Number,
        default: 0,
        validate: {
          validator: Number.isInteger,
          message: 'Student count must be an integer'
        }
      },
    createdAt: {
        type: Date,
        default: Date.now
      }
    
})

const students = mongoose.model('students', student_schema);
const teachers = mongoose.model('teachers',teacher_schema);
const classes = mongoose.model('classes',classes_schema);
const admin = mongoose.model('admin',admin_schema);

module.exports ={
  students , teachers, classes,admin
}