﻿/*
 Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
*/
(function(){function f(b,a){var c=k.exec(b),d=k.exec(a);if(c){if(!c[2]&&"px"==d[2])return d[1];if("px"==c[2]&&!d[2])return d[1]+"px"}return a}function m(b){return{elements:{$:function(a){var c=a.attributes,c=c&&c["data-cke-realelement"],d=l(b,decodeURIComponent(c));if((c=(c=c&&new CKEDITOR.htmlParser.fragment.fromHtml(d))&&c.children[0])&&a.attributes["data-cke-resizable"]){var e=(new h(a)).rules;a=c.attributes;d=e.width;e=e.height;d&&(a.width=f(a.width,d));e&&(a.height=f(a.height,e))}return c}}}}
function l(b,a){var c=[],d=/^cke:/i,e=new CKEDITOR.htmlParser.filter({elements:{"^":function(a){d.test(a.name)&&(a.name=a.name.replace(d,""),c.push(a))},iframe:function(a){a.children=[]}}}),n=b.activeFilter,f=new CKEDITOR.htmlParser.basicWriter,g=CKEDITOR.htmlParser.fragment.fromHtml(a);e.applyTo(g);n.applyTo(g);CKEDITOR.tools.array.forEach(c,function(a){a.name="cke:"+a.name});g.writeHtml(f);return f.getHtml()}var h=CKEDITOR.htmlParser.cssStyle,g=CKEDITOR.tools.cssLength,k=/^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;
CKEDITOR.plugins.add("fakeobjects",{lang:"af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",init:function(b){b.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}","fakeobjects")},afterInit:function(b){var a=b.dataProcessor;(a=a&&a.htmlFilter)&&a.addRules(m(b),{applyToAll:!0})}});CKEDITOR.editor.prototype.createFakeElement=
function(b,a,c,d){var e=this.lang.fakeobjects,e=e[c]||e.unknown;a={"class":a,"data-cke-realelement":encodeURIComponent(b.getOuterHtml()),"data-cke-real-node-type":b.type,alt:e,title:e,align:b.getAttribute("align")||""};CKEDITOR.env.hc||(a.src=CKEDITOR.tools.transparentImageData);c&&(a["data-cke-real-element-type"]=c);d&&(a["data-cke-resizable"]=d,c=new h,d=b.getAttribute("width"),b=b.getAttribute("height"),d&&(c.rules.width=g(d)),b&&(c.rules.height=g(b)),c.populate(a));return this.document.createElement("img",
{attributes:a})};CKEDITOR.editor.prototype.createFakeParserElement=function(b,a,c,d){var e=this.lang.fakeobjects,e=e[c]||e.unknown,f;f=new CKEDITOR.htmlParser.basicWriter;b.writeHtml(f);f=f.getHtml();a={"class":a,"data-cke-realelement":encodeURIComponent(f),"data-cke-real-node-type":b.type,alt:e,title:e,align:b.attributes.align||""};CKEDITOR.env.hc||(a.src=CKEDITOR.tools.transparentImageData);c&&(a["data-cke-real-element-type"]=c);d&&(a["data-cke-resizable"]=d,d=b.attributes,b=new h,c=d.width,d=d.height,
void 0!==c&&(b.rules.width=g(c)),void 0!==d&&(b.rules.height=g(d)),b.populate(a));return new CKEDITOR.htmlParser.element("img",a)};CKEDITOR.editor.prototype.restoreRealElement=function(b){if(b.data("cke-real-node-type")!=CKEDITOR.NODE_ELEMENT)return null;var a=decodeURIComponent(b.data("cke-realelement")),a=l(this,a),a=CKEDITOR.dom.element.createFromHtml(a,this.document);if(b.data("cke-resizable")){var c=b.getStyle("width");b=b.getStyle("height");c&&a.setAttribute("width",f(a.getAttribute("width"),
c));b&&a.setAttribute("height",f(a.getAttribute("height"),b))}return a}})();