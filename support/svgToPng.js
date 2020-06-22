var path = require( 'path' );
var svg_to_png = require('svg-to-png');

async function convert() {
    await svg_to_png.convert(
        path.resolve('skins/moono-lexicon/icons'),
        path.resolve('ckeditor-dev/skins/moono-lexicon/icons/hidpi/'),
        {
            defaultWidth: '32px',
            defaultHeight: '32px',
        }
    );

    console.log('HIDPI PNG icons created');

    await svg_to_png.convert(
        path.resolve('skins/moono-lexicon/icons'),
        path.resolve('ckeditor-dev/skins/moono-lexicon/icons/'),
        {
            defaultWidth: '16px',
            defaultHeight: '16px',
        }
    );

    console.log('PNG icons created');
};

convert()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });