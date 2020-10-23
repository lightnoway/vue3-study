
/**
 * 将 obj 转换成响应式对象,即get，set其属性时，都会拦截处理：
 * - get 收集依赖
 * - set 值改变时触发 该访问值对应的回调通知
 * - delete 删掉已存在值时 触发 该访问值对应的回调通知
 *      - [ ] 补充例子
 * @param {*} obj 
 */
export function reactive(obj) {
    //todo 考虑 isObject, 被reactive处理过
    const ret = new Proxy(obj, {
        get(target, propertyKey, receiver) {
            track(target, propertyKey);
            const ret = Reflect.get(target, propertyKey, receiver);
            if (isObject(ret)) {
                //todo 考虑缓存
                return reactive(target);
            }
            return ret

        },
        set(target, propertyKey, value, receiver) {
            const oldValue = target[propertyKey];
            const ret = Reflect.set(target, propertyKey, value, receiver);
            if (oldValue !== value) {
                //todo 考虑 NAN
                trigger(target, propertyKey);
            }
            return ret;
        },
        deleteProperty(target, propertyKey) {
            const ret = Reflect.deleteProperty(target, propertyKey);//参考mdn delete 只在 hasOwnProperty&& non-configure 时返回false
            if (ret && target.hasOwnProperty(propertyKey)) {
                trigger(target, propertyKey);
            }
            return ret;
        }
    })

    return ret;

};

let activeEffectFn = null;
/**
 * 用来建立 effectFn 与 其内部 target,properKey 访问的关联
 * 功能拆分: 
 *  effect 建立上下文activeEffectFn
 *  执行 get target.properKey 时, 收集依赖
 * @param {*} effectFn 
 */
export function effect(effectFn) {
    activeEffectFn = effectFn;
    effectFn();
    activeEffectFn = null;
};

function track(target, properKey) {
    if (!activeEffectFn) return;
    addDep(target, properKey, activeEffectFn);
}

function trigger(target, properKey) {
    for (const fn of getDep(target, properKey) || []) {
        fn();
    }
}

//依赖存取
const targetDepMap = new WeakMap();
function addDep(target, propertyKey, effectFn) {
    /**
     * @type Map
     */
    let properMap = targetDepMap.get(target);
    if (!properMap) {
        properMap = new Map();
        targetDepMap.set(target, properMap);
    }
    /**
     * @type Set
     */
    let effectSet = properMap.get(propertyKey);
    if (!effectSet) {
        effectSet = new Set();
        properMap.set(propertyKey, effectSet);

    }
    effectSet.add(effectFn);
}
function getDep(target, propertyKey) {
    const properMap = targetDepMap.get(target);
    if (!properMap) return;
    return properMap.get(propertyKey);
}


/**
 * 
 * 
 * 
 考虑 新增属性场景： 收集依赖时 访问 proxy.a ,但此时无a ，后proxy.a = 1 此时如何响应
 - 如果依赖收集与是否有值无关，则无值与有值情况一致
 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

//工具函数
function isObject(target) {
    return target !== null && typeof (target) === 'object';
}

function convert(target) {
    return isObject(target) ? reactive(target) : target;
}