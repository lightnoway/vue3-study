# vue3-study
vue3 学习， 原理demo， 一些基础设施的尝试
- vue3 采用monorepo方式组织代码，将功能拆分成内聚的几个repo,每个repo可以独立使用，比如响应式(`@vue/reactivity/`)
- vue3 使用 ts 实现 ，可以此练习ts


### 相应式
场景
- 数据改变时，绑定该数据的视图自动改变

原理
- 数据与回调间有依赖关系
    - 执行回调时，依赖/get 数据
    - 数据改变时，执行回调

#### 实现
数据结构
- 依赖存储
    - 接口
        - set(target,propname,callback)
        - get(target,propname)
    - 数据
        - WeekMap targetMap:
            - any key: target
            - Map value: 
                - str key: propname
                - Set value: 
                    - fn item: callback

执行过程
- 依赖收集
- 数据改变执行回调


上手策略
- 观察api 
- 看源码，理解
    - 核心 ~ 外围
    - 底层 ~ 高级应用
- 将理解实现

