import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        dark: false,
        themes: {
        light: {
            primary: '#C68EFD',
            secondary: '#FDB7EA',
            accent: '#FFDCCC',
            error: '#FF8282',
            info: '#2196F3',
            success: '#DEE791',
            warning: '#FBF3B9',
            background: '#ffffff',
        },
        dark: {
            primary: '#205781',
            secondary: '#4F959D',
        }
        }
    }
});
