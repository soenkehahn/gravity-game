test:
	mocha-webpack --webpack-config webpack_test.config.js 'tests/**/*.js'

test-watch:
	mocha-webpack --webpack-config webpack_test.config.js 'tests/**/*.js' --watch

dev:
	webpack-dev-server --content-base dist

deploy-to-docs:
	webpack
	mkdir -p docs
	cp dist/* docs/
