import $ from 'jquery';

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
function parseOptions($table, _opt) {
    let _options = {},
        _s = $.trim($table.attr('data-download-options'));
    if (_s) {
        if (_s.substring(0, 1) != '{') {
            _s = '{' + _s + '}';
        }
        _options = (new Function('return ' + _s))();
    }
    return $.extend(true, {}, _options, _opt);
}

/**
 * 解析表格Html代码
 * @author Say
 * @date 2017年11月15日
 * @return
 */
function parseHtml($table, _opt) {
    let _options = parseOptions($table, _opt);
    return {
        html: $table.clone().removeAttr('class').removeAttr('style').find('tr:first').before(function() {
            let _title = '';
            if (typeof _options.title == 'undefined') {
                return _title;
            }
            let _colspan = 0;
            $(this).find('th,td').each(function() {
                _colspan += parseInt($(this).attr('colspan') || 1);
            });
            if (_colspan) {
                var __title = _options.title;
                if (!$.isArray(__title)) {
                    __title = [__title];
                }
                $.each(__title, function(t, ti) {
                    _title += '<tr><th' + (_styles['th'] ? (' style="' + _styles['th'] + '"') : '') + (_colspan > 1 ? (' colspan="' + _colspan + '"') : '') + '>' + ti + '</th></tr>';
                });
            }
            return _title;
        }).end().find('*').removeAttr('class').removeAttr('style').end().find('td,th').each(function() {
            $(this).attr('style', _styles[this.nodeName.toLocaleLowerCase()]).html($(this).text());
        }).end().prop('outerHTML'),
        fileName: _options.fileName
    };
}

export default (_opt = {}) => {
    let $tables = $('table[data-download-options]', this.$el),
        _fileName,
        _html = '';

    // 指令传入配置项
    if (_opt.tables && _opt.refs) {
        $.each(_opt.tables, function(i, e) {
            let id = e,
                title;
            if (Object.prototype.toString.call(id) == '[object Object]') {
                id = e.id;
                title = e.title;
            }
            let table = _opt.refs[id];
            if (!table) {
                return true;
            }
            let obj = parseHtml($(table), $.extend(true, {}, _opt, {
                title
            }));
            _html += obj.html;
            _fileName = obj.fileName;
        });
    } else {
        $tables.each(function(i, table) {
            let $table = $(table),
                obj = parseHtml($(table), _opt);
            _html += obj.html;
            _fileName = obj.fileName;
        });
    }
    _opt.fileName = _fileName;
    console.log(_opt);
    _opt.submit(_opt, _html);
};