# 🏫 School Management System 

## 📝 Teacher Management API Endpoints

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

---

### 3. Get Teacher by ID
- **Endpoint:** `GET /api/v1/teacher/id/{id}`
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/id/673f0e8114ac5adc1d590aff`

---

### 4. Update Teacher Information
- **Endpoint:** `PUT /api/v1/teacher/update/{id}`
- **Request Type:** Multipart Form Data
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Optional Fields to Update:**
  - `name`: Teacher's full name (String)
  - `subject`: Subject taught (String)
  - `image`: Profile image file (Optional)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/update/673f10ae4ffd3a771c8a6aa1`

---

### 5. Soft Delete Teacher
- **Endpoint:** `DELETE /api/v1/teacher/delete/{id}`
- **Required Path Parameter:**
  - `id`: Unique teacher identifier (String)
- **Example Request:**  
  - `http://localhost:5000/api/v1/teacher/delete/673f10ae4ffd3a771c8a6aa1`# school_management_system
# school_management_system
