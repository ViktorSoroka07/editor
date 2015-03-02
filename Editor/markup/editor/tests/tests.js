(function ($, undefined) {
    'use strict';
    var buttons_id,
        frame,
        frame_content,
        inputs,
        wrap = $('#editor-wrap'),
        for_singletone_wrap = $('#for-singletone');

    QUnit.test("before editor`s initialise", function (assert) {
        assert.propEqual(wrap[0].childElementCount, 0, 'Wrapper for editor has not child elements before initialise.');
        assert.propEqual(wrap.get(0).tagName, 'SECTION', 'Wrapper`s tag-name must be "SECTION".');
    });

    QUnit.test("after editor`s initialise", function (assert) {
        wrap.editorCustom();
        assert.propEqual(wrap[0].childElementCount, 1, 'Wrapper for editor must have one child element after initialise.');

        $.when($.editorCustomdef).then(function () {
            buttons_id = ['toggleBold', 'toggleUnderline', 'toggleItalic', 'toggleDelete'];
            frame = $('#editor');
            frame_content = (frame[0].contentDocument) ? frame[0].contentDocument :
                    (frame[0].contentDocument ? frame[0].contentWindow.document : frame[0].document);
            inputs = $(frame_content).find('body').find('>input');

            $.each(inputs, function (index, value) {
                assert.propEqual(value.id, buttons_id[index], 'Check button`s id for style text in editor - ' + buttons_id[index]);
            });
        });
    });

    QUnit.module("Editors`s API");
    QUnit.test("api", function (assert) {
        assert.propEqual(wrap[0].childElementCount, 1, 'Wrapper for editor must have one child element after initialise.');
        $.when($.editorCustomdef).then(function () {
            var edit = $(frame_content).find('body').find('#edit');
            /*
             block for create some selection in editor
             */
            var textNode = $.editorCustomdef.insertTextToEditor('Some text');
            $.editorCustomdef.createIframeSelection(textNode);

            /*
             check the style of selected text - bold, italic, underline, deleted
             */
            $.each(inputs, function (index, value) {
                $(value).trigger('mousedown');
                assert.equal($(edit).html(), '<' + value.value + ' class=\"' + 'custom-' + value.value + '\">' + $(edit).text() +
                    '</' + value.value + '>', 'Selected text must be bold.');
                $(value).trigger('mousedown');
                assert.equal($(edit).html(), 'Some text', 'Selected text must be just text without any style after double click.');
            });
        });
    });

    QUnit.test("Singletone", function (assert) {
        assert.raises(function () {
            for_singletone_wrap.editorCustom();
        }, Error, "Must throw error to pass.");
    });

}(jQuery));