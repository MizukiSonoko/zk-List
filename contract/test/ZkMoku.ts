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
        const signatures = [
          {
            id: "500085520751",
            signature: "ITugvC40rtDRSlEJhy1XN8gfX/K1TMylzdO4CapA3EwJ+3+V4FS4DGbbel+eDldg7m2kZMmdaC92rJ5lhnzywSKUO5KYkSuv3EOuGv8MeTY7Y1xTAKPX4nlKaIjiFegBLKh1wys4MbaHx92awvi3nZYD+Z95Cc3yAA25P+gEC+g="
          },
          {
            id: "1634302581",
            signature: "HZZEK4e41bbmXjsX2DkIReXeP2cUEXejMARv9vqVjdYO6IjpYUfP1uwcvhgWy0xnYMAZckvP0y+cFwdP2urdvgCzR80a+tAjVHydrMB6xn5u3tasvXVc4UiOPqL7379xGZSjYKsf4nDd9apyq9gOjn6ECUrV2JqyD9ZuNYHPuxk=",
          },
          {
            id: "440056640873",
            signature: "Byp+fyCRyDLIUz+/wzePacemjB7gNhZasNqR5fksGsMUnHMWqa68w8ItMixEDNegBf4VkYBGQenlDaSKX9Dv2xammUPwRK8822D83Ty5dAatS24l8KyRxDrT+cIZDRvXGuWTViIbmHdG76SNpwqHAkAaGcTBAlkFPlXOQO+imLw=",
          },
        ];
  
        await zkm.connect(owner).regiserGroup(h, kpPub, signatures);
  
        const group = await zkm.getGroup(0);
        expect(group.h).to.equal(h);
        expect(group.kpPub).to.equal(kpPub);
        expect(group.signatures.length).to.equal(signatures.length);
        for (let i = 0; i < signatures.length; i++) {
          expect(group.signatures[i].id).to.equal(signatures[i].id);
          expect(group.signatures[i].signature).to.equal(signatures[i].signature);
        }
      });

      it("Should fail when trying to register a group with an empty h", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
        const emptyH = "";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const signatures = [
          {
            id: "500085520751",
            signature: "ITugvC40rtDRSlEJhy1XN8gfX/K1TMylzdO4CapA3EwJ+3+V4FS4DGbbel+eDldg7m2kZMmdaC92rJ5lhnzywSKUO5KYkSuv3EOuGv8MeTY7Y1xTAKPX4nlKaIjiFegBLKh1wys4MbaHx92awvi3nZYD+Z95Cc3yAA25P+gEC+g="
          },
          {
            id: "1634302581",
            signature: "HZZEK4e41bbmXjsX2DkIReXeP2cUEXejMARv9vqVjdYO6IjpYUfP1uwcvhgWy0xnYMAZckvP0y+cFwdP2urdvgCzR80a+tAjVHydrMB6xn5u3tasvXVc4UiOPqL7379xGZSjYKsf4nDd9apyq9gOjn6ECUrV2JqyD9ZuNYHPuxk=",
          },
          {
            id: "440056640873",
            signature: "Byp+fyCRyDLIUz+/wzePacemjB7gNhZasNqR5fksGsMUnHMWqa68w8ItMixEDNegBf4VkYBGQenlDaSKX9Dv2xammUPwRK8822D83Ty5dAatS24l8KyRxDrT+cIZDRvXGuWTViIbmHdG76SNpwqHAkAaGcTBAlkFPlXOQO+imLw=",
          },
        ];
  
        await expect(zkm.connect(owner).regiserGroup(emptyH, kpPub, signatures)).to.be.revertedWith("h must not be empty");
      });

      it("Should fail when trying to register a group with an empty kpPub", async function () {
        const { zkm, owner } = await loadFixture(deployContract);  
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const emptyKpPub = "";
        const signatures = [
          {
            id: "500085520751",
            signature: "ITugvC40rtDRSlEJhy1XN8gfX/K1TMylzdO4CapA3EwJ+3+V4FS4DGbbel+eDldg7m2kZMmdaC92rJ5lhnzywSKUO5KYkSuv3EOuGv8MeTY7Y1xTAKPX4nlKaIjiFegBLKh1wys4MbaHx92awvi3nZYD+Z95Cc3yAA25P+gEC+g="
          },
          {
            id: "1634302581",
            signature: "HZZEK4e41bbmXjsX2DkIReXeP2cUEXejMARv9vqVjdYO6IjpYUfP1uwcvhgWy0xnYMAZckvP0y+cFwdP2urdvgCzR80a+tAjVHydrMB6xn5u3tasvXVc4UiOPqL7379xGZSjYKsf4nDd9apyq9gOjn6ECUrV2JqyD9ZuNYHPuxk=",
          },
          {
            id: "440056640873",
            signature: "Byp+fyCRyDLIUz+/wzePacemjB7gNhZasNqR5fksGsMUnHMWqa68w8ItMixEDNegBf4VkYBGQenlDaSKX9Dv2xammUPwRK8822D83Ty5dAatS24l8KyRxDrT+cIZDRvXGuWTViIbmHdG76SNpwqHAkAaGcTBAlkFPlXOQO+imLw=",
          },
        ];

        await expect(zkm.connect(owner).regiserGroup(h, emptyKpPub, signatures)).to.be.revertedWith("kpPub must not be empty");
      });
  
      it("Should fail when trying to register a group with empty signatures", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const emptySignatures = [];
        await expect(zkm.connect(owner).regiserGroup(h, kpPub, emptySignatures)).to.be.revertedWith("signatures must not be empty");
      });
  
      it("Should register multiple groups with valid data", async function () {
        const { zkm, owner } = await loadFixture(deployContract);
      
        const groupsData = [
          {
            h: "testH1",
            kpPub: "testKpPub1",
            signatures: [
              {
                id: "1",
                signature: "testSig"
              }
            ]
          },
          {
            h: "testH2",
            kpPub: "testKpPub2",
            signatures: [
              {
                id: "2",
                signature: "testSig2"
              },
              {
                id: "3",
                signature: "testSig3"
              }
            ]
          }
        ];
      
        for (let i = 0; i < groupsData.length; i++) {
          const { h, kpPub, signatures } = groupsData[i];
          await zkm.connect(owner).regiserGroup(h, kpPub, signatures);
          const group = await zkm.getGroup(i);
          expect(group.h).to.equal(h);
          expect(group.kpPub).to.equal(kpPub);
          expect(group.signatures.length).to.equal(signatures.length);
          for (let j = 0; j < signatures.length; j++) {
            expect(group.signatures[j].v).to
            expect(group.signatures[j].v).to.equal(signatures[j].v);
            expect(group.signatures[j].r).to.equal(signatures[j].r);
            expect(group.signatures[j].s).to.equal(signatures[j].s);
          }
        }
      });
    });

    describe("Mint", function () {
      it("Should mint proof", async function () {
        const { zkm, owner } = await loadFixture(deployContract);  
        const h = "IGBm3pCN+GdujqYteTWGAddoA2ok03QqELPGC4RsMlgtC4SMq+329hGZOODHKduGCsSpxL2G4hAsACLI9WJ0zhNf9r6WbuauLMEHZc+DbTpBHCHK2T4dbiujnrHVxTKML9ni9PJnTBanSQM2ggax+H1+8oM2qiVmU1AB0ufhbdE=";
        const kpPub = "GQv2/s3OU3Tiz+LQeBn5xbEnmvUObALQl1+D5PGN5hkTJFHSloQL8fMLLizCag7ZrbWj3fdgGdnTJ/6tWz0smw==";
        const signatures = [
          {
            id: "500085520751",
            signature: "ITugvC40rtDRSlEJhy1XN8gfX/K1TMylzdO4CapA3EwJ+3+V4FS4DGbbel+eDldg7m2kZMmdaC92rJ5lhnzywSKUO5KYkSuv3EOuGv8MeTY7Y1xTAKPX4nlKaIjiFegBLKh1wys4MbaHx92awvi3nZYD+Z95Cc3yAA25P+gEC+g="
          },
          {
            id: "1634302581",
            signature: "HZZEK4e41bbmXjsX2DkIReXeP2cUEXejMARv9vqVjdYO6IjpYUfP1uwcvhgWy0xnYMAZckvP0y+cFwdP2urdvgCzR80a+tAjVHydrMB6xn5u3tasvXVc4UiOPqL7379xGZSjYKsf4nDd9apyq9gOjn6ECUrV2JqyD9ZuNYHPuxk=",
          },
          {
            id: "440056640873",
            signature: "Byp+fyCRyDLIUz+/wzePacemjB7gNhZasNqR5fksGsMUnHMWqa68w8ItMixEDNegBf4VkYBGQenlDaSKX9Dv2xammUPwRK8822D83Ty5dAatS24l8KyRxDrT+cIZDRvXGuWTViIbmHdG76SNpwqHAkAaGcTBAlkFPlXOQO+imLw=",
          },
        ];
  
        await zkm.connect(owner).regiserGroup(h, kpPub, signatures);
      
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
