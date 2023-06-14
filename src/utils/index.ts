import type { Router } from 'express';
import path from 'path';
import fs from 'fs';
import AssetFingerprint from '@emurgo/cip14-js';
import CONFIG from "../../config/default";
import type { PolicyIdAssetInfoMap } from './../api/v1-get-token-info';

export const contentTypeHeaders = { headers: { 'Content-Type': 'application/json' } };

// https://github.com/cardano-foundation/cardano-token-registry
const POLICYID_HEX_INDEX = 56;

type Wrapper = (router: Router) => void;

export type CnftPolicyDataType = [
  {
    project: string;
    tags?: string[];
    policies: string[];
  }
];
export type PolicyIdInfoMap = Record<string, { projectName?: string }>;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router): void => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

export function assertNever(x: never): never {
  throw new Error('this should never happen' + x);
}

export type Nullable<T> = T | null;

export function readTokenRegistryMappings(): PolicyIdAssetInfoMap {
  const directoryPath = path.join(__dirname, CONFIG.APIGenerated.tokenMetadataDir);

  const result: PolicyIdAssetInfoMap = {};
  let filesRead = 0;
  let totalFiles = 0;

  try {
    const filenames = fs.readdirSync(directoryPath);
    totalFiles = filenames.length;
    console.log(`Total files in CF registry: ${totalFiles}`);
    filenames.forEach(file => {
      try {
        const filePath = `${directoryPath}/${file}`;
        const data = fs.readFileSync(filePath, 'utf8');
        const policyData = JSON.parse(data);

        const subjectId = policyData['subject'].trim();
        const subjectLen = subjectId.length;

        // first 56 letters-> policyIdHex
        const policyIdHex = subjectId.substring(0, POLICYID_HEX_INDEX);
        // remaining letters-> assetNameHex
        const assetNameHex = subjectId.substring(POLICYID_HEX_INDEX, subjectLen);

        if (result[policyIdHex] == null) {
          result[policyIdHex] = {};
        }
        result[policyIdHex][assetNameHex] = JSON.parse(
          JSON.stringify({
            name: policyData['name']?.['value'],
            ticker: policyData['ticker']?.['value'],
            policy: policyIdHex,
            description: policyData['description']?.['value'],
            logo: policyData['logo']?.['value'],
            url: policyData['url']?.['value'],
            decimals: policyData['decimals']?.['value'],
          })
        );
        ++filesRead;
      } catch (e) {
        console.error(`Error reading file: ${e} for subject: ${file}`);
      }
    });
  } catch (e) {
    console.error(`Error getting token registry: ${e} for subject:${directoryPath}`);
  }
  console.log(`Total files read: ${filesRead}`);
  console.log(`Error reading files: ${totalFiles - filesRead}`);
  return result;
}

type FingerprintLookupMap = {
  [x: string]: { policyId: string, assetName: string };
};
export function createFingerprintLookup(mapping: PolicyIdAssetInfoMap): FingerprintLookupMap {
  const result: FingerprintLookupMap = {};
  for (const [policyId, assetNames] of Object.entries(mapping)) {
    for (const assetName of Object.keys(assetNames)) {
      const assetFingerprint = AssetFingerprint.fromParts(
        Buffer.from(policyId, 'hex'),
        Buffer.from(assetName, 'hex'),
      );

      result[assetFingerprint.fingerprint()] = { policyId, assetName };
    }
  }

  return result;
}

export function readCNFTPolicyIds(): PolicyIdInfoMap {
  const policyIdInfoMap: PolicyIdInfoMap = {};

  // CNFT policyId follows - https://github.com/Cardano-NFTs/policyIDs/blob/main/internal/policy-id-schema.json
  const directoryPath = path.join(__dirname, '../registry/policyIDs/projects');
  let files: string[] = [];
  // get files paths
  files = getFilesRecursively(directoryPath, files);

  console.log(`Total project files read from CNFT repository: ${files.length}`);

  files.forEach((filePath: string) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const policyData: any = JSON.parse(data);

      if (Array.isArray(policyData)) {
        (policyData as CnftPolicyDataType).forEach(item => {
          const projectName = item.project;

          item.policies.forEach(policy => {
            if (policyIdInfoMap[policy] == null) {
              policyIdInfoMap[policy] = {};
            }

            policyIdInfoMap[policy] = { ...policyIdInfoMap[policy], projectName };
          });
        });
      } else if (typeof policyData === 'object') {
        const projectName = policyData.project;

        policyData.policies.forEach((policy: string) => {
          if (policyIdInfoMap[policy] == null) {
            policyIdInfoMap[policy] = {};
          }

          policyIdInfoMap[policy] = { ...policyIdInfoMap[policy], projectName };
        });
      }
    } catch (e) {
      console.log(`Error reading CNFT project file ${filePath}. Error: ${e}`);
    }
  });
  console.log(`Total unique policyIDs read from CNFT: ${Object.keys(policyIdInfoMap).length}`);

  return policyIdInfoMap;
}

function getFilesRecursively(directoryPath: string, files: string[]): string[] {
  try {
    const filesInDirectory = fs.readdirSync(directoryPath);
    for (const file of filesInDirectory) {
      const absolute = path.join(directoryPath, file);
      if (fs.statSync(absolute).isDirectory()) {
        getFilesRecursively(absolute, files);
      } else {
        files.push(absolute);
      }
    }
  } catch (e) {
    console.log(
      `Error reading CNFT project  file from directory ${directoryPath}. Error: ${JSON.stringify(
        e
      )}`
    );
  }
  return files;
}
