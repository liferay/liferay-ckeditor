CKEDITOR.dialog.add('codemirrordialog', function(editor) {
	var editorWindow = CKEDITOR.document.getWindow();
	var size = editorWindow.getViewPaneSize();
	var scalex = 0.9;
	var scaley = 0.7;
	var height = size.height * scaley;
	var width = size.width * scalex;

	if (!editor.window) {
		editor.window = editorWindow;
	}

	return {
		_createCodeMirrorEditor: function() {
			var dialog = this.dialog;

			var size = dialog.getSize();

			var textarea = dialog.getContentElement('main', 'data')
				.getInputElement().$;

			var codeMirrorEditor = this.codeMirrorEditor =
				CodeMirror.fromTextArea(
					textarea,
					{
						lineNumbers: true,
						lineWrapping: true,
						mode: 'text/html'
					}
				);

			var defaultWidth = (size.width * 0.5) - 10;

			codeMirrorEditor.setSize(defaultWidth, null);

			var editor = dialog.getParentEditor();

			codeMirrorEditor.setValue(
				html_beautify(editor.getData(true))
			);

			var preview = dialog.getContentElement('main', 'preview').getElement();
			preview.setHtml(codeMirrorEditor.getValue());
			preview.setSize('width', defaultWidth);

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
				align: 'top',
				children: [
					{
						id: 'data',
						type: 'textarea'
					},
					{
						html: '<div class="code_preview">&nbsp;</div>',
						id: 'preview',
						type: 'html'
					}
				],
				type: 'hbox'
			}]
		}],

		height: height,
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
			var codeMirrorEditor = this.definition.codeMirrorEditor;
			var editor = this.getParentEditor();
			var data = editor.getData();

			if (codeMirrorEditor && codeMirrorEditor.getValue() !== data) {
				codeMirrorEditor.setValue(html_beautify(data));
			}
		}
	};
});
