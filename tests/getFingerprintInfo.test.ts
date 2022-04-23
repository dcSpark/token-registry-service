import axios from "axios";
import { should } from "chai";
import CONFIG from '../config/default';
import { expect } from "chai";

const endpoint = `http://localhost:${CONFIG.APIGenerated.port}/`;
const s = should();

// https://cardanoassets.com/asset17q7r59zlc3dgw0venc80pdv566q6yguw03f0d9
const hosky = {
    policyId: 'a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235',
    assetName: '484f534b59',
    fingerprint: 'asset17q7r59zlc3dgw0venc80pdv566q6yguw03f0d9',
};

// https://cardanoassets.com/asset13epqecv5e2zqgzaxju0x4wqku0tka60wwpc52z
const liquid = {
    fingerprint: 'asset13epqecv5e2zqgzaxju0x4wqku0tka60wwpc52z',
    policyId: 'da8c30857834c6ae7203935b89278c532b3995245295456f993e1d24',
    assetName: '4c51',
}

describe("/getFingerprintInfo", function() {
  this.timeout(10000);
  it("returns", async function() {
    const postData = { fingerprintIdAssets: [hosky.fingerprint, liquid.fingerprint] };
    console.log(endpoint+"v1/getFingerprintInfo");
    const result = await axios.post(endpoint+"v1/getFingerprintInfo", postData);

    const { data } = result.data;

    // hosky check
    {
        expect(data).to.have.property(hosky.fingerprint);
        const registryInfo = data[hosky.fingerprint];

        s.exist(registryInfo);
        registryInfo.name.should.be.equal("HOSKY Token");
        registryInfo.ticker.should.be.equal("HOSKY");
        registryInfo.policy.should.be.equal(hosky.policyId);
        registryInfo.url.should.be.equal("https://hosky.io");
        registryInfo.decimals.should.be.equal(0);
        registryInfo.logo.should.be.an("string");
    }

    // liquid check
    {
        expect(data).to.have.property(liquid.fingerprint);
        const registryInfo = data[liquid.fingerprint];

        s.exist(registryInfo);
        registryInfo.name.should.be.equal("Liqwid DAO Token");
        registryInfo.ticker.should.be.equal("LQ");
        registryInfo.policy.should.be.equal(liquid.policyId);
        registryInfo.url.should.be.equal("https://liqwid.finance");
        registryInfo.decimals.should.be.equal(6);
        registryInfo.logo.should.be.an("string");
    }
  }); 
});
