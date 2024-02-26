import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { configParam } from '../bin/exfilms.js';

export async function createDefaultDirectories(){
    // Create output directory/directories
    if (!existsSync(configParam.outputDirectory)) {
        mkdirSync(configParam.outputDirectory, { recursive: true });

        // If output format is TSV
        if(configParam.outputFormat === 'TSV'){
            mkdirSync(join(configParam.outputDirectory, 'spectrum/'), { recursive: true });
            mkdirSync(join(configParam.outputDirectory, 'chromatogram/'), { recursive: true });
        }
    }

    // Create log directory
    if (!existsSync(configParam.logDirectory)) {
        mkdirSync(configParam.logDirectory, { recursive: true });
    }
}