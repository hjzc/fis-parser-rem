'use strict';

// standard example, require character ; after each line 
// style: attr; /* norem */
var styleExpr = /[\s{](-webkit-|-ms-|-moz-|-o-)?([\w\-]+?)\s*?:\s*?[^{;]+?;(\s*?\/\*[^\/]*?\*\/)?/g;

var entry = module.exports = function(content, file, conf){
    var excludeMap = {};
    conf.exclude.map(function(item) {
        excludeMap[item] = true;
    });

    if (content.match(/^\s*\/\*([^\/]+)\*\//) && RegExp.$1.match(/@norem\b/)) {
        // ignore file
        return content;
    }
    return content.replace(styleExpr, function(str, prefix, name, cmt) {
        prefix = prefix || '';
        cmt = cmt || '';
        if (!excludeMap[name] && !excludeMap[prefix + name] 
            && !cmt.match(/@norem\b/) 
                || cmt.match(/@rem\b/)
        ) {
            return str.replace(/\b([\d\.]+)px\b/g, function(s, px) {
                px = +px;
                if (px >= conf.min) {
                    return (px / conf.rem + 0.0001).toFixed(4) + 'rem';
                }
                return s;
            });
        }
        return str;
    });
};

entry.defaultOptions = {
    rem: 18, // 1rem=n px

    min: 3, // 最小值

    exclude: ['width', 'height', 'background', 'background-size'] // 忽略的样式
};

