﻿(function(){var c=!1;CKEDITOR.plugins.add("codemirror",{_addTabKeyMessage:function(a,b,f){var d=document.createElement("div");b=f?b.lang.codemirror.disableTabKeyUsing:b.lang.codemirror.enableTabKeyUsing;b='\x3cdiv class\x3d"keyboard-message popover px-2 py-1" style\x3d"left:auto; right: 4px; top:4px"\x3e\x3cspan class\x3d"c-kbd-sm"\x3e'+b;b+="\x3c/span\x3e";b+='\x3ckbd class\x3d"c-kbd c-kbd-light c-kbd-sm"\x3e';b+='\x3ckbd class\x3d"c-kbd"\x3eCtrl\x3c/kbd\x3e';b+='\x3cspan class\x3d"c-kbd-separator"\x3e+\x3c/span\x3e';
b+='\x3ckbd class\x3d"c-kbd"\x3eM\x3c/kbd\x3e';b+="\x3c/kbd\x3e";b+="\x3c/div\x3e";d.innerHTML=b;a.getWrapperElement().appendChild(d)},_removeTabKeyMessage:function(a){(a=a.getWrapperElement().querySelector(".keyboard-message"))&&a.parentElement.removeChild(a)},_createCodeMirrorEditor:function(a){var b=this;a.addMode("source",function(f){var d=this,c=a.ui.space("contents")||a.ui.contentsElement,e=c.getDocument().createElement("textarea");c.append(e);d.codeMirrorEditor=CodeMirror.fromTextArea(e.$,
{lineNumbers:!0,lineWrapping:!0,mode:"text/html",extraKeys:{"Ctrl-M":function(c){var d=c.state.keyMaps.every(function(a){return"tabKey"!==a.name});b._removeTabKeyMessage(c);b._addTabKeyMessage(c,a,!d);d?c.addKeyMap({"Shift-Tab":!1,Tab:!1,name:"tabKey"}):c.removeKeyMap("tabKey")}}});c=a.getData(1);e=a.editable(new g(a,e));e.setData(c);d.codeMirrorEditor.setValue(c);d.codeMirrorEditor.getWrapperElement().classList.add("cke_enable_context_menu");e=e.getParent().getClientSize();e.height&&d.codeMirrorEditor.setSize(null,
e.height);d.codeMirrorEditor.on("change",b._handleCodeMirrorChange.bind(d,a,c));a.on("resize",b._handleEditorResize.bind(d));a.on("dataReady",function(a){a=a.data;var b=d.codeMirrorEditor.getValue();a&&a!==b&&d.codeMirrorEditor.setValue(a)});a.fire("ariaWidget",this);d.codeMirrorEditor.on("focus",function(c){c.state.keyMaps.every(function(a){return"tabKey"!==a.name})&&c.addKeyMap({"Shift-Tab":!1,Tab:!1,name:"tabKey"});b._addTabKeyMessage(c,a,!1)});d.codeMirrorEditor.on("blur",function(){b._removeTabKeyMessage(d.codeMirrorEditor)});
f()})},_handleCodeMirrorChange:function(a,b){var c=this.codeMirrorEditor.getValue();c!==b&&a.setData(c)},_handleEditorResize:function(a){this.codeMirrorEditor.setSize(null,a.data.contentsHeight)},hidpi:!0,icons:"source,source-rtl",init:function(a){var b=this;if(!a.plugins.detectConflict("codemirror",["sourcearea"])){c||(CKEDITOR.document.appendStyleSheet(this.path+"skins/default.css"),CKEDITOR.document.appendStyleSheet(this.path+"vendors/vendors.css"),c=!0);CKEDITOR.scriptLoader.load(this.path+"vendors/vendors.js",
function(){b._createCodeMirrorEditor(a)});a.addCommand("codemirror",CKEDITOR.plugins.codemirror.commands.source);var f={state:CKEDITOR.TRISTATE_OFF};a.balloonToolbars||(f.modes={source:1,wysiwyg:0});a.addCommand("codemirrordialog",CKEDITOR.tools.extend(new CKEDITOR.dialogCommand("codemirrordialog"),f));CKEDITOR.dialog.add("codemirrordialog",this.path+"dialogs/codemirrordialog.js");a.ui.addButton&&(a.ui.addButton("Source",{label:a.lang.codemirror.source,command:"codemirror",toolbar:"mode,10"}),a.ui.addButton("Expand",
{label:a.lang.common.preview,command:"codemirrordialog",toolbar:"mode,11"}));a.on("mode",function(){a.getCommand("codemirror").setState("source"===a.mode?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF)})}}});var g=CKEDITOR.tools.createClass({base:CKEDITOR.editable,proto:{setData:function(a){this.setValue(a);this.status="ready";this.editor.fire("dataReady",a)},getData:function(){return this.getValue()},insertHtml:function(){},insertElement:function(){},insertText:function(){},setReadOnly:function(a){this[(a?
"set":"remove")+"Attribute"]("readOnly","readonly")},detach:function(){g.baseProto.detach.call(this);this.clearCustomData();this.remove()}}})})();CKEDITOR.plugins.codemirror={commands:{source:{modes:{source:1,wysiwyg:1},editorFocus:!0,exec:function(c){"wysiwyg"===c.mode&&c.fire("saveSnapshot");c.getCommand("codemirror").setState(CKEDITOR.TRISTATE_DISABLED);c.setMode("source"===c.mode?"wysiwyg":"source")},canUndo:!1}}};