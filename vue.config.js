// See: https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config
module.exports = {
    pwa: {
        name: 'Battleships Solitaire',
        themeColor: '#ffffff',
        msTileColor: '#ffffff',
        manifestOptions: {
            description: 'Play over 60 Battleships Solitaire logic puzzles of different sizes and difficulties.',
        },
        workboxOptions: {
        }
    },
};
