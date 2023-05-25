const express = require('express');
const router = express.Router();
const path = require('path');
const studentsController = require('../../controllers/studentsController')
const verifyJWT = require('../../middleware/verifyJWT')



router.route('/')
// To Read
.get(studentsController.getAllstudents)

// To Create
.post(studentsController.createNewStudents)

// To Update
.put(studentsController.updateStudent)

//  To Delete
.delete(studentsController.deleteStudent)


router.route('/:id')
.get(studentsController.getStudent)


module.exports = router