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
interface IReq extends IBaseRequest {
  body: { policyIdArr: Array<{ policyId: string /* hex */; name: string /* hex */ }> };
}
interface IRes extends IBaseResponse {
  json: (body: { success?: boolean; data: PolicyInfoMap; message?: string }) => this;
}

export async function getTokenInfo(req: IReq, res: IRes): Promise<IRes> {
  const { policyIdArr } = req.body;

  if (policyIdArr == null || policyIdArr?.length == 0) {
    return res.json({
      success: false,
      data: {},
      message: 'Invalid input.',
    });
  }

  const result = policyIdArr.reduce<PolicyInfoMap>((res, input) => {
    if (tokenRegistryData?.[input.policyId] != null) {
      res[input.policyId] = tokenRegistryData?.[input.policyId];
    }
    // What to return in case there is not informationa about policyID?
    return res;
  }, {});

  return res.json({
    success: true,
    data: result,
  });
}
