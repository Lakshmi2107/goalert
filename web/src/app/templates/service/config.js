let env = process.env.NODE_ENV
env = 'development'

let Config = {
    baseUrl: "https://goalert.sadc-tlmy-stg01.carbon.lowes.com/",
    //baseUrl: "http://localhost:8080/",
    mimCreate: 'mim/create',
}

if(env === 'development') {
    Config.baseUrl = "https://goalert.sadc-tlmy-dev01.carbon.lowes.com/"
    //Config.baseUrl = "http://localhost:8080/"
} else if(env === 'stage') {
    Config.baseUrl = "https://goalert.sadc-tlmy-stg01.carbon.lowes.com/"
} else if(env === 'production') {
    Config.baseUrl = "https://goalert.wsdc-tlmy-stg01.carbon.lowes.com/"
}

export default Config
