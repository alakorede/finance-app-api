/** @type {import('jest').Config} */
const config = {
    collectCoverageFrom: ["src/**/*.js"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    globalSetup: "<rootDir>/jest.global-setup.js",
    setupFileAfterEnv: ["<rootDir>/jest.setup-after-env.js"],
}

export default config
