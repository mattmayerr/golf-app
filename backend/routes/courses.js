const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addCourse, getCourses, deleteCourse } = require('../controllers/courseController');

// All routes require authentication
router.use(auth);

// Add a new course
router.post('/', addCourse);

// Get all courses for the user
router.get('/', getCourses);

// Delete a course
router.delete('/:id', deleteCourse);

module.exports = router; 