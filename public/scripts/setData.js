import { titles, typeNames, teachers } from '../constants/constants.js'

let typesValue = [];

export function setData(value) {
  let allValues = value.map(x => Object.values(x))
  let startIndex = allValues.findIndex(x => {
    return Array.isArray(x) && x.find(value => typeof value === 'string' && value.includes('Блок 1 Дисциплины (модули)'))
  });
  let endIndex = allValues.findIndex(x => {
    return Array.isArray(x) && x.find(value => typeof value === 'string' && value.includes('Всего отчетностей'))
  });

  let subjectsValue = value.slice(startIndex, endIndex).map(x => {
    let indexes = Object.keys(x);
    let arr = [];
    for (let i = 0; i < indexes.length; i++) {
        let index = +(indexes[i].replace('__EMPTY_', ''));
        if (index) {
          arr[index] = `${x[indexes[i]]}`.replace(/^\//, '');
        }  else {
          arr[0] = `${x[indexes[i]]}`.replace(/^\//, '');
        }
    }
    return arr
  })
  
  let types = {};
  let preparedValue = subjectsValue.filter((x,i) => {
    if (!types[x[1]]) {
      types[x[1]] = x[1];
      if (i !== subjectsValue.length - 1 && subjectsValue[i+1][1] === x[1]) {
        return false;
      }
    }
    return (x[2] || x[3] || x[4] || x[5] || x[6] || x[7])
  })
  preparedValue.forEach((x, i) => {
    let indexType = x.slice(2, 5).findIndex(y => !!y);
    let type = `${x[1].trim()}-${typeNames[indexType]}`;
    let workModes = x.slice(10, 13);
    typesValue[i] = {};
    if (workModes[0]) {
      typesValue[i].lecture = true
    }
    if (workModes[1]) {
      typesValue[i].laboratory = true
    }
    if (workModes[2]) {
      typesValue[i].practise = true
    }
    typesValue[i].title = type;
  })
  let [data, columns] = fillEmptyCell(preparedValue);
  return [data, columns, typesValue];
}

function fillEmptyCell(data) {
  for(let i = 0; i < data.length; i++) {
    for (let j = 0; j < titles.length; j++) { 
      if (!data[i][j]) {
        data[i][j] = '-';
      }
    }
  }
  let columns = []
  for (let i = 0; i < titles.length; i++) {
    columns.push({ title: titles[i] || `${i+1} - столбец` });
  }
  initVisibleMenu()
  initModal()
  return [data, columns];
}

function initVisibleMenu() {
  let items = [];
  for (let i = 0; i < titles.length; i++) {
    items.push(`<a class="toggle-vis" data-column="${i}">${titles[i]}</a> `)
  }
  tableVisibleMenu.innerHTML = '<div>Нажмите на название чтоб изменить видимость столбцов: ' + items.join(' - ') + '</div> ';
}

function initModal() {
  selectTeacher.innerHTML = teachers.map(x => `<option value="${x.name}">${x.name}</option>`);
  closeModal.addEventListener('click', () => modalTeacher.classList.toggle('hide'));
}