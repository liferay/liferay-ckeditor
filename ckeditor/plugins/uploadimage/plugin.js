﻿/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function(){function l(c){9>=c&&(c="0"+c);return String(c)}function n(c){var a=new Date,a=[a.getFullYear(),a.getMonth()+1,a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds()];e+=1;return"image-"+CKEDITOR.tools.array.map(a,l).join("")+"-"+e+"."+c}var e=0;CKEDITOR.plugins.add("uploadimage",{requires:"uploadwidget",onLoad:function(){CKEDITOR.addCss(".cke_upload_uploading img{opacity: 0.3}")},isSupportedEnvironment:function(){return CKEDITOR.plugins.clipboard.isFileApiSupported},init:function(c){if(this.isSupportedEnvironment()){var a=
CKEDITOR.fileTools,e=a.getUploadUrl(c.config,"image");e&&(a.addUploadWidget(c,"uploadimage",{supportedTypes:/image\/(jpeg|png|gif|bmp)/,uploadUrl:e,fileToElement:function(){var b=new CKEDITOR.dom.element("img");b.setAttribute("src","data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs\x3d");return b},parts:{img:"img"},onUploading:function(b){this.parts.img.setAttribute("src",b.data)},onUploaded:function(b){var a=this.parts.img.$;this.replaceWith('\x3cimg src\x3d"'+
b.url+'" width\x3d"'+(b.responseData.width||a.naturalWidth)+'" height\x3d"'+(b.responseData.height||a.naturalHeight)+'"\x3e')}}),c.on("paste",function(b){if(b.data.dataValue.match(/<img[\s\S]+data:/i)){b=b.data;var f=document.implementation.createHTMLDocument(""),f=new CKEDITOR.dom.element(f.body),m,g,k;f.data("cke-editable",1);f.appendHtml(b.dataValue);m=f.find("img");for(k=0;k<m.count();k++){g=m.getItem(k);var d=g.getAttribute("src"),h=d&&"data:"==d.substring(0,5),l=null===g.data("cke-realelement");
h&&l&&!g.data("cke-upload-id")&&!g.isReadOnly(1)&&(h=(h=d.match(/image\/([a-z]+?);/i))&&h[1]||"jpg",d=c.uploadRepository.create(d,n(h)),d.upload(e),a.markElement(g,"uploadimage",d.id),a.bindNotifications(c,d))}b.dataValue=f.getHtml()}}))}}})})();