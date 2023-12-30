import * as core from '@actions/core';
import {
  getBuildTargets,
  getOpenHSPVersion,
  getParallelBuildNumber,
  getVerbose,
  suppoertedBuildTargets,
  supportedOpenHSPVersions,
  validateBuildTarget,
  validateOpenHSPVersion,
} from '../../src/setup/utils/input';

const targets = ['hspcmp', 'hsp3cl', 'hsed', 'hsp3gp', 'hsp3dish', 'unknwown'];
const versions = ['v3.6', 'v3.6beta5', 'v3.5'];

// Function to generate all combinations of the targets array
const generateCombinations = (array: string[]) => {
  let result: string[][] = [];
  const f = (prefix: string[], array: string[]) => {
    for (let i = 0; i < array.length; i++) {
      result.push([...prefix, array[i]]);
      f([...prefix, array[i]], array.slice(i + 1));
    }
  };
  f([], array);
  return result;
};

test('validateBuildTarget with no input', () => {
  expect(() => validateBuildTarget([])).toThrow('No build targets found');
});

test('validateBuildTarget with empty string', () => {
  expect(() => validateBuildTarget([''])).toThrow(
    'Build target should not be empty',
  );
});

test('validateBuildTarget with every patterns', () => {
  // Generate all combinations of the targets array
  const allCombinations = generateCombinations(targets);

  // Test each combination
  allCombinations.forEach((combination) => {
    const spy = jest.spyOn(core, 'warning');
    if (combination.length === 0) {
      return;
    }
    expect(validateBuildTarget(combination)).toBeUndefined();
    if (
      combination.some((target) => !suppoertedBuildTargets.includes(target))
    ) {
      expect(spy).toHaveBeenCalledWith(
        `Building for ${combination
          .filter((target) => !suppoertedBuildTargets.includes(target))
          .join(
            ', ',
          )} is currently not supported yet. Supported targets are ${suppoertedBuildTargets.join(
          ', ',
        )}`,
      );
    }
  });
});

test('validateBuildTarget with empty array', () => {
  // Generate all combinations of the targets array
  const allCombinations = generateCombinations(targets);

  // Test each combination
  allCombinations.forEach((combination) => {
    const spy = jest.spyOn(core, 'warning');

    expect(getBuildTargets(combination.join('\n'))).toStrictEqual(combination);
    if (
      combination.some((target) => !suppoertedBuildTargets.includes(target))
    ) {
      expect(spy).toHaveBeenCalledWith(
        `Building for ${combination
          .filter((target) => !suppoertedBuildTargets.includes(target))
          .join(
            ', ',
          )} is currently not supported yet. Supported targets are ${suppoertedBuildTargets.join(
          ', ',
        )}`,
      );
    }
  });
});

test('validateOpenHSPVersion', () => {
  // Test each combination
  versions.forEach((version) => {
    const spy = jest.spyOn(core, 'warning');

    expect(validateOpenHSPVersion(version)).toBeUndefined();
    if (!supportedOpenHSPVersions.includes(version)) {
      expect(spy).toHaveBeenCalledWith(
        `OpenHSP version ${version} is not supported. Supported versions are ${supportedOpenHSPVersions.join(
          ', ',
        )}`,
      );
    }
  });
});

test('getOpenHSPVersion', () => {
  // Test each combination
  versions.forEach((version) => {
    expect(getOpenHSPVersion(`  ${version}  `)).toBe(version);
  });
});

test("getParallelBuildNumber with '1'", () => {
  expect(getParallelBuildNumber('1')).toBe(1);
});

test('getParallelBuildNumber with NaN', () => {
  expect(() => getParallelBuildNumber('a')).toThrow(
    'Parallel build number should be a number',
  );
});

test('getParallelBuildNumber with 0', () => {
  expect(() => getParallelBuildNumber('0')).toThrow(
    'Parallel build number should be greater than 0',
  );
});

test("getVerbose with 'true'", () => {
  expect(getVerbose('true')).toBe(true);
});

test("getVerbose with 'false'", () => {
  expect(getVerbose('false')).toBe(false);
});

test("getVerbose with 'TRUE'", () => {
  expect(getVerbose('TRUE')).toBe(true);
});

test("getVerbose with 'FALSE'", () => {
  expect(getVerbose('FALSE')).toBe(false);
});

afterEach(() => {
  jest.clearAllMocks();
});
