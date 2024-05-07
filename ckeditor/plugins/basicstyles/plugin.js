﻿/*
 Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
*/
CKEDITOR.plugins.add("basicstyles",{lang:"af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",icons:"bold,italic,underline,strike,subscript,superscript",hidpi:!0,init:function(a){var f=0,d=function(h,d,c,b){if(b){b=new CKEDITOR.style(b);var g=e[c];g.unshift(b);a.attachStyleStateChange(b,function(b){!a.readOnly&&
a.getCommand(c).setState(b)});a.addCommand(c,new CKEDITOR.styleCommand(b,{contentForms:g}));a.ui.addButton&&a.ui.addButton(h,{isToggle:!0,label:d,command:c,toolbar:"basicstyles,"+(f+=10)})}},e={bold:["strong","b",["span",function(a){a=a.styles["font-weight"];return"bold"==a||700<=+a}]],italic:["em","i",["span",function(a){return"italic"==a.styles["font-style"]}]],underline:["u",["span",function(a){return"underline"==a.styles["text-decoration"]}]],strike:["s","strike",["span",function(a){return"line-through"==
a.styles["text-decoration"]}]],subscript:["sub"],superscript:["sup"]},c=a.config,b=a.lang.basicstyles;d("Bold",b.bold,"bold",c.coreStyles_bold);d("Italic",b.italic,"italic",c.coreStyles_italic);d("Underline",b.underline,"underline",c.coreStyles_underline);d("Strike",b.strike,"strike",c.coreStyles_strike);d("Subscript",b.subscript,"subscript",c.coreStyles_subscript);d("Superscript",b.superscript,"superscript",c.coreStyles_superscript);a.setKeystroke([[CKEDITOR.CTRL+66,"bold"],[CKEDITOR.CTRL+73,"italic"],
[CKEDITOR.CTRL+85,"underline"]])},afterInit:function(a){if(a.config.coreStyles_toggleSubSup){var f=a.getCommand("subscript"),d=a.getCommand("superscript");if(f&&d)a.on("afterCommandExec",function(e){e=e.data.name;if("subscript"===e||"superscript"===e){var c="subscript"===e?d:f;("subscript"===e?f:d).state===CKEDITOR.TRISTATE_ON&&c.state===CKEDITOR.TRISTATE_ON&&(c.exec(a),a.fire("updateSnapshot"))}})}}});CKEDITOR.config.coreStyles_bold={element:"strong",overrides:"b"};
CKEDITOR.config.coreStyles_italic={element:"em",overrides:"i"};CKEDITOR.config.coreStyles_underline={element:"u"};CKEDITOR.config.coreStyles_strike={element:"s",overrides:"strike"};CKEDITOR.config.coreStyles_subscript={element:"sub"};CKEDITOR.config.coreStyles_superscript={element:"sup"};CKEDITOR.config.coreStyles_toggleSubSup=!1;