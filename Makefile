test:
	mocha --require babel-register 'tests/**/*.js'

test-watch:
	mocha --require babel-register 'tests/**/*.js' --watch

dev:
	webpack-dev-server --content-base dist

deploy-to-docs:
	webpack
	mkdir -p docs
	cp dist/* docs/
