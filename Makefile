test:
	mocha --require babel-register --require src/setup-tests.js 'tests/**/*.js'

test-watch:
	mocha --require babel-register --require src/setup-tests.js 'tests/**/*.js' --watch

dev:
	webpack-dev-server --content-base dist

deploy-to-docs:
	webpack
	mkdir -p docs
	cp dist/* docs/
