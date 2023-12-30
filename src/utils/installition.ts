import { debug, info } from '@actions/core';
import { cacheDir, downloadTool, extractTar } from '@actions/tool-cache';
import { PromisePool } from '@supercharge/promise-pool';
import { execSync } from 'child_process';

export function getFetchUrl(version: string): string {
  return `https://github.com/onitama/OpenHSP/archive/refs/tags/${version}.tar.gz`;
}

export async function setupOpenHSP(
  version: string,
  targets: string[],
  parallelNum: number,
  verbose: boolean,
): Promise<string> {
  info('Downloading OpenHSP...');
  const downloadPath = await downloadTool(
    getFetchUrl(version),
    'openhsp.tar.gz',
    'openhsp',
  );
  info('Extracting OpenHSP...');
  const extractPath = await extractTar(downloadPath);
  if (verbose) {
    debug(`extractedPath: ${extractPath}`);
  }
  if (parallelNum > 1) {
    info('Building OpenHSP...');
    const { results, errors } = await PromisePool.for(targets)
      .withConcurrency(parallelNum)
      .process(async (target) => {
        return execSync(`make ${target}`, {
          cwd: extractPath,
        });
      });

    if (verbose) {
      results.forEach((result) => {
        info(result.toString());
      });
    }

    if (errors.length > 0) {
      throw errors[0];
    }
  } else {
    info('Building OpenHSP...');
    targets.forEach((target) => {
      execSync(`make ${target}`, {
        cwd: extractPath,
      });
    });
  }

  const toolCachedDir = await cacheDir(extractPath, 'openhsp-test ', version);

  return toolCachedDir;
}
