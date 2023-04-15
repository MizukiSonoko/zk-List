import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZkMoku", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ZkMoku = await ethers.getContractFactory("ZkMoku");
    const name = "zkMoku";
    const symbol = "zkm"

    const zkm = await ZkMoku.deploy(name, symbol);

    return { zkm, owner, otherAccount };
  }

  describe("Group", function () {    
    it("Should fail when trying to get a nonexistent group", async function () {
      const { zkm } = await loadFixture(deployContract);
      await expect(zkm.getGroup(0)).to.be.revertedWith("Group does not exist");
    });

    describe("RegisterGroup", function () {
      it("Should register a new group", async function () {
        const { zkm, owner } = await loadFixture(deployContract);  
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const signature = "eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=";
  
        await zkm.connect(owner).regiserGroup(h, kpPub, signature);
  
        const group = await zkm.getGroup(0);
        expect(group.h).to.equal(h);
        expect(group.kpPub).to.equal(kpPub);
        expect(group.signature).to.equal(signature);
      });

      it("Should fail when trying to register a group with an empty h", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
        const emptyH = "";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const signature = "eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=";
    
        await expect(zkm.connect(owner).regiserGroup(emptyH, kpPub, signature)).to.be.revertedWith("h must not be empty");
      });

      it("Should fail when trying to register a group with an empty kpPub", async function () {
        const { zkm, owner } = await loadFixture(deployContract);  
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const emptyKpPub = "";
        const signature = "eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=";
    
        await expect(zkm.connect(owner).regiserGroup(h, emptyKpPub, signature)).to.be.revertedWith("kpPub must not be empty");
      });
  
      it("Should fail when trying to register a group with empty signatures", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const emptySignature = "";
        await expect(zkm.connect(owner).regiserGroup(h, kpPub, emptySignature)).to.be.revertedWith('signature must not be empty');
      });
  
      it("Should register multiple groups with valid data", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
      
        const groupsData = [
          {
            h: "testH1",
            kpPub: "testKpPub1",
            signature: "testSig"
          },
          {
            h: "testH2",
            kpPub: "testKpPub2",
            signature: "testSig"
          }
        ];
      
        for (let i = 0; i < groupsData.length; i++) {
          const { h, kpPub, signature } = groupsData[i];
          await zkm.connect(owner).regiserGroup(h, kpPub, signature);
          const group = await zkm.getGroup(i);
          expect(group.h).to.equal(h);
          expect(group.kpPub).to.equal(kpPub);
          expect(group.signature).to.equal(signature);
        }
      });
    });

    describe("Mint", function () {
      it("Should mint proof", async function () {
        const { zkm, owner } = await loadFixture(deployContract);  
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const signature = "eyIxNjM0MzAyNTgxIjoiRW16UUUwZ3REM0lpZVRxYlJ0M1NwY3Q2TjF3UytiQnVDMG5DOUFDL2Vib2lxeE1jTVpCcnBjODFqU3pqWjJGYWtMa3NkWGoyWVJhcjRzMHhhSHM4RkFmNmFBb0hYY2pod2xJdU9Ra0JacG9uNGhod0VvWHgxKy9XR0RlenBiTCtCdmc4RWlIN2o2bEhzcUZxa1FBUzhxWjhYMlF6N0NtNU12MzA5M1RWNTA0PSIsIjQ2OTkyMDUzODk4NSI6IkZwN0hhTTQwdVlRSVBWYk1qR2doRkQ1UlNxMWZ6akhtdVJpVVdISnRxcEFPZGVDQjVNRGFYenUrNVo2TUF4YnJab3hCdkFLcjVrcnR2RzNaU3lSTlNDU083ODhTN2xxaWdaaEJPc0lheTNGRzdGNXZJbmJaQUNWeHhxeGF0akRmR3kwdDl4SGdnOFZINTJmQlBwbk12VXY0aGFBYm5kYzZJSk44N1JSY2M0ST0iLCI1MDAwODU1MjA3NTEiOiJIQTdFcmZvRnliMmg1azEzY1B3aU1tSVBYb2FWRXpvaG9uTE10T01wRGN3YXhoaC92VjZnTEhoNUdDcTloOFJGMm1ZeStrV3p1a2ZKMFZWRWtEWGNZU1hFd2pFNlZtMWRjTnlBZTRmUDMxWG9MbE5NMVFVY0dvK3U3MTJPcm0zOEtzMGVKeVd1SWs3eHVPWW8vNkJiQnFQRVFHYll0N2V4OHJIdnBMWmlJUUE9In0=";
  
        await zkm.connect(owner).regiserGroup(h, kpPub, signature);
      
        const proof = {
            v: "FJEt9RyDUXSa+OQXBLf7NR7vEbfFhglh4Ugcpdb0OugkF1JWi0qrAMtFJC1SuSBtYqG/Y1SFtR6zOL2XQ2QLGAyuA5fjgamNqsg7BW5Eny2Q9K1Abfjjhf+C9uFLfnHHLafV8tuqZtg+4NHd6p+Kf8Yutd5u0VKMZONRP63G46A=",
            d: "E/lBpNNxMl1ITnIoa8SgCTYz+p7IhjFyk2sJcRtuqAsZwDORXgQcQIl9irz2mVv5WUqzoTs9Rp8ZG4OGTzLtNQjhoxRtlAKKTqOMZiKy62GtmxmtM2SMmWFjktg96jCLCCwCiTibjFakCz1aKRJpVtkvgoUo/B0E6sk2oH9rK/0=",
            c: "EIbmbcw+4s51lTmMxOLWQLrTe9kxzpSM0yhayhdRBnMKVZPpBK4fNBIC4vo3DxqOqkaHocHAbepa+0yquxfw9xjZ4drJmihrDPuTwU9UXrIpTRHQB94qEYmqCewBt5SOEEd9iQmPENY65hYBoCyOwfmDRdAkm1wFyHtYkJvcxew=",
            a: "Fo7riLYnSOZ2gL0zqikJ8sdNuQJQcCTGUVdq9DsVEU8PwCY691rMznMkErbaweHaWy6nmjlK2iFMyfA81XAOegCuRLu1lHnXonWgFlemm5i1kJDihnj4b5pJhdZdaJBbJQ+qsrjKv+flpu0xtuk42/+rG9fEes17VTnwu9eInYwtMxqfM0J94/mAtTaZsFGJ7sQxrHVJkCz1RrwLM8KWVQBLvPp47380r3y9gqFk8s8Dq7y4o+S2pPUrYylIEwOrLnZ/UlQncLuBUcPGjBqRg1rbbo0SwUZQvvVi0ThtK50nSNhPxqcFjHAtHmVWSOSGBrAvGEUmUDh5USzcodVwtS0oTkH4NT59MTNKKNlnFZy5z8EU3zGo67rjeFm+PyF6HlLl+z4EOTvKrxIP3fWVkWI6jvplrvjy9ITCI337ngcpKO8ZuLCywuUfza56Iq/vON1cKHg3c5Ou5MSEXmbWggdB5WAwdA/5iYqMNqX98Eu2ay6lJManedrXH0Qfwot3",
            zSig: "17682734444019248343005217203854695907703976560836592283567470411685041141083",
            zv: "8526820381122965367135703469901853931752026554903960304161810816419417418618",
            cc: "9361066627814728331217474744779135064006949685625614772727405237554429452979",
            m: "20171395843928781866706725490469850981060751649815892015998393000320252117282",
            zr: "1362848011700984593410905482090008718126698540668686712275568323044454227758"
        };

        await zkm.mintProof(0, proof, owner.address);

        console.log("result", await zkm.tokenURI(1));
      });

    });

    
  });
  
});
