CKEDITOR.dialog.add('codemirrordialog', function(editor) {
	var size = CKEDITOR.document.getWindow().getViewPaneSize();
	var scale = 0.75;
	var height = size.height * scale;
	var width = size.width * scale;

	return {
		_createCodeMirrorEditor: function() {
			var dialog = this.dialog;

			var textarea = dialog.getContentElement('main', 'data')
				.getInputElement().$;

			var codeMirrorEditor = this.codeMirrorEditor =
				CodeMirror.fromTextArea(
					textarea,
					{
						lineNumbers: true,
						mode: 'text/html'
					}
				);

			var editor = dialog.getParentEditor();

			codeMirrorEditor.setValue(
				html_beautify(editor.getData(true))
			);

			var preview = dialog.getContentElement('main', 'preview').getElement();
			preview.setHtml(codeMirrorEditor.getValue());

			codeMirrorEditor.on(
				'change',
				this._handleCodeMirrorChange.bind(this)
			);
		},

		_handleCodeMirrorChange: function() {
			var newData = this.codeMirrorEditor.getValue();
			var preview = this.dialog.getContentElement('main', 'preview').getElement();

			preview.setHtml(newData);
		},

		contents: [{
			id: 'main',
			elements: [{
				type: 'hbox',
				children: [
					{
						align: 'top',
						id: 'data',
						type: 'textarea'
					},
					{
						html: '<div>&nbsp;</div>',
						id: 'preview',
						type: 'html'
					}
				]
			}]
		}],

		height: height,
		minHeight: 300,
		minWidh: 400,
		title: editor.lang.codemirror.source,
		width: width,

		onLoad: function() {
			this.definition._createCodeMirrorEditor();
		},

		onOk: function() {
			var definition = this.definition;
			var editor = this.getParentEditor();
			var newData = definition.codeMirrorEditor.getValue();
			var oldData = editor.getData();

			if (newData !== oldData) {
				editor.setData(newData);
				editor.setMode('wysiwyg');
			}
		},

		onShow: function() {
			var editor = this.getParentEditor();
			var data = editor.getData();
			var definition = this.definition;
			var codeMirrorEditor = definition.codeMirrorEditor;
			if (codeMirrorEditor && codeMirrorEditor.getValue() !== data) {
				codeMirrorEditor.setValue(html_beautify(data));
			}
		}
	};
});
