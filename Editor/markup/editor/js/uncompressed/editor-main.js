(function ($) {
    'use strict';
    var frame,
        createFrames;
    $.fn.editorCustom = function (options) {

        frame = $('<iframe>', {
            id: "editor",
            text: "Your browser does`t support iframes"
        }).appendTo(this);

        setTimeout(function () {
            var frame_content = (frame[0].contentDocument) ? frame[0].contentDocument :
                    (frame[0].contentDocument ? frame[0].contentWindow.document : frame[0].document),
                frame_window = frame[0].contentWindow || frame[0].contentDocument.defaultView,
                fragment = frame_content.createDocumentFragment();

            $('<link>', {
                rel: 'stylesheet',
                href: 'editor/css/iframe-style.min.css?t=<?= time(); ?>"'
            }).appendTo($(frame_content).find('head'));

            $('<script>', {
                src: 'editor/js/uncompressed/libs/lib.min.js'
            }).appendTo($(frame_content).find('head'));


            $('<input>', {type: 'button', id: 'toggleBold', value: 'B'}).appendTo(fragment);
            $('<input>', {type: 'button', id: 'toggleUnderline', value: 'U'}).appendTo(fragment);
            $('<input>', {type: 'button', id: 'toggleItalic', value: 'I'}).appendTo(fragment);
            $('<input>', {type: 'button', id: 'toggleDelete', value: 'Del'}).appendTo(fragment);
            frame_content.body.appendChild(fragment);

            $('<div>', {
                contenteditable: 'true',
                id: 'edit'
            }).appendTo($(frame_content).find('body'));

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
                    var txt = $(frame_content).find('#edit').html();
                    newWin.document.write('<html>' +
                        '<head>' +
                        '<title>Preview</title>' +
                        '<link rel="stylesheet" type="text/css" href="editor/css/preview.min.css?t=<?= time(); ?>">' +
                        '</head>' +
                        '<body>');
                    $(newWin.document.body).html(txt);
                    newWin.document.write('</body></html>');
                });
                newWin.document.close();
                if (window.focus) {
                    newWin.focus();
                }
                return false;
            };

            function gEBI(id) {
                return frame_content.getElementById(id);
            }

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
                        //console.log(rangy.getSelection(frame_window));
                        if ($(gEBI('edit')).html() === '' || /^((<(b|i|del|u)\sclass=".{1,4}"><br><\/\3>)|<br>)$/.test(($(gEBI('edit')).html()))) {
                            $(gEBI('edit')).empty();
                            self.applier.undoToSelection(frame_window);
                        }
                    });

                    $(frame_content).on('keyup', function KeyCheck(e) {
                        var key = e.which || e.keyCode || e.charCode;
                        if (/^(<(strong|strike|em|ins|u)(.+)?>.+<\/\2>)$/.test(($(gEBI('edit')).html()))) {
                            $(gEBI('edit')).html($(gEBI('edit')).text());
                        }

                        if (key === 8 || key === 46) {
                            $.trim($(gEBI('edit')).html());
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
                new ApplierStyle('toggleBold', 'bold', 'b').attachEvents();
                new ApplierStyle('toggleUnderline', 'und', 'b').attachEvents();
                new ApplierStyle('toggleItalic', 'ita', 'i').attachEvents();
                new ApplierStyle('toggleDelete', 'del', 'del').attachEvents();
            }
            $('.preview').on('click', function () {
                createFrames();
            });
            return this;
        }, 100);
    };
}(jQuery));