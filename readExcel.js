
const XLSX = require('xlsx');
const fs = require('fs')
const workbook = XLSX.readFile('./PTO theo don vi.xls');
const sheetsName = workbook.SheetNames
const worksheet = workbook.Sheets[sheetsName]

let column = []
// console.log(worksheet)  

   const temp = XLSX.utils.sheet_to_json(worksheet)
   temp.forEach((res) => {
       let data = {name:res.TEN_THU_TUC, id:res.MA_THU_TUC, dvcqg:''};
       
      column.push(data)
   })

   let text = column.join('\n');

   

   // console.log(column)
