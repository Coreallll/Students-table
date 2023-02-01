let students = [
  {lastName: 'Пупкин', name: 'Василий', patronymic: 'Аркадьевич', birthDate: new Date(2003,1,12), startEducation: 2021, faculty:'Информатический'},
  {lastName: 'Краснов', name: 'Андрей', patronymic: 'Геннадьевич', birthDate: new Date(1999,5,6), startEducation: 2017, faculty:'Юридический'},
  {lastName: 'Петров', name: 'Евгений', patronymic: 'Александрович', birthDate: new Date(2002,3,9), startEducation: 2020, faculty:'Экономический'},
  {lastName: 'Иванов', name: 'Владислав', patronymic: 'Павлович', birthDate: new Date(2001,7,17), startEducation: 2019, faculty:'Химический'},
  {lastName: 'Сидоров', name: 'Сергей', patronymic: 'Антонович', birthDate: new Date(1997,11,1), startEducation: 2015, faculty:'Биологический'}
];

let filteredStudents = [];

Object.assign(filteredStudents, students);

const createTable = students => {

  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';


  //заполнение таблицы
  students.forEach((item) => {
    let row = document.createElement('tr'),
      cellFullName = document.createElement('td'),
      cellFaculty = document.createElement('td'),
      cellBirthDate = document.createElement('td'),
      cellYearOfEducation = document.createElement('td');

    const currentYear = new Date().getFullYear();
    const course = currentYear - item.startEducation;
    const educationEndYear = parseInt(item.startEducation) + 4;


    const wordEnding = (number, txt) => {
      let cases = [2, 0, 1, 1, 1, 2];
      return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    const years = wordEnding(studentAge(item), ['год', 'года', 'лет']);

    function getBirthDate(item) {
      let yyyy = item.birthDate.getFullYear();
      let mm = item.birthDate.getMonth();
      let dd = item.birthDate.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      return  dd + '.' + mm + '.' + yyyy;
    }

    function studentAge(item) {
      let currTime = new Date();
      let age = currTime.getFullYear() - item.birthDate.getFullYear();
      let month = currTime.getMonth() - item.birthDate.getMonth();
      if (month < 0 || (month) === 0 && currTime.getDate() < item.birthDate.getDate()) {
        age--;
      }
      return  age;
    }

    cellFullName.textContent = item.lastName + ' ' + item.name + ' ' + item.patronymic;
    cellFaculty.textContent = item.faculty;
    cellBirthDate.textContent = getBirthDate(item) + ' (' + studentAge(item) + ' ' + years + ')';

    if (course < 4) {
      cellYearOfEducation.textContent = item.startEducation + ' - ' + currentYear + ' (' + course + ' курс' + ')';
    } else {
      cellYearOfEducation.textContent = item.startEducation + ' - ' + educationEndYear + ' (' + 'окончил' +')'
    }

    row.append(cellFullName,  cellFaculty,  cellBirthDate,  cellYearOfEducation);
    tbody.append(row);
  })
}
//вызываем функцию для заполнения таблицы
createTable(students);

//добавление нового студента через отправку формы
const formNewStudent = document.getElementById('form-new-student');

formNewStudent.addEventListener('submit', (event) => {
  const newName = document.getElementById('name');
  const newLastName = document.getElementById('last-name');
  const newPatronymic = document.getElementById('patronymic');
  const newBirthDate = document.getElementById('birth-date');
  const newStartEducation = document.getElementById('start-education');
  const newFaculty = document.getElementById('faculty');

  event.preventDefault();

  const errorsField = document.getElementById('errors');
  const inputs = formNewStudent.querySelectorAll('input');
  const emptyInputs = Array.from(inputs).filter(input => input.value === '');

  inputs.forEach(function (input) {
    if (input.value.trim() === '') {
      input.classList.add('input__error');
    } else  {
      input.classList.remove('input__error')
    }
  })

  //Если фамилия не указано, выдаст ошибку и выведет её в поле
  const errorLastName = document.getElementById('err-last-name');
  if (newLastName.value.length === 0) {
    errorsField.classList.add('errors__active');
    errorLastName.classList.remove('err-disabled');
  } else {
    errorLastName.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  //Если имя не указано, выдаст ошибку и выведет её в поле
  const errorName = document.getElementById('err-name');
  if (newName.value.length === 0) {
    errorsField.classList.add('errors__active');
    errorName.classList.remove('err-disabled');
  } else {
    errorName.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  //Если отчество не указано, выдаст ошибку и выведет её в поле
  const errorPatronymic = document.getElementById('err-patronymic');
  if (newPatronymic.value.length === 0) {
    errorsField.classList.add('errors__active');
    errorPatronymic.classList.remove('err-disabled');
  } else {
    errorPatronymic.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');

  }

  //Если дата рождения не указана или указана не в рамках с 1900 по 2005, выдаст ошибку и выведет её в поле
  const errorBirthDate = document.getElementById('err-birth-date');
  if (newBirthDate.valueAsDate === null || newBirthDate.valueAsDate.getFullYear() < 1900 || newBirthDate.valueAsDate.getFullYear() > 2005) {
    errorsField.classList.add('errors__active');
    errorBirthDate.classList.remove('err-disabled');
  } else {
    errorBirthDate.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  //Если дата начала обучения не указана или указана меньше 2000 года, выдаст ошибку и выведет её в поле
  const errorStartEducation = document.getElementById('err-start-education');
  if (newStartEducation.value === '' || newStartEducation < 2000) {
    errorsField.classList.add('errors__active');
    errorStartEducation.classList.remove('err-disabled');
  } else {
    errorStartEducation.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }

  //Если факультет не указан, выдаст ошибку и выведете её в поле
  const errorFaculty = document.getElementById('err-faculty');
  if (newFaculty.value.length === 0) {
    errorsField.classList.add('errors__active');
    errorFaculty.classList.remove('err-disabled');
  } else {
    errorFaculty.classList.add('err-disabled');
    errorsField.classList.remove('errors__active');
  }
  if (emptyInputs.length !== 0) {
    return false;
  }

  let createNewStudent = {
    name: newName.value,
    lastName: newLastName.value,
    patronymic: newPatronymic.value,
    birthDate: newBirthDate.valueAsDate,
    startEducation: newStartEducation.value,
    faculty: newFaculty.value
  }

  students.push(createNewStudent);
  Object.assign(filteredStudents, students);

  formNewStudent.reset();

  createTable(students);
})

//Сортировка таблицы
const tableHeader = document.getElementById('row-header');

tableHeader.addEventListener('click', (e) => {
  if (e.target.classList.contains('table-title')) {
    const orderedStudents = [];
    Object.assign(orderedStudents, filteredStudents);
    switch (e.target.getAttribute('data-sort')) {
      case 'fullName':
        orderedStudents.sort((prev, next) => {
          if ( `${prev.lastName} ${prev.name} ${prev.patronymic}` < `${next.lastName} ${next.name} ${next.patronymic}` ) return -1;
          if ( `${prev.lastName} ${prev.name} ${prev.patronymic}` > `${next.lastName} ${next.name} ${next.patronymic}` ) return 1;
        })
        createTable(orderedStudents);
        break;
      case 'faculty':
        orderedStudents.sort((prev, next) => {
          if ( prev.faculty < next.faculty ) return -1;
          if ( prev.faculty < next.faculty ) return 1;
        });
        createTable(orderedStudents);
        break;
      case 'birthdate':
        orderedStudents.sort((prev, next) => prev.birthDate - next.birthDate);
        createTable(orderedStudents);
        break;
      case 'startEducation':
        orderedStudents.sort((prev, next) => prev.startEducation - next.startEducation);
        createTable(orderedStudents);
        break;
      default:
        break;
    }
  }

  const tableTitle = document.querySelectorAll('.table-title');
  tableTitle.forEach((el) => {
    el.classList.remove('table-title__active');
  })
  e.target.classList.add('table-title__active');
})

//Фильтрация таблицы
const formFilter = document.getElementById('form-filter');

formFilter.querySelectorAll('.filter-input').forEach((inpt) => {
  inpt.addEventListener('input', (e) => {
    Object.assign(filteredStudents, students);

    formFilter.querySelectorAll('.filter-input').forEach((inpt) => {
      if(inpt.value.length) {
        switch (inpt.getAttribute('data-filter')) {
          case 'fullName':
            filteredStudents = filteredStudents.filter(stud => {
              if (`${stud.lastName} ${stud.name} ${stud.patronymic}`.toLowerCase().includes(inpt.value.toLowerCase())) return inpt;
            })
            break;
          case 'faculty':
            filteredStudents = filteredStudents.filter((stud) => {
              if (`${stud.faculty}`.toLowerCase().includes(inpt.value.toLowerCase())) return inpt;
            })
            break;
          case 'startEducation':
            filteredStudents = filteredStudents.filter((stud) => {
              if (`${stud.startEducation}` === inpt.value) return inpt;
            })
            break;
          case 'endEducation':
            filteredStudents = filteredStudents.filter((stud) => {
              if (`${parseInt(stud.startEducation) + 4}` === inpt.value) return inpt;
            })
            break;
        }
      }
    })
    createTable(filteredStudents);
  })
})




