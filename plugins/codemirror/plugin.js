(function() {
	'use strict';

	var stylesLoaded = false;


	CKEDITOR.plugins.add('codemirror', {
		_createCodeMirrorEditor: function(editor) {
			var instance = this;

			var codemirror = CKEDITOR.plugins.codemirror;

			editor.addMode('source', function(callback) {
				var contentsSpace = editor.ui.space('contents');

				var textarea = contentsSpace.getDocument().createElement('textarea');
				contentsSpace.append(textarea);

				instance.codeMirrorEditor = CodeMirror.fromTextArea(
					textarea.$,
					{
						lineNumbers: true,
						mode: 'text/html'
					}
				);

				var oldData = editor.getData(1);

				instance.codeMirrorEditor.setValue(html_beautify(oldData));

				instance.codeMirrorEditor.on('change', instance._handleCodeMirrorChange.bind(instance, editor, oldData));

				editor.on('resize', instance._handleEditorResize.bind(instance));

				editor.fire('ariaWidget', this);

				callback();
			});

			editor.addCommand('codemirror', codemirror.commands.source);
		},

		_handleCodeMirrorChange: function(editor, oldData) {
			var newData = this.codeMirrorEditor.getValue();

			if (newData !== oldData) {
				editor.setData(newData);
			}
		},

		_handleEditorResize: function(event) {
			this.codeMirrorEditor.setSize(null, event.data.outerHeight);
		},

		hidpi: true,

		icons: 'source,source-rtl',

		init: function(editor) {
			var instance = this;

			if (editor.plugins.detectConflict('codemirror', ['sourcearea'])) {
				return;
			}

			if (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
				return;
			}

			if (!stylesLoaded) {
				CKEDITOR.document.appendStyleSheet(
					this.path + 'deps/codemirror/codemirror.css'
				);
				stylesLoaded = true;
			}

			var instance = this;

			CKEDITOR.scriptLoader.load([
					instance.path + 'deps/codemirror/codemirror.js',
					instance.path + 'deps/js-beautify/beautify-html.js'
				],
				function() {
					CKEDITOR.scriptLoader.load(
						instance.path + 'deps/codemirror/xml.js',
						function() {
							instance._createCodeMirrorEditor(editor);
						}
					);
				}
			);

			if (editor.ui.addButton) {
				editor.ui.addButton('Source', {
					label: editor.lang.codemirror.source,
					command: 'codemirror',
					toolbar: 'mode,10'
				});
			}

			editor.on('mode', function() {
				editor.getCommand('codemirror').setState(
					editor.mode === 'source'
					? CKEDITOR.TRISTATE_ON
					: CKEDITOR.TRISTATE_OFF
				);
			});
		}
	});
})();

CKEDITOR.plugins.codemirror = {
	commands: {
		source: {
			modes: {
				source: 1,
				wysiwyg: 1
			},
			editorFocus: true,
			exec: function(editor) {
				if (editor.mode === 'wysiwyg') {
					editor.fire('saveSnapshot');
				}
				editor.getCommand('codemirror').setState(CKEDITOR.TRISTATE_DISABLED);
				editor.setMode(editor.mode === 'source' ? 'wysiwyg' : 'source');
			},
			canUndo: false
		}
	}
};
