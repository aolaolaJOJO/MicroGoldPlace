;(function (w) {
    var wwhm = function(){};

    wwhm.prototype = {
        /*扩展功能  将source里的功能拷贝到target里*/
        extend: function (target, source) {
            for (var k in source) {
                target[k] = source[k];
            }
            return target;
        },
        elements :""
    };

    var $$ = new wwhm();
    //获取dom元素节点
    $$.extend($$, {
        /* 获取ID*/
        $id: function (id) {
            this.element = document.getElementById(id);
            return this;
        },
        /*获取标签名*/
        $tag: function (tag, id) {
            //通过getDom判断并获得id
            var dom = getDom(id);
            var eles = getEle(dom, tag);
            return eles;
            /*子函数*/
            /*第一步 获取容器id */
            function getDom(id) {
                //判断是否为字符串
                if ($$.isString(id)) {
                    return document.getElementById(id);
                }
                return id;
            };
            /*第二步 获取目标元素，判断从哪个容器里获得所有元素*/
            function getEle(eleId, tag) {
                //若存在id则从该id下获得元素
                if (eleId) {
                    return eleId.getElementsByTagName(tag);
                    //不存在id则获取所有tag元素
                } else {
                    return document.getElementsByTagName(tag);
                }
            }
        },
        /* 获取类名*/
        $class: function (classname, context) {
            var arr = [];
            //判断是否有id，有则直接用，没有则使用document
            var target = context ? context : document;
            //判断id：如果是dom元素，直接使用;如果是字符串，则进行获取
            context = $$.isString(context) ? $$.$id(context) : context;
            if (target.getElementsByClassName) {
                return target.getElementsByClassName(classname);
            }
            //获得所有标签，并遍历获得符合的类名
            var doms = target.getElementsByTagName("*");
            for (var i = 0; i < doms.length; i++) {
                if (doms[i].className && doms[i].className == classname) {
                    arr.push(doms[i]);
                }
            }
            return arr;
        },
        /*  $class: function (className, context) {
         var elements = [];
         var dom;
         //如果传递过来的是字符串 ，则转化成元素对象
         if ($$.isString(context)) {
         context = $$.$id(context);
         } else {
         context = document;
         }

         //如果兼容getElementsByClassName
         if (context.getElementsByClassName) {
         return context.getElementsByClassName(className);
         } else {
         //如果浏览器不支持
         dom = context.getElementsByTagName('*');
         for (var i, len = dom.length; i < len; i++) {
         if (dom[i].className && dom[i].className == className) {
         elements.push(dom[i]);
         }
         }
         }
         return elements;
         },*/
        $group: function (str) {
            //将获得的字符串转换成数组
            var arr = str.split(",");
            var result = [];
            //遍历转换后的选择器数组
            for (var i = 0, len = arr.length; i < len; i++) {
                //获得每个数组元素的首字符
                var first = arr[i].charAt(0);
                //每个首字符的索引号
                var index = arr[i].indexOf(first);
                //截取到每个数组元素的名称
                var name = arr[i].slice(index + 1);
                if (first == ".") {
                    var classArr = $$.$class(name);
                    for (var j = 0, myLen = classArr.length; j < myLen; j++) {
                        result.push(classArr[j]);
                    }
                } else if (first == "#") {
                    result.push($$.$id(name));
                } else {
                    var name = arr[i].slice(0);
                    var tagArr = $$.$tag(name);
                    console.log(tagArr);
                    for (var j = 0, myLen = tagArr.length; j < myLen; j++) {
                        result.push(tagArr[j]);
                    }
                }
            }
            return result;
        },
        //层次
        $level: function (select) {
            //个个击破法则 -- 寻找击破点
            var sel = $$.trim(select).split(' ');
            var result = [];
            var context = [];
            for (var i = 0, len = sel.length; i < len; i++) {
                result = [];
                var item = $$.trim(sel[i]);
                var first = sel[i].charAt(0)
                var index = item.indexOf(first)
                if (first === '#') {
                    //如果是#，找到该元素，
                    pushArray([$$.$id(item.slice(index + 1))]);
                    context = result;
                } else if (first === '.') {
                    //如果是.
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray($$.$class(item.slice(index + 1), context[j]));
                        }
                    } else {
                        pushArray($$.$class(item.slice(index + 1)));
                    }
                    context = result;
                } else {
                    //如果是标签
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray($$.$tag(item, context[j]));
                        }
                    } else {
                        pushArray($$.$tag(item));
                    }
                    context = result;
                }
            }
            return context;

            //封装重复的代码
            function pushArray(doms) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //多组加层次
        $select: function (str) {
            var result = [];
            var arr = str.split(",");
            for (var i = 0, len = arr.length; i < len; i++) {
                var context = [];
                var item = arr[i];
                context = $$.$level(item);
                pushArray(context);
            }
            return result;

            function pushArray(doms) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //H5新增选择器
        $all: function (str, context) {
            context = context || document;
            this.elements = context.querySelectorAll(str);
            return this;
        }
    });

