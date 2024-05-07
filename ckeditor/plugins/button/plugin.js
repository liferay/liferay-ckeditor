﻿/*
 Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
*/
(function(){var c='\x3ca id\x3d"{id}" class\x3d"cke_button cke_button__{name} cke_button_{state} {cls}"'+(CKEDITOR.env.gecko&&!CKEDITOR.env.hc?"":" href\x3d\"javascript:void('{titleJs}')\"")+' title\x3d"{title}" tabindex\x3d"-1" hidefocus\x3d"true" role\x3d"button" aria-labelledby\x3d"{id}_label" aria-describedby\x3d"{id}_description" aria-haspopup\x3d"{hasArrow}" aria-disabled\x3d"{ariaDisabled}"{hasArrowAriaHtml}{toggleAriaHtml}';CKEDITOR.env.gecko&&CKEDITOR.env.mac&&(c+=' onkeypress\x3d"return false;"');
CKEDITOR.env.gecko&&(c+=' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');var m="";CKEDITOR.env.ie&&(m='return false;" onmouseup\x3d"CKEDITOR.tools.getMouseButton(event)\x3d\x3dCKEDITOR.MOUSE_BUTTON_LEFT\x26\x26');var c=c+(' onkeydown\x3d"return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus\x3d"return CKEDITOR.tools.callFunction({focusFn},event);" onclick\x3d"'+m+'CKEDITOR.tools.callFunction({clickFn},this);return false;"\x3e\x3cspan class\x3d"cke_button_icon cke_button__{iconName}_icon" style\x3d"{style}"')+
'\x3e\x26nbsp;\x3c/span\x3e\x3cspan id\x3d"{id}_label" class\x3d"cke_button_label cke_button__{name}_label" aria-hidden\x3d"false"\x3e{label}\x3c/span\x3e\x3cspan id\x3d"{id}_description" class\x3d"cke_button_label" aria-hidden\x3d"false"\x3e{ariaShortcutSpace}{ariaShortcut}\x3c/span\x3e{arrowHtml}\x3c/a\x3e',v=CKEDITOR.addTemplate("buttonArrow",'\x3cspan class\x3d"cke_button_arrow"\x3e'+(CKEDITOR.env.hc?"\x26#9660;":"")+"\x3c/span\x3e"),w=CKEDITOR.addTemplate("button",c);CKEDITOR.plugins.add("button",
{beforeInit:function(a){a.ui.addHandler(CKEDITOR.UI_BUTTON,CKEDITOR.ui.button.handler)}});CKEDITOR.UI_BUTTON="button";CKEDITOR.ui.button=function(a){CKEDITOR.tools.extend(this,a,{isToggle:a.isToggle||!1,title:a.label,click:a.click||function(b){b.execCommand(a.command)}});this._={}};CKEDITOR.ui.button.handler={create:function(a){return new CKEDITOR.ui.button(a)}};CKEDITOR.ui.button.prototype={render:function(a,b){function c(){var f=a.mode;f&&(f=this.modes[f]?void 0!==q[f]?q[f]:CKEDITOR.TRISTATE_OFF:
CKEDITOR.TRISTATE_DISABLED,f=a.readOnly&&!this.readOnly?CKEDITOR.TRISTATE_DISABLED:f,this.setState(f),this.refresh&&this.refresh())}var q=null,r=CKEDITOR.env,g="",d=this.command,m,n,k,l=this._.id;l||(l=CKEDITOR.tools.getNextId(),this._.id=l);this._.editor=a;var e={id:l,button:this,editor:a,focus:function(){CKEDITOR.document.getById(l).focus()},execute:function(){this.button.click(a)},attach:function(a){this.button.attach(a)}},x=CKEDITOR.tools.addFunction(function(a){if(e.onkey)return a=new CKEDITOR.dom.event(a),
!1!==e.onkey(e,a.getKeystroke())}),y=CKEDITOR.tools.addFunction(function(a){var b;e.onfocus&&(b=!1!==e.onfocus(e,new CKEDITOR.dom.event(a)));return b}),u=0;e.clickFn=m=CKEDITOR.tools.addFunction(function(){u&&(a.unlockSelection(1),u=0);e.execute();r.iOS&&a.focus()});this.modes?(q={},a.on("beforeModeUnload",function(){a.mode&&this._.state!=CKEDITOR.TRISTATE_DISABLED&&(q[a.mode]=this._.state)},this),a.on("activeFilterChange",c,this),a.on("mode",c,this),!this.readOnly&&a.on("readOnly",c,this)):d&&(d=
a.getCommand(d))&&(d.on("state",function(){this.setState(d.state)},this),g+=d.state==CKEDITOR.TRISTATE_ON?"on":d.state==CKEDITOR.TRISTATE_DISABLED?"disabled":"off");var p;if(this.directional)a.on("contentDirChanged",function(b){var c=CKEDITOR.document.getById(this._.id),d=c.getFirst();b=b.data;b!=a.lang.dir?c.addClass("cke_"+b):c.removeClass("cke_ltr").removeClass("cke_rtl");d.setAttribute("style",CKEDITOR.skin.getIconStyle(p,"rtl"==b,this.icon,this.iconOffset))},this);d?(n=a.getCommandKeystroke(d))&&
(k=CKEDITOR.tools.keystrokeToString(a.lang.common.keyboard,n)):g+="off";n=this.name||this.command;var h=null,t=this.icon;p=n;this.icon&&!/\./.test(this.icon)?(p=this.icon,t=null):(this.icon&&(h=this.icon),CKEDITOR.env.hidpi&&this.iconHiDpi&&(h=this.iconHiDpi));h?(CKEDITOR.skin.addIcon(h,h),t=null):h=p;g={id:l,name:n,iconName:p,label:this.label,cls:(this.hasArrow?"cke_button_expandable ":"")+(this.className||""),state:g,ariaDisabled:"disabled"==g?"true":"false",title:this.title+(k?" ("+k.display+")":
""),ariaShortcutSpace:k?"\x26nbsp;":"",ariaShortcut:k?a.lang.common.keyboardShortcut+" "+k.aria:"",titleJs:r.gecko&&!r.hc?"":(this.title||"").replace("'",""),hasArrow:"string"===typeof this.hasArrow&&this.hasArrow||(this.hasArrow?"true":"false"),keydownFn:x,focusFn:y,clickFn:m,style:CKEDITOR.skin.getIconStyle(h,"rtl"==a.lang.dir,t,this.iconOffset),arrowHtml:this.hasArrow?v.output():"",hasArrowAriaHtml:this.hasArrow?' aria-expanded\x3d"false"':"",toggleAriaHtml:this.isToggle?'aria-pressed\x3d"false"':
""};w.output(g,b);if(this.onRender)this.onRender();return e},setState:function(a){if(this._.state==a)return!1;this._.state=a;var b=CKEDITOR.document.getById(this._.id);return b?(b.setState(a,"cke_button"),b.setAttribute("aria-disabled",a==CKEDITOR.TRISTATE_DISABLED),this.isToggle&&!this.hasArrow&&b.setAttribute("aria-pressed",a===CKEDITOR.TRISTATE_ON),!0):!1},getState:function(){return this._.state},toFeature:function(a){if(this._.feature)return this._.feature;var b=this;this.allowedContent||this.requiredContent||
!this.command||(b=a.getCommand(this.command)||b);return this._.feature=b}};CKEDITOR.ui.prototype.addButton=function(a,b){this.add(a,CKEDITOR.UI_BUTTON,b)}})();