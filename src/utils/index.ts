import type { Router } from 'express';
import path from 'path';
import fs from 'fs';

import type { PolicyInfoMap } from './../api/v1-get-token-info';

export const contentTypeHeaders = { headers: { 'Content-Type': 'application/json' } };

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router): void => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

export function assertNever(x: never): never {
  throw new Error('this should never happen' + x);
}

export type Nullable<T> = T | null;

export function readTokenRegistryMappings(): PolicyInfoMap {
  const directoryPath = path.join(__dirname, '../registry/cardano-foundation/mappings');

  const result: PolicyInfoMap = {};

  try {
    const filenames = fs.readdirSync(directoryPath);
    filenames.forEach(file => {
      const filePath = `${directoryPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf8');
      const policyData = JSON.parse(data);
      if (policyData?.['policy']) {
        result[policyData?.['policy']] = {
          name: policyData['name']?.['value'],
          ticker: policyData['ticker']?.['value'],
          policy: policyData['policy'],
          logo: policyData['logo']?.['value'],
          url: policyData['url']?.['value'],
          decimals: policyData['decimals']?.['value'],
        };
      }
    });
  } catch (e) {
    console.error(`Error getting token regsitry: ${e}`);
  }
  return result;
}
