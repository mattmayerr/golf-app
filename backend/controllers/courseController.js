const Course = require('../models/Course');

// Add a new course
exports.addCourse = async (req, res) => {
  try {
    const { name } = req.body;
    console.log('Received course add request:', { name, userId: req.user.id });
    
    if (!name || !name.trim()) {
      console.log('Validation failed: course name is empty');
      return res.status(400).json({ message: 'Course name is required' });
    }

    const course = new Course({
      name: name.trim(),
      userId: req.user.id
    });

    console.log('Attempting to save course:', course);
    await course.save();
    console.log('Course saved successfully:', course);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error in addCourse:', error);
    if (error.code === 11000) {
      console.log('Duplicate course error');
      return res.status(400).json({ message: 'Course already exists' });
    }
    console.error('Server error in addCourse:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courses for a user
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id })
      .sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 