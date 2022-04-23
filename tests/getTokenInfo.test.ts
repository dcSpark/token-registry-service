import axios from "axios";
import { should } from "chai";
import CONFIG from '../config/default';
import { expect } from "chai";
import { Hosky } from './knownTokens';

const endpoint = `http://localhost:${CONFIG.APIGenerated.port}/`;
const s = should();

describe("/getTokenInfo", function() {
  this.timeout(10000);
  it("returns", async function() {
    const postData = { policyIdAssetMap: {
        [Hosky.policyId]: [Hosky.assetName]
    } };
    console.log(endpoint+"v1/getTokenInfo");
    const result = await axios.post(endpoint+"v1/getTokenInfo", postData);

    const { data } = result.data;

    expect(data).to.have.property(Hosky.policyId);
    const policyResult = data[Hosky.policyId];

    expect(policyResult).to.have.property(Hosky.assetName);
    const assetNameResult = policyResult[Hosky.assetName];

    s.exist(assetNameResult);
    assetNameResult.name.should.be.equal(Hosky.endpointResult.name);
    assetNameResult.ticker.should.be.equal(Hosky.endpointResult.ticker);
    assetNameResult.description.should.be.equal(Hosky.endpointResult.description);
    assetNameResult.policy.should.be.equal(Hosky.policyId);
    assetNameResult.url.should.be.equal(Hosky.endpointResult.url);
    assetNameResult.decimals.should.be.equal(Hosky.endpointResult.decimals);
    assetNameResult.logo.should.be.an("string");
  }); 
});
