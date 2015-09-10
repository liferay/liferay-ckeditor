CKEditor 4 Changelog
====================

## CKEditor 4.0.3-r23

* [#LPS-57320](https://issues.liferay.com/browse/LPS-57320): Backport [#11635](http://dev.ckeditor.com/ticket/11635): Fixed: Some attributes are not protected before content is passed through fix bin.

## CKEditor 4.0.3-r22

* [#LPS-57364](https://issues.liferay.com/browse/LPS-57364): Fixed script protection pattern which would not cover unclosed script tag.

## CKEditor 4.0.3-r21

* [#LPS-57320](https://issues.liferay.com/browse/LPS-57320): Added support for quote attributes in the parser.

## CKEditor 4.0.3-r20

* [#LPS-57040](https://issues.liferay.com/browse/LPS-57040): Backport tickets:
    * [#10131](https://dev.ckeditor.com/ticket/10131): Fixed: `undoManager#update` does not refresh the command state.
    * [#10315](https://dev.ckeditor.com/ticket/10315): [Webkit] Undo manager should not record snapshots after a filling character was added/removed.
    * [#9794](https://dev.ckeditor.com/ticket/9794): OnChange event.

## CKEditor 4.0.3-r19

* [#LPS-56987](https://issues.liferay.com/browse/LPS-56987): Backport [#10042](https://dev.ckeditor.com/ticket/10042): Allow setting meaningful title for inline editable element

## CKEditor 4.0.3-r18

* [LPS-56699](https://issues.liferay.com/browse/LPS-56699): Improve Japanese translation for bullet list properties in Ckeditor.

## CKEditor 4.0.3-r17

* [LPS-56511](https://issues.liferay.com/browse/LPS-56511): Partial backport of: [e16981cb72e8d5da4b18bab7913c36a0bdeb721d](https://github.com/liferay/liferay-ckeditor/commit/e16981cb72e8d5da4b18bab7913c36a0bdeb721d) and [3ecd0b83a06978520da7a130266a77f55e65afee](https://github.com/liferay/liferay-ckeditor/commit/3ecd0b83a06978520da7a130266a77f55e65afee) from [ee-4.4.x](https://github.com/liferay/liferay-ckeditor/tree/ee-4.4.x): "Insert Paragraph Here" support internationalization

## CKEditor 4.0.3-r16

* [LPS-56209](https://issues.liferay.com/browse/LPS-56209): Backport of: [#11947](http://dev.ckeditor.com/ticket/11947): [FF+IE11] Fixed: Shift+Enter in lists produces two line breaks.

## CKEditor 4.0.3-r15

* [LPS-39430](https://issues.liferay.com/browse/LPS-39430): Provide config option to prevent indents on non-list content.
* [LPS-55723](https://issues.liferay.com/browse/LPS-55723): Improve solution for LPS-55018.

## CKEditor 4.0.3-r14

* [LPS-55288](https://issues.liferay.com/browse/LPS-55288): Prevent `toPre()` from converting `<br>` to new-line characters in all but IE<8. Adapted from, [#4711](https://dev.ckeditor.com/ticket/4711), [#9535](https://dev.ckeditor.com/ticket/9535)

## CKEditor 4.0.3-r13

* [#LPS-55018](https://issues.liferay.com/browse/LPS-55018): Reverting part of [#3893](http://dev.ckeditor.com/ticket/3893) to prevent list indents beyond a single nested level per level.

## CKEditor 4.0.3-r12

* [#LPS-52359](https://issues.liferay.com/browse/LPS-52359): Backport of, [89ea0640ece7839a96d1df1469acabf7270faee2](https://github.com/liferay/ckeditor-ee/commit/89ea0640ece7839a96d1df1469acabf7270faee2), part of [#9764](http://dev.ckeditor.com/ticket/9764).

## CKEditor 4.0.3-r11

* [#10907](http://dev.ckeditor.com/ticket/10907): [IE11] Selection needs <br> filler in empty blocks

## CKEditor 4.0.3-r10

* [#10906](http://dev.ckeditor.com/ticket/10906): [IE11+] Editable is not being focused when clicking outside body

## CKEditor 4.0.3-r9

**Security Updates:**

* Fixed XSS vulnerability in the Preview plugin reported by Mario Heiderich of [Cure53](https://cure53.de/).

**An upgrade is highly recommended!**

## CKEditor 4.0.3-r8

* [#LPS-47564](https://issues.liferay.com/browse/LPS-47564): Adding back support for Internet Explorer 7 detection.

## CKEditor 4.0.3-r7

* [#10612](http://dev.ckeditor.com/ticket/10612): Internet Explorer 11 compatibility issues.

## CKEditor 4.0.3-r6

* [#10612](http://dev.ckeditor.com/ticket/11839): [IE9] Text cursor jumps out of source area on resize.

## CKEditor 4.0.3-r5

* [#10330](http://dev.ckeditor.com/ticket/10330): [Webkit] Filling char is not removed on key down in specific cases.

## CKEditor 4.0.3-r3

* [#10945](http://dev.ckeditor.com/ticket/10945): Click with mouse inside editor does not show the caret, but user is able to enter text.

## CKEditor 4.0.3

* [#10196](http://dev.ckeditor.com/ticket/10196): Fixed context menus not opening with keyboard shortcuts when Autogrow is enabled.
* [#10212](http://dev.ckeditor.com/ticket/10212): [IE7-10] Undo command throws errors after multiple switches between Source and WYSIWYG view.
* [#10219](http://dev.ckeditor.com/ticket/10219): [Inline editor] Error thrown after calling editor.destroy().

## CKEditor 4.0.2

* [#9779](http://dev.ckeditor.com/ticket/9779): Fixed overriding `CKEDITOR.getUrl` with `CKEDITOR_GETURL`.
* [#9772](http://dev.ckeditor.com/ticket/9772): Custom buttons in dialog window footer have different look and size (Moono, Kama).
* [#9029](http://dev.ckeditor.com/ticket/9029): Custom styles added with `styleSet.add()` are displayed in wrong order.
* [#9887](http://dev.ckeditor.com/ticket/9887): Disable magicline when `editor.readOnly` is set.
* [#9882](http://dev.ckeditor.com/ticket/9882): Fixed empty document title on `getData()` if set via the Document Properties dialog window.
* [#9773](http://dev.ckeditor.com/ticket/9773): Fixed rendering problems with selection fields in the Kama skin.
* [#9851](http://dev.ckeditor.com/ticket/9851): The `selectionChange` event is not fired when mouse selection ended outside editable.
* [#9903](http://dev.ckeditor.com/ticket/9903): [Inline editor] Bad positioning of floating space with page horizontal scroll.
* [#9872](http://dev.ckeditor.com/ticket/9872): `editor.checkDirty()` returns `true` when called onload. Removed the obsolete `editor.mayBeDirty` flag.
* [#9893](http://dev.ckeditor.com/ticket/9893): Fixed broken toolbar when editing mixed direction content in Quirks mode.
* [#9845](http://dev.ckeditor.com/ticket/9845): Fixed TAB navigation in the Link dialog window when the Anchor option is used and no anchors are available.
* [#9883](http://dev.ckeditor.com/ticket/9883): Maximizing was making the entire page editable with divarea-based editors.
* [#9940](http://dev.ckeditor.com/ticket/9940): [Firefox] Navigating back to a page with the editor was making the entire page editable.
* [#9966](http://dev.ckeditor.com/ticket/9966): Fixed: Unable to type square brackets with French keyboard layout. Changed magicline keystrokes.
* [#9507](http://dev.ckeditor.com/ticket/9507): [Firefox] Selection is moved before editable position when the editor is focused for the first time.
* [#9947](http://dev.ckeditor.com/ticket/9947): [Webkit] Editor overflows parent container in some edge cases.
* [#10105](http://dev.ckeditor.com/ticket/10105): Fixed: Broken sourcearea view when an RTL language is set.
* [#10123](http://dev.ckeditor.com/ticket/10123): [Webkit] Fixed: Several dialog windows have broken layout since the latest Webkit release.
* [#10152](http://dev.ckeditor.com/ticket/10152): Fixed: Invalid ARIA property used on menu items.

## CKEditor 4.0.1.1

* Security update: Added protection against XSS attack and possible path disclosure in PHP sample.

## CKEditor 4.0.1

Fixed issues:

* [#9655](http://dev.ckeditor.com/ticket/9655): Support for IE Quirks Mode in new Moono skin.
* Accessibility issues (mainly on inline editor): [#9364](http://dev.ckeditor.com/ticket/9364), [#9368](http://dev.ckeditor.com/ticket/9368), [#9369](http://dev.ckeditor.com/ticket/9369), [#9370](http://dev.ckeditor.com/ticket/9370), [#9541](http://dev.ckeditor.com/ticket/9541), [#9543](http://dev.ckeditor.com/ticket/9543), [#9841](http://dev.ckeditor.com/ticket/9841), [#9844](http://dev.ckeditor.com/ticket/9844).
* Magic-line:
    * [#9481](http://dev.ckeditor.com/ticket/9481): Added accessibility support for Magic-line.
    * [#9509](http://dev.ckeditor.com/ticket/9509): Added Magic-line support for forms.
    * [#9573](http://dev.ckeditor.com/ticket/9573): Magic-line doesn't disappear on `mouseout` in the specific case.
* [#9754](http://dev.ckeditor.com/ticket/9754): [Webkit] Cut & paste simple unformatted text generates inline wrapper in Webkits.
* [#9456](http://dev.ckeditor.com/ticket/9456): [Chrome] Properly paste bullet list style from MS-Word.
* [#9699](http://dev.ckeditor.com/ticket/9699), [#9758](http://dev.ckeditor.com/ticket/9758): Improved selection locking when selecting by dragging.
* Context menu:
    * [#9712](http://dev.ckeditor.com/ticket/9712): Context menu open destroys editor focus.
    * [#9366](http://dev.ckeditor.com/ticket/9366): Context menu should be displayed over floating toolbar.
    * [#9706](http://dev.ckeditor.com/ticket/9706): Context menu generates JS error in inline mode when editor attached to header element.
* [#9800](http://dev.ckeditor.com/ticket/9800): Hide float panel when resizing window.
* [#9721](http://dev.ckeditor.com/ticket/9721): Padding in content of div based editor puts editing area under bottom UI space.
* [#9528](http://dev.ckeditor.com/ticket/9528): Host page's `box-sizing` style shouldn't influence editor UI elements.
* [#9503](http://dev.ckeditor.com/ticket/9503): Forms plugin adds context menu listeners only on supported input types. Added support for `tel, email, search` and `url` input types.
* [#9769](http://dev.ckeditor.com/ticket/9769): Improved floating toolbar positioning in narrow window.
* [#9875](http://dev.ckeditor.com/ticket/9875): Table dialog doesn't populate width correctly.
* [#8675](http://dev.ckeditor.com/ticket/8675): Deleting cells in nested table removes outer table cell.
* [#9815](http://dev.ckeditor.com/ticket/9815): Can't edit dialog fields on editor initialized in jQuery UI modal dialog.
* [#8888](http://dev.ckeditor.com/ticket/8888): CKEditor dialogs do not show completely in small window.
* [#9360](http://dev.ckeditor.com/ticket/9360): [Inline editor] Blocks shown for a div stay permanently even after user exists editing the div.
* [#9531](http://dev.ckeditor.com/ticket/9531): [Firefox & Inline editor] Toolbar is lost when closing format combo by clicking on its button.
* [#9553](http://dev.ckeditor.com/ticket/9553): Table width incorrectly set when `border-width` style is specified.
* [#9594](http://dev.ckeditor.com/ticket/9594): Cannot tab past CKEditor when it is in read only mode.
* [#9658](http://dev.ckeditor.com/ticket/9658): [IE9] Justify not working on selected image.
* [#9686](http://dev.ckeditor.com/ticket/9686): Added missing contents styles for `<pre>`.
* [#9709](http://dev.ckeditor.com/ticket/9709): PasteFromWord should not depend on configuration from other styles.
* [#9726](http://dev.ckeditor.com/ticket/9726): Removed color dialog dependency from table tools.
* [#9765](http://dev.ckeditor.com/ticket/9765): Toolbar Collapse command documented incorrectly on Accessibility Instructions dialog.
* [#9771](http://dev.ckeditor.com/ticket/9771): [Webkit & Opera] Fixed scrolling issues when pasting.
* [#9787](http://dev.ckeditor.com/ticket/9787): [IE9] onChange isn't fired for checkboxes in dialogs.
* [#9842](http://dev.ckeditor.com/ticket/9842): [Firefox 17] When we open toolbar menu for the first time & press down arrow key, focus goes to next toolbar button instead of menu options.
* [#9847](http://dev.ckeditor.com/ticket/9847): Elements path shouldn't be initialized on inline editor.
* [#9853](http://dev.ckeditor.com/ticket/9853): `Editor#addRemoveFormatFilter` is exposed before it really works.
* [#8893](http://dev.ckeditor.com/ticket/8893): Value of `pasteFromWordCleanupFile` config is now taken from instance configuration.
* [#9693](http://dev.ckeditor.com/ticket/9693): Removed "live preview" checkbox from UI color picker.


## CKEditor 4.0

The first stable release of the new CKEditor 4 code line.

The CKEditor JavaScript API has been kept compatible with CKEditor 4, whenever
possible. The list of relevant changes can be found in the [API Changes page of
the CKEditor 4 documentation][1].

[1]: http://docs.ckeditor.com/#!/guide/dev_api_changes "API Changes"
