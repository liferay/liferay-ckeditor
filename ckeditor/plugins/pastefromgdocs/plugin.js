/*
 Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
*/
(function(){CKEDITOR.plugins.add("pastefromgdocs",{requires:"pastetools",init:function(a){var c=CKEDITOR.plugins.getPath("pastetools"),d=this.path;a.pasteTools.register({filters:[CKEDITOR.getUrl(c+"filter/common.js"),CKEDITOR.getUrl(d+"filter/default.js")],canHandle:function(a){return/id=(\"|\')?docs\-internal\-guid\-/.test(a.data.dataValue)},handle:function(c,d){var b=c.data,e=CKEDITOR.plugins.pastetools.getClipboardData(b,"text/html");b.dontFilter=!0;b.dataValue=CKEDITOR.pasteFilters.gdocs(e,a);
!0===a.config.forcePasteAsPlainText&&(b.type="text");d()}})}})})();