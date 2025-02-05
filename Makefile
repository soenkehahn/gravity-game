test:
	mocha --require @babel/register --require src/setup-tests.js 'tests/**/*.js'

test-watch:
	mocha --require @babel/register --require src/setup-tests.js 'tests/**/*.js' --watch

dev:
	PATH="./node_modules/.bin:${PATH}" parcel src/index.html

deploy-to-docs:
	rm docs -rf
	parcel build \
	  --public-url https://soenkehahn.github.io/gravity-game/ \
		--out-dir docs \
		src/index.html
