;(function (w) {
    var wwhm = function(){};

    wwhm.prototype = {
        /*��չ����  ��source��Ĺ��ܿ�����target��*/
        extend: function (target, source) {
            for (var k in source) {
                target[k] = source[k];
            }
            return target;
        },
        elements :""
    };

    var $$ = new wwhm();
    //��ȡdomԪ�ؽڵ�
    $$.extend($$, {
        /* ��ȡID*/
        $id: function (id) {
            this.element = document.getElementById(id);
            return this;
        },
        /*��ȡ��ǩ��*/
        $tag: function (tag, id) {
            //ͨ��getDom�жϲ����id
            var dom = getDom(id);
            var eles = getEle(dom, tag);
            return eles;
            /*�Ӻ���*/
            /*��һ�� ��ȡ����id */
            function getDom(id) {
                //�ж��Ƿ�Ϊ�ַ���
                if ($$.isString(id)) {
                    return document.getElementById(id);
                }
                return id;
            };
            /*�ڶ��� ��ȡĿ��Ԫ�أ��жϴ��ĸ�������������Ԫ��*/
            function getEle(eleId, tag) {
                //������id��Ӹ�id�»��Ԫ��
                if (eleId) {
                    return eleId.getElementsByTagName(tag);
                    //������id���ȡ����tagԪ��
                } else {
                    return document.getElementsByTagName(tag);
                }
            }
        },
        /* ��ȡ����*/
        $class: function (classname, context) {
            var arr = [];
            //�ж��Ƿ���id������ֱ���ã�û����ʹ��document
            var target = context ? context : document;
            //�ж�id�������domԪ�أ�ֱ��ʹ��;������ַ���������л�ȡ
            context = $$.isString(context) ? $$.$id(context) : context;
            if (target.getElementsByClassName) {
                return target.getElementsByClassName(classname);
            }
            //������б�ǩ����������÷��ϵ�����
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
         //������ݹ��������ַ��� ����ת����Ԫ�ض���
         if ($$.isString(context)) {
         context = $$.$id(context);
         } else {
         context = document;
         }

         //�������getElementsByClassName
         if (context.getElementsByClassName) {
         return context.getElementsByClassName(className);
         } else {
         //����������֧��
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
            //����õ��ַ���ת��������
            var arr = str.split(",");
            var result = [];
            //����ת�����ѡ��������
            for (var i = 0, len = arr.length; i < len; i++) {
                //���ÿ������Ԫ�ص����ַ�
                var first = arr[i].charAt(0);
                //ÿ�����ַ���������
                var index = arr[i].indexOf(first);
                //��ȡ��ÿ������Ԫ�ص�����
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
        //���
        $level: function (select) {
            //�������Ʒ��� -- Ѱ�һ��Ƶ�
            var sel = $$.trim(select).split(' ');
            var result = [];
            var context = [];
            for (var i = 0, len = sel.length; i < len; i++) {
                result = [];
                var item = $$.trim(sel[i]);
                var first = sel[i].charAt(0)
                var index = item.indexOf(first)
                if (first === '#') {
                    //�����#���ҵ���Ԫ�أ�
                    pushArray([$$.$id(item.slice(index + 1))]);
                    context = result;
                } else if (first === '.') {
                    //�����.
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray($$.$class(item.slice(index + 1), context[j]));
                        }
                    } else {
                        pushArray($$.$class(item.slice(index + 1)));
                    }
                    context = result;
                } else {
                    //����Ǳ�ǩ
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

            //��װ�ظ��Ĵ���
            function pushArray(doms) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //����Ӳ��
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
        //H5����ѡ����
        $all: function (str, context) {
            context = context || document;
            this.elements = context.querySelectorAll(str);
            return this;
        }
    });

//�ַ�����ز���
    $$.extend($$, {
        /*ȥ����߿ո�*/
        ltrim: function (str) {
            return str.replace(/(^\s*)/g, "");
        },
        /*ȥ���ұ߿ո�*/
        rtrim: function (str) {
            return str.replace(/(\s*$)/g, "");
        },
        /*ȥ���ո�*/
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        /* �򵥵����ݰ�*/
        formateString: function (str, data) {
            return str.replace(/@\((\w+)\)/g, function (match, key) {
                return data[key];
            });
        }
    });

//��������������
    $$.extend($$, {
        /*�������ͼ��*/
        isNumber: function (val) {
            //isFinite�ж��Ƿ�������
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

//�¼����
    $$.extend($$, {
        /* ��������ݼ����¼� type�¼� fn�¼�����*/
        on: function (id, type, fn) {
            //��ȡid
            var dom = $$.isString(id) ? $$.$id(id) : id;
            //�ж��Ƿ�ʶ��addEventListener
            if (dom.addEventListener) {
                //Ĭ��false Ϊð��  trueΪ����
                dom.addEventListener(type, fn, false);
                // IE8- �����
            } else if (dom.attachEvent) {
                //attachEvent����¼�д����on��ͷ��
                dom.attachEvent("on" + type, fn);
            }
        },
        /*�����*/
        un: function (id, type, fn) {
            //var dom = document.getElementById(id);
            var dom = $$.isString(id) ? document.getElementById(id) : id;
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn);
            } else if (dom.detachEvent) {
                dom.detachEvent(type, fn);
            }
        },

        /*������¼�*/
        click: function (id, fn) {
            this.on(id, "click", fn);
        },
        /*�������*/
        mouseover: function (id, fn) {
            this.on(id, "mouseover", fn);
        },
        /*����Ƴ�*/
        mouseout: function (id, fn) {
            this.on(id, "mouseout", fn);
        },
        /*�������*/
        hover: function (id, fnOver, fnOut) {
            if (fnOver) {
                this.on(id, "mouseover", fnOver);
            }
            if (fnOut) {
                this.on(id, "mouseout", fnOut);
            }
        },
        /*����IE  */
        getEvent: function (e) {
            return e ? e : window.event;
        },
        //����targetд��
        getTarget: function (event) {
            var e = $$.getEvent(event);
            return e.target || e.srcElement;
        },
        /*����д��  ��ֹĬ���¼�*/
        preventDefault: function (event) {
            var event = $$.getEvent(event);
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        /*����д�� ��ֹð��*/
        stopPropagation: function (event) {
            var event = $$.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancleBubble = true;
            }
        },
    });
//����,dom����
    $$.extend($$, {
        //context ��Ҫ�����Ľڵ� key�������� value ����ֵ
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
        //��ʾ
        show: function () {
            var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                doms[i].style.display = "block";
            }
            return this;
        },
        //����
        hide: function () {
           var doms = this.elements;
            for (var i = 0; i < doms.length; i++) {
                doms[i].style.display = "none";
            }
            return this;
        },
        /*��ʽ����*/
        css: function (key, value) {
            var doms = this.elements;
            // �����ж��Ƿ���ֵ������
            //����Ϊ������ʽģʽ��û����Ϊ��ȡ��ʽģʽ
            for(var i = 0;i<doms.length;i++){
                setStyle(doms[i], key, value);
            }
            return this;
           /* return getStyle(doms[0], key);*/

            //��ȡģʽ
           /* function getStyle(dom, attr) {
                if (dom.currentStyle) {
                    return dom.currentStyle[attr];
                } else {
                    return getComputedStyle(dom, null)[attr];
                }
            }*/

            //����ģʽ
            function setStyle(dom, attr, value) {
                dom.style[attr] = value;
            }
        },
        //�����
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
        //�Ƴ���
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
        //0�������
        /* addClass:function(){
         var list=Array.prototype.slice.call(arguments);
         //����Ԫ��,��ÿ��Ԫ�����class
         var context=list[0];
         var doms=$$.$all(context);
         var names=list.slice(1);
         var classes=names.join(" ");
         for(var i=0;i<doms.length;i++){
         doms[i].className=classes;
         }
         }*/
        //�Ƴ�����
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


//��һ�� ����һ����������
//�ڶ��� �������Ժͷ���
    function Animate() {
        this.timer;
        //�����˶����������Ҫ��һ������
//        this.obj = {};
        this.queen = [];
    }

    Animate.prototype = {
        //�����ı��� ÿ��ѭ���ı�ĳ����ʽֵ������ left
        //������ʱ�� �˶���ʼ
        run: function () {
            var that = this;
            that.timer = setInterval(function () {
                that.loop();
            }, 16);
        },
        //�˶�����  �˶�������״̬
        move: function (obj) {
            //��ù�ȥ������
            var pass = +new Date();
            //�����˶�ʱ�����
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
        //ֹͣ����
        stop: function () {
            /* var tween =1;*/
            var that = this;
            clearInterval(that.timer);
        },
        //��ö�������
        getTween: function (now, pass, duration, ease) {
            //��ʱ = ��ȥ��ʱ��-��ʼʱ��
            var timeUse = pass - now;
            //�˶����ͼ���
            var eases = {
                //��������
                linear: function (t, b, c, d) {
                    return (c - b) * (t / d);
                },
                //�����˶�
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
                //����
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
            //�����˶�����
            return eases[ease](timeUse, 0, 1, duration);
        },
        //���õ�����ʽ
        setOneProperty: function (id, name, start, distance, tween) {
            //1id Ҫ������domԪ�أ�2nameҪ�ı����ʽ���ƣ�3Ҫ�ı����ʽ��ֵ
            if (name == "opacity") {
                $$.css(id, name, start + distance * tween);
            } else {
                $$.css(id, name, start + distance * tween + "px");
            }
        },
        //�������ö����ʽ
        setManyProperty: function (id, styles, tween) {
            //��ת���õ�json��ʽ���Ͻ��б�������
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                this.setOneProperty(id, item.name, item.start, item.distance, tween);
            }
        },

        /*��Ӳ�*/
        /*׼������  ������Ҫ�����Է���obj��Ժ󷽱�����
         ��ȡ�������Ҫ��һ������*/
        add: function (id, json, duration) {
            this.adapterMany(id, json, duration);
            this.run();
        },
        //������ ׼���������� ���б�Ҫ�Ļ�ȡ��ת�� Ϊ�������ŷ���
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

        /*���ڲ� �ڴ���� �������� */
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




