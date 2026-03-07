const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrdersPage-oi2WUK5f.js","assets/vendor-react-Cf-VQYee.js","assets/vendor-icons-CxqmA_-8.js","assets/vendor-toast-BPyy_sms.js","assets/vendor-socket-CNWsk1Dr.js","assets/OrderDetailPage-DhfxBMAx.js","assets/IncomePage-D584_lu5.js","assets/RoutesAreasPage-BBH1_DHn.js","assets/ProfilePage-CxgB2CzN.js"])))=>i.map(i=>d[i]);
var e=Object.defineProperty;import{r as t,a as n,O as r,N as i,R as s,u as o,B as a,b as l,c,d}from"./vendor-react-Cf-VQYee.js";import{z as u,F as h}from"./vendor-toast-BPyy_sms.js";import{l as p}from"./vendor-socket-CNWsk1Dr.js";import{C as f,R as m,X as g,B as v,a as b,T as y,P as _,b as w,F as x,L as S,I,M as E,U as k,c as T,A as R,S as C,d as j,e as N,f as O,g as A,h as P,i as D,E as L,j as U,k as B,l as F,m as M,Z as z,W as V,n as $,o as W,N as H}from"./vendor-icons-CxqmA_-8.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var q={exports:{}},K={},G=t,J=Symbol.for("react.element"),Y=Symbol.for("react.fragment"),X=Object.prototype.hasOwnProperty,Q=G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Z={key:!0,ref:!0,__self:!0,__source:!0};function ee(e,t,n){var r,i={},s=null,o=null;for(r in void 0!==n&&(s=""+n),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(o=t.ref),t)X.call(t,r)&&!Z.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===i[r]&&(i[r]=t[r]);return{$$typeof:J,type:e,key:s,ref:o,props:i,_owner:Q.current}}K.Fragment=Y,K.jsx=ee,K.jsxs=ee,q.exports=K;var te=q.exports,ne={},re=n;ne.createRoot=re.createRoot,ne.hydrateRoot=re.hydrateRoot;const ie={},se=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),n=(null==e?void 0:e.nonce)||(null==e?void 0:e.getAttribute("nonce"));r=Promise.allSettled(t.map(e=>{if((e=function(e){return"/"+e}(e))in ie)return;ie[e]=!0;const t=e.endsWith(".css"),r=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${r}`))return;const i=document.createElement("link");return i.rel=t?"stylesheet":"modulepreload",t||(i.as="script"),i.crossOrigin="",i.href=e,n&&i.setAttribute("nonce",n),document.head.appendChild(i),t?new Promise((t,n)=>{i.addEventListener("load",t),i.addEventListener("error",()=>n(new Error(`Unable to preload CSS for ${e}`)))}):void 0}))}function i(e){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(const e of t||[])"rejected"===e.status&&i(e.reason);return e().catch(i)})};function oe(e,t){return function(){return e.apply(t,arguments)}}const{toString:ae}=Object.prototype,{getPrototypeOf:le}=Object,{iterator:ce,toStringTag:de}=Symbol,ue=(e=>t=>{const n=ae.call(t);return e[n]||(e[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),he=e=>(e=e.toLowerCase(),t=>ue(t)===e),pe=e=>t=>typeof t===e,{isArray:fe}=Array,me=pe("undefined");function ge(e){return null!==e&&!me(e)&&null!==e.constructor&&!me(e.constructor)&&ye(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}const ve=he("ArrayBuffer"),be=pe("string"),ye=pe("function"),_e=pe("number"),we=e=>null!==e&&"object"==typeof e,xe=e=>{if("object"!==ue(e))return!1;const t=le(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||de in e||ce in e)},Se=he("Date"),Ie=he("File"),Ee=he("Blob"),ke=he("FileList"),Te=he("URLSearchParams"),[Re,Ce,je,Ne]=["ReadableStream","Request","Response","Headers"].map(he);function Oe(e,t,{allOwnKeys:n=!1}={}){if(null==e)return;let r,i;if("object"!=typeof e&&(e=[e]),fe(e))for(r=0,i=e.length;r<i;r++)t.call(null,e[r],r,e);else{if(ge(e))return;const i=n?Object.getOwnPropertyNames(e):Object.keys(e),s=i.length;let o;for(r=0;r<s;r++)o=i[r],t.call(null,e[o],o,e)}}function Ae(e,t){if(ge(e))return null;t=t.toLowerCase();const n=Object.keys(e);let r,i=n.length;for(;i-- >0;)if(r=n[i],t===r.toLowerCase())return r;return null}const Pe="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:global,De=e=>!me(e)&&e!==Pe,Le=(e=>t=>e&&t instanceof e)("undefined"!=typeof Uint8Array&&le(Uint8Array)),Ue=he("HTMLFormElement"),Be=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),Fe=he("RegExp"),Me=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};Oe(n,(n,i)=>{let s;!1!==(s=t(n,i,e))&&(r[i]=s||n)}),Object.defineProperties(e,r)},ze=he("AsyncFunction"),Ve=($e="function"==typeof setImmediate,We=ye(Pe.postMessage),$e?setImmediate:We?(He=`axios@${Math.random()}`,qe=[],Pe.addEventListener("message",({source:e,data:t})=>{e===Pe&&t===He&&qe.length&&qe.shift()()},!1),e=>{qe.push(e),Pe.postMessage(He,"*")}):e=>setTimeout(e));var $e,We,He,qe;const Ke="undefined"!=typeof queueMicrotask?queueMicrotask.bind(Pe):"undefined"!=typeof process&&process.nextTick||Ve,Ge={isArray:fe,isArrayBuffer:ve,isBuffer:ge,isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||ye(e.append)&&("formdata"===(t=ue(e))||"object"===t&&ye(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){let t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&ve(e.buffer),t},isString:be,isNumber:_e,isBoolean:e=>!0===e||!1===e,isObject:we,isPlainObject:xe,isEmptyObject:e=>{if(!we(e)||ge(e))return!1;try{return 0===Object.keys(e).length&&Object.getPrototypeOf(e)===Object.prototype}catch(t){return!1}},isReadableStream:Re,isRequest:Ce,isResponse:je,isHeaders:Ne,isUndefined:me,isDate:Se,isFile:Ie,isBlob:Ee,isRegExp:Fe,isFunction:ye,isStream:e=>we(e)&&ye(e.pipe),isURLSearchParams:Te,isTypedArray:Le,isFileList:ke,forEach:Oe,merge:function e(){const{caseless:t,skipUndefined:n}=De(this)&&this||{},r={},i=(i,s)=>{if("__proto__"===s||"constructor"===s||"prototype"===s)return;const o=t&&Ae(r,s)||s;xe(r[o])&&xe(i)?r[o]=e(r[o],i):xe(i)?r[o]=e({},i):fe(i)?r[o]=i.slice():n&&me(i)||(r[o]=i)};for(let s=0,o=arguments.length;s<o;s++)arguments[s]&&Oe(arguments[s],i);return r},extend:(e,t,n,{allOwnKeys:r}={})=>(Oe(t,(t,r)=>{n&&ye(t)?Object.defineProperty(e,r,{value:oe(t,n),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,r,{value:t,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:r}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),Object.defineProperty(e.prototype,"constructor",{value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},toFlatObject:(e,t,n,r)=>{let i,s,o;const a={};if(t=t||{},null==e)return t;do{for(i=Object.getOwnPropertyNames(e),s=i.length;s-- >0;)o=i[s],r&&!r(o,e,t)||a[o]||(t[o]=e[o],a[o]=!0);e=!1!==n&&le(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:ue,kindOfTest:he,endsWith:(e,t,n)=>{e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return-1!==r&&r===n},toArray:e=>{if(!e)return null;if(fe(e))return e;let t=e.length;if(!_e(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},forEachEntry:(e,t)=>{const n=(e&&e[ce]).call(e);let r;for(;(r=n.next())&&!r.done;){const n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let n;const r=[];for(;null!==(n=e.exec(t));)r.push(n);return r},isHTMLForm:Ue,hasOwnProperty:Be,hasOwnProp:Be,reduceDescriptors:Me,freezeMethods:e=>{Me(e,(t,n)=>{if(ye(e)&&-1!==["arguments","caller","callee"].indexOf(n))return!1;const r=e[n];ye(r)&&(t.enumerable=!1,"writable"in t?t.writable=!1:t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")}))})},toObjectSet:(e,t)=>{const n={},r=e=>{e.forEach(e=>{n[e]=!0})};return fe(e)?r(e):r(String(e).split(t)),n},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,n){return t.toUpperCase()+n}),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e=+e)?e:t,findKey:Ae,global:Pe,isContextDefined:De,isSpecCompliantForm:function(e){return!!(e&&ye(e.append)&&"FormData"===e[de]&&e[ce])},toJSONObject:e=>{const t=new Array(10),n=(e,r)=>{if(we(e)){if(t.indexOf(e)>=0)return;if(ge(e))return e;if(!("toJSON"in e)){t[r]=e;const i=fe(e)?[]:{};return Oe(e,(e,t)=>{const s=n(e,r+1);!me(s)&&(i[t]=s)}),t[r]=void 0,i}}return e};return n(e,0)},isAsyncFn:ze,isThenable:e=>e&&(we(e)||ye(e))&&ye(e.then)&&ye(e.catch),setImmediate:Ve,asap:Ke,isIterable:e=>null!=e&&ye(e[ce])};let Je=class e extends Error{static from(t,n,r,i,s,o){const a=new e(t.message,n||t.code,r,i,s);return a.cause=t,a.name=t.name,o&&Object.assign(a,o),a}constructor(e,t,n,r,i){super(e),this.name="AxiosError",this.isAxiosError=!0,t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),i&&(this.response=i,this.status=i.status)}toJSON(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:Ge.toJSONObject(this.config),code:this.code,status:this.status}}};function Ye(e){return Ge.isPlainObject(e)||Ge.isArray(e)}function Xe(e){return Ge.endsWith(e,"[]")?e.slice(0,-2):e}function Qe(e,t,n){return e?e.concat(t).map(function(e,t){return e=Xe(e),!n&&t?"["+e+"]":e}).join(n?".":""):t}Je.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE",Je.ERR_BAD_OPTION="ERR_BAD_OPTION",Je.ECONNABORTED="ECONNABORTED",Je.ETIMEDOUT="ETIMEDOUT",Je.ERR_NETWORK="ERR_NETWORK",Je.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS",Je.ERR_DEPRECATED="ERR_DEPRECATED",Je.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE",Je.ERR_BAD_REQUEST="ERR_BAD_REQUEST",Je.ERR_CANCELED="ERR_CANCELED",Je.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT",Je.ERR_INVALID_URL="ERR_INVALID_URL";const Ze=Ge.toFlatObject(Ge,{},null,function(e){return/^is[A-Z]/.test(e)});function et(e,t,n){if(!Ge.isObject(e))throw new TypeError("target must be an object");t=t||new FormData;const r=(n=Ge.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(e,t){return!Ge.isUndefined(t[e])})).metaTokens,i=n.visitor||c,s=n.dots,o=n.indexes,a=(n.Blob||"undefined"!=typeof Blob&&Blob)&&Ge.isSpecCompliantForm(t);if(!Ge.isFunction(i))throw new TypeError("visitor must be a function");function l(e){if(null===e)return"";if(Ge.isDate(e))return e.toISOString();if(Ge.isBoolean(e))return e.toString();if(!a&&Ge.isBlob(e))throw new Je("Blob is not supported. Use a Buffer instead.");return Ge.isArrayBuffer(e)||Ge.isTypedArray(e)?a&&"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}function c(e,n,i){let a=e;if(e&&!i&&"object"==typeof e)if(Ge.endsWith(n,"{}"))n=r?n:n.slice(0,-2),e=JSON.stringify(e);else if(Ge.isArray(e)&&function(e){return Ge.isArray(e)&&!e.some(Ye)}(e)||(Ge.isFileList(e)||Ge.endsWith(n,"[]"))&&(a=Ge.toArray(e)))return n=Xe(n),a.forEach(function(e,r){!Ge.isUndefined(e)&&null!==e&&t.append(!0===o?Qe([n],r,s):null===o?n:n+"[]",l(e))}),!1;return!!Ye(e)||(t.append(Qe(i,n,s),l(e)),!1)}const d=[],u=Object.assign(Ze,{defaultVisitor:c,convertValue:l,isVisitable:Ye});if(!Ge.isObject(e))throw new TypeError("data must be an object");return function e(n,r){if(!Ge.isUndefined(n)){if(-1!==d.indexOf(n))throw Error("Circular reference detected in "+r.join("."));d.push(n),Ge.forEach(n,function(n,s){!0===(!(Ge.isUndefined(n)||null===n)&&i.call(t,n,Ge.isString(s)?s.trim():s,r,u))&&e(n,r?r.concat(s):[s])}),d.pop()}}(e),t}function tt(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(e){return t[e]})}function nt(e,t){this._pairs=[],e&&et(e,this,t)}const rt=nt.prototype;function it(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function st(e,t,n){if(!t)return e;const r=n&&n.encode||it,i=Ge.isFunction(n)?{serialize:n}:n,s=i&&i.serialize;let o;if(o=s?s(t,i):Ge.isURLSearchParams(t)?t.toString():new nt(t,i).toString(r),o){const t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+o}return e}rt.append=function(e,t){this._pairs.push([e,t])},rt.toString=function(e){const t=e?function(t){return e.call(this,t,tt)}:tt;return this._pairs.map(function(e){return t(e[0])+"="+t(e[1])},"").join("&")};class ot{constructor(){this.handlers=[]}use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){Ge.forEach(this.handlers,function(t){null!==t&&e(t)})}}const at={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0},lt={isBrowser:!0,classes:{URLSearchParams:"undefined"!=typeof URLSearchParams?URLSearchParams:nt,FormData:"undefined"!=typeof FormData?FormData:null,Blob:"undefined"!=typeof Blob?Blob:null},protocols:["http","https","file","blob","url","data"]},ct="undefined"!=typeof window&&"undefined"!=typeof document,dt="object"==typeof navigator&&navigator||void 0,ut=ct&&(!dt||["ReactNative","NativeScript","NS"].indexOf(dt.product)<0),ht="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,pt=ct&&window.location.href||"http://localhost",ft={...Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:ct,hasStandardBrowserEnv:ut,hasStandardBrowserWebWorkerEnv:ht,navigator:dt,origin:pt},Symbol.toStringTag,{value:"Module"})),...lt};function mt(e){function t(e,n,r,i){let s=e[i++];if("__proto__"===s)return!0;const o=Number.isFinite(+s),a=i>=e.length;return s=!s&&Ge.isArray(r)?r.length:s,a?(Ge.hasOwnProp(r,s)?r[s]=[r[s],n]:r[s]=n,!o):(r[s]&&Ge.isObject(r[s])||(r[s]=[]),t(e,n,r[s],i)&&Ge.isArray(r[s])&&(r[s]=function(e){const t={},n=Object.keys(e);let r;const i=n.length;let s;for(r=0;r<i;r++)s=n[r],t[s]=e[s];return t}(r[s])),!o)}if(Ge.isFormData(e)&&Ge.isFunction(e.entries)){const n={};return Ge.forEachEntry(e,(e,r)=>{t(function(e){return Ge.matchAll(/\w+|\[(\w*)]/g,e).map(e=>"[]"===e[0]?"":e[1]||e[0])}(e),r,n,0)}),n}return null}const gt={transitional:at,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){const n=t.getContentType()||"",r=n.indexOf("application/json")>-1,i=Ge.isObject(e);if(i&&Ge.isHTMLForm(e)&&(e=new FormData(e)),Ge.isFormData(e))return r?JSON.stringify(mt(e)):e;if(Ge.isArrayBuffer(e)||Ge.isBuffer(e)||Ge.isStream(e)||Ge.isFile(e)||Ge.isBlob(e)||Ge.isReadableStream(e))return e;if(Ge.isArrayBufferView(e))return e.buffer;if(Ge.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let s;if(i){if(n.indexOf("application/x-www-form-urlencoded")>-1)return function(e,t){return et(e,new ft.classes.URLSearchParams,{visitor:function(e,t,n,r){return ft.isNode&&Ge.isBuffer(e)?(this.append(t,e.toString("base64")),!1):r.defaultVisitor.apply(this,arguments)},...t})}(e,this.formSerializer).toString();if((s=Ge.isFileList(e))||n.indexOf("multipart/form-data")>-1){const t=this.env&&this.env.FormData;return et(s?{"files[]":e}:e,t&&new t,this.formSerializer)}}return i||r?(t.setContentType("application/json",!1),function(e){if(Ge.isString(e))try{return(0,JSON.parse)(e),Ge.trim(e)}catch(t){if("SyntaxError"!==t.name)throw t}return(0,JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){const t=this.transitional||gt.transitional,n=t&&t.forcedJSONParsing,r="json"===this.responseType;if(Ge.isResponse(e)||Ge.isReadableStream(e))return e;if(e&&Ge.isString(e)&&(n&&!this.responseType||r)){const n=!(t&&t.silentJSONParsing)&&r;try{return JSON.parse(e,this.parseReviver)}catch(i){if(n){if("SyntaxError"===i.name)throw Je.from(i,Je.ERR_BAD_RESPONSE,this,null,this.response);throw i}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ft.classes.FormData,Blob:ft.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};Ge.forEach(["delete","get","head","post","put","patch"],e=>{gt.headers[e]={}});const vt=Ge.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),bt=Symbol("internals");function yt(e){return e&&String(e).trim().toLowerCase()}function _t(e){return!1===e||null==e?e:Ge.isArray(e)?e.map(_t):String(e)}function wt(e,t,n,r,i){return Ge.isFunction(r)?r.call(this,t,n):(i&&(t=n),Ge.isString(t)?Ge.isString(r)?-1!==t.indexOf(r):Ge.isRegExp(r)?r.test(t):void 0:void 0)}let xt=class{constructor(e){e&&this.set(e)}set(e,t,n){const r=this;function i(e,t,n){const i=yt(t);if(!i)throw new Error("header name must be a non-empty string");const s=Ge.findKey(r,i);(!s||void 0===r[s]||!0===n||void 0===n&&!1!==r[s])&&(r[s||t]=_t(e))}const s=(e,t)=>Ge.forEach(e,(e,n)=>i(e,n,t));if(Ge.isPlainObject(e)||e instanceof this.constructor)s(e,t);else if(Ge.isString(e)&&(e=e.trim())&&!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim()))s((e=>{const t={};let n,r,i;return e&&e.split("\n").forEach(function(e){i=e.indexOf(":"),n=e.substring(0,i).trim().toLowerCase(),r=e.substring(i+1).trim(),!n||t[n]&&vt[n]||("set-cookie"===n?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)}),t})(e),t);else if(Ge.isObject(e)&&Ge.isIterable(e)){let n,r,i={};for(const t of e){if(!Ge.isArray(t))throw TypeError("Object iterator must return a key-value pair");i[r=t[0]]=(n=i[r])?Ge.isArray(n)?[...n,t[1]]:[n,t[1]]:t[1]}s(i,t)}else null!=e&&i(t,e,n);return this}get(e,t){if(e=yt(e)){const n=Ge.findKey(this,e);if(n){const e=this[n];if(!t)return e;if(!0===t)return function(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}(e);if(Ge.isFunction(t))return t.call(this,e,n);if(Ge.isRegExp(t))return t.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=yt(e)){const n=Ge.findKey(this,e);return!(!n||void 0===this[n]||t&&!wt(0,this[n],n,t))}return!1}delete(e,t){const n=this;let r=!1;function i(e){if(e=yt(e)){const i=Ge.findKey(n,e);!i||t&&!wt(0,n[i],i,t)||(delete n[i],r=!0)}}return Ge.isArray(e)?e.forEach(i):i(e),r}clear(e){const t=Object.keys(this);let n=t.length,r=!1;for(;n--;){const i=t[n];e&&!wt(0,this[i],i,e,!0)||(delete this[i],r=!0)}return r}normalize(e){const t=this,n={};return Ge.forEach(this,(r,i)=>{const s=Ge.findKey(n,i);if(s)return t[s]=_t(r),void delete t[i];const o=e?function(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,n)=>t.toUpperCase()+n)}(i):String(i).trim();o!==i&&delete t[i],t[o]=_t(r),n[o]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const t=Object.create(null);return Ge.forEach(this,(n,r)=>{null!=n&&!1!==n&&(t[r]=e&&Ge.isArray(n)?n.join(", "):n)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+": "+t).join("\n")}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){const n=new this(e);return t.forEach(e=>n.set(e)),n}static accessor(e){const t=(this[bt]=this[bt]={accessors:{}}).accessors,n=this.prototype;function r(e){const r=yt(e);t[r]||(function(e,t){const n=Ge.toCamelCase(" "+t);["get","set","has"].forEach(r=>{Object.defineProperty(e,r+n,{value:function(e,n,i){return this[r].call(this,t,e,n,i)},configurable:!0})})}(n,e),t[r]=!0)}return Ge.isArray(e)?e.forEach(r):r(e),this}};function St(e,t){const n=this||gt,r=t||n,i=xt.from(r.headers);let s=r.data;return Ge.forEach(e,function(e){s=e.call(n,s,i.normalize(),t?t.status:void 0)}),i.normalize(),s}function It(e){return!(!e||!e.__CANCEL__)}xt.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),Ge.reduceDescriptors(xt.prototype,({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[n]=e}}}),Ge.freezeMethods(xt);let Et=class extends Je{constructor(e,t,n){super(null==e?"canceled":e,Je.ERR_CANCELED,t,n),this.name="CanceledError",this.__CANCEL__=!0}};function kt(e,t,n){const r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new Je("Request failed with status code "+n.status,[Je.ERR_BAD_REQUEST,Je.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}const Tt=(e,t,n=3)=>{let r=0;const i=function(e,t){e=e||10;const n=new Array(e),r=new Array(e);let i,s=0,o=0;return t=void 0!==t?t:1e3,function(a){const l=Date.now(),c=r[o];i||(i=l),n[s]=a,r[s]=l;let d=o,u=0;for(;d!==s;)u+=n[d++],d%=e;if(s=(s+1)%e,s===o&&(o=(o+1)%e),l-i<t)return;const h=c&&l-c;return h?Math.round(1e3*u/h):void 0}}(50,250);return function(n,s){let o,a,l=0,c=1e3/s;const d=(n,s=Date.now())=>{l=s,o=null,a&&(clearTimeout(a),a=null),(n=>{const s=n.loaded,o=n.lengthComputable?n.total:void 0,a=s-r,l=i(a);r=s,e({loaded:s,total:o,progress:o?s/o:void 0,bytes:a,rate:l||void 0,estimated:l&&o&&s<=o?(o-s)/l:void 0,event:n,lengthComputable:null!=o,[t?"download":"upload"]:!0})})(...n)};return[(...e)=>{const t=Date.now(),n=t-l;n>=c?d(e,t):(o=e,a||(a=setTimeout(()=>{a=null,d(o)},c-n)))},()=>o&&d(o)]}(0,n)},Rt=(e,t)=>{const n=null!=e;return[r=>t[0]({lengthComputable:n,total:e,loaded:r}),t[1]]},Ct=e=>(...t)=>Ge.asap(()=>e(...t)),jt=ft.hasStandardBrowserEnv?((e,t)=>n=>(n=new URL(n,ft.origin),e.protocol===n.protocol&&e.host===n.host&&(t||e.port===n.port)))(new URL(ft.origin),ft.navigator&&/(msie|trident)/i.test(ft.navigator.userAgent)):()=>!0,Nt=ft.hasStandardBrowserEnv?{write(e,t,n,r,i,s,o){if("undefined"==typeof document)return;const a=[`${e}=${encodeURIComponent(t)}`];Ge.isNumber(n)&&a.push(`expires=${new Date(n).toUTCString()}`),Ge.isString(r)&&a.push(`path=${r}`),Ge.isString(i)&&a.push(`domain=${i}`),!0===s&&a.push("secure"),Ge.isString(o)&&a.push(`SameSite=${o}`),document.cookie=a.join("; ")},read(e){if("undefined"==typeof document)return null;const t=document.cookie.match(new RegExp("(?:^|; )"+e+"=([^;]*)"));return t?decodeURIComponent(t[1]):null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read:()=>null,remove(){}};function Ot(e,t,n){let r=!("string"==typeof(i=t)&&/^([a-z][a-z\d+\-.]*:)?\/\//i.test(i));var i;return e&&(r||0==n)?function(e,t){return t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t}const At=e=>e instanceof xt?{...e}:e;function Pt(e,t){t=t||{};const n={};function r(e,t,n,r){return Ge.isPlainObject(e)&&Ge.isPlainObject(t)?Ge.merge.call({caseless:r},e,t):Ge.isPlainObject(t)?Ge.merge({},t):Ge.isArray(t)?t.slice():t}function i(e,t,n,i){return Ge.isUndefined(t)?Ge.isUndefined(e)?void 0:r(void 0,e,0,i):r(e,t,0,i)}function s(e,t){if(!Ge.isUndefined(t))return r(void 0,t)}function o(e,t){return Ge.isUndefined(t)?Ge.isUndefined(e)?void 0:r(void 0,e):r(void 0,t)}function a(n,i,s){return s in t?r(n,i):s in e?r(void 0,n):void 0}const l={url:s,method:s,data:s,baseURL:o,transformRequest:o,transformResponse:o,paramsSerializer:o,timeout:o,timeoutMessage:o,withCredentials:o,withXSRFToken:o,adapter:o,responseType:o,xsrfCookieName:o,xsrfHeaderName:o,onUploadProgress:o,onDownloadProgress:o,decompress:o,maxContentLength:o,maxBodyLength:o,beforeRedirect:o,transport:o,httpAgent:o,httpsAgent:o,cancelToken:o,socketPath:o,responseEncoding:o,validateStatus:a,headers:(e,t,n)=>i(At(e),At(t),0,!0)};return Ge.forEach(Object.keys({...e,...t}),function(r){if("__proto__"===r||"constructor"===r||"prototype"===r)return;const s=Ge.hasOwnProp(l,r)?l[r]:i,o=s(e[r],t[r],r);Ge.isUndefined(o)&&s!==a||(n[r]=o)}),n}const Dt=e=>{const t=Pt({},e);let{data:n,withXSRFToken:r,xsrfHeaderName:i,xsrfCookieName:s,headers:o,auth:a}=t;if(t.headers=o=xt.from(o),t.url=st(Ot(t.baseURL,t.url,t.allowAbsoluteUrls),e.params,e.paramsSerializer),a&&o.set("Authorization","Basic "+btoa((a.username||"")+":"+(a.password?unescape(encodeURIComponent(a.password)):""))),Ge.isFormData(n))if(ft.hasStandardBrowserEnv||ft.hasStandardBrowserWebWorkerEnv)o.setContentType(void 0);else if(Ge.isFunction(n.getHeaders)){const e=n.getHeaders(),t=["content-type","content-length"];Object.entries(e).forEach(([e,n])=>{t.includes(e.toLowerCase())&&o.set(e,n)})}if(ft.hasStandardBrowserEnv&&(r&&Ge.isFunction(r)&&(r=r(t)),r||!1!==r&&jt(t.url))){const e=i&&s&&Nt.read(s);e&&o.set(i,e)}return t},Lt="undefined"!=typeof XMLHttpRequest&&function(e){return new Promise(function(t,n){const r=Dt(e);let i=r.data;const s=xt.from(r.headers).normalize();let o,a,l,c,d,{responseType:u,onUploadProgress:h,onDownloadProgress:p}=r;function f(){c&&c(),d&&d(),r.cancelToken&&r.cancelToken.unsubscribe(o),r.signal&&r.signal.removeEventListener("abort",o)}let m=new XMLHttpRequest;function g(){if(!m)return;const r=xt.from("getAllResponseHeaders"in m&&m.getAllResponseHeaders());kt(function(e){t(e),f()},function(e){n(e),f()},{data:u&&"text"!==u&&"json"!==u?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:r,config:e,request:m}),m=null}m.open(r.method.toUpperCase(),r.url,!0),m.timeout=r.timeout,"onloadend"in m?m.onloadend=g:m.onreadystatechange=function(){m&&4===m.readyState&&(0!==m.status||m.responseURL&&0===m.responseURL.indexOf("file:"))&&setTimeout(g)},m.onabort=function(){m&&(n(new Je("Request aborted",Je.ECONNABORTED,e,m)),m=null)},m.onerror=function(t){const r=t&&t.message?t.message:"Network Error",i=new Je(r,Je.ERR_NETWORK,e,m);i.event=t||null,n(i),m=null},m.ontimeout=function(){let t=r.timeout?"timeout of "+r.timeout+"ms exceeded":"timeout exceeded";const i=r.transitional||at;r.timeoutErrorMessage&&(t=r.timeoutErrorMessage),n(new Je(t,i.clarifyTimeoutError?Je.ETIMEDOUT:Je.ECONNABORTED,e,m)),m=null},void 0===i&&s.setContentType(null),"setRequestHeader"in m&&Ge.forEach(s.toJSON(),function(e,t){m.setRequestHeader(t,e)}),Ge.isUndefined(r.withCredentials)||(m.withCredentials=!!r.withCredentials),u&&"json"!==u&&(m.responseType=r.responseType),p&&([l,d]=Tt(p,!0),m.addEventListener("progress",l)),h&&m.upload&&([a,c]=Tt(h),m.upload.addEventListener("progress",a),m.upload.addEventListener("loadend",c)),(r.cancelToken||r.signal)&&(o=t=>{m&&(n(!t||t.type?new Et(null,e,m):t),m.abort(),m=null)},r.cancelToken&&r.cancelToken.subscribe(o),r.signal&&(r.signal.aborted?o():r.signal.addEventListener("abort",o)));const v=function(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}(r.url);v&&-1===ft.protocols.indexOf(v)?n(new Je("Unsupported protocol "+v+":",Je.ERR_BAD_REQUEST,e)):m.send(i||null)})},Ut=(e,t)=>{const{length:n}=e=e?e.filter(Boolean):[];if(t||n){let n,r=new AbortController;const i=function(e){if(!n){n=!0,o();const t=e instanceof Error?e:this.reason;r.abort(t instanceof Je?t:new Et(t instanceof Error?t.message:t))}};let s=t&&setTimeout(()=>{s=null,i(new Je(`timeout of ${t}ms exceeded`,Je.ETIMEDOUT))},t);const o=()=>{e&&(s&&clearTimeout(s),s=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(i):e.removeEventListener("abort",i)}),e=null)};e.forEach(e=>e.addEventListener("abort",i));const{signal:a}=r;return a.unsubscribe=()=>Ge.asap(o),a}},Bt=function*(e,t){let n=e.byteLength;if(n<t)return void(yield e);let r,i=0;for(;i<n;)r=i+t,yield e.slice(i,r),i=r},Ft=(e,t,n,r)=>{const i=async function*(e,t){for await(const n of async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);const t=e.getReader();try{for(;;){const{done:e,value:n}=await t.read();if(e)break;yield n}}finally{await t.cancel()}}(e))yield*Bt(n,t)}(e,t);let s,o=0,a=e=>{s||(s=!0,r&&r(e))};return new ReadableStream({async pull(e){try{const{done:t,value:r}=await i.next();if(t)return a(),void e.close();let s=r.byteLength;if(n){let e=o+=s;n(e)}e.enqueue(new Uint8Array(r))}catch(t){throw a(t),t}},cancel:e=>(a(e),i.return())},{highWaterMark:2})},{isFunction:Mt}=Ge,zt=(({Request:e,Response:t})=>({Request:e,Response:t}))(Ge.global),{ReadableStream:Vt,TextEncoder:$t}=Ge.global,Wt=(e,...t)=>{try{return!!e(...t)}catch(n){return!1}},Ht=e=>{e=Ge.merge.call({skipUndefined:!0},zt,e);const{fetch:t,Request:n,Response:r}=e,i=t?Mt(t):"function"==typeof fetch,s=Mt(n),o=Mt(r);if(!i)return!1;const a=i&&Mt(Vt),l=i&&("function"==typeof $t?(e=>t=>e.encode(t))(new $t):async e=>new Uint8Array(await new n(e).arrayBuffer())),c=s&&a&&Wt(()=>{let e=!1;const t=new n(ft.origin,{body:new Vt,method:"POST",get duplex(){return e=!0,"half"}}).headers.has("Content-Type");return e&&!t}),d=o&&a&&Wt(()=>Ge.isReadableStream(new r("").body)),u={stream:d&&(e=>e.body)};i&&["text","arrayBuffer","blob","formData","stream"].forEach(e=>{!u[e]&&(u[e]=(t,n)=>{let r=t&&t[e];if(r)return r.call(t);throw new Je(`Response type '${e}' is not supported`,Je.ERR_NOT_SUPPORT,n)})});return async e=>{let{url:i,method:o,data:a,signal:h,cancelToken:p,timeout:f,onDownloadProgress:m,onUploadProgress:g,responseType:v,headers:b,withCredentials:y="same-origin",fetchOptions:_}=Dt(e),w=t||fetch;v=v?(v+"").toLowerCase():"text";let x=Ut([h,p&&p.toAbortSignal()],f),S=null;const I=x&&x.unsubscribe&&(()=>{x.unsubscribe()});let E;try{if(g&&c&&"get"!==o&&"head"!==o&&0!==(E=await(async(e,t)=>{const r=Ge.toFiniteNumber(e.getContentLength());return null==r?(async e=>{if(null==e)return 0;if(Ge.isBlob(e))return e.size;if(Ge.isSpecCompliantForm(e)){const t=new n(ft.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return Ge.isArrayBufferView(e)||Ge.isArrayBuffer(e)?e.byteLength:(Ge.isURLSearchParams(e)&&(e+=""),Ge.isString(e)?(await l(e)).byteLength:void 0)})(t):r})(b,a))){let e,t=new n(i,{method:"POST",body:a,duplex:"half"});if(Ge.isFormData(a)&&(e=t.headers.get("content-type"))&&b.setContentType(e),t.body){const[e,n]=Rt(E,Tt(Ct(g)));a=Ft(t.body,65536,e,n)}}Ge.isString(y)||(y=y?"include":"omit");const t=s&&"credentials"in n.prototype,h={..._,signal:x,method:o.toUpperCase(),headers:b.normalize().toJSON(),body:a,duplex:"half",credentials:t?y:void 0};S=s&&new n(i,h);let p=await(s?w(S,_):w(i,h));const f=d&&("stream"===v||"response"===v);if(d&&(m||f&&I)){const e={};["status","statusText","headers"].forEach(t=>{e[t]=p[t]});const t=Ge.toFiniteNumber(p.headers.get("content-length")),[n,i]=m&&Rt(t,Tt(Ct(m),!0))||[];p=new r(Ft(p.body,65536,n,()=>{i&&i(),I&&I()}),e)}v=v||"text";let k=await u[Ge.findKey(u,v)||"text"](p,e);return!f&&I&&I(),await new Promise((t,n)=>{kt(t,n,{data:k,headers:xt.from(p.headers),status:p.status,statusText:p.statusText,config:e,request:S})})}catch(k){if(I&&I(),k&&"TypeError"===k.name&&/Load failed|fetch/i.test(k.message))throw Object.assign(new Je("Network Error",Je.ERR_NETWORK,e,S,k&&k.response),{cause:k.cause||k});throw Je.from(k,k&&k.code,e,S,k&&k.response)}}},qt=new Map,Kt=e=>{let t=e&&e.env||{};const{fetch:n,Request:r,Response:i}=t,s=[r,i,n];let o,a,l=s.length,c=qt;for(;l--;)o=s[l],a=c.get(o),void 0===a&&c.set(o,a=l?new Map:Ht(t)),c=a;return a};Kt();const Gt={http:null,xhr:Lt,fetch:{get:Kt}};Ge.forEach(Gt,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(n){}Object.defineProperty(e,"adapterName",{value:t})}});const Jt=e=>`- ${e}`,Yt=e=>Ge.isFunction(e)||null===e||!1===e,Xt=function(e,t){e=Ge.isArray(e)?e:[e];const{length:n}=e;let r,i;const s={};for(let o=0;o<n;o++){let n;if(r=e[o],i=r,!Yt(r)&&(i=Gt[(n=String(r)).toLowerCase()],void 0===i))throw new Je(`Unknown adapter '${n}'`);if(i&&(Ge.isFunction(i)||(i=i.get(t))))break;s[n||"#"+o]=i}if(!i){const e=Object.entries(s).map(([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build"));let t=n?e.length>1?"since :\n"+e.map(Jt).join("\n"):" "+Jt(e[0]):"as no adapter specified";throw new Je("There is no suitable adapter to dispatch the request "+t,"ERR_NOT_SUPPORT")}return i};function Qt(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new Et(null,e)}function Zt(e){return Qt(e),e.headers=xt.from(e.headers),e.data=St.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),Xt(e.adapter||gt.adapter,e)(e).then(function(t){return Qt(e),t.data=St.call(e,e.transformResponse,t),t.headers=xt.from(t.headers),t},function(t){return It(t)||(Qt(e),t&&t.response&&(t.response.data=St.call(e,e.transformResponse,t.response),t.response.headers=xt.from(t.response.headers))),Promise.reject(t)})}const en="1.13.5",tn={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{tn[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}});const nn={};tn.transitional=function(e,t,n){function r(e,t){return"[Axios v"+en+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return(n,i,s)=>{if(!1===e)throw new Je(r(i," has been removed"+(t?" in "+t:"")),Je.ERR_DEPRECATED);return t&&!nn[i]&&(nn[i]=!0,console.warn(r(i," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,i,s)}},tn.spelling=function(e){return(t,n)=>(console.warn(`${n} is likely a misspelling of ${e}`),!0)};const rn={assertOptions:function(e,t,n){if("object"!=typeof e)throw new Je("options must be an object",Je.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let i=r.length;for(;i-- >0;){const s=r[i],o=t[s];if(o){const t=e[s],n=void 0===t||o(t,s,e);if(!0!==n)throw new Je("option "+s+" must be "+n,Je.ERR_BAD_OPTION_VALUE);continue}if(!0!==n)throw new Je("Unknown option "+s,Je.ERR_BAD_OPTION)}},validators:tn},sn=rn.validators;let on=class{constructor(e){this.defaults=e||{},this.interceptors={request:new ot,response:new ot}}async request(e,t){try{return await this._request(e,t)}catch(n){if(n instanceof Error){let e={};Error.captureStackTrace?Error.captureStackTrace(e):e=new Error;const t=e.stack?e.stack.replace(/^.+\n/,""):"";try{n.stack?t&&!String(n.stack).endsWith(t.replace(/^.+\n.+\n/,""))&&(n.stack+="\n"+t):n.stack=t}catch(r){}}throw n}}_request(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},t=Pt(this.defaults,t);const{transitional:n,paramsSerializer:r,headers:i}=t;void 0!==n&&rn.assertOptions(n,{silentJSONParsing:sn.transitional(sn.boolean),forcedJSONParsing:sn.transitional(sn.boolean),clarifyTimeoutError:sn.transitional(sn.boolean),legacyInterceptorReqResOrdering:sn.transitional(sn.boolean)},!1),null!=r&&(Ge.isFunction(r)?t.paramsSerializer={serialize:r}:rn.assertOptions(r,{encode:sn.function,serialize:sn.function},!0)),void 0!==t.allowAbsoluteUrls||(void 0!==this.defaults.allowAbsoluteUrls?t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:t.allowAbsoluteUrls=!0),rn.assertOptions(t,{baseUrl:sn.spelling("baseURL"),withXsrfToken:sn.spelling("withXSRFToken")},!0),t.method=(t.method||this.defaults.method||"get").toLowerCase();let s=i&&Ge.merge(i.common,i[t.method]);i&&Ge.forEach(["delete","get","head","post","put","patch","common"],e=>{delete i[e]}),t.headers=xt.concat(s,i);const o=[];let a=!0;this.interceptors.request.forEach(function(e){if("function"==typeof e.runWhen&&!1===e.runWhen(t))return;a=a&&e.synchronous;const n=t.transitional||at;n&&n.legacyInterceptorReqResOrdering?o.unshift(e.fulfilled,e.rejected):o.push(e.fulfilled,e.rejected)});const l=[];let c;this.interceptors.response.forEach(function(e){l.push(e.fulfilled,e.rejected)});let d,u=0;if(!a){const e=[Zt.bind(this),void 0];for(e.unshift(...o),e.push(...l),d=e.length,c=Promise.resolve(t);u<d;)c=c.then(e[u++],e[u++]);return c}d=o.length;let h=t;for(;u<d;){const e=o[u++],t=o[u++];try{h=e(h)}catch(p){t.call(this,p);break}}try{c=Zt.call(this,h)}catch(p){return Promise.reject(p)}for(u=0,d=l.length;u<d;)c=c.then(l[u++],l[u++]);return c}getUri(e){return st(Ot((e=Pt(this.defaults,e)).baseURL,e.url,e.allowAbsoluteUrls),e.params,e.paramsSerializer)}};Ge.forEach(["delete","get","head","options"],function(e){on.prototype[e]=function(t,n){return this.request(Pt(n||{},{method:e,url:t,data:(n||{}).data}))}}),Ge.forEach(["post","put","patch"],function(e){function t(t){return function(n,r,i){return this.request(Pt(i||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}on.prototype[e]=t(),on.prototype[e+"Form"]=t(!0)});const an={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(an).forEach(([e,t])=>{an[t]=e});const ln=function e(t){const n=new on(t),r=oe(on.prototype.request,n);return Ge.extend(r,on.prototype,n,{allOwnKeys:!0}),Ge.extend(r,n,null,{allOwnKeys:!0}),r.create=function(n){return e(Pt(t,n))},r}(gt);ln.Axios=on,ln.CanceledError=Et,ln.CancelToken=class e{constructor(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");let t;this.promise=new Promise(function(e){t=e});const n=this;this.promise.then(e=>{if(!n._listeners)return;let t=n._listeners.length;for(;t-- >0;)n._listeners[t](e);n._listeners=null}),this.promise.then=e=>{let t;const r=new Promise(e=>{n.subscribe(e),t=e}).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e(function(e,r,i){n.reason||(n.reason=new Et(e,r,i),t(n.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){const e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let t;return{token:new e(function(e){t=e}),cancel:t}}},ln.isCancel=It,ln.VERSION=en,ln.toFormData=et,ln.AxiosError=Je,ln.Cancel=ln.CanceledError,ln.all=function(e){return Promise.all(e)},ln.spread=function(e){return function(t){return e.apply(null,t)}},ln.isAxiosError=function(e){return Ge.isObject(e)&&!0===e.isAxiosError},ln.mergeConfig=Pt,ln.AxiosHeaders=xt,ln.formToJSON=e=>mt(Ge.isHTMLForm(e)?new FormData(e):e),ln.getAdapter=Xt,ln.HttpStatusCode=an,ln.default=ln;const{Axios:cn,AxiosError:dn,CanceledError:un,isCancel:hn,CancelToken:pn,VERSION:fn,all:mn,Cancel:gn,isAxiosError:vn,spread:bn,toFormData:yn,AxiosHeaders:_n,HttpStatusCode:wn,formToJSON:xn,getAdapter:Sn,mergeConfig:In}=ln,En=[];function kn(e){En.length>=100&&En.shift(),En.push(e)}function Tn(e="App"){function t(t,n,r){const i={ts:(new Date).toISOString(),level:t,module:e,message:n,data:r??null};kn(i),"debug"!==t&&console["error"===t?"error":"warn"===t?"warn":"log"](JSON.stringify(i))}return{debug:(e,n)=>t("debug",e,n),info:(e,n)=>t("info",e,n),warn:(e,n)=>t("warn",e,n),error:(e,n)=>t("error",e,n),action:(t,n)=>{const r={ts:(new Date).toISOString(),level:"action",module:e,event:t,data:n??null};kn(r),JSON.stringify(r)}}}"undefined"!=typeof window&&(window.addEventListener("unhandledrejection",e=>{var t,n;Tn("GlobalError").error("Unhandled promise rejection",{reason:(null==(t=e.reason)?void 0:t.message)||String(e.reason),stack:null==(n=e.reason)?void 0:n.stack})}),window.addEventListener("error",e=>{Tn("GlobalError").error("Uncaught JS error",{message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno})}));const Rn=Tn("API"),Cn="http://localhost:5000/api/v1",jn=new Map,Nn={accept:3e3,deliver:3e3,handover:3e3,cancelDelivery:5e3,goOnline:2e3,goOffline:2e3,takeBreak:2e3,resume:2e3};function On(e){const t=Nn[e];if(!t)return;const n=jn.get(e),r=Date.now();if(n&&r-n<t){const i=Math.ceil((t-(r-n))/1e3);throw new Error(`Action "${e}" rate limited. Wait ${i}s.`)}jn.set(e,r)}const An=ln.create({baseURL:Cn,headers:{"Content-Type":"application/json"}});An.interceptors.request.use(e=>{const t=localStorage.getItem("accessToken");return t&&(e.headers.Authorization=`Bearer ${t}`),e}),An.interceptors.response.use(e=>e,async e=>{var t;const n=e.config;if(401===(null==(t=e.response)?void 0:t.status)&&!n._retry){n._retry=!0;try{const e=localStorage.getItem("refreshToken"),{data:t}=await ln.post(`${Cn}/auth/refresh-token`,{refreshToken:e});return localStorage.setItem("accessToken",t.accessToken),n.headers.Authorization=`Bearer ${t.accessToken}`,An(n)}catch{localStorage.clear(),window.location.href="/login"}}return Promise.reject(e)});const Pn={getById:e=>An.get(`/riders/${e}`),updateProfile:(e,t)=>An.put(`/riders/${e}/profile`,t),submitVehicle:(e,t)=>An.post(`/riders/${e}/vehicle`,t),submitKyc:(e,t)=>An.post(`/riders/${e}/kyc`,t),submitOnboarding:e=>An.post(`/riders/${e}/onboarding`),revokeOnboarding:e=>An.delete(`/riders/${e}/onboarding`),updateOnboarding:(e,t)=>An.put(`/riders/${e}/onboarding`,t),getOnboardingStatus:e=>An.get(`/riders/${e}/onboarding/status`),goOnline:e=>(On("goOnline"),Rn.action("rider_go_online",{id:e}),An.put(`/riders/${e}/online`)),goOffline:e=>(On("goOffline"),Rn.action("rider_go_offline",{id:e}),An.put(`/riders/${e}/offline`)),takeBreak:e=>(On("takeBreak"),Rn.action("rider_take_break",{id:e}),An.put(`/riders/${e}/break`)),resume:e=>(On("resume"),Rn.action("rider_resume",{id:e}),An.put(`/riders/${e}/resume`)),getRoutes:e=>An.get(`/riders/${e}/routes`),addRoute:(e,t)=>An.post(`/riders/${e}/routes`,t),updateRoute:(e,t,n)=>An.put(`/riders/${e}/routes/${t}`,n),deleteRoute:(e,t)=>An.delete(`/riders/${e}/routes/${t}`),getAreas:e=>An.get(`/riders/${e}/areas`),addArea:(e,t)=>An.post(`/riders/${e}/areas`,t),updateArea:(e,t,n)=>An.put(`/riders/${e}/areas/${t}`,n),deleteArea:(e,t)=>An.delete(`/riders/${e}/areas/${t}`),getPerformance:e=>An.get(`/riders/${e}/performance`),completeDelivery:e=>An.put(`/riders/${e}/delivery/complete`),updateBankAccount:(e,t)=>An.put(`/riders/${e}/onboarding`,t)},Dn={getAvailable:()=>An.get("/orders/available"),getMyOrders:()=>An.get("/orders/my-rider-orders"),getById:e=>An.get(`/orders/${e}`),accept:e=>(On("accept"),Rn.action("order_accept",{id:e}),An.put(`/orders/${e}/accept`)),cancelDelivery:(e,t)=>(On("cancelDelivery"),Rn.action("order_cancel",{id:e}),An.put(`/orders/${e}/cancel-delivery`,{reason:t})),handover:(e,t)=>(On("handover"),Rn.action("order_handover",{id:e}),An.post(`/orders/${e}/handover`,{pickupOtp:t})),deliver:(e,t)=>(On("deliver"),Rn.action("order_deliver",{id:e}),An.post(`/orders/${e}/deliver`,{dropOtp:t}))},Ln=(e=30)=>An.get(`/notifications?limit=${e}`),Un={getCommission:()=>An.get("/earnings/commission"),getEarnings:(e,t=50)=>An.get(`/earnings/riders/${e}?limit=${t}`),getSummary:e=>An.get(`/earnings/riders/${e}/summary`),getWithdrawals:e=>An.get(`/earnings/riders/${e}/withdrawals`),initiateWithdrawal:(e,t)=>An.post(`/earnings/riders/${e}/withdrawals`,t)},Bn=()=>An.get("/security-deposit/my"),Fn={getActive:()=>An.get("/service-areas/active"),validate:(e,t,n,r)=>An.get(`/service-areas/validate?pickupLat=${e}&pickupLng=${t}&dropLat=${n}&dropLng=${r}`)},Mn=t.createContext(null);function zn({children:e}){const[n,r]=t.useState(null),[i,s]=t.useState(null),[o,a]=t.useState(null),[l,c]=t.useState(!0),[d,u]=t.useState(()=>localStorage.getItem("accessToken")),h=async e=>{var t;try{const{data:t}=await Pn.getById(e),n=(null==t?void 0:t.data)||t;n&&(localStorage.setItem("rider",JSON.stringify(n)),s(n),a(n.onboardingStatus||"NOT_SUBMITTED"))}catch(n){if(404===(null==(t=n.response)?void 0:t.status))s(null),a("NOT_SUBMITTED");else{const e=localStorage.getItem("rider");if(e){const t=JSON.parse(e);s(t),a(t.onboardingStatus||"NOT_SUBMITTED")}else a("NOT_SUBMITTED")}}};t.useEffect(()=>{const e=localStorage.getItem("accessToken"),t=localStorage.getItem("user"),n=localStorage.getItem("rider");if(e&&t){const e=JSON.parse(t);if(r(e),n){const e=JSON.parse(n);s(e),a(e.onboardingStatus||"NOT_SUBMITTED")}An.get("/auth/check-session").then(({data:t})=>{if(t.valid)return h(e.uid);f()}).catch(f).finally(()=>c(!1))}else c(!1)},[]);const p=t.useCallback(e=>{localStorage.setItem("rider",JSON.stringify(e)),s(e),a(e.onboardingStatus||"NOT_SUBMITTED")},[]),f=()=>{localStorage.clear(),r(null),s(null),a(null),u(null)},m="APPROVED"===o;return te.jsx(Mn.Provider,{value:{user:n,rider:i,login:async(e,t,n)=>{localStorage.setItem("accessToken",e),localStorage.setItem("refreshToken",t),localStorage.setItem("user",JSON.stringify(n)),u(e),r(n),await h(n.uid)},logout:f,loading:l,updateRider:p,onboardingStatus:o,isApproved:m,refreshOnboardingStatus:async()=>{(null==n?void 0:n.uid)&&await h(n.uid)},accessToken:d},children:e})}const Vn=()=>t.useContext(Mn),$n=Tn("Socket"),Wn=[1e3,2e3,4e3,8e3,16e3,3e4];let Hn=null,qn=null,Kn=null,Gn=0,Jn=null;const Yn=new Set;function Xn(e){Yn.forEach(t=>t(e))}function Qn(){clearInterval(qn),clearTimeout(Kn),qn=null,Kn=null}function Zn(){if(Jn)return;const e=Wn[Math.min(Gn,Wn.length-1)];Gn++,$n.info(`Reconnect scheduled in ${e}ms (attempt ${Gn})`),Jn=setTimeout(()=>{Jn=null,Hn&&!Hn.connected&&($n.info("Attempting reconnect…"),Hn.connect())},e)}function er(){Qn(),Jn&&(clearTimeout(Jn),Jn=null),Hn&&(Hn.removeAllListeners(),Hn.disconnect(),Hn=null,Gn=0),Xn(null),$n.info("Disconnected (explicit)")}function tr(){return Hn}const nr=t.createContext(null),rr={ONBOARDING_SUBMITTED:"📋",ONBOARDING_APPROVED:"🎉",ONBOARDING_REJECTED:"❌",KYC_SUBMITTED:"📄",KYC_APPROVED:"✅",KYC_REJECTED:"❌",ORDER_PLACED:"📦",ORDER_ACCEPTED:"🛵",ORDER_DISPATCHED:"🚀",ORDER_DELIVERED:"✅",ORDER_CANCELLED:"🚫",ORDER_AVAILABLE:"📦",DISPUTE_RAISED:"⚠️",DISPUTE_RESOLVED:"✅",PAYMENT_SUCCESS:"💳",PAYMENT_REFUNDED:"💸",EARNING_CREDITED:"💰"};function ir({children:e,accessToken:n,onOnboardingApproved:r}){const[i,s]=t.useState([]),[o,a]=t.useState(0),[l,c]=t.useState(!1),[d,h]=t.useState(!1),f=t.useRef(null),m=t.useRef(r);t.useEffect(()=>{m.current=r},[r]);const g=t.useCallback(async()=>{if(n){c(!0);try{const{data:e}=await Ln(30);s(e.data||[]),a(e.unseen??0)}catch(e){console.error("[Notif:Rider] fetch failed",e)}finally{c(!1)}}},[n]);t.useEffect(()=>{if(!n)return;er();const e=function(e){return(null==Hn?void 0:Hn.connected)||(Hn&&(Hn.removeAllListeners(),Hn.disconnect(),Hn=null,Qn(),Jn&&(clearTimeout(Jn),Jn=null)),Gn=0,Hn=p("http://localhost:5000",{auth:{token:e},transports:["websocket","polling"],reconnection:!1}),Hn.on("connect",()=>{Gn=0,Jn&&(clearTimeout(Jn),Jn=null),$n.info("Connected",{id:Hn.id}),Qn(),qn=setInterval(()=>{(null==Hn?void 0:Hn.connected)&&(Hn.emit("ping"),Kn=setTimeout(()=>{$n.warn("Heartbeat timeout — connection may be stale")},5e3),Hn.once("pong",()=>{clearTimeout(Kn),Kn=null}))},25e3)}),Hn.on("disconnect",e=>{$n.warn("Disconnected",{reason:e}),Qn(),"io client disconnect"!==e&&Zn()}),Hn.on("connect_error",e=>{$n.warn("Connection error",{message:e.message}),Zn()}),Xn(Hn)),Hn}(n);return f.current=e,e.on("notification:new",e=>{var t;e.id&&(s(t=>[e,...t]),a(e=>e+1)),"ONBOARDING_APPROVED"===e.type&&(null==(t=m.current)||t.call(m));const n=rr[e.type]||"🔔";u(`${n}  ${e.title}\n${e.body}`,{duration:6e3,style:{background:"#131929",color:"#f0f4ff",border:"1px solid rgba(255,255,255,0.1)",fontSize:"13px",maxWidth:"340px",whiteSpace:"pre-line",lineHeight:1.5}})}),e.on("notification:count",({unseen:e})=>{a(e)}),e.on("order:updated",e=>{window.dispatchEvent(new CustomEvent("ws:order:updated",{detail:e}))}),e.on("rider:updated",e=>{window.dispatchEvent(new CustomEvent("ws:rider:updated",{detail:e}))}),n&&(c(!0),Ln(30).then(({data:e})=>{s(e.data||[]),a(e.unseen??0)}).catch(e=>console.error("[Notif:Rider] fetch failed",e)).finally(()=>c(!1))),()=>{e.off("notification:new"),e.off("notification:count"),e.off("order:updated"),e.off("rider:updated")}},[n]),t.useEffect(()=>{n||(er(),s([]),a(0),h(!1))},[n]);const v=t.useCallback(async e=>{try{await(e=>An.put(`/notifications/${e}/seen`))(e),s(t=>t.map(t=>t.id===e?{...t,seen:!0}:t)),a(e=>Math.max(0,e-1))}catch(t){console.error("[Notif:Rider] markSeen failed",t)}},[]),b=t.useCallback(async()=>{try{await An.put("/notifications/seen-all"),s(e=>e.map(e=>({...e,seen:!0}))),a(0)}catch(e){console.error("[Notif:Rider] markAllSeen failed",e)}},[]),y=t.useCallback(()=>h(!0),[]),_=t.useCallback(()=>h(!1),[]);return te.jsx(nr.Provider,{value:{notifications:i,unseenCount:o,loading:l,drawerOpen:d,fetchNotifications:g,markSeen:v,markAllSeen:b,openDrawer:y,closeDrawer:_},children:e})}const sr=()=>{const e=t.useContext(nr);if(!e)throw new Error("useNotifications must be inside NotificationProvider");return e},or=t.createContext(null);function ar({children:e}){const[n,r]=t.useState(()=>localStorage.getItem("theme")||"dark");return t.useEffect(()=>{document.documentElement.setAttribute("data-theme",n),localStorage.setItem("theme",n)},[n]),te.jsx(or.Provider,{value:{theme:n,setTheme:r,toggleTheme:()=>r(e=>"dark"===e?"light":"dark"),isDark:"dark"===n},children:e})}const lr=()=>{const e=t.useContext(or);if(!e)throw new Error("useTheme must be inside ThemeProvider");return e},cr=t.createContext(null),dr={en:{nav_home:"Home",nav_orders:"Orders",nav_income:"Income",nav_routes:"Routes",nav_profile:"Profile",welcome_back:"Welcome back,",availability:"Availability",go_online:"Go Online",go_offline:"Go Offline",take_break:"Break",resume:"Resume",gps_on:"GPS ON",locating:"LOCATING…",visible_to_customers:"You're visible to customers",go_online_to_receive:"Go online to start receiving orders",on_break_paused:"On a break — orders paused",performance:"Performance",available_orders:"Available Orders",no_orders_now:"No orders right now",more_in_orders_tab:"more in Orders tab",no_internet:"📵 No internet — GPS and orders paused",onboarding_pending:"Onboarding Pending",status_label:"Status",orders_label:"Orders",rating_label:"Rating",success_label:"Success",earnings_label:"Earnings",all_time:"All time",reviews:"reviews",rate:"Rate",total:"Total",status_online:"Online",status_offline:"Offline",status_on_break:"On Break",status_busy:"Busy",orders_page:"Orders",my_deliveries:"My Deliveries",placed:"Placed",accepted:"Accepted",dispatched:"Dispatched",delivered:"Delivered",cancelled:"Cancelled",no_orders:"No orders yet",items:"items",item:"item",accept:"Accept",reject:"Reject",pick_up:"Pick Up",deliver:"Deliver",confirm_delivery:"Confirm Delivery",enter_otp:"Enter OTP",enter_otp_desc:"Ask the customer for the delivery OTP",verify:"Verify",order_detail:"Order Detail",customer:"Customer",pickup:"Pickup",delivery:"Delivery",payment:"Payment",cash_on_delivery:"Cash on Delivery",prepaid:"Prepaid",distance:"Distance",earning:"Earning",order_id:"Order ID",placed_at:"Placed At",income:"Income",my_earnings:"My Earnings",today:"Today",this_week:"This Week",this_month:"This Month",all_time_income:"All Time",total_earnings:"Total Earnings",total_deliveries:"Total Deliveries",avg_per_order:"Avg / Order",recent_payouts:"Recent Payouts",no_payouts:"No payouts yet",profile:"Profile",manage_account:"Manage your rider account",edit_profile:"Edit Profile",kyc_status:"KYC Status",onboarding:"Onboarding",vehicle:"Vehicle",reg_number:"Reg. Number",complete_setup:"🚀 Complete Setup",personal_profile:"Personal Profile",name_email_info:"Name, email, and contact info",vehicle_details:"Vehicle Details",vehicle_desc:"Vehicle type and registration number",kyc_documents:"KYC Documents",kyc_desc:"Government ID verification",onboarding_app:"Onboarding Application",onboarding_desc:"Submit for admin review and approval",complete_profile:"Complete Profile",add_vehicle:"Add Vehicle Details",submit_kyc:"Submit KYC",submit_onboarding:"Submit Onboarding Application",resubmit:"Resubmit Application",fully_onboarded:"Fully Onboarded!",approved_msg:"You're approved to accept and deliver orders.",under_review:"⏳ Your application is under review. We'll notify you once approved.",rejected_msg:"✗ Application rejected. Please update your details and resubmit.",payout_account:"Payout Account",no_payout_added:"No payout account added yet",add_payout:"Add Payout Account",sign_out:"Sign Out",first_name:"First Name",last_name:"Last Name",email:"Email",save:"Save",saving:"Saving…",cancel:"Cancel",vehicle_type:"Vehicle Type",vehicle_number:"Vehicle Number",id_proof_type:"ID Proof Type",id_proof_number:"ID Number",aadhaar:"Aadhaar Card",pan:"PAN Card",driving_licence:"Driving Licence",kyc_note:"ℹ️ Documents are reviewed by admin and verified within 24–48 hours.",submitting:"Submitting...",submit_vehicle:"Submit Vehicle",bank:"🏦 Bank",upi:"📱 UPI",account_holder:"Account Holder Name *",account_holder_ph:"As on bank passbook",account_number:"Account Number *",account_number_ph:"e.g. 1234567890",ifsc_code:"IFSC Code *",ifsc_ph:"e.g. SBIN0001234",bank_name:"Bank Name",bank_name_ph:"e.g. State Bank of India",upi_id:"UPI ID *",upi_ph:"e.g. yourname@upi",account_no:"Account No.",verified:"✓ Verified",pending_review:"⏳ Under Review",rejected:"✗ Rejected",not_submitted:"Not Submitted",approved:"✓ Approved",settings:"Settings",theme:"Theme",dark_mode:"Dark Mode",light_mode:"Light Mode",language:"Language",welcome:"Welcome back",enter_phone:"Enter your phone number to receive an OTP",phone_number:"Phone Number",phone_hint:"10-digit numbers get +91 automatically",send_otp:"Send OTP",sending_otp:"Sending OTP...",enter_otp_login:"Enter OTP",sent_to:"Sent to",verify_sign_in:"Verify & Sign In",verifying:"Verifying...",resend_in:"Resend in",resend_otp:"Resend OTP",back:"Back",routes_areas:"Routes & Areas",service_areas:"Service Areas",no_routes:"No routes assigned yet",notifications:"Notifications",no_notifications:"No notifications yet",mark_all_read:"Mark all read",loading:"Loading...",retry:"Retry",refresh:"Refresh",new_badge:"NEW"},hi:{nav_home:"होम",nav_orders:"ऑर्डर",nav_income:"कमाई",nav_routes:"रूट",nav_profile:"प्रोफ़ाइल",welcome_back:"वापसी पर स्वागत,",availability:"उपलब्धता",go_online:"ऑनलाइन जाएं",go_offline:"ऑफलाइन जाएं",take_break:"ब्रेक",resume:"फिर शुरू करें",gps_on:"GPS चालू",locating:"ढूंढ रहा है…",visible_to_customers:"आप ग्राहकों को दिख रहे हैं",go_online_to_receive:"ऑर्डर पाने के लिए ऑनलाइन जाएं",on_break_paused:"ब्रेक पर हैं — ऑर्डर रुके हुए हैं",performance:"प्रदर्शन",available_orders:"उपलब्ध ऑर्डर",no_orders_now:"अभी कोई ऑर्डर नहीं है",more_in_orders_tab:"और ऑर्डर टैब में",no_internet:"📵 इंटरनेट नहीं — GPS और ऑर्डर रुके हैं",onboarding_pending:"ऑनबोर्डिंग बाकी है",status_label:"स्थिति",orders_label:"ऑर्डर",rating_label:"रेटिंग",success_label:"सफलता",earnings_label:"कमाई",all_time:"सभी समय",reviews:"समीक्षाएं",rate:"दर",total:"कुल",status_online:"ऑनलाइन",status_offline:"ऑफलाइन",status_on_break:"ब्रेक पर",status_busy:"व्यस्त",orders_page:"ऑर्डर",my_deliveries:"मेरी डिलीवरी",placed:"रखा गया",accepted:"स्वीकृत",dispatched:"भेजा गया",delivered:"डिलीवर हुआ",cancelled:"रद्द",no_orders:"अभी कोई ऑर्डर नहीं",items:"आइटम",item:"आइटम",accept:"स्वीकार करें",reject:"अस्वीकार करें",pick_up:"उठाएं",deliver:"डिलीवर करें",confirm_delivery:"डिलीवरी कन्फर्म करें",enter_otp:"OTP दर्ज करें",enter_otp_desc:"ग्राहक से डिलीवरी OTP पूछें",verify:"सत्यापित करें",order_detail:"ऑर्डर विवरण",customer:"ग्राहक",pickup:"पिकअप",delivery:"डिलीवरी",payment:"भुगतान",cash_on_delivery:"कैश ऑन डिलीवरी",prepaid:"प्रीपेड",distance:"दूरी",earning:"कमाई",order_id:"ऑर्डर ID",placed_at:"रखा गया",income:"कमाई",my_earnings:"मेरी कमाई",today:"आज",this_week:"इस सप्ताह",this_month:"इस महीने",all_time_income:"सभी समय",total_earnings:"कुल कमाई",total_deliveries:"कुल डिलीवरी",avg_per_order:"औसत / ऑर्डर",recent_payouts:"हाल के भुगतान",no_payouts:"अभी तक कोई भुगतान नहीं",profile:"प्रोफ़ाइल",manage_account:"अपना राइडर अकाउंट मैनेज करें",edit_profile:"प्रोफ़ाइल संपादित करें",kyc_status:"KYC स्थिति",onboarding:"ऑनबोर्डिंग",vehicle:"वाहन",reg_number:"रजि. नंबर",complete_setup:"🚀 सेटअप पूरा करें",personal_profile:"व्यक्तिगत प्रोफ़ाइल",name_email_info:"नाम, ईमेल और संपर्क जानकारी",vehicle_details:"वाहन विवरण",vehicle_desc:"वाहन प्रकार और पंजीकरण संख्या",kyc_documents:"KYC दस्तावेज़",kyc_desc:"सरकारी ID सत्यापन",onboarding_app:"ऑनबोर्डिंग आवेदन",onboarding_desc:"एडमिन समीक्षा और अनुमोदन के लिए जमा करें",complete_profile:"प्रोफ़ाइल पूरी करें",add_vehicle:"वाहन विवरण जोड़ें",submit_kyc:"KYC जमा करें",submit_onboarding:"ऑनबोर्डिंग आवेदन जमा करें",resubmit:"आवेदन दोबारा जमा करें",fully_onboarded:"पूरी तरह ऑनबोर्ड!",approved_msg:"आप ऑर्डर स्वीकार और डिलीवर करने के लिए स्वीकृत हैं।",under_review:"⏳ आपका आवेदन समीक्षा में है। अनुमोदन पर सूचित किया जाएगा।",rejected_msg:"✗ आवेदन अस्वीकृत। कृपया विवरण अपडेट करें और दोबारा जमा करें।",payout_account:"भुगतान खाता",no_payout_added:"अभी तक कोई भुगतान खाता नहीं जोड़ा",add_payout:"भुगतान खाता जोड़ें",sign_out:"साइन आउट",first_name:"पहला नाम",last_name:"अंतिम नाम",email:"ईमेल",save:"सेव करें",saving:"सेव हो रहा है…",cancel:"रद्द करें",vehicle_type:"वाहन प्रकार",vehicle_number:"वाहन नंबर",id_proof_type:"ID प्रूफ प्रकार",id_proof_number:"ID नंबर",aadhaar:"आधार कार्ड",pan:"पैन कार्ड",driving_licence:"ड्राइविंग लाइसेंस",kyc_note:"ℹ️ दस्तावेज़ एडमिन द्वारा समीक्षा किए जाते हैं और 24–48 घंटों में सत्यापित होते हैं।",submitting:"जमा हो रहा है...",submit_vehicle:"वाहन जमा करें",bank:"🏦 बैंक",upi:"📱 UPI",account_holder:"खाताधारक का नाम *",account_holder_ph:"बैंक पासबुक के अनुसार",account_number:"खाता संख्या *",account_number_ph:"जैसे: 1234567890",ifsc_code:"IFSC कोड *",ifsc_ph:"जैसे: SBIN0001234",bank_name:"बैंक का नाम",bank_name_ph:"जैसे: भारतीय स्टेट बैंक",upi_id:"UPI ID *",upi_ph:"जैसे: yourname@upi",account_no:"खाता नंबर",verified:"✓ सत्यापित",pending_review:"⏳ समीक्षाधीन",rejected:"✗ अस्वीकृत",not_submitted:"जमा नहीं किया",approved:"✓ स्वीकृत",settings:"सेटिंग्स",theme:"थीम",dark_mode:"डार्क मोड",light_mode:"लाइट मोड",language:"भाषा",welcome:"वापसी पर स्वागत",enter_phone:"OTP पाने के लिए अपना फ़ोन नंबर दर्ज करें",phone_number:"फ़ोन नंबर",phone_hint:"10 अंकों वाले नंबर को +91 अपने आप मिलता है",send_otp:"OTP भेजें",sending_otp:"OTP भेजा जा रहा है...",enter_otp_login:"OTP दर्ज करें",sent_to:"भेजा गया",verify_sign_in:"सत्यापित करें और साइन इन करें",verifying:"सत्यापित हो रहा है...",resend_in:"दोबारा भेजें",resend_otp:"OTP दोबारा भेजें",back:"वापस",routes_areas:"रूट और क्षेत्र",service_areas:"सेवा क्षेत्र",no_routes:"अभी कोई रूट नहीं दिया गया",notifications:"सूचनाएं",no_notifications:"अभी कोई सूचना नहीं",mark_all_read:"सभी पढ़ा हुआ चिह्नित करें",loading:"लोड हो रहा है...",retry:"फिर कोशिश करें",refresh:"रीफ्रेश",new_badge:"नया"}};function ur({children:e}){const[n,r]=t.useState(()=>localStorage.getItem("lang")||"en");return te.jsx(cr.Provider,{value:{lang:n,setLang:e=>{r(e),localStorage.setItem("lang",e)},t:e=>{var t,r;return(null==(t=dr[n])?void 0:t[e])??(null==(r=dr.en)?void 0:r[e])??e},isHindi:"hi"===n},children:e})}const hr=()=>{const e=t.useContext(cr);if(!e)throw new Error("useLang must be inside LangProvider");return e},pr={ONBOARDING_SUBMITTED:{Icon:x,color:"#4B9EFF",bg:"rgba(75,158,255,0.12)",tag:"Onboarding"},ONBOARDING_APPROVED:{Icon:v,color:"#2ECC71",bg:"rgba(46,204,113,0.12)",tag:"Onboarding"},ONBOARDING_REJECTED:{Icon:v,color:"#FF4757",bg:"rgba(255,71,87,0.12)",tag:"Onboarding"},KYC_SUBMITTED:{Icon:x,color:"#4B9EFF",bg:"rgba(75,158,255,0.12)",tag:"KYC"},KYC_APPROVED:{Icon:x,color:"#2ECC71",bg:"rgba(46,204,113,0.12)",tag:"KYC"},KYC_REJECTED:{Icon:x,color:"#FF4757",bg:"rgba(255,71,87,0.12)",tag:"KYC"},ORDER_PLACED:{Icon:_,color:"#1EC674",bg:"rgba(30,198,116,0.12)",tag:"Order"},ORDER_ACCEPTED:{Icon:w,color:"#1EC674",bg:"rgba(30,198,116,0.12)",tag:"Order"},ORDER_DISPATCHED:{Icon:w,color:"#FF8C42",bg:"rgba(255,140,66,0.12)",tag:"Order"},ORDER_DELIVERED:{Icon:_,color:"#2ECC71",bg:"rgba(46,204,113,0.12)",tag:"Order"},ORDER_CANCELLED:{Icon:_,color:"#FF4757",bg:"rgba(255,71,87,0.12)",tag:"Order"},ORDER_AVAILABLE:{Icon:_,color:"#1EC674",bg:"rgba(30,198,116,0.12)",tag:"New Order"},DISPUTE_RAISED:{Icon:y,color:"#FF8C42",bg:"rgba(255,140,66,0.12)",tag:"Dispute"},DISPUTE_RESOLVED:{Icon:y,color:"#2ECC71",bg:"rgba(46,204,113,0.12)",tag:"Dispute"},PAYMENT_SUCCESS:{Icon:b,color:"#2ECC71",bg:"rgba(46,204,113,0.12)",tag:"Payment"},PAYMENT_REFUNDED:{Icon:b,color:"#4B9EFF",bg:"rgba(75,158,255,0.12)",tag:"Payment"}},fr={Icon:v,color:"var(--text-2)",bg:"var(--bg-3)",tag:"System"};function mr(e){if(!e)return"";const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const r=Math.floor(n/60);return r<24?`${r}h ago`:`${Math.floor(r/24)}d ago`}function gr(){const{notifications:e,unseenCount:t,loading:n,drawerOpen:r,closeDrawer:i,markSeen:s,markAllSeen:o,fetchNotifications:a}=sr();return r?te.jsxs(te.Fragment,{children:[te.jsx("div",{onClick:i,style:{position:"fixed",inset:0,background:"rgba(5,7,12,0.8)",zIndex:200,backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",animation:"fadeIn 0.18s ease"}}),te.jsxs("div",{style:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,height:"78vh",background:"var(--bg-1)",borderRadius:"22px 22px 0 0",zIndex:201,display:"flex",flexDirection:"column",animation:"sheetUp 0.25s cubic-bezier(0.32, 0, 0.15, 1)",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",border:"1px solid var(--border-bright)",borderBottom:"none"},children:[te.jsx("div",{style:{width:40,height:4,borderRadius:99,background:"var(--bg-4)",margin:"12px auto 0",flexShrink:0}}),te.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px 12px",borderBottom:"1px solid var(--border)",flexShrink:0},children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[te.jsx("div",{style:{fontSize:17,fontWeight:800,color:"var(--text-0)",letterSpacing:"-0.03em"},children:"Notifications"}),t>0&&te.jsx("span",{style:{fontSize:11,fontWeight:800,fontFamily:"var(--font-mono)",background:"var(--red)",color:"#fff",padding:"1px 7px",borderRadius:99},children:t})]}),te.jsxs("div",{style:{display:"flex",gap:8},children:[t>0&&te.jsxs("button",{onClick:o,style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"6px 10px",cursor:"pointer",color:"var(--accent)",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5},children:[te.jsx(f,{size:13})," Mark all read"]}),te.jsx("button",{onClick:a,style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",width:32,height:32,display:"grid",placeItems:"center",cursor:"pointer",color:"var(--text-1)"},children:te.jsx(m,{size:13})}),te.jsx("button",{onClick:i,style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",width:32,height:32,display:"grid",placeItems:"center",cursor:"pointer",color:"var(--text-1)"},children:te.jsx(g,{size:14})})]})]}),te.jsx("div",{style:{flex:1,overflowY:"auto",paddingBottom:16},children:n&&0===e.length?te.jsx("div",{style:{padding:48,textAlign:"center"},children:te.jsx("div",{className:"loader"})}):0===e.length?te.jsxs("div",{style:{padding:48,textAlign:"center",color:"var(--text-2)"},children:[te.jsx("div",{style:{width:52,height:52,borderRadius:"var(--r-lg)",background:"var(--bg-2)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center"},children:te.jsx(v,{size:22,style:{opacity:.3}})}),te.jsx("div",{style:{fontSize:14,fontWeight:600,color:"var(--text-1)",marginBottom:5},children:"All caught up!"}),te.jsx("div",{style:{fontSize:12},children:"No new notifications"})]}):e.map(e=>{const t=pr[e.type]||fr,{Icon:n}=t;return te.jsxs("div",{onClick:()=>!e.seen&&s(e.id),style:{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",gap:12,cursor:e.seen?"default":"pointer",background:e.seen?"transparent":"rgba(30,198,116,0.03)",transition:"background 0.15s ease"},children:[te.jsx("div",{style:{width:38,height:38,borderRadius:"var(--r-md)",background:t.bg,color:t.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:te.jsx(n,{size:16})}),te.jsxs("div",{style:{flex:1,minWidth:0},children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6},children:[te.jsx("span",{style:{fontWeight:e.seen?500:700,fontSize:13,color:"var(--text-0)",lineHeight:1.35},children:e.title}),!e.seen&&te.jsx("div",{style:{width:7,height:7,borderRadius:"50%",background:"var(--accent)",flexShrink:0,marginTop:4}})]}),te.jsx("div",{style:{fontSize:12,color:"var(--text-2)",marginTop:3,lineHeight:1.45},children:e.body}),te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:7},children:[te.jsx("span",{style:{fontSize:10,fontWeight:700,color:t.color,background:t.bg,padding:"2px 8px",borderRadius:99,letterSpacing:"0.03em"},children:t.tag}),te.jsx("span",{style:{fontSize:10,color:"var(--text-2)",fontFamily:"var(--font-mono)"},children:mr(e.createdAt)})]})]})]},e.id)})})]})]}):null}function vr(){var e,t;const{user:n,rider:s}=Vn(),{unseenCount:o,openDrawer:a}=sr(),{t:l}=hr(),c=(null==(e=null==s?void 0:s.firstName)?void 0:e[0])||(null==(t=null==s?void 0:s.name)?void 0:t[0])||"?",d=[{to:"/",icon:S,label:l("nav_home"),exact:!0},{to:"/orders",icon:_,label:l("nav_orders")},{to:"/income",icon:I,label:l("nav_income")},{to:"/routes",icon:E,label:l("nav_routes")},{to:"/profile",icon:k,label:l("nav_profile")}];return te.jsxs("div",{className:"app-shell",children:[te.jsxs("header",{className:"topbar",children:[te.jsx("div",{className:"topbar-logo-mark",children:te.jsx(w,{size:17,strokeWidth:2.5})}),te.jsxs("div",{className:"flex-1",children:[te.jsx("div",{className:"topbar-title",children:"Bhada Rider"}),(null==n?void 0:n.phoneNumber)&&te.jsx("div",{className:"topbar-sub",children:n.phoneNumber})]}),te.jsxs("button",{onClick:a,"aria-label":"Notifications",style:{position:"relative",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--text-1)",transition:"all var(--transition)",marginRight:8},onMouseEnter:e=>{e.currentTarget.style.background="var(--bg-3)",e.currentTarget.style.color="var(--text-0)"},onMouseLeave:e=>{e.currentTarget.style.background="var(--bg-2)",e.currentTarget.style.color="var(--text-1)"},children:[te.jsx(v,{size:17,strokeWidth:2}),o>0&&te.jsx("span",{style:{position:"absolute",top:-4,right:-4,minWidth:17,height:17,borderRadius:99,background:"var(--red)",color:"#fff",fontSize:9,fontWeight:800,display:"grid",placeItems:"center",padding:"0 3px",border:"2px solid var(--bg-1)",fontFamily:"var(--font-mono)"},children:o>9?"9+":o})]}),te.jsx("div",{style:{width:34,height:34,background:"var(--accent-dim)",border:"1.5px solid rgba(30,198,116,0.25)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"var(--accent)",flexShrink:0,letterSpacing:"-0.02em"},children:c.toUpperCase()})]}),te.jsx("main",{className:"page-content",children:te.jsx(r,{})}),te.jsx("nav",{className:"bottom-nav",children:d.map(e=>te.jsx(i,{to:e.to,end:e.exact,className:({isActive:e})=>"nav-item"+(e?" active":""),children:({isActive:t})=>te.jsxs(te.Fragment,{children:[te.jsx(e.icon,{size:21,strokeWidth:t?2.5:1.8}),te.jsx("span",{style:{fontSize:10,fontWeight:t?700:500},children:e.label})]})},e.to))}),te.jsx(gr,{})]})}class br extends s.Component{constructor(t){var n;super(t),((t,n,r)=>{n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[n]=r})(this,"symbol"!=typeof(n="handleRetry")?n+"":n,()=>{this.setState(e=>({hasError:!1,error:null,errorInfo:null,showDetails:!1,retryCount:e.retryCount+1}))}),this.state={hasError:!1,error:null,errorInfo:null,showDetails:!1,retryCount:0}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){this.setState({errorInfo:t});const n=[...En].slice(-20);console.error("[ErrorBoundary] Caught render error:",{error:e.message,stack:e.stack,componentStack:t.componentStack,recentLogs:n})}render(){if(!this.state.hasError)return this.props.children;const{error:e,errorInfo:t,showDetails:n}=this.state;return te.jsxs("div",{style:{minHeight:"100vh",background:"var(--bg-0)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px",fontFamily:"var(--font-body)"},children:[te.jsx("div",{style:{width:72,height:72,borderRadius:"50%",background:"var(--red-dim)",border:"2px solid rgba(255,77,109,0.3)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24},children:te.jsx(y,{size:32,style:{color:"var(--red)"}})}),te.jsx("div",{style:{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,color:"var(--text-0)",textAlign:"center",marginBottom:8,letterSpacing:"-0.02em"},children:"Something went wrong"}),te.jsx("div",{style:{fontSize:14,color:"var(--text-2)",textAlign:"center",lineHeight:1.6,marginBottom:32,maxWidth:300},children:"The app ran into an unexpected error. Your data is safe — try refreshing or reloading."}),te.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300},children:[te.jsxs("button",{onClick:this.handleRetry,className:"btn btn-primary",style:{width:"100%",justifyContent:"center"},children:[te.jsx(m,{size:15})," Try Again"]}),te.jsx("button",{onClick:()=>window.location.reload(),className:"btn btn-secondary",style:{width:"100%",justifyContent:"center"},children:"Reload App"})]}),!1]})}}var yr={};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _r=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},wr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const t=e[i],s=i+1<e.length,o=s?e[i+1]:0,a=i+2<e.length,l=a?e[i+2]:0,c=t>>2,d=(3&t)<<4|o>>4;let u=(15&o)<<2|l>>6,h=63&l;a||(h=64,s||(u=64)),r.push(n[c],n[d],n[u],n[h])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(_r(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=((7&i)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){const t=n[e.charAt(i++)],s=i<e.length?n[e.charAt(i)]:0;++i;const o=i<e.length?n[e.charAt(i)]:64;++i;const a=i<e.length?n[e.charAt(i)]:64;if(++i,null==t||null==s||null==o||null==a)throw new xr;const l=t<<2|s>>4;if(r.push(l),64!==o){const e=s<<4&240|o>>2;if(r.push(e),64!==a){const e=o<<6&192|a;r.push(e)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class xr extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Sr=function(e){return function(e){const t=_r(e);return wr.encodeByteArray(t,!0)}(e).replace(/\./g,"")},Ir=function(e){try{return wr.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null},Er=()=>{try{
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const e=yr.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&Ir(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},kr=()=>{var e;return null===(e=Er())||void 0===e?void 0:e.config},Tr=e=>{var t;return null===(t=Er())||void 0===t?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Rr{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cr(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}class jr extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,jr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Nr.prototype.create)}}class Nr{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],s=i?function(e,t){return e.replace(Or,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new jr(r,o,n)}}const Or=/\{\$([^}]+)}/g;function Ar(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],s=t[i];if(Pr(n)&&Pr(s)){if(!Ar(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function Pr(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dr(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}class Lr{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e){if("object"!=typeof e||null===e)return!1;for(const t of["next","error","complete"])if(t in e&&"function"==typeof e[t])return!0;return!1}(e)?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=Ur),void 0===r.error&&(r.error=Ur),void 0===r.complete&&(r.complete=Ur);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ur(){}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Br(e){return e&&e._delegate?e._delegate:e}class Fr{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mr="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new Rr;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),r=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:Mr})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=Mr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=Mr){return this.instances.has(e)}getOptions(e=Mr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,s]of this.instancesDeferred.entries())n===this.normalizeInstanceIdentifier(i)&&s.resolve(r);return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===Mr?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(i){}var r;return n||null}normalizeInstanceIdentifier(e=Mr){return this.component?this.component.multipleInstances?e:Mr:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class Vr{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new zr(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $r,Wr;(Wr=$r||($r={}))[Wr.DEBUG=0]="DEBUG",Wr[Wr.VERBOSE=1]="VERBOSE",Wr[Wr.INFO=2]="INFO",Wr[Wr.WARN=3]="WARN",Wr[Wr.ERROR=4]="ERROR",Wr[Wr.SILENT=5]="SILENT";const Hr={debug:$r.DEBUG,verbose:$r.VERBOSE,info:$r.INFO,warn:$r.WARN,error:$r.ERROR,silent:$r.SILENT},qr=$r.INFO,Kr={[$r.DEBUG]:"log",[$r.VERBOSE]:"log",[$r.INFO]:"info",[$r.WARN]:"warn",[$r.ERROR]:"error"},Gr=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),i=Kr[t];if(!i)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[i](`[${r}]  ${e.name}:`,...n)};class Jr{constructor(e){this.name=e,this._logLevel=qr,this._logHandler=Gr,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in $r))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?Hr[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,$r.DEBUG,...e),this._logHandler(this,$r.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,$r.VERBOSE,...e),this._logHandler(this,$r.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,$r.INFO,...e),this._logHandler(this,$r.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,$r.WARN,...e),this._logHandler(this,$r.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,$r.ERROR,...e),this._logHandler(this,$r.ERROR,...e)}}let Yr,Xr;const Qr=new WeakMap,Zr=new WeakMap,ei=new WeakMap,ti=new WeakMap,ni=new WeakMap;let ri={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Zr.get(e);if("objectStoreNames"===t)return e.objectStoreNames||ei.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return si(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function ii(e){return"function"==typeof e?(t=e)!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(Xr||(Xr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(oi(this),e),si(Qr.get(this))}:function(...e){return si(t.apply(oi(this),e))}:function(e,...n){const r=t.call(oi(this),e,...n);return ei.set(r,e.sort?e.sort():[e]),si(r)}:(e instanceof IDBTransaction&&function(e){if(Zr.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});Zr.set(e,t)}(e),n=e,(Yr||(Yr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>n instanceof e)?new Proxy(e,ri):e);var t,n}function si(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(si(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&Qr.set(t,e)}).catch(()=>{}),ni.set(t,e),t}(e);if(ti.has(e))return ti.get(e);const t=ii(e);return t!==e&&(ti.set(e,t),ni.set(t,e)),t}const oi=e=>ni.get(e),ai=["get","getKey","getAll","getAllKeys","count"],li=["put","add","delete","clear"],ci=new Map;function di(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ci.get(t))return ci.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=li.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!ai.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&s.done]))[0]};return ci.set(t,s),s}var ui;ui=ri,ri={...ui,get:(e,t,n)=>di(e,t)||ui.get(e,t,n),has:(e,t)=>!!di(e,t)||ui.has(e,t)};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class hi{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const pi="@firebase/app",fi="0.10.13",mi=new Jr("@firebase/app"),gi="@firebase/app-compat",vi="@firebase/analytics-compat",bi="@firebase/analytics",yi="@firebase/app-check-compat",_i="@firebase/app-check",wi="@firebase/auth",xi="@firebase/auth-compat",Si="@firebase/database",Ii="@firebase/data-connect",Ei="@firebase/database-compat",ki="@firebase/functions",Ti="@firebase/functions-compat",Ri="@firebase/installations",Ci="@firebase/installations-compat",ji="@firebase/messaging",Ni="@firebase/messaging-compat",Oi="@firebase/performance",Ai="@firebase/performance-compat",Pi="@firebase/remote-config",Di="@firebase/remote-config-compat",Li="@firebase/storage",Ui="@firebase/storage-compat",Bi="@firebase/firestore",Fi="@firebase/vertexai-preview",Mi="@firebase/firestore-compat",zi="firebase",Vi="[DEFAULT]",$i={[pi]:"fire-core",[gi]:"fire-core-compat",[bi]:"fire-analytics",[vi]:"fire-analytics-compat",[_i]:"fire-app-check",[yi]:"fire-app-check-compat",[wi]:"fire-auth",[xi]:"fire-auth-compat",[Si]:"fire-rtdb",[Ii]:"fire-data-connect",[Ei]:"fire-rtdb-compat",[ki]:"fire-fn",[Ti]:"fire-fn-compat",[Ri]:"fire-iid",[Ci]:"fire-iid-compat",[ji]:"fire-fcm",[Ni]:"fire-fcm-compat",[Oi]:"fire-perf",[Ai]:"fire-perf-compat",[Pi]:"fire-rc",[Di]:"fire-rc-compat",[Li]:"fire-gcs",[Ui]:"fire-gcs-compat",[Bi]:"fire-fst",[Mi]:"fire-fst-compat",[Fi]:"fire-vertex","fire-js":"fire-js",[zi]:"fire-js-all"},Wi=new Map,Hi=new Map,qi=new Map;function Ki(e,t){try{e.container.addComponent(t)}catch(n){mi.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Gi(e){const t=e.name;if(qi.has(t))return mi.debug(`There were multiple attempts to register component ${t}.`),!1;qi.set(t,e);for(const n of Wi.values())Ki(n,e);for(const n of Hi.values())Ki(n,e);return!0}function Ji(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Yi(e){return void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xi=new Nr("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qi{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Fr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Xi.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zi="10.14.1";function es(e,t={}){let n=e;"object"!=typeof t&&(t={name:t});const r=Object.assign({name:Vi,automaticDataCollectionEnabled:!1},t),i=r.name;if("string"!=typeof i||!i)throw Xi.create("bad-app-name",{appName:String(i)});if(n||(n=kr()),!n)throw Xi.create("no-options");const s=Wi.get(i);if(s){if(Ar(n,s.options)&&Ar(r,s.config))return s;throw Xi.create("duplicate-app",{appName:i})}const o=new Vr(i);for(const l of qi.values())o.addComponent(l);const a=new Qi(n,r,o);return Wi.set(i,a),a}function ts(e,t,n){var r;let i=null!==(r=$i[e])&&void 0!==r?r:e;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const e=[`Unable to register library "${i}" with version "${t}":`];return s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void mi.warn(e.join(" "))}Gi(new Fr(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ns="firebase-heartbeat-store";let rs=null;function is(){return rs||(rs=function(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(e,t),a=si(o);return r&&o.addEventListener("upgradeneeded",e=>{r(si(o.result),e.oldVersion,e.newVersion,si(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(ns)}catch(n){console.warn(n)}}}).catch(e=>{throw Xi.create("idb-open",{originalErrorMessage:e.message})})),rs}async function ss(e,t){try{const n=(await is()).transaction(ns,"readwrite"),r=n.objectStore(ns);await r.put(t,os(e)),await n.done}catch(n){if(n instanceof jr)mi.warn(n.message);else{const e=Xi.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});mi.warn(e.message)}}}function os(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new cs(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=ls();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;return this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{const t=new Date(e.date).valueOf();return Date.now()-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache)}catch(n){mi.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=ls(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),ds(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),ds(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),i=Sr(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return mi.warn(t),""}}}function ls(){return(new Date).toISOString().substring(0,10)}class cs{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await is()).transaction(ns),n=await t.objectStore(ns).get(os(e));return await t.done,n}catch(t){if(t instanceof jr)mi.warn(t.message);else{const e=Xi.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});mi.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return ss(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return ss(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function ds(e){return Sr(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}Gi(new Fr("platform-logger",e=>new hi(e),"PRIVATE")),Gi(new Fr("heartbeat",e=>new as(e),"PRIVATE")),ts(pi,fi,""),ts(pi,fi,"esm2017"),ts("fire-js",""),
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
ts("firebase","10.14.1","app"),"function"==typeof SuppressedError&&SuppressedError;const hs=function(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}},ps=new Nr("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),fs=new Jr("@firebase/auth");function ms(e,...t){fs.logLevel<=$r.ERROR&&fs.error(`Auth (${Zi}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gs(e,...t){throw _s(e,...t)}function vs(e,...t){return _s(e,...t)}function bs(e,t,n){const r=Object.assign(Object.assign({},hs()),{[t]:n});return new Nr("auth","Firebase",r).create(t,{appName:e.name})}function ys(e){return bs(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function _s(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return ps.create(e,...t)}function ws(e,t,...n){if(!e)throw _s(t,...n)}function xs(e){const t="INTERNAL ASSERTION FAILED: "+e;throw ms(t),new Error(t)}function Ss(e,t){e||xs(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function Es(){return"http:"===ks()||"https:"===ks()}function ks(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ts{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ss(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Cr())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return"undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&(Es()||function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()||"connection"in navigator)&&!navigator.onLine?Math.min(5e3,this.shortDelay):this.isMobile?this.longDelay:this.shortDelay}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rs(e,t){Ss(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void xs("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void xs("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void xs("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},Ns=new Ts(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Os(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function As(e,t,n,r,i={}){return Ps(e,i,async()=>{let i={},s={};r&&("GET"===t?s=r:i={body:JSON.stringify(r)});const o=Dr(Object.assign({key:e.config.apiKey},s)).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const l=Object.assign({method:t,headers:a},i);return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(l.referrerPolicy="no-referrer"),Cs.fetch()(Ls(e,e.config.apiHost,n,o),l)})}async function Ps(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},js),t);try{const t=new Us(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const s=await i.json();if("needConfirmation"in s)throw Bs(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{const t=i.ok?s.errorMessage:s.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw Bs(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===n)throw Bs(e,"email-already-in-use",s);if("USER_DISABLED"===n)throw Bs(e,"user-disabled",s);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw bs(e,a,o);gs(e,a)}}catch(i){if(i instanceof jr)throw i;gs(e,"network-request-failed",{message:String(i)})}}async function Ds(e,t,n,r,i={}){const s=await As(e,t,n,r,i);return"mfaPendingCredential"in s&&gs(e,"multi-factor-auth-required",{_serverResponse:s}),s}function Ls(e,t,n,r){const i=`${t}${n}?${r}`;return e.config.emulator?Rs(e.config,i):`${e.config.apiScheme}://${i}`}class Us{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(vs(this.auth,"network-request-failed")),Ns.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Bs(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=vs(e,t,r);return i.customData._tokenResponse=n,i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(e){return void 0!==e&&void 0!==e.getResponse}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ms(e,t){return As(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zs(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function Vs(e){return 1e3*Number(e)}function $s(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return ms("JWT malformed, contained fewer than 3 sections"),null;try{const e=Ir(n);return e?JSON.parse(e):(ms("Failed to decode base64 JWT payload"),null)}catch(i){return ms("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function Ws(e){const t=$s(e);return ws(t,"internal-error"),ws(void 0!==t.exp,"internal-error"),ws(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hs(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof jr&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class qs{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=zs(this.lastLoginAt),this.creationTime=zs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gs(e){var t;const n=e.auth,r=await e.getIdToken(),i=await Hs(e,Ms(n,{idToken:r}));ws(null==i?void 0:i.users.length,n,"internal-error");const s=i.users[0];e._notifyReloadListener(s);const o=(null===(t=s.providerUserInfo)||void 0===t?void 0:t.length)?Js(s.providerUserInfo):[],a=(l=e.providerData,c=o,[...l.filter(e=>!c.some(t=>t.providerId===e.providerId)),...c]);var l,c;const d=e.isAnonymous,u=!(e.email&&s.passwordHash||(null==a?void 0:a.length)),h=!!d&&u,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Ks(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(e,p)}function Js(e){return e.map(e=>{var{providerId:t}=e,n=us(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ys{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ws(e.idToken,"internal-error"),ws(void 0!==e.idToken,"internal-error"),ws(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Ws(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ws(0!==e.length,"internal-error");const t=Ws(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(ws(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await async function(e,t){const n=await Ps(e,{},async()=>{const n=Dr({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,s=Ls(e,r,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();return o["Content-Type"]="application/x-www-form-urlencoded",Cs.fetch()(s,{method:"POST",headers:o,body:n})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,s=new Ys;return n&&(ws("string"==typeof n,"internal-error",{appName:e}),s.refreshToken=n),r&&(ws("string"==typeof r,"internal-error",{appName:e}),s.accessToken=r),i&&(ws("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ys,this.toJSON())}_performRefresh(){return xs("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xs(e,t){ws("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Qs{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=us(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new qs(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ks(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Hs(this,this.stsTokenManager.getToken(this.auth,e));return ws(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=Br(e),r=await n.getIdToken(t),i=$s(r);ws(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s="object"==typeof i.firebase?i.firebase:void 0,o=null==s?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:zs(Vs(i.auth_time)),issuedAtTime:zs(Vs(i.iat)),expirationTime:zs(Vs(i.exp)),signInProvider:o||null,signInSecondFactor:(null==s?void 0:s.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=Br(e);await Gs(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(ws(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Qs(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){ws(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Gs(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Yi(this.auth.app))return Promise.reject(ys(this.auth));const e=await this.getIdToken();return await Hs(this,
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){return As(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,s,o,a,l,c;const d=null!==(n=t.displayName)&&void 0!==n?n:void 0,u=null!==(r=t.email)&&void 0!==r?r:void 0,h=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,p=null!==(s=t.photoURL)&&void 0!==s?s:void 0,f=null!==(o=t.tenantId)&&void 0!==o?o:void 0,m=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,g=null!==(l=t.createdAt)&&void 0!==l?l:void 0,v=null!==(c=t.lastLoginAt)&&void 0!==c?c:void 0,{uid:b,emailVerified:y,isAnonymous:_,providerData:w,stsTokenManager:x}=t;ws(b&&x,e,"internal-error");const S=Ys.fromJSON(this.name,x);ws("string"==typeof b,e,"internal-error"),Xs(d,e.name),Xs(u,e.name),ws("boolean"==typeof y,e,"internal-error"),ws("boolean"==typeof _,e,"internal-error"),Xs(h,e.name),Xs(p,e.name),Xs(f,e.name),Xs(m,e.name),Xs(g,e.name),Xs(v,e.name);const I=new Qs({uid:b,auth:e,email:u,emailVerified:y,displayName:d,isAnonymous:_,photoURL:p,phoneNumber:h,tenantId:f,stsTokenManager:S,createdAt:g,lastLoginAt:v});return w&&Array.isArray(w)&&(I.providerData=w.map(e=>Object.assign({},e))),m&&(I._redirectEventId=m),I}static async _fromIdTokenResponse(e,t,n=!1){const r=new Ys;r.updateFromServerResponse(t);const i=new Qs({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Gs(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];ws(void 0!==r.localId,"internal-error");const i=void 0!==r.providerUserInfo?Js(r.providerUserInfo):[],s=!(r.email&&r.passwordHash||(null==i?void 0:i.length)),o=new Ys;o.updateFromIdToken(n);const a=new Qs({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:s}),l={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Ks(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==i?void 0:i.length))};return Object.assign(a,l),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zs=new Map;function eo(e){Ss(e instanceof Function,"Expected a class definition");let t=Zs.get(e);return t?(Ss(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Zs.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}to.type="NONE";const no=to;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ro(e,t,n){return`firebase:${e}:${t}:${n}`}class io{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=ro(this.userKey,r.apiKey,i),this.fullPersistenceKey=ro("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Qs._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new io(eo(no),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let i=r[0]||eo(no);const s=ro(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(s);if(t){const n=Qs._fromJSON(e,t);c!==i&&(o=n),i=c;break}}catch(l){}const a=r.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&a.length?(i=a[0],o&&await i._set(s,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch(l){}})),new io(i,e,n)):new io(i,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(co(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(oo(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(ho(t))return"Blackberry";if(po(t))return"Webos";if(ao(t))return"Safari";if((t.includes("chrome/")||lo(t))&&!t.includes("edge/"))return"Chrome";if(uo(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function oo(e=Cr()){return/firefox\//i.test(e)}function ao(e=Cr()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function lo(e=Cr()){return/crios\//i.test(e)}function co(e=Cr()){return/iemobile/i.test(e)}function uo(e=Cr()){return/android/i.test(e)}function ho(e=Cr()){return/blackberry/i.test(e)}function po(e=Cr()){return/webos/i.test(e)}function fo(e=Cr()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function mo(e=Cr()){return fo(e)||uo(e)||po(e)||ho(e)||/windows phone/i.test(e)||co(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function go(e,t=[]){let n;switch(e){case"Browser":n=so(Cr());break;case"Worker":n=`${so(Cr())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Zi}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(i){r(i)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e){var t,n,r,i;const s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=s.minPasswordLength)&&void 0!==t?t:6,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),void 0!==s.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),void 0!==s.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),void 0!==s.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),void 0!==s.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(r=null===(n=e.allowedNonAlphanumericCharacters)||void 0===n?void 0:n.join(""))&&void 0!==r?r:"",this.forceUpgradeOnSignin=null!==(i=e.forceUpgradeOnSignin)&&void 0!==i&&i,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,i,s,o;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=null===(t=a.meetsMinPasswordLength)||void 0===t||t),a.isValid&&(a.isValid=null===(n=a.meetsMaxPasswordLength)||void 0===n||n),a.isValid&&(a.isValid=null===(r=a.containsLowercaseLetter)||void 0===r||r),a.isValid&&(a.isValid=null===(i=a.containsUppercaseLetter)||void 0===i||i),a.isValid&&(a.isValid=null===(s=a.containsNumericCharacter)||void 0===s||s),a.isValid&&(a.isValid=null===(o=a.containsNonAlphanumericCharacter)||void 0===o||o),a}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new wo(this),this.idTokenSubscription=new wo(this),this.beforeStateQueue=new vo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ps,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=eo(t)),this._initializationPromise=this.queue(async()=>{var n,r;if(!this._deleted&&(this.persistenceManager=await io.create(this,e),!this._deleted)){if(null===(n=this._popupRedirectResolver)||void 0===n?void 0:n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(i){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(r=this.currentUser)||void 0===r?void 0:r.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await Ms(this,{idToken:e}),n=await Qs._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Yi(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,s=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==s||!(null==o?void 0:o.user)||(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return ws(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Gs(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Yi(this.app))return Promise.reject(ys(this));const t=e?Br(e):null;return t&&ws(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ws(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Yi(this.app)?Promise.reject(ys(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Yi(this.app)?Promise.reject(ys(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(eo(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return As(e,"GET","/v2/passwordPolicy",Os(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new bo(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Nr("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return As(e,"POST","/v2/accounts:revokeToken",Os(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&eo(e)||this._popupRedirectResolver;ws(t,this,"argument-error"),this.redirectPersistenceManager=await io.create(this,[eo(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t);let s=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(ws(o,this,"internal-error"),o.then(()=>{s||i(this.currentUser)}),"function"==typeof t){const i=e.addObserver(t,n,r);return()=>{s=!0,i()}}{const n=e.addObserver(t);return()=>{s=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ws(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=go(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;const t=await(null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){fs.logLevel<=$r.WARN&&fs.warn(`Auth (${Zi}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function _o(e){return Br(e)}class wo{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e){const t=new Lr(e,void 0);return t.subscribe.bind(t)}(e=>this.observer=e)}get next(){return ws(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function So(e){return xo.loadJS(e)}function Io(e){return`__${e}${Math.floor(1e6*Math.random())}`}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eo(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function ko(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class To{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return xs("not implemented")}_getIdTokenResponse(e){return xs("not implemented")}_linkToIdToken(e,t){return xs("not implemented")}_getReauthenticationResolver(e){return xs("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ro(e,t){return Ds(e,"POST","/v1/accounts:signInWithIdp",Os(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co extends To{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Co(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):gs("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=us(t,["providerId","signInMethod"]);if(!n||!r)return null;const s=new Co(n,r);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){return Ro(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Ro(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ro(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Dr(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo={USER_NOT_FOUND:"user-not-found"};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class No extends To{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new No({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new No({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return async function(e,t){return Ds(e,"POST","/v1/accounts:signInWithPhoneNumber",Os(e,t))}(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return async function(e,t){const n=await Ds(e,"POST","/v1/accounts:signInWithPhoneNumber",Os(e,t));if(n.temporaryProof)throw Bs(e,"account-exists-with-different-credential",n);return n}(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return async function(e,t){return Ds(e,"POST","/v1/accounts:signInWithPhoneNumber",Os(e,Object.assign(Object.assign({},t),{operation:"REAUTH"})),jo)}(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:r}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:r}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}=e;return n||t||r||i?new No({verificationId:t,verificationCode:n,phoneNumber:r,temporaryProof:i}):null}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ao extends Oo{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po extends Ao{constructor(){super("facebook.com")}static credential(e){return Co._fromParams({providerId:Po.PROVIDER_ID,signInMethod:Po.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Po.credentialFromTaggedObject(e)}static credentialFromError(e){return Po.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Po.credential(e.oauthAccessToken)}catch(t){return null}}}Po.FACEBOOK_SIGN_IN_METHOD="facebook.com",Po.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Do extends Ao{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Co._fromParams({providerId:Do.PROVIDER_ID,signInMethod:Do.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Do.credentialFromTaggedObject(e)}static credentialFromError(e){return Do.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Do.credential(t,n)}catch(r){return null}}}Do.GOOGLE_SIGN_IN_METHOD="google.com",Do.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Lo extends Ao{constructor(){super("github.com")}static credential(e){return Co._fromParams({providerId:Lo.PROVIDER_ID,signInMethod:Lo.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Lo.credentialFromTaggedObject(e)}static credentialFromError(e){return Lo.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Lo.credential(e.oauthAccessToken)}catch(t){return null}}}Lo.GITHUB_SIGN_IN_METHOD="github.com",Lo.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Uo extends Ao{constructor(){super("twitter.com")}static credential(e,t){return Co._fromParams({providerId:Uo.PROVIDER_ID,signInMethod:Uo.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Uo.credentialFromTaggedObject(e)}static credentialFromError(e){return Uo.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Uo.credential(t,n)}catch(r){return null}}}Uo.TWITTER_SIGN_IN_METHOD="twitter.com",Uo.PROVIDER_ID="twitter.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bo{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await Qs._fromIdTokenResponse(e,n,r),s=Fo(n);return new Bo({user:i,providerId:s,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Fo(n);return new Bo({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Fo(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo extends jr{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Mo.prototype),this.customData={appName:e.name,tenantId:null!==(i=e.tenantId)&&void 0!==i?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Mo(e,t,n,r)}}function zo(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Mo._fromErrorAndOperation(e,n,t,r);throw n})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Vo(e,t,n=!1){if(Yi(e.app))return Promise.reject(ys(e));const r="signIn",i=await zo(e,r,t),s=await Bo._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(s.user),s}const $o="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem($o,"1"),this.storage.removeItem($o),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho extends Wo{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=mo(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);!function(){const e=Cr();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()||10!==document.documentMode||i===e.newValue||e.newValue===e.oldValue?r():setTimeout(r,10)}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ho.type="LOCAL";const qo=Ho;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko extends Wo{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ko.type="SESSION";const Go=Ko;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Jo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new Jo(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,s=this.handlersMap[r];if(!(null==s?void 0:s.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(s).map(async e=>e(t.origin,i)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Yo(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Jo.receivers=[];class Xo{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,s;return new Promise((o,a)=>{const l=Yo("",20);r.port1.start();const c=setTimeout(()=>{a(new Error("unsupported_event"))},n);s={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===l)switch(t.data.status){case"ack":clearTimeout(c),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),o(t.data.response);break;default:clearTimeout(c),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(s),r.port1.addEventListener("message",s.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[r.port2])}).finally(()=>{s&&this.removeMessageHandler(s)})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qo(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Zo(){return void 0!==Qo().WorkerGlobalScope&&"function"==typeof Qo().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ea="firebaseLocalStorageDb",ta="firebaseLocalStorage",na="fbase_key";class ra{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ia(e,t){return e.transaction([ta],t?"readwrite":"readonly").objectStore(ta)}function sa(){const e=indexedDB.open(ea,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(ta,{keyPath:na})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(ta)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(ea);return new ra(e).toPromise()}(),t(await sa()))})})}async function oa(e,t,n){const r=ia(e,!0).put({[na]:t,value:n});return new ra(r).toPromise()}function aa(e,t){const n=ia(e,!0).delete(t);return new ra(n).toPromise()}class la{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await sa()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Zo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Jo._getInstance(Zo()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(e){return null}}(),!this.activeServiceWorker)return;this.sender=new Xo(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await sa();return await oa(e,$o,"1"),await aa(e,$o),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>oa(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=ia(e,!1).get(t),r=await new ra(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>aa(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=ia(e,!1).getAll();return new ra(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}la.type="LOCAL";const ca=la,da=1e12;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(e){this.auth=e,this.counter=da,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new ha(e,this.auth.name,t||{})),this.counter++,n}reset(e){var t;const n=e||da;null===(t=this._widgets.get(n))||void 0===t||t.delete(),this._widgets.delete(n)}getResponse(e){var t;const n=e||da;return(null===(t=this._widgets.get(n))||void 0===t?void 0:t.getResponse())||""}async execute(e){var t;const n=e||da;return null===(t=this._widgets.get(n))||void 0===t||t.execute(),""}}class ha{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const r="string"==typeof e?document.getElementById(e):e;ws(r,"argument-error",{appName:t}),this.container=r,this.isVisible="invisible"!==this.params.size,this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),this.timerId||(this.timerId=window.setTimeout(()=>{this.responseToken=function(){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<50;n++)e.push(t.charAt(Math.floor(62*Math.random())));return e.join("")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */();const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch(n){}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch(n){}this.isVisible&&this.execute()},6e4)},500))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}const pa=Io("rcb"),fa=new Ts(3e4,6e4);class ma{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(null===(e=Qo().grecaptcha)||void 0===e?void 0:e.render)}load(e,t=""){return ws(function(e){return e.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(e)}(t),e,"argument-error"),this.shouldResolveImmediately(t)&&Fs(Qo().grecaptcha)?Promise.resolve(Qo().grecaptcha):new Promise((n,r)=>{const i=Qo().setTimeout(()=>{r(vs(e,"network-request-failed"))},fa.get());Qo()[pa]=()=>{Qo().clearTimeout(i),delete Qo()[pa];const s=Qo().grecaptcha;if(!s||!Fs(s))return void r(vs(e,"internal-error"));const o=s.render;s.render=(e,t)=>{const n=o(e,t);return this.counter++,n},this.hostLanguage=t,n(s)},So(`${xo.recaptchaV2Script}?${Dr({onload:pa,render:"explicit",hl:t})}`).catch(()=>{clearTimeout(i),r(vs(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(null===(t=Qo().grecaptcha)||void 0===t?void 0:t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}class ga{async load(e){return new ua(e)}clearedOneInstance(){}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const va="recaptcha",ba={theme:"light",type:"image"};class ya{constructor(e,t,n=Object.assign({},ba)){this.parameters=n,this.type=va,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=_o(e),this.isInvisible="invisible"===this.parameters.size,ws("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment");const r="string"==typeof t?document.getElementById(t):t;ws(r,this.auth,"argument-error"),this.container=r,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new ga:new ma,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha();return t.getResponse(e)||new Promise(n=>{const r=e=>{e&&(this.tokenChangeListeners.delete(r),n(e))};this.tokenChangeListeners.add(r),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise||(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e})),this.renderPromise}_reset(){this.assertNotDestroyed(),null!==this.widgetId&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){ws(!this.parameters.sitekey,this.auth,"argument-error"),ws(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),ws("undefined"!=typeof document,this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(e=>e(t)),"function"==typeof e)e(t);else if("string"==typeof e){const n=Qo()[e];"function"==typeof n&&n(t)}}}assertNotDestroyed(){ws(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){ws(Es()&&!Zo(),this.auth,"internal-error"),await function(){let e=null;return new Promise(t=>{"complete"!==document.readyState?(e=()=>t(),window.addEventListener("load",e)):t()}).catch(t=>{throw e&&window.removeEventListener("load",e),t})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await async function(e){return(await As(e,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}(this.auth);ws(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return ws(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}class _a{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=No._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class wa extends To{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ro(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ro(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ro(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function xa(e){return Vo(e.auth,new wa(e),e.bypassAuthState)}function Sa(e){const{auth:t,user:n}=e;return ws(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e;if(Yi(r.app))return Promise.reject(ys(r));const i="reauthenticate";try{const s=await Hs(e,zo(r,i,t,e),n);ws(s.idToken,r,"internal-error");const o=$s(s.idToken);ws(o,r,"internal-error");const{sub:a}=o;return ws(e.uid===a,r,"user-mismatch"),Bo._forOperation(e,i,s)}catch(s){throw"auth/user-not-found"===(null==s?void 0:s.code)&&gs(r,"user-mismatch"),s}}(n,new wa(e),e.bypassAuthState)}async function Ia(e){const{auth:t,user:n}=e;return ws(n,t,"internal-error"),async function(e,t,n=!1){const r=await Hs(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Bo._forOperation(e,"link",r)}(n,new wa(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ea{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:s,type:o}=e;if(s)return void this.reject(s);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return xa;case"linkViaPopup":case"linkViaRedirect":return Ia;case"reauthViaPopup":case"reauthViaRedirect":return Sa;default:gs(this.auth,"internal-error")}}resolve(e){Ss(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ss(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ka=new Ts(2e3,1e4);class Ta extends Ea{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,Ta.currentPopupAction&&Ta.currentPopupAction.cancel(),Ta.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ws(e,this.auth,"internal-error"),e}async onExecution(){Ss(1===this.filter.length,"Popup operations only handle one event");const e=Yo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(vs(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(vs(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Ta.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(vs(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,ka.get())};e()}}Ta.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ra=new Map;class Ca extends Ea{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Ra.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return ro("pendingRedirect",e.config.apiKey,e.name)}(t),r=function(e){return eo(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const i="true"===await r._get(n);return await r._remove(n),i}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}Ra.set(this.auth._key(),e)}return this.bypassAuthState||Ra.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function ja(e,t){Ra.set(e._key(),t)}async function Na(e,t,n=!1){if(Yi(e.app))return Promise.reject(ys(e));const r=_o(e),i=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return t?eo(t):(ws(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),s=new Ca(r,i,n),o=await s.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Pa(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Pa(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(vs(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Aa(e))}saveEventToCache(e){this.cachedEventUids.add(Aa(e)),this.lastProcessedEventTime=Date.now()}}function Aa(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function Pa({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Da=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,La=/^https?/;function Ua(e){const t=Is(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!La.test(n))return!1;if(Da.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba=new Ts(3e4,6e4);function Fa(){const e=Qo().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}let Ma=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const za=new Ts(5e3,15e3),Va={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},$a=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Wa(e){const t=e.config;ws(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?Rs(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:Zi},i=$a.get(e.config.apiHost);i&&(r.eid=i);const s=e._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Dr(r).slice(1)}`}async function Ha(e){const t=await function(e){return Ma=Ma||function(e){return new Promise((t,n)=>{var r,i,s;function o(){Fa(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Fa(),n(vs(e,"network-request-failed"))},timeout:Ba.get()})}if(null===(i=null===(r=Qo().gapi)||void 0===r?void 0:r.iframes)||void 0===i?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null===(s=Qo().gapi)||void 0===s?void 0:s.load)){const t=Io("iframefcb");return Qo()[t]=()=>{gapi.load?o():n(vs(e,"network-request-failed"))},So(`${xo.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw Ma=null,e})}(e),Ma}(e),n=Qo().gapi;return ws(n,e,"internal-error"),t.open({where:document.body,url:Wa(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Va,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=vs(e,"network-request-failed"),s=Qo().setTimeout(()=>{r(i)},za.get());function o(){Qo().clearTimeout(s),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qa={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class Ka{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ga=encodeURIComponent("fac");async function Ja(e,t,n,r,i,s){ws(e.config.authDomain,e,"auth-domain-config-required"),ws(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:Zi,eventId:i};if(t instanceof Oo){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof Ao){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const d of Object.keys(a))void 0===a[d]&&delete a[d];const l=await e._getAppCheckToken(),c=l?`#${Ga}=${encodeURIComponent(l)}`:"";return`${function({config:e}){return e.emulator?Rs(e,"emulator/auth/handler"):`https://${e.authDomain}/__/auth/handler`}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${Dr(a).slice(1)}${c}`}const Ya="webStorageSupport",Xa=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Go,this._completeRedirectFn=Na,this._overrideRedirectResult=ja}async _openPopup(e,t,n,r){var i;return Ss(null===(i=this.eventManagers[e._key()])||void 0===i?void 0:i.manager,"_initialize() not called before _openPopup()"),function(e,t,n,r=500,i=600){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const l=Object.assign(Object.assign({},qa),{width:r.toString(),height:i.toString(),top:s,left:o}),c=Cr().toLowerCase();n&&(a=lo(c)?"_blank":n),oo(c)&&(t=t||"http://localhost",l.scrollbars="yes");const d=Object.entries(l).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=Cr()){var t;return fo(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(c)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}(t||"",a),new Ka(null);const u=window.open(t||"",a,d);ws(u,e,"popup-blocked");try{u.focus()}catch(h){}return new Ka(u)}(e,await Ja(e,t,n,Is(),r),Yo())}async _openRedirect(e,t,n,r){return await this._originValidation(e),i=await Ja(e,t,n,Is(),r),Qo().location.href=i,new Promise(()=>{});var i}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Ss(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Ha(e),n=new Oa(e);return t.register("authEvent",t=>(ws(null==t?void 0:t.authEvent,e,"invalid-auth-event"),{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ya,{type:Ya},n=>{var r;const i=null===(r=null==n?void 0:n[0])||void 0===r?void 0:r[Ya];void 0!==i&&t(!!i),gs(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=async function(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return As(e,"GET","/v1/projects",t)}(e);for(const r of t)try{if(Ua(r))return}catch(n){}gs(e,"unauthorized-domain")}(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return mo()||ao()||fo()}};var Qa="@firebase/auth",Za="1.7.9";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class el{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ws(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tl=Tr("authIdTokenMaxAge")||300;let nl=null;var rl;xo={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var i,s;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=vs("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(null!==(s=null===(i=document.getElementsByTagName("head"))||void 0===i?void 0:i[0])&&void 0!==s?s:document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},rl="Browser",Gi(new Fr("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:s,authDomain:o}=n.options;ws(s&&!s.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:s,authDomain:o,clientPlatform:rl,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:go(rl)},l=new yo(n,r,i,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(eo);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Gi(new Fr("auth-internal",e=>{const t=_o(e.getProvider("auth").getImmediate());return new el(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ts(Qa,Za,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(rl)),ts(Qa,Za,"esm2017");const il=function(e=function(e=Vi){const t=Wi.get(e);if(!t&&e===Vi&&kr())return es();if(!t)throw Xi.create("no-app",{appName:e});return t}()){const t=Ji(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=Ji(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(Ar(n.getOptions(),null!=t?t:{}))return e;gs(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:Xa,persistence:[ca,qo,Go]}),r=Tr("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(i=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>tl)return;const r=null==t?void 0:t.token;nl!==r&&(nl=r,await fetch(i,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){Br(e).beforeAuthStateChanged(t,n)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n,t,()=>t(n.currentUser)),function(e){Br(e).onIdTokenChanged(e=>t(e),void 0,void 0)}(n)}}var i;const s=null===(a=null===(o=Er())||void 0===o?void 0:o.emulatorHosts)||void 0===a?void 0:a.auth;var o,a;return s&&function(e,t){const n=_o(e);ws(n._canInitEmulator,n,"emulator-config-failed"),ws(/^https?:\/\//.test(t),n,"invalid-emulator-scheme");const r=Eo(t),{host:i,port:s}=function(e){const t=Eo(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const e=i[1];return{host:e,port:ko(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:ko(t)}}}(t),o=null===s?"":`:${s}`;n.config.emulator={url:`${r}//${i}${o}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:i,port:s,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:!1})}),function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}()}(n,`http://${s}`),n}(es({apiKey:"AIzaSyAe-PAuB9GlFX4YlJoFPrfJ9m-NPTW4Ejs",authDomain:"bhada-api.firebaseapp.com",projectId:"bhada-api",storageBucket:"bhada-api.firebasestorage.app",messagingSenderId:"478743960698",appId:"1:478743960698:web:f20eee2387d9aa81e0efc3",measurementId:"G-ZN80LXX0MP"})),sl=()=>{if(window.recaptchaVerifier){try{window.recaptchaVerifier.clear()}catch(e){}window.recaptchaVerifier=null}},ol=async(e,t="recaptcha-container")=>{sl();const n=document.getElementById(t);if(!n)throw new Error(`reCAPTCHA container #${t} not found`);return window.recaptchaVerifier=new ya(il,n,{size:"invisible",callback:()=>{},"expired-callback":sl}),await window.recaptchaVerifier.render(),async function(e,t,n){if(Yi(e.app))return Promise.reject(ys(e));const r=_o(e),i=await async function(e,t,n){var r;const i=await n.verify();try{let s;if(ws("string"==typeof i,e,"argument-error"),ws(n.type===va,e,"argument-error"),s="string"==typeof t?{phoneNumber:t}:t,"session"in s){const t=s.session;if("phoneNumber"in s){ws("enroll"===t.type,e,"internal-error");const n=await function(e,t){return As(e,"POST","/v2/accounts/mfaEnrollment:start",Os(e,t))}(e,{idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,recaptchaToken:i}});return n.phoneSessionInfo.sessionInfo}{ws("signin"===t.type,e,"internal-error");const n=(null===(r=s.multiFactorHint)||void 0===r?void 0:r.uid)||s.multiFactorUid;ws(n,e,"missing-multi-factor-info");const o=await function(e,t){return As(e,"POST","/v2/accounts/mfaSignIn:start",Os(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,{mfaPendingCredential:t.credential,mfaEnrollmentId:n,phoneSignInInfo:{recaptchaToken:i}});return o.phoneResponseInfo.sessionInfo}}{const{sessionInfo:t}=await async function(e,t){return As(e,"POST","/v1/accounts:sendVerificationCode",Os(e,t))}(e,{phoneNumber:s.phoneNumber,recaptchaToken:i});return t}}finally{n._reset()}}(r,t,Br(n));return new _a(i,e=>async function(e,t){return Vo(_o(e),t)}(r,e))}(il,e,window.recaptchaVerifier)},al="phone",ll="otp";function cl(){const[e,n]=t.useState(al),[r,i]=t.useState(""),[s,a]=t.useState(["","","","","",""]),[l,c]=t.useState(null),[d,h]=t.useState(!1),[p,f]=t.useState(0),g=t.useRef([]),{login:v}=Vn(),b=o();t.useEffect(()=>{if(p>0){const e=setTimeout(()=>f(e=>e-1),1e3);return()=>clearTimeout(e)}},[p]);const y=e=>{const t=e.replace(/\D/g,"");return e.startsWith("+")?e.replace(/\s/g,""):10===t.length?`+91${t}`:`+${t}`};return te.jsxs("div",{className:"login-page",children:[te.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",backgroundSize:"44px 44px",maskImage:"radial-gradient(ellipse at center, black 30%, transparent 75%)",WebkitMaskImage:"radial-gradient(ellipse at center, black 30%, transparent 75%)"}}),te.jsxs("div",{className:"login-card",style:{position:"relative",zIndex:1},children:[te.jsxs("div",{className:"flex items-center gap-12 mb-20",children:[te.jsx("div",{style:{width:50,height:50,background:"var(--accent)",borderRadius:14,display:"grid",placeItems:"center",color:"var(--bg-0)"},children:te.jsx(w,{size:26})}),te.jsxs("div",{children:[te.jsx("div",{style:{fontFamily:"var(--font-sans)",fontWeight:700,fontSize:18,color:"var(--text-0)"},children:"RiderApp"}),te.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-2)",letterSpacing:"0.1em"},children:"RIDER APP"})]})]}),te.jsx("div",{style:{display:"flex",gap:6,marginBottom:28},children:[0,1].map(t=>te.jsx("div",{style:{height:3,flex:1,borderRadius:99,background:(e===ll?t<=1:0===t)?"var(--accent)":"var(--bg-3)",transition:"background 0.3s ease",boxShadow:(e===ll?t<=1:0===t)?"0 0 8px var(--accent-glow)":"none"}},t))}),e===al&&te.jsxs("div",{style:{animation:"slideUp 0.22s ease"},children:[te.jsx("div",{id:"recaptcha-container"}),te.jsx("h1",{style:{fontFamily:"var(--font-sans)",fontWeight:700,fontSize:24,color:"var(--text-0)",marginBottom:8},children:"Welcome back"}),te.jsx("p",{style:{fontSize:13,color:"var(--text-2)",marginBottom:28},children:"Enter your phone number to receive an OTP"}),te.jsxs("form",{onSubmit:async e=>{e.preventDefault();const t=y(r);if(t.length<10)u.error("Enter a valid phone number");else{h(!0);try{const e=await ol(t);c(e),n(ll),f(30),u.success(`OTP sent to ${t}`)}catch(i){const e="auth/invalid-phone-number"===i.code?"Invalid phone number":"auth/too-many-requests"===i.code?"Too many attempts. Try later.":i.message||"Failed to send OTP";u.error(e)}finally{h(!1)}}},children:[te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Phone Number"}),te.jsxs("div",{style:{position:"relative"},children:[te.jsx(T,{size:14,style:{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--text-2)",pointerEvents:"none"}}),te.jsx("input",{className:"form-input",type:"tel",placeholder:"+91 98765 43210",value:r,onChange:e=>i(e.target.value),style:{paddingLeft:38},autoFocus:!0,required:!0})]}),te.jsx("div",{style:{fontSize:11,color:"var(--text-2)",marginTop:6},children:"10-digit numbers get +91 automatically"})]}),te.jsxs("button",{type:"submit",className:"btn btn-primary btn-lg",disabled:d||!r.trim(),children:[te.jsx(T,{size:15}),d?"Sending OTP...":"Send OTP"]})]})]}),e===ll&&te.jsxs("div",{style:{animation:"slideUp 0.22s ease"},children:[te.jsxs("button",{className:"btn btn-ghost btn-sm",style:{marginBottom:16,padding:"4px 0",color:"var(--text-2)"},onClick:()=>{n(al),a(["","","","","",""])},children:[te.jsx(R,{size:14})," Back"]}),te.jsx("h1",{style:{fontFamily:"var(--font-sans)",fontWeight:700,fontSize:24,color:"var(--text-0)",marginBottom:8},children:"Enter OTP"}),te.jsxs("p",{style:{fontSize:13,color:"var(--text-2)",marginBottom:28},children:["Sent to ",te.jsx("strong",{style:{color:"var(--text-0)"},children:y(r)})]}),te.jsxs("form",{onSubmit:async e=>{var t,n;e.preventDefault();const r=s.join("");if(6===r.length){h(!0);try{const e=await(async(e,t)=>(await e.confirm(t)).user.getIdToken())(l,r),{data:t}=await(e=>An.post("/auth/verify-firebase",{idToken:e,role:"rider"}))(e);await v(t.accessToken,t.refreshToken,t.user),u.success("Welcome back, Rider!"),b("/")}catch(i){const e="auth/invalid-verification-code"===i.code?"Incorrect OTP":"auth/code-expired"===i.code?"OTP expired. Resend it.":(null==(n=null==(t=i.response)?void 0:t.data)?void 0:n.message)||"Verification failed";u.error(e)}finally{h(!1)}}else u.error("Enter the 6-digit OTP")},children:[te.jsx("div",{style:{display:"flex",gap:8,justifyContent:"center",margin:"0 0 28px"},onPaste:e=>{var t;const n=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);6===n.length&&(a(n.split("")),null==(t=g.current[5])||t.focus())},children:s.map((e,t)=>te.jsx("input",{ref:e=>g.current[t]=e,type:"text",inputMode:"numeric",maxLength:1,value:e,onChange:e=>((e,t)=>{var n;if(!/^\d*$/.test(t))return;const r=[...s];r[e]=t.slice(-1),a(r),t&&e<5&&(null==(n=g.current[e+1])||n.focus())})(t,e.target.value),onKeyDown:e=>((e,t)=>{var n;"Backspace"===t.key&&!s[e]&&e>0&&(null==(n=g.current[e-1])||n.focus())})(t,e),autoFocus:0===t,style:{width:46,height:54,textAlign:"center",fontSize:22,fontFamily:"var(--font-sans)",background:e?"var(--accent-dim)":"var(--bg-0)",border:"1.5px solid "+(e?"var(--accent)":"var(--border)"),borderRadius:10,color:e?"var(--accent)":"var(--text-0)",outline:"none",transition:"all 0.15s ease",caretColor:"var(--accent)"}},t))}),te.jsxs("button",{type:"submit",className:"btn btn-primary btn-lg",disabled:d||6!==s.join("").length,children:[te.jsx(C,{size:15}),d?"Verifying...":"Verify & Sign In"]}),te.jsx("div",{style:{textAlign:"center",marginTop:18},children:p>0?te.jsxs("span",{style:{fontSize:13,color:"var(--text-2)"},children:["Resend in ",te.jsxs("span",{style:{color:"var(--accent)",fontFamily:"var(--font-mono)",fontWeight:600},children:[p,"s"]})]}):te.jsxs("button",{type:"button",className:"btn btn-ghost btn-sm",onClick:async()=>{a(["","","","","",""]),h(!0);try{const e=await ol(y(r));c(e),f(30),u.success("OTP resent!"),setTimeout(()=>{var e;return null==(e=g.current[0])?void 0:e.focus()},100)}catch{u.error("Failed to resend")}finally{h(!1)}},disabled:d,style:{fontSize:13,color:"var(--text-2)"},children:[te.jsx(m,{size:12})," Resend OTP"]})})]})]})]})]})}function dl({label:e,value:n,onChange:r,required:i=!1}){const s=t.useRef(),[o,a]=t.useState(!1),[l,c]=t.useState(n||null),[d,h]=t.useState(!1);return te.jsxs("div",{style:{marginBottom:16},children:[te.jsxs("label",{style:{display:"block",fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text-2)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8},children:[e,i&&te.jsx("span",{style:{color:"var(--red)"},children:" *"})]}),te.jsx("div",{onClick:()=>{var e;return!o&&(null==(e=s.current)?void 0:e.click())},style:{position:"relative",borderRadius:10,overflow:"hidden",border:"1.5px dashed "+(l?"rgba(54,211,153,0.5)":"var(--border-bright)"),background:"var(--bg-2)",cursor:o?"wait":"pointer",minHeight:88,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color 0.2s"},children:o?te.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:20},children:[te.jsx(U,{size:22,style:{color:"var(--accent)",animation:"ksp 0.8s linear infinite"}}),te.jsx("span",{style:{fontSize:12,color:"var(--text-2)"},children:"Uploading…"})]}):l?te.jsxs(te.Fragment,{children:[te.jsx("img",{src:l,alt:e,style:{width:"100%",maxHeight:150,objectFit:"cover",display:"block"}}),te.jsxs("div",{style:{position:"absolute",bottom:6,right:6,display:"flex",gap:6},children:[te.jsxs("button",{type:"button",onClick:e=>{e.stopPropagation(),h(!0)},style:ul,children:[te.jsx(L,{size:11})," View"]}),te.jsxs("button",{type:"button",onClick:e=>{var t;e.stopPropagation(),null==(t=s.current)||t.click()},style:ul,children:[te.jsx(B,{size:11})," Change"]})]})]}):te.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:20},children:[te.jsx("div",{style:{width:44,height:44,borderRadius:10,background:"var(--bg-3)",display:"grid",placeItems:"center"},children:te.jsx(B,{size:20,style:{color:"var(--text-2)"}})}),te.jsx("span",{style:{fontSize:12,color:"var(--text-1)"},children:"Tap to upload photo"}),te.jsx("span",{style:{fontSize:10,color:"var(--text-2)"},children:"JPG / PNG · max 5 MB"})]})}),te.jsx("input",{ref:s,type:"file",accept:"image/*",capture:"environment",style:{display:"none"},onChange:async e=>{var t,i,s,o,l;const d=null==(t=e.target.files)?void 0:t[0];if(!d)return;if(!d.type.startsWith("image/"))return void u.error("Please select an image");if(d.size>5242880)return void u.error("Max file size is 5 MB");const h=URL.createObjectURL(d);c(h),a(!0);try{const{data:e}=await(e=>{const t=new FormData;return t.append("file",e),An.post("/files/upload",t,{headers:{"Content-Type":"multipart/form-data"}})})(d),t=(null==(i=null==e?void 0:e.data)?void 0:i.url)??(null==e?void 0:e.url)??(null==e?void 0:e.fileUrl)??(null==(s=null==e?void 0:e.data)?void 0:s.fileUrl);if(!t)throw new Error("No URL in response");c(t),r(t),u.success("Photo uploaded")}catch(p){u.error((null==(l=null==(o=p.response)?void 0:o.data)?void 0:l.message)||"Upload failed"),c(n||null),r(n||"")}finally{a(!1),e.target.value=""}}}),d&&te.jsxs("div",{onClick:()=>h(!1),style:{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.92)",display:"grid",placeItems:"center"},children:[te.jsx("img",{src:l,alt:e,style:{maxWidth:"90vw",maxHeight:"84vh",borderRadius:10,objectFit:"contain"},onClick:e=>e.stopPropagation()}),te.jsxs("button",{onClick:()=>h(!1),style:{position:"absolute",top:18,right:18,...ul},children:[te.jsx(g,{size:13})," Close"]})]}),te.jsx("style",{children:"@keyframes ksp{to{transform:rotate(360deg)}}"})]})}const ul={display:"inline-flex",alignItems:"center",gap:4,background:"rgba(13,18,32,0.82)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:6,padding:"4px 9px",color:"#f0f4ff",fontSize:11,cursor:"pointer"};function hl({riderData:e,uid:n,onClose:r,onSave:i}){const[s,o]=t.useState({firstName:(null==e?void 0:e.firstName)||"",lastName:(null==e?void 0:e.lastName)||"",email:(null==e?void 0:e.email)||""}),[a,l]=t.useState(!1);return te.jsx("div",{className:"modal-overlay",onClick:r,children:te.jsxs("div",{className:"modal",onClick:e=>e.stopPropagation(),children:[te.jsxs("div",{className:"modal-header",children:[te.jsx("div",{className:"modal-title",children:"Personal Details"}),te.jsx("button",{className:"modal-close",onClick:r,children:te.jsx(g,{size:14})})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"First Name *"}),te.jsx("input",{className:"form-input",value:s.firstName,autoFocus:!0,onChange:e=>o(t=>({...t,firstName:e.target.value}))})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Last Name"}),te.jsx("input",{className:"form-input",value:s.lastName,onChange:e=>o(t=>({...t,lastName:e.target.value}))})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Email"}),te.jsx("input",{className:"form-input",type:"email",value:s.email,onChange:e=>o(t=>({...t,email:e.target.value}))})]}),te.jsxs("div",{className:"flex gap-8",children:[te.jsx("button",{className:"btn btn-secondary flex-1",onClick:r,children:"Cancel"}),te.jsx("button",{className:"btn btn-primary flex-1",onClick:async()=>{var e,t;if(s.firstName.trim()){l(!0);try{await Pn.updateProfile(n,s),u.success("Profile saved!"),i(),r()}catch(o){u.error((null==(t=null==(e=o.response)?void 0:e.data)?void 0:t.message)||"Update failed")}finally{l(!1)}}else u.error("First name is required")},disabled:a,children:a?"Saving…":"Save"})]})]})})}function pl({uid:e,riderData:n,onClose:r,onSave:i}){const s=(null==n?void 0:n.vehicle)||{vehicleType:null==n?void 0:n.vehicleType,vehicleNumber:null==n?void 0:n.vehicleNumber},[o,a]=t.useState({vehicleType:(null==s?void 0:s.vehicleType)||"BIKE",vehicleNumber:(null==s?void 0:s.vehicleNumber)||""}),[l,c]=t.useState(!1);return te.jsx("div",{className:"modal-overlay",onClick:r,children:te.jsxs("div",{className:"modal",onClick:e=>e.stopPropagation(),children:[te.jsxs("div",{className:"modal-header",children:[te.jsx("div",{className:"modal-title",children:"Vehicle Details"}),te.jsx("button",{className:"modal-close",onClick:r,children:te.jsx(g,{size:14})})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Vehicle Type"}),te.jsxs("select",{className:"form-select",value:o.vehicleType,onChange:e=>a(t=>({...t,vehicleType:e.target.value})),children:[te.jsx("option",{value:"BIKE",children:"Bike"}),te.jsx("option",{value:"SCOOTER",children:"Scooter"}),te.jsx("option",{value:"CYCLE",children:"Cycle"}),te.jsx("option",{value:"CAR",children:"Car"}),te.jsx("option",{value:"VAN",children:"Van"})]})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Vehicle Number"}),te.jsx("input",{className:"form-input",placeholder:"e.g. MH01AB1234",value:o.vehicleNumber,onChange:e=>a(t=>({...t,vehicleNumber:e.target.value.toUpperCase()}))})]}),te.jsxs("div",{className:"flex gap-8",children:[te.jsx("button",{className:"btn btn-secondary flex-1",onClick:r,children:"Cancel"}),te.jsx("button",{className:"btn btn-primary flex-1",onClick:async()=>{var t,n;if(o.vehicleNumber.trim()){c(!0);try{await Pn.submitVehicle(e,o),u.success("Vehicle submitted!"),i(),r()}catch(s){u.error((null==(n=null==(t=s.response)?void 0:t.data)?void 0:n.message)||"Failed to submit vehicle")}finally{c(!1)}}else u.error("Enter vehicle number")},disabled:l,children:l?"Submitting…":"Submit Vehicle"})]})]})})}function fl({uid:e,riderData:n,onClose:r,onSave:i}){const s=(null==n?void 0:n.kyc)||{idProofType:null==n?void 0:n.idProofType,idProofNumber:null==n?void 0:n.idProofNumber,documentUrl:null==n?void 0:n.documentUrl,documentUrlBack:null==n?void 0:n.documentUrlBack},[o,a]=t.useState({idProofType:s.idProofType||"AADHAR",idProofNumber:s.idProofNumber||"",documentUrl:s.documentUrl||"",documentUrlBack:s.documentUrlBack||""}),[l,c]=t.useState(!1),d=["AADHAR","DRIVING_LICENCE"].includes(o.idProofType);return te.jsx("div",{className:"modal-overlay",onClick:r,children:te.jsxs("div",{className:"modal",style:{maxHeight:"90vh",overflowY:"auto"},onClick:e=>e.stopPropagation(),children:[te.jsxs("div",{className:"modal-header",children:[te.jsx("div",{className:"modal-title",children:"KYC Verification"}),te.jsx("button",{className:"modal-close",onClick:r,children:te.jsx(g,{size:14})})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"ID Proof Type"}),te.jsxs("select",{className:"form-select",value:o.idProofType,onChange:e=>a(t=>({...t,idProofType:e.target.value})),children:[te.jsx("option",{value:"AADHAR",children:"Aadhaar Card"}),te.jsx("option",{value:"PAN",children:"PAN Card"}),te.jsx("option",{value:"DRIVING_LICENCE",children:"Driving Licence"})]})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"ID Number *"}),te.jsx("input",{className:"form-input",placeholder:"Enter your ID number",value:o.idProofNumber,onChange:e=>a(t=>({...t,idProofNumber:e.target.value.toUpperCase()}))})]}),te.jsx(dl,{label:("AADHAR"===o.idProofType?"Aadhaar":"PAN"===o.idProofType?"PAN Card":"Driving Licence")+" — Front Photo",value:o.documentUrl,onChange:e=>a(t=>({...t,documentUrl:e})),required:!0}),d&&te.jsx(dl,{label:("AADHAR"===o.idProofType?"Aadhaar":"Driving Licence")+" — Back Photo (optional)",value:o.documentUrlBack,onChange:e=>a(t=>({...t,documentUrlBack:e}))}),te.jsx("div",{style:{padding:"10px 12px",background:"var(--blue-dim)",borderRadius:8,fontSize:12,color:"var(--blue)",marginBottom:18,lineHeight:1.5},children:"ℹ️ Make sure all text is clearly visible. Documents are verified within 24–48 hours."}),te.jsxs("div",{className:"flex gap-8",children:[te.jsx("button",{className:"btn btn-secondary flex-1",onClick:r,children:"Cancel"}),te.jsx("button",{className:"btn btn-primary flex-1",onClick:async()=>{var t,n;if(o.idProofNumber.trim())if(o.documentUrl){c(!0);try{await Pn.submitKyc(e,{idProofType:o.idProofType,idProofNumber:o.idProofNumber,documentUrl:o.documentUrl,...o.documentUrlBack?{documentUrlBack:o.documentUrlBack}:{}}),u.success("KYC submitted! Admin will verify within 24–48 hours."),i(),r()}catch(s){u.error((null==(n=null==(t=s.response)?void 0:t.data)?void 0:n.message)||"KYC submission failed")}finally{c(!1)}}else u.error("Please upload a front photo of your ID document");else u.error("Enter your ID number")},disabled:l,children:l?"Submitting…":"Submit KYC"})]})]})})}function ml({uid:e,riderData:n,onClose:r,onSave:i}){const s={bankAccountHolderName:(null==n?void 0:n.bankAccountHolderName)||"",bankAccountNumber:(null==n?void 0:n.bankAccountNumber)||"",bankIfscCode:(null==n?void 0:n.bankIfscCode)||"",bankName:(null==n?void 0:n.bankName)||"",upiId:(null==n?void 0:n.upiId)||""},[o,a]=t.useState(s),[l,c]=t.useState(!1),[d,h]=t.useState(s.upiId&&!s.bankAccountNumber?"upi":"bank"),p=(e,t)=>a(n=>({...n,[e]:t}));return te.jsx("div",{className:"modal-overlay",onClick:r,children:te.jsxs("div",{className:"modal",onClick:e=>e.stopPropagation(),children:[te.jsxs("div",{className:"modal-header",children:[te.jsx("div",{className:"modal-title",children:"Payout Account"}),te.jsx("button",{className:"modal-close",onClick:r,children:te.jsx(g,{size:14})})]}),te.jsx("div",{style:{fontSize:12,color:"var(--text-2)",marginBottom:16,lineHeight:1.5},children:"Add your bank or UPI details so admin can transfer your earnings directly."}),te.jsx("div",{style:{display:"flex",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:3,marginBottom:20},children:[{key:"bank",label:"🏦 Bank Transfer"},{key:"upi",label:"📱 UPI"}].map(({key:e,label:t})=>te.jsx("button",{onClick:()=>h(e),style:{flex:1,background:d===e?"var(--bg-1)":"transparent",border:"1px solid "+(d===e?"var(--border-bright)":"transparent"),borderRadius:6,padding:"8px 0",color:d===e?"var(--text-0)":"var(--text-2)",fontSize:13,fontWeight:d===e?600:400,cursor:"pointer"},children:t},e))}),"bank"===d?te.jsxs(te.Fragment,{children:[te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Account Holder Name *"}),te.jsx("input",{className:"form-input",placeholder:"As on bank passbook",value:o.bankAccountHolderName,onChange:e=>p("bankAccountHolderName",e.target.value)})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Account Number *"}),te.jsx("input",{className:"form-input",placeholder:"e.g. 1234567890123",value:o.bankAccountNumber,onChange:e=>p("bankAccountNumber",e.target.value.replace(/\D/g,""))})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"IFSC Code *"}),te.jsx("input",{className:"form-input",placeholder:"e.g. SBIN0001234",value:o.bankIfscCode,onChange:e=>p("bankIfscCode",e.target.value.toUpperCase())})]}),te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"Bank Name"}),te.jsx("input",{className:"form-input",placeholder:"e.g. State Bank of India",value:o.bankName,onChange:e=>p("bankName",e.target.value)})]})]}):te.jsxs("div",{className:"form-group",children:[te.jsx("label",{className:"form-label",children:"UPI ID *"}),te.jsx("input",{className:"form-input",placeholder:"e.g. yourname@upi or 9876543210@okaxis",value:o.upiId,onChange:e=>p("upiId",e.target.value.trim())})]}),te.jsx("div",{style:{padding:"10px 12px",background:"var(--green-dim)",border:"1px solid rgba(54,211,153,0.2)",borderRadius:8,fontSize:12,color:"var(--text-1)",marginBottom:18,lineHeight:1.5},children:"🔒 Your account details are securely stored and only visible to Bhada admin for processing payouts."}),te.jsxs("div",{className:"flex gap-8",children:[te.jsx("button",{className:"btn btn-secondary flex-1",onClick:r,children:"Cancel"}),te.jsx("button",{className:"btn btn-primary flex-1",onClick:async()=>{var t,n;if("bank"===d){if(!o.bankAccountHolderName.trim())return void u.error("Enter account holder name");if(!o.bankAccountNumber.trim())return void u.error("Enter bank account number");if(!o.bankIfscCode.trim())return void u.error("Enter IFSC code")}else if(!o.upiId.trim())return void u.error("Enter UPI ID");c(!0);try{await Pn.updateBankAccount(e,{bankAccountHolderName:"bank"===d?o.bankAccountHolderName.trim():void 0,bankAccountNumber:"bank"===d?o.bankAccountNumber.trim():void 0,bankIfscCode:"bank"===d?o.bankIfscCode.trim().toUpperCase():void 0,bankName:"bank"===d?o.bankName.trim():void 0,upiId:"upi"===d?o.upiId.trim():void 0}),u.success("Bank account saved!"),i(),r()}catch(s){u.error((null==(n=null==(t=s.response)?void 0:t.data)?void 0:n.message)||"Failed to save bank details")}finally{c(!1)}},disabled:l,children:l?"Saving…":"Save Account"})]})]})})}function gl({onClose:e,onPaid:n}){const[r,i]=t.useState(null),[s,o]=t.useState(!0),[a,l]=t.useState(!1),[c,d]=t.useState(!1);return t.useEffect(()=>{(async()=>{try{const{data:t}=await Bn(),r=null==t?void 0:t.data;if("PAID"===(null==r?void 0:r.status))return n(),void e();i({requiredAmount:(null==t?void 0:t.requiredAmount)||(null==r?void 0:r.amount)||0,deposit:r})}catch(t){u.error("Failed to load deposit info"),e()}finally{o(!1)}})()},[]),te.jsx("div",{className:"modal-overlay",onClick:e,children:te.jsxs("div",{className:"modal",onClick:e=>e.stopPropagation(),children:[te.jsxs("div",{className:"modal-header",children:[te.jsx("div",{className:"modal-title",children:"Security Deposit"}),te.jsx("button",{className:"modal-close",onClick:e,children:te.jsx(g,{size:14})})]}),s?te.jsx("div",{style:{textAlign:"center",padding:"32px 0"},children:te.jsx(U,{size:24,style:{color:"var(--accent)",animation:"ksp 0.8s linear infinite"}})}):c?te.jsxs("div",{style:{textAlign:"center",padding:"32px 0"},children:[te.jsx(U,{size:24,style:{color:"var(--accent)",animation:"ksp 0.8s linear infinite"}}),te.jsx("div",{style:{marginTop:12,fontSize:13,color:"var(--text-2)"},children:"Verifying payment…"})]}):te.jsxs(te.Fragment,{children:[te.jsxs("div",{style:{textAlign:"center",padding:"20px 0 24px",borderBottom:"1px solid var(--border)",marginBottom:20},children:[te.jsx("div",{style:{fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text-2)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8},children:"Deposit Amount"}),te.jsxs("div",{style:{fontFamily:"var(--font-display)",fontSize:36,fontWeight:800,color:"var(--accent)",letterSpacing:"-0.02em"},children:["₹",(null==r?void 0:r.requiredAmount)??0]})]}),te.jsxs("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.7,marginBottom:20},children:["A one-time ",te.jsx("strong",{children:"refundable security deposit"})," is required before your onboarding can be approved. This amount will be returned to you when you leave the platform in good standing."]}),te.jsx("div",{style:{padding:"10px 12px",background:"var(--blue-dim)",borderRadius:8,fontSize:12,color:"var(--blue)",marginBottom:20,lineHeight:1.5},children:"🔒 Payment is processed securely via Razorpay. Your money is safe."}),te.jsxs("div",{className:"flex gap-8",children:[te.jsx("button",{className:"btn btn-secondary flex-1",onClick:e,disabled:a,children:"Cancel"}),te.jsx("button",{className:"btn btn-primary flex-1",onClick:async()=>{var t,r;l(!0);try{const{data:t}=await An.post("/security-deposit/initiate"),{gatewayOrderId:r,amount:i,alreadyPaid:s}=t.data;if(s)return u.success("Deposit already paid!"),n(),void e();try{await new Promise((e,t)=>{if(window.Razorpay)return void e();const n=document.createElement("script");n.src="https://checkout.razorpay.com/v1/checkout.js",n.async=!0,n.onload=()=>e(),n.onerror=()=>t(new Error("Failed to load Razorpay SDK")),document.body.appendChild(n)})}catch{return u.error("Could not load payment SDK. Check your internet connection."),void l(!1)}new window.Razorpay({key:"rzp_test_RijBJLqfQOXRu1",order_id:r,amount:100*i,currency:"INR",name:"Bhada Security Deposit",description:"One-time refundable security deposit",handler:async t=>{var i,s;d(!0);try{await(e=>An.post("/security-deposit/verify",e))({gatewayOrderId:r,razorpayPaymentId:t.razorpay_payment_id,razorpaySignature:t.razorpay_signature}),u.success("Security deposit paid successfully! 🎉"),n(),e()}catch(o){u.error((null==(s=null==(i=o.response)?void 0:i.data)?void 0:s.message)||"Verification failed. Contact support if amount was deducted.")}finally{d(!1)}},modal:{ondismiss:()=>l(!1)},theme:{color:"#00e5a0"}}).open()}catch(i){u.error((null==(r=null==(t=i.response)?void 0:t.data)?void 0:r.message)||"Failed to initiate payment"),l(!1)}},disabled:a,children:a?te.jsxs(te.Fragment,{children:[te.jsx(U,{size:13,style:{animation:"ksp 0.8s linear infinite"}})," Processing…"]}):`Pay ₹${(null==r?void 0:r.requiredAmount)??0}`})]})]})]})})}function vl(){var e,n,r;const{user:i,logout:s,updateRider:o,refreshOnboardingStatus:a,onboardingStatus:l}=Vn(),[c,d]=t.useState(null),[h,p]=t.useState(!0),[f,g]=t.useState(!1),[v,b]=t.useState(null),[y,_]=t.useState(null),w=t.useCallback(async()=>{var e;try{const{data:t}=await Bn();(null==(e=null==t?void 0:t.data)?void 0:e.status)?_(t.data.status):!1===(null==t?void 0:t.isRequired)&&_("PAID")}catch{}},[]),S=t.useCallback(async(e=!1)=>{var t;if(null==i?void 0:i.uid){e||p(!0);try{const{data:e}=await Pn.getById(i.uid),t=(null==e?void 0:e.data)||e;d(t),o(t)}catch(n){404===(null==(t=n.response)?void 0:t.status)?d(null):u.error("Failed to load profile")}finally{p(!1)}}},[null==i?void 0:i.uid]);if(t.useEffect(()=>{S(),w()},[S,w]),t.useEffect(()=>{const e=tr();if(!e)return;const t=({type:e})=>{["KYC_APPROVED","KYC_REJECTED","ONBOARDING_APPROVED","ONBOARDING_REJECTED"].includes(e)&&(S(!0),a())},n=({rider:e})=>{e&&(d(e),o(e))};return e.on("notification:new",t),e.on("rider:updated",n),()=>{e.off("notification:new",t),e.off("rider:updated",n)}},[S,a]),h)return te.jsx("div",{style:{minHeight:"100vh",background:"var(--bg-0)",display:"grid",placeItems:"center"},children:te.jsx("div",{className:"loader"})});const I=c,E=!!(null==I?void 0:I.firstName),T=!(!(null==(e=null==I?void 0:I.vehicle)?void 0:e.vehicleType)||!(null==(n=null==I?void 0:I.vehicle)?void 0:n.vehicleNumber))||!(!(null==I?void 0:I.vehicleType)||!(null==I?void 0:I.vehicleNumber)),R=(null==(r=null==I?void 0:I.kyc)?void 0:r.kycStatus)||(null==I?void 0:I.kycStatus)||"NOT_SUBMITTED",C="VERIFIED"===R?"APPROVED":R,U=l||(null==I?void 0:I.onboardingStatus)||"NOT_SUBMITTED",B=!(!(null==I?void 0:I.bankAccountNumber)&&!(null==I?void 0:I.upiId)),F="PAID"===y,M=[{id:"profile",Icon:k,title:"Personal Details",desc:"Your name and contact information",done:E,pending:!1,rejected:!1,canAct:!0,label:E?"Edit":"Complete Profile",action:()=>b("profile")},{id:"vehicle",Icon:j,title:"Vehicle Details",desc:"Vehicle type and registration number",done:T,pending:!1,rejected:!1,canAct:E,label:T?"Edit":"Add Vehicle",action:()=>b("vehicle")},{id:"kyc",Icon:x,title:"KYC Verification",desc:"Government-issued ID + photo of document",done:"APPROVED"===C,pending:"PENDING"===C,rejected:"REJECTED"===C,canAct:T&&"APPROVED"!==C&&"PENDING"!==C,label:"REJECTED"===C?"Resubmit KYC":"Submit KYC",action:()=>b("kyc")},{id:"bank",Icon:N,title:"Payout Account",desc:"Bank account or UPI ID for receiving payments",done:B,pending:!1,rejected:!1,canAct:"APPROVED"===C,label:B?"Edit Account":"Add Payout Account",action:()=>b("bank")},{id:"security_deposit",Icon:O,title:"Security Deposit",desc:"One-time refundable deposit required before approval",done:F,pending:!1,rejected:!1,canAct:B&&"APPROVED"===C&&!F,label:"PENDING_PAYMENT"===y?"Pay Deposit":"Pay Security Deposit",action:()=>b("security_deposit")},{id:"onboarding",Icon:A,title:"Submit Application",desc:"Send your application for admin review",done:"APPROVED"===U,pending:"PENDING"===U,rejected:"REJECTED"===U,canAct:"APPROVED"===C&&B&&F&&("NOT_SUBMITTED"===U||"REJECTED"===U),label:"REJECTED"===U?"Resubmit Application":"Submit Application",action:async()=>{var e,t;try{await Pn.submitOnboarding(i.uid),u.success("Application submitted! Waiting for admin approval."),await Promise.all([S(!0),a()])}catch(n){u.error((null==(t=null==(e=n.response)?void 0:e.data)?void 0:t.message)||"Submission failed")}}}],z=M.filter(e=>e.done).length,V=Math.round(z/M.length*100),$={done:{border:"rgba(54,211,153,0.2)",iconBg:"var(--green-dim)",iconColor:"var(--green)"},pending:{border:"rgba(255,154,60,0.2)",iconBg:"var(--orange-dim)",iconColor:"var(--orange)"},rejected:{border:"rgba(255,77,109,0.2)",iconBg:"var(--red-dim)",iconColor:"var(--red)"},active:{border:"rgba(0,229,160,0.25)",iconBg:"var(--accent-dim)",iconColor:"var(--accent)"},locked:{border:"var(--border)",iconBg:"var(--bg-3)",iconColor:"var(--text-2)"}},W=(e,t)=>"done"===t?te.jsx("span",{style:{color:"var(--green)"},children:"✓ Verified & complete"}):"pending"===t?te.jsx("span",{style:{color:"var(--orange)"},children:"⏳ Under admin review"}):"rejected"===t?te.jsx("span",{style:{color:"var(--red)"},children:"✗ Rejected — tap to resubmit"}):te.jsx("span",{style:{color:"var(--text-2)"},children:e.desc});return te.jsxs("div",{style:{minHeight:"100vh",background:"var(--bg-0)",display:"flex",flexDirection:"column"},children:[te.jsxs("div",{style:{padding:"16px 20px",background:"var(--bg-1)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[te.jsx("div",{style:{width:34,height:34,background:"var(--accent)",borderRadius:10,display:"grid",placeItems:"center",color:"var(--bg-0)",fontFamily:"var(--font-display)",fontWeight:800,fontSize:16},children:"B"}),te.jsxs("div",{children:[te.jsx("div",{style:{fontFamily:"var(--font-display)",fontWeight:700,fontSize:15},children:"Bhada Rider"}),te.jsx("div",{style:{fontSize:10,color:"var(--text-2)",fontFamily:"var(--font-mono)",letterSpacing:"0.06em"},children:"ONBOARDING"})]})]}),te.jsxs("button",{className:"btn btn-ghost btn-sm",onClick:s,style:{gap:6,fontSize:12,color:"var(--text-2)"},children:[te.jsx(P,{size:13})," Sign Out"]})]}),te.jsxs("div",{style:{flex:1,padding:"24px 16px",maxWidth:480,margin:"0 auto",width:"100%"},children:[te.jsxs("div",{style:{marginBottom:24},children:[te.jsxs("div",{style:{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:4},children:["Welcome",(null==I?void 0:I.firstName)?`, ${I.firstName}`:"","! 👋"]}),te.jsx("div",{style:{fontSize:13,color:"var(--text-2)"},children:"Complete all steps below to start delivering with Bhada."})]}),te.jsxs("div",{style:{marginBottom:24},children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[te.jsx("span",{style:{fontSize:12,color:"var(--text-2)",fontFamily:"var(--font-mono)"},children:"PROGRESS"}),te.jsxs("span",{style:{fontSize:12,color:"var(--accent)",fontFamily:"var(--font-mono)",fontWeight:600},children:[V,"%"]})]}),te.jsx("div",{style:{height:6,background:"var(--bg-3)",borderRadius:99,overflow:"hidden"},children:te.jsx("div",{style:{height:"100%",width:`${V}%`,background:"var(--accent)",borderRadius:99,transition:"width 0.4s ease",boxShadow:"0 0 10px var(--accent-glow)"}})}),te.jsxs("div",{style:{fontSize:11,color:"var(--text-2)",marginTop:6},children:[z," of ",M.length," steps completed"]})]}),"PENDING"===U&&te.jsxs("div",{style:{padding:"14px 16px",marginBottom:20,background:"var(--orange-dim)",border:"1px solid rgba(255,154,60,0.2)",borderRadius:12,display:"flex",alignItems:"flex-start",gap:12},children:[te.jsx("span",{style:{fontSize:20,flexShrink:0},children:"⏳"}),te.jsxs("div",{children:[te.jsx("div",{style:{fontWeight:600,color:"var(--orange)",marginBottom:3},children:"Application Under Review"}),te.jsx("div",{style:{fontSize:12,color:"var(--text-1)",lineHeight:1.5},children:"You'll be notified instantly when approved. Tap to manually refresh."}),te.jsxs("button",{className:"btn btn-sm",style:{marginTop:10,background:"var(--orange-dim)",color:"var(--orange)",border:"1px solid rgba(255,154,60,0.3)"},onClick:async()=>{g(!0),await Promise.all([a(),S(!0),w()]),g(!1),u.success("Status refreshed")},disabled:f,children:[te.jsx(m,{size:12,style:{animation:f?"ksp 0.7s linear infinite":"none"}}),f?"Checking…":"Check Status"]})]})]}),"REJECTED"===U&&te.jsxs("div",{style:{padding:"14px 16px",marginBottom:20,background:"var(--red-dim)",border:"1px solid rgba(255,77,109,0.2)",borderRadius:12,display:"flex",gap:12},children:[te.jsx("span",{style:{fontSize:20,flexShrink:0},children:"✗"}),te.jsxs("div",{children:[te.jsx("div",{style:{fontWeight:600,color:"var(--red)",marginBottom:3},children:"Application Rejected"}),te.jsx("div",{style:{fontSize:12,color:"var(--text-1)"},children:"Update your details and resubmit below."})]})]}),"REJECTED"===C&&"REJECTED"!==U&&te.jsxs("div",{style:{padding:"14px 16px",marginBottom:20,background:"var(--red-dim)",border:"1px solid rgba(255,77,109,0.2)",borderRadius:12,display:"flex",gap:12},children:[te.jsx("span",{style:{fontSize:20,flexShrink:0},children:"⚠️"}),te.jsxs("div",{children:[te.jsx("div",{style:{fontWeight:600,color:"var(--red)",marginBottom:3},children:"KYC Rejected"}),te.jsx("div",{style:{fontSize:12,color:"var(--text-1)"},children:"Resubmit with a clear, readable photo of your ID."})]})]}),te.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10,marginBottom:24},children:M.map(e=>{var t,n;const r=(i=e).done?"done":i.pending?"pending":i.rejected?"rejected":i.canAct?"active":"locked";var i;const s=$[r],{Icon:o}=e;return te.jsxs("div",{style:{background:"var(--bg-1)",border:`1px solid ${s.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,opacity:"locked"===r?.5:1,transition:"all 0.2s ease"},children:[te.jsx("div",{style:{width:40,height:40,borderRadius:10,flexShrink:0,display:"grid",placeItems:"center",background:s.iconBg,color:s.iconColor},children:"done"===r?te.jsx(D,{size:18}):te.jsx(o,{size:18})}),te.jsxs("div",{style:{flex:1,minWidth:0},children:[te.jsx("div",{style:{fontWeight:600,fontSize:14,color:"locked"===r?"var(--text-2)":"var(--text-0)",marginBottom:2},children:e.title}),te.jsx("div",{style:{fontSize:12},children:W(e,r)}),"kyc"===e.id&&((null==(t=null==I?void 0:I.kyc)?void 0:t.documentUrl)||(null==I?void 0:I.documentUrl))&&("done"===r||"pending"===r)&&te.jsxs("a",{href:(null==(n=I.kyc)?void 0:n.documentUrl)||I.documentUrl,target:"_blank",rel:"noreferrer",style:{display:"inline-flex",alignItems:"center",gap:4,marginTop:5,fontSize:10,color:"var(--blue)",background:"var(--blue-dim)",padding:"2px 8px",borderRadius:4,textDecoration:"none"},children:[te.jsx(L,{size:9})," View submitted doc"]}),"bank"===e.id&&"done"===r&&te.jsx("div",{style:{marginTop:4,fontSize:11,color:"var(--text-2)",fontFamily:"var(--font-mono)"},children:(null==I?void 0:I.upiId)?`UPI: ${I.upiId}`:(null==I?void 0:I.bankAccountNumber)?`A/C: ••••${I.bankAccountNumber.slice(-4)} · ${I.bankIfscCode||""}`:"Account saved"}),"security_deposit"===e.id&&"done"===r&&te.jsx("div",{style:{marginTop:4,fontSize:11,color:"var(--green)",fontFamily:"var(--font-mono)"},children:"✓ Deposit paid & verified"})]}),e.canAct&&!e.done&&!e.pending&&te.jsx("button",{className:"btn btn-sm "+("rejected"===r?"btn-danger":"btn-primary"),style:{flexShrink:0,fontSize:12},onClick:e.action,children:e.label}),"locked"===r&&te.jsx("span",{style:{fontSize:18,flexShrink:0},children:"🔒"})]},e.id)})}),te.jsx("div",{style:{textAlign:"center",fontSize:12,color:"var(--text-2)"},children:"Need help? Contact Bhada support."})]}),"profile"===v&&te.jsx(hl,{uid:i.uid,riderData:I,onClose:()=>b(null),onSave:()=>S(!0)}),"vehicle"===v&&te.jsx(pl,{uid:i.uid,riderData:I,onClose:()=>b(null),onSave:()=>S(!0)}),"kyc"===v&&te.jsx(fl,{uid:i.uid,riderData:I,onClose:()=>b(null),onSave:()=>S(!0)}),"bank"===v&&te.jsx(ml,{uid:i.uid,riderData:I,onClose:()=>b(null),onSave:()=>S(!0)}),"security_deposit"===v&&te.jsx(gl,{onClose:()=>b(null),onPaid:()=>{_("PAID"),w()}}),te.jsx("style",{children:"@keyframes ksp{to{transform:rotate(360deg)}}"})]})}const bl=Tn("Location"),yl={enableHighAccuracy:!1,maximumAge:3e4,timeout:5e3},_l={enableHighAccuracy:!0,maximumAge:3e3,timeout:1e4};let wl=null,xl=null,Sl=null,Il=null,El=null,kl=!1,Tl=null,Rl=null;function Cl(){if(!Sl)return!1;if(!Il)return!0;const e=function(e,t){const n=e=>e*Math.PI/180,r=e.coords.latitude,i=e.coords.longitude,s=t.coords.latitude,o=t.coords.longitude,a=n(s-r),l=n(o-i),c=Math.sin(a/2)**2+Math.cos(n(r))*Math.cos(n(s))*Math.sin(l/2)**2;return 12742e3*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))}(Sl,Il);return e>=15&&(bl.debug("Emit triggered by movement",{distMetres:Math.round(e)}),!0)}function jl(e=!1){Sl&&(null==El?void 0:El.connected)&&(e||Cl())&&(El.emit("rider:location",function(e){const{latitude:t,longitude:n,accuracy:r,heading:i,speed:s}=e.coords;return{latitude:t,longitude:n,accuracy:r||0,heading:i||null,speed:s||null,timestamp:Date.now()}}(Sl)),Il=Sl,bl.debug("Location emitted",{lat:Sl.coords.latitude.toFixed(5),lng:Sl.coords.longitude.toFixed(5)}))}function Nl(e){if(Tl&&(null==El||El.off("connect",Tl),Tl=null),null==El?void 0:El.connected)return jl(!0),void(null==e||e());Tl=()=>{jl(!0),null==e||e(),Tl=null},null==El||El.once("connect",Tl)}function Ol(e){Tl&&El&&(El.off("connect",Tl),Tl=null),El=e,null!==xl&&e&&(bl.info("Socket replaced — will emit on next connect"),Nl(null))}function Al(){Tl&&El&&(El.off("connect",Tl),Tl=null),Rl&&(Rl(),Rl=null),null!==wl&&(navigator.geolocation.clearWatch(wl),wl=null),null!==xl&&(clearInterval(xl),xl=null),El=null,Il=null,bl.info("Tracking stopped")}function Pl(){const[e,n]=t.useState({}),r=t.useRef({});return{guard:t.useCallback(async(e,t="__default__")=>{if(!r.current[t]){r.current[t]=!0,n(e=>({...e,[t]:!0}));try{await e()}finally{r.current[t]=!1,n(e=>{const n={...e};return delete n[t],n})}}},[]),isLoading:t.useCallback((t="__default__")=>!!e[t],[e]),anyLoading:Object.keys(e).length>0}}const Dl=Tn("useRiderStatus");function Ll(){const{user:e,rider:n,updateRider:r}=Vn(),[i,s]=t.useState(n||null),[o,a]=t.useState(null),[l,c]=t.useState(!0),[d,h]=t.useState(!1),{guard:p,isLoading:f}=Pl(),m=t.useRef(!1),g=t.useRef(null),v=t.useRef(!0);t.useEffect(()=>(v.current=!0,()=>{v.current=!1}),[]);const b=t.useCallback(e=>{const t=["ONLINE","AVAILABLE","BUSY"].includes(e);if(t&&!m.current){const t=tr();t?(function(e,t){var n;e&&navigator.geolocation?(El=e,Rl&&Rl(),n=Ol,Yn.add(n),Rl=()=>Yn.delete(n),Sl?Nl(t):navigator.geolocation.getCurrentPosition(e=>{Sl=e,Nl(t)},e=>bl.warn("First-fix failed",e.message),{...yl,timeout:8e3}),null===wl&&(wl=navigator.geolocation.watchPosition(e=>{Sl=e,Cl()&&jl(!0)},e=>bl.warn("watchPosition error",e.message),_l)),null===xl&&(xl=setInterval(()=>jl(!0),5e3)),bl.info("Tracking started")):bl.warn("Cannot start tracking — missing socket or geolocation")}(t,()=>{v.current&&h(!0)}),m.current=!0,g.current&&(clearTimeout(g.current),g.current=null),Dl.info("GPS tracking started",{status:e})):(Dl.warn("Socket not ready — retrying tracking in 300ms"),g.current=setTimeout(()=>{g.current=null,b(e)},300))}else!t&&m.current&&(Al(),m.current=!1,v.current&&h(!1),Dl.info("GPS tracking stopped",{status:e}))},[]),y=t.useCallback(async()=>{var t,n;if(null==e?void 0:e.uid){c(!0);try{const[i,o]=await Promise.allSettled([Pn.getById(e.uid),Pn.getPerformance(e.uid)]);if(!v.current)return;if("fulfilled"===i.status){const e=(null==(t=i.value.data)?void 0:t.data)||i.value.data;s(e),r(e);const n=(null==e?void 0:e.riderAvailabilityStatus)||(null==e?void 0:e.status);b(n),Dl.info("Rider data loaded",{status:n})}else Dl.error("Failed to load rider data",i.reason),u.error("Failed to load rider data");"fulfilled"===o.status&&a((null==(n=o.value.data)?void 0:n.data)||o.value.data)}finally{v.current&&c(!1)}}},[null==e?void 0:e.uid,b,r]);t.useEffect(()=>{y(),!kl&&navigator.geolocation&&navigator.geolocation.getCurrentPosition(e=>{Sl=e,kl=!0,bl.info("GPS warmed up")},e=>{bl.warn("GPS warmup failed",e.message),kl=!0},yl)},[y]),t.useEffect(()=>{const t=t=>{const n=t.detail,i=(null==n?void 0:n.riderUid)||(null==n?void 0:n.uid)||(null==n?void 0:n.id);if(!i||i!==(null==e?void 0:e.uid))return;const o=n.rider||n;if(!v.current)return;s(e=>e?{...e,...o}:o),r(o);const a=(null==o?void 0:o.riderAvailabilityStatus)||(null==o?void 0:o.status);a&&b(a),Dl.info("Rider updated via WebSocket",{status:a})};return window.addEventListener("ws:rider:updated",t),()=>window.removeEventListener("ws:rider:updated",t)},[null==e?void 0:e.uid,b,r]),t.useEffect(()=>()=>{m.current&&(Al(),m.current=!1),g.current&&(clearTimeout(g.current),g.current=null)},[]);const _=t.useCallback(async t=>{(null==e?void 0:e.uid)&&(Dl.action("rider_status_change",{action:t,riderId:e.uid}),await p(async()=>{var n;let i;if("online"===t)i=await Pn.goOnline(e.uid);else if("offline"===t)i=await Pn.goOffline(e.uid);else if("break"===t)i=await Pn.takeBreak(e.uid);else{if("resume"!==t)throw new Error(`Unknown status action: ${t}`);i=await Pn.resume(e.uid)}const o=(null==(n=i.data)?void 0:n.data)||i.data;if(o&&v.current){s(o),r(o);const e=(null==o?void 0:o.riderAvailabilityStatus)||(null==o?void 0:o.status);b(e),Dl.info("Status changed",{action:t,status:e})}u.success("Status updated")},`status_${t}`))},[null==e?void 0:e.uid,p,b,r]),w=(null==i?void 0:i.riderAvailabilityStatus)||(null==i?void 0:i.status)||"OFFLINE",x=["ONLINE","AVAILABLE","BUSY"].includes(w);return{riderData:i,performance:o,loading:l,loadingStatus:f("status_online")||f("status_offline")||f("status_break")||f("status_resume"),tracking:d,currentStatus:w,isOnline:x,changeStatus:_,refresh:y}}const Ul=Tn("useOrders");function Bl({autoFetch:e=!0}={}){const[n,r]=t.useState([]),[i,s]=t.useState([]),[o,a]=t.useState(e),[l,c]=t.useState(!1),[d,h]=t.useState(null),p=t.useRef(!0);t.useEffect(()=>(p.current=!0,()=>{p.current=!1}),[]);const f=t.useCallback(async({silent:e=!1}={})=>{var t,n,i,o,l,d,u,f;if(p.current){e?c(!0):a(!0),h(null);try{const[e,a]=await Promise.allSettled([Dn.getAvailable(),Dn.getMyOrders()]);if(!p.current)return;"fulfilled"===e.status?(r((null==(t=e.value.data)?void 0:t.data)??[]),Ul.debug("Available orders loaded",{count:null==(i=null==(n=e.value.data)?void 0:n.data)?void 0:i.length})):Ul.warn("Failed to load available orders",null==(o=e.reason)?void 0:o.message),"fulfilled"===a.status?(s((null==(l=a.value.data)?void 0:l.data)??[]),Ul.debug("My orders loaded",{count:null==(u=null==(d=a.value.data)?void 0:d.data)?void 0:u.length})):Ul.warn("Failed to load my orders",null==(f=a.reason)?void 0:f.message)}catch(m){Ul.error("fetchOrders unexpected error",m),e||h("Failed to load orders")}finally{p.current&&(a(!1),c(!1))}}},[]);return t.useEffect(()=>{e&&f()},[e,f]),t.useEffect(()=>{const e=e=>{const t=e.detail;if(null==t?void 0:t.orderId)if(Ul.debug("ws:order:updated received",{orderId:t.orderId,status:t.status}),"PLACED"!==t.status){if("CANCELLED"===t.status)return r(e=>e.filter(e=>(e.orderId||e.id)!==t.orderId)),void s(e=>e.filter(e=>(e.orderId||e.id)!==t.orderId));s(e=>e.some(e=>(e.orderId||e.id)===t.orderId)?e.map(e=>(e.orderId||e.id)===t.orderId?{...e,...t}:e):t.assignedRiderId?[t,...e]:e),r(e=>e.filter(e=>(e.orderId||e.id)!==t.orderId))}else f({silent:!0})},t=e=>{"ORDER_AVAILABLE"===(null==e?void 0:e.type)&&(f({silent:!0}),u("📦 New order available!",{duration:3e3}))};window.addEventListener("ws:order:updated",e);const n=tr();return null==n||n.on("notification:new",t),()=>{window.removeEventListener("ws:order:updated",e),null==n||n.off("notification:new",t)}},[f]),{availableOrders:n,myOrders:i,loading:o,refreshing:l,error:d,refetch:()=>f({silent:!1}),refetchSilent:()=>f({silent:!0}),placedOrders:n.filter(e=>"PLACED"===e.status),activeOrders:i.filter(e=>["READY","DISPATCHED"].includes(e.status))}}function Fl({height:e=16,width:t="100%",borderRadius:n,style:r={}}){return te.jsx("span",{className:"skeleton",style:{height:e,width:"number"==typeof t?`${t}px`:t,borderRadius:n||"var(--r-sm)",...r}})}function Ml({rows:e=3}){return te.jsxs("div",{className:"card",style:{display:"flex",flexDirection:"column",gap:12},children:[te.jsxs("div",{style:{display:"flex",gap:10},children:[te.jsx(Fl,{width:46,height:46,borderRadius:"var(--r-md)"}),te.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:8},children:[te.jsx(Fl,{height:13,width:"55%"}),te.jsx(Fl,{height:11,width:"35%"})]})]}),e>1&&Array.from({length:e-1}).map((e,t)=>te.jsx(Fl,{height:13,width:65-15*t+"%"},t))]})}function zl(){return te.jsx("div",{style:{background:"var(--bg-1)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",padding:"16px",boxShadow:"var(--shadow-card)"},children:te.jsxs("div",{style:{display:"flex",gap:12,alignItems:"flex-start"},children:[te.jsx(Fl,{width:46,height:46,borderRadius:"var(--r-md)"}),te.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:8},children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[te.jsx(Fl,{height:11,width:90}),te.jsx(Fl,{height:20,width:70,borderRadius:99})]}),te.jsxs("div",{style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"9px 11px",display:"flex",flexDirection:"column",gap:8},children:[te.jsx(Fl,{height:12,width:"70%"}),te.jsx(Fl,{height:12,width:"55%"})]}),te.jsxs("div",{style:{display:"flex",gap:6},children:[te.jsx(Fl,{height:20,width:44,borderRadius:99}),te.jsx(Fl,{height:20,width:40,borderRadius:99}),te.jsx(Fl,{height:20,width:32,borderRadius:99})]})]})]})})}function Vl(){return te.jsx("div",{className:"metric-row-4",children:[0,1,2,3].map(e=>te.jsxs("div",{className:"metric-card",children:[te.jsx(Fl,{height:10,width:"60%",style:{marginBottom:8}}),te.jsx(Fl,{height:24,width:"70%",style:{marginBottom:6}}),te.jsx(Fl,{height:10,width:"45%"})]},e))})}function $l(){return te.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:14},children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2},children:[te.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[te.jsx(Fl,{height:13,width:70}),te.jsx(Fl,{height:24,width:130,borderRadius:"var(--r-sm)"})]}),te.jsx(Fl,{width:36,height:36,borderRadius:"var(--r-sm)"})]}),te.jsxs("div",{className:"card",children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},children:[te.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[te.jsx(Fl,{height:10,width:80}),te.jsx(Fl,{height:28,width:110,borderRadius:99})]}),te.jsx("div",{style:{display:"flex",gap:8},children:te.jsx(Fl,{height:32,width:90,borderRadius:"var(--r-sm)"})})]}),te.jsx(Fl,{height:14,width:"65%"})]}),te.jsxs("div",{className:"card",children:[te.jsx(Fl,{height:16,width:110,style:{marginBottom:14}}),te.jsx(Vl,{})]}),te.jsxs("div",{className:"card",children:[te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:14},children:[te.jsx(Fl,{height:16,width:130}),te.jsx(Fl,{height:20,width:28,borderRadius:99})]}),[0,1].map(e=>te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:e<1?"1px solid var(--border)":"none"},children:[te.jsx(Fl,{height:12,width:80}),te.jsx(Fl,{height:20,width:55,borderRadius:99})]},e))]})]})}const Wl=t.memo(function({icon:e,label:t,value:n,sub:r,valueColor:i}){return te.jsxs("div",{className:"metric-card",children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:8},children:[e&&te.jsx(e,{size:11,style:{color:"var(--text-2)"}}),te.jsx("div",{className:"metric-label",style:{marginBottom:0},children:t})]}),te.jsx("div",{className:"metric-value",style:{color:i||"var(--text-0)"},children:n}),r&&te.jsx("div",{className:"metric-sub",children:r})]})}),Hl=t.memo(function({performance:e,t:t}){var n;return e?te.jsxs("div",{className:"card mb-12",children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:14},children:[te.jsx("div",{style:{width:30,height:30,borderRadius:"var(--r-sm)",background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center"},children:te.jsx(F,{size:15,style:{color:"var(--accent)"}})}),te.jsx("div",{className:"section-header",style:{marginBottom:0},children:t("performance")})]}),te.jsxs("div",{className:"metric-row-4",children:[te.jsx(Wl,{icon:_,label:t("orders_label"),value:(null==e?void 0:e.totalDeliveries)??0,sub:t("all_time")}),te.jsx(Wl,{icon:M,label:t("rating_label"),value:`★ ${(null==(n=(null==e?void 0:e.rating)??(null==e?void 0:e.averageRating))?void 0:n.toFixed(1))??"—"}`,sub:`${(null==e?void 0:e.totalRatingsCount)??0} ${t("reviews")}`,valueColor:"var(--yellow)"}),te.jsx(Wl,{icon:z,label:t("success_label"),value:null!=(null==e?void 0:e.successRate)?`${e.successRate}%`:"—",sub:t("rate"),valueColor:"var(--accent)"}),te.jsx(Wl,{icon:I,label:t("earnings_label"),value:`₹${(((null==e?void 0:e.totalEarnings)??0)/1e3).toFixed(1)}k`,sub:t("total"),valueColor:"var(--green)"})]})]}):null}),ql=t.memo(function({orders:e,t:t}){return te.jsxs("div",{className:"card",children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14},children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[te.jsx("div",{style:{width:30,height:30,borderRadius:"var(--r-sm)",background:"var(--blue-dim)",display:"flex",alignItems:"center",justifyContent:"center"},children:te.jsx(_,{size:15,style:{color:"var(--blue)"}})}),te.jsx("div",{className:"section-header",style:{marginBottom:0},children:t("available_orders")})]}),te.jsx("span",{className:"badge blue",children:e.length})]}),0===e.length?te.jsx("div",{style:{textAlign:"center",padding:"20px 0",color:"var(--text-2)",fontSize:13},children:t("no_orders_now")}):te.jsxs("div",{children:[e.slice(0,3).map((t,n)=>{var r,i;return te.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:n<Math.min(e.length,3)-1?"1px solid var(--border)":"none"},children:[te.jsxs("div",{children:[te.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-2)",fontWeight:600},children:["#",(t.orderId||t.id||"").slice(-8).toUpperCase()]}),te.jsxs("div",{style:{fontSize:12,color:"var(--text-1)",marginTop:2,fontWeight:500},children:[(null==(r=t.items)?void 0:r.length)||0," item",1!==((null==(i=t.items)?void 0:i.length)||0)?"s":""]})]}),te.jsx("span",{className:"badge blue",children:"NEW"})]},t.orderId||t.id)}),e.length>3&&te.jsxs("div",{style:{textAlign:"center",paddingTop:12,fontSize:12,color:"var(--text-2)",fontWeight:500},children:["+",e.length-3," ",t("more_in_orders_tab")]})]})]})});function Kl(){const{riderData:e,performance:n,loading:r,loadingStatus:i,tracking:s,currentStatus:o,isOnline:a,changeStatus:l,refresh:c}=Ll(),{placedOrders:d}=Bl({autoFetch:a}),{isOnline:h}=function(){const[e,n]=t.useState("undefined"==typeof navigator||navigator.onLine);return t.useEffect(()=>{const e=()=>{n(!0),u.success("Back online — reconnecting…",{id:"network-status",duration:3e3,icon:"🌐"})},t=()=>{n(!1),u.error("No internet connection",{id:"network-status",duration:1/0,icon:"📵"})};return window.addEventListener("online",e),window.addEventListener("offline",t),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",t)}},[]),{isOnline:e}}(),{t:p}=hr(),f=function(e){return{ONLINE:{label:e("status_online"),color:"online",dot:"green"},AVAILABLE:{label:e("status_online"),color:"online",dot:"green"},OFFLINE:{label:e("status_offline"),color:"offline",dot:"red"},ON_BREAK:{label:e("status_on_break"),color:"break",dot:"orange"},BUSY:{label:e("status_busy"),color:"online",dot:"green"}}}(p),g=f[o]||f.OFFLINE,v=e&&"APPROVED"!==e.onboardingStatus,b=(null==e?void 0:e.firstName)||"Rider";return r?te.jsx("div",{className:"page-enter",children:te.jsx($l,{})}):te.jsxs("div",{className:"page-enter",children:[!h&&te.jsx("div",{style:{padding:"10px 14px",marginBottom:14,borderRadius:"var(--r-md)",background:"rgba(255,71,87,0.1)",border:"1px solid rgba(255,71,87,0.2)",fontSize:12,fontWeight:600,color:"var(--red)",display:"flex",alignItems:"center",gap:8},children:p("no_internet")}),te.jsxs("div",{className:"flex items-center justify-between mb-16",children:[te.jsxs("div",{children:[te.jsx("div",{style:{fontSize:12,color:"var(--text-2)",fontWeight:500,marginBottom:3},children:p("welcome_back")}),te.jsxs("div",{style:{fontSize:24,fontWeight:800,color:"var(--text-0)",letterSpacing:"-0.04em",lineHeight:1},children:[b," 👋"]})]}),te.jsx("button",{onClick:c,style:{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--text-1)"},children:te.jsx(m,{size:15})})]}),v&&te.jsx("div",{className:"card mb-12",style:{background:"rgba(255,140,66,0.08)",borderColor:"rgba(255,140,66,0.22)",marginBottom:14},children:te.jsxs("div",{className:"flex items-center gap-12",children:[te.jsx("div",{style:{width:36,height:36,borderRadius:"var(--r-md)",background:"rgba(255,140,66,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:te.jsx(w,{size:18,style:{color:"var(--orange)"}})}),te.jsxs("div",{children:[te.jsx("div",{style:{fontWeight:700,color:"var(--orange)",fontSize:14,letterSpacing:"-0.02em"},children:p("onboarding_pending")}),te.jsxs("div",{style:{fontSize:12,color:"var(--text-2)",marginTop:3,fontWeight:500},children:["Status: ",te.jsx("span",{style:{color:"var(--text-1)",fontFamily:"var(--font-mono)",fontWeight:600},children:(null==e?void 0:e.onboardingStatus)||"NOT_SUBMITTED"})]})]})]})}),te.jsxs("div",{className:"card mb-12",children:[te.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14},children:[te.jsxs("div",{children:[te.jsx("div",{style:{fontSize:10,fontWeight:700,color:"var(--text-2)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8},children:p("availability")}),te.jsxs("span",{className:`status-pill ${g.color}`,children:[te.jsx("span",{className:`status-dot ${g.dot}`}),g.label]})]}),!v&&te.jsxs("div",{className:"flex gap-6",children:["OFFLINE"===o&&te.jsxs("button",{className:"btn btn-primary btn-sm",onClick:()=>l("online"),disabled:i,children:[te.jsx(V,{size:13})," ",p("go_online")]}),a&&te.jsxs(te.Fragment,{children:[te.jsxs("button",{className:"btn btn-secondary btn-sm",onClick:()=>l("break"),disabled:i,children:[te.jsx($,{size:13})," ",p("take_break")]}),te.jsx("button",{className:"btn btn-danger btn-sm",onClick:()=>l("offline"),disabled:i,children:te.jsx(W,{size:13})})]}),"ON_BREAK"===o&&te.jsxs(te.Fragment,{children:[te.jsxs("button",{className:"btn btn-primary btn-sm",onClick:()=>l("resume"),disabled:i,children:[te.jsx(V,{size:13})," ",p("resume")]}),te.jsx("button",{className:"btn btn-danger btn-sm",onClick:()=>l("offline"),disabled:i,children:te.jsx(W,{size:13})})]})]})]}),te.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[a&&te.jsxs(te.Fragment,{children:[te.jsx("div",{style:{flex:1,fontSize:12,color:"var(--text-2)",fontWeight:500},children:p("visible_to_customers")}),s?te.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:4,background:"var(--accent-dim)",border:"1px solid rgba(30,198,116,0.25)",borderRadius:99,padding:"3px 9px",fontSize:10,fontWeight:700,color:"var(--accent)",letterSpacing:"0.04em"},children:[te.jsx(H,{size:9,style:{animation:"pulse 2s ease-in-out infinite"}}),p("gps_on")]}):te.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:4,background:"var(--yellow-dim)",border:"1px solid rgba(255,209,102,0.2)",borderRadius:99,padding:"3px 9px",fontSize:10,fontWeight:700,color:"var(--yellow)",letterSpacing:"0.04em"},children:[te.jsx(H,{size:9,style:{animation:"pulse 1s ease-in-out infinite"}}),p("locating")]})]}),"OFFLINE"===o&&te.jsx("span",{style:{fontSize:12,color:"var(--text-2)",fontWeight:500},children:p("go_online_to_receive")}),"ON_BREAK"===o&&te.jsx("span",{style:{fontSize:12,color:"var(--orange)",fontWeight:600},children:p("on_break_paused")})]})]}),te.jsx(Hl,{performance:n,t:p}),a&&te.jsx(ql,{orders:d,t:p}),te.jsx("style",{children:"@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}"})]})}const Gl=t.lazy(()=>se(()=>import("./OrdersPage-oi2WUK5f.js"),__vite__mapDeps([0,1,2,3,4]))),Jl=t.lazy(()=>se(()=>import("./OrderDetailPage-DhfxBMAx.js"),__vite__mapDeps([5,1,3,2,4]))),Yl=t.lazy(()=>se(()=>import("./IncomePage-D584_lu5.js"),__vite__mapDeps([6,1,3,2,4]))),Xl=t.lazy(()=>se(()=>import("./RoutesAreasPage-BBH1_DHn.js"),__vite__mapDeps([7,1,3,2,4]))),Ql=t.lazy(()=>se(()=>import("./ProfilePage-CxgB2CzN.js"),__vite__mapDeps([8,1,3,2,4])));function Zl(){return te.jsx("div",{style:{padding:"24px 16px",display:"flex",flexDirection:"column",gap:12},children:[80,160,100,140].map((e,t)=>te.jsx("div",{className:"skeleton",style:{height:e,borderRadius:12}},t))})}const ec=()=>te.jsx("div",{className:"loading-center",style:{minHeight:"100vh"},children:te.jsx("div",{className:"loader"})});function tc({children:e}){const{user:t,loading:n}=Vn();return n?te.jsx(ec,{}):t?te.jsx(d,{to:"/",replace:!0}):e}function nc({children:e}){const{user:t,loading:n,isApproved:r}=Vn();return n?te.jsx(ec,{}):t?r?e:te.jsx(d,{to:"/onboarding",replace:!0}):te.jsx(d,{to:"/login",replace:!0})}function rc({children:e}){const{user:t,loading:n,isApproved:r}=Vn();return n?te.jsx(ec,{}):t?r?te.jsx(d,{to:"/",replace:!0}):e:te.jsx(d,{to:"/login",replace:!0})}function ic(){const{user:e,refreshOnboardingStatus:n,accessToken:r}=Vn();return te.jsx(ir,{accessToken:e?r:null,onOnboardingApproved:n,children:te.jsx(t.Suspense,{fallback:te.jsx(Zl,{}),children:te.jsxs(l,{children:[te.jsx(c,{path:"/login",element:te.jsx(tc,{children:te.jsx(cl,{})})}),te.jsx(c,{path:"/onboarding",element:te.jsx(rc,{children:te.jsx(vl,{})})}),te.jsxs(c,{path:"/",element:te.jsx(nc,{children:te.jsx(vr,{})}),children:[te.jsx(c,{index:!0,element:te.jsx(Kl,{})}),te.jsx(c,{path:"orders",element:te.jsx(Gl,{})}),te.jsx(c,{path:"orders/:id",element:te.jsx(Jl,{})}),te.jsx(c,{path:"income",element:te.jsx(Yl,{})}),te.jsx(c,{path:"routes",element:te.jsx(Xl,{})}),te.jsx(c,{path:"profile",element:te.jsx(Ql,{})})]}),te.jsx(c,{path:"*",element:te.jsx(d,{to:"/",replace:!0})})]})})})}function sc(){return te.jsx(br,{children:te.jsx(ar,{children:te.jsx(ur,{children:te.jsx(zn,{children:te.jsxs(a,{children:[te.jsx(h,{position:"top-center",toastOptions:{style:{background:"#131929",color:"#f0f4ff",border:"1px solid rgba(255,255,255,0.07)",fontFamily:"'Inter', sans-serif",fontSize:"13.5px",maxWidth:"360px"},success:{iconTheme:{primary:"#00e5a0",secondary:"#05080f"}},error:{iconTheme:{primary:"#ff4d6d",secondary:"#05080f"}}}}),te.jsx(ic,{})]})})})})})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).then(e=>{e.scope,e.addEventListener("updatefound",()=>{const t=e.installing;null==t||t.addEventListener("statechange",()=>{"installed"===t.state&&navigator.serviceWorker.controller&&window.dispatchEvent(new CustomEvent("sw:update-available"))})})}).catch(e=>{console.warn("[SW] Registration failed:",e)}),navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()})}),ne.createRoot(document.getElementById("root")).render(te.jsx(s.StrictMode,{children:te.jsx(sc,{})}));export{zl as S,Pl as a,Ml as b,Vn as c,lr as d,Un as e,hr as f,tr as g,te as j,Tn as l,Dn as o,Pn as r,Fn as s,Bl as u};
