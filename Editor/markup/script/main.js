(function ($) {
    'use strict';
    var frame,
        frame_content,
        createFrames,
        frame_window;
    $.fn.editorCustom = function (options) {
        frame = $('<iframe>', {
            id: "editor",
            text: "Your browser does`t support iframes"
        }).appendTo(this);

        setTimeout(function () {
            frame_content = (frame[0].contentDocument) ? frame[0].contentDocument :
                (frame[0].contentDocument ? frame[0].contentWindow.document : frame[0].document);
            frame_window = frame[0].contentWindow || frame[0].contentDocument.defaultView;
            $('<link>', {
                rel: 'stylesheet',
                href: 'css/iframe-style.css?t=<?= time(); ?>"'
            }).appendTo($(frame_content).find('head'));

            $('<script>', {
                src: 'script/rangy-core.js'
            }).appendTo($(frame_content).find('head'));

            $('<script>', {
                src: 'script/rangy-classapplier.js'
            }).appendTo($(frame_content).find('head'));

            $('<div>', {
                contenteditable: 'true',
                id: 'edit'
            }).appendTo($(frame_content).find('body'));
            //$(frame_content).find('#edit').text('asdasd');

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
                        '<link rel="stylesheet" type="text/css" href="css/preview.css?t=<?= time(); ?>">' +
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
            $('.preview').on('click', function () {
                createFrames();
            });
            return this;
        }, 100);
    };
    $('#editor-wrap').editorCustom();
}(jQuery));