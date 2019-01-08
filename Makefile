test:
	mocha --require @babel/register --require src/setup-tests.js 'tests/**/*.js'

test-watch:
	mocha --require @babel/register --require src/setup-tests.js 'tests/**/*.js' --watch

dev:
	parcel src/index.html

deploy-to-docs:
	parcel build \
	  --public-url https://soenkehahn.github.io/gravity-game/ \
		--out-dir docs \
		src/index.html
