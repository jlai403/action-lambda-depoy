import * as core from '@actions/core';
import { LambdaClient, UpdateFunctionCodeCommand, Architecture } from '@aws-sdk/client-lambda';
import { readFile } from 'fs/promises';

async function runAction(): Promise<void> {
	try {
		const client = new LambdaClient({ region: 'us-east-1', customUserAgent: 'github-action-lambda-deploy' });

		const functionName = core.getInput('function-name', { required: true });
		const zipLocation = core.getInput('zip-location', { required: true });
		const architectureInput = core.getInput('architecture');

		const architecture = architectureInput === 'arm64' ? Architecture.arm64 : Architecture.x86_64;

		const zipBuffer = await readFile(zipLocation);

		const updateLambdaCodeRequest = {
			FunctionName: functionName,
			Architectures: [architecture],
			ZipFile: zipBuffer
		};

		core.info(`Sending Update for Lambda function ${functionName}`);
		const command = new UpdateFunctionCodeCommand(updateLambdaCodeRequest);
		const response = await client.send(command);
		core.info(`Lambda function ${functionName} was updated to use code contained in: ${zipLocation} with status code of ${response.$metadata.httpStatusCode ?? ''}`);
	} catch (err) {
		const error = err as Error;
		core.setFailed(error.message);
		if (error.stack != null)
			core.info(error.stack);
	}
}

export default runAction;