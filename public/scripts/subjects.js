import { setData } from './setData.js';
import { setTeacher } from './setTeacher.js';

let table;
let rowIndex = 0;
let modalData = null;

function initTable(data, columns) {
  $(document).ready(function() {
    table = $('#example').DataTable({
      // данные
      data: data,
      dom: 'Bfrtip',
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      bAutoWidth: false, 
      select: true,
      columns : columns,
      // кнопка для скачивания в excel
      buttons: [{
        'extend': 'excel',
        text: 'Скачать excel',
        className: 'exportExcel',
        filename: 'list',
        title: null,
        createEmptyCells: true,
        exportOptions: {
          modifier: {
            page: 'all'
          },
          format: {
            body: function ( data ) {
              return `${data}`.split(' ').join('\r\n') 
            }
        }
        },
      }],
      // перевод
      "language": {
        "lengthMenu": "Показать _MENU_ студентов на странице",
        "zeroRecords": "Ничего не найдено - sorry",
        "info": "Показать страницу _PAGE_ из _PAGES_",
        "infoEmpty": "Нет доступных записей",
        "infoFiltered": "(отфильтровано из _MAX_ всех записей)"
      },
    });

    // выбор ячейки и строки
    $('#example tbody').on( 'click', 'td', function () {
      let cell = table.cell( this );
      let cellData = cell.data();
      rowIndex = cell[0][0].row;
      let cellIndex = cell[0][0].column;
      setTeacher(modalData[rowIndex])
      console.log(cellIndex)
    });
    table.on( 'select', function ( e, dt, type, indexes ) {
        let rowData = table.rows( indexes ).data().toArray();
    })

    $('a.toggle-vis').on( 'click', function (e) {
      e.preventDefault();
      e.target.classList.toggle('selected')
      // Get the column API object
      let column = table.column( $(this).attr('data-column') );

      // Toggle the visibility
      column.visible( ! column.visible() );
    });

    saveDataModal.addEventListener('click', () => saveData(data, rowIndex))
  });
}

function saveData(data, rowIndex) {
  let teacher = selectTeacher.value;
  let modeWork = [...selectModeWork.querySelectorAll('input:checked')].map(x => x.value);
  console.log(modeWork)
  if (modeWork.includes('lecture')) {
    data[rowIndex][26] = teacher
    modalData[rowIndex].lectureValue = true
  }
  if (modeWork.includes('laboratory')) {
    data[rowIndex][27] = teacher
    modalData[rowIndex].laboratoryValue = true
  }
  if (modeWork.includes('practise')) {
    data[rowIndex][28] = teacher
    modalData[rowIndex].practiseValue = true
  }
  closeModal.click()
  table.clear();
  table.rows.add(data);
  table.draw();
}

export function subjects() {
  $(document).ready(function(){
    $("#fileUploader").change(function(evt){
          let selectedFile = evt.target.files[0];
          let reader = new FileReader();
          $(this).hide();
          reader.onload = function(event) {
            let data = event.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });

            let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
            let [dataTable, columns, typesValue] = setData(XL_row_object);
            modalData = typesValue
            initTable(dataTable, columns);

          };
          reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
          };
          reader.readAsBinaryString(selectedFile);
    });
  });
}