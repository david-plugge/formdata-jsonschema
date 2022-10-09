/**
 * @type {import('jest').Config}
 */
const config = {
	transform: { '^.+\\.ts?$': 'ts-jest' },
	testEnvironment: 'node',
	testRegex: '/src/.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions: ['ts', 'js']
};

module.exports = config;
