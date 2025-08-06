/** @type {import('jest').Config} */
// const config = {
//     collectCoverageFrom: ["src/**/*.js"],
//     coverageDirectory: "coverage",
//     coverageProvider: "v8",
//     globalSetup: "<rootDir>/jest.global-setup.js",
//     setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.js"],
// }

// export default config
export default {
    globalSetup: "<rootDir>/jest.global-setup.js",
    setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.js"],
    collectCoverageFrom: ["src/**/*.js"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    // Sem transform!
}
