# 🏫 School Management System 

## 👨 Teacher Management API Endpoints

### 1. Add a New Teacher
- **Endpoint:** `POST /api/v1/teacher/addteacher`
- **Request Type:** Multipart Form Data
- **Required Fields:**
  - `name`: Teacher's full name (String)
  - `email`: Unique email address (String)
  - `subject`: Subject taught (String)
  - `image`: Profile image file (Optional)

### 2. Get All Teachers
- **Endpoint:** `GET /api/v1/teacher`
- **Request Parameters (Optional):**
  - `page`: Page number for pagination (Integer, Default: 1)
  - `limit`: Number of records per page (Integer, Default: 5)
- **Example Requests:**
  - `http://localhost:5000/api/v1/teacher`
  - `http://localhost:5000/api/v1/teacher?page=2`
  - `http://localhost:5000/api/v1/teacher?page=1&limit=5`


### 3. Get Teacher by ID
- **Endpoint:** `GET /api/v1/teacher/id/{teacher_id}`
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/id/673f0e8114ac5adc1d590aff`


### 4. Update Teacher Information
- **Endpoint:** `PUT /api/v1/teacher/update/{teacher_id}`
- **Request Type:** Multipart Form Data
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Optional Fields to Update:**
  - `name`: Teacher's full name (String)
  - `subject`: Subject taught (String)
  - `image`: Profile image file (Optional)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/update/673f10ae4ffd3a771c8a6aa1`


### 5. Soft Delete Teacher
- **Endpoint:** `DELETE /api/v1/teacher/delete/{teacher_id}`
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/delete/673f10ae4ffd3a771c8a6aa1`



## 📝 Class Management API Endpoints

### 1. Create a New Class
- **Endpoint:** `POST /api/v1/class/create`
- **Required Fields:**
  - `name`(Required):  Name of the class (e.g., "Grade 10A")
  - `teacherId`(Required): ID of the teacher assigned to the class (ObjectId, reference to Teacher)
  - `studentCount` (Optional): Number of students in the class (default: 0)

#### Request Body Example:
```json
{
    "name": "Grade 10A",
    "teacherId": "673f0e8114ac5adc1d590aff",
    "studentCount": 30
}
```

### 2. Update a Class
- **Endpoint:** `PUT /api/v1/class/update/:class_id`
- **Required Fields:**
  - `name`: Name of the class (e.g., "Grade 10A")
  - `teacherId`: ID of the teacher assigned to the class (ObjectId, reference to Teacher)
  - `studentCount` : Number of students in the class

#### Request Body Example:
```json
{
    "name": "Grade 10B",
    "teacherId": "673f0e8114ac5adc1d590aff",
    "studentCount": 32
}
```

### 3. Get All Classes
- **Endpoint:** `GET /api/v1/class`
- **Query Parameters (Optional):**
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of classes per page (default: 2)

#### Request Example:
```bash
GET http://localhost:5000/api/v1/class
GET http://localhost:5000/api/v1/class?page=2
GET http://localhost:5000/api/v1/class?page=2&limit=5
```

### 4. Delete a Class
- **Endpoint:** `DELETE /api/v1/class/delete/:class_id`
- **Required Parameters:**
  - `id`: ID of the class to delete (ObjectId)

#### Request Example:
```bash
DELETE http://localhost:5000/api/v1/class/delete/60f72c1a72d12b2b5c51a4f7
```
### 🎓 Student Management API Endpoints


### 1. Add a New Student
- **Endpoint:** `POST /api/v1/student/addstudent`
- **Request Type:** Multipart Form Data
- **Required Fields:**
  - `name`: Student's full name (String)
  - `email`: Unique email address (String)
  - `classId`: Reference to the class ID the student belongs to (String, ObjectId)
  - `image`: Profile image file (Optional)



### 2. Get All Students
- **Endpoint:** `GET /api/v1/student`
- **Request Parameters (Optional):**
  - `page`: Page number for pagination (Integer, Default: 1)
  - `limit`: Number of records per page (Integer, Default: 5)
  - `classId`: Filter students by class ID (String, ObjectId)
- **Example Requests:**
  - `http://localhost:5000/api/v1/student`
  - `http://localhost:5000/api/v1/student?page=2`
  - `http://localhost:5000/api/v1/student?classId=64a9e7c0931f5a0e5d6e8e43`


### 3. Get Student by ID
- **Endpoint:** `GET /api/v1/student/id/{student_id}`
- **Required Path Parameter:**
  - `id`: Unique student identifier (String, ObjectId)
- **Example Request:**  
  - `http://localhost:5000/api/v1/student/id/64b1faae5ef1a0d4b6742a8b`



### 4. Update Student Information
- **Endpoint:** `PUT /api/v1/student/update/{student_id}`
- **Request Type:** Multipart Form Data
- **Required Path Parameter:**
  - `id`: Unique student identifier (String, ObjectId)
- **Optional Fields to Update:**
  - `name`: Student's full name (String)
  - `classId`: Reference to the updated class ID (String, ObjectId)
  - `image`: Profile image file (Optional)
- **Example Request:**  
  - `http://localhost:5000/api/v1/student/update/64b1faae5ef1a0d4b6742a8b`



### 5. Soft Delete Student
- **Endpoint:** `DELETE /api/v1/student/delete/{student_id}`
- **Required Path Parameter:**
  - `id`: Unique student identifier (String, ObjectId)
- **Example Request:**  
  - `http://localhost:5000/api/v1/student/delete/64b1faae5ef1a0d4b6742a8b`