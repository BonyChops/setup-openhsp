import { addPath, setFailed } from '@actions/core';
import { getInputs } from './setup/utils/input';
import { setupOpenHSP } from './utils/installition';
import { info } from 'console';

async function main() {
  try {
    const { buildTargets, openHSPVersion, parallelBuildNumber } = getInputs();

    const binPath = await setupOpenHSP(
      openHSPVersion,
      buildTargets,
      parallelBuildNumber,
    );

    info(`Adding ${binPath} to PATH`);
    addPath(binPath);

    info('Done!');
  } catch (e) {
    setFailed((e as Error).message);
  }
}

main();
