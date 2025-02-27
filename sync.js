const sequelize = require("./src/utils/sequelize")

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
    process.exit();
}).catch((err) => {
    console.error('An error occurred:', err);
    process.exit();
});
