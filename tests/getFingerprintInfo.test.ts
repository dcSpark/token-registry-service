import axios from "axios";
import { should } from "chai";
import CONFIG from '../config/default';
import { expect } from "chai";
import { Hosky, Liquid } from './knownTokens';

const endpoint = `http://localhost:${CONFIG.APIGenerated.port}/`;
const s = should();

describe("/getFingerprintInfo", function() {
  this.timeout(10000);
  it("returns", async function() {
    const postData = { fingerprintIdAssets: [Hosky.fingerprint, Liquid.fingerprint] };
    console.log(endpoint+"v1/getFingerprintInfo");
    const result = await axios.post(endpoint+"v1/getFingerprintInfo", postData);

    const { data } = result.data;

    // Hosky check
    {
        expect(data).to.have.property(Hosky.fingerprint);
        const registryInfo = data[Hosky.fingerprint];

        s.exist(registryInfo);

        registryInfo.name.should.be.equal(Hosky.endpointResult.name);
        registryInfo.ticker.should.be.equal(Hosky.endpointResult.ticker);
        registryInfo.description.should.be.equal(Hosky.endpointResult.description);
        registryInfo.policy.should.be.equal(Hosky.policyId);
        registryInfo.url.should.be.equal(Hosky.endpointResult.url);
        registryInfo.decimals.should.be.equal(Hosky.endpointResult.decimals);
        registryInfo.logo.should.be.an("string");
    }

    // liquid check
    {
        expect(data).to.have.property(Liquid.fingerprint);
        const registryInfo = data[Liquid.fingerprint];

        s.exist(registryInfo);
        registryInfo.name.should.be.equal(Liquid.endpointResult.name);
        registryInfo.ticker.should.be.equal(Liquid.endpointResult.ticker);
        registryInfo.description.should.be.equal(Liquid.endpointResult.description);
        registryInfo.policy.should.be.equal(Liquid.policyId);
        registryInfo.url.should.be.equal(Liquid.endpointResult.url);
        registryInfo.decimals.should.be.equal(Liquid.endpointResult.decimals);
        registryInfo.logo.should.be.an("string");
    }
  }); 
});
