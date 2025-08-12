import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        dark: false,
        themes: {
        light: {
            primary: '#fb6f24',
            secondary: '#1e6495',
            accent: '#5191c1',
            error: '#FF5252',
            info: '#2196F3',
            success: '#8ca315',
            warning: '#FFC107',
            background: '#ffffff',
        },
        dark: {
            primary: '#fb6f24',
            secondary: '#1e6495',
        }
        }
    }
});
