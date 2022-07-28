
const request = require(`request`)
const cheerio = require(`cheerio`)
const fs = require('fs')

getCode(`Cấp đổi Giấy chứng nhận đủ điều kiện về an ninh, trật tự để làm ngành, nghề đầu tư kinh doanh có điều kiện`).then(console.log).catch(console.log)

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
                Cookie: `TS01c03a4c=01f551f5eefe747b31db1a7a51c8d3b14384b3e821defeffabd61c63a30e8cb96a95d4c70d271d075ec15fd570648d85ed2392dadf; JSESSIONID=D8C8259886A1E40D7FEF0FB898F0AD0B; route=1642038533.948.27533.630201; TS0115bee1=01f551f5ee8cddf4886aa768af410733bbd6addfff68ad55026c1e45a9b94ea5f34cf0b06b6133f6f629def9e32b3c0ce551777f0d; TSab2960aa027=085b7f7344ab2000d592ab4e085c2b010a3f5318da23a464efff0ba8a8be98ffa1fe26293a6caf4608672bb66d1130003955f47f54dd0c72015ed287128f478de05a3d499e13421dc57e5240be9e92e11f4e9617ccd7b3abb9f68bba673742f0`
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