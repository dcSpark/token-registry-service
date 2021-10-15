import { tokenRegistryData } from './../index';
import type { IBaseRequest, IBaseResponse } from './../types/types';

export type PolicyInfoMap = Record<
  string,
  {
    name?: string;
    decimals?: number;
    ticker?: string;
    url?: string;
  }
>;
interface IReq extends IBaseRequest {
  body: Array<{ policyId: string /* hex */; name: string /* hex */ }>;
}
interface IRes extends IBaseResponse {
  json: (body: { success?: boolean; data: PolicyInfoMap }) => this;
}

export async function getTokenInfo(req: IReq, res: IRes): Promise<IRes> {
  const policyIdArr = req.body;
  console.log(`policyIdArr`, policyIdArr);
  if (policyIdArr.length == null) {
    return res.json({
      success: false,
      data: {},
    });
  }

  const result = policyIdArr.reduce<PolicyInfoMap>((res, input) => {
    if (tokenRegistryData?.[input.policyId] != null) {
      res[input.policyId] = tokenRegistryData?.[input.policyId];
    }
    return res;
  }, {});

  return res.json({
    success: true,
    data: result,
  });
}
