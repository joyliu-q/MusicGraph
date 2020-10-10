import merge from 'deepmerge';
export const defaults = {
    customVariables: [],
    defaultAssets: {
        font: {
            family: 'Roboto'
        },
        icons: 'mdi'
    },
    optionsPath: undefined,
    treeShake: process.env.NODE_ENV === 'production'
};
export default function initOptions(moduleOptions) {
    const options = merge.all([
        defaults,
        this.options.vuetify || {},
        moduleOptions || {}
    ]);
    return options;
}
//# sourceMappingURL=options.js.map