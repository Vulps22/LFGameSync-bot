const sequelize = require("./src/utils/sequelize");
const db = require("./src/models"); // Import all models to ensure associations are applied

const forceSync = process.argv.includes("--force");

async function syncDatabase() {
  try {
    if (forceSync) {
      console.warn("⚠️  Disabling foreign key checks...");
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;"); // ✅ Disable foreign key checks
    }

    await sequelize.sync({ force: forceSync, alter: !forceSync, logging: console.warn });

    if (forceSync) {
      console.warn("✅  Re-enabling foreign key checks...");
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;"); // ✅ Re-enable foreign key checks
    }

    console.log(`Database synchronized (force: ${forceSync})`);
    process.exit();
  } catch (err) {
    console.error("An error occurred:", err);
    process.exit(1);
  }
}

syncDatabase();
