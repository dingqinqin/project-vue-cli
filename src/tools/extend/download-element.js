let _styles = {
    td: 'text-align: center;',
    th: 'text-align: center;font-weight: bold;'
};

/**
 * 解析表格上的options属性
 * @author Say
 * @date 2017年11月15日
 * @return
 */
function parseOptions($table) {
    let _options = {},
        _s = $.trim($table.attr('data-download-options'));
    if (_s) {
        if (_s.substring(0, 1) != '{') {
            _s = '{' + _s + '}';
        }
        _options = (new Function('return ' + _s))();
    }
    return _options;
}

function parseHtml(_refs, _tables) {
    let _html = '';
    $.each(_tables, function (i, e) {
        var id = e,
            title;
        if (Object.prototype.toString.call(id) == '[object Object]') {
            id = e.id;
            title = e.title;
        }
        let _table = _refs[id];
        if (_table && $.isArray(_table)) {
            _table = _table[0];
        }
        if (!_table || _table.$options._componentTag != 'el-table' || !_table.$el) {
            return true;
        }
        let $el = $(_table.$el);
        let _options = parseOptions($el);
        if (_options && typeof _options.title != 'undefined') {
            title = _options.title;
        }
        let $body = $el.find('.el-table__body-wrapper .el-table__body:eq(0)').clone().find('colgroup,.gutter').remove().end();
        let $head = $el.find('.el-table__header-wrapper .el-table__header:eq(0)').clone().find('colgroup,.gutter').remove().end();
        if ($head.length > 0) {
            $body.find('tbody').before($head.find('thead').prop('outerHTML'));
        }
        _html += $body.find('td,th').removeAttr('class').each(function (j, l) {
            let _nodeName = this.nodeName.toLocaleLowerCase(),
                _colspan = parseInt($(this).attr('colspan') || 0),
                _rowspan = parseInt($(this).attr('rowspan') || 0);
            $(this).replaceWith('<' + _nodeName + (_styles[_nodeName] ? (' style="' + _styles[_nodeName] + '"') : '') + (_colspan > 1 ? (' colspan="' + _colspan + '"') : '') + (_rowspan > 1 ? (' rowspan="' + _rowspan + '"') : '') + '>' + $.trim($(this).text()) + '</' + _nodeName + '>')
        }).end().find('tr').removeAttr('class').end().removeAttr('class').find('tr:first').before(function () {
            var _colspan = 0,
                _title = '';
            $(this).find('th,td').each(function () {
                _colspan += parseInt($(this).attr('colspan') || 1);
            });
            if (_colspan && title) {
                if (!$.isArray(title)) {
                    title = [title];
                }
                $.each(title, function (t, ti) {
                    _title += '<tr><th ' + (_styles['th'] ? (' style="' + _styles['th'] + '"') : '') + (_colspan > 1 ? (' colspan="' + _colspan + '"') : '') + '>' + ti + '</th></tr>';
                });
            }
            return _title;
        }).end().prop('outerHTML');
    });
    return _html;
}

export default (_opt = {}, _refs, _tables) => {
    // 下载elment表格
    _opt.submit(_opt, parseHtml(_refs, _tables));
}