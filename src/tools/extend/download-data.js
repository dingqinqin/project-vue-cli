// 根据数据构建dom结构字符串
// 2019-03-18
// 数据机构解析
/* 
* datas : {
    thead: [
        [{id: 'h1', name: '', clospan: 1, rowspan: 1}],
        [{id: 'h2', name: '', clospan: 1, rowspan: 1}]
    ],
    tbody: [{h1: '', h2: ''}],
    title: '', // 表格第一行文字
    fileName： '' // 文件名
}
*注意：*******************************************************
*   不支持表格内部有跨行跨列的
*   Harry
*/
let _styles = {
    td: 'text-align: center;',
    th: 'text-align: center;font-weight: bold;'
};
function parseHtml(thead, tbody, title, dataThead) {
    let theadHtml = ``,
        tbodyHtml = ``,
        maxCols = 0,
        headerCol = [];
    // 循环生成表头
    if (thead && thead[0]) {
        for (let i = 0; i < thead.length; i++) {
            let _colHtml = ``;
            let rows = false;
            for (let s = 0; s < thead[i].length; s++) {
                if (i === 0) {// 第一行
                    maxCols = maxCols + thead[i][s].colspan * 1;
                    if (thead[i][s].rowspan > 1) {
                        rows = true;
                    }
                }
                if ((thead[i][s].colspan == 1 && !rows) || (thead[i][s].rowspan > 1 && thead[i][s].colspan == 1)) {
                    headerCol.push(thead[i][s])
                }
                _colHtml = _colHtml + `<th colspan="${thead[i][s].colspan}" rowspan="${thead[i][s].rowspan}" style="${_styles.th}">${thead[i][s].name}</th>`
            }
            theadHtml = theadHtml + `<tr>${_colHtml}</tr>`
        }
    } else {
        return ``
    }
    if (title) {
        theadHtml = `<tr><th colspan="${maxCols}" style="${_styles.th}">${title}</th></tr>` + theadHtml;
    }
    // 数据列顺序
    if (dataThead){
        headerCol = dataThead;
    }
    // 循环生成表格内部数据
    if (tbody){
        for (let a = 0; a < tbody.length; a++) {
            let _rowHtml = '';
            for (let q = 0; q < headerCol.length; q++) {
                _rowHtml = _rowHtml + `<td style="${_styles.td}">${tbody[a][headerCol[q].id] || ''}</td>`
            }
            tbodyHtml = tbodyHtml + `<tr>${_rowHtml}</tr>`
        }
    }
    console.log('本次下载表格首行文字：', title);
    console.log('本次下载表格总列数：', maxCols);
    console.log('本次下载表格总行数：', tbody.length);
    return `
        <table>
            <thead>
                ${theadHtml}
            </thead>
            <tbody>
                ${tbodyHtml}
            </tbody>
        </table>
    `
}
export default (_opt = {}) => {
    console.log(_opt);
    console.log('本次下载表格文件名：', _opt.datas.fileName);
    if(_opt.datas){
        _opt.fileName = _opt.datas.fileName;
    }
    let _html = '';
    if (_opt.datas.multiple){
        if (_opt.datas.tbody){
            for (let a = 0; a < _opt.datas.tbody.length; a++) {
                _html = _html + parseHtml(_opt.datas.tbody[a].thead || _opt.datas.thead, _opt.datas.tbody[a].tbody, _opt.datas.tbody[a].title || _opt.datas.title, _opt.datas.tbody[a].dataThead);
            }
        }
    }else{
        _html = parseHtml(_opt.datas.thead, _opt.datas.tbody, _opt.datas.title, _opt.datas.dataThead);
    }
    if (_html){
        _opt.submit(_opt, _html);
    }else{
        _opt.unloading();
    }
}