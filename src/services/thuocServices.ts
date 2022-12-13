import axios from "axios";

class _SHEET_SERVICE {
    public finalDanhSachThuoc
    constructor(public GOOGLE_SHEET_DETAIL: any) {
    }
    public async start() {
        this.finalDanhSachThuoc = await this.getColumnValueToArrayJson(`https://docs.google.com/spreadsheets/d/${this.GOOGLE_SHEET_DETAIL.id}/gviz/tq?tqx=out:json&gid=${this.GOOGLE_SHEET_DETAIL.s_drugs}`)

        console.log(this.finalDanhSachThuoc)
    }
    async getColumnValueToArrayJson(url: string) {
        const finalArrayOfCol_Val = <any>[]
        await axios.get(url)
            .then((res) => {
                // console.log(res)
                //remove Google.query.. jsonp
                const pattern = /\(\{.*\}\)/g;
                let res1 = res.data.match(pattern)[0]
                // console.log(res1)
                res1 = JSON.parse(res1.substring(1, res1.length - 1))
                // JSON của file excel
                // console.log(res1)
                // Xử lý file để lấy dạng {Column : Value}
                const res2 = res1.table.rows.map((value, index1) => {
                    // console.log(value.c)
                    const column_Value_Pair = {}
                    value.c.map((val2, ind2) => {
                        // console.log(val2)
                        Object.defineProperty(column_Value_Pair, res1.table.cols[ind2].label, {
                            value: val2 ? val2.v : null
                        });
                    })
                    /* Recap the ID of  finalDanhSachThuoc*/
                    Object.defineProperty(column_Value_Pair, "index", {
                        value: index1
                    });
                    finalArrayOfCol_Val.push(column_Value_Pair)
                })
                // console.log(finalArrayOfCol_Val)
            }).catch(err => {
                console.error(err)
            })
        return finalArrayOfCol_Val
    }
}
const mydate = new _SHEET_SERVICE({
    id: '1Zp_2TKwmprVBB0f1HZY3yBXef3G67QQ_0alWu5z0awk',
    s_drugs: '2045753438'
})
export default mydate