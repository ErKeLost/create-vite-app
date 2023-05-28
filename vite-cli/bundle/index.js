global.__farmNodeRequire = require;
global.__farmNodeBuiltinModules = require("node:module").builtinModules;
(function(modules, entryModule) {
    var cache = {};
    function require(id) {
        if (cache[id]) return cache[id].exports;
        var module = {
            id: id,
            exports: {}
        };
        modules[id](module, module.exports, require);
        cache[id] = module;
        return module.exports;
    }
    require(entryModule);
})({
    "39221f6d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "FarmRuntimePluginContainer", {
            enumerable: true,
            get: function() {
                return FarmRuntimePluginContainer;
            }
        });
        class FarmRuntimePluginContainer {
            plugins = [];
            constructor(plugins){
                this.plugins = plugins;
            }
            hookSerial(hookName, ...args) {
                for (const plugin of this.plugins){
                    const hook = plugin[hookName];
                    if (hook) {
                        hook.apply(plugin, args);
                    }
                }
            }
            hookBail(hookName, ...args) {
                for (const plugin of this.plugins){
                    const hook = plugin[hookName];
                    if (hook) {
                        const result = hook.apply(plugin, args);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }
    },
    "72daa370": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "ModuleSystem", {
            enumerable: true,
            get: function() {
                return ModuleSystem;
            }
        });
        var _module = farmRequire("cc7e92cf");
        var _plugin = farmRequire("39221f6d");
        var _resourceloader = farmRequire("f144d410");
        var _interop_require_default = farmRequire("bbec2ad5");
        var _interop_require_wildcard = farmRequire("90fe4dc4");
        var _export_star = farmRequire("8804fe42");
        const INTERNAL_MODULE_MAP = {
            "@swc/helpers/_/_interop_require_default": {
                default: _interop_require_default._interop_require_default,
                _: _interop_require_default._interop_require_default
            },
            "@swc/helpers/_/_interop_require_wildcard": {
                default: _interop_require_wildcard._interop_require_wildcard,
                _: _interop_require_wildcard._interop_require_wildcard
            },
            "@swc/helpers/_/_export_star": {
                default: _export_star._export_star,
                _: _export_star._export_star
            }
        };
        class ModuleSystem {
            modules;
            cache;
            publicPaths;
            dynamicModuleResourcesMap;
            resourceLoader;
            pluginContainer;
            constructor(){
                this.modules = {};
                this.cache = {};
                this.publicPaths = [];
                this.dynamicModuleResourcesMap = {};
                this.resourceLoader = new _resourceloader.ResourceLoader(this.publicPaths);
                this.pluginContainer = new _plugin.FarmRuntimePluginContainer([]);
            }
            require(moduleId) {
                if (INTERNAL_MODULE_MAP[moduleId]) {
                    return INTERNAL_MODULE_MAP[moduleId];
                }
                if (this.cache[moduleId]) {
                    const shouldSkip = this.pluginContainer.hookBail("readModuleCache", this.cache[moduleId]);
                    if (!shouldSkip) {
                        return this.cache[moduleId].exports;
                    }
                }
                const initializer = this.modules[moduleId];
                if (!initializer) {
                    if (_resourceloader.targetEnv === "node") {
                        const { __farmNodeRequire  } = globalThis;
                        return __farmNodeRequire(moduleId);
                    }
                    throw new Error(`Module "${moduleId}" is not registered`);
                }
                const module = new _module.Module(moduleId);
                this.pluginContainer.hookSerial("moduleCreated", module);
                this.cache[moduleId] = module;
                initializer(module, module.exports, this.require.bind(this), this.dynamicRequire.bind(this));
                this.pluginContainer.hookSerial("moduleInitialized", module);
                return module.exports;
            }
            dynamicRequire(moduleId) {
                if (this.modules[moduleId]) {
                    const exports1 = this.require(moduleId);
                    if (exports1.__farm_async) {
                        return exports1.default;
                    } else {
                        return Promise.resolve(exports1);
                    }
                }
                const resources = this.dynamicModuleResourcesMap[moduleId];
                if (!resources || resources.length === 0) {
                    throw new Error(`Dynamic imported module "${moduleId}" does not belong to any resource`);
                }
                return Promise.all(resources.map((resource)=>this.resourceLoader.load(resource))).then(()=>{
                    const result = this.require(moduleId);
                    if (result.__farm_async) {
                        return result.default;
                    } else {
                        return result;
                    }
                });
            }
            register(moduleId, initializer) {
                if (this.modules[moduleId]) {
                    console.warn(`Module "${moduleId}" has registered! It should not be registered twice`);
                    return;
                }
                this.modules[moduleId] = initializer;
            }
            update(moduleId, init) {
                this.modules[moduleId] = init;
                this.clearCache(moduleId);
            }
            delete(moduleId) {
                if (this.modules[moduleId]) {
                    this.cache[moduleId] && this.cache[moduleId].dispose?.();
                    this.clearCache(moduleId);
                    delete this.modules[moduleId];
                    return true;
                } else {
                    return false;
                }
            }
            getCache(moduleId) {
                return this.cache[moduleId];
            }
            clearCache(moduleId) {
                if (this.cache[moduleId]) {
                    delete this.cache[moduleId];
                    return true;
                } else {
                    return false;
                }
            }
            setInitialLoadedResources(resources) {
                for (const resource of resources){
                    this.resourceLoader.setLoadedResource(resource);
                }
            }
            setDynamicModuleResourcesMap(dynamicModuleResourcesMap) {
                this.dynamicModuleResourcesMap = dynamicModuleResourcesMap;
            }
            setPublicPaths(publicPaths) {
                this.publicPaths = publicPaths;
                this.resourceLoader.publicPaths = this.publicPaths;
            }
            setPlugins(plugins) {
                this.pluginContainer.plugins = plugins;
            }
            bootstrap() {
                this.pluginContainer.hookSerial("bootstrap", this);
            }
        }
    },
    "8804fe42": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            _export_star: function() {
                return _export_star;
            },
            _: function() {
                return _export_star;
            }
        });
        function _export_star(from, to) {
            Object.keys(from).forEach(function(k) {
                if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
                    Object.defineProperty(to, k, {
                        enumerable: true,
                        get: function() {
                            return from[k];
                        }
                    });
                }
            });
            return from;
        }
    },
    "90fe4dc4": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            _interop_require_wildcard: function() {
                return _interop_require_wildcard;
            },
            _: function() {
                return _interop_require_wildcard;
            }
        });
        function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function") return null;
            var cacheBabelInterop = new WeakMap();
            var cacheNodeInterop = new WeakMap();
            return (_getRequireWildcardCache = function(nodeInterop) {
                return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
            })(nodeInterop);
        }
        function _interop_require_wildcard(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) return obj;
            if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
                default: obj
            };
            var cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) return cache.get(obj);
            var newObj = {};
            var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for(var key in obj){
                if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                    if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
                    else newObj[key] = obj[key];
                }
            }
            newObj.default = obj;
            if (cache) cache.set(obj, newObj);
            return newObj;
        }
    },
    "bbec2ad5": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            _interop_require_default: function() {
                return _interop_require_default;
            },
            _: function() {
                return _interop_require_default;
            }
        });
        function _interop_require_default(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
    },
    "cc7e92cf": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "Module", {
            enumerable: true,
            get: function() {
                return Module;
            }
        });
        class Module {
            id;
            exports;
            meta;
            dispose;
            constructor(id){
                this.id = id;
                this.exports = {};
                this.meta = {};
            }
            onDispose(callback) {
                this.dispose = callback;
            }
        }
    },
    "cff5c4ea": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _modulesystem = farmRequire("72daa370");
        const __farm_global_this__ = globalThis || window || global || self;
        __farm_global_this__.noop = function() {};
        __farm_global_this__.__farm_module_system__ = (function() {
            const moduleSystem = new _modulesystem.ModuleSystem();
            return function() {
                return moduleSystem;
            };
        })()();
        __farm_global_this__.__farm_module_system__.setPlugins([]);
    },
    "f144d410": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            targetEnv: function() {
                return targetEnv;
            },
            ResourceLoader: function() {
                return ResourceLoader;
            }
        });
        const targetEnv = (globalThis || global || window || self).__FARM_TARGET_ENV__ || "node";
        class ResourceLoader {
            _loadedResources = {};
            publicPaths;
            constructor(publicPaths){
                this.publicPaths = publicPaths;
            }
            load(resource) {
                let index = 0;
                while(index < this.publicPaths.length){
                    const publicPath = this.publicPaths[index];
                    const url = `${publicPath === "/" ? "" : publicPath}/${resource.path}`;
                    if (this._loadedResources[resource.path]) {
                        return;
                    }
                    let promise = Promise.resolve();
                    try {
                        if (resource.type === "script") {
                            promise = this._loadScript(url);
                        } else if (resource.type === "link") {
                            promise = this._loadLink(url);
                        }
                        promise.then(()=>{
                            this._loadedResources[resource.path] = true;
                        });
                        return promise;
                    } catch (e) {
                        console.error(`[Farm] Failed to load resource "${url}"`, e);
                        index++;
                    }
                }
            }
            setLoadedResource(path) {
                this._loadedResources[path] = true;
            }
            _loadScript(path) {
                if (targetEnv === "node") {
                    return import(path);
                } else {
                    return new Promise((resolve, reject)=>{
                        const script = document.createElement("script");
                        script.src = path;
                        document.body.appendChild(script);
                        script.onload = ()=>{
                            resolve();
                        };
                        script.onerror = (e)=>{
                            reject(e);
                        };
                    });
                }
            }
            _loadLink(path) {
                if (targetEnv === "node") {
                    return Promise.reject(new Error("Not support loading css in SSR"));
                } else {
                    return new Promise((resolve, reject)=>{
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = path;
                        document.head.appendChild(link);
                        link.onload = ()=>{
                            resolve();
                        };
                        link.onerror = (e)=>{
                            reject(e);
                        };
                    });
                }
            }
        }
    }
}, "cff5c4ea");
(function(modules) {
    for(var key in modules){
        var __farm_global_this__ = globalThis || window || global || self;
        __farm_global_this__.__farm_module_system__.register(key, modules[key]);
    }
})({
    "014082d7": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _ansistyles = _interop_require_default._(farmRequire("94ca7918"));
        var _supportscolor = _interop_require_default._(farmRequire("a15b328b"));
        var _utilities = farmRequire("84050e51");
        const { stdout: stdoutColor , stderr: stderrColor  } = _supportscolor.default;
        const GENERATOR = Symbol("GENERATOR");
        const STYLER = Symbol("STYLER");
        const IS_EMPTY = Symbol("IS_EMPTY");
        const levelMapping = [
            "ansi",
            "ansi",
            "ansi256",
            "ansi16m"
        ];
        const styles = Object.create(null);
        const applyOptions = (object, options = {})=>{
            if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
                throw new Error("The `level` option should be an integer from 0 to 3");
            }
            const colorLevel = stdoutColor ? stdoutColor.level : 0;
            object.level = options.level === undefined ? colorLevel : options.level;
        };
        const chalkFactory = (options)=>{
            const chalk = (...strings)=>strings.join(" ");
            applyOptions(chalk, options);
            Object.setPrototypeOf(chalk, createChalk.prototype);
            return chalk;
        };
        function createChalk(options) {
            return chalkFactory(options);
        }
        Object.setPrototypeOf(createChalk.prototype, Function.prototype);
        for (const [styleName, style] of Object.entries(_ansistyles.default)){
            styles[styleName] = {
                get () {
                    const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
                    Object.defineProperty(this, styleName, {
                        value: builder
                    });
                    return builder;
                }
            };
        }
        styles.visible = {
            get () {
                const builder = createBuilder(this, this[STYLER], true);
                Object.defineProperty(this, "visible", {
                    value: builder
                });
                return builder;
            }
        };
        const getModelAnsi = (model, level, type, ...arguments_)=>{
            if (model === "rgb") {
                if (level === "ansi16m") {
                    return _ansistyles.default[type].ansi16m(...arguments_);
                }
                if (level === "ansi256") {
                    return _ansistyles.default[type].ansi256(_ansistyles.default.rgbToAnsi256(...arguments_));
                }
                return _ansistyles.default[type].ansi(_ansistyles.default.rgbToAnsi(...arguments_));
            }
            if (model === "hex") {
                return getModelAnsi("rgb", level, type, ..._ansistyles.default.hexToRgb(...arguments_));
            }
            return _ansistyles.default[type][model](...arguments_);
        };
        const usedModels = [
            "rgb",
            "hex",
            "ansi256"
        ];
        for (const model of usedModels){
            styles[model] = {
                get () {
                    const { level  } = this;
                    return function(...arguments_) {
                        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), _ansistyles.default.color.close, this[STYLER]);
                        return createBuilder(this, styler, this[IS_EMPTY]);
                    };
                }
            };
            const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
            styles[bgModel] = {
                get () {
                    const { level  } = this;
                    return function(...arguments_) {
                        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), _ansistyles.default.bgColor.close, this[STYLER]);
                        return createBuilder(this, styler, this[IS_EMPTY]);
                    };
                }
            };
        }
        const proto = Object.defineProperties(()=>{}, {
            ...styles,
            level: {
                enumerable: true,
                get () {
                    return this[GENERATOR].level;
                },
                set (level) {
                    this[GENERATOR].level = level;
                }
            }
        });
        const createStyler = (open, close, parent)=>{
            let openAll;
            let closeAll;
            if (parent === undefined) {
                openAll = open;
                closeAll = close;
            } else {
                openAll = parent.openAll + open;
                closeAll = close + parent.closeAll;
            }
            return {
                open,
                close,
                openAll,
                closeAll,
                parent
            };
        };
        const createBuilder = (self, _styler, _isEmpty)=>{
            const builder = (...arguments_)=>applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
            Object.setPrototypeOf(builder, proto);
            builder[GENERATOR] = self;
            builder[STYLER] = _styler;
            builder[IS_EMPTY] = _isEmpty;
            return builder;
        };
        const applyStyle = (self, string)=>{
            if (self.level <= 0 || !string) {
                return self[IS_EMPTY] ? "" : string;
            }
            let styler = self[STYLER];
            if (styler === undefined) {
                return string;
            }
            const { openAll , closeAll  } = styler;
            if (string.includes("\x1b")) {
                while(styler !== undefined){
                    string = (0, _utilities.stringReplaceAll)(string, styler.close, styler.open);
                    styler = styler.parent;
                }
            }
            const lfIndex = string.indexOf("\n");
            if (lfIndex !== -1) {
                string = (0, _utilities.stringEncaseCRLFWithFirstIndex)(string, closeAll, openAll, lfIndex);
            }
            return openAll + string + closeAll;
        };
        Object.defineProperties(createChalk.prototype, styles);
        const chalk = createChalk();
        var _default = chalk;
    },
    "01e04666": function(module, exports, farmRequire, dynamicRequire) {
        function stringify(obj, { EOL ="\n" , finalEOL =true , replacer =null , spaces  } = {}) {
            const EOF = finalEOL ? EOL : "";
            const str = JSON.stringify(obj, replacer, spaces);
            return str.replace(/\n/g, EOL) + EOF;
        }
        function stripBom(content) {
            if (Buffer.isBuffer(content)) content = content.toString("utf8");
            return content.replace(/^\uFEFF/, "");
        }
        module.exports = {
            stringify,
            stripBom
        };
    },
    "028b6fbc": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("84d4236d"), erase = _require.erase, cursor = _require.cursor;
        const _require2 = farmRequire("232af10c"), style = _require2.style, clear = _require2.clear, lines = _require2.lines, figures = _require2.figures;
        class TextPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.transform = style.render(opts.style);
                this.scale = this.transform.scale;
                this.msg = opts.message;
                this.initial = opts.initial || ``;
                this.validator = opts.validate || (()=>true);
                this.value = ``;
                this.errorMsg = opts.error || `Please Enter A Valid Value`;
                this.cursor = Number(!!this.initial);
                this.cursorOffset = 0;
                this.clear = clear(``, this.out.columns);
                this.render();
            }
            set value(v) {
                if (!v && this.initial) {
                    this.placeholder = true;
                    this.rendered = color.gray(this.transform.render(this.initial));
                } else {
                    this.placeholder = false;
                    this.rendered = this.transform.render(v);
                }
                this._value = v;
                this.fire();
            }
            get value() {
                return this._value;
            }
            reset() {
                this.value = ``;
                this.cursor = Number(!!this.initial);
                this.cursorOffset = 0;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.value = this.value || this.initial;
                this.done = this.aborted = true;
                this.error = false;
                this.red = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            validate() {
                var _this = this;
                return _asyncToGenerator(function*() {
                    let valid = yield _this.validator(_this.value);
                    if (typeof valid === `string`) {
                        _this.errorMsg = valid;
                        valid = false;
                    }
                    _this.error = !valid;
                })();
            }
            submit() {
                var _this2 = this;
                return _asyncToGenerator(function*() {
                    _this2.value = _this2.value || _this2.initial;
                    _this2.cursorOffset = 0;
                    _this2.cursor = _this2.rendered.length;
                    yield _this2.validate();
                    if (_this2.error) {
                        _this2.red = true;
                        _this2.fire();
                        _this2.render();
                        return;
                    }
                    _this2.done = true;
                    _this2.aborted = false;
                    _this2.fire();
                    _this2.render();
                    _this2.out.write("\n");
                    _this2.close();
                })();
            }
            next() {
                if (!this.placeholder) return this.bell();
                this.value = this.initial;
                this.cursor = this.rendered.length;
                this.fire();
                this.render();
            }
            moveCursor(n) {
                if (this.placeholder) return;
                this.cursor = this.cursor + n;
                this.cursorOffset += n;
            }
            _(c, key) {
                let s1 = this.value.slice(0, this.cursor);
                let s2 = this.value.slice(this.cursor);
                this.value = `${s1}${c}${s2}`;
                this.red = false;
                this.cursor = this.placeholder ? 0 : s1.length + 1;
                this.render();
            }
            delete() {
                if (this.isCursorAtStart()) return this.bell();
                let s1 = this.value.slice(0, this.cursor - 1);
                let s2 = this.value.slice(this.cursor);
                this.value = `${s1}${s2}`;
                this.red = false;
                if (this.isCursorAtStart()) {
                    this.cursorOffset = 0;
                } else {
                    this.cursorOffset++;
                    this.moveCursor(-1);
                }
                this.render();
            }
            deleteForward() {
                if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
                let s1 = this.value.slice(0, this.cursor);
                let s2 = this.value.slice(this.cursor + 1);
                this.value = `${s1}${s2}`;
                this.red = false;
                if (this.isCursorAtEnd()) {
                    this.cursorOffset = 0;
                } else {
                    this.cursorOffset++;
                }
                this.render();
            }
            first() {
                this.cursor = 0;
                this.render();
            }
            last() {
                this.cursor = this.value.length;
                this.render();
            }
            left() {
                if (this.cursor <= 0 || this.placeholder) return this.bell();
                this.moveCursor(-1);
                this.render();
            }
            right() {
                if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
                this.moveCursor(1);
                this.render();
            }
            isCursorAtStart() {
                return this.cursor === 0 || this.placeholder && this.cursor === 1;
            }
            isCursorAtEnd() {
                return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
            }
            render() {
                if (this.closed) return;
                if (!this.firstRender) {
                    if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
                    this.out.write(clear(this.outputText, this.out.columns));
                }
                super.render();
                this.outputError = "";
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.red ? color.red(this.rendered) : this.rendered
                ].join(` `);
                if (this.error) {
                    this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i)=>a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
            }
        }
        module.exports = TextPrompt;
    },
    "0459d2e1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _emptyDirName = _interop_require_default._(farmRequire("fa2d7524"));
        const defaultProjectName = "project-name";
        const packageName = [
            {
                name: "projectName",
                type: "text",
                message: "Project Name ?",
                initial: defaultProjectName,
                onState: (state)=>{
                    _options.default.name = state.value;
                },
                active: "Yes",
                inactive: "No"
            },
            {
                name: "overwrite",
                type: ()=>(0, _emptyDirName.default)(_options.default.name) ? null : "confirm",
                message: ()=>{
                    return `🚨🚨 files "${_options.default.name}" is not empty. Remove existing files and continue?`;
                }
            },
            {
                name: "overwrite",
                type: (prev, values)=>{
                    if (values.overwrite === false) {
                        throw new Error(" Operation cancelled");
                    }
                    return null;
                }
            }
        ];
        var _default = packageName;
    },
    "04a7b622": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        const pos = (n)=>{
            n = n % 10;
            return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
        };
        class Day extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setDate(this.date.getDate() + 1);
            }
            down() {
                this.date.setDate(this.date.getDate() - 1);
            }
            setTo(val) {
                this.date.setDate(parseInt(val.substr(-2)));
            }
            toString() {
                let date = this.date.getDate();
                let day = this.date.getDay();
                return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
            }
        }
        module.exports = Day;
    },
    "08984a6e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _clearConsole = _interop_require_default._(farmRequire("f3c8e5da"));
        var _log = farmRequire("56990b82");
        var _constant = farmRequire("d463d19f");
        async function initialLog() {
            (0, _clearConsole.default)("");
            (0, _log.logger)(`\n🍰 Welcome Use Vite To Create Template! v${_constant.VITE_CLI_VERSION}\n`);
        }
        var _default = initialLog;
    },
    "0af2cd19": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const $ = exports;
        const el = farmRequire("58bfc030");
        const noop = (v)=>v;
        function toPrompt(type, args, opts = {}) {
            return new Promise((res, rej)=>{
                const p = new el[type](args);
                const onAbort = opts.onAbort || noop;
                const onSubmit = opts.onSubmit || noop;
                const onExit = opts.onExit || noop;
                p.on("state", args.onState || noop);
                p.on("submit", (x)=>res(onSubmit(x)));
                p.on("exit", (x)=>res(onExit(x)));
                p.on("abort", (x)=>rej(onAbort(x)));
            });
        }
        $.text = (args)=>toPrompt("TextPrompt", args);
        $.password = (args)=>{
            args.style = "password";
            return $.text(args);
        };
        $.invisible = (args)=>{
            args.style = "invisible";
            return $.text(args);
        };
        $.number = (args)=>toPrompt("NumberPrompt", args);
        $.date = (args)=>toPrompt("DatePrompt", args);
        $.confirm = (args)=>toPrompt("ConfirmPrompt", args);
        $.list = (args)=>{
            const sep = args.separator || ",";
            return toPrompt("TextPrompt", args, {
                onSubmit: (str)=>str.split(sep).map((s)=>s.trim())
            });
        };
        $.toggle = (args)=>toPrompt("TogglePrompt", args);
        $.select = (args)=>toPrompt("SelectPrompt", args);
        $.multiselect = (args)=>{
            args.choices = [].concat(args.choices || []);
            const toSelected = (items)=>items.filter((item)=>item.selected).map((item)=>item.value);
            return toPrompt("MultiselectPrompt", args, {
                onAbort: toSelected,
                onSubmit: toSelected
            });
        };
        $.autocompleteMultiselect = (args)=>{
            args.choices = [].concat(args.choices || []);
            const toSelected = (items)=>items.filter((item)=>item.selected).map((item)=>item.value);
            return toPrompt("AutocompleteMultiselectPrompt", args, {
                onAbort: toSelected,
                onSubmit: toSelected
            });
        };
        const byTitle = (input, choices)=>Promise.resolve(choices.filter((item)=>item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
        $.autocomplete = (args)=>{
            args.suggest = args.suggest || byTitle;
            args.choices = [].concat(args.choices || []);
            return toPrompt("AutocompletePrompt", args);
        };
    },
    "0de734e3": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _vueEjsMapConstant = farmRequire("f2b2156d");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _default = {
            name: "useTheme",
            type: ()=>_vueEjsMapConstant.useThemeUiMap.includes(_options.default.components) ? "toggle" : null,
            message: "Add theming && layout to your project?  This item overrides some of the default configuration",
            initial: false,
            active: "Yes",
            inactive: "No"
        };
    },
    "0e0fccba": function(module, exports, farmRequire, dynamicRequire) {
        var process = global.process;
        const processOk = function(process) {
            return process && typeof process === "object" && typeof process.removeListener === "function" && typeof process.emit === "function" && typeof process.reallyExit === "function" && typeof process.listeners === "function" && typeof process.kill === "function" && typeof process.pid === "number" && typeof process.on === "function";
        };
        if (!processOk(process)) {
            module.exports = function() {
                return function() {};
            };
        } else {
            var assert = farmRequire("assert");
            var signals = farmRequire("f9bb4f26");
            var isWin = /^win/i.test(process.platform);
            var EE = farmRequire("events");
            if (typeof EE !== "function") {
                EE = EE.EventEmitter;
            }
            var emitter;
            if (process.__signal_exit_emitter__) {
                emitter = process.__signal_exit_emitter__;
            } else {
                emitter = process.__signal_exit_emitter__ = new EE();
                emitter.count = 0;
                emitter.emitted = {};
            }
            if (!emitter.infinite) {
                emitter.setMaxListeners(Infinity);
                emitter.infinite = true;
            }
            module.exports = function(cb, opts) {
                if (!processOk(global.process)) {
                    return function() {};
                }
                assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
                if (loaded === false) {
                    load();
                }
                var ev = "exit";
                if (opts && opts.alwaysLast) {
                    ev = "afterexit";
                }
                var remove = function() {
                    emitter.removeListener(ev, cb);
                    if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
                        unload();
                    }
                };
                emitter.on(ev, cb);
                return remove;
            };
            var unload = function unload() {
                if (!loaded || !processOk(global.process)) {
                    return;
                }
                loaded = false;
                signals.forEach(function(sig) {
                    try {
                        process.removeListener(sig, sigListeners[sig]);
                    } catch (er) {}
                });
                process.emit = originalProcessEmit;
                process.reallyExit = originalProcessReallyExit;
                emitter.count -= 1;
            };
            module.exports.unload = unload;
            var emit = function emit(event, code, signal) {
                if (emitter.emitted[event]) {
                    return;
                }
                emitter.emitted[event] = true;
                emitter.emit(event, code, signal);
            };
            var sigListeners = {};
            signals.forEach(function(sig) {
                sigListeners[sig] = function listener() {
                    if (!processOk(global.process)) {
                        return;
                    }
                    var listeners = process.listeners(sig);
                    if (listeners.length === emitter.count) {
                        unload();
                        emit("exit", null, sig);
                        emit("afterexit", null, sig);
                        if (isWin && sig === "SIGHUP") {
                            sig = "SIGINT";
                        }
                        process.kill(process.pid, sig);
                    }
                };
            });
            module.exports.signals = function() {
                return signals;
            };
            var loaded = false;
            var load = function load() {
                if (loaded || !processOk(global.process)) {
                    return;
                }
                loaded = true;
                emitter.count += 1;
                signals = signals.filter(function(sig) {
                    try {
                        process.on(sig, sigListeners[sig]);
                        return true;
                    } catch (er) {
                        return false;
                    }
                });
                process.emit = processEmit;
                process.reallyExit = processReallyExit;
            };
            module.exports.load = load;
            var originalProcessReallyExit = process.reallyExit;
            var processReallyExit = function processReallyExit(code) {
                if (!processOk(global.process)) {
                    return;
                }
                process.exitCode = code || 0;
                emit("exit", process.exitCode, null);
                emit("afterexit", process.exitCode, null);
                originalProcessReallyExit.call(process, process.exitCode);
            };
            var originalProcessEmit = process.emit;
            var processEmit = function processEmit(ev, arg) {
                if (ev === "exit" && processOk(global.process)) {
                    if (arg !== undefined) {
                        process.exitCode = arg;
                    }
                    var ret = originalProcessEmit.apply(this, arguments);
                    emit("exit", process.exitCode, null);
                    emit("afterexit", process.exitCode, null);
                    return ret;
                } else {
                    return originalProcessEmit.apply(this, arguments);
                }
            };
        }
    },
    "0f1bf33e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = clone;
        var getPrototypeOf = Object.getPrototypeOf || function(obj) {
            return obj.__proto__;
        };
        function clone(obj) {
            if (obj === null || typeof obj !== "object") return obj;
            if (obj instanceof Object) var copy = {
                __proto__: getPrototypeOf(obj)
            };
            else var copy = Object.create(null);
            Object.getOwnPropertyNames(obj).forEach(function(key) {
                Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
            });
            return copy;
        }
    },
    "0fb9151f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            ...farmRequire("7e487033"),
            ...farmRequire("48f7966c"),
            ...farmRequire("b7b6f8c6"),
            ...farmRequire("5232618c"),
            ...farmRequire("970f5996"),
            ...farmRequire("43482b8b"),
            ...farmRequire("3d1ca971"),
            ...farmRequire("4f54265c"),
            ...farmRequire("619c6a41"),
            ...farmRequire("317fdd9f")
        };
    },
    "1171c95c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            inspect: function() {
                return inspect;
            },
            icons: function() {
                return icons;
            },
            legacy: function() {
                return legacy;
            },
            html: function() {
                return html;
            },
            jsx: function() {
                return jsx;
            },
            vueComponents: function() {
                return vueComponents;
            },
            autoImport: function() {
                return autoImport;
            },
            unocss: function() {
                return unocss;
            },
            pwa: function() {
                return pwa;
            },
            visualizer: function() {
                return visualizer;
            },
            vuetifyPlugin: function() {
                return vuetifyPlugin;
            }
        });
        const jsx = {
            name: "@vitejs/plugin-vue-jsx",
            version: "^3.0.1",
            stableVersion: "^2.0.0",
            stateMent: 'import VueJsx from "@vitejs/plugin-vue-jsx"',
            dev: "dev"
        };
        const legacy = {
            name: "@vitejs/plugin-legacy",
            version: "^4.0.2",
            stableVersion: "^2.0.0",
            stateMent: 'import legacy from "@vitejs/plugin-legacy"',
            dev: "dev"
        };
        const autoImport = {
            name: "unplugin-auto-import",
            version: "^0.15.1",
            stableVersion: "^0.10.0",
            stateMent: 'import AutoImport from "unplugin-auto-import/vite"',
            dev: "dev"
        };
        const vuetifyPlugin = {
            name: "vite-plugin-vuetify",
            version: "^1.0.2",
            stableVersion: "^1.0.0",
            stateMent: 'import vuetify from "vite-plugin-vuetify',
            dev: "dev"
        };
        const html = {
            name: "vite-plugin-html",
            version: "^3.2.0",
            stableVersion: "^3.2.0",
            stateMent: 'import html from "vite-plugin-html"',
            dev: "dev"
        };
        const unocss = {
            name: "unocss",
            version: "^0.50.6",
            stableVersion: "^0.45.18",
            stateMent: 'import Unocss from "unocss/vite"',
            dev: "dev"
        };
        const pwa = {
            name: "vite-plugin-pwa",
            version: "^0.14.4",
            stableVersion: "^0.14.0",
            stateMent: 'import { VitePWA } from "vite-plugin-pwa"',
            dev: "dev"
        };
        const vueComponents = {
            name: "unplugin-vue-components",
            version: "^0.24.1",
            stableVersion: "^0.21.1",
            stateMent: 'import Components from "unplugin-vue-components/vite"',
            dev: "dev"
        };
        const visualizer = {
            name: "rollup-plugin-visualizer",
            version: "^5.9.0",
            stableVersion: "^5.7.1",
            stateMent: 'import AutoImport from "unplugin-auto-import/vite"',
            dev: "dev"
        };
        const icons = {
            name: [
                "unplugin-icons",
                "@iconify-json/carbon"
            ],
            version: [
                "^0.15.3",
                "^1.1.16"
            ],
            stableVersion: [
                "^0.14.7",
                "^1.1.13"
            ],
            stateMent: [
                'import Icons from "unplugin-icons/vite"',
                'import IconsResolver from "unplugin-icons/resolver"'
            ],
            dev: "dev"
        };
        const inspect = {
            name: "vite-plugin-inspect",
            version: "^0.7.17",
            stableVersion: "^0.6.0",
            stateMent: 'import Inspect from "vite-plugin-inspect"',
            dev: "dev"
        };
    },
    "12aba9ec": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const { cursor  } = farmRequire("84d4236d");
        const Prompt = farmRequire("417025f1");
        const { clear , figures , style , wrap , entriesToDisplay  } = farmRequire("b8d8683f");
        class MultiselectPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.cursor = opts.cursor || 0;
                this.scrollIndex = opts.cursor || 0;
                this.hint = opts.hint || "";
                this.warn = opts.warn || "- This option is disabled -";
                this.minSelected = opts.min;
                this.showMinError = false;
                this.maxChoices = opts.max;
                this.instructions = opts.instructions;
                this.optionsPerPage = opts.optionsPerPage || 10;
                this.value = opts.choices.map((ch, idx)=>{
                    if (typeof ch === "string") ch = {
                        title: ch,
                        value: idx
                    };
                    return {
                        title: ch && (ch.title || ch.value || ch),
                        description: ch && ch.description,
                        value: ch && (ch.value === undefined ? idx : ch.value),
                        selected: ch && ch.selected,
                        disabled: ch && ch.disabled
                    };
                });
                this.clear = clear("", this.out.columns);
                if (!opts.overrideRender) {
                    this.render();
                }
            }
            reset() {
                this.value.map((v)=>!v.selected);
                this.cursor = 0;
                this.fire();
                this.render();
            }
            selected() {
                return this.value.filter((v)=>v.selected);
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                const selected = this.value.filter((e)=>e.selected);
                if (this.minSelected && selected.length < this.minSelected) {
                    this.showMinError = true;
                    this.render();
                } else {
                    this.done = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                }
            }
            first() {
                this.cursor = 0;
                this.render();
            }
            last() {
                this.cursor = this.value.length - 1;
                this.render();
            }
            next() {
                this.cursor = (this.cursor + 1) % this.value.length;
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.cursor = this.value.length - 1;
                } else {
                    this.cursor--;
                }
                this.render();
            }
            down() {
                if (this.cursor === this.value.length - 1) {
                    this.cursor = 0;
                } else {
                    this.cursor++;
                }
                this.render();
            }
            left() {
                this.value[this.cursor].selected = false;
                this.render();
            }
            right() {
                if (this.value.filter((e)=>e.selected).length >= this.maxChoices) return this.bell();
                this.value[this.cursor].selected = true;
                this.render();
            }
            handleSpaceToggle() {
                const v = this.value[this.cursor];
                if (v.selected) {
                    v.selected = false;
                    this.render();
                } else if (v.disabled || this.value.filter((e)=>e.selected).length >= this.maxChoices) {
                    return this.bell();
                } else {
                    v.selected = true;
                    this.render();
                }
            }
            toggleAll() {
                if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
                    return this.bell();
                }
                const newSelected = !this.value[this.cursor].selected;
                this.value.filter((v)=>!v.disabled).forEach((v)=>v.selected = newSelected);
                this.render();
            }
            _(c, key) {
                if (c === " ") {
                    this.handleSpaceToggle();
                } else if (c === "a") {
                    this.toggleAll();
                } else {
                    return this.bell();
                }
            }
            renderInstructions() {
                if (this.instructions === undefined || this.instructions) {
                    if (typeof this.instructions === "string") {
                        return this.instructions;
                    }
                    return "\nInstructions:\n" + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
                }
                return "";
            }
            renderOption(cursor, v, i, arrowIndicator) {
                const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
                let title, desc;
                if (v.disabled) {
                    title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                } else {
                    title = cursor === i ? color.cyan().underline(v.title) : v.title;
                    if (cursor === i && v.description) {
                        desc = ` - ${v.description}`;
                        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                            desc = "\n" + wrap(v.description, {
                                margin: prefix.length,
                                width: this.out.columns
                            });
                        }
                    }
                }
                return prefix + title + color.gray(desc || "");
            }
            paginateOptions(options) {
                if (options.length === 0) {
                    return color.red("No matches for this query.");
                }
                let { startIndex , endIndex  } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
                let prefix, styledOptions = [];
                for(let i = startIndex; i < endIndex; i++){
                    if (i === startIndex && startIndex > 0) {
                        prefix = figures.arrowUp;
                    } else if (i === endIndex - 1 && endIndex < options.length) {
                        prefix = figures.arrowDown;
                    } else {
                        prefix = " ";
                    }
                    styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
                }
                return "\n" + styledOptions.join("\n");
            }
            renderOptions(options) {
                if (!this.done) {
                    return this.paginateOptions(options);
                }
                return "";
            }
            renderDoneOrInstructions() {
                if (this.done) {
                    return this.value.filter((e)=>e.selected).map((v)=>v.title).join(", ");
                }
                const output = [
                    color.gray(this.hint),
                    this.renderInstructions()
                ];
                if (this.value[this.cursor].disabled) {
                    output.push(color.yellow(this.warn));
                }
                return output.join(" ");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                super.render();
                let prompt = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.renderDoneOrInstructions()
                ].join(" ");
                if (this.showMinError) {
                    prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
                    this.showMinError = false;
                }
                prompt += this.renderOptions(this.value);
                this.out.write(this.clear + prompt);
                this.clear = clear(prompt, this.out.columns);
            }
        }
        module.exports = MultiselectPrompt;
    },
    "12dc462f": function(module, exports, farmRequire, dynamicRequire) {
        const tinycolor = farmRequire("2bc0bd1a");
        const RGBA_MAX = {
            r: 256,
            g: 256,
            b: 256,
            a: 1
        };
        const HSVA_MAX = {
            h: 360,
            s: 1,
            v: 1,
            a: 1
        };
        function stepize(start, end, steps) {
            let step = {};
            for(let k in start){
                if (start.hasOwnProperty(k)) {
                    step[k] = steps === 0 ? 0 : (end[k] - start[k]) / steps;
                }
            }
            return step;
        }
        function interpolate(step, start, i, max) {
            let color = {};
            for(let k in start){
                if (start.hasOwnProperty(k)) {
                    color[k] = step[k] * i + start[k];
                    color[k] = color[k] < 0 ? color[k] + max[k] : max[k] !== 1 ? color[k] % max[k] : color[k];
                }
            }
            return color;
        }
        function interpolateRgb(stop1, stop2, steps) {
            const start = stop1.color.toRgb();
            const end = stop2.color.toRgb();
            const step = stepize(start, end, steps);
            let gradient = [
                stop1.color
            ];
            for(let i = 1; i < steps; i++){
                const color = interpolate(step, start, i, RGBA_MAX);
                gradient.push(tinycolor(color));
            }
            return gradient;
        }
        function interpolateHsv(stop1, stop2, steps, mode) {
            const start = stop1.color.toHsv();
            const end = stop2.color.toHsv();
            if (start.s === 0 || end.s === 0) {
                return interpolateRgb(stop1, stop2, steps);
            }
            let trigonometric;
            if (typeof mode === "boolean") {
                trigonometric = mode;
            } else {
                const trigShortest = start.h < end.h && end.h - start.h < 180 || start.h > end.h && start.h - end.h > 180;
                trigonometric = mode === "long" && trigShortest || mode === "short" && !trigShortest;
            }
            const step = stepize(start, end, steps);
            let gradient = [
                stop1.color
            ];
            let diff;
            if (start.h <= end.h && !trigonometric || start.h >= end.h && trigonometric) {
                diff = end.h - start.h;
            } else if (trigonometric) {
                diff = 360 - end.h + start.h;
            } else {
                diff = 360 - start.h + end.h;
            }
            step.h = Math.pow(-1, trigonometric ? 1 : 0) * Math.abs(diff) / steps;
            for(let i = 1; i < steps; i++){
                const color = interpolate(step, start, i, HSVA_MAX);
                gradient.push(tinycolor(color));
            }
            return gradient;
        }
        function computeSubsteps(stops, steps) {
            const l = stops.length;
            steps = parseInt(steps, 10);
            if (isNaN(steps) || steps < 2) {
                throw new Error("Invalid number of steps (< 2)");
            }
            if (steps < l) {
                throw new Error("Number of steps cannot be inferior to number of stops");
            }
            let substeps = [];
            for(let i = 1; i < l; i++){
                const step = (steps - 1) * (stops[i].pos - stops[i - 1].pos);
                substeps.push(Math.max(1, Math.round(step)));
            }
            let totalSubsteps = 1;
            for(let n = l - 1; n--;)totalSubsteps += substeps[n];
            while(totalSubsteps !== steps){
                if (totalSubsteps < steps) {
                    const min = Math.min.apply(null, substeps);
                    substeps[substeps.indexOf(min)]++;
                    totalSubsteps++;
                } else {
                    const max = Math.max.apply(null, substeps);
                    substeps[substeps.indexOf(max)]--;
                    totalSubsteps--;
                }
            }
            return substeps;
        }
        function computeAt(stops, pos, method, max) {
            if (pos < 0 || pos > 1) {
                throw new Error("Position must be between 0 and 1");
            }
            let start, end;
            for(let i = 0, l = stops.length; i < l - 1; i++){
                if (pos >= stops[i].pos && pos < stops[i + 1].pos) {
                    start = stops[i];
                    end = stops[i + 1];
                    break;
                }
            }
            if (!start) {
                start = end = stops[stops.length - 1];
            }
            const step = stepize(start.color[method](), end.color[method](), (end.pos - start.pos) * 100);
            const color = interpolate(step, start.color[method](), (pos - start.pos) * 100, max);
            return tinycolor(color);
        }
        class TinyGradient {
            constructor(stops){
                if (stops.length < 2) {
                    throw new Error("Invalid number of stops (< 2)");
                }
                const havingPositions = stops[0].pos !== undefined;
                let l = stops.length;
                let p = -1;
                let lastColorLess = false;
                this.stops = stops.map((stop, i)=>{
                    const hasPosition = stop.pos !== undefined;
                    if (havingPositions ^ hasPosition) {
                        throw new Error("Cannot mix positionned and not posionned color stops");
                    }
                    if (hasPosition) {
                        const hasColor = stop.color !== undefined;
                        if (!hasColor && (lastColorLess || i === 0 || i === l - 1)) {
                            throw new Error("Cannot define two consecutive position-only stops");
                        }
                        lastColorLess = !hasColor;
                        stop = {
                            color: hasColor ? tinycolor(stop.color) : null,
                            colorLess: !hasColor,
                            pos: stop.pos
                        };
                        if (stop.pos < 0 || stop.pos > 1) {
                            throw new Error("Color stops positions must be between 0 and 1");
                        } else if (stop.pos < p) {
                            throw new Error("Color stops positions are not ordered");
                        }
                        p = stop.pos;
                    } else {
                        stop = {
                            color: tinycolor(stop.color !== undefined ? stop.color : stop),
                            pos: i / (l - 1)
                        };
                    }
                    return stop;
                });
                if (this.stops[0].pos !== 0) {
                    this.stops.unshift({
                        color: this.stops[0].color,
                        pos: 0
                    });
                    l++;
                }
                if (this.stops[l - 1].pos !== 1) {
                    this.stops.push({
                        color: this.stops[l - 1].color,
                        pos: 1
                    });
                }
            }
            reverse() {
                let stops = [];
                this.stops.forEach(function(stop) {
                    stops.push({
                        color: stop.color,
                        pos: 1 - stop.pos
                    });
                });
                return new TinyGradient(stops.reverse());
            }
            loop() {
                let stops1 = [];
                let stops2 = [];
                this.stops.forEach((stop)=>{
                    stops1.push({
                        color: stop.color,
                        pos: stop.pos / 2
                    });
                });
                this.stops.slice(0, -1).forEach((stop)=>{
                    stops2.push({
                        color: stop.color,
                        pos: 1 - stop.pos / 2
                    });
                });
                return new TinyGradient(stops1.concat(stops2.reverse()));
            }
            rgb(steps) {
                const substeps = computeSubsteps(this.stops, steps);
                let gradient = [];
                this.stops.forEach((stop, i)=>{
                    if (stop.colorLess) {
                        stop.color = interpolateRgb(this.stops[i - 1], this.stops[i + 1], 2)[1];
                    }
                });
                for(let i = 0, l = this.stops.length; i < l - 1; i++){
                    const rgb = interpolateRgb(this.stops[i], this.stops[i + 1], substeps[i]);
                    gradient.splice(gradient.length, 0, ...rgb);
                }
                gradient.push(this.stops[this.stops.length - 1].color);
                return gradient;
            }
            hsv(steps, mode) {
                const substeps = computeSubsteps(this.stops, steps);
                let gradient = [];
                this.stops.forEach((stop, i)=>{
                    if (stop.colorLess) {
                        stop.color = interpolateHsv(this.stops[i - 1], this.stops[i + 1], 2, mode)[1];
                    }
                });
                for(let i = 0, l = this.stops.length; i < l - 1; i++){
                    const hsv = interpolateHsv(this.stops[i], this.stops[i + 1], substeps[i], mode);
                    gradient.splice(gradient.length, 0, ...hsv);
                }
                gradient.push(this.stops[this.stops.length - 1].color);
                return gradient;
            }
            css(mode, direction) {
                mode = mode || "linear";
                direction = direction || (mode === "linear" ? "to right" : "ellipse at center");
                let css = mode + "-gradient(" + direction;
                this.stops.forEach(function(stop) {
                    css += ", " + (stop.colorLess ? "" : stop.color.toRgbString() + " ") + stop.pos * 100 + "%";
                });
                css += ")";
                return css;
            }
            rgbAt(pos) {
                return computeAt(this.stops, pos, "toRgb", RGBA_MAX);
            }
            hsvAt(pos) {
                return computeAt(this.stops, pos, "toHsv", HSVA_MAX);
            }
        }
        module.exports = function(stops) {
            if (arguments.length === 1) {
                if (!Array.isArray(arguments[0])) {
                    throw new Error('"stops" is not an array');
                }
                stops = arguments[0];
            } else {
                stops = Array.prototype.slice.call(arguments);
            }
            return new TinyGradient(stops);
        };
    },
    "15ba01de": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (msg, opts = {})=>{
            const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
            const width = opts.width;
            return (msg || "").split(/\r?\n/g).map((line)=>line.split(/\s+/g).reduce((arr, w)=>{
                    if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
                    else arr.push(`${tab}${w}`);
                    return arr;
                }, [
                    tab
                ]).join("\n")).join("\n");
        };
    },
    "15d39a0f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Seconds extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setSeconds(this.date.getSeconds() + 1);
            }
            down() {
                this.date.setSeconds(this.date.getSeconds() - 1);
            }
            setTo(val) {
                this.date.setSeconds(parseInt(val.substr(-2)));
            }
            toString() {
                let s = this.date.getSeconds();
                return this.token.length > 1 ? String(s).padStart(2, "0") : s;
            }
        }
        module.exports = Seconds;
    },
    "19ad2ba0": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { style , clear , figures , wrap , entriesToDisplay  } = farmRequire("b8d8683f");
        const { cursor  } = farmRequire("84d4236d");
        class SelectPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
                this.warn = opts.warn || "- This option is disabled";
                this.cursor = opts.initial || 0;
                this.choices = opts.choices.map((ch, idx)=>{
                    if (typeof ch === "string") ch = {
                        title: ch,
                        value: idx
                    };
                    return {
                        title: ch && (ch.title || ch.value || ch),
                        value: ch && (ch.value === undefined ? idx : ch.value),
                        description: ch && ch.description,
                        selected: ch && ch.selected,
                        disabled: ch && ch.disabled
                    };
                });
                this.optionsPerPage = opts.optionsPerPage || 10;
                this.value = (this.choices[this.cursor] || {}).value;
                this.clear = clear("", this.out.columns);
                this.render();
            }
            moveCursor(n) {
                this.cursor = n;
                this.value = this.choices[n].value;
                this.fire();
            }
            reset() {
                this.moveCursor(0);
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                if (!this.selection.disabled) {
                    this.done = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                } else this.bell();
            }
            first() {
                this.moveCursor(0);
                this.render();
            }
            last() {
                this.moveCursor(this.choices.length - 1);
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.moveCursor(this.choices.length - 1);
                } else {
                    this.moveCursor(this.cursor - 1);
                }
                this.render();
            }
            down() {
                if (this.cursor === this.choices.length - 1) {
                    this.moveCursor(0);
                } else {
                    this.moveCursor(this.cursor + 1);
                }
                this.render();
            }
            next() {
                this.moveCursor((this.cursor + 1) % this.choices.length);
                this.render();
            }
            _(c, key) {
                if (c === " ") return this.submit();
            }
            get selection() {
                return this.choices[this.cursor];
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                let { startIndex , endIndex  } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
                ].join(" ");
                if (!this.done) {
                    this.outputText += "\n";
                    for(let i = startIndex; i < endIndex; i++){
                        let title, prefix, desc = "", v = this.choices[i];
                        if (i === startIndex && startIndex > 0) {
                            prefix = figures.arrowUp;
                        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
                            prefix = figures.arrowDown;
                        } else {
                            prefix = " ";
                        }
                        if (v.disabled) {
                            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
                        } else {
                            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
                            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
                            if (v.description && this.cursor === i) {
                                desc = ` - ${v.description}`;
                                if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                                    desc = "\n" + wrap(v.description, {
                                        margin: 3,
                                        width: this.out.columns
                                    });
                                }
                            }
                        }
                        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
                    }
                }
                this.out.write(this.outputText);
            }
        }
        module.exports = SelectPrompt;
    },
    "19efc509": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const _require = farmRequire("84d4236d"), cursor = _require.cursor;
        const Prompt = farmRequire("37a73412");
        const _require2 = farmRequire("232af10c"), clear = _require2.clear, figures = _require2.figures, style = _require2.style, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
        class MultiselectPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.cursor = opts.cursor || 0;
                this.scrollIndex = opts.cursor || 0;
                this.hint = opts.hint || "";
                this.warn = opts.warn || "- This option is disabled -";
                this.minSelected = opts.min;
                this.showMinError = false;
                this.maxChoices = opts.max;
                this.instructions = opts.instructions;
                this.optionsPerPage = opts.optionsPerPage || 10;
                this.value = opts.choices.map((ch, idx)=>{
                    if (typeof ch === "string") ch = {
                        title: ch,
                        value: idx
                    };
                    return {
                        title: ch && (ch.title || ch.value || ch),
                        description: ch && ch.description,
                        value: ch && (ch.value === undefined ? idx : ch.value),
                        selected: ch && ch.selected,
                        disabled: ch && ch.disabled
                    };
                });
                this.clear = clear("", this.out.columns);
                if (!opts.overrideRender) {
                    this.render();
                }
            }
            reset() {
                this.value.map((v)=>!v.selected);
                this.cursor = 0;
                this.fire();
                this.render();
            }
            selected() {
                return this.value.filter((v)=>v.selected);
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                const selected = this.value.filter((e)=>e.selected);
                if (this.minSelected && selected.length < this.minSelected) {
                    this.showMinError = true;
                    this.render();
                } else {
                    this.done = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                }
            }
            first() {
                this.cursor = 0;
                this.render();
            }
            last() {
                this.cursor = this.value.length - 1;
                this.render();
            }
            next() {
                this.cursor = (this.cursor + 1) % this.value.length;
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.cursor = this.value.length - 1;
                } else {
                    this.cursor--;
                }
                this.render();
            }
            down() {
                if (this.cursor === this.value.length - 1) {
                    this.cursor = 0;
                } else {
                    this.cursor++;
                }
                this.render();
            }
            left() {
                this.value[this.cursor].selected = false;
                this.render();
            }
            right() {
                if (this.value.filter((e)=>e.selected).length >= this.maxChoices) return this.bell();
                this.value[this.cursor].selected = true;
                this.render();
            }
            handleSpaceToggle() {
                const v = this.value[this.cursor];
                if (v.selected) {
                    v.selected = false;
                    this.render();
                } else if (v.disabled || this.value.filter((e)=>e.selected).length >= this.maxChoices) {
                    return this.bell();
                } else {
                    v.selected = true;
                    this.render();
                }
            }
            toggleAll() {
                if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
                    return this.bell();
                }
                const newSelected = !this.value[this.cursor].selected;
                this.value.filter((v)=>!v.disabled).forEach((v)=>v.selected = newSelected);
                this.render();
            }
            _(c, key) {
                if (c === " ") {
                    this.handleSpaceToggle();
                } else if (c === "a") {
                    this.toggleAll();
                } else {
                    return this.bell();
                }
            }
            renderInstructions() {
                if (this.instructions === undefined || this.instructions) {
                    if (typeof this.instructions === "string") {
                        return this.instructions;
                    }
                    return "\nInstructions:\n" + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
                }
                return "";
            }
            renderOption(cursor, v, i, arrowIndicator) {
                const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
                let title, desc;
                if (v.disabled) {
                    title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                } else {
                    title = cursor === i ? color.cyan().underline(v.title) : v.title;
                    if (cursor === i && v.description) {
                        desc = ` - ${v.description}`;
                        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                            desc = "\n" + wrap(v.description, {
                                margin: prefix.length,
                                width: this.out.columns
                            });
                        }
                    }
                }
                return prefix + title + color.gray(desc || "");
            }
            paginateOptions(options) {
                if (options.length === 0) {
                    return color.red("No matches for this query.");
                }
                let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
                let prefix, styledOptions = [];
                for(let i = startIndex; i < endIndex; i++){
                    if (i === startIndex && startIndex > 0) {
                        prefix = figures.arrowUp;
                    } else if (i === endIndex - 1 && endIndex < options.length) {
                        prefix = figures.arrowDown;
                    } else {
                        prefix = " ";
                    }
                    styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
                }
                return "\n" + styledOptions.join("\n");
            }
            renderOptions(options) {
                if (!this.done) {
                    return this.paginateOptions(options);
                }
                return "";
            }
            renderDoneOrInstructions() {
                if (this.done) {
                    return this.value.filter((e)=>e.selected).map((v)=>v.title).join(", ");
                }
                const output = [
                    color.gray(this.hint),
                    this.renderInstructions()
                ];
                if (this.value[this.cursor].disabled) {
                    output.push(color.yellow(this.warn));
                }
                return output.join(" ");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                super.render();
                let prompt = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.renderDoneOrInstructions()
                ].join(" ");
                if (this.showMinError) {
                    prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
                    this.showMinError = false;
                }
                prompt += this.renderOptions(this.value);
                this.out.write(this.clear + prompt);
                this.clear = clear(prompt, this.out.columns);
            }
        }
        module.exports = MultiselectPrompt;
    },
    "1b8cfe77": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            rocketAscii: function() {
                return rocketAscii;
            },
            loadWithRocketGradient: function() {
                return loadWithRocketGradient;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _chalk = _interop_require_default._(farmRequire("014082d7"));
        var _ora = _interop_require_default._(farmRequire("6706b280"));
        const gradientColors = [
            `#31a4ff`,
            `#48afff`,
            `#62baff`,
            `#7ac4ff`,
            `#a6dfff`,
            `#c6ebff`,
            `#afa0ff`,
            `#9b88ff`,
            `#a564ff`,
            `#974cff`,
            `#832aff`
        ];
        const rocketAscii = "▶";
        const referenceGradient = [
            ...gradientColors,
            ...[
                ...gradientColors
            ].reverse(),
            ...gradientColors
        ];
        const sleep = (time)=>new Promise((resolve)=>{
                setTimeout(resolve, time);
            });
        function getGradientAnimFrames() {
            const frames = [];
            for(let start = 0; start < gradientColors.length * 2; start++){
                const end = start + gradientColors.length - 1;
                frames.push(referenceGradient.slice(start, end).map((g)=>{
                    return _chalk.default.bgHex(g)(" ");
                }).join(""));
            }
            return frames;
        }
        function getIntroAnimFrames() {
            const frames = [];
            for(let end = 1; end <= gradientColors.length; end++){
                const leadingSpacesArr = Array.from(new Array(Math.abs(gradientColors.length - end - 1)), ()=>" ");
                const gradientArr = gradientColors.slice(0, end).map((g)=>_chalk.default.bgHex(g)(" "));
                frames.push([
                    ...leadingSpacesArr,
                    ...gradientArr
                ].join(""));
            }
            return frames;
        }
        async function loadWithRocketGradient(text) {
            const frames = getIntroAnimFrames();
            const intro = (0, _ora.default)({
                spinner: {
                    interval: 30,
                    frames
                },
                text: `${rocketAscii} ${text}`
            });
            intro.start();
            await sleep((frames.length - 1) * intro.interval);
            intro.stop();
            const spinner = (0, _ora.default)({
                spinner: {
                    interval: 80,
                    frames: getGradientAnimFrames()
                },
                text: `${rocketAscii} ${text}`
            }).start();
            return spinner;
        }
    },
    "1c800b7b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const codes = {};
        function createErrorType(code, message, Base) {
            if (!Base) {
                Base = Error;
            }
            function getMessage(arg1, arg2, arg3) {
                if (typeof message === "string") {
                    return message;
                } else {
                    return message(arg1, arg2, arg3);
                }
            }
            class NodeError extends Base {
                constructor(arg1, arg2, arg3){
                    super(getMessage(arg1, arg2, arg3));
                }
            }
            NodeError.prototype.name = Base.name;
            NodeError.prototype.code = code;
            codes[code] = NodeError;
        }
        function oneOf(expected, thing) {
            if (Array.isArray(expected)) {
                const len = expected.length;
                expected = expected.map((i)=>String(i));
                if (len > 2) {
                    return `one of ${thing} ${expected.slice(0, len - 1).join(", ")}, or ` + expected[len - 1];
                } else if (len === 2) {
                    return `one of ${thing} ${expected[0]} or ${expected[1]}`;
                } else {
                    return `of ${thing} ${expected[0]}`;
                }
            } else {
                return `of ${thing} ${String(expected)}`;
            }
        }
        function startsWith(str, search, pos) {
            return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        }
        function endsWith(str, search, this_len) {
            if (this_len === undefined || this_len > str.length) {
                this_len = str.length;
            }
            return str.substring(this_len - search.length, this_len) === search;
        }
        function includes(str, search, start) {
            if (typeof start !== "number") {
                start = 0;
            }
            if (start + search.length > str.length) {
                return false;
            } else {
                return str.indexOf(search, start) !== -1;
            }
        }
        createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
            return 'The value "' + value + '" is invalid for option "' + name + '"';
        }, TypeError);
        createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
            let determiner;
            if (typeof expected === "string" && startsWith(expected, "not ")) {
                determiner = "must not be";
                expected = expected.replace(/^not /, "");
            } else {
                determiner = "must be";
            }
            let msg;
            if (endsWith(name, " argument")) {
                msg = `The ${name} ${determiner} ${oneOf(expected, "type")}`;
            } else {
                const type = includes(name, ".") ? "property" : "argument";
                msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, "type")}`;
            }
            msg += `. Received type ${typeof actual}`;
            return msg;
        }, TypeError);
        createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
        createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
            return "The " + name + " method is not implemented";
        });
        createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
        createErrorType("ERR_STREAM_DESTROYED", function(name) {
            return "Cannot call " + name + " after a stream was destroyed";
        });
        createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
        createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
        createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
        createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
        createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
            return "Unknown encoding: " + arg;
        }, TypeError);
        createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
        module.exports.codes = codes;
    },
    "1f4157e8": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const $ = exports;
        const el = farmRequire("363b3386");
        const noop = (v)=>v;
        function toPrompt(type, args, opts = {}) {
            return new Promise((res, rej)=>{
                const p = new el[type](args);
                const onAbort = opts.onAbort || noop;
                const onSubmit = opts.onSubmit || noop;
                const onExit = opts.onExit || noop;
                p.on("state", args.onState || noop);
                p.on("submit", (x)=>res(onSubmit(x)));
                p.on("exit", (x)=>res(onExit(x)));
                p.on("abort", (x)=>rej(onAbort(x)));
            });
        }
        $.text = (args)=>toPrompt("TextPrompt", args);
        $.password = (args)=>{
            args.style = "password";
            return $.text(args);
        };
        $.invisible = (args)=>{
            args.style = "invisible";
            return $.text(args);
        };
        $.number = (args)=>toPrompt("NumberPrompt", args);
        $.date = (args)=>toPrompt("DatePrompt", args);
        $.confirm = (args)=>toPrompt("ConfirmPrompt", args);
        $.list = (args)=>{
            const sep = args.separator || ",";
            return toPrompt("TextPrompt", args, {
                onSubmit: (str)=>str.split(sep).map((s)=>s.trim())
            });
        };
        $.toggle = (args)=>toPrompt("TogglePrompt", args);
        $.select = (args)=>toPrompt("SelectPrompt", args);
        $.multiselect = (args)=>{
            args.choices = [].concat(args.choices || []);
            const toSelected = (items)=>items.filter((item)=>item.selected).map((item)=>item.value);
            return toPrompt("MultiselectPrompt", args, {
                onAbort: toSelected,
                onSubmit: toSelected
            });
        };
        $.autocompleteMultiselect = (args)=>{
            args.choices = [].concat(args.choices || []);
            const toSelected = (items)=>items.filter((item)=>item.selected).map((item)=>item.value);
            return toPrompt("AutocompleteMultiselectPrompt", args, {
                onAbort: toSelected,
                onSubmit: toSelected
            });
        };
        const byTitle = (input, choices)=>Promise.resolve(choices.filter((item)=>item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
        $.autocomplete = (args)=>{
            args.suggest = args.suggest || byTitle;
            args.choices = [].concat(args.choices || []);
            return toPrompt("AutocompletePrompt", args);
        };
    },
    "21925236": function(module, exports, farmRequire, dynamicRequire) {
        if (typeof Object.create === "function") {
            module.exports = function inherits(ctor, superCtor) {
                if (superCtor) {
                    ctor.super_ = superCtor;
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                }
            };
        } else {
            module.exports = function inherits(ctor, superCtor) {
                if (superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function() {};
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor();
                    ctor.prototype.constructor = ctor;
                }
            };
        }
    },
    "232af10c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            action: farmRequire("ffe8e4f2"),
            clear: farmRequire("554cea25"),
            style: farmRequire("df326b79"),
            strip: farmRequire("902f0d3a"),
            figures: farmRequire("3d020fdf"),
            lines: farmRequire("38e5aa5a"),
            wrap: farmRequire("a57a18a1"),
            entriesToDisplay: farmRequire("ff8e1cee")
        };
    },
    "2388f0c2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Milliseconds extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMilliseconds(this.date.getMilliseconds() + 1);
            }
            down() {
                this.date.setMilliseconds(this.date.getMilliseconds() - 1);
            }
            setTo(val) {
                this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
            }
            toString() {
                return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
            }
        }
        module.exports = Milliseconds;
    },
    "24eb533e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const prompts = farmRequire("0af2cd19");
        const passOn = [
            "suggest",
            "format",
            "onState",
            "validate",
            "onRender",
            "type"
        ];
        const noop = ()=>{};
        async function prompt(questions = [], { onSubmit =noop , onCancel =noop  } = {}) {
            const answers = {};
            const override = prompt._override || {};
            questions = [].concat(questions);
            let answer, question, quit, name, type, lastPrompt;
            const getFormattedAnswer = async (question, answer, skipValidation = false)=>{
                if (!skipValidation && question.validate && question.validate(answer) !== true) {
                    return;
                }
                return question.format ? await question.format(answer, answers) : answer;
            };
            for (question of questions){
                ({ name , type  } = question);
                if (typeof type === "function") {
                    type = await type(answer, {
                        ...answers
                    }, question);
                    question["type"] = type;
                }
                if (!type) continue;
                for(let key in question){
                    if (passOn.includes(key)) continue;
                    let value = question[key];
                    question[key] = typeof value === "function" ? await value(answer, {
                        ...answers
                    }, lastPrompt) : value;
                }
                lastPrompt = question;
                if (typeof question.message !== "string") {
                    throw new Error("prompt message is required");
                }
                ({ name , type  } = question);
                if (prompts[type] === void 0) {
                    throw new Error(`prompt type (${type}) is not defined`);
                }
                if (override[question.name] !== undefined) {
                    answer = await getFormattedAnswer(question, override[question.name]);
                    if (answer !== undefined) {
                        answers[name] = answer;
                        continue;
                    }
                }
                try {
                    answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
                    answers[name] = answer = await getFormattedAnswer(question, answer, true);
                    quit = await onSubmit(question, answer, answers);
                } catch (err) {
                    quit = !await onCancel(question, answers);
                }
                if (quit) return answers;
            }
            return answers;
        }
        function getInjectedAnswer(injected, deafultValue) {
            const answer = injected.shift();
            if (answer instanceof Error) {
                throw answer;
            }
            return answer === undefined ? deafultValue : answer;
        }
        function inject(answers) {
            prompt._injected = (prompt._injected || []).concat(answers);
        }
        function override(answers) {
            prompt._override = Object.assign({}, answers);
        }
        module.exports = Object.assign(prompt, {
            prompt,
            prompts,
            inject,
            override
        });
    },
    "24f368d5": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var objectKeys = Object.keys || function(obj) {
            var keys = [];
            for(var key in obj){
                keys.push(key);
            }
            return keys;
        };
        module.exports = Duplex;
        var Readable = farmRequire("409f98e3");
        var Writable = farmRequire("306c4dc2");
        farmRequire("6e507463")(Duplex, Readable);
        {
            var keys = objectKeys(Writable.prototype);
            for(var v = 0; v < keys.length; v++){
                var method = keys[v];
                if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
            }
        }
        function Duplex(options) {
            if (!(this instanceof Duplex)) return new Duplex(options);
            Readable.call(this, options);
            Writable.call(this, options);
            this.allowHalfOpen = true;
            if (options) {
                if (options.readable === false) this.readable = false;
                if (options.writable === false) this.writable = false;
                if (options.allowHalfOpen === false) {
                    this.allowHalfOpen = false;
                    this.once("end", onend);
                }
            }
        }
        Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
            enumerable: false,
            get: function get() {
                return this._writableState.highWaterMark;
            }
        });
        Object.defineProperty(Duplex.prototype, "writableBuffer", {
            enumerable: false,
            get: function get() {
                return this._writableState && this._writableState.getBuffer();
            }
        });
        Object.defineProperty(Duplex.prototype, "writableLength", {
            enumerable: false,
            get: function get() {
                return this._writableState.length;
            }
        });
        function onend() {
            if (this._writableState.ended) return;
            process.nextTick(onEndNT, this);
        }
        function onEndNT(self) {
            self.end();
        }
        Object.defineProperty(Duplex.prototype, "destroyed", {
            enumerable: false,
            get: function get() {
                if (this._readableState === undefined || this._writableState === undefined) {
                    return false;
                }
                return this._readableState.destroyed && this._writableState.destroyed;
            },
            set: function set(value) {
                if (this._readableState === undefined || this._writableState === undefined) {
                    return;
                }
                this._readableState.destroyed = value;
                this._writableState.destroyed = value;
            }
        });
    },
    "26ccd5f7": function(module, exports, farmRequire, dynamicRequire) {
        var buffer = farmRequire("buffer");
        var Buffer = buffer.Buffer;
        function copyProps(src, dst) {
            for(var key in src){
                dst[key] = src[key];
            }
        }
        if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
            module.exports = buffer;
        } else {
            copyProps(buffer, exports);
            exports.Buffer = SafeBuffer;
        }
        function SafeBuffer(arg, encodingOrOffset, length) {
            return Buffer(arg, encodingOrOffset, length);
        }
        SafeBuffer.prototype = Object.create(Buffer.prototype);
        copyProps(Buffer, SafeBuffer);
        SafeBuffer.from = function(arg, encodingOrOffset, length) {
            if (typeof arg === "number") {
                throw new TypeError("Argument must not be a number");
            }
            return Buffer(arg, encodingOrOffset, length);
        };
        SafeBuffer.alloc = function(size, fill, encoding) {
            if (typeof size !== "number") {
                throw new TypeError("Argument must be a number");
            }
            var buf = Buffer(size);
            if (fill !== undefined) {
                if (typeof encoding === "string") {
                    buf.fill(fill, encoding);
                } else {
                    buf.fill(fill);
                }
            } else {
                buf.fill(0);
            }
            return buf;
        };
        SafeBuffer.allocUnsafe = function(size) {
            if (typeof size !== "number") {
                throw new TypeError("Argument must be a number");
            }
            return Buffer(size);
        };
        SafeBuffer.allocUnsafeSlow = function(size) {
            if (typeof size !== "number") {
                throw new TypeError("Argument must be a number");
            }
            return buffer.SlowBuffer(size);
        };
    },
    "281cad53": function(module, exports, farmRequire, dynamicRequire) {
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { erase , cursor  } = farmRequire("84d4236d");
        const { style , clear , lines , figures  } = farmRequire("b8d8683f");
        class TextPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.transform = style.render(opts.style);
                this.scale = this.transform.scale;
                this.msg = opts.message;
                this.initial = opts.initial || ``;
                this.validator = opts.validate || (()=>true);
                this.value = ``;
                this.errorMsg = opts.error || `Please Enter A Valid Value`;
                this.cursor = Number(!!this.initial);
                this.cursorOffset = 0;
                this.clear = clear(``, this.out.columns);
                this.render();
            }
            set value(v) {
                if (!v && this.initial) {
                    this.placeholder = true;
                    this.rendered = color.gray(this.transform.render(this.initial));
                } else {
                    this.placeholder = false;
                    this.rendered = this.transform.render(v);
                }
                this._value = v;
                this.fire();
            }
            get value() {
                return this._value;
            }
            reset() {
                this.value = ``;
                this.cursor = Number(!!this.initial);
                this.cursorOffset = 0;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.value = this.value || this.initial;
                this.done = this.aborted = true;
                this.error = false;
                this.red = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            async validate() {
                let valid = await this.validator(this.value);
                if (typeof valid === `string`) {
                    this.errorMsg = valid;
                    valid = false;
                }
                this.error = !valid;
            }
            async submit() {
                this.value = this.value || this.initial;
                this.cursorOffset = 0;
                this.cursor = this.rendered.length;
                await this.validate();
                if (this.error) {
                    this.red = true;
                    this.fire();
                    this.render();
                    return;
                }
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            next() {
                if (!this.placeholder) return this.bell();
                this.value = this.initial;
                this.cursor = this.rendered.length;
                this.fire();
                this.render();
            }
            moveCursor(n) {
                if (this.placeholder) return;
                this.cursor = this.cursor + n;
                this.cursorOffset += n;
            }
            _(c, key) {
                let s1 = this.value.slice(0, this.cursor);
                let s2 = this.value.slice(this.cursor);
                this.value = `${s1}${c}${s2}`;
                this.red = false;
                this.cursor = this.placeholder ? 0 : s1.length + 1;
                this.render();
            }
            delete() {
                if (this.isCursorAtStart()) return this.bell();
                let s1 = this.value.slice(0, this.cursor - 1);
                let s2 = this.value.slice(this.cursor);
                this.value = `${s1}${s2}`;
                this.red = false;
                if (this.isCursorAtStart()) {
                    this.cursorOffset = 0;
                } else {
                    this.cursorOffset++;
                    this.moveCursor(-1);
                }
                this.render();
            }
            deleteForward() {
                if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
                let s1 = this.value.slice(0, this.cursor);
                let s2 = this.value.slice(this.cursor + 1);
                this.value = `${s1}${s2}`;
                this.red = false;
                if (this.isCursorAtEnd()) {
                    this.cursorOffset = 0;
                } else {
                    this.cursorOffset++;
                }
                this.render();
            }
            first() {
                this.cursor = 0;
                this.render();
            }
            last() {
                this.cursor = this.value.length;
                this.render();
            }
            left() {
                if (this.cursor <= 0 || this.placeholder) return this.bell();
                this.moveCursor(-1);
                this.render();
            }
            right() {
                if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
                this.moveCursor(1);
                this.render();
            }
            isCursorAtStart() {
                return this.cursor === 0 || this.placeholder && this.cursor === 1;
            }
            isCursorAtEnd() {
                return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
            }
            render() {
                if (this.closed) return;
                if (!this.firstRender) {
                    if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
                    this.out.write(clear(this.outputText, this.out.columns));
                }
                super.render();
                this.outputError = "";
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.red ? color.red(this.rendered) : this.rendered
                ].join(` `);
                if (this.error) {
                    this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i)=>a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
            }
        }
        module.exports = TextPrompt;
    },
    "287acfdf": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = [
            [
                0x0300,
                0x036F
            ],
            [
                0x0483,
                0x0486
            ],
            [
                0x0488,
                0x0489
            ],
            [
                0x0591,
                0x05BD
            ],
            [
                0x05BF,
                0x05BF
            ],
            [
                0x05C1,
                0x05C2
            ],
            [
                0x05C4,
                0x05C5
            ],
            [
                0x05C7,
                0x05C7
            ],
            [
                0x0600,
                0x0603
            ],
            [
                0x0610,
                0x0615
            ],
            [
                0x064B,
                0x065E
            ],
            [
                0x0670,
                0x0670
            ],
            [
                0x06D6,
                0x06E4
            ],
            [
                0x06E7,
                0x06E8
            ],
            [
                0x06EA,
                0x06ED
            ],
            [
                0x070F,
                0x070F
            ],
            [
                0x0711,
                0x0711
            ],
            [
                0x0730,
                0x074A
            ],
            [
                0x07A6,
                0x07B0
            ],
            [
                0x07EB,
                0x07F3
            ],
            [
                0x0901,
                0x0902
            ],
            [
                0x093C,
                0x093C
            ],
            [
                0x0941,
                0x0948
            ],
            [
                0x094D,
                0x094D
            ],
            [
                0x0951,
                0x0954
            ],
            [
                0x0962,
                0x0963
            ],
            [
                0x0981,
                0x0981
            ],
            [
                0x09BC,
                0x09BC
            ],
            [
                0x09C1,
                0x09C4
            ],
            [
                0x09CD,
                0x09CD
            ],
            [
                0x09E2,
                0x09E3
            ],
            [
                0x0A01,
                0x0A02
            ],
            [
                0x0A3C,
                0x0A3C
            ],
            [
                0x0A41,
                0x0A42
            ],
            [
                0x0A47,
                0x0A48
            ],
            [
                0x0A4B,
                0x0A4D
            ],
            [
                0x0A70,
                0x0A71
            ],
            [
                0x0A81,
                0x0A82
            ],
            [
                0x0ABC,
                0x0ABC
            ],
            [
                0x0AC1,
                0x0AC5
            ],
            [
                0x0AC7,
                0x0AC8
            ],
            [
                0x0ACD,
                0x0ACD
            ],
            [
                0x0AE2,
                0x0AE3
            ],
            [
                0x0B01,
                0x0B01
            ],
            [
                0x0B3C,
                0x0B3C
            ],
            [
                0x0B3F,
                0x0B3F
            ],
            [
                0x0B41,
                0x0B43
            ],
            [
                0x0B4D,
                0x0B4D
            ],
            [
                0x0B56,
                0x0B56
            ],
            [
                0x0B82,
                0x0B82
            ],
            [
                0x0BC0,
                0x0BC0
            ],
            [
                0x0BCD,
                0x0BCD
            ],
            [
                0x0C3E,
                0x0C40
            ],
            [
                0x0C46,
                0x0C48
            ],
            [
                0x0C4A,
                0x0C4D
            ],
            [
                0x0C55,
                0x0C56
            ],
            [
                0x0CBC,
                0x0CBC
            ],
            [
                0x0CBF,
                0x0CBF
            ],
            [
                0x0CC6,
                0x0CC6
            ],
            [
                0x0CCC,
                0x0CCD
            ],
            [
                0x0CE2,
                0x0CE3
            ],
            [
                0x0D41,
                0x0D43
            ],
            [
                0x0D4D,
                0x0D4D
            ],
            [
                0x0DCA,
                0x0DCA
            ],
            [
                0x0DD2,
                0x0DD4
            ],
            [
                0x0DD6,
                0x0DD6
            ],
            [
                0x0E31,
                0x0E31
            ],
            [
                0x0E34,
                0x0E3A
            ],
            [
                0x0E47,
                0x0E4E
            ],
            [
                0x0EB1,
                0x0EB1
            ],
            [
                0x0EB4,
                0x0EB9
            ],
            [
                0x0EBB,
                0x0EBC
            ],
            [
                0x0EC8,
                0x0ECD
            ],
            [
                0x0F18,
                0x0F19
            ],
            [
                0x0F35,
                0x0F35
            ],
            [
                0x0F37,
                0x0F37
            ],
            [
                0x0F39,
                0x0F39
            ],
            [
                0x0F71,
                0x0F7E
            ],
            [
                0x0F80,
                0x0F84
            ],
            [
                0x0F86,
                0x0F87
            ],
            [
                0x0F90,
                0x0F97
            ],
            [
                0x0F99,
                0x0FBC
            ],
            [
                0x0FC6,
                0x0FC6
            ],
            [
                0x102D,
                0x1030
            ],
            [
                0x1032,
                0x1032
            ],
            [
                0x1036,
                0x1037
            ],
            [
                0x1039,
                0x1039
            ],
            [
                0x1058,
                0x1059
            ],
            [
                0x1160,
                0x11FF
            ],
            [
                0x135F,
                0x135F
            ],
            [
                0x1712,
                0x1714
            ],
            [
                0x1732,
                0x1734
            ],
            [
                0x1752,
                0x1753
            ],
            [
                0x1772,
                0x1773
            ],
            [
                0x17B4,
                0x17B5
            ],
            [
                0x17B7,
                0x17BD
            ],
            [
                0x17C6,
                0x17C6
            ],
            [
                0x17C9,
                0x17D3
            ],
            [
                0x17DD,
                0x17DD
            ],
            [
                0x180B,
                0x180D
            ],
            [
                0x18A9,
                0x18A9
            ],
            [
                0x1920,
                0x1922
            ],
            [
                0x1927,
                0x1928
            ],
            [
                0x1932,
                0x1932
            ],
            [
                0x1939,
                0x193B
            ],
            [
                0x1A17,
                0x1A18
            ],
            [
                0x1B00,
                0x1B03
            ],
            [
                0x1B34,
                0x1B34
            ],
            [
                0x1B36,
                0x1B3A
            ],
            [
                0x1B3C,
                0x1B3C
            ],
            [
                0x1B42,
                0x1B42
            ],
            [
                0x1B6B,
                0x1B73
            ],
            [
                0x1DC0,
                0x1DCA
            ],
            [
                0x1DFE,
                0x1DFF
            ],
            [
                0x200B,
                0x200F
            ],
            [
                0x202A,
                0x202E
            ],
            [
                0x2060,
                0x2063
            ],
            [
                0x206A,
                0x206F
            ],
            [
                0x20D0,
                0x20EF
            ],
            [
                0x302A,
                0x302F
            ],
            [
                0x3099,
                0x309A
            ],
            [
                0xA806,
                0xA806
            ],
            [
                0xA80B,
                0xA80B
            ],
            [
                0xA825,
                0xA826
            ],
            [
                0xFB1E,
                0xFB1E
            ],
            [
                0xFE00,
                0xFE0F
            ],
            [
                0xFE20,
                0xFE23
            ],
            [
                0xFEFF,
                0xFEFF
            ],
            [
                0xFFF9,
                0xFFFB
            ],
            [
                0x10A01,
                0x10A03
            ],
            [
                0x10A05,
                0x10A06
            ],
            [
                0x10A0C,
                0x10A0F
            ],
            [
                0x10A38,
                0x10A3A
            ],
            [
                0x10A3F,
                0x10A3F
            ],
            [
                0x1D167,
                0x1D169
            ],
            [
                0x1D173,
                0x1D182
            ],
            [
                0x1D185,
                0x1D18B
            ],
            [
                0x1D1AA,
                0x1D1AD
            ],
            [
                0x1D242,
                0x1D244
            ],
            [
                0xE0001,
                0xE0001
            ],
            [
                0xE0020,
                0xE007F
            ],
            [
                0xE0100,
                0xE01EF
            ]
        ];
    },
    "2a2c0440": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "shouldUsePnpm", {
            enumerable: true,
            get: function() {
                return shouldUsePnpm;
            }
        });
        var _child_process = farmRequire("child_process");
        function shouldUsePnpm() {
            try {
                const userAgent = process.env.npm_config_user_agent;
                if (userAgent && userAgent.startsWith("pnpm")) {
                    return true;
                }
                (0, _child_process.execSync)("pnpm --version", {
                    stdio: "ignore"
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    "2bc0bd1a": function(module, exports, farmRequire, dynamicRequire) {
        (function(global, factory) {
            typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.tinycolor = factory());
        })(this, function() {
            "use strict";
            function _typeof(obj) {
                "@babel/helpers - typeof";
                return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                }, _typeof(obj);
            }
            var trimLeft = /^\s+/;
            var trimRight = /\s+$/;
            function tinycolor(color, opts) {
                color = color ? color : "";
                opts = opts || {};
                if (color instanceof tinycolor) {
                    return color;
                }
                if (!(this instanceof tinycolor)) {
                    return new tinycolor(color, opts);
                }
                var rgb = inputToRGB(color);
                this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
                this._gradientType = opts.gradientType;
                if (this._r < 1) this._r = Math.round(this._r);
                if (this._g < 1) this._g = Math.round(this._g);
                if (this._b < 1) this._b = Math.round(this._b);
                this._ok = rgb.ok;
            }
            tinycolor.prototype = {
                isDark: function isDark() {
                    return this.getBrightness() < 128;
                },
                isLight: function isLight() {
                    return !this.isDark();
                },
                isValid: function isValid() {
                    return this._ok;
                },
                getOriginalInput: function getOriginalInput() {
                    return this._originalInput;
                },
                getFormat: function getFormat() {
                    return this._format;
                },
                getAlpha: function getAlpha() {
                    return this._a;
                },
                getBrightness: function getBrightness() {
                    var rgb = this.toRgb();
                    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
                },
                getLuminance: function getLuminance() {
                    var rgb = this.toRgb();
                    var RsRGB, GsRGB, BsRGB, R, G, B;
                    RsRGB = rgb.r / 255;
                    GsRGB = rgb.g / 255;
                    BsRGB = rgb.b / 255;
                    if (RsRGB <= 0.03928) R = RsRGB / 12.92;
                    else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
                    if (GsRGB <= 0.03928) G = GsRGB / 12.92;
                    else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
                    if (BsRGB <= 0.03928) B = BsRGB / 12.92;
                    else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
                    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
                },
                setAlpha: function setAlpha(value) {
                    this._a = boundAlpha(value);
                    this._roundA = Math.round(100 * this._a) / 100;
                    return this;
                },
                toHsv: function toHsv() {
                    var hsv = rgbToHsv(this._r, this._g, this._b);
                    return {
                        h: hsv.h * 360,
                        s: hsv.s,
                        v: hsv.v,
                        a: this._a
                    };
                },
                toHsvString: function toHsvString() {
                    var hsv = rgbToHsv(this._r, this._g, this._b);
                    var h = Math.round(hsv.h * 360), s = Math.round(hsv.s * 100), v = Math.round(hsv.v * 100);
                    return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
                },
                toHsl: function toHsl() {
                    var hsl = rgbToHsl(this._r, this._g, this._b);
                    return {
                        h: hsl.h * 360,
                        s: hsl.s,
                        l: hsl.l,
                        a: this._a
                    };
                },
                toHslString: function toHslString() {
                    var hsl = rgbToHsl(this._r, this._g, this._b);
                    var h = Math.round(hsl.h * 360), s = Math.round(hsl.s * 100), l = Math.round(hsl.l * 100);
                    return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
                },
                toHex: function toHex(allow3Char) {
                    return rgbToHex(this._r, this._g, this._b, allow3Char);
                },
                toHexString: function toHexString(allow3Char) {
                    return "#" + this.toHex(allow3Char);
                },
                toHex8: function toHex8(allow4Char) {
                    return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
                },
                toHex8String: function toHex8String(allow4Char) {
                    return "#" + this.toHex8(allow4Char);
                },
                toRgb: function toRgb() {
                    return {
                        r: Math.round(this._r),
                        g: Math.round(this._g),
                        b: Math.round(this._b),
                        a: this._a
                    };
                },
                toRgbString: function toRgbString() {
                    return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
                },
                toPercentageRgb: function toPercentageRgb() {
                    return {
                        r: Math.round(bound01(this._r, 255) * 100) + "%",
                        g: Math.round(bound01(this._g, 255) * 100) + "%",
                        b: Math.round(bound01(this._b, 255) * 100) + "%",
                        a: this._a
                    };
                },
                toPercentageRgbString: function toPercentageRgbString() {
                    return this._a == 1 ? "rgb(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
                },
                toName: function toName() {
                    if (this._a === 0) {
                        return "transparent";
                    }
                    if (this._a < 1) {
                        return false;
                    }
                    return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
                },
                toFilter: function toFilter(secondColor) {
                    var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
                    var secondHex8String = hex8String;
                    var gradientType = this._gradientType ? "GradientType = 1, " : "";
                    if (secondColor) {
                        var s = tinycolor(secondColor);
                        secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
                    }
                    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
                },
                toString: function toString(format) {
                    var formatSet = !!format;
                    format = format || this._format;
                    var formattedString = false;
                    var hasAlpha = this._a < 1 && this._a >= 0;
                    var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
                    if (needsAlphaFormat) {
                        if (format === "name" && this._a === 0) {
                            return this.toName();
                        }
                        return this.toRgbString();
                    }
                    if (format === "rgb") {
                        formattedString = this.toRgbString();
                    }
                    if (format === "prgb") {
                        formattedString = this.toPercentageRgbString();
                    }
                    if (format === "hex" || format === "hex6") {
                        formattedString = this.toHexString();
                    }
                    if (format === "hex3") {
                        formattedString = this.toHexString(true);
                    }
                    if (format === "hex4") {
                        formattedString = this.toHex8String(true);
                    }
                    if (format === "hex8") {
                        formattedString = this.toHex8String();
                    }
                    if (format === "name") {
                        formattedString = this.toName();
                    }
                    if (format === "hsl") {
                        formattedString = this.toHslString();
                    }
                    if (format === "hsv") {
                        formattedString = this.toHsvString();
                    }
                    return formattedString || this.toHexString();
                },
                clone: function clone() {
                    return tinycolor(this.toString());
                },
                _applyModification: function _applyModification(fn, args) {
                    var color = fn.apply(null, [
                        this
                    ].concat([].slice.call(args)));
                    this._r = color._r;
                    this._g = color._g;
                    this._b = color._b;
                    this.setAlpha(color._a);
                    return this;
                },
                lighten: function lighten() {
                    return this._applyModification(_lighten, arguments);
                },
                brighten: function brighten() {
                    return this._applyModification(_brighten, arguments);
                },
                darken: function darken() {
                    return this._applyModification(_darken, arguments);
                },
                desaturate: function desaturate() {
                    return this._applyModification(_desaturate, arguments);
                },
                saturate: function saturate() {
                    return this._applyModification(_saturate, arguments);
                },
                greyscale: function greyscale() {
                    return this._applyModification(_greyscale, arguments);
                },
                spin: function spin() {
                    return this._applyModification(_spin, arguments);
                },
                _applyCombination: function _applyCombination(fn, args) {
                    return fn.apply(null, [
                        this
                    ].concat([].slice.call(args)));
                },
                analogous: function analogous() {
                    return this._applyCombination(_analogous, arguments);
                },
                complement: function complement() {
                    return this._applyCombination(_complement, arguments);
                },
                monochromatic: function monochromatic() {
                    return this._applyCombination(_monochromatic, arguments);
                },
                splitcomplement: function splitcomplement() {
                    return this._applyCombination(_splitcomplement, arguments);
                },
                triad: function triad() {
                    return this._applyCombination(polyad, [
                        3
                    ]);
                },
                tetrad: function tetrad() {
                    return this._applyCombination(polyad, [
                        4
                    ]);
                }
            };
            tinycolor.fromRatio = function(color, opts) {
                if (_typeof(color) == "object") {
                    var newColor = {};
                    for(var i in color){
                        if (color.hasOwnProperty(i)) {
                            if (i === "a") {
                                newColor[i] = color[i];
                            } else {
                                newColor[i] = convertToPercentage(color[i]);
                            }
                        }
                    }
                    color = newColor;
                }
                return tinycolor(color, opts);
            };
            function inputToRGB(color) {
                var rgb = {
                    r: 0,
                    g: 0,
                    b: 0
                };
                var a = 1;
                var s = null;
                var v = null;
                var l = null;
                var ok = false;
                var format = false;
                if (typeof color == "string") {
                    color = stringInputToObject(color);
                }
                if (_typeof(color) == "object") {
                    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                        rgb = rgbToRgb(color.r, color.g, color.b);
                        ok = true;
                        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                        s = convertToPercentage(color.s);
                        v = convertToPercentage(color.v);
                        rgb = hsvToRgb(color.h, s, v);
                        ok = true;
                        format = "hsv";
                    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                        s = convertToPercentage(color.s);
                        l = convertToPercentage(color.l);
                        rgb = hslToRgb(color.h, s, l);
                        ok = true;
                        format = "hsl";
                    }
                    if (color.hasOwnProperty("a")) {
                        a = color.a;
                    }
                }
                a = boundAlpha(a);
                return {
                    ok: ok,
                    format: color.format || format,
                    r: Math.min(255, Math.max(rgb.r, 0)),
                    g: Math.min(255, Math.max(rgb.g, 0)),
                    b: Math.min(255, Math.max(rgb.b, 0)),
                    a: a
                };
            }
            function rgbToRgb(r, g, b) {
                return {
                    r: bound01(r, 255) * 255,
                    g: bound01(g, 255) * 255,
                    b: bound01(b, 255) * 255
                };
            }
            function rgbToHsl(r, g, b) {
                r = bound01(r, 255);
                g = bound01(g, 255);
                b = bound01(b, 255);
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;
                if (max == min) {
                    h = s = 0;
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max){
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: s,
                    l: l
                };
            }
            function hslToRgb(h, s, l) {
                var r, g, b;
                h = bound01(h, 360);
                s = bound01(s, 100);
                l = bound01(l, 100);
                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }
                if (s === 0) {
                    r = g = b = l;
                } else {
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return {
                    r: r * 255,
                    g: g * 255,
                    b: b * 255
                };
            }
            function rgbToHsv(r, g, b) {
                r = bound01(r, 255);
                g = bound01(g, 255);
                b = bound01(b, 255);
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, v = max;
                var d = max - min;
                s = max === 0 ? 0 : d / max;
                if (max == min) {
                    h = 0;
                } else {
                    switch(max){
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }
                return {
                    h: h,
                    s: s,
                    v: v
                };
            }
            function hsvToRgb(h, s, v) {
                h = bound01(h, 360) * 6;
                s = bound01(s, 100);
                v = bound01(v, 100);
                var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [
                    v,
                    q,
                    p,
                    p,
                    t,
                    v
                ][mod], g = [
                    t,
                    v,
                    v,
                    q,
                    p,
                    p
                ][mod], b = [
                    p,
                    p,
                    t,
                    v,
                    v,
                    q
                ][mod];
                return {
                    r: r * 255,
                    g: g * 255,
                    b: b * 255
                };
            }
            function rgbToHex(r, g, b, allow3Char) {
                var hex = [
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(g).toString(16)),
                    pad2(Math.round(b).toString(16))
                ];
                if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
                }
                return hex.join("");
            }
            function rgbaToHex(r, g, b, a, allow4Char) {
                var hex = [
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(g).toString(16)),
                    pad2(Math.round(b).toString(16)),
                    pad2(convertDecimalToHex(a))
                ];
                if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
                    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
                }
                return hex.join("");
            }
            function rgbaToArgbHex(r, g, b, a) {
                var hex = [
                    pad2(convertDecimalToHex(a)),
                    pad2(Math.round(r).toString(16)),
                    pad2(Math.round(g).toString(16)),
                    pad2(Math.round(b).toString(16))
                ];
                return hex.join("");
            }
            tinycolor.equals = function(color1, color2) {
                if (!color1 || !color2) return false;
                return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
            };
            tinycolor.random = function() {
                return tinycolor.fromRatio({
                    r: Math.random(),
                    g: Math.random(),
                    b: Math.random()
                });
            };
            function _desaturate(color, amount) {
                amount = amount === 0 ? 0 : amount || 10;
                var hsl = tinycolor(color).toHsl();
                hsl.s -= amount / 100;
                hsl.s = clamp01(hsl.s);
                return tinycolor(hsl);
            }
            function _saturate(color, amount) {
                amount = amount === 0 ? 0 : amount || 10;
                var hsl = tinycolor(color).toHsl();
                hsl.s += amount / 100;
                hsl.s = clamp01(hsl.s);
                return tinycolor(hsl);
            }
            function _greyscale(color) {
                return tinycolor(color).desaturate(100);
            }
            function _lighten(color, amount) {
                amount = amount === 0 ? 0 : amount || 10;
                var hsl = tinycolor(color).toHsl();
                hsl.l += amount / 100;
                hsl.l = clamp01(hsl.l);
                return tinycolor(hsl);
            }
            function _brighten(color, amount) {
                amount = amount === 0 ? 0 : amount || 10;
                var rgb = tinycolor(color).toRgb();
                rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
                rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
                rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
                return tinycolor(rgb);
            }
            function _darken(color, amount) {
                amount = amount === 0 ? 0 : amount || 10;
                var hsl = tinycolor(color).toHsl();
                hsl.l -= amount / 100;
                hsl.l = clamp01(hsl.l);
                return tinycolor(hsl);
            }
            function _spin(color, amount) {
                var hsl = tinycolor(color).toHsl();
                var hue = (hsl.h + amount) % 360;
                hsl.h = hue < 0 ? 360 + hue : hue;
                return tinycolor(hsl);
            }
            function _complement(color) {
                var hsl = tinycolor(color).toHsl();
                hsl.h = (hsl.h + 180) % 360;
                return tinycolor(hsl);
            }
            function polyad(color, number) {
                if (isNaN(number) || number <= 0) {
                    throw new Error("Argument to polyad must be a positive number");
                }
                var hsl = tinycolor(color).toHsl();
                var result = [
                    tinycolor(color)
                ];
                var step = 360 / number;
                for(var i = 1; i < number; i++){
                    result.push(tinycolor({
                        h: (hsl.h + i * step) % 360,
                        s: hsl.s,
                        l: hsl.l
                    }));
                }
                return result;
            }
            function _splitcomplement(color) {
                var hsl = tinycolor(color).toHsl();
                var h = hsl.h;
                return [
                    tinycolor(color),
                    tinycolor({
                        h: (h + 72) % 360,
                        s: hsl.s,
                        l: hsl.l
                    }),
                    tinycolor({
                        h: (h + 216) % 360,
                        s: hsl.s,
                        l: hsl.l
                    })
                ];
            }
            function _analogous(color, results, slices) {
                results = results || 6;
                slices = slices || 30;
                var hsl = tinycolor(color).toHsl();
                var part = 360 / slices;
                var ret = [
                    tinycolor(color)
                ];
                for(hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;){
                    hsl.h = (hsl.h + part) % 360;
                    ret.push(tinycolor(hsl));
                }
                return ret;
            }
            function _monochromatic(color, results) {
                results = results || 6;
                var hsv = tinycolor(color).toHsv();
                var h = hsv.h, s = hsv.s, v = hsv.v;
                var ret = [];
                var modification = 1 / results;
                while(results--){
                    ret.push(tinycolor({
                        h: h,
                        s: s,
                        v: v
                    }));
                    v = (v + modification) % 1;
                }
                return ret;
            }
            tinycolor.mix = function(color1, color2, amount) {
                amount = amount === 0 ? 0 : amount || 50;
                var rgb1 = tinycolor(color1).toRgb();
                var rgb2 = tinycolor(color2).toRgb();
                var p = amount / 100;
                var rgba = {
                    r: (rgb2.r - rgb1.r) * p + rgb1.r,
                    g: (rgb2.g - rgb1.g) * p + rgb1.g,
                    b: (rgb2.b - rgb1.b) * p + rgb1.b,
                    a: (rgb2.a - rgb1.a) * p + rgb1.a
                };
                return tinycolor(rgba);
            };
            tinycolor.readability = function(color1, color2) {
                var c1 = tinycolor(color1);
                var c2 = tinycolor(color2);
                return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
            };
            tinycolor.isReadable = function(color1, color2, wcag2) {
                var readability = tinycolor.readability(color1, color2);
                var wcag2Parms, out;
                out = false;
                wcag2Parms = validateWCAG2Parms(wcag2);
                switch(wcag2Parms.level + wcag2Parms.size){
                    case "AAsmall":
                    case "AAAlarge":
                        out = readability >= 4.5;
                        break;
                    case "AAlarge":
                        out = readability >= 3;
                        break;
                    case "AAAsmall":
                        out = readability >= 7;
                        break;
                }
                return out;
            };
            tinycolor.mostReadable = function(baseColor, colorList, args) {
                var bestColor = null;
                var bestScore = 0;
                var readability;
                var includeFallbackColors, level, size;
                args = args || {};
                includeFallbackColors = args.includeFallbackColors;
                level = args.level;
                size = args.size;
                for(var i = 0; i < colorList.length; i++){
                    readability = tinycolor.readability(baseColor, colorList[i]);
                    if (readability > bestScore) {
                        bestScore = readability;
                        bestColor = tinycolor(colorList[i]);
                    }
                }
                if (tinycolor.isReadable(baseColor, bestColor, {
                    level: level,
                    size: size
                }) || !includeFallbackColors) {
                    return bestColor;
                } else {
                    args.includeFallbackColors = false;
                    return tinycolor.mostReadable(baseColor, [
                        "#fff",
                        "#000"
                    ], args);
                }
            };
            var names = tinycolor.names = {
                aliceblue: "f0f8ff",
                antiquewhite: "faebd7",
                aqua: "0ff",
                aquamarine: "7fffd4",
                azure: "f0ffff",
                beige: "f5f5dc",
                bisque: "ffe4c4",
                black: "000",
                blanchedalmond: "ffebcd",
                blue: "00f",
                blueviolet: "8a2be2",
                brown: "a52a2a",
                burlywood: "deb887",
                burntsienna: "ea7e5d",
                cadetblue: "5f9ea0",
                chartreuse: "7fff00",
                chocolate: "d2691e",
                coral: "ff7f50",
                cornflowerblue: "6495ed",
                cornsilk: "fff8dc",
                crimson: "dc143c",
                cyan: "0ff",
                darkblue: "00008b",
                darkcyan: "008b8b",
                darkgoldenrod: "b8860b",
                darkgray: "a9a9a9",
                darkgreen: "006400",
                darkgrey: "a9a9a9",
                darkkhaki: "bdb76b",
                darkmagenta: "8b008b",
                darkolivegreen: "556b2f",
                darkorange: "ff8c00",
                darkorchid: "9932cc",
                darkred: "8b0000",
                darksalmon: "e9967a",
                darkseagreen: "8fbc8f",
                darkslateblue: "483d8b",
                darkslategray: "2f4f4f",
                darkslategrey: "2f4f4f",
                darkturquoise: "00ced1",
                darkviolet: "9400d3",
                deeppink: "ff1493",
                deepskyblue: "00bfff",
                dimgray: "696969",
                dimgrey: "696969",
                dodgerblue: "1e90ff",
                firebrick: "b22222",
                floralwhite: "fffaf0",
                forestgreen: "228b22",
                fuchsia: "f0f",
                gainsboro: "dcdcdc",
                ghostwhite: "f8f8ff",
                gold: "ffd700",
                goldenrod: "daa520",
                gray: "808080",
                green: "008000",
                greenyellow: "adff2f",
                grey: "808080",
                honeydew: "f0fff0",
                hotpink: "ff69b4",
                indianred: "cd5c5c",
                indigo: "4b0082",
                ivory: "fffff0",
                khaki: "f0e68c",
                lavender: "e6e6fa",
                lavenderblush: "fff0f5",
                lawngreen: "7cfc00",
                lemonchiffon: "fffacd",
                lightblue: "add8e6",
                lightcoral: "f08080",
                lightcyan: "e0ffff",
                lightgoldenrodyellow: "fafad2",
                lightgray: "d3d3d3",
                lightgreen: "90ee90",
                lightgrey: "d3d3d3",
                lightpink: "ffb6c1",
                lightsalmon: "ffa07a",
                lightseagreen: "20b2aa",
                lightskyblue: "87cefa",
                lightslategray: "789",
                lightslategrey: "789",
                lightsteelblue: "b0c4de",
                lightyellow: "ffffe0",
                lime: "0f0",
                limegreen: "32cd32",
                linen: "faf0e6",
                magenta: "f0f",
                maroon: "800000",
                mediumaquamarine: "66cdaa",
                mediumblue: "0000cd",
                mediumorchid: "ba55d3",
                mediumpurple: "9370db",
                mediumseagreen: "3cb371",
                mediumslateblue: "7b68ee",
                mediumspringgreen: "00fa9a",
                mediumturquoise: "48d1cc",
                mediumvioletred: "c71585",
                midnightblue: "191970",
                mintcream: "f5fffa",
                mistyrose: "ffe4e1",
                moccasin: "ffe4b5",
                navajowhite: "ffdead",
                navy: "000080",
                oldlace: "fdf5e6",
                olive: "808000",
                olivedrab: "6b8e23",
                orange: "ffa500",
                orangered: "ff4500",
                orchid: "da70d6",
                palegoldenrod: "eee8aa",
                palegreen: "98fb98",
                paleturquoise: "afeeee",
                palevioletred: "db7093",
                papayawhip: "ffefd5",
                peachpuff: "ffdab9",
                peru: "cd853f",
                pink: "ffc0cb",
                plum: "dda0dd",
                powderblue: "b0e0e6",
                purple: "800080",
                rebeccapurple: "663399",
                red: "f00",
                rosybrown: "bc8f8f",
                royalblue: "4169e1",
                saddlebrown: "8b4513",
                salmon: "fa8072",
                sandybrown: "f4a460",
                seagreen: "2e8b57",
                seashell: "fff5ee",
                sienna: "a0522d",
                silver: "c0c0c0",
                skyblue: "87ceeb",
                slateblue: "6a5acd",
                slategray: "708090",
                slategrey: "708090",
                snow: "fffafa",
                springgreen: "00ff7f",
                steelblue: "4682b4",
                tan: "d2b48c",
                teal: "008080",
                thistle: "d8bfd8",
                tomato: "ff6347",
                turquoise: "40e0d0",
                violet: "ee82ee",
                wheat: "f5deb3",
                white: "fff",
                whitesmoke: "f5f5f5",
                yellow: "ff0",
                yellowgreen: "9acd32"
            };
            var hexNames = tinycolor.hexNames = flip(names);
            function flip(o) {
                var flipped = {};
                for(var i in o){
                    if (o.hasOwnProperty(i)) {
                        flipped[o[i]] = i;
                    }
                }
                return flipped;
            }
            function boundAlpha(a) {
                a = parseFloat(a);
                if (isNaN(a) || a < 0 || a > 1) {
                    a = 1;
                }
                return a;
            }
            function bound01(n, max) {
                if (isOnePointZero(n)) n = "100%";
                var processPercent = isPercentage(n);
                n = Math.min(max, Math.max(0, parseFloat(n)));
                if (processPercent) {
                    n = parseInt(n * max, 10) / 100;
                }
                if (Math.abs(n - max) < 0.000001) {
                    return 1;
                }
                return n % max / parseFloat(max);
            }
            function clamp01(val) {
                return Math.min(1, Math.max(0, val));
            }
            function parseIntFromHex(val) {
                return parseInt(val, 16);
            }
            function isOnePointZero(n) {
                return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
            }
            function isPercentage(n) {
                return typeof n === "string" && n.indexOf("%") != -1;
            }
            function pad2(c) {
                return c.length == 1 ? "0" + c : "" + c;
            }
            function convertToPercentage(n) {
                if (n <= 1) {
                    n = n * 100 + "%";
                }
                return n;
            }
            function convertDecimalToHex(d) {
                return Math.round(parseFloat(d) * 255).toString(16);
            }
            function convertHexToDecimal(h) {
                return parseIntFromHex(h) / 255;
            }
            var matchers = function() {
                var CSS_INTEGER = "[-\\+]?\\d+%?";
                var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
                var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
                var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
                var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
                return {
                    CSS_UNIT: new RegExp(CSS_UNIT),
                    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
                    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
                };
            }();
            function isValidCSSUnit(color) {
                return !!matchers.CSS_UNIT.exec(color);
            }
            function stringInputToObject(color) {
                color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
                var named = false;
                if (names[color]) {
                    color = names[color];
                    named = true;
                } else if (color == "transparent") {
                    return {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                        format: "name"
                    };
                }
                var match;
                if (match = matchers.rgb.exec(color)) {
                    return {
                        r: match[1],
                        g: match[2],
                        b: match[3]
                    };
                }
                if (match = matchers.rgba.exec(color)) {
                    return {
                        r: match[1],
                        g: match[2],
                        b: match[3],
                        a: match[4]
                    };
                }
                if (match = matchers.hsl.exec(color)) {
                    return {
                        h: match[1],
                        s: match[2],
                        l: match[3]
                    };
                }
                if (match = matchers.hsla.exec(color)) {
                    return {
                        h: match[1],
                        s: match[2],
                        l: match[3],
                        a: match[4]
                    };
                }
                if (match = matchers.hsv.exec(color)) {
                    return {
                        h: match[1],
                        s: match[2],
                        v: match[3]
                    };
                }
                if (match = matchers.hsva.exec(color)) {
                    return {
                        h: match[1],
                        s: match[2],
                        v: match[3],
                        a: match[4]
                    };
                }
                if (match = matchers.hex8.exec(color)) {
                    return {
                        r: parseIntFromHex(match[1]),
                        g: parseIntFromHex(match[2]),
                        b: parseIntFromHex(match[3]),
                        a: convertHexToDecimal(match[4]),
                        format: named ? "name" : "hex8"
                    };
                }
                if (match = matchers.hex6.exec(color)) {
                    return {
                        r: parseIntFromHex(match[1]),
                        g: parseIntFromHex(match[2]),
                        b: parseIntFromHex(match[3]),
                        format: named ? "name" : "hex"
                    };
                }
                if (match = matchers.hex4.exec(color)) {
                    return {
                        r: parseIntFromHex(match[1] + "" + match[1]),
                        g: parseIntFromHex(match[2] + "" + match[2]),
                        b: parseIntFromHex(match[3] + "" + match[3]),
                        a: convertHexToDecimal(match[4] + "" + match[4]),
                        format: named ? "name" : "hex8"
                    };
                }
                if (match = matchers.hex3.exec(color)) {
                    return {
                        r: parseIntFromHex(match[1] + "" + match[1]),
                        g: parseIntFromHex(match[2] + "" + match[2]),
                        b: parseIntFromHex(match[3] + "" + match[3]),
                        format: named ? "name" : "hex"
                    };
                }
                return false;
            }
            function validateWCAG2Parms(parms) {
                var level, size;
                parms = parms || {
                    level: "AA",
                    size: "small"
                };
                level = (parms.level || "AA").toUpperCase();
                size = (parms.size || "small").toLowerCase();
                if (level !== "AA" && level !== "AAA") {
                    level = "AA";
                }
                if (size !== "small" && size !== "large") {
                    size = "small";
                }
                return {
                    level: level,
                    size: size
                };
            }
            return tinycolor;
        });
    },
    "2f74349b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            DatePart: farmRequire("c2b497c8"),
            Meridiem: farmRequire("aa928bb7"),
            Day: farmRequire("d0b00e6f"),
            Hours: farmRequire("f95e1e17"),
            Milliseconds: farmRequire("48168bb0"),
            Minutes: farmRequire("ef5ed4ae"),
            Month: farmRequire("67a14985"),
            Seconds: farmRequire("34138fbd"),
            Year: farmRequire("6b832238")
        };
    },
    "306c4dc2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = Writable;
        function WriteReq(chunk, encoding, cb) {
            this.chunk = chunk;
            this.encoding = encoding;
            this.callback = cb;
            this.next = null;
        }
        function CorkedRequest(state) {
            var _this = this;
            this.next = null;
            this.entry = null;
            this.finish = function() {
                onCorkedFinish(_this, state);
            };
        }
        var Duplex;
        Writable.WritableState = WritableState;
        var internalUtil = {
            deprecate: farmRequire("47e5593c")
        };
        var Stream = farmRequire("a6884590");
        var Buffer = farmRequire("buffer").Buffer;
        var OurUint8Array = global.Uint8Array || function() {};
        function _uint8ArrayToBuffer(chunk) {
            return Buffer.from(chunk);
        }
        function _isUint8Array(obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
        }
        var destroyImpl = farmRequire("e45b1b1d");
        var _require = farmRequire("677e52b5"), getHighWaterMark = _require.getHighWaterMark;
        var _require$codes = farmRequire("1c800b7b").codes, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK, ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE, ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED, ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES, ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END, ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
        var errorOrDestroy = destroyImpl.errorOrDestroy;
        farmRequire("6e507463")(Writable, Stream);
        function nop() {}
        function WritableState(options, stream, isDuplex) {
            Duplex = Duplex || farmRequire("24f368d5");
            options = options || {};
            if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
            this.objectMode = !!options.objectMode;
            if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
            this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
            this.finalCalled = false;
            this.needDrain = false;
            this.ending = false;
            this.ended = false;
            this.finished = false;
            this.destroyed = false;
            var noDecode = options.decodeStrings === false;
            this.decodeStrings = !noDecode;
            this.defaultEncoding = options.defaultEncoding || "utf8";
            this.length = 0;
            this.writing = false;
            this.corked = 0;
            this.sync = true;
            this.bufferProcessing = false;
            this.onwrite = function(er) {
                onwrite(stream, er);
            };
            this.writecb = null;
            this.writelen = 0;
            this.bufferedRequest = null;
            this.lastBufferedRequest = null;
            this.pendingcb = 0;
            this.prefinished = false;
            this.errorEmitted = false;
            this.emitClose = options.emitClose !== false;
            this.autoDestroy = !!options.autoDestroy;
            this.bufferedRequestCount = 0;
            this.corkedRequestsFree = new CorkedRequest(this);
        }
        WritableState.prototype.getBuffer = function getBuffer() {
            var current = this.bufferedRequest;
            var out = [];
            while(current){
                out.push(current);
                current = current.next;
            }
            return out;
        };
        (function() {
            try {
                Object.defineProperty(WritableState.prototype, "buffer", {
                    get: internalUtil.deprecate(function writableStateBufferGetter() {
                        return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
                });
            } catch (_) {}
        })();
        var realHasInstance;
        if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
            realHasInstance = Function.prototype[Symbol.hasInstance];
            Object.defineProperty(Writable, Symbol.hasInstance, {
                value: function value(object) {
                    if (realHasInstance.call(this, object)) return true;
                    if (this !== Writable) return false;
                    return object && object._writableState instanceof WritableState;
                }
            });
        } else {
            realHasInstance = function realHasInstance(object) {
                return object instanceof this;
            };
        }
        function Writable(options) {
            Duplex = Duplex || farmRequire("24f368d5");
            var isDuplex = this instanceof Duplex;
            if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
            this._writableState = new WritableState(options, this, isDuplex);
            this.writable = true;
            if (options) {
                if (typeof options.write === "function") this._write = options.write;
                if (typeof options.writev === "function") this._writev = options.writev;
                if (typeof options.destroy === "function") this._destroy = options.destroy;
                if (typeof options.final === "function") this._final = options.final;
            }
            Stream.call(this);
        }
        Writable.prototype.pipe = function() {
            errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
        };
        function writeAfterEnd(stream, cb) {
            var er = new ERR_STREAM_WRITE_AFTER_END();
            errorOrDestroy(stream, er);
            process.nextTick(cb, er);
        }
        function validChunk(stream, state, chunk, cb) {
            var er;
            if (chunk === null) {
                er = new ERR_STREAM_NULL_VALUES();
            } else if (typeof chunk !== "string" && !state.objectMode) {
                er = new ERR_INVALID_ARG_TYPE("chunk", [
                    "string",
                    "Buffer"
                ], chunk);
            }
            if (er) {
                errorOrDestroy(stream, er);
                process.nextTick(cb, er);
                return false;
            }
            return true;
        }
        Writable.prototype.write = function(chunk, encoding, cb) {
            var state = this._writableState;
            var ret = false;
            var isBuf = !state.objectMode && _isUint8Array(chunk);
            if (isBuf && !Buffer.isBuffer(chunk)) {
                chunk = _uint8ArrayToBuffer(chunk);
            }
            if (typeof encoding === "function") {
                cb = encoding;
                encoding = null;
            }
            if (isBuf) encoding = "buffer";
            else if (!encoding) encoding = state.defaultEncoding;
            if (typeof cb !== "function") cb = nop;
            if (state.ending) writeAfterEnd(this, cb);
            else if (isBuf || validChunk(this, state, chunk, cb)) {
                state.pendingcb++;
                ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
            }
            return ret;
        };
        Writable.prototype.cork = function() {
            this._writableState.corked++;
        };
        Writable.prototype.uncork = function() {
            var state = this._writableState;
            if (state.corked) {
                state.corked--;
                if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
            }
        };
        Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
            if (typeof encoding === "string") encoding = encoding.toLowerCase();
            if (!([
                "hex",
                "utf8",
                "utf-8",
                "ascii",
                "binary",
                "base64",
                "ucs2",
                "ucs-2",
                "utf16le",
                "utf-16le",
                "raw"
            ].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
            this._writableState.defaultEncoding = encoding;
            return this;
        };
        Object.defineProperty(Writable.prototype, "writableBuffer", {
            enumerable: false,
            get: function get() {
                return this._writableState && this._writableState.getBuffer();
            }
        });
        function decodeChunk(state, chunk, encoding) {
            if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
                chunk = Buffer.from(chunk, encoding);
            }
            return chunk;
        }
        Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
            enumerable: false,
            get: function get() {
                return this._writableState.highWaterMark;
            }
        });
        function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
            if (!isBuf) {
                var newChunk = decodeChunk(state, chunk, encoding);
                if (chunk !== newChunk) {
                    isBuf = true;
                    encoding = "buffer";
                    chunk = newChunk;
                }
            }
            var len = state.objectMode ? 1 : chunk.length;
            state.length += len;
            var ret = state.length < state.highWaterMark;
            if (!ret) state.needDrain = true;
            if (state.writing || state.corked) {
                var last = state.lastBufferedRequest;
                state.lastBufferedRequest = {
                    chunk: chunk,
                    encoding: encoding,
                    isBuf: isBuf,
                    callback: cb,
                    next: null
                };
                if (last) {
                    last.next = state.lastBufferedRequest;
                } else {
                    state.bufferedRequest = state.lastBufferedRequest;
                }
                state.bufferedRequestCount += 1;
            } else {
                doWrite(stream, state, false, len, chunk, encoding, cb);
            }
            return ret;
        }
        function doWrite(stream, state, writev, len, chunk, encoding, cb) {
            state.writelen = len;
            state.writecb = cb;
            state.writing = true;
            state.sync = true;
            if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
            else if (writev) stream._writev(chunk, state.onwrite);
            else stream._write(chunk, encoding, state.onwrite);
            state.sync = false;
        }
        function onwriteError(stream, state, sync, er, cb) {
            --state.pendingcb;
            if (sync) {
                process.nextTick(cb, er);
                process.nextTick(finishMaybe, stream, state);
                stream._writableState.errorEmitted = true;
                errorOrDestroy(stream, er);
            } else {
                cb(er);
                stream._writableState.errorEmitted = true;
                errorOrDestroy(stream, er);
                finishMaybe(stream, state);
            }
        }
        function onwriteStateUpdate(state) {
            state.writing = false;
            state.writecb = null;
            state.length -= state.writelen;
            state.writelen = 0;
        }
        function onwrite(stream, er) {
            var state = stream._writableState;
            var sync = state.sync;
            var cb = state.writecb;
            if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
            onwriteStateUpdate(state);
            if (er) onwriteError(stream, state, sync, er, cb);
            else {
                var finished = needFinish(state) || stream.destroyed;
                if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                    clearBuffer(stream, state);
                }
                if (sync) {
                    process.nextTick(afterWrite, stream, state, finished, cb);
                } else {
                    afterWrite(stream, state, finished, cb);
                }
            }
        }
        function afterWrite(stream, state, finished, cb) {
            if (!finished) onwriteDrain(stream, state);
            state.pendingcb--;
            cb();
            finishMaybe(stream, state);
        }
        function onwriteDrain(stream, state) {
            if (state.length === 0 && state.needDrain) {
                state.needDrain = false;
                stream.emit("drain");
            }
        }
        function clearBuffer(stream, state) {
            state.bufferProcessing = true;
            var entry = state.bufferedRequest;
            if (stream._writev && entry && entry.next) {
                var l = state.bufferedRequestCount;
                var buffer = new Array(l);
                var holder = state.corkedRequestsFree;
                holder.entry = entry;
                var count = 0;
                var allBuffers = true;
                while(entry){
                    buffer[count] = entry;
                    if (!entry.isBuf) allBuffers = false;
                    entry = entry.next;
                    count += 1;
                }
                buffer.allBuffers = allBuffers;
                doWrite(stream, state, true, state.length, buffer, "", holder.finish);
                state.pendingcb++;
                state.lastBufferedRequest = null;
                if (holder.next) {
                    state.corkedRequestsFree = holder.next;
                    holder.next = null;
                } else {
                    state.corkedRequestsFree = new CorkedRequest(state);
                }
                state.bufferedRequestCount = 0;
            } else {
                while(entry){
                    var chunk = entry.chunk;
                    var encoding = entry.encoding;
                    var cb = entry.callback;
                    var len = state.objectMode ? 1 : chunk.length;
                    doWrite(stream, state, false, len, chunk, encoding, cb);
                    entry = entry.next;
                    state.bufferedRequestCount--;
                    if (state.writing) {
                        break;
                    }
                }
                if (entry === null) state.lastBufferedRequest = null;
            }
            state.bufferedRequest = entry;
            state.bufferProcessing = false;
        }
        Writable.prototype._write = function(chunk, encoding, cb) {
            cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
        };
        Writable.prototype._writev = null;
        Writable.prototype.end = function(chunk, encoding, cb) {
            var state = this._writableState;
            if (typeof chunk === "function") {
                cb = chunk;
                chunk = null;
                encoding = null;
            } else if (typeof encoding === "function") {
                cb = encoding;
                encoding = null;
            }
            if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);
            if (state.corked) {
                state.corked = 1;
                this.uncork();
            }
            if (!state.ending) endWritable(this, state, cb);
            return this;
        };
        Object.defineProperty(Writable.prototype, "writableLength", {
            enumerable: false,
            get: function get() {
                return this._writableState.length;
            }
        });
        function needFinish(state) {
            return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
        }
        function callFinal(stream, state) {
            stream._final(function(err) {
                state.pendingcb--;
                if (err) {
                    errorOrDestroy(stream, err);
                }
                state.prefinished = true;
                stream.emit("prefinish");
                finishMaybe(stream, state);
            });
        }
        function prefinish(stream, state) {
            if (!state.prefinished && !state.finalCalled) {
                if (typeof stream._final === "function" && !state.destroyed) {
                    state.pendingcb++;
                    state.finalCalled = true;
                    process.nextTick(callFinal, stream, state);
                } else {
                    state.prefinished = true;
                    stream.emit("prefinish");
                }
            }
        }
        function finishMaybe(stream, state) {
            var need = needFinish(state);
            if (need) {
                prefinish(stream, state);
                if (state.pendingcb === 0) {
                    state.finished = true;
                    stream.emit("finish");
                    if (state.autoDestroy) {
                        var rState = stream._readableState;
                        if (!rState || rState.autoDestroy && rState.endEmitted) {
                            stream.destroy();
                        }
                    }
                }
            }
            return need;
        }
        function endWritable(stream, state, cb) {
            state.ending = true;
            finishMaybe(stream, state);
            if (cb) {
                if (state.finished) process.nextTick(cb);
                else stream.once("finish", cb);
            }
            state.ended = true;
            stream.writable = false;
        }
        function onCorkedFinish(corkReq, state, err) {
            var entry = corkReq.entry;
            corkReq.entry = null;
            while(entry){
                var cb = entry.callback;
                state.pendingcb--;
                cb(err);
                entry = entry.next;
            }
            state.corkedRequestsFree.next = corkReq;
        }
        Object.defineProperty(Writable.prototype, "destroyed", {
            enumerable: false,
            get: function get() {
                if (this._writableState === undefined) {
                    return false;
                }
                return this._writableState.destroyed;
            },
            set: function set(value) {
                if (!this._writableState) {
                    return;
                }
                this._writableState.destroyed = value;
            }
        });
        Writable.prototype.destroy = destroyImpl.destroy;
        Writable.prototype._undestroy = destroyImpl.undestroy;
        Writable.prototype._destroy = function(err, cb) {
            cb(err);
        };
    },
    "308d0148": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "runReactQuestions", {
            enumerable: true,
            get: function() {
                return runReactQuestions;
            }
        });
        async function getReactProperty() {
            return true;
        }
        async function runReactQuestions() {
            getReactProperty();
        }
    },
    "317fdd9f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        const u = farmRequire("a11f83ae").fromCallback;
        function remove(path, callback) {
            fs.rm(path, {
                recursive: true,
                force: true
            }, callback);
        }
        function removeSync(path) {
            fs.rmSync(path, {
                recursive: true,
                force: true
            });
        }
        module.exports = {
            remove: u(remove),
            removeSync
        };
    },
    "3186282a": function(module, exports, farmRequire, dynamicRequire) {
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { style , clear  } = farmRequire("b8d8683f");
        const { erase , cursor  } = farmRequire("84d4236d");
        class ConfirmPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.value = opts.initial;
                this.initialValue = !!opts.initial;
                this.yesMsg = opts.yes || "yes";
                this.yesOption = opts.yesOption || "(Y/n)";
                this.noMsg = opts.no || "no";
                this.noOption = opts.noOption || "(y/N)";
                this.render();
            }
            reset() {
                this.value = this.initialValue;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.value = this.value || false;
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            _(c, key) {
                if (c.toLowerCase() === "y") {
                    this.value = true;
                    return this.submit();
                }
                if (c.toLowerCase() === "n") {
                    this.value = false;
                    return this.submit();
                }
                return this.bell();
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
                ].join(" ");
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = ConfirmPrompt;
    },
    "3216444a": function(module, exports, farmRequire, dynamicRequire) {
        var clone = farmRequire("f85a83b4");
        module.exports = function(options, defaults) {
            options = options || {};
            Object.keys(defaults).forEach(function(key) {
                if (typeof options[key] === "undefined") {
                    options[key] = clone(defaults[key]);
                }
            });
            return options;
        };
    },
    "34138fbd": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Seconds extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setSeconds(this.date.getSeconds() + 1);
            }
            down() {
                this.date.setSeconds(this.date.getSeconds() - 1);
            }
            setTo(val) {
                this.date.setSeconds(parseInt(val.substr(-2)));
            }
            toString() {
                let s = this.date.getSeconds();
                return this.token.length > 1 ? String(s).padStart(2, "0") : s;
            }
        }
        module.exports = Seconds;
    },
    "34acfff4": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const { Buffer  } = farmRequire("buffer");
        const symbol = Symbol.for("BufferList");
        function BufferList(buf) {
            if (!(this instanceof BufferList)) {
                return new BufferList(buf);
            }
            BufferList._init.call(this, buf);
        }
        BufferList._init = function _init(buf) {
            Object.defineProperty(this, symbol, {
                value: true
            });
            this._bufs = [];
            this.length = 0;
            if (buf) {
                this.append(buf);
            }
        };
        BufferList.prototype._new = function _new(buf) {
            return new BufferList(buf);
        };
        BufferList.prototype._offset = function _offset(offset) {
            if (offset === 0) {
                return [
                    0,
                    0
                ];
            }
            let tot = 0;
            for(let i = 0; i < this._bufs.length; i++){
                const _t = tot + this._bufs[i].length;
                if (offset < _t || i === this._bufs.length - 1) {
                    return [
                        i,
                        offset - tot
                    ];
                }
                tot = _t;
            }
        };
        BufferList.prototype._reverseOffset = function(blOffset) {
            const bufferId = blOffset[0];
            let offset = blOffset[1];
            for(let i = 0; i < bufferId; i++){
                offset += this._bufs[i].length;
            }
            return offset;
        };
        BufferList.prototype.get = function get(index) {
            if (index > this.length || index < 0) {
                return undefined;
            }
            const offset = this._offset(index);
            return this._bufs[offset[0]][offset[1]];
        };
        BufferList.prototype.slice = function slice(start, end) {
            if (typeof start === "number" && start < 0) {
                start += this.length;
            }
            if (typeof end === "number" && end < 0) {
                end += this.length;
            }
            return this.copy(null, 0, start, end);
        };
        BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
            if (typeof srcStart !== "number" || srcStart < 0) {
                srcStart = 0;
            }
            if (typeof srcEnd !== "number" || srcEnd > this.length) {
                srcEnd = this.length;
            }
            if (srcStart >= this.length) {
                return dst || Buffer.alloc(0);
            }
            if (srcEnd <= 0) {
                return dst || Buffer.alloc(0);
            }
            const copy = !!dst;
            const off = this._offset(srcStart);
            const len = srcEnd - srcStart;
            let bytes = len;
            let bufoff = copy && dstStart || 0;
            let start = off[1];
            if (srcStart === 0 && srcEnd === this.length) {
                if (!copy) {
                    return this._bufs.length === 1 ? this._bufs[0] : Buffer.concat(this._bufs, this.length);
                }
                for(let i = 0; i < this._bufs.length; i++){
                    this._bufs[i].copy(dst, bufoff);
                    bufoff += this._bufs[i].length;
                }
                return dst;
            }
            if (bytes <= this._bufs[off[0]].length - start) {
                return copy ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
            }
            if (!copy) {
                dst = Buffer.allocUnsafe(len);
            }
            for(let i = off[0]; i < this._bufs.length; i++){
                const l = this._bufs[i].length - start;
                if (bytes > l) {
                    this._bufs[i].copy(dst, bufoff, start);
                    bufoff += l;
                } else {
                    this._bufs[i].copy(dst, bufoff, start, start + bytes);
                    bufoff += l;
                    break;
                }
                bytes -= l;
                if (start) {
                    start = 0;
                }
            }
            if (dst.length > bufoff) return dst.slice(0, bufoff);
            return dst;
        };
        BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
            start = start || 0;
            end = typeof end !== "number" ? this.length : end;
            if (start < 0) {
                start += this.length;
            }
            if (end < 0) {
                end += this.length;
            }
            if (start === end) {
                return this._new();
            }
            const startOffset = this._offset(start);
            const endOffset = this._offset(end);
            const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);
            if (endOffset[1] === 0) {
                buffers.pop();
            } else {
                buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
            }
            if (startOffset[1] !== 0) {
                buffers[0] = buffers[0].slice(startOffset[1]);
            }
            return this._new(buffers);
        };
        BufferList.prototype.toString = function toString(encoding, start, end) {
            return this.slice(start, end).toString(encoding);
        };
        BufferList.prototype.consume = function consume(bytes) {
            bytes = Math.trunc(bytes);
            if (Number.isNaN(bytes) || bytes <= 0) return this;
            while(this._bufs.length){
                if (bytes >= this._bufs[0].length) {
                    bytes -= this._bufs[0].length;
                    this.length -= this._bufs[0].length;
                    this._bufs.shift();
                } else {
                    this._bufs[0] = this._bufs[0].slice(bytes);
                    this.length -= bytes;
                    break;
                }
            }
            return this;
        };
        BufferList.prototype.duplicate = function duplicate() {
            const copy = this._new();
            for(let i = 0; i < this._bufs.length; i++){
                copy.append(this._bufs[i]);
            }
            return copy;
        };
        BufferList.prototype.append = function append(buf) {
            if (buf == null) {
                return this;
            }
            if (buf.buffer) {
                this._appendBuffer(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength));
            } else if (Array.isArray(buf)) {
                for(let i = 0; i < buf.length; i++){
                    this.append(buf[i]);
                }
            } else if (this._isBufferList(buf)) {
                for(let i = 0; i < buf._bufs.length; i++){
                    this.append(buf._bufs[i]);
                }
            } else {
                if (typeof buf === "number") {
                    buf = buf.toString();
                }
                this._appendBuffer(Buffer.from(buf));
            }
            return this;
        };
        BufferList.prototype._appendBuffer = function appendBuffer(buf) {
            this._bufs.push(buf);
            this.length += buf.length;
        };
        BufferList.prototype.indexOf = function(search, offset, encoding) {
            if (encoding === undefined && typeof offset === "string") {
                encoding = offset;
                offset = undefined;
            }
            if (typeof search === "function" || Array.isArray(search)) {
                throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
            } else if (typeof search === "number") {
                search = Buffer.from([
                    search
                ]);
            } else if (typeof search === "string") {
                search = Buffer.from(search, encoding);
            } else if (this._isBufferList(search)) {
                search = search.slice();
            } else if (Array.isArray(search.buffer)) {
                search = Buffer.from(search.buffer, search.byteOffset, search.byteLength);
            } else if (!Buffer.isBuffer(search)) {
                search = Buffer.from(search);
            }
            offset = Number(offset || 0);
            if (isNaN(offset)) {
                offset = 0;
            }
            if (offset < 0) {
                offset = this.length + offset;
            }
            if (offset < 0) {
                offset = 0;
            }
            if (search.length === 0) {
                return offset > this.length ? this.length : offset;
            }
            const blOffset = this._offset(offset);
            let blIndex = blOffset[0];
            let buffOffset = blOffset[1];
            for(; blIndex < this._bufs.length; blIndex++){
                const buff = this._bufs[blIndex];
                while(buffOffset < buff.length){
                    const availableWindow = buff.length - buffOffset;
                    if (availableWindow >= search.length) {
                        const nativeSearchResult = buff.indexOf(search, buffOffset);
                        if (nativeSearchResult !== -1) {
                            return this._reverseOffset([
                                blIndex,
                                nativeSearchResult
                            ]);
                        }
                        buffOffset = buff.length - search.length + 1;
                    } else {
                        const revOffset = this._reverseOffset([
                            blIndex,
                            buffOffset
                        ]);
                        if (this._match(revOffset, search)) {
                            return revOffset;
                        }
                        buffOffset++;
                    }
                }
                buffOffset = 0;
            }
            return -1;
        };
        BufferList.prototype._match = function(offset, search) {
            if (this.length - offset < search.length) {
                return false;
            }
            for(let searchOffset = 0; searchOffset < search.length; searchOffset++){
                if (this.get(offset + searchOffset) !== search[searchOffset]) {
                    return false;
                }
            }
            return true;
        };
        (function() {
            const methods = {
                readDoubleBE: 8,
                readDoubleLE: 8,
                readFloatBE: 4,
                readFloatLE: 4,
                readInt32BE: 4,
                readInt32LE: 4,
                readUInt32BE: 4,
                readUInt32LE: 4,
                readInt16BE: 2,
                readInt16LE: 2,
                readUInt16BE: 2,
                readUInt16LE: 2,
                readInt8: 1,
                readUInt8: 1,
                readIntBE: null,
                readIntLE: null,
                readUIntBE: null,
                readUIntLE: null
            };
            for(const m in methods){
                (function(m) {
                    if (methods[m] === null) {
                        BufferList.prototype[m] = function(offset, byteLength) {
                            return this.slice(offset, offset + byteLength)[m](0, byteLength);
                        };
                    } else {
                        BufferList.prototype[m] = function(offset = 0) {
                            return this.slice(offset, offset + methods[m])[m](0);
                        };
                    }
                })(m);
            }
        })();
        BufferList.prototype._isBufferList = function _isBufferList(b) {
            return b instanceof BufferList || BufferList.isBufferList(b);
        };
        BufferList.isBufferList = function isBufferList(b) {
            return b != null && b[symbol];
        };
        module.exports = BufferList;
    },
    "350e93ff": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _packageManager = _interop_require_default._(farmRequire("3a14b483"));
        var _frame = _interop_require_default._(farmRequire("7dbb9a1f"));
        var _projectName = _interop_require_default._(farmRequire("0459d2e1"));
        var _frameQuestions = farmRequire("3caad4cd");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _question = _interop_require_default._(farmRequire("589ef9ca"));
        async function createProjectQuestions() {
            try {
                await (0, _question.default)(_projectName.default);
                await (0, _question.default)(_frame.default);
                await (0, _question.default)(_packageManager.default);
                await _frameQuestions.frameQuestions.get(_options.default.frame)();
            } catch (cancelled) {
                console.log(cancelled.message);
                process.exit(1);
            }
            return Promise.resolve();
        }
        var _default = createProjectQuestions;
    },
    "363b3386": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            TextPrompt: farmRequire("028b6fbc"),
            SelectPrompt: farmRequire("e62e619e"),
            TogglePrompt: farmRequire("9197e1e5"),
            DatePrompt: farmRequire("cee71153"),
            NumberPrompt: farmRequire("476c19f3"),
            MultiselectPrompt: farmRequire("19efc509"),
            AutocompletePrompt: farmRequire("b82d8087"),
            AutocompleteMultiselectPrompt: farmRequire("80c9ca24"),
            ConfirmPrompt: farmRequire("faa000f8")
        };
    },
    "36c024d3": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("7e487033");
        const { checkPath  } = farmRequire("d86641b2");
        const getMode = (options)=>{
            const defaults = {
                mode: 511
            };
            if (typeof options === "number") return options;
            return ({
                ...defaults,
                ...options
            }).mode;
        };
        module.exports.makeDir = async (dir, options)=>{
            checkPath(dir);
            return fs.mkdir(dir, {
                mode: getMode(options),
                recursive: true
            });
        };
        module.exports.makeDirSync = (dir, options)=>{
            checkPath(dir);
            return fs.mkdirSync(dir, {
                mode: getMode(options),
                recursive: true
            });
        };
    },
    "37a73412": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const readline = farmRequire("readline");
        const _require = farmRequire("232af10c"), action = _require.action;
        const EventEmitter = farmRequire("events");
        const _require2 = farmRequire("84d4236d"), beep = _require2.beep, cursor = _require2.cursor;
        const color = farmRequire("fbb62511");
        class Prompt extends EventEmitter {
            constructor(opts = {}){
                super();
                this.firstRender = true;
                this.in = opts.stdin || process.stdin;
                this.out = opts.stdout || process.stdout;
                this.onRender = (opts.onRender || (()=>void 0)).bind(this);
                const rl = readline.createInterface({
                    input: this.in,
                    escapeCodeTimeout: 50
                });
                readline.emitKeypressEvents(this.in, rl);
                if (this.in.isTTY) this.in.setRawMode(true);
                const isSelect = [
                    "SelectPrompt",
                    "MultiselectPrompt"
                ].indexOf(this.constructor.name) > -1;
                const keypress = (str, key)=>{
                    let a = action(key, isSelect);
                    if (a === false) {
                        this._ && this._(str, key);
                    } else if (typeof this[a] === "function") {
                        this[a](key);
                    } else {
                        this.bell();
                    }
                };
                this.close = ()=>{
                    this.out.write(cursor.show);
                    this.in.removeListener("keypress", keypress);
                    if (this.in.isTTY) this.in.setRawMode(false);
                    rl.close();
                    this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
                    this.closed = true;
                };
                this.in.on("keypress", keypress);
            }
            fire() {
                this.emit("state", {
                    value: this.value,
                    aborted: !!this.aborted,
                    exited: !!this.exited
                });
            }
            bell() {
                this.out.write(beep);
            }
            render() {
                this.onRender(color);
                if (this.firstRender) this.firstRender = false;
            }
        }
        module.exports = Prompt;
    },
    "38e5aa5a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const strip = farmRequire("902f0d3a");
        module.exports = function(msg, perLine) {
            let lines = String(strip(msg) || "").split(/\r?\n/);
            if (!perLine) return lines.length;
            return lines.map((l)=>Math.ceil(l.length / perLine)).reduce((a, b)=>a + b);
        };
    },
    "3a14b483": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _shouldUseYarn = farmRequire("8b1ecd24");
        var _shouldUsePnpm = farmRequire("2a2c0440");
        const isYarnInstalled = (0, _shouldUseYarn.shouldUseYarn)();
        const isPnpmInstalled = (0, _shouldUsePnpm.shouldUsePnpm)();
        var _default = {
            name: "package",
            type: "select",
            message: "Which package manager do you want to use ?",
            choices: [
                {
                    title: "Not Install (Manual installation)",
                    value: "none"
                },
                {
                    title: isPnpmInstalled ? "Pnpm" : "Pnpm (pnpm not install)",
                    value: "pnpm"
                },
                {
                    title: isYarnInstalled ? "Yarn" : "Yarn (yarn not install)",
                    value: "yarn"
                },
                {
                    title: "Npm",
                    value: "npm"
                }
            ]
        };
    },
    "3b465ae1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _default = {
            type: "select",
            name: "components",
            message: "choose UI frameWork",
            choices: [
                {
                    title: "Element Plus",
                    value: "elementPlus"
                },
                {
                    title: "Tiny Vue",
                    value: "tinyVue"
                },
                {
                    title: "Ant Design Vue",
                    value: "antDesignVue"
                },
                {
                    title: "Vuetify3",
                    value: "vuetify"
                },
                {
                    title: "Naive UI",
                    value: "naiveUI"
                },
                {
                    title: "Varlet Pc",
                    value: "varlet"
                },
                {
                    title: "DevUI",
                    value: "devUI"
                },
                {
                    title: "arco-design",
                    value: "arco"
                },
                {
                    title: "TDesign",
                    value: "tencent"
                },
                {
                    title: "Vant 4.x",
                    value: "vant"
                },
                {
                    title: "tdesign-mobile-vue",
                    value: "tencent-mobile"
                }
            ]
        };
    },
    "3c73064d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const mimicFn = (to, from)=>{
            for (const prop of Reflect.ownKeys(from)){
                Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
            }
            return to;
        };
        module.exports = mimicFn;
        module.exports.default = mimicFn;
    },
    "3caad4cd": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            getFilterFile: function() {
                return getFilterFile;
            },
            frameQuestions: function() {
                return frameQuestions;
            },
            filterQuestions: function() {
                return filterQuestions;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _vue = farmRequire("a49ecd25");
        var _react = farmRequire("308d0148");
        var _fs = farmRequire("fs");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        const fs = farmRequire("0fb9151f");
        const frameQuestions = new Map();
        const filterQuestions = new Map();
        frameQuestions.set("vue", _vue.runVueQuestions);
        frameQuestions.set("react", _react.runReactQuestions);
        function getFilterFile() {
            const assets = (0, _fs.readdirSync)(`${__dirname}/template/${_options.default.frame}/src/assets`).filter((item)=>!item.includes("logo"));
            async function vueFilterFileActions() {
                const res = assets.filter((item)=>item.split(".")[0] !== _options.default.components);
                res.forEach((item)=>{
                    fs.remove(`${_options.default.dest}/src/assets/${item}`);
                });
                if (!_options.default.useRouter) {
                    fs.remove(`${_options.default.dest}/src/router`);
                }
                if (!_options.default.usePinia) {
                    fs.remove(`${_options.default.dest}/src/store`);
                }
                if (!_options.default.usePrettier) {
                    fs.remove(`${_options.default.dest}/.prettierrc.js`);
                }
                if (!_options.default.useEslint) {
                    fs.remove(`${_options.default.dest}/.eslintrc.js`);
                }
                if (!_options.default.plugins.includes("html")) {
                    fs.remove(`${_options.default.dest}/build/vite/html.ts`);
                }
                if (!_options.default.plugins.includes("unocss")) {
                    fs.remove(`${_options.default.dest}/uno.config.ts`);
                }
                if (!_options.default.plugins.includes("pwa")) {
                    fs.remove(`${_options.default.dest}/src/components/Pwa.vue`);
                }
                return true;
            }
            function reactFilterQuestion() {
                return true;
            }
            const obj = new Map([
                [
                    "vue",
                    vueFilterFileActions
                ],
                [
                    "react",
                    reactFilterQuestion
                ]
            ]);
            const res = obj.get(_options.default.frame);
            return res;
        }
    },
    "3d020fdf": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const main = {
            arrowUp: "↑",
            arrowDown: "↓",
            arrowLeft: "←",
            arrowRight: "→",
            radioOn: "◉",
            radioOff: "◯",
            tick: "✔",
            cross: "✖",
            ellipsis: "…",
            pointerSmall: "›",
            line: "─",
            pointer: "❯"
        };
        const win = {
            arrowUp: main.arrowUp,
            arrowDown: main.arrowDown,
            arrowLeft: main.arrowLeft,
            arrowRight: main.arrowRight,
            radioOn: "(*)",
            radioOff: "( )",
            tick: "√",
            cross: "\xd7",
            ellipsis: "...",
            pointerSmall: "\xbb",
            line: "─",
            pointer: ">"
        };
        const figures = process.platform === "win32" ? win : main;
        module.exports = figures;
    },
    "3d1ca971": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        module.exports = {
            move: u(farmRequire("c292cc33")),
            moveSync: farmRequire("8a4eca8e")
        };
    },
    "3fce59d7": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var _Object$setPrototypeO;
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }
        var finished = farmRequire("ae3cbc8b");
        var kLastResolve = Symbol("lastResolve");
        var kLastReject = Symbol("lastReject");
        var kError = Symbol("error");
        var kEnded = Symbol("ended");
        var kLastPromise = Symbol("lastPromise");
        var kHandlePromise = Symbol("handlePromise");
        var kStream = Symbol("stream");
        function createIterResult(value, done) {
            return {
                value: value,
                done: done
            };
        }
        function readAndResolve(iter) {
            var resolve = iter[kLastResolve];
            if (resolve !== null) {
                var data = iter[kStream].read();
                if (data !== null) {
                    iter[kLastPromise] = null;
                    iter[kLastResolve] = null;
                    iter[kLastReject] = null;
                    resolve(createIterResult(data, false));
                }
            }
        }
        function onReadable(iter) {
            process.nextTick(readAndResolve, iter);
        }
        function wrapForNext(lastPromise, iter) {
            return function(resolve, reject) {
                lastPromise.then(function() {
                    if (iter[kEnded]) {
                        resolve(createIterResult(undefined, true));
                        return;
                    }
                    iter[kHandlePromise](resolve, reject);
                }, reject);
            };
        }
        var AsyncIteratorPrototype = Object.getPrototypeOf(function() {});
        var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
            get stream () {
                return this[kStream];
            },
            next: function next() {
                var _this = this;
                var error = this[kError];
                if (error !== null) {
                    return Promise.reject(error);
                }
                if (this[kEnded]) {
                    return Promise.resolve(createIterResult(undefined, true));
                }
                if (this[kStream].destroyed) {
                    return new Promise(function(resolve, reject) {
                        process.nextTick(function() {
                            if (_this[kError]) {
                                reject(_this[kError]);
                            } else {
                                resolve(createIterResult(undefined, true));
                            }
                        });
                    });
                }
                var lastPromise = this[kLastPromise];
                var promise;
                if (lastPromise) {
                    promise = new Promise(wrapForNext(lastPromise, this));
                } else {
                    var data = this[kStream].read();
                    if (data !== null) {
                        return Promise.resolve(createIterResult(data, false));
                    }
                    promise = new Promise(this[kHandlePromise]);
                }
                this[kLastPromise] = promise;
                return promise;
            }
        }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
            return this;
        }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
            var _this2 = this;
            return new Promise(function(resolve, reject) {
                _this2[kStream].destroy(null, function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(createIterResult(undefined, true));
                });
            });
        }), _Object$setPrototypeO), AsyncIteratorPrototype);
        var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
            var _Object$create;
            var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
                value: stream,
                writable: true
            }), _defineProperty(_Object$create, kLastResolve, {
                value: null,
                writable: true
            }), _defineProperty(_Object$create, kLastReject, {
                value: null,
                writable: true
            }), _defineProperty(_Object$create, kError, {
                value: null,
                writable: true
            }), _defineProperty(_Object$create, kEnded, {
                value: stream._readableState.endEmitted,
                writable: true
            }), _defineProperty(_Object$create, kHandlePromise, {
                value: function value(resolve, reject) {
                    var data = iterator[kStream].read();
                    if (data) {
                        iterator[kLastPromise] = null;
                        iterator[kLastResolve] = null;
                        iterator[kLastReject] = null;
                        resolve(createIterResult(data, false));
                    } else {
                        iterator[kLastResolve] = resolve;
                        iterator[kLastReject] = reject;
                    }
                },
                writable: true
            }), _Object$create));
            iterator[kLastPromise] = null;
            finished(stream, function(err) {
                if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                    var reject = iterator[kLastReject];
                    if (reject !== null) {
                        iterator[kLastPromise] = null;
                        iterator[kLastResolve] = null;
                        iterator[kLastReject] = null;
                        reject(err);
                    }
                    iterator[kError] = err;
                    return;
                }
                var resolve = iterator[kLastResolve];
                if (resolve !== null) {
                    iterator[kLastPromise] = null;
                    iterator[kLastResolve] = null;
                    iterator[kLastReject] = null;
                    resolve(createIterResult(undefined, true));
                }
                iterator[kEnded] = true;
            });
            stream.on("readable", onReadable.bind(null, iterator));
            return iterator;
        };
        module.exports = createReadableStreamAsyncIterator;
    },
    "40852176": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const { cursor  } = farmRequire("84d4236d");
        const MultiselectPrompt = farmRequire("12aba9ec");
        const { clear , style , figures  } = farmRequire("b8d8683f");
        class AutocompleteMultiselectPrompt extends MultiselectPrompt {
            constructor(opts = {}){
                opts.overrideRender = true;
                super(opts);
                this.inputValue = "";
                this.clear = clear("", this.out.columns);
                this.filteredOptions = this.value;
                this.render();
            }
            last() {
                this.cursor = this.filteredOptions.length - 1;
                this.render();
            }
            next() {
                this.cursor = (this.cursor + 1) % this.filteredOptions.length;
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.cursor = this.filteredOptions.length - 1;
                } else {
                    this.cursor--;
                }
                this.render();
            }
            down() {
                if (this.cursor === this.filteredOptions.length - 1) {
                    this.cursor = 0;
                } else {
                    this.cursor++;
                }
                this.render();
            }
            left() {
                this.filteredOptions[this.cursor].selected = false;
                this.render();
            }
            right() {
                if (this.value.filter((e)=>e.selected).length >= this.maxChoices) return this.bell();
                this.filteredOptions[this.cursor].selected = true;
                this.render();
            }
            delete() {
                if (this.inputValue.length) {
                    this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
                    this.updateFilteredOptions();
                }
            }
            updateFilteredOptions() {
                const currentHighlight = this.filteredOptions[this.cursor];
                this.filteredOptions = this.value.filter((v)=>{
                    if (this.inputValue) {
                        if (typeof v.title === "string") {
                            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
                                return true;
                            }
                        }
                        if (typeof v.value === "string") {
                            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                });
                const newHighlightIndex = this.filteredOptions.findIndex((v)=>v === currentHighlight);
                this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
                this.render();
            }
            handleSpaceToggle() {
                const v = this.filteredOptions[this.cursor];
                if (v.selected) {
                    v.selected = false;
                    this.render();
                } else if (v.disabled || this.value.filter((e)=>e.selected).length >= this.maxChoices) {
                    return this.bell();
                } else {
                    v.selected = true;
                    this.render();
                }
            }
            handleInputChange(c) {
                this.inputValue = this.inputValue + c;
                this.updateFilteredOptions();
            }
            _(c, key) {
                if (c === " ") {
                    this.handleSpaceToggle();
                } else {
                    this.handleInputChange(c);
                }
            }
            renderInstructions() {
                if (this.instructions === undefined || this.instructions) {
                    if (typeof this.instructions === "string") {
                        return this.instructions;
                    }
                    return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
                }
                return "";
            }
            renderCurrentInput() {
                return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
            }
            renderOption(cursor, v, i) {
                let title;
                if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                else title = cursor === i ? color.cyan().underline(v.title) : v.title;
                return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
            }
            renderDoneOrInstructions() {
                if (this.done) {
                    return this.value.filter((e)=>e.selected).map((v)=>v.title).join(", ");
                }
                const output = [
                    color.gray(this.hint),
                    this.renderInstructions(),
                    this.renderCurrentInput()
                ];
                if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
                    output.push(color.yellow(this.warn));
                }
                return output.join(" ");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                super.render();
                let prompt = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.renderDoneOrInstructions()
                ].join(" ");
                if (this.showMinError) {
                    prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
                    this.showMinError = false;
                }
                prompt += this.renderOptions(this.filteredOptions);
                this.out.write(this.clear + prompt);
                this.clear = clear(prompt, this.out.columns);
            }
        }
        module.exports = AutocompleteMultiselectPrompt;
    },
    "409f98e3": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = Readable;
        var Duplex;
        Readable.ReadableState = ReadableState;
        var EE = farmRequire("events").EventEmitter;
        var EElistenerCount = function EElistenerCount(emitter, type) {
            return emitter.listeners(type).length;
        };
        var Stream = farmRequire("a6884590");
        var Buffer = farmRequire("buffer").Buffer;
        var OurUint8Array = global.Uint8Array || function() {};
        function _uint8ArrayToBuffer(chunk) {
            return Buffer.from(chunk);
        }
        function _isUint8Array(obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
        }
        var debugUtil = farmRequire("util");
        var debug;
        if (debugUtil && debugUtil.debuglog) {
            debug = debugUtil.debuglog("stream");
        } else {
            debug = function debug() {};
        }
        var BufferList = farmRequire("4832188a");
        var destroyImpl = farmRequire("e45b1b1d");
        var _require = farmRequire("677e52b5"), getHighWaterMark = _require.getHighWaterMark;
        var _require$codes = farmRequire("1c800b7b").codes, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
        var StringDecoder;
        var createReadableStreamAsyncIterator;
        var from;
        farmRequire("6e507463")(Readable, Stream);
        var errorOrDestroy = destroyImpl.errorOrDestroy;
        var kProxyEvents = [
            "error",
            "close",
            "destroy",
            "pause",
            "resume"
        ];
        function prependListener(emitter, event, fn) {
            if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
            if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
            else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
            else emitter._events[event] = [
                fn,
                emitter._events[event]
            ];
        }
        function ReadableState(options, stream, isDuplex) {
            Duplex = Duplex || farmRequire("24f368d5");
            options = options || {};
            if (typeof isDuplex !== "boolean") isDuplex = stream instanceof Duplex;
            this.objectMode = !!options.objectMode;
            if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
            this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
            this.buffer = new BufferList();
            this.length = 0;
            this.pipes = null;
            this.pipesCount = 0;
            this.flowing = null;
            this.ended = false;
            this.endEmitted = false;
            this.reading = false;
            this.sync = true;
            this.needReadable = false;
            this.emittedReadable = false;
            this.readableListening = false;
            this.resumeScheduled = false;
            this.paused = true;
            this.emitClose = options.emitClose !== false;
            this.autoDestroy = !!options.autoDestroy;
            this.destroyed = false;
            this.defaultEncoding = options.defaultEncoding || "utf8";
            this.awaitDrain = 0;
            this.readingMore = false;
            this.decoder = null;
            this.encoding = null;
            if (options.encoding) {
                if (!StringDecoder) StringDecoder = farmRequire("807d09a4").StringDecoder;
                this.decoder = new StringDecoder(options.encoding);
                this.encoding = options.encoding;
            }
        }
        function Readable(options) {
            Duplex = Duplex || farmRequire("24f368d5");
            if (!(this instanceof Readable)) return new Readable(options);
            var isDuplex = this instanceof Duplex;
            this._readableState = new ReadableState(options, this, isDuplex);
            this.readable = true;
            if (options) {
                if (typeof options.read === "function") this._read = options.read;
                if (typeof options.destroy === "function") this._destroy = options.destroy;
            }
            Stream.call(this);
        }
        Object.defineProperty(Readable.prototype, "destroyed", {
            enumerable: false,
            get: function get() {
                if (this._readableState === undefined) {
                    return false;
                }
                return this._readableState.destroyed;
            },
            set: function set(value) {
                if (!this._readableState) {
                    return;
                }
                this._readableState.destroyed = value;
            }
        });
        Readable.prototype.destroy = destroyImpl.destroy;
        Readable.prototype._undestroy = destroyImpl.undestroy;
        Readable.prototype._destroy = function(err, cb) {
            cb(err);
        };
        Readable.prototype.push = function(chunk, encoding) {
            var state = this._readableState;
            var skipChunkCheck;
            if (!state.objectMode) {
                if (typeof chunk === "string") {
                    encoding = encoding || state.defaultEncoding;
                    if (encoding !== state.encoding) {
                        chunk = Buffer.from(chunk, encoding);
                        encoding = "";
                    }
                    skipChunkCheck = true;
                }
            } else {
                skipChunkCheck = true;
            }
            return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
        };
        Readable.prototype.unshift = function(chunk) {
            return readableAddChunk(this, chunk, null, true, false);
        };
        function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
            debug("readableAddChunk", chunk);
            var state = stream._readableState;
            if (chunk === null) {
                state.reading = false;
                onEofChunk(stream, state);
            } else {
                var er;
                if (!skipChunkCheck) er = chunkInvalid(state, chunk);
                if (er) {
                    errorOrDestroy(stream, er);
                } else if (state.objectMode || chunk && chunk.length > 0) {
                    if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
                        chunk = _uint8ArrayToBuffer(chunk);
                    }
                    if (addToFront) {
                        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
                        else addChunk(stream, state, chunk, true);
                    } else if (state.ended) {
                        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
                    } else if (state.destroyed) {
                        return false;
                    } else {
                        state.reading = false;
                        if (state.decoder && !encoding) {
                            chunk = state.decoder.write(chunk);
                            if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
                            else maybeReadMore(stream, state);
                        } else {
                            addChunk(stream, state, chunk, false);
                        }
                    }
                } else if (!addToFront) {
                    state.reading = false;
                    maybeReadMore(stream, state);
                }
            }
            return !state.ended && (state.length < state.highWaterMark || state.length === 0);
        }
        function addChunk(stream, state, chunk, addToFront) {
            if (state.flowing && state.length === 0 && !state.sync) {
                state.awaitDrain = 0;
                stream.emit("data", chunk);
            } else {
                state.length += state.objectMode ? 1 : chunk.length;
                if (addToFront) state.buffer.unshift(chunk);
                else state.buffer.push(chunk);
                if (state.needReadable) emitReadable(stream);
            }
            maybeReadMore(stream, state);
        }
        function chunkInvalid(state, chunk) {
            var er;
            if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
                er = new ERR_INVALID_ARG_TYPE("chunk", [
                    "string",
                    "Buffer",
                    "Uint8Array"
                ], chunk);
            }
            return er;
        }
        Readable.prototype.isPaused = function() {
            return this._readableState.flowing === false;
        };
        Readable.prototype.setEncoding = function(enc) {
            if (!StringDecoder) StringDecoder = farmRequire("807d09a4").StringDecoder;
            var decoder = new StringDecoder(enc);
            this._readableState.decoder = decoder;
            this._readableState.encoding = this._readableState.decoder.encoding;
            var p = this._readableState.buffer.head;
            var content = "";
            while(p !== null){
                content += decoder.write(p.data);
                p = p.next;
            }
            this._readableState.buffer.clear();
            if (content !== "") this._readableState.buffer.push(content);
            this._readableState.length = content.length;
            return this;
        };
        var MAX_HWM = 0x40000000;
        function computeNewHighWaterMark(n) {
            if (n >= MAX_HWM) {
                n = MAX_HWM;
            } else {
                n--;
                n |= n >>> 1;
                n |= n >>> 2;
                n |= n >>> 4;
                n |= n >>> 8;
                n |= n >>> 16;
                n++;
            }
            return n;
        }
        function howMuchToRead(n, state) {
            if (n <= 0 || state.length === 0 && state.ended) return 0;
            if (state.objectMode) return 1;
            if (n !== n) {
                if (state.flowing && state.length) return state.buffer.head.data.length;
                else return state.length;
            }
            if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
            if (n <= state.length) return n;
            if (!state.ended) {
                state.needReadable = true;
                return 0;
            }
            return state.length;
        }
        Readable.prototype.read = function(n) {
            debug("read", n);
            n = parseInt(n, 10);
            var state = this._readableState;
            var nOrig = n;
            if (n !== 0) state.emittedReadable = false;
            if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
                debug("read: emitReadable", state.length, state.ended);
                if (state.length === 0 && state.ended) endReadable(this);
                else emitReadable(this);
                return null;
            }
            n = howMuchToRead(n, state);
            if (n === 0 && state.ended) {
                if (state.length === 0) endReadable(this);
                return null;
            }
            var doRead = state.needReadable;
            debug("need readable", doRead);
            if (state.length === 0 || state.length - n < state.highWaterMark) {
                doRead = true;
                debug("length less than watermark", doRead);
            }
            if (state.ended || state.reading) {
                doRead = false;
                debug("reading or ended", doRead);
            } else if (doRead) {
                debug("do read");
                state.reading = true;
                state.sync = true;
                if (state.length === 0) state.needReadable = true;
                this._read(state.highWaterMark);
                state.sync = false;
                if (!state.reading) n = howMuchToRead(nOrig, state);
            }
            var ret;
            if (n > 0) ret = fromList(n, state);
            else ret = null;
            if (ret === null) {
                state.needReadable = state.length <= state.highWaterMark;
                n = 0;
            } else {
                state.length -= n;
                state.awaitDrain = 0;
            }
            if (state.length === 0) {
                if (!state.ended) state.needReadable = true;
                if (nOrig !== n && state.ended) endReadable(this);
            }
            if (ret !== null) this.emit("data", ret);
            return ret;
        };
        function onEofChunk(stream, state) {
            debug("onEofChunk");
            if (state.ended) return;
            if (state.decoder) {
                var chunk = state.decoder.end();
                if (chunk && chunk.length) {
                    state.buffer.push(chunk);
                    state.length += state.objectMode ? 1 : chunk.length;
                }
            }
            state.ended = true;
            if (state.sync) {
                emitReadable(stream);
            } else {
                state.needReadable = false;
                if (!state.emittedReadable) {
                    state.emittedReadable = true;
                    emitReadable_(stream);
                }
            }
        }
        function emitReadable(stream) {
            var state = stream._readableState;
            debug("emitReadable", state.needReadable, state.emittedReadable);
            state.needReadable = false;
            if (!state.emittedReadable) {
                debug("emitReadable", state.flowing);
                state.emittedReadable = true;
                process.nextTick(emitReadable_, stream);
            }
        }
        function emitReadable_(stream) {
            var state = stream._readableState;
            debug("emitReadable_", state.destroyed, state.length, state.ended);
            if (!state.destroyed && (state.length || state.ended)) {
                stream.emit("readable");
                state.emittedReadable = false;
            }
            state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
            flow(stream);
        }
        function maybeReadMore(stream, state) {
            if (!state.readingMore) {
                state.readingMore = true;
                process.nextTick(maybeReadMore_, stream, state);
            }
        }
        function maybeReadMore_(stream, state) {
            while(!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)){
                var len = state.length;
                debug("maybeReadMore read 0");
                stream.read(0);
                if (len === state.length) break;
            }
            state.readingMore = false;
        }
        Readable.prototype._read = function(n) {
            errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
        };
        Readable.prototype.pipe = function(dest, pipeOpts) {
            var src = this;
            var state = this._readableState;
            switch(state.pipesCount){
                case 0:
                    state.pipes = dest;
                    break;
                case 1:
                    state.pipes = [
                        state.pipes,
                        dest
                    ];
                    break;
                default:
                    state.pipes.push(dest);
                    break;
            }
            state.pipesCount += 1;
            debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
            var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
            var endFn = doEnd ? onend : unpipe;
            if (state.endEmitted) process.nextTick(endFn);
            else src.once("end", endFn);
            dest.on("unpipe", onunpipe);
            function onunpipe(readable, unpipeInfo) {
                debug("onunpipe");
                if (readable === src) {
                    if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                        unpipeInfo.hasUnpiped = true;
                        cleanup();
                    }
                }
            }
            function onend() {
                debug("onend");
                dest.end();
            }
            var ondrain = pipeOnDrain(src);
            dest.on("drain", ondrain);
            var cleanedUp = false;
            function cleanup() {
                debug("cleanup");
                dest.removeListener("close", onclose);
                dest.removeListener("finish", onfinish);
                dest.removeListener("drain", ondrain);
                dest.removeListener("error", onerror);
                dest.removeListener("unpipe", onunpipe);
                src.removeListener("end", onend);
                src.removeListener("end", unpipe);
                src.removeListener("data", ondata);
                cleanedUp = true;
                if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
            }
            src.on("data", ondata);
            function ondata(chunk) {
                debug("ondata");
                var ret = dest.write(chunk);
                debug("dest.write", ret);
                if (ret === false) {
                    if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                        debug("false write response, pause", state.awaitDrain);
                        state.awaitDrain++;
                    }
                    src.pause();
                }
            }
            function onerror(er) {
                debug("onerror", er);
                unpipe();
                dest.removeListener("error", onerror);
                if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
            }
            prependListener(dest, "error", onerror);
            function onclose() {
                dest.removeListener("finish", onfinish);
                unpipe();
            }
            dest.once("close", onclose);
            function onfinish() {
                debug("onfinish");
                dest.removeListener("close", onclose);
                unpipe();
            }
            dest.once("finish", onfinish);
            function unpipe() {
                debug("unpipe");
                src.unpipe(dest);
            }
            dest.emit("pipe", src);
            if (!state.flowing) {
                debug("pipe resume");
                src.resume();
            }
            return dest;
        };
        function pipeOnDrain(src) {
            return function pipeOnDrainFunctionResult() {
                var state = src._readableState;
                debug("pipeOnDrain", state.awaitDrain);
                if (state.awaitDrain) state.awaitDrain--;
                if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
                    state.flowing = true;
                    flow(src);
                }
            };
        }
        Readable.prototype.unpipe = function(dest) {
            var state = this._readableState;
            var unpipeInfo = {
                hasUnpiped: false
            };
            if (state.pipesCount === 0) return this;
            if (state.pipesCount === 1) {
                if (dest && dest !== state.pipes) return this;
                if (!dest) dest = state.pipes;
                state.pipes = null;
                state.pipesCount = 0;
                state.flowing = false;
                if (dest) dest.emit("unpipe", this, unpipeInfo);
                return this;
            }
            if (!dest) {
                var dests = state.pipes;
                var len = state.pipesCount;
                state.pipes = null;
                state.pipesCount = 0;
                state.flowing = false;
                for(var i = 0; i < len; i++){
                    dests[i].emit("unpipe", this, {
                        hasUnpiped: false
                    });
                }
                return this;
            }
            var index = indexOf(state.pipes, dest);
            if (index === -1) return this;
            state.pipes.splice(index, 1);
            state.pipesCount -= 1;
            if (state.pipesCount === 1) state.pipes = state.pipes[0];
            dest.emit("unpipe", this, unpipeInfo);
            return this;
        };
        Readable.prototype.on = function(ev, fn) {
            var res = Stream.prototype.on.call(this, ev, fn);
            var state = this._readableState;
            if (ev === "data") {
                state.readableListening = this.listenerCount("readable") > 0;
                if (state.flowing !== false) this.resume();
            } else if (ev === "readable") {
                if (!state.endEmitted && !state.readableListening) {
                    state.readableListening = state.needReadable = true;
                    state.flowing = false;
                    state.emittedReadable = false;
                    debug("on readable", state.length, state.reading);
                    if (state.length) {
                        emitReadable(this);
                    } else if (!state.reading) {
                        process.nextTick(nReadingNextTick, this);
                    }
                }
            }
            return res;
        };
        Readable.prototype.addListener = Readable.prototype.on;
        Readable.prototype.removeListener = function(ev, fn) {
            var res = Stream.prototype.removeListener.call(this, ev, fn);
            if (ev === "readable") {
                process.nextTick(updateReadableListening, this);
            }
            return res;
        };
        Readable.prototype.removeAllListeners = function(ev) {
            var res = Stream.prototype.removeAllListeners.apply(this, arguments);
            if (ev === "readable" || ev === undefined) {
                process.nextTick(updateReadableListening, this);
            }
            return res;
        };
        function updateReadableListening(self) {
            var state = self._readableState;
            state.readableListening = self.listenerCount("readable") > 0;
            if (state.resumeScheduled && !state.paused) {
                state.flowing = true;
            } else if (self.listenerCount("data") > 0) {
                self.resume();
            }
        }
        function nReadingNextTick(self) {
            debug("readable nexttick read 0");
            self.read(0);
        }
        Readable.prototype.resume = function() {
            var state = this._readableState;
            if (!state.flowing) {
                debug("resume");
                state.flowing = !state.readableListening;
                resume(this, state);
            }
            state.paused = false;
            return this;
        };
        function resume(stream, state) {
            if (!state.resumeScheduled) {
                state.resumeScheduled = true;
                process.nextTick(resume_, stream, state);
            }
        }
        function resume_(stream, state) {
            debug("resume", state.reading);
            if (!state.reading) {
                stream.read(0);
            }
            state.resumeScheduled = false;
            stream.emit("resume");
            flow(stream);
            if (state.flowing && !state.reading) stream.read(0);
        }
        Readable.prototype.pause = function() {
            debug("call pause flowing=%j", this._readableState.flowing);
            if (this._readableState.flowing !== false) {
                debug("pause");
                this._readableState.flowing = false;
                this.emit("pause");
            }
            this._readableState.paused = true;
            return this;
        };
        function flow(stream) {
            var state = stream._readableState;
            debug("flow", state.flowing);
            while(state.flowing && stream.read() !== null){
                ;
            }
        }
        Readable.prototype.wrap = function(stream) {
            var _this = this;
            var state = this._readableState;
            var paused = false;
            stream.on("end", function() {
                debug("wrapped end");
                if (state.decoder && !state.ended) {
                    var chunk = state.decoder.end();
                    if (chunk && chunk.length) _this.push(chunk);
                }
                _this.push(null);
            });
            stream.on("data", function(chunk) {
                debug("wrapped data");
                if (state.decoder) chunk = state.decoder.write(chunk);
                if (state.objectMode && (chunk === null || chunk === undefined)) return;
                else if (!state.objectMode && (!chunk || !chunk.length)) return;
                var ret = _this.push(chunk);
                if (!ret) {
                    paused = true;
                    stream.pause();
                }
            });
            for(var i in stream){
                if (this[i] === undefined && typeof stream[i] === "function") {
                    this[i] = function methodWrap(method) {
                        return function methodWrapReturnFunction() {
                            return stream[method].apply(stream, arguments);
                        };
                    }(i);
                }
            }
            for(var n = 0; n < kProxyEvents.length; n++){
                stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
            }
            this._read = function(n) {
                debug("wrapped _read", n);
                if (paused) {
                    paused = false;
                    stream.resume();
                }
            };
            return this;
        };
        if (typeof Symbol === "function") {
            Readable.prototype[Symbol.asyncIterator] = function() {
                if (createReadableStreamAsyncIterator === undefined) {
                    createReadableStreamAsyncIterator = farmRequire("3fce59d7");
                }
                return createReadableStreamAsyncIterator(this);
            };
        }
        Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
            enumerable: false,
            get: function get() {
                return this._readableState.highWaterMark;
            }
        });
        Object.defineProperty(Readable.prototype, "readableBuffer", {
            enumerable: false,
            get: function get() {
                return this._readableState && this._readableState.buffer;
            }
        });
        Object.defineProperty(Readable.prototype, "readableFlowing", {
            enumerable: false,
            get: function get() {
                return this._readableState.flowing;
            },
            set: function set(state) {
                if (this._readableState) {
                    this._readableState.flowing = state;
                }
            }
        });
        Readable._fromList = fromList;
        Object.defineProperty(Readable.prototype, "readableLength", {
            enumerable: false,
            get: function get() {
                return this._readableState.length;
            }
        });
        function fromList(n, state) {
            if (state.length === 0) return null;
            var ret;
            if (state.objectMode) ret = state.buffer.shift();
            else if (!n || n >= state.length) {
                if (state.decoder) ret = state.buffer.join("");
                else if (state.buffer.length === 1) ret = state.buffer.first();
                else ret = state.buffer.concat(state.length);
                state.buffer.clear();
            } else {
                ret = state.buffer.consume(n, state.decoder);
            }
            return ret;
        }
        function endReadable(stream) {
            var state = stream._readableState;
            debug("endReadable", state.endEmitted);
            if (!state.endEmitted) {
                state.ended = true;
                process.nextTick(endReadableNT, state, stream);
            }
        }
        function endReadableNT(state, stream) {
            debug("endReadableNT", state.endEmitted, state.length);
            if (!state.endEmitted && state.length === 0) {
                state.endEmitted = true;
                stream.readable = false;
                stream.emit("end");
                if (state.autoDestroy) {
                    var wState = stream._writableState;
                    if (!wState || wState.autoDestroy && wState.finished) {
                        stream.destroy();
                    }
                }
            }
        }
        if (typeof Symbol === "function") {
            Readable.from = function(iterable, opts) {
                if (from === undefined) {
                    from = farmRequire("47eb450e");
                }
                return from(Readable, iterable, opts);
            };
        }
        function indexOf(xs, x) {
            for(var i = 0, l = xs.length; i < l; i++){
                if (xs[i] === x) return i;
            }
            return -1;
        }
    },
    "417025f1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const readline = farmRequire("readline");
        const { action  } = farmRequire("b8d8683f");
        const EventEmitter = farmRequire("events");
        const { beep , cursor  } = farmRequire("84d4236d");
        const color = farmRequire("fbb62511");
        class Prompt extends EventEmitter {
            constructor(opts = {}){
                super();
                this.firstRender = true;
                this.in = opts.stdin || process.stdin;
                this.out = opts.stdout || process.stdout;
                this.onRender = (opts.onRender || (()=>void 0)).bind(this);
                const rl = readline.createInterface({
                    input: this.in,
                    escapeCodeTimeout: 50
                });
                readline.emitKeypressEvents(this.in, rl);
                if (this.in.isTTY) this.in.setRawMode(true);
                const isSelect = [
                    "SelectPrompt",
                    "MultiselectPrompt"
                ].indexOf(this.constructor.name) > -1;
                const keypress = (str, key)=>{
                    let a = action(key, isSelect);
                    if (a === false) {
                        this._ && this._(str, key);
                    } else if (typeof this[a] === "function") {
                        this[a](key);
                    } else {
                        this.bell();
                    }
                };
                this.close = ()=>{
                    this.out.write(cursor.show);
                    this.in.removeListener("keypress", keypress);
                    if (this.in.isTTY) this.in.setRawMode(false);
                    rl.close();
                    this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
                    this.closed = true;
                };
                this.in.on("keypress", keypress);
            }
            fire() {
                this.emit("state", {
                    value: this.value,
                    aborted: !!this.aborted,
                    exited: !!this.exited
                });
            }
            bell() {
                this.out.write(beep);
            }
            render() {
                this.onRender(color);
                if (this.firstRender) this.firstRender = false;
            }
        }
        module.exports = Prompt;
    },
    "43482b8b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromPromise;
        const { makeDir: _makeDir , makeDirSync  } = farmRequire("36c024d3");
        const makeDir = u(_makeDir);
        module.exports = {
            mkdirs: makeDir,
            mkdirsSync: makeDirSync,
            mkdirp: makeDir,
            mkdirpSync: makeDirSync,
            ensureDir: makeDir,
            ensureDirSync: makeDirSync
        };
    },
    "476c19f3": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("84d4236d"), cursor = _require.cursor, erase = _require.erase;
        const _require2 = farmRequire("232af10c"), style = _require2.style, figures = _require2.figures, clear = _require2.clear, lines = _require2.lines;
        const isNumber = /[0-9]/;
        const isDef = (any)=>any !== undefined;
        const round = (number, precision)=>{
            let factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        };
        class NumberPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.transform = style.render(opts.style);
                this.msg = opts.message;
                this.initial = isDef(opts.initial) ? opts.initial : "";
                this.float = !!opts.float;
                this.round = opts.round || 2;
                this.inc = opts.increment || 1;
                this.min = isDef(opts.min) ? opts.min : -Infinity;
                this.max = isDef(opts.max) ? opts.max : Infinity;
                this.errorMsg = opts.error || `Please Enter A Valid Value`;
                this.validator = opts.validate || (()=>true);
                this.color = `cyan`;
                this.value = ``;
                this.typed = ``;
                this.lastHit = 0;
                this.render();
            }
            set value(v) {
                if (!v && v !== 0) {
                    this.placeholder = true;
                    this.rendered = color.gray(this.transform.render(`${this.initial}`));
                    this._value = ``;
                } else {
                    this.placeholder = false;
                    this.rendered = this.transform.render(`${round(v, this.round)}`);
                    this._value = round(v, this.round);
                }
                this.fire();
            }
            get value() {
                return this._value;
            }
            parse(x) {
                return this.float ? parseFloat(x) : parseInt(x);
            }
            valid(c) {
                return c === `-` || c === `.` && this.float || isNumber.test(c);
            }
            reset() {
                this.typed = ``;
                this.value = ``;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                let x = this.value;
                this.value = x !== `` ? x : this.initial;
                this.done = this.aborted = true;
                this.error = false;
                this.fire();
                this.render();
                this.out.write(`\n`);
                this.close();
            }
            validate() {
                var _this = this;
                return _asyncToGenerator(function*() {
                    let valid = yield _this.validator(_this.value);
                    if (typeof valid === `string`) {
                        _this.errorMsg = valid;
                        valid = false;
                    }
                    _this.error = !valid;
                })();
            }
            submit() {
                var _this2 = this;
                return _asyncToGenerator(function*() {
                    yield _this2.validate();
                    if (_this2.error) {
                        _this2.color = `red`;
                        _this2.fire();
                        _this2.render();
                        return;
                    }
                    let x = _this2.value;
                    _this2.value = x !== `` ? x : _this2.initial;
                    _this2.done = true;
                    _this2.aborted = false;
                    _this2.error = false;
                    _this2.fire();
                    _this2.render();
                    _this2.out.write(`\n`);
                    _this2.close();
                })();
            }
            up() {
                this.typed = ``;
                if (this.value === "") {
                    this.value = this.min - this.inc;
                }
                if (this.value >= this.max) return this.bell();
                this.value += this.inc;
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            down() {
                this.typed = ``;
                if (this.value === "") {
                    this.value = this.min + this.inc;
                }
                if (this.value <= this.min) return this.bell();
                this.value -= this.inc;
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            delete() {
                let val = this.value.toString();
                if (val.length === 0) return this.bell();
                this.value = this.parse(val = val.slice(0, -1)) || ``;
                if (this.value !== "" && this.value < this.min) {
                    this.value = this.min;
                }
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            next() {
                this.value = this.initial;
                this.fire();
                this.render();
            }
            _(c, key) {
                if (!this.valid(c)) return this.bell();
                const now = Date.now();
                if (now - this.lastHit > 1000) this.typed = ``;
                this.typed += c;
                this.lastHit = now;
                this.color = `cyan`;
                if (c === `.`) return this.fire();
                this.value = Math.min(this.parse(this.typed), this.max);
                if (this.value > this.max) this.value = this.max;
                if (this.value < this.min) this.value = this.min;
                this.fire();
                this.render();
            }
            render() {
                if (this.closed) return;
                if (!this.firstRender) {
                    if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
                    this.out.write(clear(this.outputText, this.out.columns));
                }
                super.render();
                this.outputError = "";
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
                ].join(` `);
                if (this.error) {
                    this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i)=>a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
            }
        }
        module.exports = NumberPrompt;
    },
    "47e5593c": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = farmRequire("util").deprecate;
    },
    "47eb450e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
                keys.push.apply(keys, symbols);
            }
            return keys;
        }
        function _objectSpread(target) {
            for(var i = 1; i < arguments.length; i++){
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) {
                    ownKeys(Object(source), true).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                    ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
            }
            return target;
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }
        var ERR_INVALID_ARG_TYPE = farmRequire("1c800b7b").codes.ERR_INVALID_ARG_TYPE;
        function from(Readable, iterable, opts) {
            var iterator;
            if (iterable && typeof iterable.next === "function") {
                iterator = iterable;
            } else if (iterable && iterable[Symbol.asyncIterator]) iterator = iterable[Symbol.asyncIterator]();
            else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]();
            else throw new ERR_INVALID_ARG_TYPE("iterable", [
                "Iterable"
            ], iterable);
            var readable = new Readable(_objectSpread({
                objectMode: true
            }, opts));
            var reading = false;
            readable._read = function() {
                if (!reading) {
                    reading = true;
                    next();
                }
            };
            function next() {
                return _next2.apply(this, arguments);
            }
            function _next2() {
                _next2 = _asyncToGenerator(function*() {
                    try {
                        var _ref = yield iterator.next(), value = _ref.value, done = _ref.done;
                        if (done) {
                            readable.push(null);
                        } else if (readable.push((yield value))) {
                            next();
                        } else {
                            reading = false;
                        }
                    } catch (err) {
                        readable.destroy(err);
                    }
                });
                return _next2.apply(this, arguments);
            }
            return readable;
        }
        module.exports = from;
    },
    "48168bb0": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Milliseconds extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMilliseconds(this.date.getMilliseconds() + 1);
            }
            down() {
                this.date.setMilliseconds(this.date.getMilliseconds() - 1);
            }
            setTo(val) {
                this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
            }
            toString() {
                return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
            }
        }
        module.exports = Milliseconds;
    },
    "4832188a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
                keys.push.apply(keys, symbols);
            }
            return keys;
        }
        function _objectSpread(target) {
            for(var i = 1; i < arguments.length; i++){
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) {
                    ownKeys(Object(source), true).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                    ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
            }
            return target;
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _defineProperties(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var _require = farmRequire("buffer"), Buffer = _require.Buffer;
        var _require2 = farmRequire("util"), inspect = _require2.inspect;
        var custom = inspect && inspect.custom || "inspect";
        function copyBuffer(src, target, offset) {
            Buffer.prototype.copy.call(src, target, offset);
        }
        module.exports = function() {
            function BufferList() {
                _classCallCheck(this, BufferList);
                this.head = null;
                this.tail = null;
                this.length = 0;
            }
            _createClass(BufferList, [
                {
                    key: "push",
                    value: function push(v) {
                        var entry = {
                            data: v,
                            next: null
                        };
                        if (this.length > 0) this.tail.next = entry;
                        else this.head = entry;
                        this.tail = entry;
                        ++this.length;
                    }
                },
                {
                    key: "unshift",
                    value: function unshift(v) {
                        var entry = {
                            data: v,
                            next: this.head
                        };
                        if (this.length === 0) this.tail = entry;
                        this.head = entry;
                        ++this.length;
                    }
                },
                {
                    key: "shift",
                    value: function shift() {
                        if (this.length === 0) return;
                        var ret = this.head.data;
                        if (this.length === 1) this.head = this.tail = null;
                        else this.head = this.head.next;
                        --this.length;
                        return ret;
                    }
                },
                {
                    key: "clear",
                    value: function clear() {
                        this.head = this.tail = null;
                        this.length = 0;
                    }
                },
                {
                    key: "join",
                    value: function join(s) {
                        if (this.length === 0) return "";
                        var p = this.head;
                        var ret = "" + p.data;
                        while(p = p.next){
                            ret += s + p.data;
                        }
                        return ret;
                    }
                },
                {
                    key: "concat",
                    value: function concat(n) {
                        if (this.length === 0) return Buffer.alloc(0);
                        var ret = Buffer.allocUnsafe(n >>> 0);
                        var p = this.head;
                        var i = 0;
                        while(p){
                            copyBuffer(p.data, ret, i);
                            i += p.data.length;
                            p = p.next;
                        }
                        return ret;
                    }
                },
                {
                    key: "consume",
                    value: function consume(n, hasStrings) {
                        var ret;
                        if (n < this.head.data.length) {
                            ret = this.head.data.slice(0, n);
                            this.head.data = this.head.data.slice(n);
                        } else if (n === this.head.data.length) {
                            ret = this.shift();
                        } else {
                            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
                        }
                        return ret;
                    }
                },
                {
                    key: "first",
                    value: function first() {
                        return this.head.data;
                    }
                },
                {
                    key: "_getString",
                    value: function _getString(n) {
                        var p = this.head;
                        var c = 1;
                        var ret = p.data;
                        n -= ret.length;
                        while(p = p.next){
                            var str = p.data;
                            var nb = n > str.length ? str.length : n;
                            if (nb === str.length) ret += str;
                            else ret += str.slice(0, n);
                            n -= nb;
                            if (n === 0) {
                                if (nb === str.length) {
                                    ++c;
                                    if (p.next) this.head = p.next;
                                    else this.head = this.tail = null;
                                } else {
                                    this.head = p;
                                    p.data = str.slice(nb);
                                }
                                break;
                            }
                            ++c;
                        }
                        this.length -= c;
                        return ret;
                    }
                },
                {
                    key: "_getBuffer",
                    value: function _getBuffer(n) {
                        var ret = Buffer.allocUnsafe(n);
                        var p = this.head;
                        var c = 1;
                        p.data.copy(ret);
                        n -= p.data.length;
                        while(p = p.next){
                            var buf = p.data;
                            var nb = n > buf.length ? buf.length : n;
                            buf.copy(ret, ret.length - n, 0, nb);
                            n -= nb;
                            if (n === 0) {
                                if (nb === buf.length) {
                                    ++c;
                                    if (p.next) this.head = p.next;
                                    else this.head = this.tail = null;
                                } else {
                                    this.head = p;
                                    p.data = buf.slice(nb);
                                }
                                break;
                            }
                            ++c;
                        }
                        this.length -= c;
                        return ret;
                    }
                },
                {
                    key: custom,
                    value: function value(_, options) {
                        return inspect(this, _objectSpread({}, options, {
                            depth: 0,
                            customInspect: false
                        }));
                    }
                }
            ]);
            return BufferList;
        }();
    },
    "48f7966c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        module.exports = {
            copy: u(farmRequire("815c9ab9")),
            copySync: farmRequire("9cfad54b")
        };
    },
    "4d583e4c": function(module, exports, farmRequire, dynamicRequire) {
        var Stream = farmRequire("stream").Stream;
        module.exports = legacy;
        function legacy(fs) {
            return {
                ReadStream: ReadStream,
                WriteStream: WriteStream
            };
            function ReadStream(path, options) {
                if (!(this instanceof ReadStream)) return new ReadStream(path, options);
                Stream.call(this);
                var self = this;
                this.path = path;
                this.fd = null;
                this.readable = true;
                this.paused = false;
                this.flags = "r";
                this.mode = 438;
                this.bufferSize = 64 * 1024;
                options = options || {};
                var keys = Object.keys(options);
                for(var index = 0, length = keys.length; index < length; index++){
                    var key = keys[index];
                    this[key] = options[key];
                }
                if (this.encoding) this.setEncoding(this.encoding);
                if (this.start !== undefined) {
                    if ("number" !== typeof this.start) {
                        throw TypeError("start must be a Number");
                    }
                    if (this.end === undefined) {
                        this.end = Infinity;
                    } else if ("number" !== typeof this.end) {
                        throw TypeError("end must be a Number");
                    }
                    if (this.start > this.end) {
                        throw new Error("start must be <= end");
                    }
                    this.pos = this.start;
                }
                if (this.fd !== null) {
                    process.nextTick(function() {
                        self._read();
                    });
                    return;
                }
                fs.open(this.path, this.flags, this.mode, function(err, fd) {
                    if (err) {
                        self.emit("error", err);
                        self.readable = false;
                        return;
                    }
                    self.fd = fd;
                    self.emit("open", fd);
                    self._read();
                });
            }
            function WriteStream(path, options) {
                if (!(this instanceof WriteStream)) return new WriteStream(path, options);
                Stream.call(this);
                this.path = path;
                this.fd = null;
                this.writable = true;
                this.flags = "w";
                this.encoding = "binary";
                this.mode = 438;
                this.bytesWritten = 0;
                options = options || {};
                var keys = Object.keys(options);
                for(var index = 0, length = keys.length; index < length; index++){
                    var key = keys[index];
                    this[key] = options[key];
                }
                if (this.start !== undefined) {
                    if ("number" !== typeof this.start) {
                        throw TypeError("start must be a Number");
                    }
                    if (this.start < 0) {
                        throw new Error("start must be >= zero");
                    }
                    this.pos = this.start;
                }
                this.busy = false;
                this._queue = [];
                if (this.fd === null) {
                    this._open = fs.open;
                    this._queue.push([
                        this._open,
                        this.path,
                        this.flags,
                        this.mode,
                        undefined
                    ]);
                    this.flush();
                }
            }
        }
    },
    "4f54265c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        const fs = farmRequire("f44ca176");
        const path = farmRequire("path");
        const mkdir = farmRequire("43482b8b");
        const pathExists = farmRequire("619c6a41").pathExists;
        function outputFile(file, data, encoding, callback) {
            if (typeof encoding === "function") {
                callback = encoding;
                encoding = "utf8";
            }
            const dir = path.dirname(file);
            pathExists(dir, (err, itDoes)=>{
                if (err) return callback(err);
                if (itDoes) return fs.writeFile(file, data, encoding, callback);
                mkdir.mkdirs(dir, (err)=>{
                    if (err) return callback(err);
                    fs.writeFile(file, data, encoding, callback);
                });
            });
        }
        function outputFileSync(file, ...args) {
            const dir = path.dirname(file);
            if (fs.existsSync(dir)) {
                return fs.writeFileSync(file, ...args);
            }
            mkdir.mkdirsSync(dir);
            fs.writeFileSync(file, ...args);
        }
        module.exports = {
            outputFile: u(outputFile),
            outputFileSync
        };
    },
    "5232618c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const { createFile , createFileSync  } = farmRequire("c2445865");
        const { createLink , createLinkSync  } = farmRequire("c519a169");
        const { createSymlink , createSymlinkSync  } = farmRequire("676e68a2");
        module.exports = {
            createFile,
            createFileSync,
            ensureFile: createFile,
            ensureFileSync: createFileSync,
            createLink,
            createLinkSync,
            ensureLink: createLink,
            ensureLinkSync: createLinkSync,
            createSymlink,
            createSymlinkSync,
            ensureSymlink: createSymlink,
            ensureSymlinkSync: createSymlinkSync
        };
    },
    "5233ae71": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) {
                    symbols = symbols.filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    });
                }
                keys.push.apply(keys, symbols);
            }
            return keys;
        }
        function _objectSpread(target) {
            for(var i = 1; i < arguments.length; i++){
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) {
                    ownKeys(Object(source), true).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                    ownKeys(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
            }
            return target;
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        }
        function _createForOfIteratorHelper(o, allowArrayLike) {
            var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
            if (!it) {
                if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
                    if (it) o = it;
                    var i = 0;
                    var F = function F() {};
                    return {
                        s: F,
                        n: function n() {
                            if (i >= o.length) return {
                                done: true
                            };
                            return {
                                done: false,
                                value: o[i++]
                            };
                        },
                        e: function e(_e) {
                            throw _e;
                        },
                        f: F
                    };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var normalCompletion = true, didErr = false, err;
            return {
                s: function s() {
                    it = it.call(o);
                },
                n: function n() {
                    var step = it.next();
                    normalCompletion = step.done;
                    return step;
                },
                e: function e(_e2) {
                    didErr = true;
                    err = _e2;
                },
                f: function f() {
                    try {
                        if (!normalCompletion && it.return != null) it.return();
                    } finally{
                        if (didErr) throw err;
                    }
                }
            };
        }
        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
            return arr2;
        }
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        const prompts = farmRequire("1f4157e8");
        const passOn = [
            "suggest",
            "format",
            "onState",
            "validate",
            "onRender",
            "type"
        ];
        const noop = ()=>{};
        function prompt() {
            return _prompt.apply(this, arguments);
        }
        function _prompt() {
            _prompt = _asyncToGenerator(function*(questions = [], { onSubmit =noop , onCancel =noop  } = {}) {
                const answers = {};
                const override = prompt._override || {};
                questions = [].concat(questions);
                let answer, question, quit, name, type, lastPrompt;
                const getFormattedAnswer = function() {
                    var _ref = _asyncToGenerator(function*(question, answer, skipValidation = false) {
                        if (!skipValidation && question.validate && question.validate(answer) !== true) {
                            return;
                        }
                        return question.format ? yield question.format(answer, answers) : answer;
                    });
                    return function getFormattedAnswer(_x, _x2) {
                        return _ref.apply(this, arguments);
                    };
                }();
                var _iterator = _createForOfIteratorHelper(questions), _step;
                try {
                    for(_iterator.s(); !(_step = _iterator.n()).done;){
                        question = _step.value;
                        var _question = question;
                        name = _question.name;
                        type = _question.type;
                        if (typeof type === "function") {
                            type = yield type(answer, _objectSpread({}, answers), question);
                            question["type"] = type;
                        }
                        if (!type) continue;
                        for(let key in question){
                            if (passOn.includes(key)) continue;
                            let value = question[key];
                            question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
                        }
                        lastPrompt = question;
                        if (typeof question.message !== "string") {
                            throw new Error("prompt message is required");
                        }
                        var _question2 = question;
                        name = _question2.name;
                        type = _question2.type;
                        if (prompts[type] === void 0) {
                            throw new Error(`prompt type (${type}) is not defined`);
                        }
                        if (override[question.name] !== undefined) {
                            answer = yield getFormattedAnswer(question, override[question.name]);
                            if (answer !== undefined) {
                                answers[name] = answer;
                                continue;
                            }
                        }
                        try {
                            answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
                            answers[name] = answer = yield getFormattedAnswer(question, answer, true);
                            quit = yield onSubmit(question, answer, answers);
                        } catch (err) {
                            quit = !(yield onCancel(question, answers));
                        }
                        if (quit) return answers;
                    }
                } catch (err) {
                    _iterator.e(err);
                } finally{
                    _iterator.f();
                }
                return answers;
            });
            return _prompt.apply(this, arguments);
        }
        function getInjectedAnswer(injected, deafultValue) {
            const answer = injected.shift();
            if (answer instanceof Error) {
                throw answer;
            }
            return answer === undefined ? deafultValue : answer;
        }
        function inject(answers) {
            prompt._injected = (prompt._injected || []).concat(answers);
        }
        function override(answers) {
            prompt._override = Object.assign({}, answers);
        }
        module.exports = Object.assign(prompt, {
            prompt,
            prompts,
            inject,
            override
        });
    },
    "5348f136": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (key, isSelect)=>{
            if (key.meta && key.name !== "escape") return;
            if (key.ctrl) {
                if (key.name === "a") return "first";
                if (key.name === "c") return "abort";
                if (key.name === "d") return "abort";
                if (key.name === "e") return "last";
                if (key.name === "g") return "reset";
            }
            if (isSelect) {
                if (key.name === "j") return "down";
                if (key.name === "k") return "up";
            }
            if (key.name === "return") return "submit";
            if (key.name === "enter") return "submit";
            if (key.name === "backspace") return "delete";
            if (key.name === "delete") return "deleteForward";
            if (key.name === "abort") return "abort";
            if (key.name === "escape") return "exit";
            if (key.name === "tab") return "next";
            if (key.name === "pagedown") return "nextPage";
            if (key.name === "pageup") return "prevPage";
            if (key.name === "home") return "home";
            if (key.name === "end") return "end";
            if (key.name === "up") return "up";
            if (key.name === "down") return "down";
            if (key.name === "right") return "right";
            if (key.name === "left") return "left";
            return false;
        };
    },
    "554cea25": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function _createForOfIteratorHelper(o, allowArrayLike) {
            var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
            if (!it) {
                if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
                    if (it) o = it;
                    var i = 0;
                    var F = function F() {};
                    return {
                        s: F,
                        n: function n() {
                            if (i >= o.length) return {
                                done: true
                            };
                            return {
                                done: false,
                                value: o[i++]
                            };
                        },
                        e: function e(_e) {
                            throw _e;
                        },
                        f: F
                    };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var normalCompletion = true, didErr = false, err;
            return {
                s: function s() {
                    it = it.call(o);
                },
                n: function n() {
                    var step = it.next();
                    normalCompletion = step.done;
                    return step;
                },
                e: function e(_e2) {
                    didErr = true;
                    err = _e2;
                },
                f: function f() {
                    try {
                        if (!normalCompletion && it.return != null) it.return();
                    } finally{
                        if (didErr) throw err;
                    }
                }
            };
        }
        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
            return arr2;
        }
        const strip = farmRequire("902f0d3a");
        const _require = farmRequire("84d4236d"), erase = _require.erase, cursor = _require.cursor;
        const width = (str)=>[
                ...strip(str)
            ].length;
        module.exports = function(prompt, perLine) {
            if (!perLine) return erase.line + cursor.to(0);
            let rows = 0;
            const lines = prompt.split(/\r?\n/);
            var _iterator = _createForOfIteratorHelper(lines), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    let line = _step.value;
                    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            return erase.lines(rows);
        };
    },
    "55e02ff8": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "StdinDiscarder", {
            enumerable: true,
            get: function() {
                return StdinDiscarder;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        var _nodereadline = _interop_require_default._(farmRequire("node:readline"));
        var _bl = farmRequire("9ef8a425");
        const ASCII_ETX_CODE = 0x03;
        class StdinDiscarder {
            #requests = 0;
            #mutedStream = new _bl.BufferListStream();
            #ourEmit;
            #rl;
            constructor(){
                this.#mutedStream.pipe(_nodeprocess.default.stdout);
                const self = this;
                this.#ourEmit = function(event, data, ...args) {
                    const { stdin  } = _nodeprocess.default;
                    if (self.#requests > 0 || stdin.emit === self.#ourEmit) {
                        if (event === "keypress") {
                            return;
                        }
                        if (event === "data" && data.includes(ASCII_ETX_CODE)) {
                            _nodeprocess.default.emit("SIGINT");
                        }
                        Reflect.apply(self.#ourEmit, this, [
                            event,
                            data,
                            ...args
                        ]);
                    } else {
                        Reflect.apply(_nodeprocess.default.stdin.emit, this, [
                            event,
                            data,
                            ...args
                        ]);
                    }
                };
            }
            start() {
                this.#requests++;
                if (this.#requests === 1) {
                    this._realStart();
                }
            }
            stop() {
                if (this.#requests <= 0) {
                    throw new Error("`stop` called more times than `start`");
                }
                this.#requests--;
                if (this.#requests === 0) {
                    this._realStop();
                }
            }
            _realStart() {
                if (_nodeprocess.default.platform === "win32") {
                    return;
                }
                this.#rl = _nodereadline.default.createInterface({
                    input: _nodeprocess.default.stdin,
                    output: this.#mutedStream
                });
                this.#rl.on("SIGINT", ()=>{
                    if (_nodeprocess.default.listenerCount("SIGINT") === 0) {
                        _nodeprocess.default.emit("SIGINT");
                    } else {
                        this.#rl.close();
                        _nodeprocess.default.kill(_nodeprocess.default.pid, "SIGINT");
                    }
                });
            }
            _realStop() {
                if (_nodeprocess.default.platform === "win32") {
                    return;
                }
                this.#rl.close();
                this.#rl = undefined;
            }
        }
    },
    "56990b82": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "logger", {
            enumerable: true,
            get: function() {
                return logger;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _gradientstring = _interop_require_default._(farmRequire("7eba55e1"));
        function logger(string) {
            console.log((0, _gradientstring.default)("#9CECFB", "#65C7F7", "#0052D4")(string));
            console.log("");
        }
    },
    "56df7433": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _default = {
            name: "plugins",
            type: "multiselect",
            message: "Custorm Your Plugins",
            choices: [
                {
                    title: "@vitejs/plugin-vue-jsx",
                    value: "jsx"
                },
                {
                    title: "@vitejs/plugin-legacy",
                    value: "legacy"
                },
                {
                    title: "vite-plugin-html",
                    value: "html"
                },
                {
                    title: "unplugin-vue-components",
                    value: "vueComponents",
                    selected: false
                },
                {
                    title: "unplugin-auto-import",
                    value: "autoImport",
                    selected: false
                },
                {
                    title: "unplugin-icons",
                    value: "icons",
                    selected: false
                },
                {
                    title: "Unocss",
                    value: "unocss",
                    selected: false
                },
                {
                    title: "vite-plugin-pwa",
                    value: "pwa"
                },
                {
                    title: "vite-plugin-inspect",
                    value: "inspect"
                },
                {
                    title: "rollup-plugin-visualizer",
                    value: "visualizer"
                }
            ],
            hint: "- Space to select. Return to submit",
            instructions: false
        };
    },
    "589ef9ca": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return createQuestion;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _prompts = _interop_require_default._(farmRequire("725cd8a4"));
        async function createQuestion(question) {
            const result = await (0, _prompts.default)(question, {
                onCancel: ()=>{
                    throw new Error("❌" + " operation cancelled");
                }
            });
            Object.assign(_options.default, result);
            return Promise.resolve(_options.default);
        }
    },
    "58bfc030": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            TextPrompt: farmRequire("281cad53"),
            SelectPrompt: farmRequire("19ad2ba0"),
            TogglePrompt: farmRequire("c1603f62"),
            DatePrompt: farmRequire("ad453cfe"),
            NumberPrompt: farmRequire("fe034919"),
            MultiselectPrompt: farmRequire("12aba9ec"),
            AutocompletePrompt: farmRequire("8dfecbc9"),
            AutocompleteMultiselectPrompt: farmRequire("40852176"),
            ConfirmPrompt: farmRequire("3186282a")
        };
    },
    "5d63a32d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var defaults = farmRequire("3216444a");
        var combining = farmRequire("287acfdf");
        var DEFAULTS = {
            nul: 0,
            control: 0
        };
        module.exports = function wcwidth(str) {
            return wcswidth(str, DEFAULTS);
        };
        module.exports.config = function(opts) {
            opts = defaults(opts || {}, DEFAULTS);
            return function wcwidth(str) {
                return wcswidth(str, opts);
            };
        };
        function wcswidth(str, opts) {
            if (typeof str !== "string") return wcwidth(str, opts);
            var s = 0;
            for(var i = 0; i < str.length; i++){
                var n = wcwidth(str.charCodeAt(i), opts);
                if (n < 0) return -1;
                s += n;
            }
            return s;
        }
        function wcwidth(ucs, opts) {
            if (ucs === 0) return opts.nul;
            if (ucs < 32 || ucs >= 0x7f && ucs < 0xa0) return opts.control;
            if (bisearch(ucs)) return 0;
            return 1 + (ucs >= 0x1100 && (ucs <= 0x115f || ucs == 0x2329 || ucs == 0x232a || ucs >= 0x2e80 && ucs <= 0xa4cf && ucs != 0x303f || ucs >= 0xac00 && ucs <= 0xd7a3 || ucs >= 0xf900 && ucs <= 0xfaff || ucs >= 0xfe10 && ucs <= 0xfe19 || ucs >= 0xfe30 && ucs <= 0xfe6f || ucs >= 0xff00 && ucs <= 0xff60 || ucs >= 0xffe0 && ucs <= 0xffe6 || ucs >= 0x20000 && ucs <= 0x2fffd || ucs >= 0x30000 && ucs <= 0x3fffd));
        }
        function bisearch(ucs) {
            var min = 0;
            var max = combining.length - 1;
            var mid;
            if (ucs < combining[0][0] || ucs > combining[max][1]) return false;
            while(max >= min){
                mid = Math.floor((min + max) / 2);
                if (ucs > combining[mid][1]) min = mid + 1;
                else if (ucs < combining[mid][0]) max = mid - 1;
                else return true;
            }
            return false;
        }
    },
    "5e0a98f2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const jsonFile = farmRequire("df673ef7");
        module.exports = {
            readJson: jsonFile.readFile,
            readJsonSync: jsonFile.readFileSync,
            writeJson: jsonFile.writeFile,
            writeJsonSync: jsonFile.writeFileSync
        };
    },
    "5f688b9c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const main = {
            arrowUp: "↑",
            arrowDown: "↓",
            arrowLeft: "←",
            arrowRight: "→",
            radioOn: "◉",
            radioOff: "◯",
            tick: "✔",
            cross: "✖",
            ellipsis: "…",
            pointerSmall: "›",
            line: "─",
            pointer: "❯"
        };
        const win = {
            arrowUp: main.arrowUp,
            arrowDown: main.arrowDown,
            arrowLeft: main.arrowLeft,
            arrowRight: main.arrowRight,
            radioOn: "(*)",
            radioOff: "( )",
            tick: "√",
            cross: "\xd7",
            ellipsis: "...",
            pointerSmall: "\xbb",
            line: "─",
            pointer: ">"
        };
        const figures = process.platform === "win32" ? win : main;
        module.exports = figures;
    },
    "6185fc16": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _chalk = _interop_require_default._(farmRequire("014082d7"));
        var _isunicodesupported = _interop_require_default._(farmRequire("6f31faf9"));
        const main = {
            info: _chalk.default.blue("ℹ"),
            success: _chalk.default.green("✔"),
            warning: _chalk.default.yellow("⚠"),
            error: _chalk.default.red("✖")
        };
        const fallback = {
            info: _chalk.default.blue("i"),
            success: _chalk.default.green("√"),
            warning: _chalk.default.yellow("‼"),
            error: _chalk.default.red("\xd7")
        };
        const logSymbols = (0, _isunicodesupported.default)() ? main : fallback;
        var _default = logSymbols;
    },
    "619c6a41": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromPromise;
        const fs = farmRequire("7e487033");
        function pathExists(path) {
            return fs.access(path).then(()=>true).catch(()=>false);
        }
        module.exports = {
            pathExists: u(pathExists),
            pathExistsSync: fs.existsSync
        };
    },
    "644afc88": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const spinners = Object.assign({}, farmRequire("cfacf6a9"));
        const spinnersList = Object.keys(spinners);
        Object.defineProperty(spinners, "random", {
            get () {
                const randomIndex = Math.floor(Math.random() * spinnersList.length);
                const spinnerName = spinnersList[randomIndex];
                return spinners[spinnerName];
            }
        });
        module.exports = spinners;
    },
    "66c444db": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            varlet: function() {
                return varlet;
            },
            tinyVue: function() {
                return tinyVue;
            },
            arco: function() {
                return arco;
            },
            vuetify: function() {
                return vuetify;
            },
            tencent: function() {
                return tencent;
            },
            devUI: function() {
                return devUI;
            },
            naiveUI: function() {
                return naiveUI;
            },
            antDesignVue: function() {
                return antDesignVue;
            },
            elementPlus: function() {
                return elementPlus;
            },
            vant: function() {
                return vant;
            }
        });
        const tinyVue = {
            name: "@opentiny/vue",
            version: "^3.6.1",
            stableVersion: "3.6.1",
            dev: "pro"
        };
        const elementPlus = {
            name: "element-plus",
            version: "^2.3.0",
            stableVersion: "2.2.27",
            theme: true,
            unpluginResolver: "ElementPlusResolver",
            useUnpluginResolver: true,
            dev: "pro"
        };
        const antDesignVue = {
            name: "ant-design-vue",
            version: "^3.2.14",
            stableVersion: "3.2.1",
            theme: true,
            unpluginResolver: "AntDesignVueResolver",
            useUnpluginResolver: false,
            dev: "pro"
        };
        const naiveUI = {
            name: "naive-ui",
            version: "^2.34.3",
            stableVersion: "2.31.0",
            theme: true,
            unpluginResolver: "NaiveUiResolver",
            useUnpluginResolver: true,
            dev: "pro"
        };
        const devUI = {
            name: "vue-devui",
            version: "^1.5.2",
            stableVersion: "^1.0.0-rc.14",
            theme: false,
            unpluginResolver: "DevUiResolver",
            useUnpluginResolver: true,
            dev: "pro"
        };
        const tencent = {
            name: "tdesign-vue-next",
            version: "^1.2.1",
            stableVersion: "^0.18.0",
            theme: false,
            unpluginResolver: "TDesignResolver",
            useUnpluginResolver: true,
            dev: "pro"
        };
        const vuetify = {
            name: "vuetify",
            version: "^3.1.10",
            stableVersion: "^3.0.5",
            theme: false,
            unpluginResolver: "VuetifyResolver",
            useUnpluginResolver: false,
            dev: "pro"
        };
        const arco = {
            name: "@arco-design/web-vue",
            version: "^2.44.2",
            stableVersion: "^2.33.0",
            theme: false,
            unpluginResolver: "ArcoResolver",
            useUnpluginResolver: true,
            dev: "pro"
        };
        const varlet = {
            name: "@varlet/ui",
            version: "^2.9.1",
            stableVersion: "^2.0.2",
            theme: false,
            unpluginResolver: "VarletUIResolver",
            dev: "pro"
        };
        const vant = {
            name: "vant",
            version: "^4.1.0",
            stableVersion: "^1.27.17",
            theme: false,
            unpluginResolver: "VantUIResolver",
            dev: "pro"
        };
    },
    "6706b280": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return ora;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        var _chalk = _interop_require_default._(farmRequire("014082d7"));
        var _clicursor = _interop_require_default._(farmRequire("bbe3310d"));
        var _clispinners = _interop_require_default._(farmRequire("644afc88"));
        var _logsymbols = _interop_require_default._(farmRequire("6185fc16"));
        var _stripansi = _interop_require_default._(farmRequire("c9aac92a"));
        var _wcwidth = _interop_require_default._(farmRequire("5d63a32d"));
        var _isinteractive = _interop_require_default._(farmRequire("6b0da7a1"));
        var _isunicodesupported = _interop_require_default._(farmRequire("6f31faf9"));
        var _utilities = farmRequire("55e02ff8");
        let stdinDiscarder;
        class Ora {
            #linesToClear = 0;
            #isDiscardingStdin = false;
            #lineCount = 0;
            #frameIndex = 0;
            #options;
            #spinner;
            #stream;
            #id;
            #initialInterval;
            #isEnabled;
            #isSilent;
            #indent;
            #text;
            #prefixText;
            color;
            constructor(options){
                if (!stdinDiscarder) {
                    stdinDiscarder = new _utilities.StdinDiscarder();
                }
                if (typeof options === "string") {
                    options = {
                        text: options
                    };
                }
                this.#options = {
                    color: "cyan",
                    stream: _nodeprocess.default.stderr,
                    discardStdin: true,
                    hideCursor: true,
                    ...options
                };
                this.color = this.#options.color;
                this.spinner = this.#options.spinner;
                this.#initialInterval = this.#options.interval;
                this.#stream = this.#options.stream;
                this.#isEnabled = typeof this.#options.isEnabled === "boolean" ? this.#options.isEnabled : (0, _isinteractive.default)({
                    stream: this.#stream
                });
                this.#isSilent = typeof this.#options.isSilent === "boolean" ? this.#options.isSilent : false;
                this.text = this.#options.text;
                this.prefixText = this.#options.prefixText;
                this.indent = this.#options.indent;
                if (_nodeprocess.default.env.NODE_ENV === "test") {
                    this._stream = this.#stream;
                    this._isEnabled = this.#isEnabled;
                    Object.defineProperty(this, "_linesToClear", {
                        get () {
                            return this.#linesToClear;
                        },
                        set (newValue) {
                            this.#linesToClear = newValue;
                        }
                    });
                    Object.defineProperty(this, "_frameIndex", {
                        get () {
                            return this.#frameIndex;
                        }
                    });
                    Object.defineProperty(this, "_lineCount", {
                        get () {
                            return this.#lineCount;
                        }
                    });
                }
            }
            get indent() {
                return this.#indent;
            }
            set indent(indent = 0) {
                if (!(indent >= 0 && Number.isInteger(indent))) {
                    throw new Error("The `indent` option must be an integer from 0 and up");
                }
                this.#indent = indent;
                this.updateLineCount();
            }
            get interval() {
                return this.#initialInterval || this.#spinner.interval || 100;
            }
            get spinner() {
                return this.#spinner;
            }
            set spinner(spinner) {
                this.#frameIndex = 0;
                this.#initialInterval = undefined;
                if (typeof spinner === "object") {
                    if (spinner.frames === undefined) {
                        throw new Error("The given spinner must have a `frames` property");
                    }
                    this.#spinner = spinner;
                } else if (!(0, _isunicodesupported.default)()) {
                    this.#spinner = _clispinners.default.line;
                } else if (spinner === undefined) {
                    this.#spinner = _clispinners.default.dots;
                } else if (spinner !== "default" && _clispinners.default[spinner]) {
                    this.#spinner = _clispinners.default[spinner];
                } else {
                    throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
                }
            }
            get text() {
                return this.#text;
            }
            set text(value) {
                this.#text = value || "";
                this.updateLineCount();
            }
            get prefixText() {
                return this.#prefixText;
            }
            set prefixText(value) {
                this.#prefixText = value || "";
                this.updateLineCount();
            }
            get isSpinning() {
                return this.#id !== undefined;
            }
            getFullPrefixText(prefixText = this.#prefixText, postfix = " ") {
                if (typeof prefixText === "string" && prefixText !== "") {
                    return prefixText + postfix;
                }
                if (typeof prefixText === "function") {
                    return prefixText() + postfix;
                }
                return "";
            }
            updateLineCount() {
                const columns = this.#stream.columns || 80;
                const fullPrefixText = this.getFullPrefixText(this.#prefixText, "-");
                this.#lineCount = 0;
                for (const line of (0, _stripansi.default)(" ".repeat(this.#indent) + fullPrefixText + "--" + this.#text).split("\n")){
                    this.#lineCount += Math.max(1, Math.ceil((0, _wcwidth.default)(line) / columns));
                }
            }
            get isEnabled() {
                return this.#isEnabled && !this.#isSilent;
            }
            set isEnabled(value) {
                if (typeof value !== "boolean") {
                    throw new TypeError("The `isEnabled` option must be a boolean");
                }
                this.#isEnabled = value;
            }
            get isSilent() {
                return this.#isSilent;
            }
            set isSilent(value) {
                if (typeof value !== "boolean") {
                    throw new TypeError("The `isSilent` option must be a boolean");
                }
                this.#isSilent = value;
            }
            frame() {
                const { frames  } = this.#spinner;
                let frame = frames[this.#frameIndex];
                if (this.color) {
                    frame = _chalk.default[this.color](frame);
                }
                this.#frameIndex = ++this.#frameIndex % frames.length;
                const fullPrefixText = typeof this.#prefixText === "string" && this.#prefixText !== "" ? this.#prefixText + " " : "";
                const fullText = typeof this.text === "string" ? " " + this.text : "";
                return fullPrefixText + frame + fullText;
            }
            clear() {
                if (!this.#isEnabled || !this.#stream.isTTY) {
                    return this;
                }
                this.#stream.cursorTo(0);
                for(let index = 0; index < this.#linesToClear; index++){
                    if (index > 0) {
                        this.#stream.moveCursor(0, -1);
                    }
                    this.#stream.clearLine(1);
                }
                if (this.#indent || this.lastIndent !== this.#indent) {
                    this.#stream.cursorTo(this.#indent);
                }
                this.lastIndent = this.#indent;
                this.#linesToClear = 0;
                return this;
            }
            render() {
                if (this.#isSilent) {
                    return this;
                }
                this.clear();
                this.#stream.write(this.frame());
                this.#linesToClear = this.#lineCount;
                return this;
            }
            start(text) {
                if (text) {
                    this.text = text;
                }
                if (this.#isSilent) {
                    return this;
                }
                if (!this.#isEnabled) {
                    if (this.text) {
                        this.#stream.write(`- ${this.text}\n`);
                    }
                    return this;
                }
                if (this.isSpinning) {
                    return this;
                }
                if (this.#options.hideCursor) {
                    _clicursor.default.hide(this.#stream);
                }
                if (this.#options.discardStdin && _nodeprocess.default.stdin.isTTY) {
                    this.#isDiscardingStdin = true;
                    stdinDiscarder.start();
                }
                this.render();
                this.#id = setInterval(this.render.bind(this), this.interval);
                return this;
            }
            stop() {
                if (!this.#isEnabled) {
                    return this;
                }
                clearInterval(this.#id);
                this.#id = undefined;
                this.#frameIndex = 0;
                this.clear();
                if (this.#options.hideCursor) {
                    _clicursor.default.show(this.#stream);
                }
                if (this.#options.discardStdin && _nodeprocess.default.stdin.isTTY && this.#isDiscardingStdin) {
                    stdinDiscarder.stop();
                    this.#isDiscardingStdin = false;
                }
                return this;
            }
            succeed(text) {
                return this.stopAndPersist({
                    symbol: _logsymbols.default.success,
                    text
                });
            }
            fail(text) {
                return this.stopAndPersist({
                    symbol: _logsymbols.default.error,
                    text
                });
            }
            warn(text) {
                return this.stopAndPersist({
                    symbol: _logsymbols.default.warning,
                    text
                });
            }
            info(text) {
                return this.stopAndPersist({
                    symbol: _logsymbols.default.info,
                    text
                });
            }
            stopAndPersist(options = {}) {
                if (this.#isSilent) {
                    return this;
                }
                const prefixText = options.prefixText || this.#prefixText;
                const text = options.text || this.text;
                const fullText = typeof text === "string" ? " " + text : "";
                this.stop();
                this.#stream.write(`${this.getFullPrefixText(prefixText, " ")}${options.symbol || " "}${fullText}\n`);
                return this;
            }
        }
        function ora(options) {
            return new Ora(options);
        }
    },
    "676e68a2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        const path = farmRequire("path");
        const fs = farmRequire("7e487033");
        const _mkdirs = farmRequire("43482b8b");
        const mkdirs = _mkdirs.mkdirs;
        const mkdirsSync = _mkdirs.mkdirsSync;
        const _symlinkPaths = farmRequire("711017d7");
        const symlinkPaths = _symlinkPaths.symlinkPaths;
        const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
        const _symlinkType = farmRequire("b20c3033");
        const symlinkType = _symlinkType.symlinkType;
        const symlinkTypeSync = _symlinkType.symlinkTypeSync;
        const pathExists = farmRequire("619c6a41").pathExists;
        const { areIdentical  } = farmRequire("bfed495f");
        function createSymlink(srcpath, dstpath, type, callback) {
            callback = typeof type === "function" ? type : callback;
            type = typeof type === "function" ? false : type;
            fs.lstat(dstpath, (err, stats)=>{
                if (!err && stats.isSymbolicLink()) {
                    Promise.all([
                        fs.stat(srcpath),
                        fs.stat(dstpath)
                    ]).then(([srcStat, dstStat])=>{
                        if (areIdentical(srcStat, dstStat)) return callback(null);
                        _createSymlink(srcpath, dstpath, type, callback);
                    });
                } else _createSymlink(srcpath, dstpath, type, callback);
            });
        }
        function _createSymlink(srcpath, dstpath, type, callback) {
            symlinkPaths(srcpath, dstpath, (err, relative)=>{
                if (err) return callback(err);
                srcpath = relative.toDst;
                symlinkType(relative.toCwd, type, (err, type)=>{
                    if (err) return callback(err);
                    const dir = path.dirname(dstpath);
                    pathExists(dir, (err, dirExists)=>{
                        if (err) return callback(err);
                        if (dirExists) return fs.symlink(srcpath, dstpath, type, callback);
                        mkdirs(dir, (err)=>{
                            if (err) return callback(err);
                            fs.symlink(srcpath, dstpath, type, callback);
                        });
                    });
                });
            });
        }
        function createSymlinkSync(srcpath, dstpath, type) {
            let stats;
            try {
                stats = fs.lstatSync(dstpath);
            } catch  {}
            if (stats && stats.isSymbolicLink()) {
                const srcStat = fs.statSync(srcpath);
                const dstStat = fs.statSync(dstpath);
                if (areIdentical(srcStat, dstStat)) return;
            }
            const relative = symlinkPathsSync(srcpath, dstpath);
            srcpath = relative.toDst;
            type = symlinkTypeSync(relative.toCwd, type);
            const dir = path.dirname(dstpath);
            const exists = fs.existsSync(dir);
            if (exists) return fs.symlinkSync(srcpath, dstpath, type);
            mkdirsSync(dir);
            return fs.symlinkSync(srcpath, dstpath, type);
        }
        module.exports = {
            createSymlink: u(createSymlink),
            createSymlinkSync
        };
    },
    "677e52b5": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var ERR_INVALID_OPT_VALUE = farmRequire("1c800b7b").codes.ERR_INVALID_OPT_VALUE;
        function highWaterMarkFrom(options, isDuplex, duplexKey) {
            return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
        }
        function getHighWaterMark(state, options, duplexKey, isDuplex) {
            var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
            if (hwm != null) {
                if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
                    var name = isDuplex ? duplexKey : "highWaterMark";
                    throw new ERR_INVALID_OPT_VALUE(name, hwm);
                }
                return Math.floor(hwm);
            }
            return state.objectMode ? 16 : 16 * 1024;
        }
        module.exports = {
            getHighWaterMark: getHighWaterMark
        };
    },
    "6795e939": function(module, exports, farmRequire, dynamicRequire) {
        const conversions = farmRequire("740b99e6");
        const route = farmRequire("a0b75c92");
        const convert = {};
        const models = Object.keys(conversions);
        function wrapRaw(fn) {
            const wrappedFn = function(...args) {
                const arg0 = args[0];
                if (arg0 === undefined || arg0 === null) {
                    return arg0;
                }
                if (arg0.length > 1) {
                    args = arg0;
                }
                return fn(args);
            };
            if ("conversion" in fn) {
                wrappedFn.conversion = fn.conversion;
            }
            return wrappedFn;
        }
        function wrapRounded(fn) {
            const wrappedFn = function(...args) {
                const arg0 = args[0];
                if (arg0 === undefined || arg0 === null) {
                    return arg0;
                }
                if (arg0.length > 1) {
                    args = arg0;
                }
                const result = fn(args);
                if (typeof result === "object") {
                    for(let len = result.length, i = 0; i < len; i++){
                        result[i] = Math.round(result[i]);
                    }
                }
                return result;
            };
            if ("conversion" in fn) {
                wrappedFn.conversion = fn.conversion;
            }
            return wrappedFn;
        }
        models.forEach((fromModel)=>{
            convert[fromModel] = {};
            Object.defineProperty(convert[fromModel], "channels", {
                value: conversions[fromModel].channels
            });
            Object.defineProperty(convert[fromModel], "labels", {
                value: conversions[fromModel].labels
            });
            const routes = route(fromModel);
            const routeModels = Object.keys(routes);
            routeModels.forEach((toModel)=>{
                const fn = routes[toModel];
                convert[fromModel][toModel] = wrapRounded(fn);
                convert[fromModel][toModel].raw = wrapRaw(fn);
            });
        });
        module.exports = convert;
    },
    "67a14985": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Month extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMonth(this.date.getMonth() + 1);
            }
            down() {
                this.date.setMonth(this.date.getMonth() - 1);
            }
            setTo(val) {
                val = parseInt(val.substr(-2)) - 1;
                this.date.setMonth(val < 0 ? 0 : val);
            }
            toString() {
                let month = this.date.getMonth();
                let tl = this.token.length;
                return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
            }
        }
        module.exports = Month;
    },
    "682c5c39": function(module, exports, farmRequire, dynamicRequire) {
        const { InvalidArgumentError  } = farmRequire("b38041d6");
        class Argument {
            constructor(name, description){
                this.description = description || "";
                this.variadic = false;
                this.parseArg = undefined;
                this.defaultValue = undefined;
                this.defaultValueDescription = undefined;
                this.argChoices = undefined;
                switch(name[0]){
                    case "<":
                        this.required = true;
                        this._name = name.slice(1, -1);
                        break;
                    case "[":
                        this.required = false;
                        this._name = name.slice(1, -1);
                        break;
                    default:
                        this.required = true;
                        this._name = name;
                        break;
                }
                if (this._name.length > 3 && this._name.slice(-3) === "...") {
                    this.variadic = true;
                    this._name = this._name.slice(0, -3);
                }
            }
            name() {
                return this._name;
            }
            _concatValue(value, previous) {
                if (previous === this.defaultValue || !Array.isArray(previous)) {
                    return [
                        value
                    ];
                }
                return previous.concat(value);
            }
            default(value, description) {
                this.defaultValue = value;
                this.defaultValueDescription = description;
                return this;
            }
            argParser(fn) {
                this.parseArg = fn;
                return this;
            }
            choices(values) {
                this.argChoices = values.slice();
                this.parseArg = (arg, previous)=>{
                    if (!this.argChoices.includes(arg)) {
                        throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
                    }
                    if (this.variadic) {
                        return this._concatValue(arg, previous);
                    }
                    return arg;
                };
                return this;
            }
            argRequired() {
                this.required = true;
                return this;
            }
            argOptional() {
                this.required = false;
                return this;
            }
        }
        function humanReadableArgName(arg) {
            const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
            return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
        }
        exports.Argument = Argument;
        exports.humanReadableArgName = humanReadableArgName;
    },
    "6b0da7a1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return isInteractive;
            }
        });
        function isInteractive({ stream =process.stdout  } = {}) {
            return Boolean(stream && stream.isTTY && process.env.TERM !== "dumb" && !("CI" in process.env));
        }
    },
    "6b832238": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Year extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setFullYear(this.date.getFullYear() + 1);
            }
            down() {
                this.date.setFullYear(this.date.getFullYear() - 1);
            }
            setTo(val) {
                this.date.setFullYear(val.substr(-4));
            }
            toString() {
                let year = String(this.date.getFullYear()).padStart(4, "0");
                return this.token.length === 2 ? year.substr(-2) : year;
            }
        }
        module.exports = Year;
    },
    "6d345dfe": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Year extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setFullYear(this.date.getFullYear() + 1);
            }
            down() {
                this.date.setFullYear(this.date.getFullYear() - 1);
            }
            setTo(val) {
                this.date.setFullYear(val.substr(-4));
            }
            toString() {
                let year = String(this.date.getFullYear()).padStart(4, "0");
                return this.token.length === 2 ? year.substr(-2) : year;
            }
        }
        module.exports = Year;
    },
    "6e240a89": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        const options = {
            plugins: [],
            precss: "",
            useTheme: false
        };
        var _default = options;
    },
    "6e507463": function(module, exports, farmRequire, dynamicRequire) {
        try {
            var util = farmRequire("util");
            if (typeof util.inherits !== "function") throw "";
            module.exports = util.inherits;
        } catch (e) {
            module.exports = farmRequire("21925236");
        }
    },
    "6f31faf9": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return isUnicodeSupported;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        function isUnicodeSupported() {
            if (_nodeprocess.default.platform !== "win32") {
                return _nodeprocess.default.env.TERM !== "linux";
            }
            return Boolean(_nodeprocess.default.env.CI) || Boolean(_nodeprocess.default.env.WT_SESSION) || Boolean(_nodeprocess.default.env.TERMINUS_SUBLIME) || _nodeprocess.default.env.ConEmuTask === "{cmd::Cmder}" || _nodeprocess.default.env.TERM_PROGRAM === "Terminus-Sublime" || _nodeprocess.default.env.TERM_PROGRAM === "vscode" || _nodeprocess.default.env.TERM === "xterm-256color" || _nodeprocess.default.env.TERM === "alacritty" || _nodeprocess.default.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
        }
    },
    "711017d7": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const path = farmRequire("path");
        const fs = farmRequire("f44ca176");
        const pathExists = farmRequire("619c6a41").pathExists;
        function symlinkPaths(srcpath, dstpath, callback) {
            if (path.isAbsolute(srcpath)) {
                return fs.lstat(srcpath, (err)=>{
                    if (err) {
                        err.message = err.message.replace("lstat", "ensureSymlink");
                        return callback(err);
                    }
                    return callback(null, {
                        toCwd: srcpath,
                        toDst: srcpath
                    });
                });
            } else {
                const dstdir = path.dirname(dstpath);
                const relativeToDst = path.join(dstdir, srcpath);
                return pathExists(relativeToDst, (err, exists)=>{
                    if (err) return callback(err);
                    if (exists) {
                        return callback(null, {
                            toCwd: relativeToDst,
                            toDst: srcpath
                        });
                    } else {
                        return fs.lstat(srcpath, (err)=>{
                            if (err) {
                                err.message = err.message.replace("lstat", "ensureSymlink");
                                return callback(err);
                            }
                            return callback(null, {
                                toCwd: srcpath,
                                toDst: path.relative(dstdir, srcpath)
                            });
                        });
                    }
                });
            }
        }
        function symlinkPathsSync(srcpath, dstpath) {
            let exists;
            if (path.isAbsolute(srcpath)) {
                exists = fs.existsSync(srcpath);
                if (!exists) throw new Error("absolute srcpath does not exist");
                return {
                    toCwd: srcpath,
                    toDst: srcpath
                };
            } else {
                const dstdir = path.dirname(dstpath);
                const relativeToDst = path.join(dstdir, srcpath);
                exists = fs.existsSync(relativeToDst);
                if (exists) {
                    return {
                        toCwd: relativeToDst,
                        toDst: srcpath
                    };
                } else {
                    exists = fs.existsSync(srcpath);
                    if (!exists) throw new Error("relative srcpath does not exist");
                    return {
                        toCwd: srcpath,
                        toDst: path.relative(dstdir, srcpath)
                    };
                }
            }
        }
        module.exports = {
            symlinkPaths,
            symlinkPathsSync
        };
    },
    "725cd8a4": function(module, exports, farmRequire, dynamicRequire) {
        function isNodeLT(tar) {
            tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
            let i = 0, src = process.versions.node.split(".").map(Number);
            for(; i < tar.length; i++){
                if (src[i] > tar[i]) return false;
                if (tar[i] > src[i]) return true;
            }
            return false;
        }
        module.exports = isNodeLT("8.6.0") ? farmRequire("5233ae71") : farmRequire("24eb533e");
    },
    "73c43919": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _log = farmRequire("56990b82");
        var _createSpawnCmd = _interop_require_default._(farmRequire("d22c1400"));
        async function installationDeps() {
            const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
            const cmdIgnore = (0, _createSpawnCmd.default)(_options.default.dest, "ignore");
            const cmdInherit = (0, _createSpawnCmd.default)(_options.default.dest, "inherit");
            const startTime = new Date().getTime();
            (0, _log.logger)(`> The project template is generated in the directory： ${_options.default.dest}`);
            await cmdIgnore("git", [
                "init"
            ]);
            await cmdIgnore("git", [
                "add ."
            ]);
            await cmdIgnore("git", [
                'commit -m "Initialize by VITE_CLI"'
            ]);
            (0, _log.logger)(`> repository initialized successfully`);
            if (_options.default.package !== "none") {
                (0, _log.logger)(`> Dependencies are being installed automatically, please wait a moment...`);
                await cmdInherit(_options.default.package, [
                    "install"
                ]);
            }
            const endTime = new Date().getTime();
            const usageTime = (endTime - startTime) / 1000;
            (0, _log.logger)(`> 📦📦 Usage time ${usageTime}s , Please enter the following command to continue...`);
            (0, _log.logger)("Project created successfully");
            (0, _log.logger)(`cd ${_options.default.name}`);
            if (_options.default.package !== "none") {
                (0, _log.logger)(_options.default.package === "npm" ? `${_options.default.package} run dev` : `${_options.default.package} dev`);
            } else {
                (0, _log.logger)(`npm install`);
                (0, _log.logger)("npm run dev");
            }
        }
        var _default = installationDeps;
        function pkgFromUserAgent(userAgent) {
            if (!userAgent) return undefined;
            const pkgSpec = userAgent.split(" ")[0];
            const pkgSpecArr = pkgSpec.split("/");
            return {
                name: pkgSpecArr[0],
                version: pkgSpecArr[1]
            };
        }
    },
    "740b99e6": function(module, exports, farmRequire, dynamicRequire) {
        const cssKeywords = farmRequire("8d58b170");
        const reverseKeywords = {};
        for (const key of Object.keys(cssKeywords)){
            reverseKeywords[cssKeywords[key]] = key;
        }
        const convert = {
            rgb: {
                channels: 3,
                labels: "rgb"
            },
            hsl: {
                channels: 3,
                labels: "hsl"
            },
            hsv: {
                channels: 3,
                labels: "hsv"
            },
            hwb: {
                channels: 3,
                labels: "hwb"
            },
            cmyk: {
                channels: 4,
                labels: "cmyk"
            },
            xyz: {
                channels: 3,
                labels: "xyz"
            },
            lab: {
                channels: 3,
                labels: "lab"
            },
            lch: {
                channels: 3,
                labels: "lch"
            },
            hex: {
                channels: 1,
                labels: [
                    "hex"
                ]
            },
            keyword: {
                channels: 1,
                labels: [
                    "keyword"
                ]
            },
            ansi16: {
                channels: 1,
                labels: [
                    "ansi16"
                ]
            },
            ansi256: {
                channels: 1,
                labels: [
                    "ansi256"
                ]
            },
            hcg: {
                channels: 3,
                labels: [
                    "h",
                    "c",
                    "g"
                ]
            },
            apple: {
                channels: 3,
                labels: [
                    "r16",
                    "g16",
                    "b16"
                ]
            },
            gray: {
                channels: 1,
                labels: [
                    "gray"
                ]
            }
        };
        module.exports = convert;
        for (const model of Object.keys(convert)){
            if (!("channels" in convert[model])) {
                throw new Error("missing channels property: " + model);
            }
            if (!("labels" in convert[model])) {
                throw new Error("missing channel labels property: " + model);
            }
            if (convert[model].labels.length !== convert[model].channels) {
                throw new Error("channel and label counts mismatch: " + model);
            }
            const { channels , labels  } = convert[model];
            delete convert[model].channels;
            delete convert[model].labels;
            Object.defineProperty(convert[model], "channels", {
                value: channels
            });
            Object.defineProperty(convert[model], "labels", {
                value: labels
            });
        }
        convert.rgb.hsl = function(rgb) {
            const r = rgb[0] / 255;
            const g = rgb[1] / 255;
            const b = rgb[2] / 255;
            const min = Math.min(r, g, b);
            const max = Math.max(r, g, b);
            const delta = max - min;
            let h;
            let s;
            if (max === min) {
                h = 0;
            } else if (r === max) {
                h = (g - b) / delta;
            } else if (g === max) {
                h = 2 + (b - r) / delta;
            } else if (b === max) {
                h = 4 + (r - g) / delta;
            }
            h = Math.min(h * 60, 360);
            if (h < 0) {
                h += 360;
            }
            const l = (min + max) / 2;
            if (max === min) {
                s = 0;
            } else if (l <= 0.5) {
                s = delta / (max + min);
            } else {
                s = delta / (2 - max - min);
            }
            return [
                h,
                s * 100,
                l * 100
            ];
        };
        convert.rgb.hsv = function(rgb) {
            let rdif;
            let gdif;
            let bdif;
            let h;
            let s;
            const r = rgb[0] / 255;
            const g = rgb[1] / 255;
            const b = rgb[2] / 255;
            const v = Math.max(r, g, b);
            const diff = v - Math.min(r, g, b);
            const diffc = function(c) {
                return (v - c) / 6 / diff + 1 / 2;
            };
            if (diff === 0) {
                h = 0;
                s = 0;
            } else {
                s = diff / v;
                rdif = diffc(r);
                gdif = diffc(g);
                bdif = diffc(b);
                if (r === v) {
                    h = bdif - gdif;
                } else if (g === v) {
                    h = 1 / 3 + rdif - bdif;
                } else if (b === v) {
                    h = 2 / 3 + gdif - rdif;
                }
                if (h < 0) {
                    h += 1;
                } else if (h > 1) {
                    h -= 1;
                }
            }
            return [
                h * 360,
                s * 100,
                v * 100
            ];
        };
        convert.rgb.hwb = function(rgb) {
            const r = rgb[0];
            const g = rgb[1];
            let b = rgb[2];
            const h = convert.rgb.hsl(rgb)[0];
            const w = 1 / 255 * Math.min(r, Math.min(g, b));
            b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
            return [
                h,
                w * 100,
                b * 100
            ];
        };
        convert.rgb.cmyk = function(rgb) {
            const r = rgb[0] / 255;
            const g = rgb[1] / 255;
            const b = rgb[2] / 255;
            const k = Math.min(1 - r, 1 - g, 1 - b);
            const c = (1 - r - k) / (1 - k) || 0;
            const m = (1 - g - k) / (1 - k) || 0;
            const y = (1 - b - k) / (1 - k) || 0;
            return [
                c * 100,
                m * 100,
                y * 100,
                k * 100
            ];
        };
        function comparativeDistance(x, y) {
            return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
        }
        convert.rgb.keyword = function(rgb) {
            const reversed = reverseKeywords[rgb];
            if (reversed) {
                return reversed;
            }
            let currentClosestDistance = Infinity;
            let currentClosestKeyword;
            for (const keyword of Object.keys(cssKeywords)){
                const value = cssKeywords[keyword];
                const distance = comparativeDistance(rgb, value);
                if (distance < currentClosestDistance) {
                    currentClosestDistance = distance;
                    currentClosestKeyword = keyword;
                }
            }
            return currentClosestKeyword;
        };
        convert.keyword.rgb = function(keyword) {
            return cssKeywords[keyword];
        };
        convert.rgb.xyz = function(rgb) {
            let r = rgb[0] / 255;
            let g = rgb[1] / 255;
            let b = rgb[2] / 255;
            r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
            g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
            b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
            const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
            const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
            const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
            return [
                x * 100,
                y * 100,
                z * 100
            ];
        };
        convert.rgb.lab = function(rgb) {
            const xyz = convert.rgb.xyz(rgb);
            let x = xyz[0];
            let y = xyz[1];
            let z = xyz[2];
            x /= 95.047;
            y /= 100;
            z /= 108.883;
            x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
            y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
            z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
            const l = 116 * y - 16;
            const a = 500 * (x - y);
            const b = 200 * (y - z);
            return [
                l,
                a,
                b
            ];
        };
        convert.hsl.rgb = function(hsl) {
            const h = hsl[0] / 360;
            const s = hsl[1] / 100;
            const l = hsl[2] / 100;
            let t2;
            let t3;
            let val;
            if (s === 0) {
                val = l * 255;
                return [
                    val,
                    val,
                    val
                ];
            }
            if (l < 0.5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }
            const t1 = 2 * l - t2;
            const rgb = [
                0,
                0,
                0
            ];
            for(let i = 0; i < 3; i++){
                t3 = h + 1 / 3 * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
                if (t3 > 1) {
                    t3--;
                }
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                } else if (2 * t3 < 1) {
                    val = t2;
                } else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    val = t1;
                }
                rgb[i] = val * 255;
            }
            return rgb;
        };
        convert.hsl.hsv = function(hsl) {
            const h = hsl[0];
            let s = hsl[1] / 100;
            let l = hsl[2] / 100;
            let smin = s;
            const lmin = Math.max(l, 0.01);
            l *= 2;
            s *= l <= 1 ? l : 2 - l;
            smin *= lmin <= 1 ? lmin : 2 - lmin;
            const v = (l + s) / 2;
            const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
            return [
                h,
                sv * 100,
                v * 100
            ];
        };
        convert.hsv.rgb = function(hsv) {
            const h = hsv[0] / 60;
            const s = hsv[1] / 100;
            let v = hsv[2] / 100;
            const hi = Math.floor(h) % 6;
            const f = h - Math.floor(h);
            const p = 255 * v * (1 - s);
            const q = 255 * v * (1 - s * f);
            const t = 255 * v * (1 - s * (1 - f));
            v *= 255;
            switch(hi){
                case 0:
                    return [
                        v,
                        t,
                        p
                    ];
                case 1:
                    return [
                        q,
                        v,
                        p
                    ];
                case 2:
                    return [
                        p,
                        v,
                        t
                    ];
                case 3:
                    return [
                        p,
                        q,
                        v
                    ];
                case 4:
                    return [
                        t,
                        p,
                        v
                    ];
                case 5:
                    return [
                        v,
                        p,
                        q
                    ];
            }
        };
        convert.hsv.hsl = function(hsv) {
            const h = hsv[0];
            const s = hsv[1] / 100;
            const v = hsv[2] / 100;
            const vmin = Math.max(v, 0.01);
            let sl;
            let l;
            l = (2 - s) * v;
            const lmin = (2 - s) * vmin;
            sl = s * vmin;
            sl /= lmin <= 1 ? lmin : 2 - lmin;
            sl = sl || 0;
            l /= 2;
            return [
                h,
                sl * 100,
                l * 100
            ];
        };
        convert.hwb.rgb = function(hwb) {
            const h = hwb[0] / 360;
            let wh = hwb[1] / 100;
            let bl = hwb[2] / 100;
            const ratio = wh + bl;
            let f;
            if (ratio > 1) {
                wh /= ratio;
                bl /= ratio;
            }
            const i = Math.floor(6 * h);
            const v = 1 - bl;
            f = 6 * h - i;
            if ((i & 0x01) !== 0) {
                f = 1 - f;
            }
            const n = wh + f * (v - wh);
            let r;
            let g;
            let b;
            switch(i){
                default:
                case 6:
                case 0:
                    r = v;
                    g = n;
                    b = wh;
                    break;
                case 1:
                    r = n;
                    g = v;
                    b = wh;
                    break;
                case 2:
                    r = wh;
                    g = v;
                    b = n;
                    break;
                case 3:
                    r = wh;
                    g = n;
                    b = v;
                    break;
                case 4:
                    r = n;
                    g = wh;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = wh;
                    b = n;
                    break;
            }
            return [
                r * 255,
                g * 255,
                b * 255
            ];
        };
        convert.cmyk.rgb = function(cmyk) {
            const c = cmyk[0] / 100;
            const m = cmyk[1] / 100;
            const y = cmyk[2] / 100;
            const k = cmyk[3] / 100;
            const r = 1 - Math.min(1, c * (1 - k) + k);
            const g = 1 - Math.min(1, m * (1 - k) + k);
            const b = 1 - Math.min(1, y * (1 - k) + k);
            return [
                r * 255,
                g * 255,
                b * 255
            ];
        };
        convert.xyz.rgb = function(xyz) {
            const x = xyz[0] / 100;
            const y = xyz[1] / 100;
            const z = xyz[2] / 100;
            let r;
            let g;
            let b;
            r = x * 3.2406 + y * -1.5372 + z * -0.4986;
            g = x * -0.9689 + y * 1.8758 + z * 0.0415;
            b = x * 0.0557 + y * -0.2040 + z * 1.0570;
            r = r > 0.0031308 ? 1.055 * r ** (1.0 / 2.4) - 0.055 : r * 12.92;
            g = g > 0.0031308 ? 1.055 * g ** (1.0 / 2.4) - 0.055 : g * 12.92;
            b = b > 0.0031308 ? 1.055 * b ** (1.0 / 2.4) - 0.055 : b * 12.92;
            r = Math.min(Math.max(0, r), 1);
            g = Math.min(Math.max(0, g), 1);
            b = Math.min(Math.max(0, b), 1);
            return [
                r * 255,
                g * 255,
                b * 255
            ];
        };
        convert.xyz.lab = function(xyz) {
            let x = xyz[0];
            let y = xyz[1];
            let z = xyz[2];
            x /= 95.047;
            y /= 100;
            z /= 108.883;
            x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
            y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
            z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
            const l = 116 * y - 16;
            const a = 500 * (x - y);
            const b = 200 * (y - z);
            return [
                l,
                a,
                b
            ];
        };
        convert.lab.xyz = function(lab) {
            const l = lab[0];
            const a = lab[1];
            const b = lab[2];
            let x;
            let y;
            let z;
            y = (l + 16) / 116;
            x = a / 500 + y;
            z = y - b / 200;
            const y2 = y ** 3;
            const x2 = x ** 3;
            const z2 = z ** 3;
            y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
            x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
            z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
            x *= 95.047;
            y *= 100;
            z *= 108.883;
            return [
                x,
                y,
                z
            ];
        };
        convert.lab.lch = function(lab) {
            const l = lab[0];
            const a = lab[1];
            const b = lab[2];
            let h;
            const hr = Math.atan2(b, a);
            h = hr * 360 / 2 / Math.PI;
            if (h < 0) {
                h += 360;
            }
            const c = Math.sqrt(a * a + b * b);
            return [
                l,
                c,
                h
            ];
        };
        convert.lch.lab = function(lch) {
            const l = lch[0];
            const c = lch[1];
            const h = lch[2];
            const hr = h / 360 * 2 * Math.PI;
            const a = c * Math.cos(hr);
            const b = c * Math.sin(hr);
            return [
                l,
                a,
                b
            ];
        };
        convert.rgb.ansi16 = function(args, saturation = null) {
            const [r, g, b] = args;
            let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
            value = Math.round(value / 50);
            if (value === 0) {
                return 30;
            }
            let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
            if (value === 2) {
                ansi += 60;
            }
            return ansi;
        };
        convert.hsv.ansi16 = function(args) {
            return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
        };
        convert.rgb.ansi256 = function(args) {
            const r = args[0];
            const g = args[1];
            const b = args[2];
            if (r === g && g === b) {
                if (r < 8) {
                    return 16;
                }
                if (r > 248) {
                    return 231;
                }
                return Math.round((r - 8) / 247 * 24) + 232;
            }
            const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
            return ansi;
        };
        convert.ansi16.rgb = function(args) {
            let color = args % 10;
            if (color === 0 || color === 7) {
                if (args > 50) {
                    color += 3.5;
                }
                color = color / 10.5 * 255;
                return [
                    color,
                    color,
                    color
                ];
            }
            const mult = (~~(args > 50) + 1) * 0.5;
            const r = (color & 1) * mult * 255;
            const g = (color >> 1 & 1) * mult * 255;
            const b = (color >> 2 & 1) * mult * 255;
            return [
                r,
                g,
                b
            ];
        };
        convert.ansi256.rgb = function(args) {
            if (args >= 232) {
                const c = (args - 232) * 10 + 8;
                return [
                    c,
                    c,
                    c
                ];
            }
            args -= 16;
            let rem;
            const r = Math.floor(args / 36) / 5 * 255;
            const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
            const b = rem % 6 / 5 * 255;
            return [
                r,
                g,
                b
            ];
        };
        convert.rgb.hex = function(args) {
            const integer = ((Math.round(args[0]) & 0xFF) << 16) + ((Math.round(args[1]) & 0xFF) << 8) + (Math.round(args[2]) & 0xFF);
            const string = integer.toString(16).toUpperCase();
            return "000000".substring(string.length) + string;
        };
        convert.hex.rgb = function(args) {
            const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
            if (!match) {
                return [
                    0,
                    0,
                    0
                ];
            }
            let colorString = match[0];
            if (match[0].length === 3) {
                colorString = colorString.split("").map((char)=>{
                    return char + char;
                }).join("");
            }
            const integer = parseInt(colorString, 16);
            const r = integer >> 16 & 0xFF;
            const g = integer >> 8 & 0xFF;
            const b = integer & 0xFF;
            return [
                r,
                g,
                b
            ];
        };
        convert.rgb.hcg = function(rgb) {
            const r = rgb[0] / 255;
            const g = rgb[1] / 255;
            const b = rgb[2] / 255;
            const max = Math.max(Math.max(r, g), b);
            const min = Math.min(Math.min(r, g), b);
            const chroma = max - min;
            let grayscale;
            let hue;
            if (chroma < 1) {
                grayscale = min / (1 - chroma);
            } else {
                grayscale = 0;
            }
            if (chroma <= 0) {
                hue = 0;
            } else if (max === r) {
                hue = (g - b) / chroma % 6;
            } else if (max === g) {
                hue = 2 + (b - r) / chroma;
            } else {
                hue = 4 + (r - g) / chroma;
            }
            hue /= 6;
            hue %= 1;
            return [
                hue * 360,
                chroma * 100,
                grayscale * 100
            ];
        };
        convert.hsl.hcg = function(hsl) {
            const s = hsl[1] / 100;
            const l = hsl[2] / 100;
            const c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l);
            let f = 0;
            if (c < 1.0) {
                f = (l - 0.5 * c) / (1.0 - c);
            }
            return [
                hsl[0],
                c * 100,
                f * 100
            ];
        };
        convert.hsv.hcg = function(hsv) {
            const s = hsv[1] / 100;
            const v = hsv[2] / 100;
            const c = s * v;
            let f = 0;
            if (c < 1.0) {
                f = (v - c) / (1 - c);
            }
            return [
                hsv[0],
                c * 100,
                f * 100
            ];
        };
        convert.hcg.rgb = function(hcg) {
            const h = hcg[0] / 360;
            const c = hcg[1] / 100;
            const g = hcg[2] / 100;
            if (c === 0.0) {
                return [
                    g * 255,
                    g * 255,
                    g * 255
                ];
            }
            const pure = [
                0,
                0,
                0
            ];
            const hi = h % 1 * 6;
            const v = hi % 1;
            const w = 1 - v;
            let mg = 0;
            switch(Math.floor(hi)){
                case 0:
                    pure[0] = 1;
                    pure[1] = v;
                    pure[2] = 0;
                    break;
                case 1:
                    pure[0] = w;
                    pure[1] = 1;
                    pure[2] = 0;
                    break;
                case 2:
                    pure[0] = 0;
                    pure[1] = 1;
                    pure[2] = v;
                    break;
                case 3:
                    pure[0] = 0;
                    pure[1] = w;
                    pure[2] = 1;
                    break;
                case 4:
                    pure[0] = v;
                    pure[1] = 0;
                    pure[2] = 1;
                    break;
                default:
                    pure[0] = 1;
                    pure[1] = 0;
                    pure[2] = w;
            }
            mg = (1.0 - c) * g;
            return [
                (c * pure[0] + mg) * 255,
                (c * pure[1] + mg) * 255,
                (c * pure[2] + mg) * 255
            ];
        };
        convert.hcg.hsv = function(hcg) {
            const c = hcg[1] / 100;
            const g = hcg[2] / 100;
            const v = c + g * (1.0 - c);
            let f = 0;
            if (v > 0.0) {
                f = c / v;
            }
            return [
                hcg[0],
                f * 100,
                v * 100
            ];
        };
        convert.hcg.hsl = function(hcg) {
            const c = hcg[1] / 100;
            const g = hcg[2] / 100;
            const l = g * (1.0 - c) + 0.5 * c;
            let s = 0;
            if (l > 0.0 && l < 0.5) {
                s = c / (2 * l);
            } else if (l >= 0.5 && l < 1.0) {
                s = c / (2 * (1 - l));
            }
            return [
                hcg[0],
                s * 100,
                l * 100
            ];
        };
        convert.hcg.hwb = function(hcg) {
            const c = hcg[1] / 100;
            const g = hcg[2] / 100;
            const v = c + g * (1.0 - c);
            return [
                hcg[0],
                (v - c) * 100,
                (1 - v) * 100
            ];
        };
        convert.hwb.hcg = function(hwb) {
            const w = hwb[1] / 100;
            const b = hwb[2] / 100;
            const v = 1 - b;
            const c = v - w;
            let g = 0;
            if (c < 1) {
                g = (v - c) / (1 - c);
            }
            return [
                hwb[0],
                c * 100,
                g * 100
            ];
        };
        convert.apple.rgb = function(apple) {
            return [
                apple[0] / 65535 * 255,
                apple[1] / 65535 * 255,
                apple[2] / 65535 * 255
            ];
        };
        convert.rgb.apple = function(rgb) {
            return [
                rgb[0] / 255 * 65535,
                rgb[1] / 255 * 65535,
                rgb[2] / 255 * 65535
            ];
        };
        convert.gray.rgb = function(args) {
            return [
                args[0] / 100 * 255,
                args[0] / 100 * 255,
                args[0] / 100 * 255
            ];
        };
        convert.gray.hsl = function(args) {
            return [
                0,
                0,
                args[0]
            ];
        };
        convert.gray.hsv = convert.gray.hsl;
        convert.gray.hwb = function(gray) {
            return [
                0,
                100,
                gray[0]
            ];
        };
        convert.gray.cmyk = function(gray) {
            return [
                0,
                0,
                0,
                gray[0]
            ];
        };
        convert.gray.lab = function(gray) {
            return [
                gray[0],
                0,
                0
            ];
        };
        convert.gray.hex = function(gray) {
            const val = Math.round(gray[0] / 100 * 255) & 0xFF;
            const integer = (val << 16) + (val << 8) + val;
            const string = integer.toString(16).toUpperCase();
            return "000000".substring(string.length) + string;
        };
        convert.rgb.gray = function(rgb) {
            const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
            return [
                val / 255 * 100
            ];
        };
    },
    "76336c6e": function(module, exports, farmRequire, dynamicRequire) {
        const { Argument  } = farmRequire("682c5c39");
        const { Command  } = farmRequire("9f6a2f45");
        const { CommanderError , InvalidArgumentError  } = farmRequire("b38041d6");
        const { Help  } = farmRequire("abb8ed56");
        const { Option  } = farmRequire("8036cd02");
        exports = module.exports = new Command();
        exports.program = exports;
        exports.Argument = Argument;
        exports.Command = Command;
        exports.CommanderError = CommanderError;
        exports.Help = Help;
        exports.InvalidArgumentError = InvalidArgumentError;
        exports.InvalidOptionArgumentError = InvalidArgumentError;
        exports.Option = Option;
    },
    "7b8520d9": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Month extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMonth(this.date.getMonth() + 1);
            }
            down() {
                this.date.setMonth(this.date.getMonth() - 1);
            }
            setTo(val) {
                val = parseInt(val.substr(-2)) - 1;
                this.date.setMonth(val < 0 ? 0 : val);
            }
            toString() {
                let month = this.date.getMonth();
                let tl = this.token.length;
                return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
            }
        }
        module.exports = Month;
    },
    "7dbb9a1f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _chalk = _interop_require_default._(farmRequire("014082d7"));
        var _default = {
            name: "frame",
            type: "select",
            message: "Choose your framework",
            choices: [
                {
                    title: _chalk.default.magenta("Vue"),
                    value: "vue"
                },
                {
                    title: _chalk.default.blue("React") + "\uD83D\uDEA7\uD83D\uDEA7",
                    value: "react",
                    disabled: true
                },
                {
                    title: _chalk.default.cyan("Nuxt") + "\uD83D\uDEA7\uD83D\uDEA7",
                    value: "nuxt",
                    disabled: true
                },
                {
                    title: _chalk.default.cyan("Next") + "\uD83D\uDEA7\uD83D\uDEA7",
                    value: "next",
                    disabled: true
                }
            ]
        };
    },
    "7e487033": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        const fs = farmRequire("f44ca176");
        const api = [
            "access",
            "appendFile",
            "chmod",
            "chown",
            "close",
            "copyFile",
            "fchmod",
            "fchown",
            "fdatasync",
            "fstat",
            "fsync",
            "ftruncate",
            "futimes",
            "lchmod",
            "lchown",
            "link",
            "lstat",
            "mkdir",
            "mkdtemp",
            "open",
            "opendir",
            "readdir",
            "readFile",
            "readlink",
            "realpath",
            "rename",
            "rm",
            "rmdir",
            "stat",
            "symlink",
            "truncate",
            "unlink",
            "utimes",
            "writeFile"
        ].filter((key)=>{
            return typeof fs[key] === "function";
        });
        Object.assign(exports, fs);
        api.forEach((method)=>{
            exports[method] = u(fs[method]);
        });
        exports.exists = function(filename, callback) {
            if (typeof callback === "function") {
                return fs.exists(filename, callback);
            }
            return new Promise((resolve)=>{
                return fs.exists(filename, resolve);
            });
        };
        exports.read = function(fd, buffer, offset, length, position, callback) {
            if (typeof callback === "function") {
                return fs.read(fd, buffer, offset, length, position, callback);
            }
            return new Promise((resolve, reject)=>{
                fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer)=>{
                    if (err) return reject(err);
                    resolve({
                        bytesRead,
                        buffer
                    });
                });
            });
        };
        exports.write = function(fd, buffer, ...args) {
            if (typeof args[args.length - 1] === "function") {
                return fs.write(fd, buffer, ...args);
            }
            return new Promise((resolve, reject)=>{
                fs.write(fd, buffer, ...args, (err, bytesWritten, buffer)=>{
                    if (err) return reject(err);
                    resolve({
                        bytesWritten,
                        buffer
                    });
                });
            });
        };
        exports.readv = function(fd, buffers, ...args) {
            if (typeof args[args.length - 1] === "function") {
                return fs.readv(fd, buffers, ...args);
            }
            return new Promise((resolve, reject)=>{
                fs.readv(fd, buffers, ...args, (err, bytesRead, buffers)=>{
                    if (err) return reject(err);
                    resolve({
                        bytesRead,
                        buffers
                    });
                });
            });
        };
        exports.writev = function(fd, buffers, ...args) {
            if (typeof args[args.length - 1] === "function") {
                return fs.writev(fd, buffers, ...args);
            }
            return new Promise((resolve, reject)=>{
                fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers)=>{
                    if (err) return reject(err);
                    resolve({
                        bytesWritten,
                        buffers
                    });
                });
            });
        };
        if (typeof fs.realpath.native === "function") {
            exports.realpath.native = u(fs.realpath.native);
        } else {
            process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
        }
    },
    "7eba55e1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const chalk = farmRequire("98762936");
        const tinygradient = farmRequire("12dc462f");
        const forbiddenChars = /\s/g;
        function InitGradient(...args) {
            const grad = tinygradient.apply(this, args);
            const ret = (str, opts)=>applyGradient(str ? str.toString() : "", grad, opts);
            ret.multiline = (str, opts)=>multilineGradient(str ? str.toString() : "", grad, opts);
            return ret;
        }
        const getColors = (gradient, options, count)=>options.interpolation.toLowerCase() === "hsv" ? gradient.hsv(count, options.hsvSpin.toLowerCase()) : gradient.rgb(count);
        function applyGradient(str, gradient, opts) {
            const options = validateOptions(opts);
            const colorsCount = Math.max(str.replace(forbiddenChars, "").length, gradient.stops.length);
            const colors = getColors(gradient, options, colorsCount);
            let result = "";
            for (const s of str){
                result += s.match(forbiddenChars) ? s : chalk.hex(colors.shift().toHex())(s);
            }
            return result;
        }
        function multilineGradient(str, gradient, opts) {
            const options = validateOptions(opts);
            const lines = str.split("\n");
            const maxLength = Math.max.apply(null, lines.map((l)=>l.length).concat([
                gradient.stops.length
            ]));
            const colors = getColors(gradient, options, maxLength);
            const results = [];
            for (const line of lines){
                const lineColors = colors.slice(0);
                let lineResult = "";
                for (const l of line){
                    lineResult += chalk.hex(lineColors.shift().toHex())(l);
                }
                results.push(lineResult);
            }
            return results.join("\n");
        }
        function validateOptions(opts) {
            const options = {
                interpolation: "rgb",
                hsvSpin: "short",
                ...opts
            };
            if (opts !== undefined && typeof opts !== "object") {
                throw new TypeError(`Expected \`options\` to be an \`object\`, got \`${typeof opts}\``);
            }
            if (typeof options.interpolation !== "string") {
                throw new TypeError(`Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``);
            }
            if (options.interpolation.toLowerCase() === "hsv" && typeof options.hsvSpin !== "string") {
                throw new TypeError(`Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``);
            }
            return options;
        }
        const aliases = {
            atlas: {
                colors: [
                    "#feac5e",
                    "#c779d0",
                    "#4bc0c8"
                ],
                options: {}
            },
            cristal: {
                colors: [
                    "#bdfff3",
                    "#4ac29a"
                ],
                options: {}
            },
            teen: {
                colors: [
                    "#77a1d3",
                    "#79cbca",
                    "#e684ae"
                ],
                options: {}
            },
            mind: {
                colors: [
                    "#473b7b",
                    "#3584a7",
                    "#30d2be"
                ],
                options: {}
            },
            morning: {
                colors: [
                    "#ff5f6d",
                    "#ffc371"
                ],
                options: {
                    interpolation: "hsv"
                }
            },
            vice: {
                colors: [
                    "#5ee7df",
                    "#b490ca"
                ],
                options: {
                    interpolation: "hsv"
                }
            },
            passion: {
                colors: [
                    "#f43b47",
                    "#453a94"
                ],
                options: {}
            },
            fruit: {
                colors: [
                    "#ff4e50",
                    "#f9d423"
                ],
                options: {}
            },
            instagram: {
                colors: [
                    "#833ab4",
                    "#fd1d1d",
                    "#fcb045"
                ],
                options: {}
            },
            retro: {
                colors: [
                    "#3f51b1",
                    "#5a55ae",
                    "#7b5fac",
                    "#8f6aae",
                    "#a86aa4",
                    "#cc6b8e",
                    "#f18271",
                    "#f3a469",
                    "#f7c978"
                ],
                options: {}
            },
            summer: {
                colors: [
                    "#fdbb2d",
                    "#22c1c3"
                ],
                options: {}
            },
            rainbow: {
                colors: [
                    "#ff0000",
                    "#ff0100"
                ],
                options: {
                    interpolation: "hsv",
                    hsvSpin: "long"
                }
            },
            pastel: {
                colors: [
                    "#74ebd5",
                    "#74ecd5"
                ],
                options: {
                    interpolation: "hsv",
                    hsvSpin: "long"
                }
            }
        };
        module.exports = InitGradient;
        for(const a in aliases){
            module.exports[a] = (str)=>new InitGradient(aliases[a].colors)(str, aliases[a].options);
            module.exports[a].multiline = (str)=>new InitGradient(aliases[a].colors).multiline(str, aliases[a].options);
        }
    },
    "8036cd02": function(module, exports, farmRequire, dynamicRequire) {
        const { InvalidArgumentError  } = farmRequire("b38041d6");
        class Option {
            constructor(flags, description){
                this.flags = flags;
                this.description = description || "";
                this.required = flags.includes("<");
                this.optional = flags.includes("[");
                this.variadic = /\w\.\.\.[>\]]$/.test(flags);
                this.mandatory = false;
                const optionFlags = splitOptionFlags(flags);
                this.short = optionFlags.shortFlag;
                this.long = optionFlags.longFlag;
                this.negate = false;
                if (this.long) {
                    this.negate = this.long.startsWith("--no-");
                }
                this.defaultValue = undefined;
                this.defaultValueDescription = undefined;
                this.presetArg = undefined;
                this.envVar = undefined;
                this.parseArg = undefined;
                this.hidden = false;
                this.argChoices = undefined;
                this.conflictsWith = [];
                this.implied = undefined;
            }
            default(value, description) {
                this.defaultValue = value;
                this.defaultValueDescription = description;
                return this;
            }
            preset(arg) {
                this.presetArg = arg;
                return this;
            }
            conflicts(names) {
                this.conflictsWith = this.conflictsWith.concat(names);
                return this;
            }
            implies(impliedOptionValues) {
                this.implied = Object.assign(this.implied || {}, impliedOptionValues);
                return this;
            }
            env(name) {
                this.envVar = name;
                return this;
            }
            argParser(fn) {
                this.parseArg = fn;
                return this;
            }
            makeOptionMandatory(mandatory = true) {
                this.mandatory = !!mandatory;
                return this;
            }
            hideHelp(hide = true) {
                this.hidden = !!hide;
                return this;
            }
            _concatValue(value, previous) {
                if (previous === this.defaultValue || !Array.isArray(previous)) {
                    return [
                        value
                    ];
                }
                return previous.concat(value);
            }
            choices(values) {
                this.argChoices = values.slice();
                this.parseArg = (arg, previous)=>{
                    if (!this.argChoices.includes(arg)) {
                        throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
                    }
                    if (this.variadic) {
                        return this._concatValue(arg, previous);
                    }
                    return arg;
                };
                return this;
            }
            name() {
                if (this.long) {
                    return this.long.replace(/^--/, "");
                }
                return this.short.replace(/^-/, "");
            }
            attributeName() {
                return camelcase(this.name().replace(/^no-/, ""));
            }
            is(arg) {
                return this.short === arg || this.long === arg;
            }
            isBoolean() {
                return !this.required && !this.optional && !this.negate;
            }
        }
        class DualOptions {
            constructor(options){
                this.positiveOptions = new Map();
                this.negativeOptions = new Map();
                this.dualOptions = new Set();
                options.forEach((option)=>{
                    if (option.negate) {
                        this.negativeOptions.set(option.attributeName(), option);
                    } else {
                        this.positiveOptions.set(option.attributeName(), option);
                    }
                });
                this.negativeOptions.forEach((value, key)=>{
                    if (this.positiveOptions.has(key)) {
                        this.dualOptions.add(key);
                    }
                });
            }
            valueFromOption(value, option) {
                const optionKey = option.attributeName();
                if (!this.dualOptions.has(optionKey)) return true;
                const preset = this.negativeOptions.get(optionKey).presetArg;
                const negativeValue = preset !== undefined ? preset : false;
                return option.negate === (negativeValue === value);
            }
        }
        function camelcase(str) {
            return str.split("-").reduce((str, word)=>{
                return str + word[0].toUpperCase() + word.slice(1);
            });
        }
        function splitOptionFlags(flags) {
            let shortFlag;
            let longFlag;
            const flagParts = flags.split(/[ |,]+/);
            if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
            longFlag = flagParts.shift();
            if (!shortFlag && /^-[^-]$/.test(longFlag)) {
                shortFlag = longFlag;
                longFlag = undefined;
            }
            return {
                shortFlag,
                longFlag
            };
        }
        exports.Option = Option;
        exports.splitOptionFlags = splitOptionFlags;
        exports.DualOptions = DualOptions;
    },
    "807d09a4": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var Buffer = farmRequire("26ccd5f7").Buffer;
        var isEncoding = Buffer.isEncoding || function(encoding) {
            encoding = "" + encoding;
            switch(encoding && encoding.toLowerCase()){
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                    return true;
                default:
                    return false;
            }
        };
        function _normalizeEncoding(enc) {
            if (!enc) return "utf8";
            var retried;
            while(true){
                switch(enc){
                    case "utf8":
                    case "utf-8":
                        return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return "utf16le";
                    case "latin1":
                    case "binary":
                        return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex":
                        return enc;
                    default:
                        if (retried) return;
                        enc = ("" + enc).toLowerCase();
                        retried = true;
                }
            }
        }
        ;
        function normalizeEncoding(enc) {
            var nenc = _normalizeEncoding(enc);
            if (typeof nenc !== "string" && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
            return nenc || enc;
        }
        exports.StringDecoder = StringDecoder;
        function StringDecoder(encoding) {
            this.encoding = normalizeEncoding(encoding);
            var nb;
            switch(this.encoding){
                case "utf16le":
                    this.text = utf16Text;
                    this.end = utf16End;
                    nb = 4;
                    break;
                case "utf8":
                    this.fillLast = utf8FillLast;
                    nb = 4;
                    break;
                case "base64":
                    this.text = base64Text;
                    this.end = base64End;
                    nb = 3;
                    break;
                default:
                    this.write = simpleWrite;
                    this.end = simpleEnd;
                    return;
            }
            this.lastNeed = 0;
            this.lastTotal = 0;
            this.lastChar = Buffer.allocUnsafe(nb);
        }
        StringDecoder.prototype.write = function(buf) {
            if (buf.length === 0) return "";
            var r;
            var i;
            if (this.lastNeed) {
                r = this.fillLast(buf);
                if (r === undefined) return "";
                i = this.lastNeed;
                this.lastNeed = 0;
            } else {
                i = 0;
            }
            if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
            return r || "";
        };
        StringDecoder.prototype.end = utf8End;
        StringDecoder.prototype.text = utf8Text;
        StringDecoder.prototype.fillLast = function(buf) {
            if (this.lastNeed <= buf.length) {
                buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                return this.lastChar.toString(this.encoding, 0, this.lastTotal);
            }
            buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
            this.lastNeed -= buf.length;
        };
        function utf8CheckByte(byte) {
            if (byte <= 0x7F) return 0;
            else if (byte >> 5 === 0x06) return 2;
            else if (byte >> 4 === 0x0E) return 3;
            else if (byte >> 3 === 0x1E) return 4;
            return byte >> 6 === 0x02 ? -1 : -2;
        }
        function utf8CheckIncomplete(self, buf, i) {
            var j = buf.length - 1;
            if (j < i) return 0;
            var nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
                if (nb > 0) self.lastNeed = nb - 1;
                return nb;
            }
            if (--j < i || nb === -2) return 0;
            nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
                if (nb > 0) self.lastNeed = nb - 2;
                return nb;
            }
            if (--j < i || nb === -2) return 0;
            nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
                if (nb > 0) {
                    if (nb === 2) nb = 0;
                    else self.lastNeed = nb - 3;
                }
                return nb;
            }
            return 0;
        }
        function utf8CheckExtraBytes(self, buf, p) {
            if ((buf[0] & 0xC0) !== 0x80) {
                self.lastNeed = 0;
                return "�";
            }
            if (self.lastNeed > 1 && buf.length > 1) {
                if ((buf[1] & 0xC0) !== 0x80) {
                    self.lastNeed = 1;
                    return "�";
                }
                if (self.lastNeed > 2 && buf.length > 2) {
                    if ((buf[2] & 0xC0) !== 0x80) {
                        self.lastNeed = 2;
                        return "�";
                    }
                }
            }
        }
        function utf8FillLast(buf) {
            var p = this.lastTotal - this.lastNeed;
            var r = utf8CheckExtraBytes(this, buf, p);
            if (r !== undefined) return r;
            if (this.lastNeed <= buf.length) {
                buf.copy(this.lastChar, p, 0, this.lastNeed);
                return this.lastChar.toString(this.encoding, 0, this.lastTotal);
            }
            buf.copy(this.lastChar, p, 0, buf.length);
            this.lastNeed -= buf.length;
        }
        function utf8Text(buf, i) {
            var total = utf8CheckIncomplete(this, buf, i);
            if (!this.lastNeed) return buf.toString("utf8", i);
            this.lastTotal = total;
            var end = buf.length - (total - this.lastNeed);
            buf.copy(this.lastChar, 0, end);
            return buf.toString("utf8", i, end);
        }
        function utf8End(buf) {
            var r = buf && buf.length ? this.write(buf) : "";
            if (this.lastNeed) return r + "�";
            return r;
        }
        function utf16Text(buf, i) {
            if ((buf.length - i) % 2 === 0) {
                var r = buf.toString("utf16le", i);
                if (r) {
                    var c = r.charCodeAt(r.length - 1);
                    if (c >= 0xD800 && c <= 0xDBFF) {
                        this.lastNeed = 2;
                        this.lastTotal = 4;
                        this.lastChar[0] = buf[buf.length - 2];
                        this.lastChar[1] = buf[buf.length - 1];
                        return r.slice(0, -1);
                    }
                }
                return r;
            }
            this.lastNeed = 1;
            this.lastTotal = 2;
            this.lastChar[0] = buf[buf.length - 1];
            return buf.toString("utf16le", i, buf.length - 1);
        }
        function utf16End(buf) {
            var r = buf && buf.length ? this.write(buf) : "";
            if (this.lastNeed) {
                var end = this.lastTotal - this.lastNeed;
                return r + this.lastChar.toString("utf16le", 0, end);
            }
            return r;
        }
        function base64Text(buf, i) {
            var n = (buf.length - i) % 3;
            if (n === 0) return buf.toString("base64", i);
            this.lastNeed = 3 - n;
            this.lastTotal = 3;
            if (n === 1) {
                this.lastChar[0] = buf[buf.length - 1];
            } else {
                this.lastChar[0] = buf[buf.length - 2];
                this.lastChar[1] = buf[buf.length - 1];
            }
            return buf.toString("base64", i, buf.length - n);
        }
        function base64End(buf) {
            var r = buf && buf.length ? this.write(buf) : "";
            if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
            return r;
        }
        function simpleWrite(buf) {
            return buf.toString(this.encoding);
        }
        function simpleEnd(buf) {
            return buf && buf.length ? this.write(buf) : "";
        }
    },
    "80b2142c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const stringReplaceAll = (string, substring, replacer)=>{
            let index = string.indexOf(substring);
            if (index === -1) {
                return string;
            }
            const substringLength = substring.length;
            let endIndex = 0;
            let returnValue = "";
            do {
                returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
                endIndex = index + substringLength;
                index = string.indexOf(substring, endIndex);
            }while (index !== -1);
            returnValue += string.substr(endIndex);
            return returnValue;
        };
        const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index)=>{
            let endIndex = 0;
            let returnValue = "";
            do {
                const gotCR = string[index - 1] === "\r";
                returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
                endIndex = index + 1;
                index = string.indexOf("\n", endIndex);
            }while (index !== -1);
            returnValue += string.substr(endIndex);
            return returnValue;
        };
        module.exports = {
            stringReplaceAll,
            stringEncaseCRLFWithFirstIndex
        };
    },
    "80c9ca24": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const _require = farmRequire("84d4236d"), cursor = _require.cursor;
        const MultiselectPrompt = farmRequire("19efc509");
        const _require2 = farmRequire("232af10c"), clear = _require2.clear, style = _require2.style, figures = _require2.figures;
        class AutocompleteMultiselectPrompt extends MultiselectPrompt {
            constructor(opts = {}){
                opts.overrideRender = true;
                super(opts);
                this.inputValue = "";
                this.clear = clear("", this.out.columns);
                this.filteredOptions = this.value;
                this.render();
            }
            last() {
                this.cursor = this.filteredOptions.length - 1;
                this.render();
            }
            next() {
                this.cursor = (this.cursor + 1) % this.filteredOptions.length;
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.cursor = this.filteredOptions.length - 1;
                } else {
                    this.cursor--;
                }
                this.render();
            }
            down() {
                if (this.cursor === this.filteredOptions.length - 1) {
                    this.cursor = 0;
                } else {
                    this.cursor++;
                }
                this.render();
            }
            left() {
                this.filteredOptions[this.cursor].selected = false;
                this.render();
            }
            right() {
                if (this.value.filter((e)=>e.selected).length >= this.maxChoices) return this.bell();
                this.filteredOptions[this.cursor].selected = true;
                this.render();
            }
            delete() {
                if (this.inputValue.length) {
                    this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
                    this.updateFilteredOptions();
                }
            }
            updateFilteredOptions() {
                const currentHighlight = this.filteredOptions[this.cursor];
                this.filteredOptions = this.value.filter((v)=>{
                    if (this.inputValue) {
                        if (typeof v.title === "string") {
                            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
                                return true;
                            }
                        }
                        if (typeof v.value === "string") {
                            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                });
                const newHighlightIndex = this.filteredOptions.findIndex((v)=>v === currentHighlight);
                this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
                this.render();
            }
            handleSpaceToggle() {
                const v = this.filteredOptions[this.cursor];
                if (v.selected) {
                    v.selected = false;
                    this.render();
                } else if (v.disabled || this.value.filter((e)=>e.selected).length >= this.maxChoices) {
                    return this.bell();
                } else {
                    v.selected = true;
                    this.render();
                }
            }
            handleInputChange(c) {
                this.inputValue = this.inputValue + c;
                this.updateFilteredOptions();
            }
            _(c, key) {
                if (c === " ") {
                    this.handleSpaceToggle();
                } else {
                    this.handleInputChange(c);
                }
            }
            renderInstructions() {
                if (this.instructions === undefined || this.instructions) {
                    if (typeof this.instructions === "string") {
                        return this.instructions;
                    }
                    return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
                }
                return "";
            }
            renderCurrentInput() {
                return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
            }
            renderOption(cursor, v, i) {
                let title;
                if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                else title = cursor === i ? color.cyan().underline(v.title) : v.title;
                return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
            }
            renderDoneOrInstructions() {
                if (this.done) {
                    return this.value.filter((e)=>e.selected).map((v)=>v.title).join(", ");
                }
                const output = [
                    color.gray(this.hint),
                    this.renderInstructions(),
                    this.renderCurrentInput()
                ];
                if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
                    output.push(color.yellow(this.warn));
                }
                return output.join(" ");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                super.render();
                let prompt = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.renderDoneOrInstructions()
                ].join(" ");
                if (this.showMinError) {
                    prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
                    this.showMinError = false;
                }
                prompt += this.renderOptions(this.filteredOptions);
                this.out.write(this.clear + prompt);
                this.clear = clear(prompt, this.out.columns);
            }
        }
        module.exports = AutocompleteMultiselectPrompt;
    },
    "815c9ab9": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        const path = farmRequire("path");
        const mkdirs = farmRequire("43482b8b").mkdirs;
        const pathExists = farmRequire("619c6a41").pathExists;
        const utimesMillis = farmRequire("de2f2620").utimesMillis;
        const stat = farmRequire("bfed495f");
        function copy(src, dest, opts, cb) {
            if (typeof opts === "function" && !cb) {
                cb = opts;
                opts = {};
            } else if (typeof opts === "function") {
                opts = {
                    filter: opts
                };
            }
            cb = cb || function() {};
            opts = opts || {};
            opts.clobber = "clobber" in opts ? !!opts.clobber : true;
            opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
            if (opts.preserveTimestamps && process.arch === "ia32") {
                process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n" + "	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
            }
            stat.checkPaths(src, dest, "copy", opts, (err, stats)=>{
                if (err) return cb(err);
                const { srcStat , destStat  } = stats;
                stat.checkParentPaths(src, srcStat, dest, "copy", (err)=>{
                    if (err) return cb(err);
                    runFilter(src, dest, opts, (err, include)=>{
                        if (err) return cb(err);
                        if (!include) return cb();
                        checkParentDir(destStat, src, dest, opts, cb);
                    });
                });
            });
        }
        function checkParentDir(destStat, src, dest, opts, cb) {
            const destParent = path.dirname(dest);
            pathExists(destParent, (err, dirExists)=>{
                if (err) return cb(err);
                if (dirExists) return getStats(destStat, src, dest, opts, cb);
                mkdirs(destParent, (err)=>{
                    if (err) return cb(err);
                    return getStats(destStat, src, dest, opts, cb);
                });
            });
        }
        function runFilter(src, dest, opts, cb) {
            if (!opts.filter) return cb(null, true);
            Promise.resolve(opts.filter(src, dest)).then((include)=>cb(null, include), (error)=>cb(error));
        }
        function getStats(destStat, src, dest, opts, cb) {
            const stat = opts.dereference ? fs.stat : fs.lstat;
            stat(src, (err, srcStat)=>{
                if (err) return cb(err);
                if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
                else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
                else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
                else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src}`));
                else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
                return cb(new Error(`Unknown file: ${src}`));
            });
        }
        function onFile(srcStat, destStat, src, dest, opts, cb) {
            if (!destStat) return copyFile(srcStat, src, dest, opts, cb);
            return mayCopyFile(srcStat, src, dest, opts, cb);
        }
        function mayCopyFile(srcStat, src, dest, opts, cb) {
            if (opts.overwrite) {
                fs.unlink(dest, (err)=>{
                    if (err) return cb(err);
                    return copyFile(srcStat, src, dest, opts, cb);
                });
            } else if (opts.errorOnExist) {
                return cb(new Error(`'${dest}' already exists`));
            } else return cb();
        }
        function copyFile(srcStat, src, dest, opts, cb) {
            fs.copyFile(src, dest, (err)=>{
                if (err) return cb(err);
                if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
                return setDestMode(dest, srcStat.mode, cb);
            });
        }
        function handleTimestampsAndMode(srcMode, src, dest, cb) {
            if (fileIsNotWritable(srcMode)) {
                return makeFileWritable(dest, srcMode, (err)=>{
                    if (err) return cb(err);
                    return setDestTimestampsAndMode(srcMode, src, dest, cb);
                });
            }
            return setDestTimestampsAndMode(srcMode, src, dest, cb);
        }
        function fileIsNotWritable(srcMode) {
            return (srcMode & 128) === 0;
        }
        function makeFileWritable(dest, srcMode, cb) {
            return setDestMode(dest, srcMode | 128, cb);
        }
        function setDestTimestampsAndMode(srcMode, src, dest, cb) {
            setDestTimestamps(src, dest, (err)=>{
                if (err) return cb(err);
                return setDestMode(dest, srcMode, cb);
            });
        }
        function setDestMode(dest, srcMode, cb) {
            return fs.chmod(dest, srcMode, cb);
        }
        function setDestTimestamps(src, dest, cb) {
            fs.stat(src, (err, updatedSrcStat)=>{
                if (err) return cb(err);
                return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
            });
        }
        function onDir(srcStat, destStat, src, dest, opts, cb) {
            if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
            return copyDir(src, dest, opts, cb);
        }
        function mkDirAndCopy(srcMode, src, dest, opts, cb) {
            fs.mkdir(dest, (err)=>{
                if (err) return cb(err);
                copyDir(src, dest, opts, (err)=>{
                    if (err) return cb(err);
                    return setDestMode(dest, srcMode, cb);
                });
            });
        }
        function copyDir(src, dest, opts, cb) {
            fs.readdir(src, (err, items)=>{
                if (err) return cb(err);
                return copyDirItems(items, src, dest, opts, cb);
            });
        }
        function copyDirItems(items, src, dest, opts, cb) {
            const item = items.pop();
            if (!item) return cb();
            return copyDirItem(items, item, src, dest, opts, cb);
        }
        function copyDirItem(items, item, src, dest, opts, cb) {
            const srcItem = path.join(src, item);
            const destItem = path.join(dest, item);
            runFilter(srcItem, destItem, opts, (err, include)=>{
                if (err) return cb(err);
                if (!include) return copyDirItems(items, src, dest, opts, cb);
                stat.checkPaths(srcItem, destItem, "copy", opts, (err, stats)=>{
                    if (err) return cb(err);
                    const { destStat  } = stats;
                    getStats(destStat, srcItem, destItem, opts, (err)=>{
                        if (err) return cb(err);
                        return copyDirItems(items, src, dest, opts, cb);
                    });
                });
            });
        }
        function onLink(destStat, src, dest, opts, cb) {
            fs.readlink(src, (err, resolvedSrc)=>{
                if (err) return cb(err);
                if (opts.dereference) {
                    resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
                }
                if (!destStat) {
                    return fs.symlink(resolvedSrc, dest, cb);
                } else {
                    fs.readlink(dest, (err, resolvedDest)=>{
                        if (err) {
                            if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlink(resolvedSrc, dest, cb);
                            return cb(err);
                        }
                        if (opts.dereference) {
                            resolvedDest = path.resolve(process.cwd(), resolvedDest);
                        }
                        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
                            return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
                        }
                        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
                            return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
                        }
                        return copyLink(resolvedSrc, dest, cb);
                    });
                }
            });
        }
        function copyLink(resolvedSrc, dest, cb) {
            fs.unlink(dest, (err)=>{
                if (err) return cb(err);
                return fs.symlink(resolvedSrc, dest, cb);
            });
        }
        module.exports = copy;
    },
    "816238c1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        const future = [
            {
                name: "useRouter",
                type: ()=>"toggle",
                message: "Add Vue Router for Single Page Application development?",
                initial: false,
                active: "Yes",
                inactive: "No"
            },
            {
                name: "usePinia",
                type: ()=>"toggle",
                message: "Add Pinia for state management?",
                initial: false,
                active: "Yes",
                inactive: "No"
            },
            {
                name: "useEslint",
                type: ()=>"toggle",
                message: "Add ESLint for code quality?",
                initial: false,
                active: "Yes",
                inactive: "No"
            },
            {
                name: "usePrettier",
                type: ()=>"toggle",
                message: "Add Prettier for code formatting?",
                initial: false,
                active: "Yes",
                inactive: "No"
            }
        ];
        var _default = future;
    },
    "8331ec09": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var fs = farmRequire("fs");
        var path = farmRequire("path");
        var utils = farmRequire("9c14e008");
        var scopeOptionWarned = false;
        var _VERSION_STRING = farmRequire("c7f0177e").version;
        var _DEFAULT_OPEN_DELIMITER = "<";
        var _DEFAULT_CLOSE_DELIMITER = ">";
        var _DEFAULT_DELIMITER = "%";
        var _DEFAULT_LOCALS_NAME = "locals";
        var _NAME = "ejs";
        var _REGEX_STRING = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";
        var _OPTS_PASSABLE_WITH_DATA = [
            "delimiter",
            "scope",
            "context",
            "debug",
            "compileDebug",
            "client",
            "_with",
            "rmWhitespace",
            "strict",
            "filename",
            "async"
        ];
        var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat("cache");
        var _BOM = /^\uFEFF/;
        var _JS_IDENTIFIER = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
        exports.cache = utils.cache;
        exports.fileLoader = fs.readFileSync;
        exports.localsName = _DEFAULT_LOCALS_NAME;
        exports.promiseImpl = new Function("return this;")().Promise;
        exports.resolveInclude = function(name, filename, isDir) {
            var dirname = path.dirname;
            var extname = path.extname;
            var resolve = path.resolve;
            var includePath = resolve(isDir ? filename : dirname(filename), name);
            var ext = extname(name);
            if (!ext) {
                includePath += ".ejs";
            }
            return includePath;
        };
        function resolvePaths(name, paths) {
            var filePath;
            if (paths.some(function(v) {
                filePath = exports.resolveInclude(name, v, true);
                return fs.existsSync(filePath);
            })) {
                return filePath;
            }
        }
        function getIncludePath(path, options) {
            var includePath;
            var filePath;
            var views = options.views;
            var match = /^[A-Za-z]+:\\|^\//.exec(path);
            if (match && match.length) {
                path = path.replace(/^\/*/, "");
                if (Array.isArray(options.root)) {
                    includePath = resolvePaths(path, options.root);
                } else {
                    includePath = exports.resolveInclude(path, options.root || "/", true);
                }
            } else {
                if (options.filename) {
                    filePath = exports.resolveInclude(path, options.filename);
                    if (fs.existsSync(filePath)) {
                        includePath = filePath;
                    }
                }
                if (!includePath && Array.isArray(views)) {
                    includePath = resolvePaths(path, views);
                }
                if (!includePath && typeof options.includer !== "function") {
                    throw new Error('Could not find the include file "' + options.escapeFunction(path) + '"');
                }
            }
            return includePath;
        }
        function handleCache(options, template) {
            var func;
            var filename = options.filename;
            var hasTemplate = arguments.length > 1;
            if (options.cache) {
                if (!filename) {
                    throw new Error("cache option requires a filename");
                }
                func = exports.cache.get(filename);
                if (func) {
                    return func;
                }
                if (!hasTemplate) {
                    template = fileLoader(filename).toString().replace(_BOM, "");
                }
            } else if (!hasTemplate) {
                if (!filename) {
                    throw new Error("Internal EJS error: no file name or template " + "provided");
                }
                template = fileLoader(filename).toString().replace(_BOM, "");
            }
            func = exports.compile(template, options);
            if (options.cache) {
                exports.cache.set(filename, func);
            }
            return func;
        }
        function tryHandleCache(options, data, cb) {
            var result;
            if (!cb) {
                if (typeof exports.promiseImpl == "function") {
                    return new exports.promiseImpl(function(resolve, reject) {
                        try {
                            result = handleCache(options)(data);
                            resolve(result);
                        } catch (err) {
                            reject(err);
                        }
                    });
                } else {
                    throw new Error("Please provide a callback function");
                }
            } else {
                try {
                    result = handleCache(options)(data);
                } catch (err) {
                    return cb(err);
                }
                cb(null, result);
            }
        }
        function fileLoader(filePath) {
            return exports.fileLoader(filePath);
        }
        function includeFile(path, options) {
            var opts = utils.shallowCopy(utils.createNullProtoObjWherePossible(), options);
            opts.filename = getIncludePath(path, opts);
            if (typeof options.includer === "function") {
                var includerResult = options.includer(path, opts.filename);
                if (includerResult) {
                    if (includerResult.filename) {
                        opts.filename = includerResult.filename;
                    }
                    if (includerResult.template) {
                        return handleCache(opts, includerResult.template);
                    }
                }
            }
            return handleCache(opts);
        }
        function rethrow(err, str, flnm, lineno, esc) {
            var lines = str.split("\n");
            var start = Math.max(lineno - 3, 0);
            var end = Math.min(lines.length, lineno + 3);
            var filename = esc(flnm);
            var context = lines.slice(start, end).map(function(line, i) {
                var curr = i + start + 1;
                return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
            }).join("\n");
            err.path = filename;
            err.message = (filename || "ejs") + ":" + lineno + "\n" + context + "\n\n" + err.message;
            throw err;
        }
        function stripSemi(str) {
            return str.replace(/;(\s*$)/, "$1");
        }
        exports.compile = function compile(template, opts) {
            var templ;
            if (opts && opts.scope) {
                if (!scopeOptionWarned) {
                    console.warn("`scope` option is deprecated and will be removed in EJS 3");
                    scopeOptionWarned = true;
                }
                if (!opts.context) {
                    opts.context = opts.scope;
                }
                delete opts.scope;
            }
            templ = new Template(template, opts);
            return templ.compile();
        };
        exports.render = function(template, d, o) {
            var data = d || utils.createNullProtoObjWherePossible();
            var opts = o || utils.createNullProtoObjWherePossible();
            if (arguments.length == 2) {
                utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
            }
            return handleCache(opts, template)(data);
        };
        exports.renderFile = function() {
            var args = Array.prototype.slice.call(arguments);
            var filename = args.shift();
            var cb;
            var opts = {
                filename: filename
            };
            var data;
            var viewOpts;
            if (typeof arguments[arguments.length - 1] == "function") {
                cb = args.pop();
            }
            if (args.length) {
                data = args.shift();
                if (args.length) {
                    utils.shallowCopy(opts, args.pop());
                } else {
                    if (data.settings) {
                        if (data.settings.views) {
                            opts.views = data.settings.views;
                        }
                        if (data.settings["view cache"]) {
                            opts.cache = true;
                        }
                        viewOpts = data.settings["view options"];
                        if (viewOpts) {
                            utils.shallowCopy(opts, viewOpts);
                        }
                    }
                    utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
                }
                opts.filename = filename;
            } else {
                data = utils.createNullProtoObjWherePossible();
            }
            return tryHandleCache(opts, data, cb);
        };
        exports.Template = Template;
        exports.clearCache = function() {
            exports.cache.reset();
        };
        function Template(text, opts) {
            opts = opts || utils.createNullProtoObjWherePossible();
            var options = utils.createNullProtoObjWherePossible();
            this.templateText = text;
            this.mode = null;
            this.truncate = false;
            this.currentLine = 1;
            this.source = "";
            options.client = opts.client || false;
            options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
            options.compileDebug = opts.compileDebug !== false;
            options.debug = !!opts.debug;
            options.filename = opts.filename;
            options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
            options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
            options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
            options.strict = opts.strict || false;
            options.context = opts.context;
            options.cache = opts.cache || false;
            options.rmWhitespace = opts.rmWhitespace;
            options.root = opts.root;
            options.includer = opts.includer;
            options.outputFunctionName = opts.outputFunctionName;
            options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
            options.views = opts.views;
            options.async = opts.async;
            options.destructuredLocals = opts.destructuredLocals;
            options.legacyInclude = typeof opts.legacyInclude != "undefined" ? !!opts.legacyInclude : true;
            if (options.strict) {
                options._with = false;
            } else {
                options._with = typeof opts._with != "undefined" ? opts._with : true;
            }
            this.opts = options;
            this.regex = this.createRegex();
        }
        Template.modes = {
            EVAL: "eval",
            ESCAPED: "escaped",
            RAW: "raw",
            COMMENT: "comment",
            LITERAL: "literal"
        };
        Template.prototype = {
            createRegex: function() {
                var str = _REGEX_STRING;
                var delim = utils.escapeRegExpChars(this.opts.delimiter);
                var open = utils.escapeRegExpChars(this.opts.openDelimiter);
                var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
                str = str.replace(/%/g, delim).replace(/</g, open).replace(/>/g, close);
                return new RegExp(str);
            },
            compile: function() {
                var src;
                var fn;
                var opts = this.opts;
                var prepended = "";
                var appended = "";
                var escapeFn = opts.escapeFunction;
                var ctor;
                var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : "undefined";
                if (!this.source) {
                    this.generateSource();
                    prepended += '  var __output = "";\n' + "  function __append(s) { if (s !== undefined && s !== null) __output += s }\n";
                    if (opts.outputFunctionName) {
                        if (!_JS_IDENTIFIER.test(opts.outputFunctionName)) {
                            throw new Error("outputFunctionName is not a valid JS identifier.");
                        }
                        prepended += "  var " + opts.outputFunctionName + " = __append;" + "\n";
                    }
                    if (opts.localsName && !_JS_IDENTIFIER.test(opts.localsName)) {
                        throw new Error("localsName is not a valid JS identifier.");
                    }
                    if (opts.destructuredLocals && opts.destructuredLocals.length) {
                        var destructuring = "  var __locals = (" + opts.localsName + " || {}),\n";
                        for(var i = 0; i < opts.destructuredLocals.length; i++){
                            var name = opts.destructuredLocals[i];
                            if (!_JS_IDENTIFIER.test(name)) {
                                throw new Error("destructuredLocals[" + i + "] is not a valid JS identifier.");
                            }
                            if (i > 0) {
                                destructuring += ",\n  ";
                            }
                            destructuring += name + " = __locals." + name;
                        }
                        prepended += destructuring + ";\n";
                    }
                    if (opts._with !== false) {
                        prepended += "  with (" + opts.localsName + " || {}) {" + "\n";
                        appended += "  }" + "\n";
                    }
                    appended += "  return __output;" + "\n";
                    this.source = prepended + this.source + appended;
                }
                if (opts.compileDebug) {
                    src = "var __line = 1" + "\n" + "  , __lines = " + JSON.stringify(this.templateText) + "\n" + "  , __filename = " + sanitizedFilename + ";" + "\n" + "try {" + "\n" + this.source + "} catch (e) {" + "\n" + "  rethrow(e, __lines, __filename, __line, escapeFn);" + "\n" + "}" + "\n";
                } else {
                    src = this.source;
                }
                if (opts.client) {
                    src = "escapeFn = escapeFn || " + escapeFn.toString() + ";" + "\n" + src;
                    if (opts.compileDebug) {
                        src = "rethrow = rethrow || " + rethrow.toString() + ";" + "\n" + src;
                    }
                }
                if (opts.strict) {
                    src = '"use strict";\n' + src;
                }
                if (opts.debug) {
                    console.log(src);
                }
                if (opts.compileDebug && opts.filename) {
                    src = src + "\n" + "//# sourceURL=" + sanitizedFilename + "\n";
                }
                try {
                    if (opts.async) {
                        try {
                            ctor = new Function("return (async function(){}).constructor;")();
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                throw new Error("This environment does not support async/await");
                            } else {
                                throw e;
                            }
                        }
                    } else {
                        ctor = Function;
                    }
                    fn = new ctor(opts.localsName + ", escapeFn, include, rethrow", src);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        if (opts.filename) {
                            e.message += " in " + opts.filename;
                        }
                        e.message += " while compiling ejs\n\n";
                        e.message += "If the above error is not helpful, you may want to try EJS-Lint:\n";
                        e.message += "https://github.com/RyanZim/EJS-Lint";
                        if (!opts.async) {
                            e.message += "\n";
                            e.message += "Or, if you meant to create an async function, pass `async: true` as an option.";
                        }
                    }
                    throw e;
                }
                var returnedFn = opts.client ? fn : function anonymous(data) {
                    var include = function(path, includeData) {
                        var d = utils.shallowCopy(utils.createNullProtoObjWherePossible(), data);
                        if (includeData) {
                            d = utils.shallowCopy(d, includeData);
                        }
                        return includeFile(path, opts)(d);
                    };
                    return fn.apply(opts.context, [
                        data || utils.createNullProtoObjWherePossible(),
                        escapeFn,
                        include,
                        rethrow
                    ]);
                };
                if (opts.filename && typeof Object.defineProperty === "function") {
                    var filename = opts.filename;
                    var basename = path.basename(filename, path.extname(filename));
                    try {
                        Object.defineProperty(returnedFn, "name", {
                            value: basename,
                            writable: false,
                            enumerable: false,
                            configurable: true
                        });
                    } catch (e) {}
                }
                return returnedFn;
            },
            generateSource: function() {
                var opts = this.opts;
                if (opts.rmWhitespace) {
                    this.templateText = this.templateText.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
                }
                this.templateText = this.templateText.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
                var self = this;
                var matches = this.parseTemplateText();
                var d = this.opts.delimiter;
                var o = this.opts.openDelimiter;
                var c = this.opts.closeDelimiter;
                if (matches && matches.length) {
                    matches.forEach(function(line, index) {
                        var closing;
                        if (line.indexOf(o + d) === 0 && line.indexOf(o + d + d) !== 0) {
                            closing = matches[index + 2];
                            if (!(closing == d + c || closing == "-" + d + c || closing == "_" + d + c)) {
                                throw new Error('Could not find matching close tag for "' + line + '".');
                            }
                        }
                        self.scanLine(line);
                    });
                }
            },
            parseTemplateText: function() {
                var str = this.templateText;
                var pat = this.regex;
                var result = pat.exec(str);
                var arr = [];
                var firstPos;
                while(result){
                    firstPos = result.index;
                    if (firstPos !== 0) {
                        arr.push(str.substring(0, firstPos));
                        str = str.slice(firstPos);
                    }
                    arr.push(result[0]);
                    str = str.slice(result[0].length);
                    result = pat.exec(str);
                }
                if (str) {
                    arr.push(str);
                }
                return arr;
            },
            _addOutput: function(line) {
                if (this.truncate) {
                    line = line.replace(/^(?:\r\n|\r|\n)/, "");
                    this.truncate = false;
                }
                if (!line) {
                    return line;
                }
                line = line.replace(/\\/g, "\\\\");
                line = line.replace(/\n/g, "\\n");
                line = line.replace(/\r/g, "\\r");
                line = line.replace(/"/g, '\\"');
                this.source += '    ; __append("' + line + '")' + "\n";
            },
            scanLine: function(line) {
                var self = this;
                var d = this.opts.delimiter;
                var o = this.opts.openDelimiter;
                var c = this.opts.closeDelimiter;
                var newLineCount = 0;
                newLineCount = line.split("\n").length - 1;
                switch(line){
                    case o + d:
                    case o + d + "_":
                        this.mode = Template.modes.EVAL;
                        break;
                    case o + d + "=":
                        this.mode = Template.modes.ESCAPED;
                        break;
                    case o + d + "-":
                        this.mode = Template.modes.RAW;
                        break;
                    case o + d + "#":
                        this.mode = Template.modes.COMMENT;
                        break;
                    case o + d + d:
                        this.mode = Template.modes.LITERAL;
                        this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + "\n";
                        break;
                    case d + d + c:
                        this.mode = Template.modes.LITERAL;
                        this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + "\n";
                        break;
                    case d + c:
                    case "-" + d + c:
                    case "_" + d + c:
                        if (this.mode == Template.modes.LITERAL) {
                            this._addOutput(line);
                        }
                        this.mode = null;
                        this.truncate = line.indexOf("-") === 0 || line.indexOf("_") === 0;
                        break;
                    default:
                        if (this.mode) {
                            switch(this.mode){
                                case Template.modes.EVAL:
                                case Template.modes.ESCAPED:
                                case Template.modes.RAW:
                                    if (line.lastIndexOf("//") > line.lastIndexOf("\n")) {
                                        line += "\n";
                                    }
                            }
                            switch(this.mode){
                                case Template.modes.EVAL:
                                    this.source += "    ; " + line + "\n";
                                    break;
                                case Template.modes.ESCAPED:
                                    this.source += "    ; __append(escapeFn(" + stripSemi(line) + "))" + "\n";
                                    break;
                                case Template.modes.RAW:
                                    this.source += "    ; __append(" + stripSemi(line) + ")" + "\n";
                                    break;
                                case Template.modes.COMMENT:
                                    break;
                                case Template.modes.LITERAL:
                                    this._addOutput(line);
                                    break;
                            }
                        } else {
                            this._addOutput(line);
                        }
                }
                if (self.opts.compileDebug && newLineCount) {
                    this.currentLine += newLineCount;
                    this.source += "    ; __line = " + this.currentLine + "\n";
                }
            }
        };
        exports.escapeXML = utils.escapeXML;
        exports.__express = exports.renderFile;
        exports.VERSION = _VERSION_STRING;
        exports.name = _NAME;
        if (typeof window != "undefined") {
            window.ejs = exports;
        }
    },
    "84016105": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const { stringify  } = farmRequire("01e04666");
        const { outputFile  } = farmRequire("4f54265c");
        async function outputJson(file, data, options = {}) {
            const str = stringify(data, options);
            await outputFile(file, str, options);
        }
        module.exports = outputJson;
    },
    "84050e51": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            stringReplaceAll: function() {
                return stringReplaceAll;
            },
            stringEncaseCRLFWithFirstIndex: function() {
                return stringEncaseCRLFWithFirstIndex;
            }
        });
        function stringReplaceAll(string, substring, replacer) {
            let index = string.indexOf(substring);
            if (index === -1) {
                return string;
            }
            const substringLength = substring.length;
            let endIndex = 0;
            let returnValue = "";
            do {
                returnValue += string.slice(endIndex, index) + substring + replacer;
                endIndex = index + substringLength;
                index = string.indexOf(substring, endIndex);
            }while (index !== -1);
            returnValue += string.slice(endIndex);
            return returnValue;
        }
        function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
            let endIndex = 0;
            let returnValue = "";
            do {
                const gotCR = string[index - 1] === "\r";
                returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
                endIndex = index + 1;
                index = string.indexOf("\n", endIndex);
            }while (index !== -1);
            returnValue += string.slice(endIndex);
            return returnValue;
        }
    },
    "84d4236d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const ESC = "\x1b";
        const CSI = `${ESC}[`;
        const beep = "\x07";
        const cursor = {
            to (x, y) {
                if (!y) return `${CSI}${x + 1}G`;
                return `${CSI}${y + 1};${x + 1}H`;
            },
            move (x, y) {
                let ret = "";
                if (x < 0) ret += `${CSI}${-x}D`;
                else if (x > 0) ret += `${CSI}${x}C`;
                if (y < 0) ret += `${CSI}${-y}A`;
                else if (y > 0) ret += `${CSI}${y}B`;
                return ret;
            },
            up: (count = 1)=>`${CSI}${count}A`,
            down: (count = 1)=>`${CSI}${count}B`,
            forward: (count = 1)=>`${CSI}${count}C`,
            backward: (count = 1)=>`${CSI}${count}D`,
            nextLine: (count = 1)=>`${CSI}E`.repeat(count),
            prevLine: (count = 1)=>`${CSI}F`.repeat(count),
            left: `${CSI}G`,
            hide: `${CSI}?25l`,
            show: `${CSI}?25h`,
            save: `${ESC}7`,
            restore: `${ESC}8`
        };
        const scroll = {
            up: (count = 1)=>`${CSI}S`.repeat(count),
            down: (count = 1)=>`${CSI}T`.repeat(count)
        };
        const erase = {
            screen: `${CSI}2J`,
            up: (count = 1)=>`${CSI}1J`.repeat(count),
            down: (count = 1)=>`${CSI}J`.repeat(count),
            line: `${CSI}2K`,
            lineEnd: `${CSI}K`,
            lineStart: `${CSI}1K`,
            lines (count) {
                let clear = "";
                for(let i = 0; i < count; i++)clear += this.line + (i < count - 1 ? cursor.up() : "");
                if (count) clear += cursor.left;
                return clear;
            }
        };
        module.exports = {
            cursor,
            scroll,
            erase,
            beep
        };
    },
    "868bb866": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Meridiem extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setHours((this.date.getHours() + 12) % 24);
            }
            down() {
                this.up();
            }
            toString() {
                let meridiem = this.date.getHours() > 12 ? "pm" : "am";
                return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
            }
        }
        module.exports = Meridiem;
    },
    "891c55ab": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const os = farmRequire("os");
        const tty = farmRequire("tty");
        const hasFlag = farmRequire("ce9278cc");
        const { env  } = process;
        let forceColor;
        if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
            forceColor = 0;
        } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
            forceColor = 1;
        }
        if ("FORCE_COLOR" in env) {
            if (env.FORCE_COLOR === "true") {
                forceColor = 1;
            } else if (env.FORCE_COLOR === "false") {
                forceColor = 0;
            } else {
                forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
            }
        }
        function translateLevel(level) {
            if (level === 0) {
                return false;
            }
            return {
                level,
                hasBasic: true,
                has256: level >= 2,
                has16m: level >= 3
            };
        }
        function supportsColor(haveStream, streamIsTTY) {
            if (forceColor === 0) {
                return 0;
            }
            if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
                return 3;
            }
            if (hasFlag("color=256")) {
                return 2;
            }
            if (haveStream && !streamIsTTY && forceColor === undefined) {
                return 0;
            }
            const min = forceColor || 0;
            if (env.TERM === "dumb") {
                return min;
            }
            if (process.platform === "win32") {
                const osRelease = os.release().split(".");
                if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
                    return Number(osRelease[2]) >= 14931 ? 3 : 2;
                }
                return 1;
            }
            if ("CI" in env) {
                if ([
                    "TRAVIS",
                    "CIRCLECI",
                    "APPVEYOR",
                    "GITLAB_CI",
                    "GITHUB_ACTIONS",
                    "BUILDKITE"
                ].some((sign)=>sign in env) || env.CI_NAME === "codeship") {
                    return 1;
                }
                return min;
            }
            if ("TEAMCITY_VERSION" in env) {
                return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
            }
            if (env.COLORTERM === "truecolor") {
                return 3;
            }
            if ("TERM_PROGRAM" in env) {
                const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
                switch(env.TERM_PROGRAM){
                    case "iTerm.app":
                        return version >= 3 ? 3 : 2;
                    case "Apple_Terminal":
                        return 2;
                }
            }
            if (/-256(color)?$/i.test(env.TERM)) {
                return 2;
            }
            if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
                return 1;
            }
            if ("COLORTERM" in env) {
                return 1;
            }
            return min;
        }
        function getSupportLevel(stream) {
            const level = supportsColor(stream, stream && stream.isTTY);
            return translateLevel(level);
        }
        module.exports = {
            supportsColor: getSupportLevel,
            stdout: translateLevel(supportsColor(true, tty.isatty(1))),
            stderr: translateLevel(supportsColor(true, tty.isatty(2)))
        };
    },
    "89de49a1": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = {
            "author": "",
            "bin": {
                "create-vite-app": "./outfile.cjs",
                "create-vite-template": "./outfile.cjs",
                "v": "./outfile.cjs",
                "vite-app": "./outfile.cjs",
                "vite-cli": "./outfile.cjs"
            },
            "bugs": "https://github.com/ErKeLost/vite-cli/issues",
            "dependencies": {
                "prettier": "latest"
            },
            "description": "",
            "devDependencies": {
                "@types/node": "^18.11.9",
                "chalk": "^5.1.2",
                "commander": "^10.0.0",
                "debug": "^4.3.4",
                "ejs": "^3.1.8",
                "esbuild": "^0.17.11",
                "esbuild-plugin-alias": "^0.2.1",
                "esbuild-plugin-path-alias": "^1.0.6",
                "esbuild-ts-paths": "^1.1.3",
                "fs-extra": "^11.0.0",
                "gradient-string": "^2.0.2",
                "ora": "^6.1.2",
                "prompts": "^2.4.2",
                "ts-node": "^10.9.1",
                "tsc-alias": "^1.7.1",
                "tsconfig-paths": "^4.1.0"
            },
            "files": [
                "outfile.cjs",
                "template",
                "theme"
            ],
            "homepage": "https://github.com/ErKeLost/vite-cli#readme",
            "keywords": [],
            "license": "ISC",
            "name": "create-vite-template",
            "publishConfig": {
                "access": "public",
                "registry": "https://registry.npmjs.org/"
            },
            "repository": "https://github.com/ErKeLost/vite-cli",
            "scripts": {
                "build": "farm build",
                "build:tsup": "tsup",
                "copy": "esno ./scripts/dev.mjs",
                "dev": "farm watch",
                "prepublishOnly": "npm run build",
                "test": 'echo "Error: no test specified" && exit 1'
            },
            "version": "0.23.22"
        };
    },
    "8a4eca8e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        const path = farmRequire("path");
        const copySync = farmRequire("48f7966c").copySync;
        const removeSync = farmRequire("317fdd9f").removeSync;
        const mkdirpSync = farmRequire("43482b8b").mkdirpSync;
        const stat = farmRequire("bfed495f");
        function moveSync(src, dest, opts) {
            opts = opts || {};
            const overwrite = opts.overwrite || opts.clobber || false;
            const { srcStat , isChangingCase =false  } = stat.checkPathsSync(src, dest, "move", opts);
            stat.checkParentPathsSync(src, srcStat, dest, "move");
            if (!isParentRoot(dest)) mkdirpSync(path.dirname(dest));
            return doRename(src, dest, overwrite, isChangingCase);
        }
        function isParentRoot(dest) {
            const parent = path.dirname(dest);
            const parsedPath = path.parse(parent);
            return parsedPath.root === parent;
        }
        function doRename(src, dest, overwrite, isChangingCase) {
            if (isChangingCase) return rename(src, dest, overwrite);
            if (overwrite) {
                removeSync(dest);
                return rename(src, dest, overwrite);
            }
            if (fs.existsSync(dest)) throw new Error("dest already exists.");
            return rename(src, dest, overwrite);
        }
        function rename(src, dest, overwrite) {
            try {
                fs.renameSync(src, dest);
            } catch (err) {
                if (err.code !== "EXDEV") throw err;
                return moveAcrossDevice(src, dest, overwrite);
            }
        }
        function moveAcrossDevice(src, dest, overwrite) {
            const opts = {
                overwrite,
                errorOnExist: true
            };
            copySync(src, dest, opts);
            return removeSync(src);
        }
        module.exports = moveSync;
    },
    "8b1ecd24": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "shouldUseYarn", {
            enumerable: true,
            get: function() {
                return shouldUseYarn;
            }
        });
        var _child_process = farmRequire("child_process");
        function shouldUseYarn() {
            try {
                const userAgent = process.env.npm_config_user_agent;
                if (userAgent && userAgent.startsWith("yarn")) {
                    return true;
                }
                (0, _child_process.execSync)("yarnpkg --version", {
                    stdio: "ignore"
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    "8b905262": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Hours extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setHours(this.date.getHours() + 1);
            }
            down() {
                this.date.setHours(this.date.getHours() - 1);
            }
            setTo(val) {
                this.date.setHours(parseInt(val.substr(-2)));
            }
            toString() {
                let hours = this.date.getHours();
                if (/h/.test(this.token)) hours = hours % 12 || 12;
                return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
            }
        }
        module.exports = Hours;
    },
    "8bd4f15a": function(module, exports, farmRequire, dynamicRequire) {
        var constants = farmRequire("constants");
        var origCwd = process.cwd;
        var cwd = null;
        var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
        process.cwd = function() {
            if (!cwd) cwd = origCwd.call(process);
            return cwd;
        };
        try {
            process.cwd();
        } catch (er) {}
        if (typeof process.chdir === "function") {
            var chdir = process.chdir;
            process.chdir = function(d) {
                cwd = null;
                chdir.call(process, d);
            };
            if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
        }
        module.exports = patch;
        function patch(fs) {
            if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
                patchLchmod(fs);
            }
            if (!fs.lutimes) {
                patchLutimes(fs);
            }
            fs.chown = chownFix(fs.chown);
            fs.fchown = chownFix(fs.fchown);
            fs.lchown = chownFix(fs.lchown);
            fs.chmod = chmodFix(fs.chmod);
            fs.fchmod = chmodFix(fs.fchmod);
            fs.lchmod = chmodFix(fs.lchmod);
            fs.chownSync = chownFixSync(fs.chownSync);
            fs.fchownSync = chownFixSync(fs.fchownSync);
            fs.lchownSync = chownFixSync(fs.lchownSync);
            fs.chmodSync = chmodFixSync(fs.chmodSync);
            fs.fchmodSync = chmodFixSync(fs.fchmodSync);
            fs.lchmodSync = chmodFixSync(fs.lchmodSync);
            fs.stat = statFix(fs.stat);
            fs.fstat = statFix(fs.fstat);
            fs.lstat = statFix(fs.lstat);
            fs.statSync = statFixSync(fs.statSync);
            fs.fstatSync = statFixSync(fs.fstatSync);
            fs.lstatSync = statFixSync(fs.lstatSync);
            if (fs.chmod && !fs.lchmod) {
                fs.lchmod = function(path, mode, cb) {
                    if (cb) process.nextTick(cb);
                };
                fs.lchmodSync = function() {};
            }
            if (fs.chown && !fs.lchown) {
                fs.lchown = function(path, uid, gid, cb) {
                    if (cb) process.nextTick(cb);
                };
                fs.lchownSync = function() {};
            }
            if (platform === "win32") {
                fs.rename = typeof fs.rename !== "function" ? fs.rename : function(fs$rename) {
                    function rename(from, to, cb) {
                        var start = Date.now();
                        var backoff = 0;
                        fs$rename(from, to, function CB(er) {
                            if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 60000) {
                                setTimeout(function() {
                                    fs.stat(to, function(stater, st) {
                                        if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
                                        else cb(er);
                                    });
                                }, backoff);
                                if (backoff < 100) backoff += 10;
                                return;
                            }
                            if (cb) cb(er);
                        });
                    }
                    if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
                    return rename;
                }(fs.rename);
            }
            fs.read = typeof fs.read !== "function" ? fs.read : function(fs$read) {
                function read(fd, buffer, offset, length, position, callback_) {
                    var callback;
                    if (callback_ && typeof callback_ === "function") {
                        var eagCounter = 0;
                        callback = function(er, _, __) {
                            if (er && er.code === "EAGAIN" && eagCounter < 10) {
                                eagCounter++;
                                return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                            }
                            callback_.apply(this, arguments);
                        };
                    }
                    return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                }
                if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
                return read;
            }(fs.read);
            fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : function(fs$readSync) {
                return function(fd, buffer, offset, length, position) {
                    var eagCounter = 0;
                    while(true){
                        try {
                            return fs$readSync.call(fs, fd, buffer, offset, length, position);
                        } catch (er) {
                            if (er.code === "EAGAIN" && eagCounter < 10) {
                                eagCounter++;
                                continue;
                            }
                            throw er;
                        }
                    }
                };
            }(fs.readSync);
            function patchLchmod(fs) {
                fs.lchmod = function(path, mode, callback) {
                    fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
                        if (err) {
                            if (callback) callback(err);
                            return;
                        }
                        fs.fchmod(fd, mode, function(err) {
                            fs.close(fd, function(err2) {
                                if (callback) callback(err || err2);
                            });
                        });
                    });
                };
                fs.lchmodSync = function(path, mode) {
                    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
                    var threw = true;
                    var ret;
                    try {
                        ret = fs.fchmodSync(fd, mode);
                        threw = false;
                    } finally{
                        if (threw) {
                            try {
                                fs.closeSync(fd);
                            } catch (er) {}
                        } else {
                            fs.closeSync(fd);
                        }
                    }
                    return ret;
                };
            }
            function patchLutimes(fs) {
                if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
                    fs.lutimes = function(path, at, mt, cb) {
                        fs.open(path, constants.O_SYMLINK, function(er, fd) {
                            if (er) {
                                if (cb) cb(er);
                                return;
                            }
                            fs.futimes(fd, at, mt, function(er) {
                                fs.close(fd, function(er2) {
                                    if (cb) cb(er || er2);
                                });
                            });
                        });
                    };
                    fs.lutimesSync = function(path, at, mt) {
                        var fd = fs.openSync(path, constants.O_SYMLINK);
                        var ret;
                        var threw = true;
                        try {
                            ret = fs.futimesSync(fd, at, mt);
                            threw = false;
                        } finally{
                            if (threw) {
                                try {
                                    fs.closeSync(fd);
                                } catch (er) {}
                            } else {
                                fs.closeSync(fd);
                            }
                        }
                        return ret;
                    };
                } else if (fs.futimes) {
                    fs.lutimes = function(_a, _b, _c, cb) {
                        if (cb) process.nextTick(cb);
                    };
                    fs.lutimesSync = function() {};
                }
            }
            function chmodFix(orig) {
                if (!orig) return orig;
                return function(target, mode, cb) {
                    return orig.call(fs, target, mode, function(er) {
                        if (chownErOk(er)) er = null;
                        if (cb) cb.apply(this, arguments);
                    });
                };
            }
            function chmodFixSync(orig) {
                if (!orig) return orig;
                return function(target, mode) {
                    try {
                        return orig.call(fs, target, mode);
                    } catch (er) {
                        if (!chownErOk(er)) throw er;
                    }
                };
            }
            function chownFix(orig) {
                if (!orig) return orig;
                return function(target, uid, gid, cb) {
                    return orig.call(fs, target, uid, gid, function(er) {
                        if (chownErOk(er)) er = null;
                        if (cb) cb.apply(this, arguments);
                    });
                };
            }
            function chownFixSync(orig) {
                if (!orig) return orig;
                return function(target, uid, gid) {
                    try {
                        return orig.call(fs, target, uid, gid);
                    } catch (er) {
                        if (!chownErOk(er)) throw er;
                    }
                };
            }
            function statFix(orig) {
                if (!orig) return orig;
                return function(target, options, cb) {
                    if (typeof options === "function") {
                        cb = options;
                        options = null;
                    }
                    function callback(er, stats) {
                        if (stats) {
                            if (stats.uid < 0) stats.uid += 0x100000000;
                            if (stats.gid < 0) stats.gid += 0x100000000;
                        }
                        if (cb) cb.apply(this, arguments);
                    }
                    return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
                };
            }
            function statFixSync(orig) {
                if (!orig) return orig;
                return function(target, options) {
                    var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
                    if (stats) {
                        if (stats.uid < 0) stats.uid += 0x100000000;
                        if (stats.gid < 0) stats.gid += 0x100000000;
                    }
                    return stats;
                };
            }
            function chownErOk(er) {
                if (!er) return true;
                if (er.code === "ENOSYS") return true;
                var nonroot = !process.getuid || process.getuid() !== 0;
                if (nonroot) {
                    if (er.code === "EINVAL" || er.code === "EPERM") return true;
                }
                return false;
            }
        }
    },
    "8d58b170": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            "aliceblue": [
                240,
                248,
                255
            ],
            "antiquewhite": [
                250,
                235,
                215
            ],
            "aqua": [
                0,
                255,
                255
            ],
            "aquamarine": [
                127,
                255,
                212
            ],
            "azure": [
                240,
                255,
                255
            ],
            "beige": [
                245,
                245,
                220
            ],
            "bisque": [
                255,
                228,
                196
            ],
            "black": [
                0,
                0,
                0
            ],
            "blanchedalmond": [
                255,
                235,
                205
            ],
            "blue": [
                0,
                0,
                255
            ],
            "blueviolet": [
                138,
                43,
                226
            ],
            "brown": [
                165,
                42,
                42
            ],
            "burlywood": [
                222,
                184,
                135
            ],
            "cadetblue": [
                95,
                158,
                160
            ],
            "chartreuse": [
                127,
                255,
                0
            ],
            "chocolate": [
                210,
                105,
                30
            ],
            "coral": [
                255,
                127,
                80
            ],
            "cornflowerblue": [
                100,
                149,
                237
            ],
            "cornsilk": [
                255,
                248,
                220
            ],
            "crimson": [
                220,
                20,
                60
            ],
            "cyan": [
                0,
                255,
                255
            ],
            "darkblue": [
                0,
                0,
                139
            ],
            "darkcyan": [
                0,
                139,
                139
            ],
            "darkgoldenrod": [
                184,
                134,
                11
            ],
            "darkgray": [
                169,
                169,
                169
            ],
            "darkgreen": [
                0,
                100,
                0
            ],
            "darkgrey": [
                169,
                169,
                169
            ],
            "darkkhaki": [
                189,
                183,
                107
            ],
            "darkmagenta": [
                139,
                0,
                139
            ],
            "darkolivegreen": [
                85,
                107,
                47
            ],
            "darkorange": [
                255,
                140,
                0
            ],
            "darkorchid": [
                153,
                50,
                204
            ],
            "darkred": [
                139,
                0,
                0
            ],
            "darksalmon": [
                233,
                150,
                122
            ],
            "darkseagreen": [
                143,
                188,
                143
            ],
            "darkslateblue": [
                72,
                61,
                139
            ],
            "darkslategray": [
                47,
                79,
                79
            ],
            "darkslategrey": [
                47,
                79,
                79
            ],
            "darkturquoise": [
                0,
                206,
                209
            ],
            "darkviolet": [
                148,
                0,
                211
            ],
            "deeppink": [
                255,
                20,
                147
            ],
            "deepskyblue": [
                0,
                191,
                255
            ],
            "dimgray": [
                105,
                105,
                105
            ],
            "dimgrey": [
                105,
                105,
                105
            ],
            "dodgerblue": [
                30,
                144,
                255
            ],
            "firebrick": [
                178,
                34,
                34
            ],
            "floralwhite": [
                255,
                250,
                240
            ],
            "forestgreen": [
                34,
                139,
                34
            ],
            "fuchsia": [
                255,
                0,
                255
            ],
            "gainsboro": [
                220,
                220,
                220
            ],
            "ghostwhite": [
                248,
                248,
                255
            ],
            "gold": [
                255,
                215,
                0
            ],
            "goldenrod": [
                218,
                165,
                32
            ],
            "gray": [
                128,
                128,
                128
            ],
            "green": [
                0,
                128,
                0
            ],
            "greenyellow": [
                173,
                255,
                47
            ],
            "grey": [
                128,
                128,
                128
            ],
            "honeydew": [
                240,
                255,
                240
            ],
            "hotpink": [
                255,
                105,
                180
            ],
            "indianred": [
                205,
                92,
                92
            ],
            "indigo": [
                75,
                0,
                130
            ],
            "ivory": [
                255,
                255,
                240
            ],
            "khaki": [
                240,
                230,
                140
            ],
            "lavender": [
                230,
                230,
                250
            ],
            "lavenderblush": [
                255,
                240,
                245
            ],
            "lawngreen": [
                124,
                252,
                0
            ],
            "lemonchiffon": [
                255,
                250,
                205
            ],
            "lightblue": [
                173,
                216,
                230
            ],
            "lightcoral": [
                240,
                128,
                128
            ],
            "lightcyan": [
                224,
                255,
                255
            ],
            "lightgoldenrodyellow": [
                250,
                250,
                210
            ],
            "lightgray": [
                211,
                211,
                211
            ],
            "lightgreen": [
                144,
                238,
                144
            ],
            "lightgrey": [
                211,
                211,
                211
            ],
            "lightpink": [
                255,
                182,
                193
            ],
            "lightsalmon": [
                255,
                160,
                122
            ],
            "lightseagreen": [
                32,
                178,
                170
            ],
            "lightskyblue": [
                135,
                206,
                250
            ],
            "lightslategray": [
                119,
                136,
                153
            ],
            "lightslategrey": [
                119,
                136,
                153
            ],
            "lightsteelblue": [
                176,
                196,
                222
            ],
            "lightyellow": [
                255,
                255,
                224
            ],
            "lime": [
                0,
                255,
                0
            ],
            "limegreen": [
                50,
                205,
                50
            ],
            "linen": [
                250,
                240,
                230
            ],
            "magenta": [
                255,
                0,
                255
            ],
            "maroon": [
                128,
                0,
                0
            ],
            "mediumaquamarine": [
                102,
                205,
                170
            ],
            "mediumblue": [
                0,
                0,
                205
            ],
            "mediumorchid": [
                186,
                85,
                211
            ],
            "mediumpurple": [
                147,
                112,
                219
            ],
            "mediumseagreen": [
                60,
                179,
                113
            ],
            "mediumslateblue": [
                123,
                104,
                238
            ],
            "mediumspringgreen": [
                0,
                250,
                154
            ],
            "mediumturquoise": [
                72,
                209,
                204
            ],
            "mediumvioletred": [
                199,
                21,
                133
            ],
            "midnightblue": [
                25,
                25,
                112
            ],
            "mintcream": [
                245,
                255,
                250
            ],
            "mistyrose": [
                255,
                228,
                225
            ],
            "moccasin": [
                255,
                228,
                181
            ],
            "navajowhite": [
                255,
                222,
                173
            ],
            "navy": [
                0,
                0,
                128
            ],
            "oldlace": [
                253,
                245,
                230
            ],
            "olive": [
                128,
                128,
                0
            ],
            "olivedrab": [
                107,
                142,
                35
            ],
            "orange": [
                255,
                165,
                0
            ],
            "orangered": [
                255,
                69,
                0
            ],
            "orchid": [
                218,
                112,
                214
            ],
            "palegoldenrod": [
                238,
                232,
                170
            ],
            "palegreen": [
                152,
                251,
                152
            ],
            "paleturquoise": [
                175,
                238,
                238
            ],
            "palevioletred": [
                219,
                112,
                147
            ],
            "papayawhip": [
                255,
                239,
                213
            ],
            "peachpuff": [
                255,
                218,
                185
            ],
            "peru": [
                205,
                133,
                63
            ],
            "pink": [
                255,
                192,
                203
            ],
            "plum": [
                221,
                160,
                221
            ],
            "powderblue": [
                176,
                224,
                230
            ],
            "purple": [
                128,
                0,
                128
            ],
            "rebeccapurple": [
                102,
                51,
                153
            ],
            "red": [
                255,
                0,
                0
            ],
            "rosybrown": [
                188,
                143,
                143
            ],
            "royalblue": [
                65,
                105,
                225
            ],
            "saddlebrown": [
                139,
                69,
                19
            ],
            "salmon": [
                250,
                128,
                114
            ],
            "sandybrown": [
                244,
                164,
                96
            ],
            "seagreen": [
                46,
                139,
                87
            ],
            "seashell": [
                255,
                245,
                238
            ],
            "sienna": [
                160,
                82,
                45
            ],
            "silver": [
                192,
                192,
                192
            ],
            "skyblue": [
                135,
                206,
                235
            ],
            "slateblue": [
                106,
                90,
                205
            ],
            "slategray": [
                112,
                128,
                144
            ],
            "slategrey": [
                112,
                128,
                144
            ],
            "snow": [
                255,
                250,
                250
            ],
            "springgreen": [
                0,
                255,
                127
            ],
            "steelblue": [
                70,
                130,
                180
            ],
            "tan": [
                210,
                180,
                140
            ],
            "teal": [
                0,
                128,
                128
            ],
            "thistle": [
                216,
                191,
                216
            ],
            "tomato": [
                255,
                99,
                71
            ],
            "turquoise": [
                64,
                224,
                208
            ],
            "violet": [
                238,
                130,
                238
            ],
            "wheat": [
                245,
                222,
                179
            ],
            "white": [
                255,
                255,
                255
            ],
            "whitesmoke": [
                245,
                245,
                245
            ],
            "yellow": [
                255,
                255,
                0
            ],
            "yellowgreen": [
                154,
                205,
                50
            ]
        };
    },
    "8dfecbc9": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { erase , cursor  } = farmRequire("84d4236d");
        const { style , clear , figures , wrap , entriesToDisplay  } = farmRequire("b8d8683f");
        const getVal = (arr, i)=>arr[i] && (arr[i].value || arr[i].title || arr[i]);
        const getTitle = (arr, i)=>arr[i] && (arr[i].title || arr[i].value || arr[i]);
        const getIndex = (arr, valOrTitle)=>{
            const index = arr.findIndex((el)=>el.value === valOrTitle || el.title === valOrTitle);
            return index > -1 ? index : undefined;
        };
        class AutocompletePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.suggest = opts.suggest;
                this.choices = opts.choices;
                this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
                this.select = this.initial || opts.cursor || 0;
                this.i18n = {
                    noMatches: opts.noMatches || "no matches found"
                };
                this.fallback = opts.fallback || this.initial;
                this.clearFirst = opts.clearFirst || false;
                this.suggestions = [];
                this.input = "";
                this.limit = opts.limit || 10;
                this.cursor = 0;
                this.transform = style.render(opts.style);
                this.scale = this.transform.scale;
                this.render = this.render.bind(this);
                this.complete = this.complete.bind(this);
                this.clear = clear("", this.out.columns);
                this.complete(this.render);
                this.render();
            }
            set fallback(fb) {
                this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
            }
            get fallback() {
                let choice;
                if (typeof this._fb === "number") choice = this.choices[this._fb];
                else if (typeof this._fb === "string") choice = {
                    title: this._fb
                };
                return choice || this._fb || {
                    title: this.i18n.noMatches
                };
            }
            moveSelect(i) {
                this.select = i;
                if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
                else this.value = this.fallback.value;
                this.fire();
            }
            async complete(cb) {
                const p = this.completing = this.suggest(this.input, this.choices);
                const suggestions = await p;
                if (this.completing !== p) return;
                this.suggestions = suggestions.map((s, i, arr)=>({
                        title: getTitle(arr, i),
                        value: getVal(arr, i),
                        description: s.description
                    }));
                this.completing = false;
                const l = Math.max(suggestions.length - 1, 0);
                this.moveSelect(Math.min(l, this.select));
                cb && cb();
            }
            reset() {
                this.input = "";
                this.complete(()=>{
                    this.moveSelect(this.initial !== void 0 ? this.initial : 0);
                    this.render();
                });
                this.render();
            }
            exit() {
                if (this.clearFirst && this.input.length > 0) {
                    this.reset();
                } else {
                    this.done = this.exited = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                }
            }
            abort() {
                this.done = this.aborted = true;
                this.exited = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.done = true;
                this.aborted = this.exited = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            _(c, key) {
                let s1 = this.input.slice(0, this.cursor);
                let s2 = this.input.slice(this.cursor);
                this.input = `${s1}${c}${s2}`;
                this.cursor = s1.length + 1;
                this.complete(this.render);
                this.render();
            }
            delete() {
                if (this.cursor === 0) return this.bell();
                let s1 = this.input.slice(0, this.cursor - 1);
                let s2 = this.input.slice(this.cursor);
                this.input = `${s1}${s2}`;
                this.complete(this.render);
                this.cursor = this.cursor - 1;
                this.render();
            }
            deleteForward() {
                if (this.cursor * this.scale >= this.rendered.length) return this.bell();
                let s1 = this.input.slice(0, this.cursor);
                let s2 = this.input.slice(this.cursor + 1);
                this.input = `${s1}${s2}`;
                this.complete(this.render);
                this.render();
            }
            first() {
                this.moveSelect(0);
                this.render();
            }
            last() {
                this.moveSelect(this.suggestions.length - 1);
                this.render();
            }
            up() {
                if (this.select === 0) {
                    this.moveSelect(this.suggestions.length - 1);
                } else {
                    this.moveSelect(this.select - 1);
                }
                this.render();
            }
            down() {
                if (this.select === this.suggestions.length - 1) {
                    this.moveSelect(0);
                } else {
                    this.moveSelect(this.select + 1);
                }
                this.render();
            }
            next() {
                if (this.select === this.suggestions.length - 1) {
                    this.moveSelect(0);
                } else this.moveSelect(this.select + 1);
                this.render();
            }
            nextPage() {
                this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
                this.render();
            }
            prevPage() {
                this.moveSelect(Math.max(this.select - this.limit, 0));
                this.render();
            }
            left() {
                if (this.cursor <= 0) return this.bell();
                this.cursor = this.cursor - 1;
                this.render();
            }
            right() {
                if (this.cursor * this.scale >= this.rendered.length) return this.bell();
                this.cursor = this.cursor + 1;
                this.render();
            }
            renderOption(v, hovered, isStart, isEnd) {
                let desc;
                let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
                let title = hovered ? color.cyan().underline(v.title) : v.title;
                prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
                if (v.description) {
                    desc = ` - ${v.description}`;
                    if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                        desc = "\n" + wrap(v.description, {
                            margin: 3,
                            width: this.out.columns
                        });
                    }
                }
                return prefix + " " + title + color.gray(desc || "");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                let { startIndex , endIndex  } = entriesToDisplay(this.select, this.choices.length, this.limit);
                this.outputText = [
                    style.symbol(this.done, this.aborted, this.exited),
                    color.bold(this.msg),
                    style.delimiter(this.completing),
                    this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
                ].join(" ");
                if (!this.done) {
                    const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i)=>this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
                    this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = AutocompletePrompt;
    },
    "902f0d3a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (str)=>{
            const pattern = [
                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
            ].join("|");
            const RGX = new RegExp(pattern, "g");
            return typeof str === "string" ? str.replace(RGX, "") : str;
        };
    },
    "91016b82": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _fsextra = _interop_require_default._(farmRequire("0fb9151f"));
        var _nodepath = _interop_require_default._(farmRequire("node:path"));
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _ejsRender = farmRequire("f652b8cf");
        var _gradient = farmRequire("1b8cfe77");
        var _templateFile = farmRequire("e727888a");
        var _frameQuestions = farmRequire("3caad4cd");
        async function copyTemplate() {
            const spinner = await (0, _gradient.loadWithRocketGradient)("copy template");
            _options.default.src = _nodepath.default.resolve(__dirname, `../template/${_options.default.frame}`);
            const dest = _nodepath.default.resolve(process.cwd(), _options.default.name);
            _options.default.dest = dest;
            const templatePath = _nodepath.default.resolve(__dirname, `../../../../../template/${_options.default.frame}`);
            _options.default.templatePath = templatePath;
            const filterFileFn = (0, _frameQuestions.getFilterFile)();
            async function copy() {
                await _fsextra.default.copy(`${__dirname}/template/${_options.default.frame}`, dest, {});
            }
            await copy();
            await filterFileFn();
            await _fsextra.default.move(_nodepath.default.resolve(_options.default.dest, ".gitignore.ejs"), _nodepath.default.resolve(_options.default.dest, ".gitignore"), {
                overwrite: true
            });
            await Promise.all(_templateFile.templateFilesMap.get(_options.default.frame)().map((file)=>(0, _ejsRender.ejsRender)(file, _options.default.name)));
            if (_options.default.useTheme) {
                await _fsextra.default.copy(`${__dirname}/theme/${_options.default.components}`, `${dest}/src`, {
                    overwrite: true
                });
            }
            spinner.text = "Template copied!";
            spinner.succeed();
        }
        var _default = copyTemplate;
    },
    "9197e1e5": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("232af10c"), style = _require.style, clear = _require.clear;
        const _require2 = farmRequire("84d4236d"), cursor = _require2.cursor, erase = _require2.erase;
        class TogglePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.value = !!opts.initial;
                this.active = opts.active || "on";
                this.inactive = opts.inactive || "off";
                this.initialValue = this.value;
                this.render();
            }
            reset() {
                this.value = this.initialValue;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            deactivate() {
                if (this.value === false) return this.bell();
                this.value = false;
                this.render();
            }
            activate() {
                if (this.value === true) return this.bell();
                this.value = true;
                this.render();
            }
            delete() {
                this.deactivate();
            }
            left() {
                this.deactivate();
            }
            right() {
                this.activate();
            }
            down() {
                this.deactivate();
            }
            up() {
                this.activate();
            }
            next() {
                this.value = !this.value;
                this.fire();
                this.render();
            }
            _(c, key) {
                if (c === " ") {
                    this.value = !this.value;
                } else if (c === "1") {
                    this.value = true;
                } else if (c === "0") {
                    this.value = false;
                } else return this.bell();
                this.render();
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.value ? this.inactive : color.cyan().underline(this.inactive),
                    color.gray("/"),
                    this.value ? color.cyan().underline(this.active) : this.active
                ].join(" ");
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = TogglePrompt;
    },
    "92a8bd99": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return createCommand;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _program = _interop_require_default._(farmRequire("d0f57640"));
        var _creator = _interop_require_default._(farmRequire("350e93ff"));
        var _initialLog = _interop_require_default._(farmRequire("08984a6e"));
        var _install = _interop_require_default._(farmRequire("73c43919"));
        var _copyTemplate = _interop_require_default._(farmRequire("91016b82"));
        async function createProject() {
            await (0, _initialLog.default)();
            await (0, _creator.default)();
            await (0, _copyTemplate.default)();
            await (0, _install.default)();
        }
        async function createCommand() {
            _program.default.description("init Vue3 + Vite3 + Typescript project   \uD83D\uDCD1  \uD83D\uDCD1").action(async ()=>{
                createProject();
            });
        }
    },
    "92bec1df": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const wrapAnsi16 = (fn, offset)=>(...args)=>{
                const code = fn(...args);
                return `\u001B[${code + offset}m`;
            };
        const wrapAnsi256 = (fn, offset)=>(...args)=>{
                const code = fn(...args);
                return `\u001B[${38 + offset};5;${code}m`;
            };
        const wrapAnsi16m = (fn, offset)=>(...args)=>{
                const rgb = fn(...args);
                return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
            };
        const ansi2ansi = (n)=>n;
        const rgb2rgb = (r, g, b)=>[
                r,
                g,
                b
            ];
        const setLazyProperty = (object, property, get)=>{
            Object.defineProperty(object, property, {
                get: ()=>{
                    const value = get();
                    Object.defineProperty(object, property, {
                        value,
                        enumerable: true,
                        configurable: true
                    });
                    return value;
                },
                enumerable: true,
                configurable: true
            });
        };
        let colorConvert;
        const makeDynamicStyles = (wrap, targetSpace, identity, isBackground)=>{
            if (colorConvert === undefined) {
                colorConvert = farmRequire("6795e939");
            }
            const offset = isBackground ? 10 : 0;
            const styles = {};
            for (const [sourceSpace, suite] of Object.entries(colorConvert)){
                const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
                if (sourceSpace === targetSpace) {
                    styles[name] = wrap(identity, offset);
                } else if (typeof suite === "object") {
                    styles[name] = wrap(suite[targetSpace], offset);
                }
            }
            return styles;
        };
        function assembleStyles() {
            const codes = new Map();
            const styles = {
                modifier: {
                    reset: [
                        0,
                        0
                    ],
                    bold: [
                        1,
                        22
                    ],
                    dim: [
                        2,
                        22
                    ],
                    italic: [
                        3,
                        23
                    ],
                    underline: [
                        4,
                        24
                    ],
                    inverse: [
                        7,
                        27
                    ],
                    hidden: [
                        8,
                        28
                    ],
                    strikethrough: [
                        9,
                        29
                    ]
                },
                color: {
                    black: [
                        30,
                        39
                    ],
                    red: [
                        31,
                        39
                    ],
                    green: [
                        32,
                        39
                    ],
                    yellow: [
                        33,
                        39
                    ],
                    blue: [
                        34,
                        39
                    ],
                    magenta: [
                        35,
                        39
                    ],
                    cyan: [
                        36,
                        39
                    ],
                    white: [
                        37,
                        39
                    ],
                    blackBright: [
                        90,
                        39
                    ],
                    redBright: [
                        91,
                        39
                    ],
                    greenBright: [
                        92,
                        39
                    ],
                    yellowBright: [
                        93,
                        39
                    ],
                    blueBright: [
                        94,
                        39
                    ],
                    magentaBright: [
                        95,
                        39
                    ],
                    cyanBright: [
                        96,
                        39
                    ],
                    whiteBright: [
                        97,
                        39
                    ]
                },
                bgColor: {
                    bgBlack: [
                        40,
                        49
                    ],
                    bgRed: [
                        41,
                        49
                    ],
                    bgGreen: [
                        42,
                        49
                    ],
                    bgYellow: [
                        43,
                        49
                    ],
                    bgBlue: [
                        44,
                        49
                    ],
                    bgMagenta: [
                        45,
                        49
                    ],
                    bgCyan: [
                        46,
                        49
                    ],
                    bgWhite: [
                        47,
                        49
                    ],
                    bgBlackBright: [
                        100,
                        49
                    ],
                    bgRedBright: [
                        101,
                        49
                    ],
                    bgGreenBright: [
                        102,
                        49
                    ],
                    bgYellowBright: [
                        103,
                        49
                    ],
                    bgBlueBright: [
                        104,
                        49
                    ],
                    bgMagentaBright: [
                        105,
                        49
                    ],
                    bgCyanBright: [
                        106,
                        49
                    ],
                    bgWhiteBright: [
                        107,
                        49
                    ]
                }
            };
            styles.color.gray = styles.color.blackBright;
            styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
            styles.color.grey = styles.color.blackBright;
            styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
            for (const [groupName, group] of Object.entries(styles)){
                for (const [styleName, style] of Object.entries(group)){
                    styles[styleName] = {
                        open: `\u001B[${style[0]}m`,
                        close: `\u001B[${style[1]}m`
                    };
                    group[styleName] = styles[styleName];
                    codes.set(style[0], style[1]);
                }
                Object.defineProperty(styles, groupName, {
                    value: group,
                    enumerable: false
                });
            }
            Object.defineProperty(styles, "codes", {
                value: codes,
                enumerable: false
            });
            styles.color.close = "\x1b[39m";
            styles.bgColor.close = "\x1b[49m";
            setLazyProperty(styles.color, "ansi", ()=>makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
            setLazyProperty(styles.color, "ansi256", ()=>makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
            setLazyProperty(styles.color, "ansi16m", ()=>makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
            setLazyProperty(styles.bgColor, "ansi", ()=>makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
            setLazyProperty(styles.bgColor, "ansi256", ()=>makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
            setLazyProperty(styles.bgColor, "ansi16m", ()=>makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
            return styles;
        }
        Object.defineProperty(module, "exports", {
            enumerable: true,
            get: assembleStyles
        });
    },
    "94ca7918": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        const ANSI_BACKGROUND_OFFSET = 10;
        const wrapAnsi16 = (offset = 0)=>(code)=>`\u001B[${code + offset}m`;
        const wrapAnsi256 = (offset = 0)=>(code)=>`\u001B[${38 + offset};5;${code}m`;
        const wrapAnsi16m = (offset = 0)=>(red, green, blue)=>`\u001B[${38 + offset};2;${red};${green};${blue}m`;
        const styles = {
            modifier: {
                reset: [
                    0,
                    0
                ],
                bold: [
                    1,
                    22
                ],
                dim: [
                    2,
                    22
                ],
                italic: [
                    3,
                    23
                ],
                underline: [
                    4,
                    24
                ],
                overline: [
                    53,
                    55
                ],
                inverse: [
                    7,
                    27
                ],
                hidden: [
                    8,
                    28
                ],
                strikethrough: [
                    9,
                    29
                ]
            },
            color: {
                black: [
                    30,
                    39
                ],
                red: [
                    31,
                    39
                ],
                green: [
                    32,
                    39
                ],
                yellow: [
                    33,
                    39
                ],
                blue: [
                    34,
                    39
                ],
                magenta: [
                    35,
                    39
                ],
                cyan: [
                    36,
                    39
                ],
                white: [
                    37,
                    39
                ],
                blackBright: [
                    90,
                    39
                ],
                gray: [
                    90,
                    39
                ],
                grey: [
                    90,
                    39
                ],
                redBright: [
                    91,
                    39
                ],
                greenBright: [
                    92,
                    39
                ],
                yellowBright: [
                    93,
                    39
                ],
                blueBright: [
                    94,
                    39
                ],
                magentaBright: [
                    95,
                    39
                ],
                cyanBright: [
                    96,
                    39
                ],
                whiteBright: [
                    97,
                    39
                ]
            },
            bgColor: {
                bgBlack: [
                    40,
                    49
                ],
                bgRed: [
                    41,
                    49
                ],
                bgGreen: [
                    42,
                    49
                ],
                bgYellow: [
                    43,
                    49
                ],
                bgBlue: [
                    44,
                    49
                ],
                bgMagenta: [
                    45,
                    49
                ],
                bgCyan: [
                    46,
                    49
                ],
                bgWhite: [
                    47,
                    49
                ],
                bgBlackBright: [
                    100,
                    49
                ],
                bgGray: [
                    100,
                    49
                ],
                bgGrey: [
                    100,
                    49
                ],
                bgRedBright: [
                    101,
                    49
                ],
                bgGreenBright: [
                    102,
                    49
                ],
                bgYellowBright: [
                    103,
                    49
                ],
                bgBlueBright: [
                    104,
                    49
                ],
                bgMagentaBright: [
                    105,
                    49
                ],
                bgCyanBright: [
                    106,
                    49
                ],
                bgWhiteBright: [
                    107,
                    49
                ]
            }
        };
        function assembleStyles() {
            const codes = new Map();
            for (const [groupName, group] of Object.entries(styles)){
                for (const [styleName, style] of Object.entries(group)){
                    styles[styleName] = {
                        open: `\u001B[${style[0]}m`,
                        close: `\u001B[${style[1]}m`
                    };
                    group[styleName] = styles[styleName];
                    codes.set(style[0], style[1]);
                }
                Object.defineProperty(styles, groupName, {
                    value: group,
                    enumerable: false
                });
            }
            Object.defineProperty(styles, "codes", {
                value: codes,
                enumerable: false
            });
            styles.color.close = "\x1b[39m";
            styles.bgColor.close = "\x1b[49m";
            styles.color.ansi = wrapAnsi16();
            styles.color.ansi256 = wrapAnsi256();
            styles.color.ansi16m = wrapAnsi16m();
            styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
            styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
            styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
            Object.defineProperties(styles, {
                rgbToAnsi256: {
                    value (red, green, blue) {
                        if (red === green && green === blue) {
                            if (red < 8) {
                                return 16;
                            }
                            if (red > 248) {
                                return 231;
                            }
                            return Math.round((red - 8) / 247 * 24) + 232;
                        }
                        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
                    },
                    enumerable: false
                },
                hexToRgb: {
                    value (hex) {
                        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
                        if (!matches) {
                            return [
                                0,
                                0,
                                0
                            ];
                        }
                        let [colorString] = matches;
                        if (colorString.length === 3) {
                            colorString = [
                                ...colorString
                            ].map((character)=>character + character).join("");
                        }
                        const integer = Number.parseInt(colorString, 16);
                        return [
                            integer >> 16 & 0xFF,
                            integer >> 8 & 0xFF,
                            integer & 0xFF
                        ];
                    },
                    enumerable: false
                },
                hexToAnsi256: {
                    value: (hex)=>styles.rgbToAnsi256(...styles.hexToRgb(hex)),
                    enumerable: false
                },
                ansi256ToAnsi: {
                    value (code) {
                        if (code < 8) {
                            return 30 + code;
                        }
                        if (code < 16) {
                            return 90 + (code - 8);
                        }
                        let red;
                        let green;
                        let blue;
                        if (code >= 232) {
                            red = ((code - 232) * 10 + 8) / 255;
                            green = red;
                            blue = red;
                        } else {
                            code -= 16;
                            const remainder = code % 36;
                            red = Math.floor(code / 36) / 5;
                            green = Math.floor(remainder / 6) / 5;
                            blue = remainder % 6 / 5;
                        }
                        const value = Math.max(red, green, blue) * 2;
                        if (value === 0) {
                            return 30;
                        }
                        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
                        if (value === 2) {
                            result += 60;
                        }
                        return result;
                    },
                    enumerable: false
                },
                rgbToAnsi: {
                    value: (red, green, blue)=>styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
                    enumerable: false
                },
                hexToAnsi: {
                    value: (hex)=>styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
                    enumerable: false
                }
            });
            return styles;
        }
        const ansiStyles = assembleStyles();
        var _default = ansiStyles;
    },
    "953dfae2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _program = _interop_require_default._(farmRequire("d0f57640"));
        var _command = _interop_require_default._(farmRequire("d0dff145"));
        async function createViteCliCommand() {
            await (0, _command.default)();
            _program.default.parse(process.argv);
        }
        createViteCliCommand();
    },
    "970f5996": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromPromise;
        const jsonFile = farmRequire("5e0a98f2");
        jsonFile.outputJson = u(farmRequire("84016105"));
        jsonFile.outputJsonSync = farmRequire("fe0770d6");
        jsonFile.outputJSON = jsonFile.outputJson;
        jsonFile.outputJSONSync = jsonFile.outputJsonSync;
        jsonFile.writeJSON = jsonFile.writeJson;
        jsonFile.writeJSONSync = jsonFile.writeJsonSync;
        jsonFile.readJSON = jsonFile.readJson;
        jsonFile.readJSONSync = jsonFile.readJsonSync;
        module.exports = jsonFile;
    },
    "978a3f3b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _default = {
            name: "precss",
            type: "select",
            message: "Select CSS preprocessor",
            choices: [
                {
                    title: "Sass/Scss",
                    value: "scss"
                },
                {
                    title: "Less",
                    value: "less"
                },
                {
                    title: "不使用",
                    value: ""
                }
            ]
        };
    },
    "98762936": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const ansiStyles = farmRequire("92bec1df");
        const { stdout: stdoutColor , stderr: stderrColor  } = farmRequire("891c55ab");
        const { stringReplaceAll , stringEncaseCRLFWithFirstIndex  } = farmRequire("80b2142c");
        const { isArray  } = Array;
        const levelMapping = [
            "ansi",
            "ansi",
            "ansi256",
            "ansi16m"
        ];
        const styles = Object.create(null);
        const applyOptions = (object, options = {})=>{
            if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
                throw new Error("The `level` option should be an integer from 0 to 3");
            }
            const colorLevel = stdoutColor ? stdoutColor.level : 0;
            object.level = options.level === undefined ? colorLevel : options.level;
        };
        class ChalkClass {
            constructor(options){
                return chalkFactory(options);
            }
        }
        const chalkFactory = (options)=>{
            const chalk = {};
            applyOptions(chalk, options);
            chalk.template = (...arguments_)=>chalkTag(chalk.template, ...arguments_);
            Object.setPrototypeOf(chalk, Chalk.prototype);
            Object.setPrototypeOf(chalk.template, chalk);
            chalk.template.constructor = ()=>{
                throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
            };
            chalk.template.Instance = ChalkClass;
            return chalk.template;
        };
        function Chalk(options) {
            return chalkFactory(options);
        }
        for (const [styleName, style] of Object.entries(ansiStyles)){
            styles[styleName] = {
                get () {
                    const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
                    Object.defineProperty(this, styleName, {
                        value: builder
                    });
                    return builder;
                }
            };
        }
        styles.visible = {
            get () {
                const builder = createBuilder(this, this._styler, true);
                Object.defineProperty(this, "visible", {
                    value: builder
                });
                return builder;
            }
        };
        const usedModels = [
            "rgb",
            "hex",
            "keyword",
            "hsl",
            "hsv",
            "hwb",
            "ansi",
            "ansi256"
        ];
        for (const model of usedModels){
            styles[model] = {
                get () {
                    const { level  } = this;
                    return function(...arguments_) {
                        const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
                        return createBuilder(this, styler, this._isEmpty);
                    };
                }
            };
        }
        for (const model of usedModels){
            const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
            styles[bgModel] = {
                get () {
                    const { level  } = this;
                    return function(...arguments_) {
                        const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
                        return createBuilder(this, styler, this._isEmpty);
                    };
                }
            };
        }
        const proto = Object.defineProperties(()=>{}, {
            ...styles,
            level: {
                enumerable: true,
                get () {
                    return this._generator.level;
                },
                set (level) {
                    this._generator.level = level;
                }
            }
        });
        const createStyler = (open, close, parent)=>{
            let openAll;
            let closeAll;
            if (parent === undefined) {
                openAll = open;
                closeAll = close;
            } else {
                openAll = parent.openAll + open;
                closeAll = close + parent.closeAll;
            }
            return {
                open,
                close,
                openAll,
                closeAll,
                parent
            };
        };
        const createBuilder = (self, _styler, _isEmpty)=>{
            const builder = (...arguments_)=>{
                if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
                    return applyStyle(builder, chalkTag(builder, ...arguments_));
                }
                return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
            };
            Object.setPrototypeOf(builder, proto);
            builder._generator = self;
            builder._styler = _styler;
            builder._isEmpty = _isEmpty;
            return builder;
        };
        const applyStyle = (self, string)=>{
            if (self.level <= 0 || !string) {
                return self._isEmpty ? "" : string;
            }
            let styler = self._styler;
            if (styler === undefined) {
                return string;
            }
            const { openAll , closeAll  } = styler;
            if (string.indexOf("\x1b") !== -1) {
                while(styler !== undefined){
                    string = stringReplaceAll(string, styler.close, styler.open);
                    styler = styler.parent;
                }
            }
            const lfIndex = string.indexOf("\n");
            if (lfIndex !== -1) {
                string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
            }
            return openAll + string + closeAll;
        };
        let template;
        const chalkTag = (chalk, ...strings)=>{
            const [firstString] = strings;
            if (!isArray(firstString) || !isArray(firstString.raw)) {
                return strings.join(" ");
            }
            const arguments_ = strings.slice(1);
            const parts = [
                firstString.raw[0]
            ];
            for(let i = 1; i < firstString.length; i++){
                parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"), String(firstString.raw[i]));
            }
            if (template === undefined) {
                template = farmRequire("cb0a7a43");
            }
            return template(chalk, parts.join(""));
        };
        Object.defineProperties(Chalk.prototype, styles);
        const chalk = Chalk();
        chalk.supportsColor = stdoutColor;
        chalk.stderr = Chalk({
            level: stderrColor ? stderrColor.level : 0
        });
        chalk.stderr.supportsColor = stderrColor;
        module.exports = chalk;
    },
    "9c14e008": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var regExpChars = /[|\\{}()[\]^$+*?.]/g;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var hasOwn = function(obj, key) {
            return hasOwnProperty.apply(obj, [
                key
            ]);
        };
        exports.escapeRegExpChars = function(string) {
            if (!string) {
                return "";
            }
            return String(string).replace(regExpChars, "\\$&");
        };
        var _ENCODE_HTML_RULES = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&#34;",
            "'": "&#39;"
        };
        var _MATCH_HTML = /[&<>'"]/g;
        function encode_char(c) {
            return _ENCODE_HTML_RULES[c] || c;
        }
        var escapeFuncStr = "var _ENCODE_HTML_RULES = {\n" + '      "&": "&amp;"\n' + '    , "<": "&lt;"\n' + '    , ">": "&gt;"\n' + '    , \'"\': "&#34;"\n' + '    , "\'": "&#39;"\n' + "    }\n" + "  , _MATCH_HTML = /[&<>'\"]/g;\n" + "function encode_char(c) {\n" + "  return _ENCODE_HTML_RULES[c] || c;\n" + "};\n";
        exports.escapeXML = function(markup) {
            return markup == undefined ? "" : String(markup).replace(_MATCH_HTML, encode_char);
        };
        exports.escapeXML.toString = function() {
            return Function.prototype.toString.call(this) + ";\n" + escapeFuncStr;
        };
        exports.shallowCopy = function(to, from) {
            from = from || {};
            if (to !== null && to !== undefined) {
                for(var p in from){
                    if (!hasOwn(from, p)) {
                        continue;
                    }
                    if (p === "__proto__" || p === "constructor") {
                        continue;
                    }
                    to[p] = from[p];
                }
            }
            return to;
        };
        exports.shallowCopyFromList = function(to, from, list) {
            list = list || [];
            from = from || {};
            if (to !== null && to !== undefined) {
                for(var i = 0; i < list.length; i++){
                    var p = list[i];
                    if (typeof from[p] != "undefined") {
                        if (!hasOwn(from, p)) {
                            continue;
                        }
                        if (p === "__proto__" || p === "constructor") {
                            continue;
                        }
                        to[p] = from[p];
                    }
                }
            }
            return to;
        };
        exports.cache = {
            _data: {},
            set: function(key, val) {
                this._data[key] = val;
            },
            get: function(key) {
                return this._data[key];
            },
            remove: function(key) {
                delete this._data[key];
            },
            reset: function() {
                this._data = {};
            }
        };
        exports.hyphenToCamel = function(str) {
            return str.replace(/-[a-z]/g, function(match) {
                return match[1].toUpperCase();
            });
        };
        exports.createNullProtoObjWherePossible = function() {
            if (typeof Object.create == "function") {
                return function() {
                    return Object.create(null);
                };
            }
            if (!(({
                __proto__: null
            }) instanceof Object)) {
                return function() {
                    return {
                        __proto__: null
                    };
                };
            }
            return function() {
                return {};
            };
        }();
    },
    "9cfad54b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        const path = farmRequire("path");
        const mkdirsSync = farmRequire("43482b8b").mkdirsSync;
        const utimesMillisSync = farmRequire("de2f2620").utimesMillisSync;
        const stat = farmRequire("bfed495f");
        function copySync(src, dest, opts) {
            if (typeof opts === "function") {
                opts = {
                    filter: opts
                };
            }
            opts = opts || {};
            opts.clobber = "clobber" in opts ? !!opts.clobber : true;
            opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
            if (opts.preserveTimestamps && process.arch === "ia32") {
                process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n" + "	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
            }
            const { srcStat , destStat  } = stat.checkPathsSync(src, dest, "copy", opts);
            stat.checkParentPathsSync(src, srcStat, dest, "copy");
            if (opts.filter && !opts.filter(src, dest)) return;
            const destParent = path.dirname(dest);
            if (!fs.existsSync(destParent)) mkdirsSync(destParent);
            return getStats(destStat, src, dest, opts);
        }
        function getStats(destStat, src, dest, opts) {
            const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
            const srcStat = statSync(src);
            if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
            else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
            else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
            else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
            else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
            throw new Error(`Unknown file: ${src}`);
        }
        function onFile(srcStat, destStat, src, dest, opts) {
            if (!destStat) return copyFile(srcStat, src, dest, opts);
            return mayCopyFile(srcStat, src, dest, opts);
        }
        function mayCopyFile(srcStat, src, dest, opts) {
            if (opts.overwrite) {
                fs.unlinkSync(dest);
                return copyFile(srcStat, src, dest, opts);
            } else if (opts.errorOnExist) {
                throw new Error(`'${dest}' already exists`);
            }
        }
        function copyFile(srcStat, src, dest, opts) {
            fs.copyFileSync(src, dest);
            if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
            return setDestMode(dest, srcStat.mode);
        }
        function handleTimestamps(srcMode, src, dest) {
            if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
            return setDestTimestamps(src, dest);
        }
        function fileIsNotWritable(srcMode) {
            return (srcMode & 128) === 0;
        }
        function makeFileWritable(dest, srcMode) {
            return setDestMode(dest, srcMode | 128);
        }
        function setDestMode(dest, srcMode) {
            return fs.chmodSync(dest, srcMode);
        }
        function setDestTimestamps(src, dest) {
            const updatedSrcStat = fs.statSync(src);
            return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
        }
        function onDir(srcStat, destStat, src, dest, opts) {
            if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
            return copyDir(src, dest, opts);
        }
        function mkDirAndCopy(srcMode, src, dest, opts) {
            fs.mkdirSync(dest);
            copyDir(src, dest, opts);
            return setDestMode(dest, srcMode);
        }
        function copyDir(src, dest, opts) {
            fs.readdirSync(src).forEach((item)=>copyDirItem(item, src, dest, opts));
        }
        function copyDirItem(item, src, dest, opts) {
            const srcItem = path.join(src, item);
            const destItem = path.join(dest, item);
            if (opts.filter && !opts.filter(srcItem, destItem)) return;
            const { destStat  } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
            return getStats(destStat, srcItem, destItem, opts);
        }
        function onLink(destStat, src, dest, opts) {
            let resolvedSrc = fs.readlinkSync(src);
            if (opts.dereference) {
                resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
            }
            if (!destStat) {
                return fs.symlinkSync(resolvedSrc, dest);
            } else {
                let resolvedDest;
                try {
                    resolvedDest = fs.readlinkSync(dest);
                } catch (err) {
                    if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlinkSync(resolvedSrc, dest);
                    throw err;
                }
                if (opts.dereference) {
                    resolvedDest = path.resolve(process.cwd(), resolvedDest);
                }
                if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
                    throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
                }
                if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
                    throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
                }
                return copyLink(resolvedSrc, dest);
            }
        }
        function copyLink(resolvedSrc, dest) {
            fs.unlinkSync(dest);
            return fs.symlinkSync(resolvedSrc, dest);
        }
        module.exports = copySync;
    },
    "9d1f2b26": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return ansiRegex;
            }
        });
        function ansiRegex({ onlyFirst =false  } = {}) {
            const pattern = [
                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
            ].join("|");
            return new RegExp(pattern, onlyFirst ? undefined : "g");
        }
    },
    "9e237311": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (cursor, total, maxVisible)=>{
            maxVisible = maxVisible || total;
            let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
            if (startIndex < 0) startIndex = 0;
            let endIndex = Math.min(startIndex + maxVisible, total);
            return {
                startIndex,
                endIndex
            };
        };
    },
    "9ef8a425": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DuplexStream = farmRequire("a700a0ac").Duplex;
        const inherits = farmRequire("6e507463");
        const BufferList = farmRequire("34acfff4");
        function BufferListStream(callback) {
            if (!(this instanceof BufferListStream)) {
                return new BufferListStream(callback);
            }
            if (typeof callback === "function") {
                this._callback = callback;
                const piper = (function piper(err) {
                    if (this._callback) {
                        this._callback(err);
                        this._callback = null;
                    }
                }).bind(this);
                this.on("pipe", function onPipe(src) {
                    src.on("error", piper);
                });
                this.on("unpipe", function onUnpipe(src) {
                    src.removeListener("error", piper);
                });
                callback = null;
            }
            BufferList._init.call(this, callback);
            DuplexStream.call(this);
        }
        inherits(BufferListStream, DuplexStream);
        Object.assign(BufferListStream.prototype, BufferList.prototype);
        BufferListStream.prototype._new = function _new(callback) {
            return new BufferListStream(callback);
        };
        BufferListStream.prototype._write = function _write(buf, encoding, callback) {
            this._appendBuffer(buf);
            if (typeof callback === "function") {
                callback();
            }
        };
        BufferListStream.prototype._read = function _read(size) {
            if (!this.length) {
                return this.push(null);
            }
            size = Math.min(size, this.length);
            this.push(this.slice(0, size));
            this.consume(size);
        };
        BufferListStream.prototype.end = function end(chunk) {
            DuplexStream.prototype.end.call(this, chunk);
            if (this._callback) {
                this._callback(null, this.slice());
                this._callback = null;
            }
        };
        BufferListStream.prototype._destroy = function _destroy(err, cb) {
            this._bufs.length = 0;
            this.length = 0;
            cb(err);
        };
        BufferListStream.prototype._isBufferList = function _isBufferList(b) {
            return b instanceof BufferListStream || b instanceof BufferList || BufferListStream.isBufferList(b);
        };
        BufferListStream.isBufferList = BufferList.isBufferList;
        module.exports = BufferListStream;
        module.exports.BufferListStream = BufferListStream;
        module.exports.BufferList = BufferList;
    },
    "9f6a2f45": function(module, exports, farmRequire, dynamicRequire) {
        const EventEmitter = farmRequire("events").EventEmitter;
        const childProcess = farmRequire("child_process");
        const path = farmRequire("path");
        const fs = farmRequire("fs");
        const process = farmRequire("process");
        const { Argument , humanReadableArgName  } = farmRequire("682c5c39");
        const { CommanderError  } = farmRequire("b38041d6");
        const { Help  } = farmRequire("abb8ed56");
        const { Option , splitOptionFlags , DualOptions  } = farmRequire("8036cd02");
        const { suggestSimilar  } = farmRequire("d7b7dfaa");
        class Command extends EventEmitter {
            constructor(name){
                super();
                this.commands = [];
                this.options = [];
                this.parent = null;
                this._allowUnknownOption = false;
                this._allowExcessArguments = true;
                this._args = [];
                this.args = [];
                this.rawArgs = [];
                this.processedArgs = [];
                this._scriptPath = null;
                this._name = name || "";
                this._optionValues = {};
                this._optionValueSources = {};
                this._storeOptionsAsProperties = false;
                this._actionHandler = null;
                this._executableHandler = false;
                this._executableFile = null;
                this._executableDir = null;
                this._defaultCommandName = null;
                this._exitCallback = null;
                this._aliases = [];
                this._combineFlagAndOptionalValue = true;
                this._description = "";
                this._summary = "";
                this._argsDescription = undefined;
                this._enablePositionalOptions = false;
                this._passThroughOptions = false;
                this._lifeCycleHooks = {};
                this._showHelpAfterError = false;
                this._showSuggestionAfterError = true;
                this._outputConfiguration = {
                    writeOut: (str)=>process.stdout.write(str),
                    writeErr: (str)=>process.stderr.write(str),
                    getOutHelpWidth: ()=>process.stdout.isTTY ? process.stdout.columns : undefined,
                    getErrHelpWidth: ()=>process.stderr.isTTY ? process.stderr.columns : undefined,
                    outputError: (str, write)=>write(str)
                };
                this._hidden = false;
                this._hasHelpOption = true;
                this._helpFlags = "-h, --help";
                this._helpDescription = "display help for command";
                this._helpShortFlag = "-h";
                this._helpLongFlag = "--help";
                this._addImplicitHelpCommand = undefined;
                this._helpCommandName = "help";
                this._helpCommandnameAndArgs = "help [command]";
                this._helpCommandDescription = "display help for command";
                this._helpConfiguration = {};
            }
            copyInheritedSettings(sourceCommand) {
                this._outputConfiguration = sourceCommand._outputConfiguration;
                this._hasHelpOption = sourceCommand._hasHelpOption;
                this._helpFlags = sourceCommand._helpFlags;
                this._helpDescription = sourceCommand._helpDescription;
                this._helpShortFlag = sourceCommand._helpShortFlag;
                this._helpLongFlag = sourceCommand._helpLongFlag;
                this._helpCommandName = sourceCommand._helpCommandName;
                this._helpCommandnameAndArgs = sourceCommand._helpCommandnameAndArgs;
                this._helpCommandDescription = sourceCommand._helpCommandDescription;
                this._helpConfiguration = sourceCommand._helpConfiguration;
                this._exitCallback = sourceCommand._exitCallback;
                this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
                this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
                this._allowExcessArguments = sourceCommand._allowExcessArguments;
                this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
                this._showHelpAfterError = sourceCommand._showHelpAfterError;
                this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
                return this;
            }
            command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
                let desc = actionOptsOrExecDesc;
                let opts = execOpts;
                if (typeof desc === "object" && desc !== null) {
                    opts = desc;
                    desc = null;
                }
                opts = opts || {};
                const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
                const cmd = this.createCommand(name);
                if (desc) {
                    cmd.description(desc);
                    cmd._executableHandler = true;
                }
                if (opts.isDefault) this._defaultCommandName = cmd._name;
                cmd._hidden = !!(opts.noHelp || opts.hidden);
                cmd._executableFile = opts.executableFile || null;
                if (args) cmd.arguments(args);
                this.commands.push(cmd);
                cmd.parent = this;
                cmd.copyInheritedSettings(this);
                if (desc) return this;
                return cmd;
            }
            createCommand(name) {
                return new Command(name);
            }
            createHelp() {
                return Object.assign(new Help(), this.configureHelp());
            }
            configureHelp(configuration) {
                if (configuration === undefined) return this._helpConfiguration;
                this._helpConfiguration = configuration;
                return this;
            }
            configureOutput(configuration) {
                if (configuration === undefined) return this._outputConfiguration;
                Object.assign(this._outputConfiguration, configuration);
                return this;
            }
            showHelpAfterError(displayHelp = true) {
                if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
                this._showHelpAfterError = displayHelp;
                return this;
            }
            showSuggestionAfterError(displaySuggestion = true) {
                this._showSuggestionAfterError = !!displaySuggestion;
                return this;
            }
            addCommand(cmd, opts) {
                if (!cmd._name) {
                    throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
                }
                opts = opts || {};
                if (opts.isDefault) this._defaultCommandName = cmd._name;
                if (opts.noHelp || opts.hidden) cmd._hidden = true;
                this.commands.push(cmd);
                cmd.parent = this;
                return this;
            }
            createArgument(name, description) {
                return new Argument(name, description);
            }
            argument(name, description, fn, defaultValue) {
                const argument = this.createArgument(name, description);
                if (typeof fn === "function") {
                    argument.default(defaultValue).argParser(fn);
                } else {
                    argument.default(fn);
                }
                this.addArgument(argument);
                return this;
            }
            arguments(names) {
                names.split(/ +/).forEach((detail)=>{
                    this.argument(detail);
                });
                return this;
            }
            addArgument(argument) {
                const previousArgument = this._args.slice(-1)[0];
                if (previousArgument && previousArgument.variadic) {
                    throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
                }
                if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
                    throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
                }
                this._args.push(argument);
                return this;
            }
            addHelpCommand(enableOrNameAndArgs, description) {
                if (enableOrNameAndArgs === false) {
                    this._addImplicitHelpCommand = false;
                } else {
                    this._addImplicitHelpCommand = true;
                    if (typeof enableOrNameAndArgs === "string") {
                        this._helpCommandName = enableOrNameAndArgs.split(" ")[0];
                        this._helpCommandnameAndArgs = enableOrNameAndArgs;
                    }
                    this._helpCommandDescription = description || this._helpCommandDescription;
                }
                return this;
            }
            _hasImplicitHelpCommand() {
                if (this._addImplicitHelpCommand === undefined) {
                    return this.commands.length && !this._actionHandler && !this._findCommand("help");
                }
                return this._addImplicitHelpCommand;
            }
            hook(event, listener) {
                const allowedValues = [
                    "preSubcommand",
                    "preAction",
                    "postAction"
                ];
                if (!allowedValues.includes(event)) {
                    throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
                }
                if (this._lifeCycleHooks[event]) {
                    this._lifeCycleHooks[event].push(listener);
                } else {
                    this._lifeCycleHooks[event] = [
                        listener
                    ];
                }
                return this;
            }
            exitOverride(fn) {
                if (fn) {
                    this._exitCallback = fn;
                } else {
                    this._exitCallback = (err)=>{
                        if (err.code !== "commander.executeSubCommandAsync") {
                            throw err;
                        } else {}
                    };
                }
                return this;
            }
            _exit(exitCode, code, message) {
                if (this._exitCallback) {
                    this._exitCallback(new CommanderError(exitCode, code, message));
                }
                process.exit(exitCode);
            }
            action(fn) {
                const listener = (args)=>{
                    const expectedArgsCount = this._args.length;
                    const actionArgs = args.slice(0, expectedArgsCount);
                    if (this._storeOptionsAsProperties) {
                        actionArgs[expectedArgsCount] = this;
                    } else {
                        actionArgs[expectedArgsCount] = this.opts();
                    }
                    actionArgs.push(this);
                    return fn.apply(this, actionArgs);
                };
                this._actionHandler = listener;
                return this;
            }
            createOption(flags, description) {
                return new Option(flags, description);
            }
            addOption(option) {
                const oname = option.name();
                const name = option.attributeName();
                if (option.negate) {
                    const positiveLongFlag = option.long.replace(/^--no-/, "--");
                    if (!this._findOption(positiveLongFlag)) {
                        this.setOptionValueWithSource(name, option.defaultValue === undefined ? true : option.defaultValue, "default");
                    }
                } else if (option.defaultValue !== undefined) {
                    this.setOptionValueWithSource(name, option.defaultValue, "default");
                }
                this.options.push(option);
                const handleOptionValue = (val, invalidValueMessage, valueSource)=>{
                    if (val == null && option.presetArg !== undefined) {
                        val = option.presetArg;
                    }
                    const oldValue = this.getOptionValue(name);
                    if (val !== null && option.parseArg) {
                        try {
                            val = option.parseArg(val, oldValue);
                        } catch (err) {
                            if (err.code === "commander.invalidArgument") {
                                const message = `${invalidValueMessage} ${err.message}`;
                                this.error(message, {
                                    exitCode: err.exitCode,
                                    code: err.code
                                });
                            }
                            throw err;
                        }
                    } else if (val !== null && option.variadic) {
                        val = option._concatValue(val, oldValue);
                    }
                    if (val == null) {
                        if (option.negate) {
                            val = false;
                        } else if (option.isBoolean() || option.optional) {
                            val = true;
                        } else {
                            val = "";
                        }
                    }
                    this.setOptionValueWithSource(name, val, valueSource);
                };
                this.on("option:" + oname, (val)=>{
                    const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
                    handleOptionValue(val, invalidValueMessage, "cli");
                });
                if (option.envVar) {
                    this.on("optionEnv:" + oname, (val)=>{
                        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
                        handleOptionValue(val, invalidValueMessage, "env");
                    });
                }
                return this;
            }
            _optionEx(config, flags, description, fn, defaultValue) {
                if (typeof flags === "object" && flags instanceof Option) {
                    throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
                }
                const option = this.createOption(flags, description);
                option.makeOptionMandatory(!!config.mandatory);
                if (typeof fn === "function") {
                    option.default(defaultValue).argParser(fn);
                } else if (fn instanceof RegExp) {
                    const regex = fn;
                    fn = (val, def)=>{
                        const m = regex.exec(val);
                        return m ? m[0] : def;
                    };
                    option.default(defaultValue).argParser(fn);
                } else {
                    option.default(fn);
                }
                return this.addOption(option);
            }
            option(flags, description, fn, defaultValue) {
                return this._optionEx({}, flags, description, fn, defaultValue);
            }
            requiredOption(flags, description, fn, defaultValue) {
                return this._optionEx({
                    mandatory: true
                }, flags, description, fn, defaultValue);
            }
            combineFlagAndOptionalValue(combine = true) {
                this._combineFlagAndOptionalValue = !!combine;
                return this;
            }
            allowUnknownOption(allowUnknown = true) {
                this._allowUnknownOption = !!allowUnknown;
                return this;
            }
            allowExcessArguments(allowExcess = true) {
                this._allowExcessArguments = !!allowExcess;
                return this;
            }
            enablePositionalOptions(positional = true) {
                this._enablePositionalOptions = !!positional;
                return this;
            }
            passThroughOptions(passThrough = true) {
                this._passThroughOptions = !!passThrough;
                if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
                    throw new Error("passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)");
                }
                return this;
            }
            storeOptionsAsProperties(storeAsProperties = true) {
                this._storeOptionsAsProperties = !!storeAsProperties;
                if (this.options.length) {
                    throw new Error("call .storeOptionsAsProperties() before adding options");
                }
                return this;
            }
            getOptionValue(key) {
                if (this._storeOptionsAsProperties) {
                    return this[key];
                }
                return this._optionValues[key];
            }
            setOptionValue(key, value) {
                return this.setOptionValueWithSource(key, value, undefined);
            }
            setOptionValueWithSource(key, value, source) {
                if (this._storeOptionsAsProperties) {
                    this[key] = value;
                } else {
                    this._optionValues[key] = value;
                }
                this._optionValueSources[key] = source;
                return this;
            }
            getOptionValueSource(key) {
                return this._optionValueSources[key];
            }
            getOptionValueSourceWithGlobals(key) {
                let source;
                getCommandAndParents(this).forEach((cmd)=>{
                    if (cmd.getOptionValueSource(key) !== undefined) {
                        source = cmd.getOptionValueSource(key);
                    }
                });
                return source;
            }
            _prepareUserArgs(argv, parseOptions) {
                if (argv !== undefined && !Array.isArray(argv)) {
                    throw new Error("first parameter to parse must be array or undefined");
                }
                parseOptions = parseOptions || {};
                if (argv === undefined) {
                    argv = process.argv;
                    if (process.versions && process.versions.electron) {
                        parseOptions.from = "electron";
                    }
                }
                this.rawArgs = argv.slice();
                let userArgs;
                switch(parseOptions.from){
                    case undefined:
                    case "node":
                        this._scriptPath = argv[1];
                        userArgs = argv.slice(2);
                        break;
                    case "electron":
                        if (process.defaultApp) {
                            this._scriptPath = argv[1];
                            userArgs = argv.slice(2);
                        } else {
                            userArgs = argv.slice(1);
                        }
                        break;
                    case "user":
                        userArgs = argv.slice(0);
                        break;
                    default:
                        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
                }
                if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
                this._name = this._name || "program";
                return userArgs;
            }
            parse(argv, parseOptions) {
                const userArgs = this._prepareUserArgs(argv, parseOptions);
                this._parseCommand([], userArgs);
                return this;
            }
            async parseAsync(argv, parseOptions) {
                const userArgs = this._prepareUserArgs(argv, parseOptions);
                await this._parseCommand([], userArgs);
                return this;
            }
            _executeSubCommand(subcommand, args) {
                args = args.slice();
                let launchWithNode = false;
                const sourceExt = [
                    ".js",
                    ".ts",
                    ".tsx",
                    ".mjs",
                    ".cjs"
                ];
                function findFile(baseDir, baseName) {
                    const localBin = path.resolve(baseDir, baseName);
                    if (fs.existsSync(localBin)) return localBin;
                    if (sourceExt.includes(path.extname(baseName))) return undefined;
                    const foundExt = sourceExt.find((ext)=>fs.existsSync(`${localBin}${ext}`));
                    if (foundExt) return `${localBin}${foundExt}`;
                    return undefined;
                }
                this._checkForMissingMandatoryOptions();
                this._checkForConflictingOptions();
                let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
                let executableDir = this._executableDir || "";
                if (this._scriptPath) {
                    let resolvedScriptPath;
                    try {
                        resolvedScriptPath = fs.realpathSync(this._scriptPath);
                    } catch (err) {
                        resolvedScriptPath = this._scriptPath;
                    }
                    executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
                }
                if (executableDir) {
                    let localFile = findFile(executableDir, executableFile);
                    if (!localFile && !subcommand._executableFile && this._scriptPath) {
                        const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
                        if (legacyName !== this._name) {
                            localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
                        }
                    }
                    executableFile = localFile || executableFile;
                }
                launchWithNode = sourceExt.includes(path.extname(executableFile));
                let proc;
                if (process.platform !== "win32") {
                    if (launchWithNode) {
                        args.unshift(executableFile);
                        args = incrementNodeInspectorPort(process.execArgv).concat(args);
                        proc = childProcess.spawn(process.argv[0], args, {
                            stdio: "inherit"
                        });
                    } else {
                        proc = childProcess.spawn(executableFile, args, {
                            stdio: "inherit"
                        });
                    }
                } else {
                    args.unshift(executableFile);
                    args = incrementNodeInspectorPort(process.execArgv).concat(args);
                    proc = childProcess.spawn(process.execPath, args, {
                        stdio: "inherit"
                    });
                }
                if (!proc.killed) {
                    const signals = [
                        "SIGUSR1",
                        "SIGUSR2",
                        "SIGTERM",
                        "SIGINT",
                        "SIGHUP"
                    ];
                    signals.forEach((signal)=>{
                        process.on(signal, ()=>{
                            if (proc.killed === false && proc.exitCode === null) {
                                proc.kill(signal);
                            }
                        });
                    });
                }
                const exitCallback = this._exitCallback;
                if (!exitCallback) {
                    proc.on("close", process.exit.bind(process));
                } else {
                    proc.on("close", ()=>{
                        exitCallback(new CommanderError(process.exitCode || 0, "commander.executeSubCommandAsync", "(close)"));
                    });
                }
                proc.on("error", (err)=>{
                    if (err.code === "ENOENT") {
                        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
                        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
                        throw new Error(executableMissing);
                    } else if (err.code === "EACCES") {
                        throw new Error(`'${executableFile}' not executable`);
                    }
                    if (!exitCallback) {
                        process.exit(1);
                    } else {
                        const wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
                        wrappedError.nestedError = err;
                        exitCallback(wrappedError);
                    }
                });
                this.runningCommand = proc;
            }
            _dispatchSubcommand(commandName, operands, unknown) {
                const subCommand = this._findCommand(commandName);
                if (!subCommand) this.help({
                    error: true
                });
                let hookResult;
                hookResult = this._chainOrCallSubCommandHook(hookResult, subCommand, "preSubcommand");
                hookResult = this._chainOrCall(hookResult, ()=>{
                    if (subCommand._executableHandler) {
                        this._executeSubCommand(subCommand, operands.concat(unknown));
                    } else {
                        return subCommand._parseCommand(operands, unknown);
                    }
                });
                return hookResult;
            }
            _checkNumberOfArguments() {
                this._args.forEach((arg, i)=>{
                    if (arg.required && this.args[i] == null) {
                        this.missingArgument(arg.name());
                    }
                });
                if (this._args.length > 0 && this._args[this._args.length - 1].variadic) {
                    return;
                }
                if (this.args.length > this._args.length) {
                    this._excessArguments(this.args);
                }
            }
            _processArguments() {
                const myParseArg = (argument, value, previous)=>{
                    let parsedValue = value;
                    if (value !== null && argument.parseArg) {
                        try {
                            parsedValue = argument.parseArg(value, previous);
                        } catch (err) {
                            if (err.code === "commander.invalidArgument") {
                                const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
                                this.error(message, {
                                    exitCode: err.exitCode,
                                    code: err.code
                                });
                            }
                            throw err;
                        }
                    }
                    return parsedValue;
                };
                this._checkNumberOfArguments();
                const processedArgs = [];
                this._args.forEach((declaredArg, index)=>{
                    let value = declaredArg.defaultValue;
                    if (declaredArg.variadic) {
                        if (index < this.args.length) {
                            value = this.args.slice(index);
                            if (declaredArg.parseArg) {
                                value = value.reduce((processed, v)=>{
                                    return myParseArg(declaredArg, v, processed);
                                }, declaredArg.defaultValue);
                            }
                        } else if (value === undefined) {
                            value = [];
                        }
                    } else if (index < this.args.length) {
                        value = this.args[index];
                        if (declaredArg.parseArg) {
                            value = myParseArg(declaredArg, value, declaredArg.defaultValue);
                        }
                    }
                    processedArgs[index] = value;
                });
                this.processedArgs = processedArgs;
            }
            _chainOrCall(promise, fn) {
                if (promise && promise.then && typeof promise.then === "function") {
                    return promise.then(()=>fn());
                }
                return fn();
            }
            _chainOrCallHooks(promise, event) {
                let result = promise;
                const hooks = [];
                getCommandAndParents(this).reverse().filter((cmd)=>cmd._lifeCycleHooks[event] !== undefined).forEach((hookedCommand)=>{
                    hookedCommand._lifeCycleHooks[event].forEach((callback)=>{
                        hooks.push({
                            hookedCommand,
                            callback
                        });
                    });
                });
                if (event === "postAction") {
                    hooks.reverse();
                }
                hooks.forEach((hookDetail)=>{
                    result = this._chainOrCall(result, ()=>{
                        return hookDetail.callback(hookDetail.hookedCommand, this);
                    });
                });
                return result;
            }
            _chainOrCallSubCommandHook(promise, subCommand, event) {
                let result = promise;
                if (this._lifeCycleHooks[event] !== undefined) {
                    this._lifeCycleHooks[event].forEach((hook)=>{
                        result = this._chainOrCall(result, ()=>{
                            return hook(this, subCommand);
                        });
                    });
                }
                return result;
            }
            _parseCommand(operands, unknown) {
                const parsed = this.parseOptions(unknown);
                this._parseOptionsEnv();
                this._parseOptionsImplied();
                operands = operands.concat(parsed.operands);
                unknown = parsed.unknown;
                this.args = operands.concat(unknown);
                if (operands && this._findCommand(operands[0])) {
                    return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
                }
                if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
                    if (operands.length === 1) {
                        this.help();
                    }
                    return this._dispatchSubcommand(operands[1], [], [
                        this._helpLongFlag
                    ]);
                }
                if (this._defaultCommandName) {
                    outputHelpIfRequested(this, unknown);
                    return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
                }
                if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
                    this.help({
                        error: true
                    });
                }
                outputHelpIfRequested(this, parsed.unknown);
                this._checkForMissingMandatoryOptions();
                this._checkForConflictingOptions();
                const checkForUnknownOptions = ()=>{
                    if (parsed.unknown.length > 0) {
                        this.unknownOption(parsed.unknown[0]);
                    }
                };
                const commandEvent = `command:${this.name()}`;
                if (this._actionHandler) {
                    checkForUnknownOptions();
                    this._processArguments();
                    let actionResult;
                    actionResult = this._chainOrCallHooks(actionResult, "preAction");
                    actionResult = this._chainOrCall(actionResult, ()=>this._actionHandler(this.processedArgs));
                    if (this.parent) {
                        actionResult = this._chainOrCall(actionResult, ()=>{
                            this.parent.emit(commandEvent, operands, unknown);
                        });
                    }
                    actionResult = this._chainOrCallHooks(actionResult, "postAction");
                    return actionResult;
                }
                if (this.parent && this.parent.listenerCount(commandEvent)) {
                    checkForUnknownOptions();
                    this._processArguments();
                    this.parent.emit(commandEvent, operands, unknown);
                } else if (operands.length) {
                    if (this._findCommand("*")) {
                        return this._dispatchSubcommand("*", operands, unknown);
                    }
                    if (this.listenerCount("command:*")) {
                        this.emit("command:*", operands, unknown);
                    } else if (this.commands.length) {
                        this.unknownCommand();
                    } else {
                        checkForUnknownOptions();
                        this._processArguments();
                    }
                } else if (this.commands.length) {
                    checkForUnknownOptions();
                    this.help({
                        error: true
                    });
                } else {
                    checkForUnknownOptions();
                    this._processArguments();
                }
            }
            _findCommand(name) {
                if (!name) return undefined;
                return this.commands.find((cmd)=>cmd._name === name || cmd._aliases.includes(name));
            }
            _findOption(arg) {
                return this.options.find((option)=>option.is(arg));
            }
            _checkForMissingMandatoryOptions() {
                for(let cmd = this; cmd; cmd = cmd.parent){
                    cmd.options.forEach((anOption)=>{
                        if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === undefined) {
                            cmd.missingMandatoryOptionValue(anOption);
                        }
                    });
                }
            }
            _checkForConflictingLocalOptions() {
                const definedNonDefaultOptions = this.options.filter((option)=>{
                    const optionKey = option.attributeName();
                    if (this.getOptionValue(optionKey) === undefined) {
                        return false;
                    }
                    return this.getOptionValueSource(optionKey) !== "default";
                });
                const optionsWithConflicting = definedNonDefaultOptions.filter((option)=>option.conflictsWith.length > 0);
                optionsWithConflicting.forEach((option)=>{
                    const conflictingAndDefined = definedNonDefaultOptions.find((defined)=>option.conflictsWith.includes(defined.attributeName()));
                    if (conflictingAndDefined) {
                        this._conflictingOption(option, conflictingAndDefined);
                    }
                });
            }
            _checkForConflictingOptions() {
                for(let cmd = this; cmd; cmd = cmd.parent){
                    cmd._checkForConflictingLocalOptions();
                }
            }
            parseOptions(argv) {
                const operands = [];
                const unknown = [];
                let dest = operands;
                const args = argv.slice();
                function maybeOption(arg) {
                    return arg.length > 1 && arg[0] === "-";
                }
                let activeVariadicOption = null;
                while(args.length){
                    const arg = args.shift();
                    if (arg === "--") {
                        if (dest === unknown) dest.push(arg);
                        dest.push(...args);
                        break;
                    }
                    if (activeVariadicOption && !maybeOption(arg)) {
                        this.emit(`option:${activeVariadicOption.name()}`, arg);
                        continue;
                    }
                    activeVariadicOption = null;
                    if (maybeOption(arg)) {
                        const option = this._findOption(arg);
                        if (option) {
                            if (option.required) {
                                const value = args.shift();
                                if (value === undefined) this.optionMissingArgument(option);
                                this.emit(`option:${option.name()}`, value);
                            } else if (option.optional) {
                                let value = null;
                                if (args.length > 0 && !maybeOption(args[0])) {
                                    value = args.shift();
                                }
                                this.emit(`option:${option.name()}`, value);
                            } else {
                                this.emit(`option:${option.name()}`);
                            }
                            activeVariadicOption = option.variadic ? option : null;
                            continue;
                        }
                    }
                    if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
                        const option = this._findOption(`-${arg[1]}`);
                        if (option) {
                            if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                                this.emit(`option:${option.name()}`, arg.slice(2));
                            } else {
                                this.emit(`option:${option.name()}`);
                                args.unshift(`-${arg.slice(2)}`);
                            }
                            continue;
                        }
                    }
                    if (/^--[^=]+=/.test(arg)) {
                        const index = arg.indexOf("=");
                        const option = this._findOption(arg.slice(0, index));
                        if (option && (option.required || option.optional)) {
                            this.emit(`option:${option.name()}`, arg.slice(index + 1));
                            continue;
                        }
                    }
                    if (maybeOption(arg)) {
                        dest = unknown;
                    }
                    if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
                        if (this._findCommand(arg)) {
                            operands.push(arg);
                            if (args.length > 0) unknown.push(...args);
                            break;
                        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
                            operands.push(arg);
                            if (args.length > 0) operands.push(...args);
                            break;
                        } else if (this._defaultCommandName) {
                            unknown.push(arg);
                            if (args.length > 0) unknown.push(...args);
                            break;
                        }
                    }
                    if (this._passThroughOptions) {
                        dest.push(arg);
                        if (args.length > 0) dest.push(...args);
                        break;
                    }
                    dest.push(arg);
                }
                return {
                    operands,
                    unknown
                };
            }
            opts() {
                if (this._storeOptionsAsProperties) {
                    const result = {};
                    const len = this.options.length;
                    for(let i = 0; i < len; i++){
                        const key = this.options[i].attributeName();
                        result[key] = key === this._versionOptionName ? this._version : this[key];
                    }
                    return result;
                }
                return this._optionValues;
            }
            optsWithGlobals() {
                return getCommandAndParents(this).reduce((combinedOptions, cmd)=>Object.assign(combinedOptions, cmd.opts()), {});
            }
            error(message, errorOptions) {
                this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
                if (typeof this._showHelpAfterError === "string") {
                    this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
                } else if (this._showHelpAfterError) {
                    this._outputConfiguration.writeErr("\n");
                    this.outputHelp({
                        error: true
                    });
                }
                const config = errorOptions || {};
                const exitCode = config.exitCode || 1;
                const code = config.code || "commander.error";
                this._exit(exitCode, code, message);
            }
            _parseOptionsEnv() {
                this.options.forEach((option)=>{
                    if (option.envVar && option.envVar in process.env) {
                        const optionKey = option.attributeName();
                        if (this.getOptionValue(optionKey) === undefined || [
                            "default",
                            "config",
                            "env"
                        ].includes(this.getOptionValueSource(optionKey))) {
                            if (option.required || option.optional) {
                                this.emit(`optionEnv:${option.name()}`, process.env[option.envVar]);
                            } else {
                                this.emit(`optionEnv:${option.name()}`);
                            }
                        }
                    }
                });
            }
            _parseOptionsImplied() {
                const dualHelper = new DualOptions(this.options);
                const hasCustomOptionValue = (optionKey)=>{
                    return this.getOptionValue(optionKey) !== undefined && ![
                        "default",
                        "implied"
                    ].includes(this.getOptionValueSource(optionKey));
                };
                this.options.filter((option)=>option.implied !== undefined && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option)=>{
                    Object.keys(option.implied).filter((impliedKey)=>!hasCustomOptionValue(impliedKey)).forEach((impliedKey)=>{
                        this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
                    });
                });
            }
            missingArgument(name) {
                const message = `error: missing required argument '${name}'`;
                this.error(message, {
                    code: "commander.missingArgument"
                });
            }
            optionMissingArgument(option) {
                const message = `error: option '${option.flags}' argument missing`;
                this.error(message, {
                    code: "commander.optionMissingArgument"
                });
            }
            missingMandatoryOptionValue(option) {
                const message = `error: required option '${option.flags}' not specified`;
                this.error(message, {
                    code: "commander.missingMandatoryOptionValue"
                });
            }
            _conflictingOption(option, conflictingOption) {
                const findBestOptionFromValue = (option)=>{
                    const optionKey = option.attributeName();
                    const optionValue = this.getOptionValue(optionKey);
                    const negativeOption = this.options.find((target)=>target.negate && optionKey === target.attributeName());
                    const positiveOption = this.options.find((target)=>!target.negate && optionKey === target.attributeName());
                    if (negativeOption && (negativeOption.presetArg === undefined && optionValue === false || negativeOption.presetArg !== undefined && optionValue === negativeOption.presetArg)) {
                        return negativeOption;
                    }
                    return positiveOption || option;
                };
                const getErrorMessage = (option)=>{
                    const bestOption = findBestOptionFromValue(option);
                    const optionKey = bestOption.attributeName();
                    const source = this.getOptionValueSource(optionKey);
                    if (source === "env") {
                        return `environment variable '${bestOption.envVar}'`;
                    }
                    return `option '${bestOption.flags}'`;
                };
                const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
                this.error(message, {
                    code: "commander.conflictingOption"
                });
            }
            unknownOption(flag) {
                if (this._allowUnknownOption) return;
                let suggestion = "";
                if (flag.startsWith("--") && this._showSuggestionAfterError) {
                    let candidateFlags = [];
                    let command = this;
                    do {
                        const moreFlags = command.createHelp().visibleOptions(command).filter((option)=>option.long).map((option)=>option.long);
                        candidateFlags = candidateFlags.concat(moreFlags);
                        command = command.parent;
                    }while (command && !command._enablePositionalOptions);
                    suggestion = suggestSimilar(flag, candidateFlags);
                }
                const message = `error: unknown option '${flag}'${suggestion}`;
                this.error(message, {
                    code: "commander.unknownOption"
                });
            }
            _excessArguments(receivedArgs) {
                if (this._allowExcessArguments) return;
                const expected = this._args.length;
                const s = expected === 1 ? "" : "s";
                const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
                const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
                this.error(message, {
                    code: "commander.excessArguments"
                });
            }
            unknownCommand() {
                const unknownName = this.args[0];
                let suggestion = "";
                if (this._showSuggestionAfterError) {
                    const candidateNames = [];
                    this.createHelp().visibleCommands(this).forEach((command)=>{
                        candidateNames.push(command.name());
                        if (command.alias()) candidateNames.push(command.alias());
                    });
                    suggestion = suggestSimilar(unknownName, candidateNames);
                }
                const message = `error: unknown command '${unknownName}'${suggestion}`;
                this.error(message, {
                    code: "commander.unknownCommand"
                });
            }
            version(str, flags, description) {
                if (str === undefined) return this._version;
                this._version = str;
                flags = flags || "-V, --version";
                description = description || "output the version number";
                const versionOption = this.createOption(flags, description);
                this._versionOptionName = versionOption.attributeName();
                this.options.push(versionOption);
                this.on("option:" + versionOption.name(), ()=>{
                    this._outputConfiguration.writeOut(`${str}\n`);
                    this._exit(0, "commander.version", str);
                });
                return this;
            }
            description(str, argsDescription) {
                if (str === undefined && argsDescription === undefined) return this._description;
                this._description = str;
                if (argsDescription) {
                    this._argsDescription = argsDescription;
                }
                return this;
            }
            summary(str) {
                if (str === undefined) return this._summary;
                this._summary = str;
                return this;
            }
            alias(alias) {
                if (alias === undefined) return this._aliases[0];
                let command = this;
                if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
                    command = this.commands[this.commands.length - 1];
                }
                if (alias === command._name) throw new Error("Command alias can't be the same as its name");
                command._aliases.push(alias);
                return this;
            }
            aliases(aliases) {
                if (aliases === undefined) return this._aliases;
                aliases.forEach((alias)=>this.alias(alias));
                return this;
            }
            usage(str) {
                if (str === undefined) {
                    if (this._usage) return this._usage;
                    const args = this._args.map((arg)=>{
                        return humanReadableArgName(arg);
                    });
                    return [].concat(this.options.length || this._hasHelpOption ? "[options]" : [], this.commands.length ? "[command]" : [], this._args.length ? args : []).join(" ");
                }
                this._usage = str;
                return this;
            }
            name(str) {
                if (str === undefined) return this._name;
                this._name = str;
                return this;
            }
            nameFromFilename(filename) {
                this._name = path.basename(filename, path.extname(filename));
                return this;
            }
            executableDir(path) {
                if (path === undefined) return this._executableDir;
                this._executableDir = path;
                return this;
            }
            helpInformation(contextOptions) {
                const helper = this.createHelp();
                if (helper.helpWidth === undefined) {
                    helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
                }
                return helper.formatHelp(this, helper);
            }
            _getHelpContext(contextOptions) {
                contextOptions = contextOptions || {};
                const context = {
                    error: !!contextOptions.error
                };
                let write;
                if (context.error) {
                    write = (arg)=>this._outputConfiguration.writeErr(arg);
                } else {
                    write = (arg)=>this._outputConfiguration.writeOut(arg);
                }
                context.write = contextOptions.write || write;
                context.command = this;
                return context;
            }
            outputHelp(contextOptions) {
                let deprecatedCallback;
                if (typeof contextOptions === "function") {
                    deprecatedCallback = contextOptions;
                    contextOptions = undefined;
                }
                const context = this._getHelpContext(contextOptions);
                getCommandAndParents(this).reverse().forEach((command)=>command.emit("beforeAllHelp", context));
                this.emit("beforeHelp", context);
                let helpInformation = this.helpInformation(context);
                if (deprecatedCallback) {
                    helpInformation = deprecatedCallback(helpInformation);
                    if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
                        throw new Error("outputHelp callback must return a string or a Buffer");
                    }
                }
                context.write(helpInformation);
                this.emit(this._helpLongFlag);
                this.emit("afterHelp", context);
                getCommandAndParents(this).forEach((command)=>command.emit("afterAllHelp", context));
            }
            helpOption(flags, description) {
                if (typeof flags === "boolean") {
                    this._hasHelpOption = flags;
                    return this;
                }
                this._helpFlags = flags || this._helpFlags;
                this._helpDescription = description || this._helpDescription;
                const helpFlags = splitOptionFlags(this._helpFlags);
                this._helpShortFlag = helpFlags.shortFlag;
                this._helpLongFlag = helpFlags.longFlag;
                return this;
            }
            help(contextOptions) {
                this.outputHelp(contextOptions);
                let exitCode = process.exitCode || 0;
                if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
                    exitCode = 1;
                }
                this._exit(exitCode, "commander.help", "(outputHelp)");
            }
            addHelpText(position, text) {
                const allowedValues = [
                    "beforeAll",
                    "before",
                    "after",
                    "afterAll"
                ];
                if (!allowedValues.includes(position)) {
                    throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
                }
                const helpEvent = `${position}Help`;
                this.on(helpEvent, (context)=>{
                    let helpStr;
                    if (typeof text === "function") {
                        helpStr = text({
                            error: context.error,
                            command: context.command
                        });
                    } else {
                        helpStr = text;
                    }
                    if (helpStr) {
                        context.write(`${helpStr}\n`);
                    }
                });
                return this;
            }
        }
        function outputHelpIfRequested(cmd, args) {
            const helpOption = cmd._hasHelpOption && args.find((arg)=>arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
            if (helpOption) {
                cmd.outputHelp();
                cmd._exit(0, "commander.helpDisplayed", "(outputHelp)");
            }
        }
        function incrementNodeInspectorPort(args) {
            return args.map((arg)=>{
                if (!arg.startsWith("--inspect")) {
                    return arg;
                }
                let debugOption;
                let debugHost = "127.0.0.1";
                let debugPort = "9229";
                let match;
                if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
                    debugOption = match[1];
                } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
                    debugOption = match[1];
                    if (/^\d+$/.test(match[3])) {
                        debugPort = match[3];
                    } else {
                        debugHost = match[3];
                    }
                } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
                    debugOption = match[1];
                    debugHost = match[3];
                    debugPort = match[4];
                }
                if (debugOption && debugPort !== "0") {
                    return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
                }
                return arg;
            });
        }
        function getCommandAndParents(startCommand) {
            const result = [];
            for(let command = startCommand; command; command = command.parent){
                result.push(command);
            }
            return result;
        }
        exports.Command = Command;
    },
    "a0b75c92": function(module, exports, farmRequire, dynamicRequire) {
        const conversions = farmRequire("740b99e6");
        function buildGraph() {
            const graph = {};
            const models = Object.keys(conversions);
            for(let len = models.length, i = 0; i < len; i++){
                graph[models[i]] = {
                    distance: -1,
                    parent: null
                };
            }
            return graph;
        }
        function deriveBFS(fromModel) {
            const graph = buildGraph();
            const queue = [
                fromModel
            ];
            graph[fromModel].distance = 0;
            while(queue.length){
                const current = queue.pop();
                const adjacents = Object.keys(conversions[current]);
                for(let len = adjacents.length, i = 0; i < len; i++){
                    const adjacent = adjacents[i];
                    const node = graph[adjacent];
                    if (node.distance === -1) {
                        node.distance = graph[current].distance + 1;
                        node.parent = current;
                        queue.unshift(adjacent);
                    }
                }
            }
            return graph;
        }
        function link(from, to) {
            return function(args) {
                return to(from(args));
            };
        }
        function wrapConversion(toModel, graph) {
            const path = [
                graph[toModel].parent,
                toModel
            ];
            let fn = conversions[graph[toModel].parent][toModel];
            let cur = graph[toModel].parent;
            while(graph[cur].parent){
                path.unshift(graph[cur].parent);
                fn = link(conversions[graph[cur].parent][cur], fn);
                cur = graph[cur].parent;
            }
            fn.conversion = path;
            return fn;
        }
        module.exports = function(fromModel) {
            const graph = deriveBFS(fromModel);
            const conversion = {};
            const models = Object.keys(graph);
            for(let len = models.length, i = 0; i < len; i++){
                const toModel = models[i];
                const node = graph[toModel];
                if (node.parent === null) {
                    continue;
                }
                conversion[toModel] = wrapConversion(toModel, graph);
            }
            return conversion;
        };
    },
    "a11f83ae": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        exports.fromCallback = function(fn) {
            return Object.defineProperty(function(...args) {
                if (typeof args[args.length - 1] === "function") fn.apply(this, args);
                else {
                    return new Promise((resolve, reject)=>{
                        fn.call(this, ...args, (err, res)=>err != null ? reject(err) : resolve(res));
                    });
                }
            }, "name", {
                value: fn.name
            });
        };
        exports.fromPromise = function(fn) {
            return Object.defineProperty(function(...args) {
                const cb = args[args.length - 1];
                if (typeof cb !== "function") return fn.apply(this, args);
                else fn.apply(this, args.slice(0, -1)).then((r)=>cb(null, r), cb);
            }, "name", {
                value: fn.name
            });
        };
    },
    "a15b328b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            createSupportsColor: function() {
                return createSupportsColor;
            },
            default: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        var _nodeos = _interop_require_default._(farmRequire("node:os"));
        var _nodetty = _interop_require_default._(farmRequire("node:tty"));
        function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : _nodeprocess.default.argv) {
            const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
            const position = argv.indexOf(prefix + flag);
            const terminatorPosition = argv.indexOf("--");
            return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
        }
        const { env  } = _nodeprocess.default;
        let flagForceColor;
        if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
            flagForceColor = 0;
        } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
            flagForceColor = 1;
        }
        function envForceColor() {
            if ("FORCE_COLOR" in env) {
                if (env.FORCE_COLOR === "true") {
                    return 1;
                }
                if (env.FORCE_COLOR === "false") {
                    return 0;
                }
                return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
            }
        }
        function translateLevel(level) {
            if (level === 0) {
                return false;
            }
            return {
                level,
                hasBasic: true,
                has256: level >= 2,
                has16m: level >= 3
            };
        }
        function _supportsColor(haveStream, { streamIsTTY , sniffFlags =true  } = {}) {
            const noFlagForceColor = envForceColor();
            if (noFlagForceColor !== undefined) {
                flagForceColor = noFlagForceColor;
            }
            const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
            if (forceColor === 0) {
                return 0;
            }
            if (sniffFlags) {
                if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
                    return 3;
                }
                if (hasFlag("color=256")) {
                    return 2;
                }
            }
            if ("TF_BUILD" in env && "AGENT_NAME" in env) {
                return 1;
            }
            if (haveStream && !streamIsTTY && forceColor === undefined) {
                return 0;
            }
            const min = forceColor || 0;
            if (env.TERM === "dumb") {
                return min;
            }
            if (_nodeprocess.default.platform === "win32") {
                const osRelease = _nodeos.default.release().split(".");
                if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
                    return Number(osRelease[2]) >= 14931 ? 3 : 2;
                }
                return 1;
            }
            if ("CI" in env) {
                if ("GITHUB_ACTIONS" in env) {
                    return 3;
                }
                if ([
                    "TRAVIS",
                    "CIRCLECI",
                    "APPVEYOR",
                    "GITLAB_CI",
                    "BUILDKITE",
                    "DRONE"
                ].some((sign)=>sign in env) || env.CI_NAME === "codeship") {
                    return 1;
                }
                return min;
            }
            if ("TEAMCITY_VERSION" in env) {
                return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
            }
            if (env.COLORTERM === "truecolor") {
                return 3;
            }
            if (env.TERM === "xterm-kitty") {
                return 3;
            }
            if ("TERM_PROGRAM" in env) {
                const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
                switch(env.TERM_PROGRAM){
                    case "iTerm.app":
                        {
                            return version >= 3 ? 3 : 2;
                        }
                    case "Apple_Terminal":
                        {
                            return 2;
                        }
                }
            }
            if (/-256(color)?$/i.test(env.TERM)) {
                return 2;
            }
            if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
                return 1;
            }
            if ("COLORTERM" in env) {
                return 1;
            }
            return min;
        }
        function createSupportsColor(stream, options = {}) {
            const level = _supportsColor(stream, {
                streamIsTTY: stream && stream.isTTY,
                ...options
            });
            return translateLevel(level);
        }
        const supportsColor = {
            stdout: createSupportsColor({
                isTTY: _nodetty.default.isatty(1)
            }),
            stderr: createSupportsColor({
                isTTY: _nodetty.default.isatty(2)
            })
        };
        var _default = supportsColor;
    },
    "a1b1c604": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        class DatePart {
            constructor({ token , date , parts , locales  }){
                this.token = token;
                this.date = date || new Date();
                this.parts = parts || [
                    this
                ];
                this.locales = locales || {};
            }
            up() {}
            down() {}
            next() {
                const currentIdx = this.parts.indexOf(this);
                return this.parts.find((part, idx)=>idx > currentIdx && part instanceof DatePart);
            }
            setTo(val) {}
            prev() {
                let parts = [].concat(this.parts).reverse();
                const currentIdx = parts.indexOf(this);
                return parts.find((part, idx)=>idx > currentIdx && part instanceof DatePart);
            }
            toString() {
                return String(this.date);
            }
        }
        module.exports = DatePart;
    },
    "a49ecd25": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "runVueQuestions", {
            enumerable: true,
            get: function() {
                return runVueQuestions;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _precss = _interop_require_default._(farmRequire("978a3f3b"));
        var _components = _interop_require_default._(farmRequire("3b465ae1"));
        var _plugins = _interop_require_default._(farmRequire("56df7433"));
        var _feature = _interop_require_default._(farmRequire("816238c1"));
        var _theme = _interop_require_default._(farmRequire("0de734e3"));
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        var _vueEjsMapConstant = farmRequire("f2b2156d");
        var _question = _interop_require_default._(farmRequire("589ef9ca"));
        async function getVueProperty() {
            const currentLibrary = _vueEjsMapConstant.componentsMap.get(_options.default.components);
            const Eslint = _vueEjsMapConstant.featureMap.get("eslintPlugin");
            const Prettier = _vueEjsMapConstant.featureMap.get("prettier");
            const Router = _vueEjsMapConstant.featureMap.get("router");
            const Pinia = _vueEjsMapConstant.featureMap.get("pinia");
            const currentComponentResolver = _vueEjsMapConstant.componentResolverMap.get(_options.default.components);
            const notComponentResolver = _vueEjsMapConstant.notComponentResolverMap.includes(_options.default.components);
            Array.from(_vueEjsMapConstant.componentsMap.keys()).forEach((item)=>{
                _options.default[item] = _options.default.components === item;
            });
            resolveOptions(_options.default, _vueEjsMapConstant.featureMap);
            resolveOptions(_options.default, _vueEjsMapConstant.pluginMap);
            resolveOptions(_options.default, _vueEjsMapConstant.lintMap);
            _options.default.ui = currentLibrary;
            _options.default.constantDevDeps = _vueEjsMapConstant.featureMap.get("constantDevDeps");
            _options.default.constantProDeps = _vueEjsMapConstant.featureMap.get("constantProDeps");
            _options.default.ComponentResolver = currentComponentResolver;
            _options.default.notComponentResolver = notComponentResolver;
            _options.default.EslintWithPrettierScript = _vueEjsMapConstant.featureMap.get("eslintWithPrettier");
            _options.default.Eslint = Eslint;
            _options.default.Prettier = Prettier;
            _options.default.Router = Router;
            _options.default.Pinia = Pinia;
            _options.default.pluginList = _options.default.plugins.map((item)=>_vueEjsMapConstant.pluginMap.get(item)).reduce((total, next)=>total + next, "");
            _options.default.pluginImportStatement = _options.default.plugins.map((item)=>_vueEjsMapConstant.pluginImportStatement.get(item)).reduce((total, next)=>total + next, "");
            return Promise.resolve(true);
        }
        async function runVueQuestions() {
            await (0, _question.default)(_feature.default);
            await (0, _question.default)(_components.default);
            const res = await (0, _question.default)(_theme.default);
            res.useTheme && _plugins.default.choices.map((item)=>{
                if (item.selected === false) {
                    item.selected = true;
                }
            });
            await (0, _question.default)(_plugins.default);
            !_options.default.useTheme && await (0, _question.default)(_precss.default);
            await getVueProperty();
        }
        function resolveOptions(originOptions, configMap) {
            Array.from(configMap.keys()).forEach((item)=>{
                originOptions[item] = configMap.get(item);
            });
        }
    },
    "a57a18a1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (msg, opts = {})=>{
            const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
            const width = opts.width;
            return (msg || "").split(/\r?\n/g).map((line)=>line.split(/\s+/g).reduce((arr, w)=>{
                    if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
                    else arr.push(`${tab}${w}`);
                    return arr;
                }, [
                    tab
                ]).join("\n")).join("\n");
        };
    },
    "a5b36729": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            constantDevDeps: function() {
                return constantDevDeps;
            },
            constantProDeps: function() {
                return constantProDeps;
            },
            eslintWithPrettier: function() {
                return eslintWithPrettier;
            },
            elementPlusProThemeEffect: function() {
                return elementPlusProThemeEffect;
            },
            lessEffect: function() {
                return lessEffect;
            },
            vuetifyEffect: function() {
                return vuetifyEffect;
            },
            sassEffect: function() {
                return sassEffect;
            },
            varletEffect: function() {
                return varletEffect;
            },
            themeEffect: function() {
                return themeEffect;
            },
            elementPlugThemeEffect: function() {
                return elementPlugThemeEffect;
            },
            eslintPlugin: function() {
                return eslintPlugin;
            },
            eslintVue: function() {
                return eslintVue;
            },
            prettier: function() {
                return prettier;
            },
            pinia: function() {
                return pinia;
            },
            router: function() {
                return router;
            },
            tinyVueEffect: function() {
                return tinyVueEffect;
            }
        });
        const router = {
            name: "vue-router",
            version: "^4.1.6",
            stableVersion: "4.1.6",
            env: "pro"
        };
        const pinia = {
            name: [
                "pinia",
                "pinia-plugin-persistedstate"
            ],
            version: [
                "^2.0.33",
                "^3.1.0"
            ],
            stableVersion: [
                "2.0.14",
                "^1.0.0"
            ],
            env: "pro"
        };
        const prettier = {
            name: "prettier",
            version: "^2.8.4",
            stableVersion: "^2.8.0",
            env: "dev"
        };
        const eslintVue = {
            name: "eslint-plugin-vue",
            version: "^9.9.0",
            stableVersion: "^9.8.0",
            env: "dev"
        };
        const eslintPlugin = {
            name: [
                "eslint",
                "@typescript-eslint/eslint-plugin",
                "@typescript-eslint/parser"
            ],
            version: [
                "^8.36.0",
                "^5.44.0",
                "^5.44.0"
            ],
            stableVersion: [
                "^8.18.0",
                "^5.55.0",
                "^5.55.0"
            ],
            env: [
                "dev",
                "dev",
                "dev"
            ]
        };
        const eslintWithPrettier = {
            name: [
                "eslint-config-prettier",
                "eslint-plugin-prettier"
            ],
            version: [
                "^8.7.0",
                "^4.2.1"
            ],
            stableVersion: [
                "^8.5.0",
                "^4.2.1"
            ],
            env: "dev"
        };
        const elementPlugThemeEffect = {
            name: "@pureadmin/theme",
            version: "^2.0.0",
            stableVersion: "^2.0.0",
            env: "pro"
        };
        const varletEffect = {
            name: "@varlet/touch-emulator",
            version: "^2.9.1",
            stableVersion: "^1.27.20",
            dev: "pro"
        };
        const tinyVueEffect = {
            name: "@opentiny/vue-vite-import",
            version: "^1.0.0",
            stableVersion: "^1.0.0",
            dev: "dev"
        };
        const sassEffect = {
            name: "sass",
            version: "^1.59.3",
            stableVersion: "^1.53.0",
            env: "dev"
        };
        const lessEffect = {
            name: "less",
            version: "^4.1.3",
            stableVersion: "^4.1.3",
            env: "dev"
        };
        const vuetifyEffect = {
            name: "vite-plugin-vuetify",
            version: "^1.0.2",
            stableVersion: "^1.0.0-alpha.12",
            dev: "dev"
        };
        const themeEffect = {
            name: [
                "@erkelost/colorpicker",
                "@relaxed/layout",
                "@relaxed/utils"
            ],
            version: [
                "^1.0.8",
                "^2.0.17",
                "^2.0.17"
            ],
            stableVersion: [
                "^1.0.8",
                "^2.0.17",
                "^2.0.17"
            ],
            dev: "pro"
        };
        const elementPlusProThemeEffect = {
            name: [
                "css-color-function",
                "colord"
            ],
            version: [
                "^1.3.3",
                "^2.9.2"
            ],
            dev: [
                "pro",
                "pro"
            ]
        };
        const constantDevDeps = {
            name: [
                "vite",
                "typescript",
                "vue-tsc"
            ],
            version: [
                "^4.2.0",
                "^5.0.2",
                "^1.2.0"
            ],
            stableVersion: [
                "^4.1.0",
                "^4.9.3",
                "^1.0.24"
            ],
            dev: [
                "dev",
                "dev",
                "dev"
            ]
        };
        const constantProDeps = {
            name: [
                "@vueuse/core",
                "@vueuse/head",
                "vue"
            ],
            version: [
                "9.13.0",
                "1.1.23",
                "^3.2.47"
            ],
            stableVersion: [
                "latest",
                "latest",
                "latest",
                "^3.2.45"
            ],
            dev: [
                "pro",
                "pro",
                "dev",
                "pro"
            ]
        };
    },
    "a5e7665a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = PassThrough;
        var Transform = farmRequire("fc84809c");
        farmRequire("6e507463")(PassThrough, Transform);
        function PassThrough(options) {
            if (!(this instanceof PassThrough)) return new PassThrough(options);
            Transform.call(this, options);
        }
        PassThrough.prototype._transform = function(chunk, encoding, cb) {
            cb(null, chunk);
        };
    },
    "a6884590": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = farmRequire("stream");
    },
    "a700a0ac": function(module, exports, farmRequire, dynamicRequire) {
        var Stream = farmRequire("stream");
        if (process.env.READABLE_STREAM === "disable" && Stream) {
            module.exports = Stream.Readable;
            Object.assign(module.exports, Stream);
            module.exports.Stream = Stream;
        } else {
            exports = module.exports = farmRequire("409f98e3");
            exports.Stream = Stream || exports;
            exports.Readable = exports;
            exports.Writable = farmRequire("306c4dc2");
            exports.Duplex = farmRequire("24f368d5");
            exports.Transform = farmRequire("fc84809c");
            exports.PassThrough = farmRequire("a5e7665a");
            exports.finished = farmRequire("ae3cbc8b");
            exports.pipeline = farmRequire("f01eae42");
        }
    },
    "a8aa7a9c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (str)=>{
            const pattern = [
                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
            ].join("|");
            const RGX = new RegExp(pattern, "g");
            return typeof str === "string" ? str.replace(RGX, "") : str;
        };
    },
    "a9a069f0": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            program: function() {
                return program;
            },
            createCommand: function() {
                return createCommand;
            },
            createArgument: function() {
                return createArgument;
            },
            createOption: function() {
                return createOption;
            },
            CommanderError: function() {
                return CommanderError;
            },
            InvalidArgumentError: function() {
                return InvalidArgumentError;
            },
            InvalidOptionArgumentError: function() {
                return InvalidOptionArgumentError;
            },
            Command: function() {
                return Command;
            },
            Argument: function() {
                return Argument;
            },
            Option: function() {
                return Option;
            },
            Help: function() {
                return Help;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _index = _interop_require_default._(farmRequire("76336c6e"));
        const { program , createCommand , createArgument , createOption , CommanderError , InvalidArgumentError , InvalidOptionArgumentError , Command , Argument , Option , Help  } = _index.default;
    },
    "aa928bb7": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Meridiem extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setHours((this.date.getHours() + 12) % 24);
            }
            down() {
                this.up();
            }
            toString() {
                let meridiem = this.date.getHours() > 12 ? "pm" : "am";
                return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
            }
        }
        module.exports = Meridiem;
    },
    "abb8ed56": function(module, exports, farmRequire, dynamicRequire) {
        const { humanReadableArgName  } = farmRequire("682c5c39");
        class Help {
            constructor(){
                this.helpWidth = undefined;
                this.sortSubcommands = false;
                this.sortOptions = false;
                this.showGlobalOptions = false;
            }
            visibleCommands(cmd) {
                const visibleCommands = cmd.commands.filter((cmd)=>!cmd._hidden);
                if (cmd._hasImplicitHelpCommand()) {
                    const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
                    const helpCommand = cmd.createCommand(helpName).helpOption(false);
                    helpCommand.description(cmd._helpCommandDescription);
                    if (helpArgs) helpCommand.arguments(helpArgs);
                    visibleCommands.push(helpCommand);
                }
                if (this.sortSubcommands) {
                    visibleCommands.sort((a, b)=>{
                        return a.name().localeCompare(b.name());
                    });
                }
                return visibleCommands;
            }
            compareOptions(a, b) {
                const getSortKey = (option)=>{
                    return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
                };
                return getSortKey(a).localeCompare(getSortKey(b));
            }
            visibleOptions(cmd) {
                const visibleOptions = cmd.options.filter((option)=>!option.hidden);
                const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
                const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
                if (showShortHelpFlag || showLongHelpFlag) {
                    let helpOption;
                    if (!showShortHelpFlag) {
                        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
                    } else if (!showLongHelpFlag) {
                        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
                    } else {
                        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
                    }
                    visibleOptions.push(helpOption);
                }
                if (this.sortOptions) {
                    visibleOptions.sort(this.compareOptions);
                }
                return visibleOptions;
            }
            visibleGlobalOptions(cmd) {
                if (!this.showGlobalOptions) return [];
                const globalOptions = [];
                for(let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent){
                    const visibleOptions = parentCmd.options.filter((option)=>!option.hidden);
                    globalOptions.push(...visibleOptions);
                }
                if (this.sortOptions) {
                    globalOptions.sort(this.compareOptions);
                }
                return globalOptions;
            }
            visibleArguments(cmd) {
                if (cmd._argsDescription) {
                    cmd._args.forEach((argument)=>{
                        argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
                    });
                }
                if (cmd._args.find((argument)=>argument.description)) {
                    return cmd._args;
                }
                return [];
            }
            subcommandTerm(cmd) {
                const args = cmd._args.map((arg)=>humanReadableArgName(arg)).join(" ");
                return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
            }
            optionTerm(option) {
                return option.flags;
            }
            argumentTerm(argument) {
                return argument.name();
            }
            longestSubcommandTermLength(cmd, helper) {
                return helper.visibleCommands(cmd).reduce((max, command)=>{
                    return Math.max(max, helper.subcommandTerm(command).length);
                }, 0);
            }
            longestOptionTermLength(cmd, helper) {
                return helper.visibleOptions(cmd).reduce((max, option)=>{
                    return Math.max(max, helper.optionTerm(option).length);
                }, 0);
            }
            longestGlobalOptionTermLength(cmd, helper) {
                return helper.visibleGlobalOptions(cmd).reduce((max, option)=>{
                    return Math.max(max, helper.optionTerm(option).length);
                }, 0);
            }
            longestArgumentTermLength(cmd, helper) {
                return helper.visibleArguments(cmd).reduce((max, argument)=>{
                    return Math.max(max, helper.argumentTerm(argument).length);
                }, 0);
            }
            commandUsage(cmd) {
                let cmdName = cmd._name;
                if (cmd._aliases[0]) {
                    cmdName = cmdName + "|" + cmd._aliases[0];
                }
                let parentCmdNames = "";
                for(let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent){
                    parentCmdNames = parentCmd.name() + " " + parentCmdNames;
                }
                return parentCmdNames + cmdName + " " + cmd.usage();
            }
            commandDescription(cmd) {
                return cmd.description();
            }
            subcommandDescription(cmd) {
                return cmd.summary() || cmd.description();
            }
            optionDescription(option) {
                const extraInfo = [];
                if (option.argChoices) {
                    extraInfo.push(`choices: ${option.argChoices.map((choice)=>JSON.stringify(choice)).join(", ")}`);
                }
                if (option.defaultValue !== undefined) {
                    const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
                    if (showDefault) {
                        extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
                    }
                }
                if (option.presetArg !== undefined && option.optional) {
                    extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
                }
                if (option.envVar !== undefined) {
                    extraInfo.push(`env: ${option.envVar}`);
                }
                if (extraInfo.length > 0) {
                    return `${option.description} (${extraInfo.join(", ")})`;
                }
                return option.description;
            }
            argumentDescription(argument) {
                const extraInfo = [];
                if (argument.argChoices) {
                    extraInfo.push(`choices: ${argument.argChoices.map((choice)=>JSON.stringify(choice)).join(", ")}`);
                }
                if (argument.defaultValue !== undefined) {
                    extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
                }
                if (extraInfo.length > 0) {
                    const extraDescripton = `(${extraInfo.join(", ")})`;
                    if (argument.description) {
                        return `${argument.description} ${extraDescripton}`;
                    }
                    return extraDescripton;
                }
                return argument.description;
            }
            formatHelp(cmd, helper) {
                const termWidth = helper.padWidth(cmd, helper);
                const helpWidth = helper.helpWidth || 80;
                const itemIndentWidth = 2;
                const itemSeparatorWidth = 2;
                function formatItem(term, description) {
                    if (description) {
                        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
                        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
                    }
                    return term;
                }
                function formatList(textArray) {
                    return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
                }
                let output = [
                    `Usage: ${helper.commandUsage(cmd)}`,
                    ""
                ];
                const commandDescription = helper.commandDescription(cmd);
                if (commandDescription.length > 0) {
                    output = output.concat([
                        helper.wrap(commandDescription, helpWidth, 0),
                        ""
                    ]);
                }
                const argumentList = helper.visibleArguments(cmd).map((argument)=>{
                    return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
                });
                if (argumentList.length > 0) {
                    output = output.concat([
                        "Arguments:",
                        formatList(argumentList),
                        ""
                    ]);
                }
                const optionList = helper.visibleOptions(cmd).map((option)=>{
                    return formatItem(helper.optionTerm(option), helper.optionDescription(option));
                });
                if (optionList.length > 0) {
                    output = output.concat([
                        "Options:",
                        formatList(optionList),
                        ""
                    ]);
                }
                if (this.showGlobalOptions) {
                    const globalOptionList = helper.visibleGlobalOptions(cmd).map((option)=>{
                        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
                    });
                    if (globalOptionList.length > 0) {
                        output = output.concat([
                            "Global Options:",
                            formatList(globalOptionList),
                            ""
                        ]);
                    }
                }
                const commandList = helper.visibleCommands(cmd).map((cmd)=>{
                    return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
                });
                if (commandList.length > 0) {
                    output = output.concat([
                        "Commands:",
                        formatList(commandList),
                        ""
                    ]);
                }
                return output.join("\n");
            }
            padWidth(cmd, helper) {
                return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
            }
            wrap(str, width, indent, minColumnWidth = 40) {
                const indents = " \\f\\t\\v\xa0  -   　\uFEFF";
                const manualIndent = new RegExp(`[\\n][${indents}]+`);
                if (str.match(manualIndent)) return str;
                const columnWidth = width - indent;
                if (columnWidth < minColumnWidth) return str;
                const leadingStr = str.slice(0, indent);
                const columnText = str.slice(indent).replace("\r\n", "\n");
                const indentString = " ".repeat(indent);
                const zeroWidthSpace = "​";
                const breaks = `\\s${zeroWidthSpace}`;
                const regex = new RegExp(`\n|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`, "g");
                const lines = columnText.match(regex) || [];
                return leadingStr + lines.map((line, i)=>{
                    if (line === "\n") return "";
                    return (i > 0 ? indentString : "") + line.trimEnd();
                }).join("\n");
            }
        }
        exports.Help = Help;
    },
    "ad453cfe": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { style , clear , figures  } = farmRequire("b8d8683f");
        const { erase , cursor  } = farmRequire("84d4236d");
        const { DatePart , Meridiem , Day , Hours , Milliseconds , Minutes , Month , Seconds , Year  } = farmRequire("bdb5132a");
        const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
        const regexGroups = {
            1: ({ token  })=>token.replace(/\\(.)/g, "$1"),
            2: (opts)=>new Day(opts),
            3: (opts)=>new Month(opts),
            4: (opts)=>new Year(opts),
            5: (opts)=>new Meridiem(opts),
            6: (opts)=>new Hours(opts),
            7: (opts)=>new Minutes(opts),
            8: (opts)=>new Seconds(opts),
            9: (opts)=>new Milliseconds(opts)
        };
        const dfltLocales = {
            months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
        };
        class DatePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.cursor = 0;
                this.typed = "";
                this.locales = Object.assign(dfltLocales, opts.locales);
                this._date = opts.initial || new Date();
                this.errorMsg = opts.error || "Please Enter A Valid Value";
                this.validator = opts.validate || (()=>true);
                this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
                this.clear = clear("", this.out.columns);
                this.render();
            }
            get value() {
                return this.date;
            }
            get date() {
                return this._date;
            }
            set date(date) {
                if (date) this._date.setTime(date.getTime());
            }
            set mask(mask) {
                let result;
                this.parts = [];
                while(result = regex.exec(mask)){
                    let match = result.shift();
                    let idx = result.findIndex((gr)=>gr != null);
                    this.parts.push(idx in regexGroups ? regexGroups[idx]({
                        token: result[idx] || match,
                        date: this.date,
                        parts: this.parts,
                        locales: this.locales
                    }) : result[idx] || match);
                }
                let parts = this.parts.reduce((arr, i)=>{
                    if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
                    else arr.push(i);
                    return arr;
                }, []);
                this.parts.splice(0);
                this.parts.push(...parts);
                this.reset();
            }
            moveCursor(n) {
                this.typed = "";
                this.cursor = n;
                this.fire();
            }
            reset() {
                this.moveCursor(this.parts.findIndex((p)=>p instanceof DatePart));
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.error = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            async validate() {
                let valid = await this.validator(this.value);
                if (typeof valid === "string") {
                    this.errorMsg = valid;
                    valid = false;
                }
                this.error = !valid;
            }
            async submit() {
                await this.validate();
                if (this.error) {
                    this.color = "red";
                    this.fire();
                    this.render();
                    return;
                }
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            up() {
                this.typed = "";
                this.parts[this.cursor].up();
                this.render();
            }
            down() {
                this.typed = "";
                this.parts[this.cursor].down();
                this.render();
            }
            left() {
                let prev = this.parts[this.cursor].prev();
                if (prev == null) return this.bell();
                this.moveCursor(this.parts.indexOf(prev));
                this.render();
            }
            right() {
                let next = this.parts[this.cursor].next();
                if (next == null) return this.bell();
                this.moveCursor(this.parts.indexOf(next));
                this.render();
            }
            next() {
                let next = this.parts[this.cursor].next();
                this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part)=>part instanceof DatePart));
                this.render();
            }
            _(c) {
                if (/\d/.test(c)) {
                    this.typed += c;
                    this.parts[this.cursor].setTo(this.typed);
                    this.render();
                }
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.parts.reduce((arr, p, idx)=>arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
                ].join(" ");
                if (this.error) {
                    this.outputText += this.errorMsg.split("\n").reduce((a, l, i)=>a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = DatePrompt;
    },
    "ae3cbc8b": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var ERR_STREAM_PREMATURE_CLOSE = farmRequire("1c800b7b").codes.ERR_STREAM_PREMATURE_CLOSE;
        function once(callback) {
            var called = false;
            return function() {
                if (called) return;
                called = true;
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                callback.apply(this, args);
            };
        }
        function noop() {}
        function isRequest(stream) {
            return stream.setHeader && typeof stream.abort === "function";
        }
        function eos(stream, opts, callback) {
            if (typeof opts === "function") return eos(stream, null, opts);
            if (!opts) opts = {};
            callback = once(callback || noop);
            var readable = opts.readable || opts.readable !== false && stream.readable;
            var writable = opts.writable || opts.writable !== false && stream.writable;
            var onlegacyfinish = function onlegacyfinish() {
                if (!stream.writable) onfinish();
            };
            var writableEnded = stream._writableState && stream._writableState.finished;
            var onfinish = function onfinish() {
                writable = false;
                writableEnded = true;
                if (!readable) callback.call(stream);
            };
            var readableEnded = stream._readableState && stream._readableState.endEmitted;
            var onend = function onend() {
                readable = false;
                readableEnded = true;
                if (!writable) callback.call(stream);
            };
            var onerror = function onerror(err) {
                callback.call(stream, err);
            };
            var onclose = function onclose() {
                var err;
                if (readable && !readableEnded) {
                    if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
                    return callback.call(stream, err);
                }
                if (writable && !writableEnded) {
                    if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
                    return callback.call(stream, err);
                }
            };
            var onrequest = function onrequest() {
                stream.req.on("finish", onfinish);
            };
            if (isRequest(stream)) {
                stream.on("complete", onfinish);
                stream.on("abort", onclose);
                if (stream.req) onrequest();
                else stream.on("request", onrequest);
            } else if (writable && !stream._writableState) {
                stream.on("end", onlegacyfinish);
                stream.on("close", onlegacyfinish);
            }
            stream.on("end", onend);
            stream.on("finish", onfinish);
            if (opts.error !== false) stream.on("error", onerror);
            stream.on("close", onclose);
            return function() {
                stream.removeListener("complete", onfinish);
                stream.removeListener("abort", onclose);
                stream.removeListener("request", onrequest);
                if (stream.req) stream.req.removeListener("finish", onfinish);
                stream.removeListener("end", onlegacyfinish);
                stream.removeListener("close", onlegacyfinish);
                stream.removeListener("finish", onfinish);
                stream.removeListener("end", onend);
                stream.removeListener("error", onerror);
                stream.removeListener("close", onclose);
            };
        }
        module.exports = eos;
    },
    "af8846f6": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const c = farmRequire("fbb62511");
        const figures = farmRequire("5f688b9c");
        const styles = Object.freeze({
            password: {
                scale: 1,
                render: (input)=>"*".repeat(input.length)
            },
            emoji: {
                scale: 2,
                render: (input)=>"\uD83D\uDE03".repeat(input.length)
            },
            invisible: {
                scale: 0,
                render: (input)=>""
            },
            default: {
                scale: 1,
                render: (input)=>`${input}`
            }
        });
        const render = (type)=>styles[type] || styles.default;
        const symbols = Object.freeze({
            aborted: c.red(figures.cross),
            done: c.green(figures.tick),
            exited: c.yellow(figures.cross),
            default: c.cyan("?")
        });
        const symbol = (done, aborted, exited)=>aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
        const delimiter = (completing)=>c.gray(completing ? figures.ellipsis : figures.pointerSmall);
        const item = (expandable, expanded)=>c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
        module.exports = {
            styles,
            render,
            symbols,
            symbol,
            delimiter,
            item
        };
    },
    "b20c3033": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        function symlinkType(srcpath, type, callback) {
            callback = typeof type === "function" ? type : callback;
            type = typeof type === "function" ? false : type;
            if (type) return callback(null, type);
            fs.lstat(srcpath, (err, stats)=>{
                if (err) return callback(null, "file");
                type = stats && stats.isDirectory() ? "dir" : "file";
                callback(null, type);
            });
        }
        function symlinkTypeSync(srcpath, type) {
            let stats;
            if (type) return type;
            try {
                stats = fs.lstatSync(srcpath);
            } catch  {
                return "file";
            }
            return stats && stats.isDirectory() ? "dir" : "file";
        }
        module.exports = {
            symlinkType,
            symlinkTypeSync
        };
    },
    "b38041d6": function(module, exports, farmRequire, dynamicRequire) {
        class CommanderError extends Error {
            constructor(exitCode, code, message){
                super(message);
                Error.captureStackTrace(this, this.constructor);
                this.name = this.constructor.name;
                this.code = code;
                this.exitCode = exitCode;
                this.nestedError = undefined;
            }
        }
        class InvalidArgumentError extends CommanderError {
            constructor(message){
                super(1, "commander.invalidArgument", message);
                Error.captureStackTrace(this, this.constructor);
                this.name = this.constructor.name;
            }
        }
        exports.CommanderError = CommanderError;
        exports.InvalidArgumentError = InvalidArgumentError;
    },
    "b7b6f8c6": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromPromise;
        const fs = farmRequire("7e487033");
        const path = farmRequire("path");
        const mkdir = farmRequire("43482b8b");
        const remove = farmRequire("317fdd9f");
        const emptyDir = u(async function emptyDir(dir) {
            let items;
            try {
                items = await fs.readdir(dir);
            } catch  {
                return mkdir.mkdirs(dir);
            }
            return Promise.all(items.map((item)=>remove.remove(path.join(dir, item))));
        });
        function emptyDirSync(dir) {
            let items;
            try {
                items = fs.readdirSync(dir);
            } catch  {
                return mkdir.mkdirsSync(dir);
            }
            items.forEach((item)=>{
                item = path.join(dir, item);
                remove.removeSync(item);
            });
        }
        module.exports = {
            emptyDirSync,
            emptydirSync: emptyDirSync,
            emptyDir,
            emptydir: emptyDir
        };
    },
    "b82d8087": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("84d4236d"), erase = _require.erase, cursor = _require.cursor;
        const _require2 = farmRequire("232af10c"), style = _require2.style, clear = _require2.clear, figures = _require2.figures, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
        const getVal = (arr, i)=>arr[i] && (arr[i].value || arr[i].title || arr[i]);
        const getTitle = (arr, i)=>arr[i] && (arr[i].title || arr[i].value || arr[i]);
        const getIndex = (arr, valOrTitle)=>{
            const index = arr.findIndex((el)=>el.value === valOrTitle || el.title === valOrTitle);
            return index > -1 ? index : undefined;
        };
        class AutocompletePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.suggest = opts.suggest;
                this.choices = opts.choices;
                this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
                this.select = this.initial || opts.cursor || 0;
                this.i18n = {
                    noMatches: opts.noMatches || "no matches found"
                };
                this.fallback = opts.fallback || this.initial;
                this.clearFirst = opts.clearFirst || false;
                this.suggestions = [];
                this.input = "";
                this.limit = opts.limit || 10;
                this.cursor = 0;
                this.transform = style.render(opts.style);
                this.scale = this.transform.scale;
                this.render = this.render.bind(this);
                this.complete = this.complete.bind(this);
                this.clear = clear("", this.out.columns);
                this.complete(this.render);
                this.render();
            }
            set fallback(fb) {
                this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
            }
            get fallback() {
                let choice;
                if (typeof this._fb === "number") choice = this.choices[this._fb];
                else if (typeof this._fb === "string") choice = {
                    title: this._fb
                };
                return choice || this._fb || {
                    title: this.i18n.noMatches
                };
            }
            moveSelect(i) {
                this.select = i;
                if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
                else this.value = this.fallback.value;
                this.fire();
            }
            complete(cb) {
                var _this = this;
                return _asyncToGenerator(function*() {
                    const p = _this.completing = _this.suggest(_this.input, _this.choices);
                    const suggestions = yield p;
                    if (_this.completing !== p) return;
                    _this.suggestions = suggestions.map((s, i, arr)=>({
                            title: getTitle(arr, i),
                            value: getVal(arr, i),
                            description: s.description
                        }));
                    _this.completing = false;
                    const l = Math.max(suggestions.length - 1, 0);
                    _this.moveSelect(Math.min(l, _this.select));
                    cb && cb();
                })();
            }
            reset() {
                this.input = "";
                this.complete(()=>{
                    this.moveSelect(this.initial !== void 0 ? this.initial : 0);
                    this.render();
                });
                this.render();
            }
            exit() {
                if (this.clearFirst && this.input.length > 0) {
                    this.reset();
                } else {
                    this.done = this.exited = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                }
            }
            abort() {
                this.done = this.aborted = true;
                this.exited = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.done = true;
                this.aborted = this.exited = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            _(c, key) {
                let s1 = this.input.slice(0, this.cursor);
                let s2 = this.input.slice(this.cursor);
                this.input = `${s1}${c}${s2}`;
                this.cursor = s1.length + 1;
                this.complete(this.render);
                this.render();
            }
            delete() {
                if (this.cursor === 0) return this.bell();
                let s1 = this.input.slice(0, this.cursor - 1);
                let s2 = this.input.slice(this.cursor);
                this.input = `${s1}${s2}`;
                this.complete(this.render);
                this.cursor = this.cursor - 1;
                this.render();
            }
            deleteForward() {
                if (this.cursor * this.scale >= this.rendered.length) return this.bell();
                let s1 = this.input.slice(0, this.cursor);
                let s2 = this.input.slice(this.cursor + 1);
                this.input = `${s1}${s2}`;
                this.complete(this.render);
                this.render();
            }
            first() {
                this.moveSelect(0);
                this.render();
            }
            last() {
                this.moveSelect(this.suggestions.length - 1);
                this.render();
            }
            up() {
                if (this.select === 0) {
                    this.moveSelect(this.suggestions.length - 1);
                } else {
                    this.moveSelect(this.select - 1);
                }
                this.render();
            }
            down() {
                if (this.select === this.suggestions.length - 1) {
                    this.moveSelect(0);
                } else {
                    this.moveSelect(this.select + 1);
                }
                this.render();
            }
            next() {
                if (this.select === this.suggestions.length - 1) {
                    this.moveSelect(0);
                } else this.moveSelect(this.select + 1);
                this.render();
            }
            nextPage() {
                this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
                this.render();
            }
            prevPage() {
                this.moveSelect(Math.max(this.select - this.limit, 0));
                this.render();
            }
            left() {
                if (this.cursor <= 0) return this.bell();
                this.cursor = this.cursor - 1;
                this.render();
            }
            right() {
                if (this.cursor * this.scale >= this.rendered.length) return this.bell();
                this.cursor = this.cursor + 1;
                this.render();
            }
            renderOption(v, hovered, isStart, isEnd) {
                let desc;
                let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
                let title = hovered ? color.cyan().underline(v.title) : v.title;
                prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
                if (v.description) {
                    desc = ` - ${v.description}`;
                    if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                        desc = "\n" + wrap(v.description, {
                            margin: 3,
                            width: this.out.columns
                        });
                    }
                }
                return prefix + " " + title + color.gray(desc || "");
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
                this.outputText = [
                    style.symbol(this.done, this.aborted, this.exited),
                    color.bold(this.msg),
                    style.delimiter(this.completing),
                    this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
                ].join(" ");
                if (!this.done) {
                    const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i)=>this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
                    this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = AutocompletePrompt;
    },
    "b8d8683f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            action: farmRequire("5348f136"),
            clear: farmRequire("bafb4669"),
            style: farmRequire("af8846f6"),
            strip: farmRequire("a8aa7a9c"),
            figures: farmRequire("5f688b9c"),
            lines: farmRequire("efb6ac3e"),
            wrap: farmRequire("15ba01de"),
            entriesToDisplay: farmRequire("9e237311")
        };
    },
    "bafb4669": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const strip = farmRequire("a8aa7a9c");
        const { erase , cursor  } = farmRequire("84d4236d");
        const width = (str)=>[
                ...strip(str)
            ].length;
        module.exports = function(prompt, perLine) {
            if (!perLine) return erase.line + cursor.to(0);
            let rows = 0;
            const lines = prompt.split(/\r?\n/);
            for (let line of lines){
                rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
            }
            return erase.lines(rows);
        };
    },
    "bbe3310d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        var _restorecursor = _interop_require_default._(farmRequire("bce33aae"));
        let isHidden = false;
        const cliCursor = {};
        cliCursor.show = (writableStream = _nodeprocess.default.stderr)=>{
            if (!writableStream.isTTY) {
                return;
            }
            isHidden = false;
            writableStream.write("\x1b[?25h");
        };
        cliCursor.hide = (writableStream = _nodeprocess.default.stderr)=>{
            if (!writableStream.isTTY) {
                return;
            }
            (0, _restorecursor.default)();
            isHidden = true;
            writableStream.write("\x1b[?25l");
        };
        cliCursor.toggle = (force, writableStream)=>{
            if (force !== undefined) {
                isHidden = force;
            }
            if (isHidden) {
                cliCursor.show(writableStream);
            } else {
                cliCursor.hide(writableStream);
            }
        };
        var _default = cliCursor;
    },
    "bce33aae": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _nodeprocess = _interop_require_default._(farmRequire("node:process"));
        var _onetime = _interop_require_default._(farmRequire("f5eeb8b1"));
        var _signalexit = _interop_require_default._(farmRequire("0e0fccba"));
        const restoreCursor = (0, _onetime.default)(()=>{
            (0, _signalexit.default)(()=>{
                _nodeprocess.default.stderr.write("\x1b[?25h");
            }, {
                alwaysLast: true
            });
        });
        var _default = restoreCursor;
    },
    "bdb5132a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = {
            DatePart: farmRequire("a1b1c604"),
            Meridiem: farmRequire("868bb866"),
            Day: farmRequire("04a7b622"),
            Hours: farmRequire("8b905262"),
            Milliseconds: farmRequire("2388f0c2"),
            Minutes: farmRequire("e05ef33e"),
            Month: farmRequire("7b8520d9"),
            Seconds: farmRequire("15d39a0f"),
            Year: farmRequire("6d345dfe")
        };
    },
    "bfed495f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("7e487033");
        const path = farmRequire("path");
        const util = farmRequire("util");
        function getStats(src, dest, opts) {
            const statFunc = opts.dereference ? (file)=>fs.stat(file, {
                    bigint: true
                }) : (file)=>fs.lstat(file, {
                    bigint: true
                });
            return Promise.all([
                statFunc(src),
                statFunc(dest).catch((err)=>{
                    if (err.code === "ENOENT") return null;
                    throw err;
                })
            ]).then(([srcStat, destStat])=>({
                    srcStat,
                    destStat
                }));
        }
        function getStatsSync(src, dest, opts) {
            let destStat;
            const statFunc = opts.dereference ? (file)=>fs.statSync(file, {
                    bigint: true
                }) : (file)=>fs.lstatSync(file, {
                    bigint: true
                });
            const srcStat = statFunc(src);
            try {
                destStat = statFunc(dest);
            } catch (err) {
                if (err.code === "ENOENT") return {
                    srcStat,
                    destStat: null
                };
                throw err;
            }
            return {
                srcStat,
                destStat
            };
        }
        function checkPaths(src, dest, funcName, opts, cb) {
            util.callbackify(getStats)(src, dest, opts, (err, stats)=>{
                if (err) return cb(err);
                const { srcStat , destStat  } = stats;
                if (destStat) {
                    if (areIdentical(srcStat, destStat)) {
                        const srcBaseName = path.basename(src);
                        const destBaseName = path.basename(dest);
                        if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
                            return cb(null, {
                                srcStat,
                                destStat,
                                isChangingCase: true
                            });
                        }
                        return cb(new Error("Source and destination must not be the same."));
                    }
                    if (srcStat.isDirectory() && !destStat.isDirectory()) {
                        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
                    }
                    if (!srcStat.isDirectory() && destStat.isDirectory()) {
                        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
                    }
                }
                if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
                    return cb(new Error(errMsg(src, dest, funcName)));
                }
                return cb(null, {
                    srcStat,
                    destStat
                });
            });
        }
        function checkPathsSync(src, dest, funcName, opts) {
            const { srcStat , destStat  } = getStatsSync(src, dest, opts);
            if (destStat) {
                if (areIdentical(srcStat, destStat)) {
                    const srcBaseName = path.basename(src);
                    const destBaseName = path.basename(dest);
                    if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
                        return {
                            srcStat,
                            destStat,
                            isChangingCase: true
                        };
                    }
                    throw new Error("Source and destination must not be the same.");
                }
                if (srcStat.isDirectory() && !destStat.isDirectory()) {
                    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
                }
                if (!srcStat.isDirectory() && destStat.isDirectory()) {
                    throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
                }
            }
            if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
                throw new Error(errMsg(src, dest, funcName));
            }
            return {
                srcStat,
                destStat
            };
        }
        function checkParentPaths(src, srcStat, dest, funcName, cb) {
            const srcParent = path.resolve(path.dirname(src));
            const destParent = path.resolve(path.dirname(dest));
            if (destParent === srcParent || destParent === path.parse(destParent).root) return cb();
            fs.stat(destParent, {
                bigint: true
            }, (err, destStat)=>{
                if (err) {
                    if (err.code === "ENOENT") return cb();
                    return cb(err);
                }
                if (areIdentical(srcStat, destStat)) {
                    return cb(new Error(errMsg(src, dest, funcName)));
                }
                return checkParentPaths(src, srcStat, destParent, funcName, cb);
            });
        }
        function checkParentPathsSync(src, srcStat, dest, funcName) {
            const srcParent = path.resolve(path.dirname(src));
            const destParent = path.resolve(path.dirname(dest));
            if (destParent === srcParent || destParent === path.parse(destParent).root) return;
            let destStat;
            try {
                destStat = fs.statSync(destParent, {
                    bigint: true
                });
            } catch (err) {
                if (err.code === "ENOENT") return;
                throw err;
            }
            if (areIdentical(srcStat, destStat)) {
                throw new Error(errMsg(src, dest, funcName));
            }
            return checkParentPathsSync(src, srcStat, destParent, funcName);
        }
        function areIdentical(srcStat, destStat) {
            return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
        }
        function isSrcSubdir(src, dest) {
            const srcArr = path.resolve(src).split(path.sep).filter((i)=>i);
            const destArr = path.resolve(dest).split(path.sep).filter((i)=>i);
            return srcArr.reduce((acc, cur, i)=>acc && destArr[i] === cur, true);
        }
        function errMsg(src, dest, funcName) {
            return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
        }
        module.exports = {
            checkPaths,
            checkPathsSync,
            checkParentPaths,
            checkParentPathsSync,
            isSrcSubdir,
            areIdentical
        };
    },
    "c1603f62": function(module, exports, farmRequire, dynamicRequire) {
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { style , clear  } = farmRequire("b8d8683f");
        const { cursor , erase  } = farmRequire("84d4236d");
        class TogglePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.value = !!opts.initial;
                this.active = opts.active || "on";
                this.inactive = opts.inactive || "off";
                this.initialValue = this.value;
                this.render();
            }
            reset() {
                this.value = this.initialValue;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            deactivate() {
                if (this.value === false) return this.bell();
                this.value = false;
                this.render();
            }
            activate() {
                if (this.value === true) return this.bell();
                this.value = true;
                this.render();
            }
            delete() {
                this.deactivate();
            }
            left() {
                this.deactivate();
            }
            right() {
                this.activate();
            }
            down() {
                this.deactivate();
            }
            up() {
                this.activate();
            }
            next() {
                this.value = !this.value;
                this.fire();
                this.render();
            }
            _(c, key) {
                if (c === " ") {
                    this.value = !this.value;
                } else if (c === "1") {
                    this.value = true;
                } else if (c === "0") {
                    this.value = false;
                } else return this.bell();
                this.render();
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.value ? this.inactive : color.cyan().underline(this.inactive),
                    color.gray("/"),
                    this.value ? color.cyan().underline(this.active) : this.active
                ].join(" ");
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = TogglePrompt;
    },
    "c2445865": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        const path = farmRequire("path");
        const fs = farmRequire("f44ca176");
        const mkdir = farmRequire("43482b8b");
        function createFile(file, callback) {
            function makeFile() {
                fs.writeFile(file, "", (err)=>{
                    if (err) return callback(err);
                    callback();
                });
            }
            fs.stat(file, (err, stats)=>{
                if (!err && stats.isFile()) return callback();
                const dir = path.dirname(file);
                fs.stat(dir, (err, stats)=>{
                    if (err) {
                        if (err.code === "ENOENT") {
                            return mkdir.mkdirs(dir, (err)=>{
                                if (err) return callback(err);
                                makeFile();
                            });
                        }
                        return callback(err);
                    }
                    if (stats.isDirectory()) makeFile();
                    else {
                        fs.readdir(dir, (err)=>{
                            if (err) return callback(err);
                        });
                    }
                });
            });
        }
        function createFileSync(file) {
            let stats;
            try {
                stats = fs.statSync(file);
            } catch  {}
            if (stats && stats.isFile()) return;
            const dir = path.dirname(file);
            try {
                if (!fs.statSync(dir).isDirectory()) {
                    fs.readdirSync(dir);
                }
            } catch (err) {
                if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
                else throw err;
            }
            fs.writeFileSync(file, "");
        }
        module.exports = {
            createFile: u(createFile),
            createFileSync
        };
    },
    "c292cc33": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        const path = farmRequire("path");
        const copy = farmRequire("48f7966c").copy;
        const remove = farmRequire("317fdd9f").remove;
        const mkdirp = farmRequire("43482b8b").mkdirp;
        const pathExists = farmRequire("619c6a41").pathExists;
        const stat = farmRequire("bfed495f");
        function move(src, dest, opts, cb) {
            if (typeof opts === "function") {
                cb = opts;
                opts = {};
            }
            opts = opts || {};
            const overwrite = opts.overwrite || opts.clobber || false;
            stat.checkPaths(src, dest, "move", opts, (err, stats)=>{
                if (err) return cb(err);
                const { srcStat , isChangingCase =false  } = stats;
                stat.checkParentPaths(src, srcStat, dest, "move", (err)=>{
                    if (err) return cb(err);
                    if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb);
                    mkdirp(path.dirname(dest), (err)=>{
                        if (err) return cb(err);
                        return doRename(src, dest, overwrite, isChangingCase, cb);
                    });
                });
            });
        }
        function isParentRoot(dest) {
            const parent = path.dirname(dest);
            const parsedPath = path.parse(parent);
            return parsedPath.root === parent;
        }
        function doRename(src, dest, overwrite, isChangingCase, cb) {
            if (isChangingCase) return rename(src, dest, overwrite, cb);
            if (overwrite) {
                return remove(dest, (err)=>{
                    if (err) return cb(err);
                    return rename(src, dest, overwrite, cb);
                });
            }
            pathExists(dest, (err, destExists)=>{
                if (err) return cb(err);
                if (destExists) return cb(new Error("dest already exists."));
                return rename(src, dest, overwrite, cb);
            });
        }
        function rename(src, dest, overwrite, cb) {
            fs.rename(src, dest, (err)=>{
                if (!err) return cb();
                if (err.code !== "EXDEV") return cb(err);
                return moveAcrossDevice(src, dest, overwrite, cb);
            });
        }
        function moveAcrossDevice(src, dest, overwrite, cb) {
            const opts = {
                overwrite,
                errorOnExist: true
            };
            copy(src, dest, opts, (err)=>{
                if (err) return cb(err);
                return remove(src, cb);
            });
        }
        module.exports = move;
    },
    "c2b497c8": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        class DatePart {
            constructor({ token , date , parts , locales  }){
                this.token = token;
                this.date = date || new Date();
                this.parts = parts || [
                    this
                ];
                this.locales = locales || {};
            }
            up() {}
            down() {}
            next() {
                const currentIdx = this.parts.indexOf(this);
                return this.parts.find((part, idx)=>idx > currentIdx && part instanceof DatePart);
            }
            setTo(val) {}
            prev() {
                let parts = [].concat(this.parts).reverse();
                const currentIdx = parts.indexOf(this);
                return parts.find((part, idx)=>idx > currentIdx && part instanceof DatePart);
            }
            toString() {
                return String(this.date);
            }
        }
        module.exports = DatePart;
    },
    "c519a169": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const u = farmRequire("a11f83ae").fromCallback;
        const path = farmRequire("path");
        const fs = farmRequire("f44ca176");
        const mkdir = farmRequire("43482b8b");
        const pathExists = farmRequire("619c6a41").pathExists;
        const { areIdentical  } = farmRequire("bfed495f");
        function createLink(srcpath, dstpath, callback) {
            function makeLink(srcpath, dstpath) {
                fs.link(srcpath, dstpath, (err)=>{
                    if (err) return callback(err);
                    callback(null);
                });
            }
            fs.lstat(dstpath, (_, dstStat)=>{
                fs.lstat(srcpath, (err, srcStat)=>{
                    if (err) {
                        err.message = err.message.replace("lstat", "ensureLink");
                        return callback(err);
                    }
                    if (dstStat && areIdentical(srcStat, dstStat)) return callback(null);
                    const dir = path.dirname(dstpath);
                    pathExists(dir, (err, dirExists)=>{
                        if (err) return callback(err);
                        if (dirExists) return makeLink(srcpath, dstpath);
                        mkdir.mkdirs(dir, (err)=>{
                            if (err) return callback(err);
                            makeLink(srcpath, dstpath);
                        });
                    });
                });
            });
        }
        function createLinkSync(srcpath, dstpath) {
            let dstStat;
            try {
                dstStat = fs.lstatSync(dstpath);
            } catch  {}
            try {
                const srcStat = fs.lstatSync(srcpath);
                if (dstStat && areIdentical(srcStat, dstStat)) return;
            } catch (err) {
                err.message = err.message.replace("lstat", "ensureLink");
                throw err;
            }
            const dir = path.dirname(dstpath);
            const dirExists = fs.existsSync(dir);
            if (dirExists) return fs.linkSync(srcpath, dstpath);
            mkdir.mkdirsSync(dir);
            return fs.linkSync(srcpath, dstpath);
        }
        module.exports = {
            createLink: u(createLink),
            createLinkSync
        };
    },
    "c7f0177e": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = {
            "author": "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
            "bin": {
                "ejs": "./bin/cli.js"
            },
            "bugs": "https://github.com/mde/ejs/issues",
            "dependencies": {
                "jake": "^10.8.5"
            },
            "description": "Embedded JavaScript templates",
            "devDependencies": {
                "browserify": "^16.5.1",
                "eslint": "^6.8.0",
                "git-directory-deploy": "^1.5.1",
                "jsdoc": "^3.6.7",
                "lru-cache": "^4.0.1",
                "mocha": "^7.1.1",
                "uglify-js": "^3.3.16"
            },
            "engines": {
                "node": ">=0.10.0"
            },
            "homepage": "https://github.com/mde/ejs",
            "jsdelivr": "ejs.min.js",
            "keywords": [
                "template",
                "engine",
                "ejs"
            ],
            "license": "Apache-2.0",
            "main": "./lib/ejs.js",
            "name": "ejs",
            "repository": {
                "type": "git",
                "url": "git://github.com/mde/ejs.git"
            },
            "scripts": {
                "test": "mocha"
            },
            "unpkg": "ejs.min.js",
            "version": "3.1.8"
        };
    },
    "c9aac92a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return stripAnsi;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _ansiregex = _interop_require_default._(farmRequire("9d1f2b26"));
        function stripAnsi(string) {
            if (typeof string !== "string") {
                throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
            }
            return string.replace((0, _ansiregex.default)(), "");
        }
    },
    "cb0a7a43": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
        const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
        const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
        const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
        const ESCAPES = new Map([
            [
                "n",
                "\n"
            ],
            [
                "r",
                "\r"
            ],
            [
                "t",
                "	"
            ],
            [
                "b",
                "\b"
            ],
            [
                "f",
                "\f"
            ],
            [
                "v",
                "\v"
            ],
            [
                "0",
                "\x00"
            ],
            [
                "\\",
                "\\"
            ],
            [
                "e",
                "\x1b"
            ],
            [
                "a",
                "\x07"
            ]
        ]);
        function unescape(c) {
            const u = c[0] === "u";
            const bracket = c[1] === "{";
            if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
                return String.fromCharCode(parseInt(c.slice(1), 16));
            }
            if (u && bracket) {
                return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
            }
            return ESCAPES.get(c) || c;
        }
        function parseArguments(name, arguments_) {
            const results = [];
            const chunks = arguments_.trim().split(/\s*,\s*/g);
            let matches;
            for (const chunk of chunks){
                const number = Number(chunk);
                if (!Number.isNaN(number)) {
                    results.push(number);
                } else if (matches = chunk.match(STRING_REGEX)) {
                    results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character)=>escape ? unescape(escape) : character));
                } else {
                    throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
                }
            }
            return results;
        }
        function parseStyle(style) {
            STYLE_REGEX.lastIndex = 0;
            const results = [];
            let matches;
            while((matches = STYLE_REGEX.exec(style)) !== null){
                const name = matches[1];
                if (matches[2]) {
                    const args = parseArguments(name, matches[2]);
                    results.push([
                        name
                    ].concat(args));
                } else {
                    results.push([
                        name
                    ]);
                }
            }
            return results;
        }
        function buildStyle(chalk, styles) {
            const enabled = {};
            for (const layer of styles){
                for (const style of layer.styles){
                    enabled[style[0]] = layer.inverse ? null : style.slice(1);
                }
            }
            let current = chalk;
            for (const [styleName, styles] of Object.entries(enabled)){
                if (!Array.isArray(styles)) {
                    continue;
                }
                if (!(styleName in current)) {
                    throw new Error(`Unknown Chalk style: ${styleName}`);
                }
                current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
            }
            return current;
        }
        module.exports = (chalk, temporary)=>{
            const styles = [];
            const chunks = [];
            let chunk = [];
            temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character)=>{
                if (escapeCharacter) {
                    chunk.push(unescape(escapeCharacter));
                } else if (style) {
                    const string = chunk.join("");
                    chunk = [];
                    chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
                    styles.push({
                        inverse,
                        styles: parseStyle(style)
                    });
                } else if (close) {
                    if (styles.length === 0) {
                        throw new Error("Found extraneous } in Chalk template literal");
                    }
                    chunks.push(buildStyle(chalk, styles)(chunk.join("")));
                    chunk = [];
                    styles.pop();
                } else {
                    chunk.push(character);
                }
            });
            chunks.push(chunk.join(""));
            if (styles.length > 0) {
                const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
                throw new Error(errMessage);
            }
            return chunks.join("");
        };
    },
    "ce9278cc": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (flag, argv = process.argv)=>{
            const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
            const position = argv.indexOf(prefix + flag);
            const terminatorPosition = argv.indexOf("--");
            return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
        };
    },
    "cee71153": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
                var info = gen[key](arg);
                var value = info.value;
            } catch (error) {
                reject(error);
                return;
            }
            if (info.done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(_next, _throw);
            }
        }
        function _asyncToGenerator(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(undefined);
                });
            };
        }
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("232af10c"), style = _require.style, clear = _require.clear, figures = _require.figures;
        const _require2 = farmRequire("84d4236d"), erase = _require2.erase, cursor = _require2.cursor;
        const _require3 = farmRequire("2f74349b"), DatePart = _require3.DatePart, Meridiem = _require3.Meridiem, Day = _require3.Day, Hours = _require3.Hours, Milliseconds = _require3.Milliseconds, Minutes = _require3.Minutes, Month = _require3.Month, Seconds = _require3.Seconds, Year = _require3.Year;
        const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
        const regexGroups = {
            1: ({ token  })=>token.replace(/\\(.)/g, "$1"),
            2: (opts)=>new Day(opts),
            3: (opts)=>new Month(opts),
            4: (opts)=>new Year(opts),
            5: (opts)=>new Meridiem(opts),
            6: (opts)=>new Hours(opts),
            7: (opts)=>new Minutes(opts),
            8: (opts)=>new Seconds(opts),
            9: (opts)=>new Milliseconds(opts)
        };
        const dfltLocales = {
            months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
        };
        class DatePrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.cursor = 0;
                this.typed = "";
                this.locales = Object.assign(dfltLocales, opts.locales);
                this._date = opts.initial || new Date();
                this.errorMsg = opts.error || "Please Enter A Valid Value";
                this.validator = opts.validate || (()=>true);
                this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
                this.clear = clear("", this.out.columns);
                this.render();
            }
            get value() {
                return this.date;
            }
            get date() {
                return this._date;
            }
            set date(date) {
                if (date) this._date.setTime(date.getTime());
            }
            set mask(mask) {
                let result;
                this.parts = [];
                while(result = regex.exec(mask)){
                    let match = result.shift();
                    let idx = result.findIndex((gr)=>gr != null);
                    this.parts.push(idx in regexGroups ? regexGroups[idx]({
                        token: result[idx] || match,
                        date: this.date,
                        parts: this.parts,
                        locales: this.locales
                    }) : result[idx] || match);
                }
                let parts = this.parts.reduce((arr, i)=>{
                    if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
                    else arr.push(i);
                    return arr;
                }, []);
                this.parts.splice(0);
                this.parts.push(...parts);
                this.reset();
            }
            moveCursor(n) {
                this.typed = "";
                this.cursor = n;
                this.fire();
            }
            reset() {
                this.moveCursor(this.parts.findIndex((p)=>p instanceof DatePart));
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.error = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            validate() {
                var _this = this;
                return _asyncToGenerator(function*() {
                    let valid = yield _this.validator(_this.value);
                    if (typeof valid === "string") {
                        _this.errorMsg = valid;
                        valid = false;
                    }
                    _this.error = !valid;
                })();
            }
            submit() {
                var _this2 = this;
                return _asyncToGenerator(function*() {
                    yield _this2.validate();
                    if (_this2.error) {
                        _this2.color = "red";
                        _this2.fire();
                        _this2.render();
                        return;
                    }
                    _this2.done = true;
                    _this2.aborted = false;
                    _this2.fire();
                    _this2.render();
                    _this2.out.write("\n");
                    _this2.close();
                })();
            }
            up() {
                this.typed = "";
                this.parts[this.cursor].up();
                this.render();
            }
            down() {
                this.typed = "";
                this.parts[this.cursor].down();
                this.render();
            }
            left() {
                let prev = this.parts[this.cursor].prev();
                if (prev == null) return this.bell();
                this.moveCursor(this.parts.indexOf(prev));
                this.render();
            }
            right() {
                let next = this.parts[this.cursor].next();
                if (next == null) return this.bell();
                this.moveCursor(this.parts.indexOf(next));
                this.render();
            }
            next() {
                let next = this.parts[this.cursor].next();
                this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part)=>part instanceof DatePart));
                this.render();
            }
            _(c) {
                if (/\d/.test(c)) {
                    this.typed += c;
                    this.parts[this.cursor].setTo(this.typed);
                    this.render();
                }
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.parts.reduce((arr, p, idx)=>arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
                ].join(" ");
                if (this.error) {
                    this.outputText += this.errorMsg.split("\n").reduce((a, l, i)=>a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = DatePrompt;
    },
    "cfacf6a9": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = {
            "aesthetic": {
                "frames": [
                    "▰▱▱▱▱▱▱",
                    "▰▰▱▱▱▱▱",
                    "▰▰▰▱▱▱▱",
                    "▰▰▰▰▱▱▱",
                    "▰▰▰▰▰▱▱",
                    "▰▰▰▰▰▰▱",
                    "▰▰▰▰▰▰▰",
                    "▰▱▱▱▱▱▱"
                ],
                "interval": 80
            },
            "arc": {
                "frames": [
                    "◜",
                    "◠",
                    "◝",
                    "◞",
                    "◡",
                    "◟"
                ],
                "interval": 100
            },
            "arrow": {
                "frames": [
                    "←",
                    "↖",
                    "↑",
                    "↗",
                    "→",
                    "↘",
                    "↓",
                    "↙"
                ],
                "interval": 100
            },
            "arrow2": {
                "frames": [
                    "⬆️ ",
                    "↗️ ",
                    "➡️ ",
                    "↘️ ",
                    "⬇️ ",
                    "↙️ ",
                    "⬅️ ",
                    "↖️ "
                ],
                "interval": 80
            },
            "arrow3": {
                "frames": [
                    "▹▹▹▹▹",
                    "▸▹▹▹▹",
                    "▹▸▹▹▹",
                    "▹▹▸▹▹",
                    "▹▹▹▸▹",
                    "▹▹▹▹▸"
                ],
                "interval": 120
            },
            "balloon": {
                "frames": [
                    " ",
                    ".",
                    "o",
                    "O",
                    "@",
                    "*",
                    " "
                ],
                "interval": 140
            },
            "balloon2": {
                "frames": [
                    ".",
                    "o",
                    "O",
                    "\xb0",
                    "O",
                    "o",
                    "."
                ],
                "interval": 120
            },
            "betaWave": {
                "frames": [
                    "ρββββββ",
                    "βρβββββ",
                    "ββρββββ",
                    "βββρβββ",
                    "ββββρββ",
                    "βββββρβ",
                    "ββββββρ"
                ],
                "interval": 80
            },
            "bluePulse": {
                "frames": [
                    "\uD83D\uDD39 ",
                    "\uD83D\uDD37 ",
                    "\uD83D\uDD35 ",
                    "\uD83D\uDD35 ",
                    "\uD83D\uDD37 "
                ],
                "interval": 100
            },
            "bounce": {
                "frames": [
                    "⠁",
                    "⠂",
                    "⠄",
                    "⠂"
                ],
                "interval": 120
            },
            "bouncingBall": {
                "frames": [
                    "( ●    )",
                    "(  ●   )",
                    "(   ●  )",
                    "(    ● )",
                    "(     ●)",
                    "(    ● )",
                    "(   ●  )",
                    "(  ●   )",
                    "( ●    )",
                    "(●     )"
                ],
                "interval": 80
            },
            "bouncingBar": {
                "frames": [
                    "[    ]",
                    "[=   ]",
                    "[==  ]",
                    "[=== ]",
                    "[ ===]",
                    "[  ==]",
                    "[   =]",
                    "[    ]",
                    "[   =]",
                    "[  ==]",
                    "[ ===]",
                    "[====]",
                    "[=== ]",
                    "[==  ]",
                    "[=   ]"
                ],
                "interval": 80
            },
            "boxBounce": {
                "frames": [
                    "▖",
                    "▘",
                    "▝",
                    "▗"
                ],
                "interval": 120
            },
            "boxBounce2": {
                "frames": [
                    "▌",
                    "▀",
                    "▐",
                    "▄"
                ],
                "interval": 100
            },
            "christmas": {
                "frames": [
                    "\uD83C\uDF32",
                    "\uD83C\uDF84"
                ],
                "interval": 400
            },
            "circle": {
                "frames": [
                    "◡",
                    "⊙",
                    "◠"
                ],
                "interval": 120
            },
            "circleHalves": {
                "frames": [
                    "◐",
                    "◓",
                    "◑",
                    "◒"
                ],
                "interval": 50
            },
            "circleQuarters": {
                "frames": [
                    "◴",
                    "◷",
                    "◶",
                    "◵"
                ],
                "interval": 120
            },
            "clock": {
                "frames": [
                    "\uD83D\uDD5B ",
                    "\uD83D\uDD50 ",
                    "\uD83D\uDD51 ",
                    "\uD83D\uDD52 ",
                    "\uD83D\uDD53 ",
                    "\uD83D\uDD54 ",
                    "\uD83D\uDD55 ",
                    "\uD83D\uDD56 ",
                    "\uD83D\uDD57 ",
                    "\uD83D\uDD58 ",
                    "\uD83D\uDD59 ",
                    "\uD83D\uDD5A "
                ],
                "interval": 100
            },
            "dots": {
                "frames": [
                    "⠋",
                    "⠙",
                    "⠹",
                    "⠸",
                    "⠼",
                    "⠴",
                    "⠦",
                    "⠧",
                    "⠇",
                    "⠏"
                ],
                "interval": 80
            },
            "dots10": {
                "frames": [
                    "⢄",
                    "⢂",
                    "⢁",
                    "⡁",
                    "⡈",
                    "⡐",
                    "⡠"
                ],
                "interval": 80
            },
            "dots11": {
                "frames": [
                    "⠁",
                    "⠂",
                    "⠄",
                    "⡀",
                    "⢀",
                    "⠠",
                    "⠐",
                    "⠈"
                ],
                "interval": 100
            },
            "dots12": {
                "frames": [
                    "⢀⠀",
                    "⡀⠀",
                    "⠄⠀",
                    "⢂⠀",
                    "⡂⠀",
                    "⠅⠀",
                    "⢃⠀",
                    "⡃⠀",
                    "⠍⠀",
                    "⢋⠀",
                    "⡋⠀",
                    "⠍⠁",
                    "⢋⠁",
                    "⡋⠁",
                    "⠍⠉",
                    "⠋⠉",
                    "⠋⠉",
                    "⠉⠙",
                    "⠉⠙",
                    "⠉⠩",
                    "⠈⢙",
                    "⠈⡙",
                    "⢈⠩",
                    "⡀⢙",
                    "⠄⡙",
                    "⢂⠩",
                    "⡂⢘",
                    "⠅⡘",
                    "⢃⠨",
                    "⡃⢐",
                    "⠍⡐",
                    "⢋⠠",
                    "⡋⢀",
                    "⠍⡁",
                    "⢋⠁",
                    "⡋⠁",
                    "⠍⠉",
                    "⠋⠉",
                    "⠋⠉",
                    "⠉⠙",
                    "⠉⠙",
                    "⠉⠩",
                    "⠈⢙",
                    "⠈⡙",
                    "⠈⠩",
                    "⠀⢙",
                    "⠀⡙",
                    "⠀⠩",
                    "⠀⢘",
                    "⠀⡘",
                    "⠀⠨",
                    "⠀⢐",
                    "⠀⡐",
                    "⠀⠠",
                    "⠀⢀",
                    "⠀⡀"
                ],
                "interval": 80
            },
            "dots13": {
                "frames": [
                    "⣼",
                    "⣹",
                    "⢻",
                    "⠿",
                    "⡟",
                    "⣏",
                    "⣧",
                    "⣶"
                ],
                "interval": 80
            },
            "dots2": {
                "frames": [
                    "⣾",
                    "⣽",
                    "⣻",
                    "⢿",
                    "⡿",
                    "⣟",
                    "⣯",
                    "⣷"
                ],
                "interval": 80
            },
            "dots3": {
                "frames": [
                    "⠋",
                    "⠙",
                    "⠚",
                    "⠞",
                    "⠖",
                    "⠦",
                    "⠴",
                    "⠲",
                    "⠳",
                    "⠓"
                ],
                "interval": 80
            },
            "dots4": {
                "frames": [
                    "⠄",
                    "⠆",
                    "⠇",
                    "⠋",
                    "⠙",
                    "⠸",
                    "⠰",
                    "⠠",
                    "⠰",
                    "⠸",
                    "⠙",
                    "⠋",
                    "⠇",
                    "⠆"
                ],
                "interval": 80
            },
            "dots5": {
                "frames": [
                    "⠋",
                    "⠙",
                    "⠚",
                    "⠒",
                    "⠂",
                    "⠂",
                    "⠒",
                    "⠲",
                    "⠴",
                    "⠦",
                    "⠖",
                    "⠒",
                    "⠐",
                    "⠐",
                    "⠒",
                    "⠓",
                    "⠋"
                ],
                "interval": 80
            },
            "dots6": {
                "frames": [
                    "⠁",
                    "⠉",
                    "⠙",
                    "⠚",
                    "⠒",
                    "⠂",
                    "⠂",
                    "⠒",
                    "⠲",
                    "⠴",
                    "⠤",
                    "⠄",
                    "⠄",
                    "⠤",
                    "⠴",
                    "⠲",
                    "⠒",
                    "⠂",
                    "⠂",
                    "⠒",
                    "⠚",
                    "⠙",
                    "⠉",
                    "⠁"
                ],
                "interval": 80
            },
            "dots7": {
                "frames": [
                    "⠈",
                    "⠉",
                    "⠋",
                    "⠓",
                    "⠒",
                    "⠐",
                    "⠐",
                    "⠒",
                    "⠖",
                    "⠦",
                    "⠤",
                    "⠠",
                    "⠠",
                    "⠤",
                    "⠦",
                    "⠖",
                    "⠒",
                    "⠐",
                    "⠐",
                    "⠒",
                    "⠓",
                    "⠋",
                    "⠉",
                    "⠈"
                ],
                "interval": 80
            },
            "dots8": {
                "frames": [
                    "⠁",
                    "⠁",
                    "⠉",
                    "⠙",
                    "⠚",
                    "⠒",
                    "⠂",
                    "⠂",
                    "⠒",
                    "⠲",
                    "⠴",
                    "⠤",
                    "⠄",
                    "⠄",
                    "⠤",
                    "⠠",
                    "⠠",
                    "⠤",
                    "⠦",
                    "⠖",
                    "⠒",
                    "⠐",
                    "⠐",
                    "⠒",
                    "⠓",
                    "⠋",
                    "⠉",
                    "⠈",
                    "⠈"
                ],
                "interval": 80
            },
            "dots8Bit": {
                "frames": [
                    "⠀",
                    "⠁",
                    "⠂",
                    "⠃",
                    "⠄",
                    "⠅",
                    "⠆",
                    "⠇",
                    "⡀",
                    "⡁",
                    "⡂",
                    "⡃",
                    "⡄",
                    "⡅",
                    "⡆",
                    "⡇",
                    "⠈",
                    "⠉",
                    "⠊",
                    "⠋",
                    "⠌",
                    "⠍",
                    "⠎",
                    "⠏",
                    "⡈",
                    "⡉",
                    "⡊",
                    "⡋",
                    "⡌",
                    "⡍",
                    "⡎",
                    "⡏",
                    "⠐",
                    "⠑",
                    "⠒",
                    "⠓",
                    "⠔",
                    "⠕",
                    "⠖",
                    "⠗",
                    "⡐",
                    "⡑",
                    "⡒",
                    "⡓",
                    "⡔",
                    "⡕",
                    "⡖",
                    "⡗",
                    "⠘",
                    "⠙",
                    "⠚",
                    "⠛",
                    "⠜",
                    "⠝",
                    "⠞",
                    "⠟",
                    "⡘",
                    "⡙",
                    "⡚",
                    "⡛",
                    "⡜",
                    "⡝",
                    "⡞",
                    "⡟",
                    "⠠",
                    "⠡",
                    "⠢",
                    "⠣",
                    "⠤",
                    "⠥",
                    "⠦",
                    "⠧",
                    "⡠",
                    "⡡",
                    "⡢",
                    "⡣",
                    "⡤",
                    "⡥",
                    "⡦",
                    "⡧",
                    "⠨",
                    "⠩",
                    "⠪",
                    "⠫",
                    "⠬",
                    "⠭",
                    "⠮",
                    "⠯",
                    "⡨",
                    "⡩",
                    "⡪",
                    "⡫",
                    "⡬",
                    "⡭",
                    "⡮",
                    "⡯",
                    "⠰",
                    "⠱",
                    "⠲",
                    "⠳",
                    "⠴",
                    "⠵",
                    "⠶",
                    "⠷",
                    "⡰",
                    "⡱",
                    "⡲",
                    "⡳",
                    "⡴",
                    "⡵",
                    "⡶",
                    "⡷",
                    "⠸",
                    "⠹",
                    "⠺",
                    "⠻",
                    "⠼",
                    "⠽",
                    "⠾",
                    "⠿",
                    "⡸",
                    "⡹",
                    "⡺",
                    "⡻",
                    "⡼",
                    "⡽",
                    "⡾",
                    "⡿",
                    "⢀",
                    "⢁",
                    "⢂",
                    "⢃",
                    "⢄",
                    "⢅",
                    "⢆",
                    "⢇",
                    "⣀",
                    "⣁",
                    "⣂",
                    "⣃",
                    "⣄",
                    "⣅",
                    "⣆",
                    "⣇",
                    "⢈",
                    "⢉",
                    "⢊",
                    "⢋",
                    "⢌",
                    "⢍",
                    "⢎",
                    "⢏",
                    "⣈",
                    "⣉",
                    "⣊",
                    "⣋",
                    "⣌",
                    "⣍",
                    "⣎",
                    "⣏",
                    "⢐",
                    "⢑",
                    "⢒",
                    "⢓",
                    "⢔",
                    "⢕",
                    "⢖",
                    "⢗",
                    "⣐",
                    "⣑",
                    "⣒",
                    "⣓",
                    "⣔",
                    "⣕",
                    "⣖",
                    "⣗",
                    "⢘",
                    "⢙",
                    "⢚",
                    "⢛",
                    "⢜",
                    "⢝",
                    "⢞",
                    "⢟",
                    "⣘",
                    "⣙",
                    "⣚",
                    "⣛",
                    "⣜",
                    "⣝",
                    "⣞",
                    "⣟",
                    "⢠",
                    "⢡",
                    "⢢",
                    "⢣",
                    "⢤",
                    "⢥",
                    "⢦",
                    "⢧",
                    "⣠",
                    "⣡",
                    "⣢",
                    "⣣",
                    "⣤",
                    "⣥",
                    "⣦",
                    "⣧",
                    "⢨",
                    "⢩",
                    "⢪",
                    "⢫",
                    "⢬",
                    "⢭",
                    "⢮",
                    "⢯",
                    "⣨",
                    "⣩",
                    "⣪",
                    "⣫",
                    "⣬",
                    "⣭",
                    "⣮",
                    "⣯",
                    "⢰",
                    "⢱",
                    "⢲",
                    "⢳",
                    "⢴",
                    "⢵",
                    "⢶",
                    "⢷",
                    "⣰",
                    "⣱",
                    "⣲",
                    "⣳",
                    "⣴",
                    "⣵",
                    "⣶",
                    "⣷",
                    "⢸",
                    "⢹",
                    "⢺",
                    "⢻",
                    "⢼",
                    "⢽",
                    "⢾",
                    "⢿",
                    "⣸",
                    "⣹",
                    "⣺",
                    "⣻",
                    "⣼",
                    "⣽",
                    "⣾",
                    "⣿"
                ],
                "interval": 80
            },
            "dots9": {
                "frames": [
                    "⢹",
                    "⢺",
                    "⢼",
                    "⣸",
                    "⣇",
                    "⡧",
                    "⡗",
                    "⡏"
                ],
                "interval": 80
            },
            "dqpb": {
                "frames": [
                    "d",
                    "q",
                    "p",
                    "b"
                ],
                "interval": 100
            },
            "earth": {
                "frames": [
                    "\uD83C\uDF0D ",
                    "\uD83C\uDF0E ",
                    "\uD83C\uDF0F "
                ],
                "interval": 180
            },
            "fingerDance": {
                "frames": [
                    "\uD83E\uDD18 ",
                    "\uD83E\uDD1F ",
                    "\uD83D\uDD96 ",
                    "✋ ",
                    "\uD83E\uDD1A ",
                    "\uD83D\uDC46 "
                ],
                "interval": 160
            },
            "fistBump": {
                "frames": [
                    "\uD83E\uDD1C　　　　\uD83E\uDD1B ",
                    "\uD83E\uDD1C　　　　\uD83E\uDD1B ",
                    "\uD83E\uDD1C　　　　\uD83E\uDD1B ",
                    "　\uD83E\uDD1C　　\uD83E\uDD1B　 ",
                    "　　\uD83E\uDD1C\uD83E\uDD1B　　 ",
                    "　\uD83E\uDD1C✨\uD83E\uDD1B　　 ",
                    "\uD83E\uDD1C　✨　\uD83E\uDD1B　 "
                ],
                "interval": 80
            },
            "flip": {
                "frames": [
                    "_",
                    "_",
                    "_",
                    "-",
                    "`",
                    "`",
                    "'",
                    "\xb4",
                    "-",
                    "_",
                    "_",
                    "_"
                ],
                "interval": 70
            },
            "grenade": {
                "frames": [
                    "،  ",
                    "′  ",
                    " \xb4 ",
                    " ‾ ",
                    "  ⸌",
                    "  ⸊",
                    "  |",
                    "  ⁎",
                    "  ⁕",
                    " ෴ ",
                    "  ⁓",
                    "   ",
                    "   ",
                    "   "
                ],
                "interval": 80
            },
            "growHorizontal": {
                "frames": [
                    "▏",
                    "▎",
                    "▍",
                    "▌",
                    "▋",
                    "▊",
                    "▉",
                    "▊",
                    "▋",
                    "▌",
                    "▍",
                    "▎"
                ],
                "interval": 120
            },
            "growVertical": {
                "frames": [
                    "▁",
                    "▃",
                    "▄",
                    "▅",
                    "▆",
                    "▇",
                    "▆",
                    "▅",
                    "▄",
                    "▃"
                ],
                "interval": 120
            },
            "hamburger": {
                "frames": [
                    "☱",
                    "☲",
                    "☴"
                ],
                "interval": 100
            },
            "hearts": {
                "frames": [
                    "\uD83D\uDC9B ",
                    "\uD83D\uDC99 ",
                    "\uD83D\uDC9C ",
                    "\uD83D\uDC9A ",
                    "❤️ "
                ],
                "interval": 100
            },
            "layer": {
                "frames": [
                    "-",
                    "=",
                    "≡"
                ],
                "interval": 150
            },
            "line": {
                "frames": [
                    "-",
                    "\\",
                    "|",
                    "/"
                ],
                "interval": 130
            },
            "line2": {
                "frames": [
                    "⠂",
                    "-",
                    "–",
                    "—",
                    "–",
                    "-"
                ],
                "interval": 100
            },
            "material": {
                "frames": [
                    "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "███████▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "████████▁▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "██████████▁▁▁▁▁▁▁▁▁▁",
                    "███████████▁▁▁▁▁▁▁▁▁",
                    "█████████████▁▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁▁██████████████▁▁▁▁",
                    "▁▁▁██████████████▁▁▁",
                    "▁▁▁▁█████████████▁▁▁",
                    "▁▁▁▁██████████████▁▁",
                    "▁▁▁▁██████████████▁▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁██████████████▁",
                    "▁▁▁▁▁▁██████████████",
                    "▁▁▁▁▁▁██████████████",
                    "▁▁▁▁▁▁▁█████████████",
                    "▁▁▁▁▁▁▁█████████████",
                    "▁▁▁▁▁▁▁▁████████████",
                    "▁▁▁▁▁▁▁▁████████████",
                    "▁▁▁▁▁▁▁▁▁███████████",
                    "▁▁▁▁▁▁▁▁▁███████████",
                    "▁▁▁▁▁▁▁▁▁▁██████████",
                    "▁▁▁▁▁▁▁▁▁▁██████████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁████████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "██████▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "████████▁▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "█████████▁▁▁▁▁▁▁▁▁▁▁",
                    "███████████▁▁▁▁▁▁▁▁▁",
                    "████████████▁▁▁▁▁▁▁▁",
                    "████████████▁▁▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "██████████████▁▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁██████████████▁▁▁▁▁",
                    "▁▁▁█████████████▁▁▁▁",
                    "▁▁▁▁▁████████████▁▁▁",
                    "▁▁▁▁▁████████████▁▁▁",
                    "▁▁▁▁▁▁███████████▁▁▁",
                    "▁▁▁▁▁▁▁▁█████████▁▁▁",
                    "▁▁▁▁▁▁▁▁█████████▁▁▁",
                    "▁▁▁▁▁▁▁▁▁█████████▁▁",
                    "▁▁▁▁▁▁▁▁▁█████████▁▁",
                    "▁▁▁▁▁▁▁▁▁▁█████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁████████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁███████▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁███████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                    "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"
                ],
                "interval": 17
            },
            "mindblown": {
                "frames": [
                    "\uD83D\uDE10 ",
                    "\uD83D\uDE10 ",
                    "\uD83D\uDE2E ",
                    "\uD83D\uDE2E ",
                    "\uD83D\uDE26 ",
                    "\uD83D\uDE26 ",
                    "\uD83D\uDE27 ",
                    "\uD83D\uDE27 ",
                    "\uD83E\uDD2F ",
                    "\uD83D\uDCA5 ",
                    "✨ ",
                    "　 ",
                    "　 ",
                    "　 "
                ],
                "interval": 160
            },
            "monkey": {
                "frames": [
                    "\uD83D\uDE48 ",
                    "\uD83D\uDE48 ",
                    "\uD83D\uDE49 ",
                    "\uD83D\uDE4A "
                ],
                "interval": 300
            },
            "moon": {
                "frames": [
                    "\uD83C\uDF11 ",
                    "\uD83C\uDF12 ",
                    "\uD83C\uDF13 ",
                    "\uD83C\uDF14 ",
                    "\uD83C\uDF15 ",
                    "\uD83C\uDF16 ",
                    "\uD83C\uDF17 ",
                    "\uD83C\uDF18 "
                ],
                "interval": 80
            },
            "noise": {
                "frames": [
                    "▓",
                    "▒",
                    "░"
                ],
                "interval": 100
            },
            "orangeBluePulse": {
                "frames": [
                    "\uD83D\uDD38 ",
                    "\uD83D\uDD36 ",
                    "\uD83D\uDFE0 ",
                    "\uD83D\uDFE0 ",
                    "\uD83D\uDD36 ",
                    "\uD83D\uDD39 ",
                    "\uD83D\uDD37 ",
                    "\uD83D\uDD35 ",
                    "\uD83D\uDD35 ",
                    "\uD83D\uDD37 "
                ],
                "interval": 100
            },
            "orangePulse": {
                "frames": [
                    "\uD83D\uDD38 ",
                    "\uD83D\uDD36 ",
                    "\uD83D\uDFE0 ",
                    "\uD83D\uDFE0 ",
                    "\uD83D\uDD36 "
                ],
                "interval": 100
            },
            "pipe": {
                "frames": [
                    "┤",
                    "┘",
                    "┴",
                    "└",
                    "├",
                    "┌",
                    "┬",
                    "┐"
                ],
                "interval": 100
            },
            "point": {
                "frames": [
                    "∙∙∙",
                    "●∙∙",
                    "∙●∙",
                    "∙∙●",
                    "∙∙∙"
                ],
                "interval": 125
            },
            "pong": {
                "frames": [
                    "▐⠂       ▌",
                    "▐⠈       ▌",
                    "▐ ⠂      ▌",
                    "▐ ⠠      ▌",
                    "▐  ⡀     ▌",
                    "▐  ⠠     ▌",
                    "▐   ⠂    ▌",
                    "▐   ⠈    ▌",
                    "▐    ⠂   ▌",
                    "▐    ⠠   ▌",
                    "▐     ⡀  ▌",
                    "▐     ⠠  ▌",
                    "▐      ⠂ ▌",
                    "▐      ⠈ ▌",
                    "▐       ⠂▌",
                    "▐       ⠠▌",
                    "▐       ⡀▌",
                    "▐      ⠠ ▌",
                    "▐      ⠂ ▌",
                    "▐     ⠈  ▌",
                    "▐     ⠂  ▌",
                    "▐    ⠠   ▌",
                    "▐    ⡀   ▌",
                    "▐   ⠠    ▌",
                    "▐   ⠂    ▌",
                    "▐  ⠈     ▌",
                    "▐  ⠂     ▌",
                    "▐ ⠠      ▌",
                    "▐ ⡀      ▌",
                    "▐⠠       ▌"
                ],
                "interval": 80
            },
            "runner": {
                "frames": [
                    "\uD83D\uDEB6 ",
                    "\uD83C\uDFC3 "
                ],
                "interval": 140
            },
            "sand": {
                "frames": [
                    "⠁",
                    "⠂",
                    "⠄",
                    "⡀",
                    "⡈",
                    "⡐",
                    "⡠",
                    "⣀",
                    "⣁",
                    "⣂",
                    "⣄",
                    "⣌",
                    "⣔",
                    "⣤",
                    "⣥",
                    "⣦",
                    "⣮",
                    "⣶",
                    "⣷",
                    "⣿",
                    "⡿",
                    "⠿",
                    "⢟",
                    "⠟",
                    "⡛",
                    "⠛",
                    "⠫",
                    "⢋",
                    "⠋",
                    "⠍",
                    "⡉",
                    "⠉",
                    "⠑",
                    "⠡",
                    "⢁"
                ],
                "interval": 80
            },
            "shark": {
                "frames": [
                    "▐|\\____________▌",
                    "▐_|\\___________▌",
                    "▐__|\\__________▌",
                    "▐___|\\_________▌",
                    "▐____|\\________▌",
                    "▐_____|\\_______▌",
                    "▐______|\\______▌",
                    "▐_______|\\_____▌",
                    "▐________|\\____▌",
                    "▐_________|\\___▌",
                    "▐__________|\\__▌",
                    "▐___________|\\_▌",
                    "▐____________|\\▌",
                    "▐____________/|▌",
                    "▐___________/|_▌",
                    "▐__________/|__▌",
                    "▐_________/|___▌",
                    "▐________/|____▌",
                    "▐_______/|_____▌",
                    "▐______/|______▌",
                    "▐_____/|_______▌",
                    "▐____/|________▌",
                    "▐___/|_________▌",
                    "▐__/|__________▌",
                    "▐_/|___________▌",
                    "▐/|____________▌"
                ],
                "interval": 120
            },
            "simpleDots": {
                "frames": [
                    ".  ",
                    ".. ",
                    "...",
                    "   "
                ],
                "interval": 400
            },
            "simpleDotsScrolling": {
                "frames": [
                    ".  ",
                    ".. ",
                    "...",
                    " ..",
                    "  .",
                    "   "
                ],
                "interval": 200
            },
            "smiley": {
                "frames": [
                    "\uD83D\uDE04 ",
                    "\uD83D\uDE1D "
                ],
                "interval": 200
            },
            "soccerHeader": {
                "frames": [
                    " \uD83E\uDDD1⚽️       \uD83E\uDDD1 ",
                    "\uD83E\uDDD1  ⚽️      \uD83E\uDDD1 ",
                    "\uD83E\uDDD1   ⚽️     \uD83E\uDDD1 ",
                    "\uD83E\uDDD1    ⚽️    \uD83E\uDDD1 ",
                    "\uD83E\uDDD1     ⚽️   \uD83E\uDDD1 ",
                    "\uD83E\uDDD1      ⚽️  \uD83E\uDDD1 ",
                    "\uD83E\uDDD1       ⚽️\uD83E\uDDD1  ",
                    "\uD83E\uDDD1      ⚽️  \uD83E\uDDD1 ",
                    "\uD83E\uDDD1     ⚽️   \uD83E\uDDD1 ",
                    "\uD83E\uDDD1    ⚽️    \uD83E\uDDD1 ",
                    "\uD83E\uDDD1   ⚽️     \uD83E\uDDD1 ",
                    "\uD83E\uDDD1  ⚽️      \uD83E\uDDD1 "
                ],
                "interval": 80
            },
            "speaker": {
                "frames": [
                    "\uD83D\uDD08 ",
                    "\uD83D\uDD09 ",
                    "\uD83D\uDD0A ",
                    "\uD83D\uDD09 "
                ],
                "interval": 160
            },
            "squareCorners": {
                "frames": [
                    "◰",
                    "◳",
                    "◲",
                    "◱"
                ],
                "interval": 180
            },
            "squish": {
                "frames": [
                    "╫",
                    "╪"
                ],
                "interval": 100
            },
            "star": {
                "frames": [
                    "✶",
                    "✸",
                    "✹",
                    "✺",
                    "✹",
                    "✷"
                ],
                "interval": 70
            },
            "star2": {
                "frames": [
                    "+",
                    "x",
                    "*"
                ],
                "interval": 80
            },
            "timeTravel": {
                "frames": [
                    "\uD83D\uDD5B ",
                    "\uD83D\uDD5A ",
                    "\uD83D\uDD59 ",
                    "\uD83D\uDD58 ",
                    "\uD83D\uDD57 ",
                    "\uD83D\uDD56 ",
                    "\uD83D\uDD55 ",
                    "\uD83D\uDD54 ",
                    "\uD83D\uDD53 ",
                    "\uD83D\uDD52 ",
                    "\uD83D\uDD51 ",
                    "\uD83D\uDD50 "
                ],
                "interval": 100
            },
            "toggle": {
                "frames": [
                    "⊶",
                    "⊷"
                ],
                "interval": 250
            },
            "toggle10": {
                "frames": [
                    "㊂",
                    "㊀",
                    "㊁"
                ],
                "interval": 100
            },
            "toggle11": {
                "frames": [
                    "⧇",
                    "⧆"
                ],
                "interval": 50
            },
            "toggle12": {
                "frames": [
                    "☗",
                    "☖"
                ],
                "interval": 120
            },
            "toggle13": {
                "frames": [
                    "=",
                    "*",
                    "-"
                ],
                "interval": 80
            },
            "toggle2": {
                "frames": [
                    "▫",
                    "▪"
                ],
                "interval": 80
            },
            "toggle3": {
                "frames": [
                    "□",
                    "■"
                ],
                "interval": 120
            },
            "toggle4": {
                "frames": [
                    "■",
                    "□",
                    "▪",
                    "▫"
                ],
                "interval": 100
            },
            "toggle5": {
                "frames": [
                    "▮",
                    "▯"
                ],
                "interval": 100
            },
            "toggle6": {
                "frames": [
                    "ဝ",
                    "၀"
                ],
                "interval": 300
            },
            "toggle7": {
                "frames": [
                    "⦾",
                    "⦿"
                ],
                "interval": 80
            },
            "toggle8": {
                "frames": [
                    "◍",
                    "◌"
                ],
                "interval": 100
            },
            "toggle9": {
                "frames": [
                    "◉",
                    "◎"
                ],
                "interval": 100
            },
            "triangle": {
                "frames": [
                    "◢",
                    "◣",
                    "◤",
                    "◥"
                ],
                "interval": 50
            },
            "weather": {
                "frames": [
                    "☀️ ",
                    "☀️ ",
                    "☀️ ",
                    "\uD83C\uDF24 ",
                    "⛅️ ",
                    "\uD83C\uDF25 ",
                    "☁️ ",
                    "\uD83C\uDF27 ",
                    "\uD83C\uDF28 ",
                    "\uD83C\uDF27 ",
                    "\uD83C\uDF28 ",
                    "\uD83C\uDF27 ",
                    "\uD83C\uDF28 ",
                    "⛈ ",
                    "\uD83C\uDF28 ",
                    "\uD83C\uDF27 ",
                    "\uD83C\uDF28 ",
                    "☁️ ",
                    "\uD83C\uDF25 ",
                    "⛅️ ",
                    "\uD83C\uDF24 ",
                    "☀️ ",
                    "☀️ "
                ],
                "interval": 100
            }
        };
    },
    "d0b00e6f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        const pos = (n)=>{
            n = n % 10;
            return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
        };
        class Day extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setDate(this.date.getDate() + 1);
            }
            down() {
                this.date.setDate(this.date.getDate() - 1);
            }
            setTo(val) {
                this.date.setDate(parseInt(val.substr(-2)));
            }
            toString() {
                let date = this.date.getDate();
                let day = this.date.getDay();
                return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
            }
        }
        module.exports = Day;
    },
    "d0dff145": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return viteCliCoreCommand;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _create = _interop_require_default._(farmRequire("92a8bd99"));
        function viteCliCoreCommand() {
            (0, _create.default)();
        }
    },
    "d0f57640": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _commander = farmRequire("a9a069f0");
        const program = new _commander.Command();
        var _default = program;
    },
    "d22c1400": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _child_process = farmRequire("child_process");
        function createSpawnCmd(dest, stdio = "inherit") {
            return function(cmd, args) {
                const ls = (0, _child_process.spawn)(cmd, args, {
                    cwd: dest,
                    stdio: stdio,
                    shell: true
                });
                return new Promise((resolve, reject)=>{
                    ls.on("close", (code)=>{
                        code === 0 ? resolve(true) : reject(false);
                    });
                }).catch((err)=>{
                    console.log(err);
                });
            };
        }
        var _default = createSpawnCmd;
    },
    "d463d19f": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            PKG: function() {
                return PKG;
            },
            VITE_CLI_VERSION: function() {
                return VITE_CLI_VERSION;
            },
            JZZX_NAME: function() {
                return JZZX_NAME;
            },
            VERSION: function() {
                return VERSION;
            },
            BUILD_DATE: function() {
                return BUILD_DATE;
            }
        });
        const PKG = farmRequire("89de49a1");
        const VITE_CLI_VERSION = PKG.version;
        const JZZX_NAME = PKG.name;
        const VERSION = `\n\t\t🌱🌱 Published${PKG.version}Build @ VITE-CLI.com 🌱🌱`;
        const BUILD_DATE = `\n\t\t\t🌱🌱 Build last date: ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 🌱🌱`;
    },
    "d7b7dfaa": function(module, exports, farmRequire, dynamicRequire) {
        const maxDistance = 3;
        function editDistance(a, b) {
            if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);
            const d = [];
            for(let i = 0; i <= a.length; i++){
                d[i] = [
                    i
                ];
            }
            for(let j = 0; j <= b.length; j++){
                d[0][j] = j;
            }
            for(let j = 1; j <= b.length; j++){
                for(let i = 1; i <= a.length; i++){
                    let cost = 1;
                    if (a[i - 1] === b[j - 1]) {
                        cost = 0;
                    } else {
                        cost = 1;
                    }
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
                    }
                }
            }
            return d[a.length][b.length];
        }
        function suggestSimilar(word, candidates) {
            if (!candidates || candidates.length === 0) return "";
            candidates = Array.from(new Set(candidates));
            const searchingOptions = word.startsWith("--");
            if (searchingOptions) {
                word = word.slice(2);
                candidates = candidates.map((candidate)=>candidate.slice(2));
            }
            let similar = [];
            let bestDistance = maxDistance;
            const minSimilarity = 0.4;
            candidates.forEach((candidate)=>{
                if (candidate.length <= 1) return;
                const distance = editDistance(word, candidate);
                const length = Math.max(word.length, candidate.length);
                const similarity = (length - distance) / length;
                if (similarity > minSimilarity) {
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        similar = [
                            candidate
                        ];
                    } else if (distance === bestDistance) {
                        similar.push(candidate);
                    }
                }
            });
            similar.sort((a, b)=>a.localeCompare(b));
            if (searchingOptions) {
                similar = similar.map((candidate)=>`--${candidate}`);
            }
            if (similar.length > 1) {
                return `\n(Did you mean one of ${similar.join(", ")}?)`;
            }
            if (similar.length === 1) {
                return `\n(Did you mean ${similar[0]}?)`;
            }
            return "";
        }
        exports.suggestSimilar = suggestSimilar;
    },
    "d86641b2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const path = farmRequire("path");
        module.exports.checkPath = function checkPath(pth) {
            if (process.platform === "win32") {
                const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ""));
                if (pathHasInvalidWinCharacters) {
                    const error = new Error(`Path contains invalid characters: ${pth}`);
                    error.code = "EINVAL";
                    throw error;
                }
            }
        };
    },
    "de2f2620": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const fs = farmRequire("f44ca176");
        function utimesMillis(path, atime, mtime, callback) {
            fs.open(path, "r+", (err, fd)=>{
                if (err) return callback(err);
                fs.futimes(fd, atime, mtime, (futimesErr)=>{
                    fs.close(fd, (closeErr)=>{
                        if (callback) callback(futimesErr || closeErr);
                    });
                });
            });
        }
        function utimesMillisSync(path, atime, mtime) {
            const fd = fs.openSync(path, "r+");
            fs.futimesSync(fd, atime, mtime);
            return fs.closeSync(fd);
        }
        module.exports = {
            utimesMillis,
            utimesMillisSync
        };
    },
    "df326b79": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const c = farmRequire("fbb62511");
        const figures = farmRequire("3d020fdf");
        const styles = Object.freeze({
            password: {
                scale: 1,
                render: (input)=>"*".repeat(input.length)
            },
            emoji: {
                scale: 2,
                render: (input)=>"\uD83D\uDE03".repeat(input.length)
            },
            invisible: {
                scale: 0,
                render: (input)=>""
            },
            default: {
                scale: 1,
                render: (input)=>`${input}`
            }
        });
        const render = (type)=>styles[type] || styles.default;
        const symbols = Object.freeze({
            aborted: c.red(figures.cross),
            done: c.green(figures.tick),
            exited: c.yellow(figures.cross),
            default: c.cyan("?")
        });
        const symbol = (done, aborted, exited)=>aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
        const delimiter = (completing)=>c.gray(completing ? figures.ellipsis : figures.pointerSmall);
        const item = (expandable, expanded)=>c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
        module.exports = {
            styles,
            render,
            symbols,
            symbol,
            delimiter,
            item
        };
    },
    "df673ef7": function(module, exports, farmRequire, dynamicRequire) {
        let _fs;
        try {
            _fs = farmRequire("f44ca176");
        } catch (_) {
            _fs = farmRequire("fs");
        }
        const universalify = farmRequire("a11f83ae");
        const { stringify , stripBom  } = farmRequire("01e04666");
        async function _readFile(file, options = {}) {
            if (typeof options === "string") {
                options = {
                    encoding: options
                };
            }
            const fs = options.fs || _fs;
            const shouldThrow = "throws" in options ? options.throws : true;
            let data = await universalify.fromCallback(fs.readFile)(file, options);
            data = stripBom(data);
            let obj;
            try {
                obj = JSON.parse(data, options ? options.reviver : null);
            } catch (err) {
                if (shouldThrow) {
                    err.message = `${file}: ${err.message}`;
                    throw err;
                } else {
                    return null;
                }
            }
            return obj;
        }
        const readFile = universalify.fromPromise(_readFile);
        function readFileSync(file, options = {}) {
            if (typeof options === "string") {
                options = {
                    encoding: options
                };
            }
            const fs = options.fs || _fs;
            const shouldThrow = "throws" in options ? options.throws : true;
            try {
                let content = fs.readFileSync(file, options);
                content = stripBom(content);
                return JSON.parse(content, options.reviver);
            } catch (err) {
                if (shouldThrow) {
                    err.message = `${file}: ${err.message}`;
                    throw err;
                } else {
                    return null;
                }
            }
        }
        async function _writeFile(file, obj, options = {}) {
            const fs = options.fs || _fs;
            const str = stringify(obj, options);
            await universalify.fromCallback(fs.writeFile)(file, str, options);
        }
        const writeFile = universalify.fromPromise(_writeFile);
        function writeFileSync(file, obj, options = {}) {
            const fs = options.fs || _fs;
            const str = stringify(obj, options);
            return fs.writeFileSync(file, str, options);
        }
        const jsonfile = {
            readFile,
            readFileSync,
            writeFile,
            writeFileSync
        };
        module.exports = jsonfile;
    },
    "e05ef33e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("a1b1c604");
        class Minutes extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMinutes(this.date.getMinutes() + 1);
            }
            down() {
                this.date.setMinutes(this.date.getMinutes() - 1);
            }
            setTo(val) {
                this.date.setMinutes(parseInt(val.substr(-2)));
            }
            toString() {
                let m = this.date.getMinutes();
                return this.token.length > 1 ? String(m).padStart(2, "0") : m;
            }
        }
        module.exports = Minutes;
    },
    "e45b1b1d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        function destroy(err, cb) {
            var _this = this;
            var readableDestroyed = this._readableState && this._readableState.destroyed;
            var writableDestroyed = this._writableState && this._writableState.destroyed;
            if (readableDestroyed || writableDestroyed) {
                if (cb) {
                    cb(err);
                } else if (err) {
                    if (!this._writableState) {
                        process.nextTick(emitErrorNT, this, err);
                    } else if (!this._writableState.errorEmitted) {
                        this._writableState.errorEmitted = true;
                        process.nextTick(emitErrorNT, this, err);
                    }
                }
                return this;
            }
            if (this._readableState) {
                this._readableState.destroyed = true;
            }
            if (this._writableState) {
                this._writableState.destroyed = true;
            }
            this._destroy(err || null, function(err) {
                if (!cb && err) {
                    if (!_this._writableState) {
                        process.nextTick(emitErrorAndCloseNT, _this, err);
                    } else if (!_this._writableState.errorEmitted) {
                        _this._writableState.errorEmitted = true;
                        process.nextTick(emitErrorAndCloseNT, _this, err);
                    } else {
                        process.nextTick(emitCloseNT, _this);
                    }
                } else if (cb) {
                    process.nextTick(emitCloseNT, _this);
                    cb(err);
                } else {
                    process.nextTick(emitCloseNT, _this);
                }
            });
            return this;
        }
        function emitErrorAndCloseNT(self, err) {
            emitErrorNT(self, err);
            emitCloseNT(self);
        }
        function emitCloseNT(self) {
            if (self._writableState && !self._writableState.emitClose) return;
            if (self._readableState && !self._readableState.emitClose) return;
            self.emit("close");
        }
        function undestroy() {
            if (this._readableState) {
                this._readableState.destroyed = false;
                this._readableState.reading = false;
                this._readableState.ended = false;
                this._readableState.endEmitted = false;
            }
            if (this._writableState) {
                this._writableState.destroyed = false;
                this._writableState.ended = false;
                this._writableState.ending = false;
                this._writableState.finalCalled = false;
                this._writableState.prefinished = false;
                this._writableState.finished = false;
                this._writableState.errorEmitted = false;
            }
        }
        function emitErrorNT(self, err) {
            self.emit("error", err);
        }
        function errorOrDestroy(stream, err) {
            var rState = stream._readableState;
            var wState = stream._writableState;
            if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);
            else stream.emit("error", err);
        }
        module.exports = {
            destroy: destroy,
            undestroy: undestroy,
            errorOrDestroy: errorOrDestroy
        };
    },
    "e62e619e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("232af10c"), style = _require.style, clear = _require.clear, figures = _require.figures, wrap = _require.wrap, entriesToDisplay = _require.entriesToDisplay;
        const _require2 = farmRequire("84d4236d"), cursor = _require2.cursor;
        class SelectPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
                this.warn = opts.warn || "- This option is disabled";
                this.cursor = opts.initial || 0;
                this.choices = opts.choices.map((ch, idx)=>{
                    if (typeof ch === "string") ch = {
                        title: ch,
                        value: idx
                    };
                    return {
                        title: ch && (ch.title || ch.value || ch),
                        value: ch && (ch.value === undefined ? idx : ch.value),
                        description: ch && ch.description,
                        selected: ch && ch.selected,
                        disabled: ch && ch.disabled
                    };
                });
                this.optionsPerPage = opts.optionsPerPage || 10;
                this.value = (this.choices[this.cursor] || {}).value;
                this.clear = clear("", this.out.columns);
                this.render();
            }
            moveCursor(n) {
                this.cursor = n;
                this.value = this.choices[n].value;
                this.fire();
            }
            reset() {
                this.moveCursor(0);
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                if (!this.selection.disabled) {
                    this.done = true;
                    this.aborted = false;
                    this.fire();
                    this.render();
                    this.out.write("\n");
                    this.close();
                } else this.bell();
            }
            first() {
                this.moveCursor(0);
                this.render();
            }
            last() {
                this.moveCursor(this.choices.length - 1);
                this.render();
            }
            up() {
                if (this.cursor === 0) {
                    this.moveCursor(this.choices.length - 1);
                } else {
                    this.moveCursor(this.cursor - 1);
                }
                this.render();
            }
            down() {
                if (this.cursor === this.choices.length - 1) {
                    this.moveCursor(0);
                } else {
                    this.moveCursor(this.cursor + 1);
                }
                this.render();
            }
            next() {
                this.moveCursor((this.cursor + 1) % this.choices.length);
                this.render();
            }
            _(c, key) {
                if (c === " ") return this.submit();
            }
            get selection() {
                return this.choices[this.cursor];
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(false),
                    this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
                ].join(" ");
                if (!this.done) {
                    this.outputText += "\n";
                    for(let i = startIndex; i < endIndex; i++){
                        let title, prefix, desc = "", v = this.choices[i];
                        if (i === startIndex && startIndex > 0) {
                            prefix = figures.arrowUp;
                        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
                            prefix = figures.arrowDown;
                        } else {
                            prefix = " ";
                        }
                        if (v.disabled) {
                            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
                            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
                        } else {
                            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
                            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
                            if (v.description && this.cursor === i) {
                                desc = ` - ${v.description}`;
                                if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                                    desc = "\n" + wrap(v.description, {
                                        margin: 3,
                                        width: this.out.columns
                                    });
                                }
                            }
                        }
                        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
                    }
                }
                this.out.write(this.outputText);
            }
        }
        module.exports = SelectPrompt;
    },
    "e727888a": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            vueFetchTemplateFiles: function() {
                return vueFetchTemplateFiles;
            },
            templateFilesMap: function() {
                return templateFilesMap;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        const templateFilesMap = new Map();
        templateFilesMap.set("vue", vueFetchTemplateFiles);
        templateFilesMap.set("react", vueFetchTemplateFiles);
        function vueFetchTemplateFiles() {
            const files = [
                "package.json",
                "vite.config.ts",
                "src/main.ts",
                "build/vite/plugin.ts",
                "src/plugins/customComponents.ts",
                "src/components/Welcome.vue",
                "src/components/HelloWorld.vue",
                "src/App.vue",
                "src/plugins/assets.ts",
                _options.default.usePinia ? "src/store/modules/counter.ts" : null,
                ".eslintrc.js",
                "index.html"
            ];
            return files.filter(Boolean);
        }
    },
    "ef5ed4ae": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Minutes extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setMinutes(this.date.getMinutes() + 1);
            }
            down() {
                this.date.setMinutes(this.date.getMinutes() - 1);
            }
            setTo(val) {
                this.date.setMinutes(parseInt(val.substr(-2)));
            }
            toString() {
                let m = this.date.getMinutes();
                return this.token.length > 1 ? String(m).padStart(2, "0") : m;
            }
        }
        module.exports = Minutes;
    },
    "efb6ac3e": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const strip = farmRequire("a8aa7a9c");
        module.exports = function(msg, perLine) {
            let lines = String(strip(msg) || "").split(/\r?\n/);
            if (!perLine) return lines.length;
            return lines.map((l)=>Math.ceil(l.length / perLine)).reduce((a, b)=>a + b);
        };
    },
    "f01eae42": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        var eos;
        function once(callback) {
            var called = false;
            return function() {
                if (called) return;
                called = true;
                callback.apply(void 0, arguments);
            };
        }
        var _require$codes = farmRequire("1c800b7b").codes, ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS, ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
        function noop(err) {
            if (err) throw err;
        }
        function isRequest(stream) {
            return stream.setHeader && typeof stream.abort === "function";
        }
        function destroyer(stream, reading, writing, callback) {
            callback = once(callback);
            var closed = false;
            stream.on("close", function() {
                closed = true;
            });
            if (eos === undefined) eos = farmRequire("ae3cbc8b");
            eos(stream, {
                readable: reading,
                writable: writing
            }, function(err) {
                if (err) return callback(err);
                closed = true;
                callback();
            });
            var destroyed = false;
            return function(err) {
                if (closed) return;
                if (destroyed) return;
                destroyed = true;
                if (isRequest(stream)) return stream.abort();
                if (typeof stream.destroy === "function") return stream.destroy();
                callback(err || new ERR_STREAM_DESTROYED("pipe"));
            };
        }
        function call(fn) {
            fn();
        }
        function pipe(from, to) {
            return from.pipe(to);
        }
        function popCallback(streams) {
            if (!streams.length) return noop;
            if (typeof streams[streams.length - 1] !== "function") return noop;
            return streams.pop();
        }
        function pipeline() {
            for(var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++){
                streams[_key] = arguments[_key];
            }
            var callback = popCallback(streams);
            if (Array.isArray(streams[0])) streams = streams[0];
            if (streams.length < 2) {
                throw new ERR_MISSING_ARGS("streams");
            }
            var error;
            var destroys = streams.map(function(stream, i) {
                var reading = i < streams.length - 1;
                var writing = i > 0;
                return destroyer(stream, reading, writing, function(err) {
                    if (!error) error = err;
                    if (err) destroys.forEach(call);
                    if (reading) return;
                    destroys.forEach(call);
                    callback(error);
                });
            });
            return streams.reduce(pipe);
        }
        module.exports = pipeline;
    },
    "f2b2156d": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        function _export(target, all) {
            for(var name in all)Object.defineProperty(target, name, {
                enumerable: true,
                get: all[name]
            });
        }
        _export(exports, {
            componentsMap: function() {
                return componentsMap;
            },
            lintMap: function() {
                return lintMap;
            },
            featureMap: function() {
                return featureMap;
            },
            pluginMap: function() {
                return pluginMap;
            },
            componentResolverMap: function() {
                return componentResolverMap;
            },
            notComponentResolverMap: function() {
                return notComponentResolverMap;
            },
            pluginImportStatement: function() {
                return pluginImportStatement;
            },
            useThemeUiMap: function() {
                return useThemeUiMap;
            }
        });
        var _interop_require_wildcard = farmRequire("@swc/helpers/_/_interop_require_wildcard");
        var _components = _interop_require_wildcard._(farmRequire("66c444db"));
        var _features = _interop_require_wildcard._(farmRequire("a5b36729"));
        var _plugins = _interop_require_wildcard._(farmRequire("1171c95c"));
        const componentsMap = new Map();
        Object.keys(_components).forEach((item)=>{
            componentsMap.set(item, `"${_components[item].name}":"${_components[item].version}",`);
        });
        const componentResolverMap = new Map([]);
        Object.keys(_components).forEach((item)=>{
            componentResolverMap.set(item, `${_components[item].unpluginResolver}`);
        });
        const featureMap = new Map();
        Object.keys(_features).forEach((item)=>{
            if (Array.isArray(_features[item].name)) {
                let res = "";
                _features[item].name.forEach((cur, index)=>{
                    res += `"${cur}":"${_features[item].version[index]}",`;
                });
                featureMap.set(item, res);
            } else {
                featureMap.set(item, `"${_features[item].name}":"${_features[item].version}",`);
            }
        });
        const lintMap = new Map([
            [
                "EslintScript",
                '"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",'
            ],
            [
                "PrettierScript",
                '"prettier": "prettier --write ./**/*.{html,vue,ts,js,json,md}",'
            ]
        ]);
        const pluginImportStatement = new Map();
        const pluginMap = new Map();
        Object.keys(_plugins).forEach((item)=>{
            if (Array.isArray(_plugins[item].name)) {
                let res = "";
                let stateMent = "";
                _plugins[item].name.forEach((cur, index)=>{
                    res += `"${cur}":"${_plugins[item].version[index]}",`;
                    stateMent += `${_plugins[item].stateMent[index]};`;
                });
                pluginMap.set(item, res);
                pluginImportStatement.set(item, stateMent);
            } else {
                pluginMap.set(item, `"${_plugins[item].name}":"${_plugins[item].version}",`);
                pluginImportStatement.set(item, `${_plugins[item].stateMent};`);
            }
        });
        const useThemeUiMap = [
            "elementPlus",
            "antDesignVue",
            "naiveUI"
        ];
        const notComponentResolverMap = [
            "vuetify",
            "ant-design"
        ];
    },
    "f3c8e5da": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _readline = _interop_require_default._(farmRequire("readline"));
        var _constant = farmRequire("d463d19f");
        function _default(str) {
            if (process.stdout.isTTY) {
                console.log("");
                const cutLine = ` VITE_CLI ${_constant.VITE_CLI_VERSION} `;
                const blank = "\n".repeat(process.stdout.rows);
                console.log(blank);
                _readline.default.cursorTo(process.stdout, 0, 0);
                _readline.default.clearScreenDown(process.stdout);
                console.log("");
            }
        }
    },
    "f44ca176": function(module, exports, farmRequire, dynamicRequire) {
        var fs = farmRequire("fs");
        var polyfills = farmRequire("8bd4f15a");
        var legacy = farmRequire("4d583e4c");
        var clone = farmRequire("0f1bf33e");
        var util = farmRequire("util");
        var gracefulQueue;
        var previousSymbol;
        if (typeof Symbol === "function" && typeof Symbol.for === "function") {
            gracefulQueue = Symbol.for("graceful-fs.queue");
            previousSymbol = Symbol.for("graceful-fs.previous");
        } else {
            gracefulQueue = "___graceful-fs.queue";
            previousSymbol = "___graceful-fs.previous";
        }
        function noop() {}
        function publishQueue(context, queue) {
            Object.defineProperty(context, gracefulQueue, {
                get: function() {
                    return queue;
                }
            });
        }
        var debug = noop;
        if (util.debuglog) debug = util.debuglog("gfs4");
        else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) debug = function() {
            var m = util.format.apply(util, arguments);
            m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
            console.error(m);
        };
        if (!fs[gracefulQueue]) {
            var queue = global[gracefulQueue] || [];
            publishQueue(fs, queue);
            fs.close = function(fs$close) {
                function close(fd, cb) {
                    return fs$close.call(fs, fd, function(err) {
                        if (!err) {
                            resetQueue();
                        }
                        if (typeof cb === "function") cb.apply(this, arguments);
                    });
                }
                Object.defineProperty(close, previousSymbol, {
                    value: fs$close
                });
                return close;
            }(fs.close);
            fs.closeSync = function(fs$closeSync) {
                function closeSync(fd) {
                    fs$closeSync.apply(fs, arguments);
                    resetQueue();
                }
                Object.defineProperty(closeSync, previousSymbol, {
                    value: fs$closeSync
                });
                return closeSync;
            }(fs.closeSync);
            if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
                process.on("exit", function() {
                    debug(fs[gracefulQueue]);
                    farmRequire("assert").equal(fs[gracefulQueue].length, 0);
                });
            }
        }
        if (!global[gracefulQueue]) {
            publishQueue(global, fs[gracefulQueue]);
        }
        module.exports = patch(clone(fs));
        if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
            module.exports = patch(fs);
            fs.__patched = true;
        }
        function patch(fs) {
            polyfills(fs);
            fs.gracefulify = patch;
            fs.createReadStream = createReadStream;
            fs.createWriteStream = createWriteStream;
            var fs$readFile = fs.readFile;
            fs.readFile = readFile;
            function readFile(path, options, cb) {
                if (typeof options === "function") cb = options, options = null;
                return go$readFile(path, options, cb);
                function go$readFile(path, options, cb, startTime) {
                    return fs$readFile(path, options, function(err) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$readFile,
                            [
                                path,
                                options,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (typeof cb === "function") cb.apply(this, arguments);
                        }
                    });
                }
            }
            var fs$writeFile = fs.writeFile;
            fs.writeFile = writeFile;
            function writeFile(path, data, options, cb) {
                if (typeof options === "function") cb = options, options = null;
                return go$writeFile(path, data, options, cb);
                function go$writeFile(path, data, options, cb, startTime) {
                    return fs$writeFile(path, data, options, function(err) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$writeFile,
                            [
                                path,
                                data,
                                options,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (typeof cb === "function") cb.apply(this, arguments);
                        }
                    });
                }
            }
            var fs$appendFile = fs.appendFile;
            if (fs$appendFile) fs.appendFile = appendFile;
            function appendFile(path, data, options, cb) {
                if (typeof options === "function") cb = options, options = null;
                return go$appendFile(path, data, options, cb);
                function go$appendFile(path, data, options, cb, startTime) {
                    return fs$appendFile(path, data, options, function(err) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$appendFile,
                            [
                                path,
                                data,
                                options,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (typeof cb === "function") cb.apply(this, arguments);
                        }
                    });
                }
            }
            var fs$copyFile = fs.copyFile;
            if (fs$copyFile) fs.copyFile = copyFile;
            function copyFile(src, dest, flags, cb) {
                if (typeof flags === "function") {
                    cb = flags;
                    flags = 0;
                }
                return go$copyFile(src, dest, flags, cb);
                function go$copyFile(src, dest, flags, cb, startTime) {
                    return fs$copyFile(src, dest, flags, function(err) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$copyFile,
                            [
                                src,
                                dest,
                                flags,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (typeof cb === "function") cb.apply(this, arguments);
                        }
                    });
                }
            }
            var fs$readdir = fs.readdir;
            fs.readdir = readdir;
            var noReaddirOptionVersions = /^v[0-5]\./;
            function readdir(path, options, cb) {
                if (typeof options === "function") cb = options, options = null;
                var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
                    return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
                } : function go$readdir(path, options, cb, startTime) {
                    return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
                };
                return go$readdir(path, options, cb);
                function fs$readdirCallback(path, options, cb, startTime) {
                    return function(err, files) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$readdir,
                            [
                                path,
                                options,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (files && files.sort) files.sort();
                            if (typeof cb === "function") cb.call(this, err, files);
                        }
                    };
                }
            }
            if (process.version.substr(0, 4) === "v0.8") {
                var legStreams = legacy(fs);
                ReadStream = legStreams.ReadStream;
                WriteStream = legStreams.WriteStream;
            }
            var fs$ReadStream = fs.ReadStream;
            if (fs$ReadStream) {
                ReadStream.prototype = Object.create(fs$ReadStream.prototype);
                ReadStream.prototype.open = ReadStream$open;
            }
            var fs$WriteStream = fs.WriteStream;
            if (fs$WriteStream) {
                WriteStream.prototype = Object.create(fs$WriteStream.prototype);
                WriteStream.prototype.open = WriteStream$open;
            }
            Object.defineProperty(fs, "ReadStream", {
                get: function() {
                    return ReadStream;
                },
                set: function(val) {
                    ReadStream = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(fs, "WriteStream", {
                get: function() {
                    return WriteStream;
                },
                set: function(val) {
                    WriteStream = val;
                },
                enumerable: true,
                configurable: true
            });
            var FileReadStream = ReadStream;
            Object.defineProperty(fs, "FileReadStream", {
                get: function() {
                    return FileReadStream;
                },
                set: function(val) {
                    FileReadStream = val;
                },
                enumerable: true,
                configurable: true
            });
            var FileWriteStream = WriteStream;
            Object.defineProperty(fs, "FileWriteStream", {
                get: function() {
                    return FileWriteStream;
                },
                set: function(val) {
                    FileWriteStream = val;
                },
                enumerable: true,
                configurable: true
            });
            function ReadStream(path, options) {
                if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
                else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
            }
            function ReadStream$open() {
                var that = this;
                open(that.path, that.flags, that.mode, function(err, fd) {
                    if (err) {
                        if (that.autoClose) that.destroy();
                        that.emit("error", err);
                    } else {
                        that.fd = fd;
                        that.emit("open", fd);
                        that.read();
                    }
                });
            }
            function WriteStream(path, options) {
                if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
                else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
            }
            function WriteStream$open() {
                var that = this;
                open(that.path, that.flags, that.mode, function(err, fd) {
                    if (err) {
                        that.destroy();
                        that.emit("error", err);
                    } else {
                        that.fd = fd;
                        that.emit("open", fd);
                    }
                });
            }
            function createReadStream(path, options) {
                return new fs.ReadStream(path, options);
            }
            function createWriteStream(path, options) {
                return new fs.WriteStream(path, options);
            }
            var fs$open = fs.open;
            fs.open = open;
            function open(path, flags, mode, cb) {
                if (typeof mode === "function") cb = mode, mode = null;
                return go$open(path, flags, mode, cb);
                function go$open(path, flags, mode, cb, startTime) {
                    return fs$open(path, flags, mode, function(err, fd) {
                        if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
                            go$open,
                            [
                                path,
                                flags,
                                mode,
                                cb
                            ],
                            err,
                            startTime || Date.now(),
                            Date.now()
                        ]);
                        else {
                            if (typeof cb === "function") cb.apply(this, arguments);
                        }
                    });
                }
            }
            return fs;
        }
        function enqueue(elem) {
            debug("ENQUEUE", elem[0].name, elem[1]);
            fs[gracefulQueue].push(elem);
            retry();
        }
        var retryTimer;
        function resetQueue() {
            var now = Date.now();
            for(var i = 0; i < fs[gracefulQueue].length; ++i){
                if (fs[gracefulQueue][i].length > 2) {
                    fs[gracefulQueue][i][3] = now;
                    fs[gracefulQueue][i][4] = now;
                }
            }
            retry();
        }
        function retry() {
            clearTimeout(retryTimer);
            retryTimer = undefined;
            if (fs[gracefulQueue].length === 0) return;
            var elem = fs[gracefulQueue].shift();
            var fn = elem[0];
            var args = elem[1];
            var err = elem[2];
            var startTime = elem[3];
            var lastTime = elem[4];
            if (startTime === undefined) {
                debug("RETRY", fn.name, args);
                fn.apply(null, args);
            } else if (Date.now() - startTime >= 60000) {
                debug("TIMEOUT", fn.name, args);
                var cb = args.pop();
                if (typeof cb === "function") cb.call(null, err);
            } else {
                var sinceAttempt = Date.now() - lastTime;
                var sinceStart = Math.max(lastTime - startTime, 1);
                var desiredDelay = Math.min(sinceStart * 1.2, 100);
                if (sinceAttempt >= desiredDelay) {
                    debug("RETRY", fn.name, args);
                    fn.apply(null, args.concat([
                        startTime
                    ]));
                } else {
                    fs[gracefulQueue].push(elem);
                }
            }
            if (retryTimer === undefined) {
                retryTimer = setTimeout(retry, 0);
            }
        }
    },
    "f5eeb8b1": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const mimicFn = farmRequire("3c73064d");
        const calledFunctions = new WeakMap();
        const onetime = (function_, options = {})=>{
            if (typeof function_ !== "function") {
                throw new TypeError("Expected a function");
            }
            let returnValue;
            let callCount = 0;
            const functionName = function_.displayName || function_.name || "<anonymous>";
            const onetime = function(...arguments_) {
                calledFunctions.set(onetime, ++callCount);
                if (callCount === 1) {
                    returnValue = function_.apply(this, arguments_);
                    function_ = null;
                } else if (options.throw === true) {
                    throw new Error(`Function \`${functionName}\` can only be called once`);
                }
                return returnValue;
            };
            mimicFn(onetime, function_);
            calledFunctions.set(onetime, callCount);
            return onetime;
        };
        module.exports = onetime;
        module.exports.default = onetime;
        module.exports.callCount = (function_)=>{
            if (!calledFunctions.has(function_)) {
                throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
            }
            return calledFunctions.get(function_);
        };
    },
    "f652b8cf": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "ejsRender", {
            enumerable: true,
            get: function() {
                return ejsRender;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _options = _interop_require_default._(farmRequire("6e240a89"));
        const ejs = farmRequire("8331ec09");
        const fs = farmRequire("0fb9151f");
        const path = farmRequire("path");
        const prettier = farmRequire("prettier");
        async function ejsRender(filePath, name) {
            try {
                let prettierCode;
                const templatePath = path.resolve(__dirname, `../template/${_options.default.frame}`);
                const file = path.parse(filePath);
                const dest = path.resolve(process.cwd(), name);
                const readFilePath = path.resolve(dest, file.dir, `${file.name}.ejs`);
                const outputFilePath = path.resolve(dest, filePath);
                const templateCode = await fs.readFile(readFilePath);
                const code = ejs.render(templateCode.toString(), _options.default);
                const extname = path.extname(filePath).replace(/[.]/g, "");
                const opts = await prettier.resolveConfig(templatePath);
                try {
                    switch(extname){
                        case "ts":
                            prettierCode = prettier.format(code, {
                                parser: "babel",
                                ...opts
                            });
                            break;
                        case "tsx":
                            prettierCode = prettier.format(code, {
                                parser: "babel",
                                ...opts
                            });
                            break;
                        case "jsx":
                            prettierCode = prettier.format(code, {
                                parser: "babel",
                                ...opts
                            });
                            break;
                        case "js":
                            prettierCode = prettier.format(code, {
                                parser: "babel",
                                ...opts
                            });
                            break;
                        case "":
                            prettierCode = code;
                            break;
                        default:
                            prettierCode = prettier.format(code, {
                                parser: extname
                            });
                            break;
                    }
                } catch (err) {
                    console.log(err);
                }
                await fs.outputFile(outputFilePath, prettierCode);
                await fs.remove(readFilePath);
            } catch (error) {
                console.log(error);
            }
        }
    },
    "f85a83b4": function(module, exports, farmRequire, dynamicRequire) {
        var clone = function() {
            "use strict";
            function clone(parent, circular, depth, prototype) {
                var filter;
                if (typeof circular === "object") {
                    depth = circular.depth;
                    prototype = circular.prototype;
                    filter = circular.filter;
                    circular = circular.circular;
                }
                var allParents = [];
                var allChildren = [];
                var useBuffer = typeof Buffer != "undefined";
                if (typeof circular == "undefined") circular = true;
                if (typeof depth == "undefined") depth = Infinity;
                function _clone(parent, depth) {
                    if (parent === null) return null;
                    if (depth == 0) return parent;
                    var child;
                    var proto;
                    if (typeof parent != "object") {
                        return parent;
                    }
                    if (clone.__isArray(parent)) {
                        child = [];
                    } else if (clone.__isRegExp(parent)) {
                        child = new RegExp(parent.source, __getRegExpFlags(parent));
                        if (parent.lastIndex) child.lastIndex = parent.lastIndex;
                    } else if (clone.__isDate(parent)) {
                        child = new Date(parent.getTime());
                    } else if (useBuffer && Buffer.isBuffer(parent)) {
                        if (Buffer.allocUnsafe) {
                            child = Buffer.allocUnsafe(parent.length);
                        } else {
                            child = new Buffer(parent.length);
                        }
                        parent.copy(child);
                        return child;
                    } else {
                        if (typeof prototype == "undefined") {
                            proto = Object.getPrototypeOf(parent);
                            child = Object.create(proto);
                        } else {
                            child = Object.create(prototype);
                            proto = prototype;
                        }
                    }
                    if (circular) {
                        var index = allParents.indexOf(parent);
                        if (index != -1) {
                            return allChildren[index];
                        }
                        allParents.push(parent);
                        allChildren.push(child);
                    }
                    for(var i in parent){
                        var attrs;
                        if (proto) {
                            attrs = Object.getOwnPropertyDescriptor(proto, i);
                        }
                        if (attrs && attrs.set == null) {
                            continue;
                        }
                        child[i] = _clone(parent[i], depth - 1);
                    }
                    return child;
                }
                return _clone(parent, depth);
            }
            clone.clonePrototype = function clonePrototype(parent) {
                if (parent === null) return null;
                var c = function() {};
                c.prototype = parent;
                return new c();
            };
            function __objToStr(o) {
                return Object.prototype.toString.call(o);
            }
            ;
            clone.__objToStr = __objToStr;
            function __isDate(o) {
                return typeof o === "object" && __objToStr(o) === "[object Date]";
            }
            ;
            clone.__isDate = __isDate;
            function __isArray(o) {
                return typeof o === "object" && __objToStr(o) === "[object Array]";
            }
            ;
            clone.__isArray = __isArray;
            function __isRegExp(o) {
                return typeof o === "object" && __objToStr(o) === "[object RegExp]";
            }
            ;
            clone.__isRegExp = __isRegExp;
            function __getRegExpFlags(re) {
                var flags = "";
                if (re.global) flags += "g";
                if (re.ignoreCase) flags += "i";
                if (re.multiline) flags += "m";
                return flags;
            }
            ;
            clone.__getRegExpFlags = __getRegExpFlags;
            return clone;
        }();
        if (typeof module === "object" && module.exports) {
            module.exports = clone;
        }
    },
    "f95e1e17": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const DatePart = farmRequire("c2b497c8");
        class Hours extends DatePart {
            constructor(opts = {}){
                super(opts);
            }
            up() {
                this.date.setHours(this.date.getHours() + 1);
            }
            down() {
                this.date.setHours(this.date.getHours() - 1);
            }
            setTo(val) {
                this.date.setHours(parseInt(val.substr(-2)));
            }
            toString() {
                let hours = this.date.getHours();
                if (/h/.test(this.token)) hours = hours % 12 || 12;
                return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
            }
        }
        module.exports = Hours;
    },
    "f9bb4f26": function(module, exports, farmRequire, dynamicRequire) {
        module.exports = [
            "SIGABRT",
            "SIGALRM",
            "SIGHUP",
            "SIGINT",
            "SIGTERM"
        ];
        if (process.platform !== "win32") {
            module.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
        }
        if (process.platform === "linux") {
            module.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
        }
    },
    "fa2d7524": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return _default;
            }
        });
        var _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
        var _fsextra = _interop_require_default._(farmRequire("0fb9151f"));
        var _nodepath = _interop_require_default._(farmRequire("node:path"));
        function _default(name) {
            const targetDir = _nodepath.default.resolve(process.cwd(), name);
            if (!_fsextra.default.existsSync(targetDir)) {
                return true;
            }
            const files = _fsextra.default.readdirSync(targetDir);
            return files.length === 0 || files.length === 1 && files[0] === ".git";
        }
    },
    "faa000f8": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("37a73412");
        const _require = farmRequire("232af10c"), style = _require.style, clear = _require.clear;
        const _require2 = farmRequire("84d4236d"), erase = _require2.erase, cursor = _require2.cursor;
        class ConfirmPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.msg = opts.message;
                this.value = opts.initial;
                this.initialValue = !!opts.initial;
                this.yesMsg = opts.yes || "yes";
                this.yesOption = opts.yesOption || "(Y/n)";
                this.noMsg = opts.no || "no";
                this.noOption = opts.noOption || "(y/N)";
                this.render();
            }
            reset() {
                this.value = this.initialValue;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                this.done = this.aborted = true;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            submit() {
                this.value = this.value || false;
                this.done = true;
                this.aborted = false;
                this.fire();
                this.render();
                this.out.write("\n");
                this.close();
            }
            _(c, key) {
                if (c.toLowerCase() === "y") {
                    this.value = true;
                    return this.submit();
                }
                if (c.toLowerCase() === "n") {
                    this.value = false;
                    return this.submit();
                }
                return this.bell();
            }
            render() {
                if (this.closed) return;
                if (this.firstRender) this.out.write(cursor.hide);
                else this.out.write(clear(this.outputText, this.out.columns));
                super.render();
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
                ].join(" ");
                this.out.write(erase.line + cursor.to(0) + this.outputText);
            }
        }
        module.exports = ConfirmPrompt;
    },
    "fbb62511": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const { FORCE_COLOR , NODE_DISABLE_COLORS , TERM  } = process.env;
        const $ = {
            enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
            reset: init(0, 0),
            bold: init(1, 22),
            dim: init(2, 22),
            italic: init(3, 23),
            underline: init(4, 24),
            inverse: init(7, 27),
            hidden: init(8, 28),
            strikethrough: init(9, 29),
            black: init(30, 39),
            red: init(31, 39),
            green: init(32, 39),
            yellow: init(33, 39),
            blue: init(34, 39),
            magenta: init(35, 39),
            cyan: init(36, 39),
            white: init(37, 39),
            gray: init(90, 39),
            grey: init(90, 39),
            bgBlack: init(40, 49),
            bgRed: init(41, 49),
            bgGreen: init(42, 49),
            bgYellow: init(43, 49),
            bgBlue: init(44, 49),
            bgMagenta: init(45, 49),
            bgCyan: init(46, 49),
            bgWhite: init(47, 49)
        };
        function run(arr, str) {
            let i = 0, tmp, beg = "", end = "";
            for(; i < arr.length; i++){
                tmp = arr[i];
                beg += tmp.open;
                end += tmp.close;
                if (str.includes(tmp.close)) {
                    str = str.replace(tmp.rgx, tmp.close + tmp.open);
                }
            }
            return beg + str + end;
        }
        function chain(has, keys) {
            let ctx = {
                has,
                keys
            };
            ctx.reset = $.reset.bind(ctx);
            ctx.bold = $.bold.bind(ctx);
            ctx.dim = $.dim.bind(ctx);
            ctx.italic = $.italic.bind(ctx);
            ctx.underline = $.underline.bind(ctx);
            ctx.inverse = $.inverse.bind(ctx);
            ctx.hidden = $.hidden.bind(ctx);
            ctx.strikethrough = $.strikethrough.bind(ctx);
            ctx.black = $.black.bind(ctx);
            ctx.red = $.red.bind(ctx);
            ctx.green = $.green.bind(ctx);
            ctx.yellow = $.yellow.bind(ctx);
            ctx.blue = $.blue.bind(ctx);
            ctx.magenta = $.magenta.bind(ctx);
            ctx.cyan = $.cyan.bind(ctx);
            ctx.white = $.white.bind(ctx);
            ctx.gray = $.gray.bind(ctx);
            ctx.grey = $.grey.bind(ctx);
            ctx.bgBlack = $.bgBlack.bind(ctx);
            ctx.bgRed = $.bgRed.bind(ctx);
            ctx.bgGreen = $.bgGreen.bind(ctx);
            ctx.bgYellow = $.bgYellow.bind(ctx);
            ctx.bgBlue = $.bgBlue.bind(ctx);
            ctx.bgMagenta = $.bgMagenta.bind(ctx);
            ctx.bgCyan = $.bgCyan.bind(ctx);
            ctx.bgWhite = $.bgWhite.bind(ctx);
            return ctx;
        }
        function init(open, close) {
            let blk = {
                open: `\x1b[${open}m`,
                close: `\x1b[${close}m`,
                rgx: new RegExp(`\\x1b\\[${close}m`, "g")
            };
            return function(txt) {
                if (this !== void 0 && this.has !== void 0) {
                    this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
                    return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
                }
                return txt === void 0 ? chain([
                    open
                ], [
                    blk
                ]) : $.enabled ? run([
                    blk
                ], txt + "") : txt + "";
            };
        }
        module.exports = $;
    },
    "fc84809c": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = Transform;
        var _require$codes = farmRequire("1c800b7b").codes, ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED, ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK, ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING, ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
        var Duplex = farmRequire("24f368d5");
        farmRequire("6e507463")(Transform, Duplex);
        function afterTransform(er, data) {
            var ts = this._transformState;
            ts.transforming = false;
            var cb = ts.writecb;
            if (cb === null) {
                return this.emit("error", new ERR_MULTIPLE_CALLBACK());
            }
            ts.writechunk = null;
            ts.writecb = null;
            if (data != null) this.push(data);
            cb(er);
            var rs = this._readableState;
            rs.reading = false;
            if (rs.needReadable || rs.length < rs.highWaterMark) {
                this._read(rs.highWaterMark);
            }
        }
        function Transform(options) {
            if (!(this instanceof Transform)) return new Transform(options);
            Duplex.call(this, options);
            this._transformState = {
                afterTransform: afterTransform.bind(this),
                needTransform: false,
                transforming: false,
                writecb: null,
                writechunk: null,
                writeencoding: null
            };
            this._readableState.needReadable = true;
            this._readableState.sync = false;
            if (options) {
                if (typeof options.transform === "function") this._transform = options.transform;
                if (typeof options.flush === "function") this._flush = options.flush;
            }
            this.on("prefinish", prefinish);
        }
        function prefinish() {
            var _this = this;
            if (typeof this._flush === "function" && !this._readableState.destroyed) {
                this._flush(function(er, data) {
                    done(_this, er, data);
                });
            } else {
                done(this, null, null);
            }
        }
        Transform.prototype.push = function(chunk, encoding) {
            this._transformState.needTransform = false;
            return Duplex.prototype.push.call(this, chunk, encoding);
        };
        Transform.prototype._transform = function(chunk, encoding, cb) {
            cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
        };
        Transform.prototype._write = function(chunk, encoding, cb) {
            var ts = this._transformState;
            ts.writecb = cb;
            ts.writechunk = chunk;
            ts.writeencoding = encoding;
            if (!ts.transforming) {
                var rs = this._readableState;
                if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
            }
        };
        Transform.prototype._read = function(n) {
            var ts = this._transformState;
            if (ts.writechunk !== null && !ts.transforming) {
                ts.transforming = true;
                this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
            } else {
                ts.needTransform = true;
            }
        };
        Transform.prototype._destroy = function(err, cb) {
            Duplex.prototype._destroy.call(this, err, function(err2) {
                cb(err2);
            });
        };
        function done(stream, er, data) {
            if (er) return stream.emit("error", er);
            if (data != null) stream.push(data);
            if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
            if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
            return stream.push(null);
        }
    },
    "fe034919": function(module, exports, farmRequire, dynamicRequire) {
        const color = farmRequire("fbb62511");
        const Prompt = farmRequire("417025f1");
        const { cursor , erase  } = farmRequire("84d4236d");
        const { style , figures , clear , lines  } = farmRequire("b8d8683f");
        const isNumber = /[0-9]/;
        const isDef = (any)=>any !== undefined;
        const round = (number, precision)=>{
            let factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        };
        class NumberPrompt extends Prompt {
            constructor(opts = {}){
                super(opts);
                this.transform = style.render(opts.style);
                this.msg = opts.message;
                this.initial = isDef(opts.initial) ? opts.initial : "";
                this.float = !!opts.float;
                this.round = opts.round || 2;
                this.inc = opts.increment || 1;
                this.min = isDef(opts.min) ? opts.min : -Infinity;
                this.max = isDef(opts.max) ? opts.max : Infinity;
                this.errorMsg = opts.error || `Please Enter A Valid Value`;
                this.validator = opts.validate || (()=>true);
                this.color = `cyan`;
                this.value = ``;
                this.typed = ``;
                this.lastHit = 0;
                this.render();
            }
            set value(v) {
                if (!v && v !== 0) {
                    this.placeholder = true;
                    this.rendered = color.gray(this.transform.render(`${this.initial}`));
                    this._value = ``;
                } else {
                    this.placeholder = false;
                    this.rendered = this.transform.render(`${round(v, this.round)}`);
                    this._value = round(v, this.round);
                }
                this.fire();
            }
            get value() {
                return this._value;
            }
            parse(x) {
                return this.float ? parseFloat(x) : parseInt(x);
            }
            valid(c) {
                return c === `-` || c === `.` && this.float || isNumber.test(c);
            }
            reset() {
                this.typed = ``;
                this.value = ``;
                this.fire();
                this.render();
            }
            exit() {
                this.abort();
            }
            abort() {
                let x = this.value;
                this.value = x !== `` ? x : this.initial;
                this.done = this.aborted = true;
                this.error = false;
                this.fire();
                this.render();
                this.out.write(`\n`);
                this.close();
            }
            async validate() {
                let valid = await this.validator(this.value);
                if (typeof valid === `string`) {
                    this.errorMsg = valid;
                    valid = false;
                }
                this.error = !valid;
            }
            async submit() {
                await this.validate();
                if (this.error) {
                    this.color = `red`;
                    this.fire();
                    this.render();
                    return;
                }
                let x = this.value;
                this.value = x !== `` ? x : this.initial;
                this.done = true;
                this.aborted = false;
                this.error = false;
                this.fire();
                this.render();
                this.out.write(`\n`);
                this.close();
            }
            up() {
                this.typed = ``;
                if (this.value === "") {
                    this.value = this.min - this.inc;
                }
                if (this.value >= this.max) return this.bell();
                this.value += this.inc;
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            down() {
                this.typed = ``;
                if (this.value === "") {
                    this.value = this.min + this.inc;
                }
                if (this.value <= this.min) return this.bell();
                this.value -= this.inc;
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            delete() {
                let val = this.value.toString();
                if (val.length === 0) return this.bell();
                this.value = this.parse(val = val.slice(0, -1)) || ``;
                if (this.value !== "" && this.value < this.min) {
                    this.value = this.min;
                }
                this.color = `cyan`;
                this.fire();
                this.render();
            }
            next() {
                this.value = this.initial;
                this.fire();
                this.render();
            }
            _(c, key) {
                if (!this.valid(c)) return this.bell();
                const now = Date.now();
                if (now - this.lastHit > 1000) this.typed = ``;
                this.typed += c;
                this.lastHit = now;
                this.color = `cyan`;
                if (c === `.`) return this.fire();
                this.value = Math.min(this.parse(this.typed), this.max);
                if (this.value > this.max) this.value = this.max;
                if (this.value < this.min) this.value = this.min;
                this.fire();
                this.render();
            }
            render() {
                if (this.closed) return;
                if (!this.firstRender) {
                    if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
                    this.out.write(clear(this.outputText, this.out.columns));
                }
                super.render();
                this.outputError = "";
                this.outputText = [
                    style.symbol(this.done, this.aborted),
                    color.bold(this.msg),
                    style.delimiter(this.done),
                    !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
                ].join(` `);
                if (this.error) {
                    this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i)=>a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
                }
                this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
            }
        }
        module.exports = NumberPrompt;
    },
    "fe0770d6": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        const { stringify  } = farmRequire("01e04666");
        const { outputFileSync  } = farmRequire("4f54265c");
        function outputJsonSync(file, data, options) {
            const str = stringify(data, options);
            outputFileSync(file, str, options);
        }
        module.exports = outputJsonSync;
    },
    "ff8e1cee": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (cursor, total, maxVisible)=>{
            maxVisible = maxVisible || total;
            let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
            if (startIndex < 0) startIndex = 0;
            let endIndex = Math.min(startIndex + maxVisible, total);
            return {
                startIndex,
                endIndex
            };
        };
    },
    "ffe8e4f2": function(module, exports, farmRequire, dynamicRequire) {
        "use strict";
        module.exports = (key, isSelect)=>{
            if (key.meta && key.name !== "escape") return;
            if (key.ctrl) {
                if (key.name === "a") return "first";
                if (key.name === "c") return "abort";
                if (key.name === "d") return "abort";
                if (key.name === "e") return "last";
                if (key.name === "g") return "reset";
            }
            if (isSelect) {
                if (key.name === "j") return "down";
                if (key.name === "k") return "up";
            }
            if (key.name === "return") return "submit";
            if (key.name === "enter") return "submit";
            if (key.name === "backspace") return "delete";
            if (key.name === "delete") return "deleteForward";
            if (key.name === "abort") return "abort";
            if (key.name === "escape") return "exit";
            if (key.name === "tab") return "next";
            if (key.name === "pagedown") return "nextPage";
            if (key.name === "pageup") return "prevPage";
            if (key.name === "home") return "home";
            if (key.name === "end") return "end";
            if (key.name === "up") return "up";
            if (key.name === "down") return "down";
            if (key.name === "right") return "right";
            if (key.name === "left") return "left";
            return false;
        };
    }
});
var __farm_global_this__ = globalThis || window || global || self;
var farmModuleSystem = __farm_global_this__.__farm_module_system__;
farmModuleSystem.bootstrap();
var entry = farmModuleSystem.require("953dfae2");
