import { debug, info } from '@actions/core';
import { cacheDir, downloadTool, extractTar } from '@actions/tool-cache';
import { PromisePool } from '@supercharge/promise-pool';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export function getFetchUrl(version: string): string {
  return `https://github.com/onitama/OpenHSP/archive/refs/tags/${version}.tar.gz`;
}

export async function setupOpenHSP(
  version: string,
  targets: string[],
  parallelNum: number,
): Promise<string> {
  info('Downloading OpenHSP...');
  const downloadPath = await downloadTool(
    getFetchUrl(version),
    'openhsp.tar.gz',
    'openhsp',
  );
  info('Extracting OpenHSP...');
  const extractPathForTar = await extractTar(downloadPath);

  const extractDirForTar = fs.readdirSync(extractPathForTar, {
    withFileTypes: true,
  });

  extractDirForTar.forEach((dirent) => {
    debug(`------------------`);
    debug(`dirent.path: ${dirent.name}`);
    debug(`dirent.path: ${dirent.path}`);
    debug(`dirent.isDirectory(): ${dirent.isDirectory()}`);
  });

  // get directories in extractPath
  const extractDirName = extractDirForTar.find((dirent) => dirent.isDirectory())
    ?.name;

  if (!extractDirName) {
    throw new Error('Extracted path is not found');
  }

  const extractPath = path.join(extractPathForTar, extractDirName);
  debug(`extractPath: ${extractPath}`);

  if (parallelNum > 1) {
    info('Building OpenHSP...');
    const { results, errors } = await PromisePool.for(targets)
      .withConcurrency(parallelNum)
      .process(async (target) => {
        return execSync(`make ${target}`, {
          cwd: extractPath,
        });
      });

    results.forEach((result) => {
      debug(result.toString());
    });

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
