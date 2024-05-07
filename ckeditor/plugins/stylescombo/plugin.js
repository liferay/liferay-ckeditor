﻿/*
 Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
*/
(function(){CKEDITOR.plugins.add("stylescombo",{requires:"richcombo",lang:"af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",init:function(c){var k=c.config,h=c.lang.stylescombo,e={},l=[],m=[];c.on("stylesSet",function(a){if(a=a.data.styles){for(var b,f,d,n,g=0,h=a.length;g<h;g++)(b=a[g],c.blockless&&b.element in
CKEDITOR.dtd.$block||"string"==typeof b.type&&!CKEDITOR.style.customHandlers[b.type]||(f=b.name,n=b.language||c.langCode,b=new CKEDITOR.style(b),c.filter.customConfig&&!c.filter.check(b)))||(b._name=f,b._.enterMode=k.enterMode,b._.type=d=b.assignedTo||b.type,b._.weight=g+1E3*(d==CKEDITOR.STYLE_OBJECT?1:d==CKEDITOR.STYLE_BLOCK?2:3),b._.language=n,e[f]=b,l.push(b),m.push(b));l.sort(function(a,b){return a._.weight-b._.weight})}});c.on("stylesRemove",function(a){a=a.data&&a.data.type;var b=void 0===a,
f;for(f in e){var d=e[f];(b||d.type===a)&&c.removeStyle(d)}});c.ui.addRichCombo("Styles",{label:h.label,title:h.panelTitle,toolbar:"styles,10",allowedContent:m,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(k.contentsCss),multiSelect:!0,attributes:{"aria-label":h.panelTitle}},init:function(){var a,b,c,d,e,g,k;g=0;for(k=l.length;g<k;g++)a=l[g],b=a._name,d=a._.type,e=a._.definition.language,d!=c&&(this.startGroup(h["panelTitle"+String(d)]),c=d),this.add(b,a.type==CKEDITOR.STYLE_OBJECT?b:a.buildPreview(),
b,e);this.commit()},onClick:function(a){c.focus();c.fire("saveSnapshot");a=e[a];var b=c.elementPath();if(a.group&&a.removeStylesFromSameGroup(c))c.applyStyle(a);else c[a.checkActive(b,c)?"removeStyle":"applyStyle"](a);c.fire("saveSnapshot")},onRender:function(){c.on("selectionChange",function(a){var b=this.getValue();a=a.data.path.elements;for(var f=0,d=a.length,h;f<d;f++){h=a[f];for(var g in e)if(e[g].checkElementRemovable(h,!0,c)){g!=b&&this.setValue(g);return}}this.setValue("")},this)},onOpen:function(){var a=
c.getSelection(),a=a.getSelectedElement()||a.getStartElement()||c.editable(),a=c.elementPath(a),b=[0,0,0,0];this.showAll();this.unmarkAll();for(var f in e){var d=e[f],k=d._.type;d.checkApplicable(a,c,c.activeFilter)?b[k]++:this.hideItem(f);d.checkActive(a,c)&&this.mark(f)}b[CKEDITOR.STYLE_BLOCK]||this.hideGroup(h["panelTitle"+String(CKEDITOR.STYLE_BLOCK)]);b[CKEDITOR.STYLE_INLINE]||this.hideGroup(h["panelTitle"+String(CKEDITOR.STYLE_INLINE)]);b[CKEDITOR.STYLE_OBJECT]||this.hideGroup(h["panelTitle"+
String(CKEDITOR.STYLE_OBJECT)])},refresh:function(){var a=c.elementPath();if(a){for(var b in e)if(e[b].checkApplicable(a,c,c.activeFilter))return;this.setState(CKEDITOR.TRISTATE_DISABLED)}},reset:function(){e={};l=[]}})}})})();