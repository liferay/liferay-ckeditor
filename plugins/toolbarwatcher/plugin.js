/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

(function () {
	'use strict';

	var PLUGIN_NAME = 'toolbarwatcher';

	if (!CKEDITOR.plugins.get(PLUGIN_NAME)) {
		var TOOLBAR_HIDDEN_LABELS_CLASS = 'cke_hide_toolbar_labels';

		function debounce(fn, delay) {
			return function debounced() {
				var args = Array.prototype.slice.call(arguments);
				clearTimeout(debounced.id);
				debounced.id = setTimeout(function () {
					fn.apply(null, args);
				}, delay);
			};
		}

		CKEDITOR.plugins.add(PLUGIN_NAME, {
			afterInit: function (editor) {
				this.editor = editor;
				this.editor.on(
					'instanceReady',
					this.onInstanceReady.bind(this)
				);
			},

			editor: null,

			getToolbarsWidth: function () {
				var containerElement = this.editor.container.$;

				var width = 0;

				containerElement
					.querySelectorAll('.cke_toolbar')
					.forEach(function (element) {
						width += element.offsetWidth;
					});

				return width;
			},

			isToolbarOverflowing: function () {
				var toolbarsContainer = this.editor.container.$.querySelector(
					'.cke_top'
				);

				if (toolbarsContainer) {
					var toolbarsContainerWidth =
						parseInt(
							getComputedStyle(toolbarsContainer).width,
							10
						) || 0;

					return this.labeledToolbarsWidth >= toolbarsContainerWidth;
				}

				return false;
			},

			labeledToolbarsWidth: 0,

			onInstanceReady: function (event) {
				var instance = this;

				this.labeledToolbarsWidth = this.getToolbarsWidth();

				event.editor.window.on(
					'resize',
					debounce(function () {
						var containerElement = instance.editor.container.$;
						var isToolbarOverflowing = instance.isToolbarOverflowing();

						if (isToolbarOverflowing) {
							if (
								!containerElement.classList.contains(
									TOOLBAR_HIDDEN_LABELS_CLASS
								)
							) {
								containerElement.classList.add(
									TOOLBAR_HIDDEN_LABELS_CLASS
								);
							}
						} else {
							if (
								containerElement.classList.contains(
									TOOLBAR_HIDDEN_LABELS_CLASS
								)
							) {
								containerElement.classList.remove(
									TOOLBAR_HIDDEN_LABELS_CLASS
								);
							}
						}
					}, 100)
				);
			},

			onLoad: function () {
				CKEDITOR.addCss(
					'.cke_hide_toolbar_labels .cke_button__label,' +
						'.cke_hide_toolbar_labels .cke_button__source_label,' +
						'.cke_hide_toolbar_labels .cke_button__sourcedialog_label {' +
						'display: none; }'
				);
			}
		});
	}
})();
