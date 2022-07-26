
const request = require(`request`)
const cheerio = require(`cheerio`)
const fs = require('fs')

const XLSX = require('xlsx');

const workbook = XLSX.readFile('./PTO theo don vi.xls');
const sheetsName = workbook.SheetNames
const worksheet = workbook.Sheets[sheetsName]
let column = [{}]
const temp = XLSX.utils.sheet_to_json(worksheet)
   temp.forEach((res) => {
       let data = {name:res.TEN_THU_TUC, id:res.MA_THU_TUC, dvcqg:''};
       column.push(data)
   })

column.forEach((i)=>{
    i.dvcqg = getCode(`${i.name}`).then(console.log).catch(console.log)
})   
// var data = "a";
// column.forEach((i, index)=>{fs.appendFileSync("dvcqg.txt", data +" "+index +"\n")})



// getCode(`Cấp đổi Giấy chứng nhận đủ điều kiện về an ninh, trật tự để làm ngành, nghề đầu tư kinh doanh có điều kiện
// `).then(console.log).catch(console.log)

function getCode(text) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://csdl.dichvucong.gov.vn/web/mtv/thu_tuc_hanh_chinh/danh_sach_tthc/ajax_index`,
            qs: {
                crud: `ve`,
                page: 1,
                pageLength: 10,
                searchTerm: `{"maTen":"${text}","linhVucId":null,"doiTuongId":null,"coQuanThucHienId":null,"capThucHienId":"","quyetDinhCongBo":"","suKienId":null,"coQuanCongBoId":null,"ngayQuyetDinh":"","tinhTrangId":"","loaiId":"","suDung":"1"}`
            },
            method: "POST",
            headers: {
                Cookie: `TS01c03a4c=01f551f5ee70c7bedfd9f2d1a6fd389c80a4a4c12da8bc734948bc6c30e62c8743d5cee1e702d9ded929de74450cde6b42b4b4b996; JSESSIONID=3F16781917E88E8167488FFFFFE84678; route=1658712651.485.8329.656678; TS0115bee1=01f551f5ee7ad77c614483b2d180fac4ec0302834fe70b1d2777dc2274e5a4e1ca4dec9c896d1042d012a49c536324102604fd8a48`
            }
        }, (error, header, body) => {
            if (error) {
                reject(error)
            } else {
                const $ = cheerio.load(body)
                resolve($('a.bold.status').text().trim())
            }
        })
    })
}