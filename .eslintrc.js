module.exports = {
	"env": {
		"node": true,
		"mocha": true
	},
	"extends": [
		"eslint-config-jlai",
		"plugin:@typescript-eslint/recommended"
	],
	"ignorePatterns": [
		"venv/**",
		"dist"
	],
	'overrides': [{
		'files': ['**/*.spec.ts'],
		'rules': {
			'@typescript-eslint/no-invalid-this': 'off',
			'@typescript-eslint/no-magic-numbers': 'off'
		}
	}]
}