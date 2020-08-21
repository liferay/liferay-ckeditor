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

	var stylesLoaded = false;

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
			_onResize: function() {
				var containerElement = this.editor.container.$;
				var isToolbarOverflowing = this.isToolbarOverflowing();

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
			},

			afterInit: function (editor) {
				this.editor = editor;
				this.editor.on(
					'instanceReady',
					this.onInstanceReady.bind(this)
				);
			},

			getToolbarsWidth: function () {
				var containerElement = this.editor.container.$;

				var width = 0;

				containerElement
					.querySelectorAll('.cke_toolbar, .cke_toolbar_break')
					.forEach(function (element) {
						width += element.offsetWidth;
						if (element.className.indexOf('cke_toolbar_break') !== -1) {
							width = 0;
						}
					});

				return width;
			},

			getToolbarsContainerWidth: function() {
				var toolbarsContainer = this.editor.container.$.querySelector(
					'.cke_top'
				);
				if (toolbarsContainer) {
					return parseInt(getComputedStyle(toolbarsContainer).width, 10) || 0;
				}
				else {
					return 0;
				}
			},

			init: function() {
				if (!stylesLoaded) {
					CKEDITOR.document.appendStyleSheet(
						this.path + 'skins/default.css'
					);
					stylesLoaded = true;
				}
			},

			isToolbarOverflowing: function () {
				var toolbarsContainerWidth = this.getToolbarsContainerWidth();
				var toolbarsWidth = this.getToolbarsWidth();

				return toolbarsWidth >= toolbarsContainerWidth;
			},

			onDestroy: function() {
				if (this.editor.window && this.editor.window.hasListeners('resize')) {
					this.editor.window.removeListener('resize', this.debouncedResizeListener);
				}
			},

			onInstanceReady: function (event) {
				this.debouncedResizeListener = debounce(this._onResize.bind(this), 200);

				event.editor.on('destroy', this.onDestroy.bind(this));
				event.editor.window.on('resize', this.debouncedResizeListener);

				this.debouncedResizeListener();
			}
		});
	}
})();
