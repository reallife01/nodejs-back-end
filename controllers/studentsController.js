const data = {
students: require('../models/students.json'),
setStudents: function (data)  {
this.students = data;
}

};

const getAllstudents = (req, res) =>{
    res.json(data.students);
}


const createNewStudents = (req, res) => {
   const newStudent = {
      id: data.students[data.students.length - 1].id + 1 || 1,
      firstname: req.body.firstname,
      lastname: req.body.lastname
   }

   //set the required condition for the parameters

   if(!newStudent.firstname || !newStudent.lastname) {
    return res
       .staus(400)
       .json({message: 'firsname and lastname are required'})
   }

   //add the new student to the students list
   data.setStudents([...data.students, newStudent])


    //update the data
    res.status(201).json(data.students);
    
    }


    const updateStudent = (req, res) => {
        const student= data.students.find(
              (std) => std.id === parseInt(req.body.id)
        )
  
        if (!student){
              return res
              .status(400)
              .json({message: `student ID ${req.body.id} not found`})
        }
  
        if (req.body.firstname) student.firstname = req.body.firstname;// if we found an id
        if (req.body.firstname) student.lastname = req.body.lastname;
  
        const filteredStudentsArray = data.students.filter(
              (std) => std.id !== parseInt(req.body.id)
        )
  
        const unsortedStudentsArray = [...filteredStudentsArray, student];
  
        data.setStudents(
              unsortedStudentsArray.sort((a,b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
        )
  
    res.json(data.students);
  };


    const deleteStudent = (req, res) => {
        const student = data.students.find(
            (std) => std.id === parseInt(req.body.id)
          );
          if (!student) {
            return res
              .status(400)
              .json({ message: `student ID ${req.body.id} not found` });
          }
          const filteredStudentsArray = data.students.filter(
            (std) => std.id !== parseInt(req.body.id)
          );
          data.setStudents([...filteredStudentsArray]);
          res.json(data.students);
    }



    const getStudent = (req, res) => {
        const student = data.students.find(
            (std) => std.id === parseInt(req.params.id)
          );
          if (!student) {
            return res
              .status(400)
              .json({ message: `student ID ${req.params.id} not found` });
          }
          res.json(student);
    }


    module.exports = {getAllstudents, createNewStudents, updateStudent, deleteStudent, getStudent}