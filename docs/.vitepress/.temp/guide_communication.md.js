import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer'
import { useSSRContext } from 'vue'
import { _ as _export_sfc } from './_plugin-vue_export-helper.9d74fd37.js'
const __pageData = JSON.parse(
  '{"title":"\u65E0\u754C\u63D0\u4F9B\u4E09\u79CD\u65B9\u5F0F\u8FDB\u884C\u901A\u4FE1","description":"","frontmatter":{},"headers":[{"level":2,"title":"props \u901A\u4FE1","slug":"props-\u901A\u4FE1"},{"level":2,"title":"window \u901A\u4FE1","slug":"window-\u901A\u4FE1"},{"level":2,"title":"eventBus \u901A\u4FE1","slug":"eventbus-\u901A\u4FE1"}],"relativePath":"guide/communication.md"}'
)
const _sfc_main = { name: 'guide/communication.md' }
function _sfc_ssrRender(
  _ctx,
  _push,
  _parent,
  _attrs,
  $props,
  $setup,
  $data,
  $options
) {
  _push(`<div${ssrRenderAttrs(
    _attrs
  )}><h1 id="\u65E0\u754C\u63D0\u4F9B\u4E09\u79CD\u65B9\u5F0F\u8FDB\u884C\u901A\u4FE1" tabindex="-1">\u65E0\u754C\u63D0\u4F9B\u4E09\u79CD\u65B9\u5F0F\u8FDB\u884C\u901A\u4FE1 <a class="header-anchor" href="#\u65E0\u754C\u63D0\u4F9B\u4E09\u79CD\u65B9\u5F0F\u8FDB\u884C\u901A\u4FE1" aria-hidden="true">#</a></h1><h2 id="props-\u901A\u4FE1" tabindex="-1">props \u901A\u4FE1 <a class="header-anchor" href="#props-\u901A\u4FE1" aria-hidden="true">#</a></h2><p>\u4E3B\u5E94\u7528\u53EF\u4EE5\u901A\u8FC7<a href="/doc/api/startApp.html#props">props</a>\u6CE8\u5165\u6570\u636E\u548C\u65B9\u6CD5\uFF1A</p><div class="language-vue"><button class="copy"></button><span class="lang">vue</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#A6ACCD' }
  )}">&lt;WujieVue name=&quot;xxx&quot; url=&quot;xxx&quot; :props=&quot;{ data: xxx, methods: xxx }&quot;&gt;&lt;/WujieVue&gt;</span></span>
<span class="line"></span></code></pre></div><p>\u5B50\u5E94\u7528\u53EF\u4EE5\u901A\u8FC7<a href="/doc/api/subApp.html#wujie-props">$wujie</a>\u6765\u83B7\u53D6\uFF1A</p><div class="language-javascript"><button class="copy"></button><span class="lang">javascript</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#C792EA' }
  )}">const</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> props </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">=</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">$wujie</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">?.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">props </span><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// {data: xxx, methods: xxx}</span></span>
<span class="line"></span></code></pre></div><h2 id="window-\u901A\u4FE1" tabindex="-1">window \u901A\u4FE1 <a class="header-anchor" href="#window-\u901A\u4FE1" aria-hidden="true">#</a></h2><p>\u7531\u4E8E\u5B50\u5E94\u7528\u8FD0\u884C\u7684<code>iframe</code>\u7684<code>src</code>\u548C\u4E3B\u5E94\u7528\u662F\u540C\u57DF\u7684\uFF0C\u6240\u4EE5\u76F8\u4E92\u53EF\u4EE5\u76F4\u63A5\u901A\u4FE1</p><p>\u4E3B\u5E94\u7528\u8C03\u7528\u5B50\u5E94\u7528\u7684\u5168\u5C40\u6570\u636E</p><div class="language-javascript"><button class="copy"></button><span class="lang">javascript</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#A6ACCD' }
  )}">window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">document</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">querySelector</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&#39;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">iframe[name=\u5B50\u5E94\u7528id]</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&#39;</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">contentWindow</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">xxx</span></span>
<span class="line"></span></code></pre></div><p>\u5B50\u5E94\u7528\u8C03\u7528\u4E3B\u5E94\u7528\u7684\u5168\u5C40\u6570\u636E</p><div class="language-javascript"><button class="copy"></button><span class="lang">javascript</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#A6ACCD' }
  )}">window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">parent</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">xxx</span></span>
<span class="line"></span></code></pre></div><h2 id="eventbus-\u901A\u4FE1" tabindex="-1">eventBus \u901A\u4FE1 <a class="header-anchor" href="#eventbus-\u901A\u4FE1" aria-hidden="true">#</a></h2><p>\u65E0\u754C\u63D0\u4F9B\u4E00\u5957\u53BB\u4E2D\u5FC3\u5316\u7684\u901A\u4FE1\u65B9\u6848\uFF0C\u4E3B\u5E94\u7528\u548C\u5B50\u5E94\u7528\u3001\u5B50\u5E94\u7528\u548C\u5B50\u5E94\u7528\u90FD\u53EF\u4EE5\u901A\u8FC7\u8FD9\u79CD\u65B9\u5F0F\u65B9\u4FBF\u7684\u8FDB\u884C\u901A\u4FE1\uFF0C \u8BE6\u89C1 <a href="/doc/api/bus.html#bus">api</a></p><p>\u4E3B\u5E94\u7528\u4F7F\u7528\u65B9\u5F0F:</p><div class="language-javascript"><button class="copy"></button><span class="lang">javascript</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#676E95' }
  )}">// \u5982\u679C\u4F7F\u7528wujie</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">import</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{</span><span style="${ssrRenderStyle({
    color: '#F07178'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#F07178'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">from</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">wujie</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u5982\u679C\u4F7F\u7528wujie-vue</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">import</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> WujieVue </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">from</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">wujie-vue</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">const</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> bus </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">=</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> WujieVue</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u5982\u679C\u4F7F\u7528wujie-react</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">import</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> WujieReact </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">from</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">wujie-react</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">const</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> bus </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">=</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> WujieReact</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u4E3B\u5E94\u7528\u76D1\u542C\u4E8B\u4EF6</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$on</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">function</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> ...</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u4E3B\u5E94\u7528\u53D1\u9001\u4E8B\u4EF6</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$emit</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">...</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u4E3B\u5E94\u7528\u53D6\u6D88\u4E8B\u4EF6\u76D1\u542C</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$off</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">function</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> ...</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"></span></code></pre></div><p>\u5B50\u5E94\u7528\u4F7F\u7528\u65B9\u5F0F:</p><div class="language-javascript"><button class="copy"></button><span class="lang">javascript</span><pre><code><span class="line"><span style="${ssrRenderStyle(
    { color: '#676E95' }
  )}">// \u5B50\u5E94\u7528\u76D1\u542C\u4E8B\u4EF6</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">$wujie</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">?.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$on</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">function</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> ...</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u5B50\u5E94\u7528\u53D1\u9001\u4E8B\u4EF6</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">$wujie</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">?.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$emit</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">...</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#676E95'
  })}">// \u5B50\u5E94\u7528\u53D6\u6D88\u4E8B\u4EF6\u76D1\u542C</span></span>
<span class="line"><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">window</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">$wujie</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">?.</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">bus</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">.</span><span style="${ssrRenderStyle({
    color: '#82AAFF'
  })}">$off</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#C3E88D'
  })}">\u4E8B\u4EF6\u540D\u5B57</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">&quot;</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#C792EA'
  })}">function</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">(</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg1</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">arg2</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">,</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> ...</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}"> </span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">{}</span><span style="${ssrRenderStyle({
    color: '#A6ACCD'
  })}">)</span><span style="${ssrRenderStyle({
    color: '#89DDFF'
  })}">;</span></span>
<span class="line"></span></code></pre></div></div>`)
}
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'guide/communication.md'
  )
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}
const communication = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender]
])
export { __pageData, communication as default }
