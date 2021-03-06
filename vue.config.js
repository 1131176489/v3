module.exports = {
    chainWebpack: (config) => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals', {
                echarts: 'echarts'
            })
        })
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/'
}