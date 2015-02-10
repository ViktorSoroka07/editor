(function ($) {
    'use strict';
    var frame,
        frame_content,
        createFrames;
    $.fn.editorCustom = function (options) {
        frame = $('<iframe>', {
            id: "editor",
            text: "Your browser does`t support iframes"
        }).appendTo(this);
        console.log(this);

        frame_content = frame.contents();

        $('<link>', {
            rel: 'stylesheet',
            href: 'css/iframe-style.css'
        }).appendTo(frame_content.find('head'));

        $('<div>', {
            contenteditable: 'true',
            id: 'edit'
        }).appendTo(frame_content.find('body'));

        frame.contents().find('#edit').on('keypress', function (event) {
            var docFragment,
                newEle,
                range,
                sel;

            if (event.which !== 13) {
                return true;
            }
            docFragment = document.createDocumentFragment();

            //add a new line
            newEle = document.createTextNode('\n');
            docFragment.appendChild(newEle);

            //add the br, or p, or something else
            newEle = document.createElement('br');
            docFragment.appendChild(newEle);

            //make the br replace selection
            range = document.getElementById('editor').contentWindow.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(docFragment);

            //create a new range
            range = document.createRange();
            range.setStartAfter(newEle);
            range.collapse(true);

            //make the cursor there
            sel = document.getElementById('editor').contentWindow.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            return false;
        });

        createFrames = function () {
            var params = [
                    'width=' + screen.width,
                    'height=' + screen.height,
                    'top=0',
                    'left=0',
                    'fullscreen=yes'
                ].join(','),
                newWin = window.open('', 'myEditor', params);

            $(newWin.document.body).ready(function () {
                var txt = frame_content.find('#edit').html();
                $(newWin.document.body).html(txt);
            });

            if (window.focus) {
                newWin.focus();
            }
            return false;
        };

        $('.preview').on('click', function () {
            createFrames();
        });
        return this;
    };

    $('#editor-wrap').editorCustom();

}(jQuery));