//字符串相关操作
    $$.extend($$, {
        /*去除左边空格*/
        ltrim: function (str) {
            return str.replace(/(^\s*)/g, "");
        },
        /*去除右边空格*/
        rtrim: function (str) {
            return str.replace(/(\s*$)/g, "");
        },
        /*去除空格*/
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        /* 简单的数据绑定*/
        formateString: function (str, data) {
            return str.replace(/@\((\w+)\)/g, function (match, key) {
                return data[key];
            });
        }
    });

//检测数据类型相关
    $$.extend($$, {
        /*数据类型检测*/
        isNumber: function (val) {
            //isFinite判断是否是无穷
            return typeof val === "number" && isFinite(val);
        },
        isBoolean: function (val) {
            return typeof val === "boolean";
        },
        isString: function (val) {
            return typeof val === "string";
        },
        isUndefined: function (val) {
            return typeof val === "undefined";
        },
        isObj: function (obj) {
            if (obj === null || typeof obj === "undefined") {
                return false;
            }
            return typeof obj === "object";
        },
        isNull: function (val) {
            return val === null;
        },
        isArray: function (arr) {
            if (arr === null || typeof arr === "undefined") {
                return false;
            }
            return arr.constructor === Array;
        }
    })

//事件相关
    $$.extend($$, {
        /* 浏览器兼容监听事件 type事件 fn事件函数*/
        on: function (id, type, fn) {
            //获取id
            var dom = $$.isString(id) ? $$.$id(id) : id;
            //判断是否识别addEventListener
            if (dom.addEventListener) {
                //默认false 为冒泡  true为捕获
                dom.addEventListener(type, fn, false);
                // IE8- 浏览器
            } else if (dom.attachEvent) {
                //attachEvent里的事件写法是on开头的
                dom.attachEvent("on" + type, fn);
            }
        },
        /*解除绑定*/
        un: function (id, type, fn) {
            //var dom = document.getElementById(id);
            var dom = $$.isString(id) ? document.getElementById(id) : id;
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn);
            } else if (dom.detachEvent) {
                dom.detachEvent(type, fn);
            }
        },

        /*鼠标点击事件*/
        click: function (id, fn) {
            this.on(id, "click", fn);
        },
        /*鼠标移入*/
        mouseover: function (id, fn) {
            this.on(id, "mouseover", fn);
        },
        /*鼠标移出*/
        mouseout: function (id, fn) {
            this.on(id, "mouseout", fn);
        },
        /*鼠标悬浮*/
        hover: function (id, fnOver, fnOut) {
            if (fnOver) {
                this.on(id, "mouseover", fnOver);
            }
            if (fnOut) {
                this.on(id, "mouseout", fnOut);
            }
        },
        /*兼容IE  */
        getEvent: function (e) {
            return e ? e : window.event;
        },
        //兼容target写法
        getTarget: function (event) {
            var e = $$.getEvent(event);
            return e.target || e.srcElement;
        },
        /*兼容写法  阻止默认事件*/
        preventDefault: function (event) {
            var event = $$.getEvent(event);
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        /*兼容写法 阻止冒泡*/
        stopPropagation: function (event) {
            var event = $$.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancleBubble = true;
            }
        },
    });
