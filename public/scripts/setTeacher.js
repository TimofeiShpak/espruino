export function setTeacher(type) {
  modalTitle.innerText = `Назначить ${type.title}`
  modalTeacher.classList.toggle('hide');
  let html = ''
  if (type.lecture) {
    if (type.lectureValue) {
      html += '<input type="checkbox" value="lecture" disabled checked><label>лекции</label>'
    } else {
      html += '<input type="checkbox" value="lecture"><label>лекции</label>'
    }
  }
  if (type.laboratory) {
    if (type.laboratoryValue) {
      html += '<input type="checkbox" value="laboratory" disabled checked><label>Лабораторные работы</label>'
    } else { 
      html += '<input type="checkbox" value="laboratory"><label>Лабораторные работы</label>'
    }
  }
  if (type.practise) {
    if (type.practiseValue) {
      html += '<input type="checkbox" value="practise" disabled checked><label>практика</label>'
    } else { 
      html += '<input type="checkbox" value="practise"><label>практика</label>'
    }
  }
  selectModeWork.innerHTML = html;
}