import store from '../../store'
import Config from '../../common/js/Config.js'
/**
 * 缓存数据优化
 * 使用方法 【
 *     一、设置缓存
 *         string    cache.put('k', 'string你好啊');
 *         json      cache.put('k', { "b": "3" }, 2);
 *         array     cache.put('k', [1, 2, 3]);
 *         boolean   cache.put('k', true);
 *     二、读取缓存
 *         默认值    cache.get('k')
 *         string    cache.get('k', '你好')
 *         json      cache.get('k', { "a": "1" })
 *     三、移除/清理
 *         移除: cache.remove('k');
 *         清理：cache.clear();
 * 】
 * @type {String}
 */
var postfix = '_youxuanMall'; // 缓存前缀
/**
 * 设置缓存
 * @param  {[type]} k [键名]
 * @param  {[type]} v [键值]
 * @param  {[type]} t [时间、单位秒]
 */
function put(k, v, t) {
    let DEBUG = Config.DEBUG?'DEBUG_': ''
    let postfix_key = store.state.globalI + '_' +DEBUG + k + postfix
    k = store.state.globalI +'_'+DEBUG+ k
    uni.setStorageSync(k, v)
    var seconds = parseInt(t);
    if (seconds > 0) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000 + seconds;
        uni.setStorageSync(postfix_key, timestamp + "")
    } else {
        uni.removeStorageSync(postfix_key)
    }
}


/**
 * 获取缓存
 * @param  {[type]} k   [键名]
 * @param  {[type]} def [获取为空时默认]
 */
function get(k, def) {
    let DEBUG = Config.DEBUG?'DEBUG_': ''
    let postfix_key = store.state.globalI + '_' +DEBUG + k + postfix
    k = store.state.globalI +'_'+DEBUG+ k
    var deadtime = parseInt(uni.getStorageSync(postfix_key)) || 1
    if (deadtime) {
        if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
            if (def) {
                return def;
            } else if (def === false) {
                return false
            } else {
                return undefined
            }
        }
    }
    var res = uni.getStorageSync(k);
    if (res) {
        return res;
    } else {
        if (def == undefined  || def == "") {
            def = false;
        }
        return def;
    }
}

function remove(k) {
    let DEBUG = Config.DEBUG?'DEBUG_': ''
    let postfix_key = store.state.globalI + '_' +DEBUG + k + postfix
    console.log(postfix_key)
    uni.removeStorageSync(postfix_key);
}

/**
 * 清理所有缓存
 * @return {[type]} [description]
 */
function clear() {
    uni.clearStorageSync();
}


module.exports = {
    put: put,
    get: get,
    remove: remove,
    clear: clear,
}
