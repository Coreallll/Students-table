let students = [];
let sortFlag
let dirFlag = true
let stId
let studentItem
const tbody = document.querySelector('tbody'),
      filterFIO = document.getElementById('filterFIO'),
      filterFaculty = document.getElementById('filterFaculty'),
      filterStartEducation = document.getElementById('filterStartEducation'),
      filterEndEducation = document.getElementById('filterEndEducation'),
      formNewStudent = document.getElementById('formNewStudent'),
      headFIO = document.getElementById('headFIO'),
      headFaculty = document.getElementById('headFaculty'),
      headBirthdate = document.getElementById('headBirthdate'),
      headStartEducation = document.getElementById('headStartEducation'),
      clearButton = document.getElementById('clearButton'),
      deleteBtn = document.getElementById('deleteButton');


async function loadStudents() {
  const response = await fetch('http://localhost:3000/api/students')
  const dataStudents = await response.json();

  return (students = dataStudents)
}

let serverArr = await loadStudents(students);


function createStudent(student) {
  const row = document.createElement('tr'),
        cellFullName = document.createElement('td'),
        cellFaculty = document.createElement('td'),
        cellBirthDate = document.createElement('td'),
        cellYearOfEducation = document.createElement('td');

  const currentYear = new Date().getFullYear();
  const course = currentYear - student.studyStart;
  student.fio = student.surname + ' ' + student.name + ' ' + student.lastname;
  student.endEducation = parseInt(student.studyStart) + 4;

  const wordEnding = (number, txt) => {
    let cases = [2, 0, 1, 1, 1, 2];
    return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  const years = wordEnding(studentAge(student.birthday), ['год', 'года', 'лет']);

  cellFullName.textContent = student.fio;
  cellFaculty.textContent = student.faculty;
  cellBirthDate.textContent = getBirthDate(new Date(student.birthday)) + ' ' + '(' + studentAge(new Date(student.birthday)) + ' ' + years + ')';

  if (course < 4) {
    cellYearOfEducation.textContent = student.studyStart + ' - ' + currentYear + ' (' + course + ' курс' + ')';
  } else {
    cellYearOfEducation.textContent = student.studyStart + ' - ' + student.endEducation + ' (' + 'окончил(а)' +')'
  }

  row.append(cellFullName,  cellFaculty,  cellBirthDate,  cellYearOfEducation);
  tbody.append(row);

  row.classList.add('student');

  row.addEventListener('click', async () => {
    stId = student.id;
    studentItem = row;
  })


  return row
}

function addStudents() {
  let serverArrCopy = [...serverArr];

  tbody.innerHTML = '';

  //Сортировка
  serverArrCopy.sort( (a, b) => {
    let sort = a[sortFlag] < b[sortFlag]

    if(dirFlag === false) sort = a[sortFlag] > b[sortFlag]
    if(sort) return -1
  })

  //Фильтрация студентов
  if (filterFIO.value.trim() !== "") {
    serverArrCopy = serverArrCopy.filter(function (student) {
      if (student.fio.includes(registerFIO())) return true
    });
  }

  if (filterFaculty.value.trim() !== "") {
    serverArrCopy = serverArrCopy.filter(function (student) {
      if (student.faculty.includes(registerFaculty())) return true
    })
  }
  if (filterStartEducation.value.trim() !== "") {
    serverArrCopy = serverArrCopy.filter(function (student) {
      if (String(student.studyStart).includes(filterStartEducation.value.trim())) return true
    })
  }
  if (filterEndEducation.value.trim() !== "") {
    serverArrCopy = serverArrCopy.filter(function (student) {
      if (String(student.endEducation).includes(filterEndEducation.value.trim())) return true
    })
  }

  //Заполняем таблицу

  //Запрос на список студентов

  serverArrCopy.forEach(student => {
    const newStudent = createStudent(student)
    tbody.append(newStudent)
  })
}

//Форма для создания нового студента
formNewStudent.addEventListener('submit', async (event) => {

  event.preventDefault();

  const newName = document.getElementById('name'),
        newSurname = document.getElementById('surname'),
        newLastname = document.getElementById('lastname'),
        newBirthDate = document.getElementById('birthdate'),
        newStartEducation = document.getElementById('startEducation'),
        newFaculty = document.getElementById('faculty'),
        errorsField = document.getElementById('errors'),
        inputs = formNewStudent.querySelectorAll('input');

  inputs.forEach((input) => {
    if (input.value.trim() === '') {
      input.classList.add('input__error');
    } else  {
      input.classList.remove('input__error')
    }
  })

  const errorSurname = document.getElementById('errSurname');
  const errorName = document.getElementById('errName');
  const errorLastname = document.getElementById('errLastname');
  const errorFaculty = document.getElementById('errFaculty');

  const newNameEmpty = newName.value.length === 0;
  const newSurnameEmpty = newSurname.value.length === 0;
  const newLastnameEmpty = newLastname.value.length === 0;
  const newFacultyEmpty = newFaculty.value.length === 0;

  if (newNameEmpty) {
    errorName.classList.remove('err-disabled');
  }
  else {
    errorName.classList.add('err-disabled');
  }

  if (newSurnameEmpty) {
    errorSurname.classList.remove('err-disabled');
  }
  else {
    errorSurname.classList.add('err-disabled');
  }

  if (newLastnameEmpty) {
    errorLastname.classList.remove('err-disabled');
  }
  else {
    errorLastname.classList.add('err-disabled');
  }

  if (newFacultyEmpty) {
    errorFaculty.classList.remove('err-disabled');
  }
  else {
    errorFaculty.classList.add('err-disabled');
  }

  //Если дата рождения не указана или указана не в рамках с 1900 по 2005, выдаст ошибку и выведет её в поле
  const errorBirthDate = document.getElementById('errBirthdate');
  if (newBirthDate.valueAsDate === null || newBirthDate.valueAsDate.getFullYear() < 1900 || newBirthDate.valueAsDate.getFullYear() > 2005) {
    errorsField.classList.add('errors__active');
    errorBirthDate.classList.remove('err-disabled');
  } else {
    errorBirthDate.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  //Если дата начала обучения не указана или указана меньше 2000 года, выдаст ошибку и выведет её в поле
  const errorStartEducation = document.getElementById('errStartEducation');
  if (newStartEducation.value === '' || newStartEducation < 2000) {
    errorsField.classList.add('errors__active');
    errorStartEducation.classList.remove('err-disabled');
  } else {
    errorStartEducation.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  if (newNameEmpty || newSurnameEmpty || newLastnameEmpty || newFacultyEmpty) {
    errorsField.classList.add('errors__active');
    return
  }

  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify({
      name: newName.value.trim().substring(0, 1).toLocaleUpperCase() + newName.value.trim().substring(1).toLowerCase(),
      surname: newSurname.value.trim().substring(0, 1).toLocaleUpperCase() + newSurname.value.trim().substring(1).toLowerCase(),
      lastname: newLastname.value.trim().substring(0, 1).toLocaleUpperCase() + newLastname.value.trim().substring(1).toLowerCase(),
      birthday: newBirthDate.value,
      studyStart: parseInt(newStartEducation.value.trim()),
      faculty: newFaculty.value.trim().substring(0, 1).toLocaleUpperCase() + newFaculty.value.trim().substring(1).toLowerCase()
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const dataStudents = await response.json();

  serverArr.push(dataStudents);

  newName.value = '';
  newSurname.value = '';
  newLastname.value = '';
  newBirthDate.value = '';
  newStartEducation.value = '';
  newFaculty.value = '';

  addStudents();
  studentSelection();

})

addStudents();

//Сортировка студентов
headFIO.addEventListener('click', () => {
  sortFlag = 'fio';
  dirFlag = !dirFlag;
  addStudents(serverArr);
  studentSelection();
})

headBirthdate.addEventListener('click', function () {
  sortFlag = 'birthday'
  dirFlag = !dirFlag
  addStudents(serverArr)
  studentSelection()
})

headStartEducation.addEventListener('click', function () {
  sortFlag = 'studyStart'
  dirFlag = !dirFlag
  addStudents(serverArr)
  studentSelection()
})

headFaculty.addEventListener('click', function () {
  sortFlag = 'faculty'
  dirFlag = !dirFlag
  addStudents(serverArr)
  studentSelection()
})


function getBirthDate(date) {
  let yyyy =  new Date(date).getFullYear();
  let mm =  new Date(date).getMonth() + 1;
  let dd =  new Date(date).getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  let result = dd + '.' + mm + '.' + yyyy;

  return result;
}

function studentAge(date) {
  const today = new Date();
  let age = today.getFullYear() - new Date(date).getFullYear();
  let m = today.getMonth() - new Date(date).getMonth();
  if (m < 0 || (m === 0 && today.getDate() <  new Date(date).getDate())) {
      age--;
  }
  return age;
}

//Функции для фильтрации студентов
function registerFIO() {
  let filteredFIO = filterFIO.value.substring(0, 1).toUpperCase() + filterFIO.value.substring(1).toLowerCase();
  return filteredFIO
}

function registerFaculty() {
  let filteredFaculty = filterFaculty.value.substring(0, 1).toUpperCase() + filterFaculty.value.substring(1).toLowerCase();
  return filteredFaculty
}

filterFIO.addEventListener('input', function () {
  addStudents(students)
  studentSelection()
})

filterFaculty.addEventListener('input', function () {
  addStudents(students)
  studentSelection()
})

filterStartEducation.addEventListener('input', function () {
  addStudents(students)
  studentSelection()
})

filterEndEducation.addEventListener('input', function () {
  addStudents(students)
  studentSelection()
})

clearButton.addEventListener('click', (e) => {
  e.preventDefault();
  filterFIO.value = ""
  filterStartEducation.value = ""
  filterEndEducation.value = ""
  filterFaculty.value = ""
  addStudents()
})

//Обработка выбора студента
function studentSelection() {
  const studentsList = document.querySelectorAll('.student');

  studentsList.forEach((studentItem) => {
    studentItem.addEventListener('click', () => {
      if (studentItem.classList.contains('student__active')) {
        deleteBtn.classList.remove('btn-delete__active')
        studentItem.classList.remove('student__active')

      } else {
        closeStudentSelection()
        studentItem.classList.add('student__active')
        deleteBtn.classList.add('btn-delete__active')
      }
    })
  })

  function closeStudentSelection() {
    studentsList.forEach((studentItem) => {
      studentItem.classList.remove('student__active')
    })
  }

}
studentSelection()

//Удаление студента
deleteBtn.addEventListener('click', function () {
  const check = confirm("Вы хотите удалить запись?");
  if (check === true) {
    async function deleteItem(studentId) {
      const response = await fetch(`http://localhost:3000/api/students/${studentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

    }

    deleteItem(stId);
    studentItem.remove();
  } else {
    return;
  }
  deleteBtn.classList.remove('btn-delete__active')
  window.location.reload();
})

