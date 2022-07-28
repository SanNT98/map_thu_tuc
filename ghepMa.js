
const request = require(`request`)
const cheerio = require(`cheerio`)
const fs = require('fs')

const XLSX = require('xlsx');

const workbook = XLSX.readFile('./PTO theo don vi.xls');
const sheetsName = workbook.SheetNames
const worksheet = workbook.Sheets[sheetsName]
const temp = XLSX.utils.sheet_to_json(worksheet)

temp.forEach((i, index)=>{
    setTimeout(() => {
        getCode(i.TEN_THU_TUC).then(result => {
            if(result.length > 0 && result[0].similarity > 0.8){
                i.MA = result[0].ma
                i.NAME = result[0].name
            }
            console.log(`Done ${index}`)
            fs.appendFileSync("ketqua.csv", [i.TEN_CO_QUAN,i.MA_THU_TUC,i.TEN_TAT,i.TRANG_THAI_TT, i.MAP, i.TEN_THU_TUC, i.RNUM, i.MA, i.NAME].join("|") +"\n")
        }).catch(console.log)
    }, index*500)
})   
// var data = "a";
// column.forEach((i, index)=>{fs.appendFileSync("dvcqg.txt", data +" "+index +"\n")})



// getCode(`Cấp đổi Giấy chứng nhận đủ điều kiện về an ninh, trật tự để làm ngành, nghề đầu tư kinh doanh có điều kiện
// `).then(console.log).catch(console.log)

function getCode(text) {
    text = text.trim().replace(/[&\/\\#,+()$~%.'":*?<>{};]/g, '')
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
                Cookie: `TS01c03a4c=01f551f5ee26454bab370532906a572a9927968f1defc4d1732c3161d344918488321d0a1037038efbba0cc5eca0eea8b59c67db94; JSESSIONID=E3B9A03D4DDA27F5D0F2FF1A22DE24EF; TS0115bee1=01f551f5ee26454bab370532906a572a9927968f1defc4d1732c3161d344918488321d0a1037038efbba0cc5eca0eea8b59c67db94; route=1658980990.376.10674.840988`
            }
        }, (error, header, body) => {
            if (error) {
                reject(error)
            } else {
                const $ = cheerio.load(body)
                let result = []
                $("tr").each((index, item) => {
                    if(index!= 0){
                        let ma = $($(item).find('td')[1]).find('a.bold.status').text().trim()
                        let name = $($(item).find('td')[1]).text().trim().replace(/\t/g, '').replace(/\n/g, '').replace(ma, '')
                        result.push({ma, name, similarity: similarity(text, name.replace(" (cấp địa phương)", ""))})
                    }
                })
                resolve(result.sort((a,b) => b.similarity - a.similarity))
            }
        })
    })
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }