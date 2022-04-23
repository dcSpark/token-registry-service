import { tokenFingerprintLookup } from './../index';
import type { IBaseRequest, IBaseResponse, RegistryData } from './../types/types';
import type { PolicyIdAssetMapType } from './v1-get-token-info';
import { buildTokenInfoResult } from './v1-get-token-info';

export type FingerprintInfoMap = Record<
  string,
  RegistryData
>;
interface IReq extends IBaseRequest {
  body: { fingerprintIdAssets: string[] };
}
interface IRes extends IBaseResponse {
  json: (body: { success?: boolean; data: FingerprintInfoMap; message?: string }) => this;
}

export async function getFingerprintInfo(req: IReq, res: IRes): Promise<IRes> {
  const { fingerprintIdAssets } = req.body;

  if (fingerprintIdAssets == null) {
    return res.json({
      success: false,
      data: {},
      message: 'Invalid input.',
    });
  }

  // convert the fingerprint request to the standard policyId + assetName lookup form
  const { request, lookupSubset } = buildRequest(fingerprintIdAssets);
  const registryInfo = buildTokenInfoResult(request);

  const result: FingerprintInfoMap = {};
  for (const [fingerprint, policyInfo] of Object.entries(lookupSubset)) {
    const entry = registryInfo[policyInfo.policyId]?.[policyInfo.assetName];
    if (entry == null) continue;
    result[fingerprint] = entry;
  }

  return res.json({
    success: true,
    data: result,
  });
}

function buildRequest(fingerprints: string[]): { request: PolicyIdAssetMapType, lookupSubset: typeof tokenFingerprintLookup }  {
    // subset of the fingerprint lookup map that we used for this query
    const lookupSubset: typeof tokenFingerprintLookup = {};
    const request = fingerprints.reduce((acc, fingerprint) => {
        const infoForToken = tokenFingerprintLookup[fingerprint];
        if (infoForToken == null) return acc;

        lookupSubset[fingerprint] = infoForToken;

        const assetsForPolicy = acc[infoForToken.policyId];
        if (assetsForPolicy == null) {
            acc[infoForToken.policyId] = [infoForToken.assetName];
        } else {
            assetsForPolicy.push(infoForToken.assetName);
        }
        return acc;
    }, ({} as PolicyIdAssetMapType));

    return { request, lookupSubset };
}