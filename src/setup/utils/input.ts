import { getInput, warning } from '@actions/core';

export const suppoertedBuildTargets = ['hspcmp', 'hsp3cl'];
export const supportedOpenHSPVersions = ['v3.6', 'v3.6beta5'];

export function validateBuildTarget(input: string[]) {
  if (input.length === 0) {
    throw new Error('No build targets found');
  }

  if (!input.every((target) => target !== '')) {
    throw new Error('Build target should not be empty');
  }

  const unsupportedTargets = input.filter(
    (target) => !suppoertedBuildTargets.includes(target),
  );
  if (unsupportedTargets.length > 0) {
    warning(
      `Building for ${unsupportedTargets.join(
        ', ',
      )} is currently not supported yet. Supported targets are ${suppoertedBuildTargets.join(
        ', ',
      )}`,
    );
  }
}

export function getBuildTargets(input: string): string[] {
  const r = input.split('\n').map((line) => line.trim());
  validateBuildTarget(r);
  return r;
}

export function validateOpenHSPVersion(input: string) {
  if (!supportedOpenHSPVersions.includes(input)) {
    warning(
      `OpenHSP version ${input} is not supported. Supported versions are ${supportedOpenHSPVersions.join(
        ', ',
      )}`,
    );
  }
}

export function getOpenHSPVersion(input: string): string {
  const r = input.trim();
  validateOpenHSPVersion(r);
  return input.trim();
}

export function getParallelBuildNumber(input: string): number {
  const r = parseInt(input.trim(), 10);
  if (isNaN(r)) {
    throw new Error('Parallel build number should be a number');
  }
  if (r < 1) {
    throw new Error('Parallel build number should be greater than 0');
  }
  return r;
}

export function getVerbose(input: string): boolean {
  return input.trim().toUpperCase() === 'TRUE';
}

export function getInputs(): {
  buildTargets: string[];
  openHSPVersion: string;
  parallelBuildNumber: number;
  verbose: boolean;
} {
  const buildTargets = getBuildTargets(getInput('build-targets'));
  const openHSPVersion = getOpenHSPVersion(getInput('openhsp-version'));
  const parallelBuildNumber = getParallelBuildNumber(
    getInput('parallel-build-num'),
  );
  const verbose = getVerbose(getInput('verbose'));
  return {
    buildTargets,
    openHSPVersion,
    parallelBuildNumber,
    verbose,
  };
}
