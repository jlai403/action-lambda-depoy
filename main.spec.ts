import { expect, jest } from '@jest/globals';

import * as fs from 'fs';
import * as core from '@actions/core';
import runAction from './main';
import { Architecture, LambdaClient, UpdateFunctionCodeCommand, type UpdateFunctionCodeCommandInput } from '@aws-sdk/client-lambda';
import { mockClient } from 'aws-sdk-client-mock';

jest.mock('@actions/core');
const lambdaMock = mockClient(LambdaClient);

describe('#runAction', function() {
	beforeEach(function() {
		jest.resetModules();
		process.env.GITHUB_WORKSPACE = '';

		jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from(''));
		jest.spyOn(core, 'getInput').mockImplementation((argument) => {
			return argument;
		});

		lambdaMock.reset();
		lambdaMock.on(UpdateFunctionCodeCommand).resolves({});
	});

	it('should upload lambda', async function() {
		await runAction();

		const updateFunctionCodeInput: UpdateFunctionCodeCommandInput = { 
			FunctionName: 'function-name',
			ZipFile: Buffer.from(''),
			Architectures: [Architecture.x86_64]
		};  

		expect(lambdaMock.commandCalls(UpdateFunctionCodeCommand, updateFunctionCodeInput).length).toEqual(1);
	});
});