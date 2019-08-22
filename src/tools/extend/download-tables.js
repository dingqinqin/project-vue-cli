import $ from 'jquery';
import tableDownload from './download-table.js';
import dataDownload from './download-data.js';
import elementTableDownload from './download-element.js';

function bindData(el, binding) {
    let $but = $(el);
    $but.unbind().bind('click.download', function () {
        let _options = binding.value;
        // 按钮 loading
        $but.trigger('blur').addClass('is-loading').prepend(function (index, html) {
            let $icon = $(this).find('[class*="el-icon"]:eq(0)');
            if ($icon.length > 0) {
                $icon.data('class', $icon.attr('class')).attr('class', 'el-icon-loading');
            } else {
                return '<i class="el-icon-loading"></i>';
            }
        });
        // 按钮停止loading
        _options.unloading = () => {
            $but.removeClass('is-loading').find('[class*="el-icon"]:eq(0)').each(function () {
                if ($(this).data('class')) {
                    $(this).attr('class', $(this).data('class'));
                } else {
                    $(this).remove();
                }
            });
        }
        // 提交下载表格
        _options.submit = (_opt, _html) => {
            $('<form/>', {
                method: 'post',
                action: window.ShiYue.base + '/api/base/common/table2xls',
                'class': 'table2xls',
                css: {
                    position: 'absolute',
                    top: '-1000px',
                    display: 'none'
                }
            }).append($('<input/>', {
                type: 'hidden',
                name: 'title',
                val: (_opt.fileName || '下载')
            })).append($('<textarea/>', {
                name: 'data',
                val: _html,
                css: {
                    display: 'none'
                }
            })).appendTo($('body').find('.table2xls').remove().end()).submit().remove().end().each(function () {
                setTimeout(function () {
                    _options.unloading();
                }, 800);
            });
        }
        // 数据表格
        if (_options.data) {
            dataDownload($.extend(true, {}, _options, {
                $but
            }));
            return false;
        } else {
            if (!_options || (!_options.table && (!_options.refs))) {
                $but.unbind();
                return false;
            }
            let _tables = _options.tables,
                _refs = _options.refs;
            if (typeof _tables == 'undefined') {
                _tables = [];
                for (let key in _refs) {
                    if (key && key.indexOf('element-table-download') != -1) {
                        _tables.push(key);
                    }
                }
                _options.tables = _tables;
            }
            if (!_tables) {
                $but.unbind();
                return false;
            }
            if (typeof _tables == 'string') {
                _options.tables = [_tables];
                _tables = _options.tables;
            }
            if (!_options.table && !$.isArray(_tables)) {
                $but.unbind();
                return false;
            }
            // 非element表格
            if (_options.table) {
                tableDownload($.extend(true, {}, _options, {
                    $but
                }));
                return false;
            }
            // 默认为element表格下载
            elementTableDownload($.extend(true, {}, _options, {
                $but
            }), _refs, _tables);
        }
    });
}

export default {
    bind(el, binding) {
        bindData(el, binding);
    },
    update(el, binding) {
        let $but = $(el);
        $but.unbind();
        bindData(el, binding);
    }
};