//属性,dom操作
    $$.extend($$, {
        //context 需要操作的节点 key属性名称 value 属性值
        attr: function (key, value) {
            var doms = this.elements;
          /*  if (value) {
                for (var i = 0; i < doms.length; i++) {
                    doms[i].setAttribute(key, value);
                }
            } else {
                return doms[0].getAttribute(key);
            }*/
            for (var i = 0; i < doms.length; i++) {
                doms[i].setAttribute(key, value);
            }
            return this;
        },
        //显示
        show: function () {
            var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                doms[i].style.display = "block";
            }
            return this;
        },
        //隐藏
        hide: function () {
           var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                doms[i].style.display = "none";
            }
            return this;
        },
        /*样式操作*/
        css: function (key, value) {
            var doms = this.elements;
            // 首先判断是否有值传进来
            //有则为设置样式模式，没有则为获取样式模式
            for(var i = 0;i<doms.length;i++){
                setStyle(doms[i], key, value);
            }
            return this;
           /* return getStyle(doms[0], key);*/

            //获取模式
           /* function getStyle(dom, attr) {
                if (dom.currentStyle) {
                    return dom.currentStyle[attr];
                } else {
                    return getComputedStyle(dom, null)[attr];
                }
            }*/

            //设置模式
            function setStyle(dom, attr, value) {
                dom.style[attr] = value;
            }
        },
        //添加类
        addClass: function (classname) {
            var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                addOneClass(doms[i]);
            }
            function addOneClass(dom) {
                dom.className += " " + classname;
            }
            return this;
        },
        //移除类
        removeClass: function(classname) {
            var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                deleteClassName(doms[i]);
            };
            function deleteClassName(dom) {
                dom.className = dom.className.replace(classname, "");
            };
            return this;
        },
        //0参数编程
        /* addClass:function(){
         var list=Array.prototype.slice.call(arguments);
         //遍历元素,给每个元素添加class
         var context=list[0];
         var doms=$$.$all(context);
         var names=list.slice(1);
         var classes=names.join(" ");
         for(var i=0;i<doms.length;i++){
         doms[i].className=classes;
         }
         }*/
        //移除属性
        removeAttr: function () {
            var list = Array.prototype.slice.call(arguments);
            /*var doms = $$.$all(list[0]);
            console.log(doms);
            var arr = list.slice(0);*/
            var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                removeOneAttr(doms[i]);
            }
            function removeOneAttr(dom) {
                for (var j = 0; j < list.length; j++) {
                    dom.removeAttribute(list[j]);
                }
            }
            return this;
        },
        html: function (value) {
            var doms = this.elements;
            if (value != null) {
                for (var i = 0; i < doms.length; i++) {
                    doms[i].innerHTML += value;
                }
            } else {
                return doms[0].innerHTML;
            }
            return this;
        }

    });


//第一步 定义一个动画对象
//第二步 提炼属性和方法
    function Animate() {
        this.timer;
        //保存运动框架运行需要的一切数据
//        this.obj = {};
        this.queen = [];
    }

    Animate.prototype = {
        //动画的本质 每次循环改变某个样式值，比如 left
        //开启定时器 运动开始
        run: function () {
            var that = this;
            that.timer = setInterval(function () {
                that.loop();
            }, 16);
        },
        //运动过程  运动类型与状态
        move: function (obj) {
            //获得过去毫秒数
            var pass = +new Date();
            //计算运动时间比例
            var tween = this.getTween(obj.now, pass, obj.duration, "easeInBack");
            if (tween >= 1) {
                this.stop();
            } else {
                this.setManyProperty(obj.id, obj.styles, tween);
            }
        },
        loop: function () {
            for (var i = 0; i < this.queen.length; i++) {
                this.move(this.queen[i]);
            }
        },
        //停止动画
        stop: function () {
            /* var tween =1;*/
            var that = this;
            clearInterval(that.timer);
        },
        //获得动画类型
        getTween: function (now, pass, duration, ease) {
            //用时 = 过去的时间-初始时间
            var timeUse = pass - now;
            //运动类型集合
            var eases = {
                //线性匀速
                linear: function (t, b, c, d) {
                    return (c - b) * (t / d);
                },
                //弹性运动
                easeOutBounce: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce(d - t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
                    return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            };
            //返回运动类型
            return eases[ease](timeUse, 0, 1, duration);
        },
        //设置单个样式
        setOneProperty: function (id, name, start, distance, tween) {
            //1id 要操作的dom元素，2name要改变的样式名称，3要改变的样式的值
            if (name == "opacity") {
                $$.css(id, name, start + distance * tween);
            } else {
                $$.css(id, name, start + distance * tween + "px");
            }
        },
        //遍历设置多个样式
        setManyProperty: function (id, styles, tween) {
            //对转换好的json样式集合进行遍历操作
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                this.setOneProperty(id, item.name, item.start, item.distance, tween);
            }
        },

        /*添加部*/
        /*准备数据  将所需要的属性放在obj里，以后方便我们
         获取编程里需要的一切数据*/
        add: function (id, json, duration) {
            this.adapterMany(id, json, duration);
            this.run();
        },
        //适配器 准配所需数据 进行必要的获取和转换 为其他部门服务
        adapterOne: function (id, json, duration) {
            var obj = {};
            obj.id = id;
            obj.now = +new Date();
            obj.pass = +new Date();
            obj.tween = 0;
            obj.duration = duration;
            obj.styles = this.getStyles(id, json);
            return obj;
        },
        adapterMany: function (id, json, duration) {
            var obj = this.adapterOne(id, json, duration);
            this.queen.push(obj);
        },
        getStyles: function (id, source) {
            var styles = [];
            for (var item in source) {
                var style = {};
                style.name = item;
                style.start = parseFloat($$.css(id, item));
                style.distance = parseFloat(source[item]) - style.start;
                styles.push(style);
            }
            return styles;
        },

        /*后勤部 内存回收 垃圾回收 */
        destroy: function () {
        }
    }
    wwhm.animate = function (id, json, duration) {
        var animate = new Animate();
        animate.add(id, json, duration);
    }
    function $(context){
        return $$.$all(context);
    }
    w.$ = $;
})(window);




