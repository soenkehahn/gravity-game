test: dist_tests/tests/scene_test.js dist_tests/src/scene.js \
	dist_tests/tests/ui/scene_test.js dist_tests/src/ui/scene.js \
	dist_tests/tests/objects_test.js dist_tests/src/objects.js

	mocha \
		dist_tests/tests/objects_test.js \
	  dist_tests/tests/scene_test.js \
		dist_tests/tests/ui/scene_test.js

dist_tests/tests/%.js: tests/%.js
	babel $< --out-dir dist_tests

dist_tests/src/%.js: src/%.js
	babel $< --out-dir dist_tests

dev:
	webpack-dev-server --content-base dist
