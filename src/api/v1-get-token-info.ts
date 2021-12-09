import { tokenRegistryData, tokenPolicyIdInfoMap } from './../index';
import type { IBaseRequest, IBaseResponse } from './../types/types';

type AssetInfoMap = Record<
  string,
  {
    name?: string;
    decimals?: number;
    ticker?: string;
    url?: string;
    policy: string;
    logo?: string;
    projectName?: string;
  }
>;
export type PolicyIdAssetInfoMap = Record<string, AssetInfoMap>;
type PolicyIdAssetMapType = Record<string, Array<string>>;
interface IReq extends IBaseRequest {
  body: { policyIdAssetMap: PolicyIdAssetMapType };
}
interface IRes extends IBaseResponse {
  json: (body: { success?: boolean; data: PolicyIdAssetInfoMap; message?: string }) => this;
}

export async function getTokenInfo(req: IReq, res: IRes): Promise<IRes> {
  const { policyIdAssetMap } = req.body;

  if (policyIdAssetMap == null) {
    return res.json({
      success: false,
      data: {},
      message: 'Invalid input.',
    });
  }

  // construct PolicyIdAssetInfoMap
  const result = Object.keys(policyIdAssetMap).reduce<PolicyIdAssetInfoMap>(
    (policyIdAssetInfoMap, policyId: string) => {
      const assetIds: string[] = policyIdAssetMap[policyId];

      // construct AssetInfoMap
      const assetInfoMap = assetIds.reduce<AssetInfoMap>((assetMap, assetId) => {
        // add data from CF token registry
        if (tokenRegistryData?.[policyId] != null) {
          assetMap[assetId] = tokenRegistryData?.[policyId][assetId];
        }

        // add data from from CNFT
        if (tokenPolicyIdInfoMap?.[policyId] != null) {
          assetMap[assetId] = { ...assetMap[assetId], ...(tokenPolicyIdInfoMap?.[policyId] ?? {}) };
        }

        return assetMap;
      }, {});

      if (Object.keys(assetInfoMap).length != 0) {
        policyIdAssetInfoMap[policyId] = assetInfoMap;
      }

      return policyIdAssetInfoMap;
    },
    {}
  );

  return res.json({
    success: true,
    data: result,
  });
}
