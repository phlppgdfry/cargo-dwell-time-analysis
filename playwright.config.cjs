const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  "testDir": "./tests/browser",
  "timeout": 30000,
  "fullyParallel": true,
  "reporter": [
    [
      "list"
    ],
    [
      "html",
      {
        "open": "never"
      }
    ]
  ],
  "use": {
    "baseURL": "http://127.0.0.1:4175",
    "trace": "retain-on-failure",
    "screenshot": "only-on-failure"
  },
  "projects": [
    {
      "name": "desktop",
      "use": {
        "browserName": "chromium",
        "viewport": {
          "width": 1440,
          "height": 1000
        }
      }
    },
    {
      "name": "mobile",
      "use": {
        "browserName": "chromium",
        "viewport": {
          "width": 390,
          "height": 844
        },
        "isMobile": true,
        "hasTouch": true
      }
    }
  ],
  "webServer": {
    "command": "python3 -m http.server 4175 --bind 127.0.0.1 --directory demo",
    "url": "http://127.0.0.1:4175",
    "reuseExistingServer": false
  }
});
