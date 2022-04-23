import axios from "axios";
import { should } from "chai";
import CONFIG from '../config/default';
import { expect } from "chai";

const endpoint = `http://localhost:${CONFIG.APIGenerated.port}/`;
const s = should();

// https://cardanoassets.com/asset17q7r59zlc3dgw0venc80pdv566q6yguw03f0d9
const hosky = {
    policyId: 'a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235',
    assetName: '484f534b59'
};

describe("/getTokenInfo", function() {
  this.timeout(10000);
  it("returns", async function() {
    const postData = { policyIdAssetMap: {
        [hosky.policyId]: [hosky.assetName]
    } };
    console.log(endpoint+"v1/getTokenInfo");
    const result = await axios.post(endpoint+"v1/getTokenInfo", postData);

    const { data } = result.data;

    expect(data).to.have.property(hosky.policyId);
    const policyResult = data[hosky.policyId];

    expect(policyResult).to.have.property(hosky.assetName);
    const assetNameResult = policyResult[hosky.assetName];

    s.exist(assetNameResult);
    assetNameResult.name.should.be.equal("HOSKY Token");
    assetNameResult.ticker.should.be.equal("HOSKY");
    assetNameResult.policy.should.be.equal(hosky.policyId);
    assetNameResult.url.should.be.equal("https://hosky.io");
    assetNameResult.decimals.should.be.equal(0);
    assetNameResult.logo.should.be.an("string");
  }); 
});
