import { ApiPromise, WsProvider } from "@polkadot/api";
import BN from "bn.js";
import { u8aConcat, u8aToHex, hexToBn } from "@polkadot/util";
import { blake2AsU8a } from "@polkadot/util-crypto";
import { API } from "../config.json";
import Model from "./models/table";
import ModelContributes from "./models/contributes";
import config from "./consts";

let api;
export async function initApi() {
  const provider = new WsProvider(API.endpoint);
  api = await ApiPromise.create({
    provider,
    types: API.types,
  });
  return api;
}

export function getApi() {
  return api;
}

function createChildKey(trieIndex) {
  return u8aToHex(
    u8aConcat(
      ":child_storage:default:",
      blake2AsU8a(u8aConcat("crowdloan", trieIndex.toU8a()))
    )
  );
}

function toUnit(balance, decimals) {
  const base = new BN(10).pow(new BN(decimals));
  const dm = new BN(balance).divmod(base);
  return parseFloat(dm.div.toString() + "." + dm.mod.toString());
}

export default async function main() {
  const api = await initApi();

  async function parseBlock(number = null) {
    const paraId = config.paraId;
    const block = number;
    let timestamp;
    let fund;
    let keys;
    const contributes = [];
    if (block) {
      const blockHash = await api.rpc.chain.getBlockHash(block);
      const blockInfo = await api.rpc.chain.getBlock(blockHash);
      blockInfo.block.extrinsics.forEach((extrinsic) => {
        if (extrinsic.method.section === "timestamp") {
          timestamp = extrinsic.method.args[0].toNumber();
        }
        if (
          extrinsic.method.section === "crowdloan" &&
          extrinsic.method.method === "contribute"
        ) {
          const data = extrinsic.method.toJSON().args;
          if (data.index === paraId) {
            contributes.push({
              block,
              signer: extrinsic.signer.toHuman().Id,
              amount: data.value,
              amountUnit: toUnit(data.value, api.registry.chainDecimals[0]),
            });
          }
        }
      });
      fund = (await api.query.crowdloan.funds.at(blockHash, paraId)).toJSON();
      const index = api.createType("u32", fund.trieIndex);
      const childKey = createChildKey(index);
      keys = await api.rpc.childstate.getKeys(childKey, "0x", blockHash);
    } else {
      fund = (await api.query.crowdloan.funds(paraId)).toJSON();
      const index = api.createType("u32", fund.trieIndex);
      const childKey = createChildKey(index);
      keys = await api.rpc.childstate.getKeys(childKey, "0x");
    }
    const contributors = keys.toArray();
    return [
      {
        block,
        timestamp,
        amount: hexToBn(fund.raised).toString(),
        amountUnit: toUnit(
          hexToBn(fund.raised).toString(),
          api.registry.chainDecimals[0]
        ),
        count: contributors.length,
      },
      contributes,
    ];
  }

  async function getCurrentBlock() {
    return Number((await api.rpc.chain.getBlock()).block.header.number);
  }

  function getStartBlock() {
    return Model.findOne({
      attributes: ["block"],
      // where: { release: config.currentRelease },
      order: [["block", "DESC"]],
      raw: true,
    }).then((row) => {
      return row ? row.block + 1 : config.startBlockParse;
    });
  }

  let run = false;
  async function start() {
    if (!run) {
      run = true;
      const currentBlock = await getCurrentBlock();
      const startBlock = await getStartBlock();
      console.log(startBlock, currentBlock);
      for (let block = startBlock; block <= currentBlock; block++) {
        try {
          const result = await parseBlock(block);
          Model.create(result[0]);
          ModelContributes.bulkCreate(result[1]);
        } catch (_) {
          console.log("err", block);
          setTimeout(() => {
            start();
          }, config.timeout);
          return;
        }
      }
      run = false;
    }
    setTimeout(() => {
      start();
    }, config.timeout);
  }
  start();
}
// main();
