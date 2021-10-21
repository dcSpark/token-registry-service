import { tokenRegistryData } from './../index';
import type { IBaseRequest, IBaseResponse } from './../types/types';

export type PolicyInfoMap = Record<
  string,
  {
    name?: string;
    decimals?: number;
    ticker?: string;
    url?: string;
    policy: string;
    logo?: string;
  }
>;
type PolicyIdAssetMapType = Record<string, Array<string>>;
interface IReq extends IBaseRequest {
  body: { policyIdAssetMap: PolicyIdAssetMapType };
}
interface IRes extends IBaseResponse {
  json: (body: { success?: boolean; data: PolicyInfoMap; message?: string }) => this;
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

  const result = Object.keys(policyIdAssetMap).reduce<PolicyInfoMap>((res, policyId: string) => {
    if (tokenRegistryData?.[policyId] != null) {
      res[policyId] = tokenRegistryData?.[policyId];
    }
    return res;
  }, {});

  return res.json({
    success: true,
    data: result,
  });
}
