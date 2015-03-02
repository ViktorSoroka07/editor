(function ($) {
    'use strict';
    /**
     * deffered which resolved when iframe window will load
     * @type {Deferred}
     */
    $.editorCustomdef = new $.Deferred();
    /**
     * editor plugin for text editing opreations
     */
    $.fn.editorCustom = function (options) {
        var instance;
        return function () {
            var frame,
                createFrames,
                createElement;

            if (instance) {
                throw Error('There is can be only one instance of editor');
            }
            instance = this;

            createElement = function (tagName, attributes, text) {
                var elem = $('<' + tagName + '>');

                if (typeof attributes !== 'object') {
                    throw Error('*' + attributes * +'* must be an object');
                }
                if (text != null) {
                    $(elem).text(text);
                }
                for (var prop in attributes) {
                    if (attributes.hasOwnProperty(prop)) {
                        elem.attr(prop, attributes[prop]);
                    }
                }
                return elem;
            };

            frame = createElement('iframe', {
                id: "editor",
                text: "Your browser does`t support iframes"
            }).appendTo(this);

            setTimeout(function () {
                var frame_content = (frame[0].contentDocument) ? frame[0].contentDocument :
                        (frame[0].contentDocument ? frame[0].contentWindow.document : frame[0].document),
                    frame_window = frame[0].contentWindow || frame[0].contentDocument.defaultView,
                    fragment = frame_content.createDocumentFragment(),
                    frame_head = $(frame_content).find('head'),
                    frame_body = $(frame_content).find('body'),
                    editor_wrap,
                    editor_wrap_html,
                    gEBI,
                    anchor_div,
                    link_input_div,
                    anchor_wrap,
                    preview;


                gEBI = function (id) {
                    return frame_content.getElementById(id);
                };
                createElement('link', {rel: 'stylesheet',
                    href: window.location.origin + '/Editor/markup/editor/css/iframe-style.min.css?modified=20012009'
                }).appendTo(frame_head);
                createElement('script', {src: window.location.origin + '/Editor/markup/editor/js/uncompressed/libs/lib.min.js'}).appendTo(frame_head);

                createElement('input', {type: 'button', id: 'toggleBold', value: 'b'}).appendTo(fragment);
                createElement('input', {type: 'button', id: 'toggleUnderline', value: 'u'}).appendTo(fragment);
                createElement('input', {type: 'button', id: 'toggleItalic', value: 'i'}).appendTo(fragment);
                createElement('input', {type: 'button', id: 'toggleDelete', value: 'del'}).appendTo(fragment);

                /**
                 * @description - block with anchor button
                 */
                //anchor_wrap = createElement('div', {id: 'anchor-wrap'});
                //anchor_div = createElement('div', {id: 'anchor'});
                //createElement('input', {type: 'button', id: 'link', value: 'Create link from selected text'}).appendTo(anchor_div);
                //anchor_div.appendTo(anchor_wrap);
                //
                //link_input_div = createElement('div', {id: 'linkInput' });
                //createElement('input', {type: 'text', id: 'linkHref', value: 'http://www.example.com/'}).appendTo(link_input_div);
                //createElement('input', {type: 'button', id: 'createLink', value: 'Create link'}).appendTo(link_input_div);
                //link_input_div.appendTo(anchor_wrap);
                //
                //anchor_wrap.appendTo(fragment);

                frame_body.append(fragment);

                /**
                 * @description - div with contenteditable field
                 */
                createElement('div', {contenteditable: 'true',id: 'edit'}).appendTo(frame_body);

                createElement('button', {class: 'preview'}, 'preview').appendTo(frame_body);

                editor_wrap = $(gEBI('edit'));

                createFrames = function () {
                    var params = [
                            'height=' + screen.height,
                            'width=' + screen.width,
                            'top=0',
                            'left=0',
                            'resizable=yes',
                            'scrollbars=yes',
                            'toolbar=yes',
                            'menubar=yes',
                            'location=yes'
                        ].join(','),
                        newWin = window.open('', 'myEditor', params);
                    $(newWin.document.body).ready(function () {
                        editor_wrap_html = editor_wrap.html();
                        newWin.document.write(
                            '<html>' +
                            '<head>' +
                            '<title>Preview</title>' +
                            '<link rel="stylesheet" type="text/css" href="' + window.location.origin + '/Editor/markup/editor/css/preview.min.css?modified=20012009">' +
                            '</head>' +
                            '<body>');
                        $(newWin.document.body).html(editor_wrap_html);
                        newWin.document.write('' +
                        '</body>' +
                        '</html>');
                    });
                    newWin.document.close();
                    if (window.focus) {
                        newWin.focus();
                    }
                    return false;
                };

                /**
                 * create class for edit text buttons
                 * @param id_btn {string} - id of button
                 * @param class_name {string} - class for wrap element
                 * @param tag_name {string} - wrap element
                 * @constructor
                 */
                function ApplierStyle(id_btn, class_name, tag_name) {
                    this.applier = rangy.createClassApplier(class_name, {
                        elementTagName: tag_name,
                        ignoreWhiteSpace: false
                    });
                    this.btn = gEBI(id_btn);
                }

                ApplierStyle.prototype = {
                    toggleStyle: function () {
                        this.applier.toggleSelection(frame_window);
                    },
                    attachEvents: function () {
                        var self = this;

                        $(frame_content).on('empty', function () {
                            editor_wrap_html = editor_wrap.html();
                            if (editor_wrap_html === '' || /^((<(b|i|del|u)\sclass=".{1,4}"><br><\/\3>)|<br>)$/.test(editor_wrap_html)) {
                                editor_wrap.empty();
                                self.applier.undoToSelection(frame_window);

                            }
                        });

                        $(frame_content).on('keyup', function KeyCheck(e) {
                            var key = e.which || e.keyCode || e.charCode;
                            if (/^(<(strong|strike|em|ins|u)(.+)?>.+<\/\2>)$/.test(editor_wrap_html)) {
                                editor_wrap.html(editor_wrap_html);
                            }
                            if (key === 8 || key === 46) {
                                $.trim(editor_wrap_html);
                                $(frame_content).trigger('empty');
                            }
                        });

                        this.btn.ontouchstart = this.btn.onmousedown = function () {
                            this.toggleStyle();
                        }.bind(this);
                    }
                };

                rangy.init();
                // Enable buttons
                var classApplierModule = rangy.modules.ClassApplier;

                // Next line is pure paranoia: it will only return false if the browser has no support for ranges,
                // selections or TextRanges. Even IE 5 would pass this test.
                if (rangy.supported && classApplierModule && classApplierModule.supported) {
                    new ApplierStyle('toggleBold', 'custom-b', 'b').attachEvents();
                    new ApplierStyle('toggleUnderline', 'custom-u', 'u').attachEvents();
                    new ApplierStyle('toggleItalic', 'custom-i', 'i').attachEvents();
                    new ApplierStyle('toggleDelete', 'custom-del', 'del').attachEvents();
                }

                //$(frame_content).find('#link').on('click', function () {
                //    alert(rangy);
                //});

                $(frame_content).find('.preview').on('click', function () {
                    createFrames();
                });

                /**
                 * it create text node with text stuff which fill as first argument
                 * @param text {string} - some text
                 * @returns {*} textNode
                 */
                $.editorCustomdef.insertTextToEditor = function (text) {
                    var textNode = document.createTextNode(text);
                    editor_wrap.get(0).insertBefore(textNode, null);
                    return textNode;
                };

                /**
                 * it create selection acording to textNode which fill as 1st argument in iframe
                 * @param textNode - some text node
                 */
                $.editorCustomdef.createIframeSelection = function (textNode) {
                    var sel,
                        range;
                    sel = rangy.getIframeSelection(frame.get(0));
                    sel.removeAllRanges();
                    range = rangy.createIframeRange(frame.get(0));
                    range.selectNode(textNode);
                    sel.setSingleRange(range);
                };

                $.editorCustomdef.resolve();
                return instance;
            }, 100);

        };
    }();
}(jQuery));