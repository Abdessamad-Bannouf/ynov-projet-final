/** @type {import('jest').Config} */
module.exports = {
    testMatch: ["**/tests/**/*.test.js"],
    testEnvironment: "node",
    setupFiles: ["<rootDir>/tests/setupEnv.js"], // 👈 charge .env.test en tout premier
};