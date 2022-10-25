(function () {
	'use strict';

	var stylesLoaded = false;

	CKEDITOR.plugins.add('codemirror', {
		_addTabKeyMessage: function (cm, editor, tabsKeyIsEnabled) {
			var div = document.createElement('div');

			var message = tabsKeyIsEnabled
				? editor.lang.codemirror.disableTabKeyUsing
				: editor.lang.codemirror.enableTabKeyUsing;

			var html =
				'<div class="keyboard-message popover px-2 py-1" style="left:auto; right: 4px; top:4px">';

			html += '<span class="c-kbd-sm">';

			html += message;

			html += '</span>';

			html += '<kbd class="c-kbd c-kbd-light c-kbd-sm">';

			html += '<kbd class="c-kbd">Ctrl</kbd>';

			html += '<span class="c-kbd-separator">+</span>';

			html += '<kbd class="c-kbd">M</kbd>';

			html += '</kbd>';

			html += '</div>';

			div.innerHTML = html;

			cm.getWrapperElement().appendChild(div);
		},

		_removeTabKeyMessage: function (cm) {
			var div = cm.getWrapperElement().querySelector('.keyboard-message');

			if (div) {
				div.parentElement.removeChild(div);
			}
		},

		_createCodeMirrorEditor: function (editor) {
			var instance = this;

			editor.addMode('source', function (callback) {
				var codeMirrorInstance = this;

				var contentsSpace =
					editor.ui.space('contents') || editor.ui.contentsElement;

				var textarea = contentsSpace
					.getDocument()
					.createElement('textarea');

				contentsSpace.append(textarea);

				codeMirrorInstance.codeMirrorEditor = CodeMirror.fromTextArea(
					textarea.$,
					{
						lineNumbers: true,
						lineWrapping: true,
						mode: 'text/html',
						extraKeys: {
							'Ctrl-M': function (cm) {
								var tabKeyIsEnabled = cm.state.keyMaps.every(
									function (key) {
										return key.name !== 'tabKey';
									}
								);

								instance._removeTabKeyMessage(cm);
								instance._addTabKeyMessage(
									cm,
									editor,
									!tabKeyIsEnabled
								);

								if (tabKeyIsEnabled) {
									cm.addKeyMap({
										'Shift-Tab': false,
										Tab: false,
										name: 'tabKey',
									});
								} else {
									cm.removeKeyMap('tabKey');
								}
							},
						},
					}
				);

				var oldData = editor.getData(1);

				var editable = editor.editable(
					new codeMirrorEditable(editor, textarea)
				);

				editable.setData(oldData);

				codeMirrorInstance.codeMirrorEditor.setValue(oldData);

				var codeMirrorElement = codeMirrorInstance.codeMirrorEditor.getWrapperElement();
				codeMirrorElement.classList.add('cke_enable_context_menu');

				var editableParent = editable.getParent();
				var contentsSize = editableParent.getClientSize();
				if (contentsSize.height) {
					codeMirrorInstance.codeMirrorEditor.setSize(
						null,
						contentsSize.height
					);
				}

				codeMirrorInstance.codeMirrorEditor.on(
					'change',
					instance._handleCodeMirrorChange.bind(
						codeMirrorInstance,
						editor,
						oldData
					)
				);

				editor.on(
					'resize',
					instance._handleEditorResize.bind(codeMirrorInstance)
				);

				editor.on('dataReady', function (event) {
					var newData = event.data;

					var oldData = codeMirrorInstance.codeMirrorEditor.getValue();

					if (newData && newData !== oldData) {
						codeMirrorInstance.codeMirrorEditor.setValue(newData);
					}
				});

				editor.fire('ariaWidget', this);

				codeMirrorInstance.codeMirrorEditor.on('focus', function (cm) {
					var tabKeyIsEnabled = cm.state.keyMaps.every(function (
						key
					) {
						return key.name !== 'tabKey';
					});

					if (tabKeyIsEnabled) {
						cm.addKeyMap({
							'Shift-Tab': false,
							Tab: false,
							name: 'tabKey',
						});
					}

					instance._addTabKeyMessage(cm, editor, false);
				});

				codeMirrorInstance.codeMirrorEditor.on('blur', function () {
					instance._removeTabKeyMessage(
						codeMirrorInstance.codeMirrorEditor
					);
				});

				callback();
			});
		},

		_handleCodeMirrorChange: function (editor, oldData) {
			var newData = this.codeMirrorEditor.getValue();

			if (newData !== oldData) {
				editor.setData(newData);
			}
		},

		_handleEditorResize: function (event) {
			this.codeMirrorEditor.setSize(null, event.data.contentsHeight);
		},

		hidpi: true,

		icons: 'source,source-rtl',

		init: function (editor) {
			var instance = this;

			if (editor.plugins.detectConflict('codemirror', ['sourcearea'])) {
				return;
			}

			if (!stylesLoaded) {
				CKEDITOR.document.appendStyleSheet(
					this.path + 'skins/default.css'
				);

				CKEDITOR.document.appendStyleSheet(
					this.path + 'vendors/vendors.css'
				);
				stylesLoaded = true;
			}

			CKEDITOR.scriptLoader.load(
				this.path + 'vendors/vendors.js',
				function () {
					instance._createCodeMirrorEditor(editor);
				}
			);

			editor.addCommand(
				'codemirror',
				CKEDITOR.plugins.codemirror.commands.source
			);

			var codeMirrorDialogConfigs = {
				state: CKEDITOR.TRISTATE_OFF,
			};

			if (!editor.balloonToolbars) {
				codeMirrorDialogConfigs.modes = {
					source: 1,
					wysiwyg: 0,
				};
			}

			editor.addCommand(
				'codemirrordialog',
				CKEDITOR.tools.extend(
					new CKEDITOR.dialogCommand('codemirrordialog'),
					codeMirrorDialogConfigs
				)
			);

			CKEDITOR.dialog.add(
				'codemirrordialog',
				this.path + 'dialogs/codemirrordialog.js'
			);

			if (editor.ui.addButton) {
				editor.ui.addButton('Source', {
					label: editor.lang.codemirror.source,
					command: 'codemirror',
					toolbar: 'mode,10',
				});

				editor.ui.addButton('Expand', {
					label: editor.lang.common.preview,
					command: 'codemirrordialog',
					toolbar: 'mode,11',
				});
			}

			editor.on('mode', function () {
				editor
					.getCommand('codemirror')
					.setState(
						editor.mode === 'source'
							? CKEDITOR.TRISTATE_ON
							: CKEDITOR.TRISTATE_OFF
					);
			});
		},
	});

	var codeMirrorEditable = CKEDITOR.tools.createClass({
		base: CKEDITOR.editable,

		proto: {
			setData: function (data) {
				this.setValue(data);
				this.status = 'ready';
				this.editor.fire('dataReady', data);
			},

			getData: function () {
				return this.getValue();
			},

			// Insertions are not supported in source editable.
			insertHtml: function () {},
			insertElement: function () {},
			insertText: function () {},

			// Read-only support for textarea.
			setReadOnly: function (isReadOnly) {
				this[(isReadOnly ? 'set' : 'remove') + 'Attribute'](
					'readOnly',
					'readonly'
				);
			},

			detach: function () {
				codeMirrorEditable.baseProto.detach.call(this);
				this.clearCustomData();
				this.remove();
			},
		},
	});
})();

CKEDITOR.plugins.codemirror = {
	commands: {
		source: {
			modes: {
				source: 1,
				wysiwyg: 1,
			},
			editorFocus: true,
			exec: function (editor) {
				if (editor.mode === 'wysiwyg') {
					editor.fire('saveSnapshot');
				}
				editor
					.getCommand('codemirror')
					.setState(CKEDITOR.TRISTATE_DISABLED);
				editor.setMode(editor.mode === 'source' ? 'wysiwyg' : 'source');
			},
			canUndo: false,
		},
	},
};
