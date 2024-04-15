const config = require("./package.json").projectConfig


module.exports = {
    mongoConfig : {
        connectionUrl : config.mongoConnectionUrl,
        database : "DeliveryApp",
        collections: {
            USERS: "users",
            RESTAURANTS: "restaurants",
            CARTS: "carts",
            FOODS: "foods",
            BOOKMARKS: "bookmarks",
            INVOICE: "invoice",
        },
    },
    serverConfig: {
        ip : config.sererIP,
        port : config.serverPort,
    },
    tokenSecrect: "deliveryapp_secret"
};