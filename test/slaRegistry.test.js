import { expect } from 'chai';
import { expectRevert } from '@openzeppelin/test-helpers';
import * as bs58 from 'bs58';
import axios from 'axios';
import { needsGetJobId } from '../environments';
import {
  getChainlinkJobId,
  waitBlockTimestamp,
  generatePeriods,
  eventListener,
  cleanSolidityString,
} from './helpers';
import { networkNamesBytes32, networkNames, networks } from '../constants';
import getIPFSHash from './helpers/getIPFSHash';
import { getSLI } from './helpers/getSLI';

const IERC20 = artifacts.require('IERC20');
const SLA = artifacts.require('SLA');
const SLARegistry = artifacts.require('SLARegistry');
const SLORegistry = artifacts.require('SLORegistry');
const Messenger = artifacts.require('Messenger');
const bDSLAToken = artifacts.require('bDSLAToken');
const DAI = artifacts.require('DAI');

const { envParameters } = require('../environments');

const { toWei, utf8ToHex } = web3.utils;

const initialTokenSupply = '100';
const stakeAmount1 = toWei(String(initialTokenSupply / 10));
const stakeAmount2 = toWei(String(initialTokenSupply / 5));
const periodId = 0;
const sloValue = 95000;
const sloType = 4;
const sloName = utf8ToHex('staking_efficiency');
const [periodStarts, periodEnds] = generatePeriods(10);
const slaNetwork = networkNames[0];
const slaNetworkBytes32 = networkNamesBytes32[0];

describe('SLARegistry', () => {
  let owner;
  let notOwner;
  let bDSLA;
  let newToken;
  let messenger;
  let slaRegistry;
  let chainlinkToken;
  let sloRegistry;
  let userSlos;
  let dai;
  let ipfsHash;
  const SLAs = [];

  before(async () => {
    const serviceMetadata = {
      serviceName: networks[slaNetwork].validators[0],
      serviceDescription: 'Official DSLA Beta Partner.',
      serviceImage: 'https://storage.googleapis.com/dsla-incentivized-beta/validators/chainode.svg',
      serviceURL: 'https://dsla.network',
      serviceAddress: 'one18hum2avunkz3u448lftwmk7wr88qswdlfvvrdm',
      serviceTicker: slaNetwork,
    };

    ipfsHash = await getIPFSHash(serviceMetadata);
    [owner, notOwner] = await web3.eth.getAccounts();

    sloRegistry = await SLORegistry.new();
    // 4 is "GreatherThan"
    await sloRegistry.createSLO(sloValue, sloType, sloName);
    userSlos = await sloRegistry.userSLOs.call(owner);
  });

  beforeEach(async () => {
    SLAs.length = 0;

    // deploy tokens
    bDSLA = await bDSLAToken.new();
    dai = await DAI.new();
    newToken = await bDSLAToken.new(); // to simulate a new token

    // mint to owner
    await bDSLA.mint(owner, toWei(initialTokenSupply));
    await dai.mint(owner, toWei(initialTokenSupply));
    await newToken.mint(owner, toWei(initialTokenSupply));

    // mint to notOwner
    await bDSLA.mint(notOwner, toWei(initialTokenSupply), { from: notOwner });
    await dai.mint(notOwner, toWei(initialTokenSupply), { from: notOwner });
    await newToken.mint(notOwner, toWei(initialTokenSupply), {
      from: notOwner,
    });

    messenger = await Messenger.new(
      envParameters.chainlinkOracleAddress,
      envParameters.chainlinkTokenAddress,
      !needsGetJobId ? envParameters.chainlinkJobId : await getChainlinkJobId(),
    );

    chainlinkToken = await IERC20.at(envParameters.chainlinkTokenAddress);

    slaRegistry = await SLARegistry.new(
      messenger.address,
      periodStarts,
      periodEnds,
      networkNamesBytes32,
    );

    await slaRegistry.createSLA(
      owner,
      [sloName],
      userSlos,
      0,
      ipfsHash,
      bDSLA.address,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      { from: owner },
    );

    const slaAddresses = await slaRegistry.userSLAs(owner);
    const sla = await SLA.at(slaAddresses[0]);
    SLAs.push(sla);
  });

  it('should ask for active pool correctly', async () => {
    const [sla] = SLAs;
    await sla.addAllowedTokens(dai.address);

    // with owner
    await bDSLA.approve(sla.address, stakeAmount1);
    await dai.approve(sla.address, stakeAmount2);
    await sla.stakeTokens(stakeAmount1, bDSLA.address, periodId);
    await sla.stakeTokens(stakeAmount2, dai.address, periodId);

    const slaStakedByOwner = await slaRegistry.slaWasStakedByUser(
      owner,
      sla.address,
    );
    // eslint-disable-next-line no-unused-expressions
    expect(slaStakedByOwner).to.be.true;

    let activePools = await slaRegistry.getActivePool.call(owner);
    assert.equal(
      activePools.length,
      2,
      'active pools should only be equal to SLAs length',
    );

    let [pool1, pool2] = activePools;
    let bDSLAName = await bDSLA.name.call();
    let daiName = await dai.name.call();

    assert.equal(pool1.stake, stakeAmount1, 'stakes for SLA 1 does not match');
    assert.equal(pool2.stake, stakeAmount2, 'stakes for SLA 2 does not match');
    assert.equal(
      cleanSolidityString(pool1.assetName),
      bDSLAName,
      'names for SLA 1 does not match',
    );
    assert.equal(
      cleanSolidityString(pool2.assetName),
      daiName,
      'names for SLA 2 does not match',
    );
    assert.equal(
      pool1.SLAaddress,
      sla.address,
      'addresses for pool 1 does not match',
    );
    assert.equal(
      pool2.SLAaddress,
      sla.address,
      'addresses for pool 2 does not match',
    );

    // with notOwner
    await bDSLA.approve(sla.address, stakeAmount1, { from: notOwner });
    await dai.approve(sla.address, stakeAmount2, { from: notOwner });
    await sla.stakeTokens(stakeAmount1, bDSLA.address, periodId, {
      from: notOwner,
    });
    await sla.stakeTokens(stakeAmount2, dai.address, periodId, {
      from: notOwner,
    });

    // for notOwner
    activePools = await slaRegistry.getActivePool.call(notOwner);
    assert.equal(
      activePools.length,
      2,
      'active pools should only be equal to SLAs length',
    );
    [pool1, pool2] = activePools;
    bDSLAName = await bDSLA.name.call({ from: notOwner });
    daiName = await dai.name.call({ from: notOwner });

    assert.equal(pool1.stake, stakeAmount1, 'stakes for SLA 1 does not match');
    assert.equal(pool2.stake, stakeAmount2, 'stakes for SLA 2 does not match');
    assert.equal(
      cleanSolidityString(pool1.assetName),
      bDSLAName,
      'names for SLA 1 does not match',
    );
    assert.equal(
      cleanSolidityString(pool2.assetName),
      daiName,
      'names for SLA 2 does not match',
    );
    assert.equal(
      pool1.SLAaddress,
      sla.address,
      'addresses for pool 1 does not match',
    );
    assert.equal(
      pool2.SLAaddress,
      sla.address,
      'addresses for pool 2 does not match',
    );
  });

  it('should ask for a SLI and check the SLO status properly', async () => {
    const SLICreatedEvent = 'SLICreated';
    const AnalyticsReceivedEvent = 'AnalyticsReceived';
    const [sla] = SLAs;

    // Fund the messenger contract with LINK
    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));
    await slaRegistry.requestAnalytics(periodId, slaNetworkBytes32);
    await eventListener(slaRegistry, AnalyticsReceivedEvent);

    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));
    await slaRegistry.requestSLI(periodId, sla.address, sloName);
    const { name, values } = await eventListener(sla, SLICreatedEvent);
    const expectedSLI1 = await getSLI(sla.address, periodId, slaRegistry.address);
    const expectedResponse = {
      name: SLICreatedEvent,
      values: {
        _value: String(expectedSLI1),
        _periodId: String(periodId),
      },
    };
    expect(name).to.equal(expectedResponse.name);
    expect(values).to.include(expectedResponse.values);
    const { status } = await sla.periods.call(periodId);
    // 1 is Respected, 2 NotRespected
    // eslint-disable-next-line no-underscore-dangle
    const sloRespected = sloValue < values._value;
    expect(status.toString()).to.equal(sloRespected ? '1' : '2');
  });

  it('requestSLI can be called only once', async () => {
    const SLICreatedEvent = 'SLICreated';
    const [sla] = SLAs;

    // Fund the messenger contract with LINK
    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));
    await slaRegistry.requestSLI(periodId, sla.address, sloName);
    await eventListener(sla, SLICreatedEvent);

    // call for second time
    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));
    await expectRevert(
      slaRegistry.requestSLI.call(periodId, sla.address, sloName),
      'SLA contract was already verified for the period',
    );
    // await slaRegistry.requestSLI(periodId, sla.address, sloName);
  });

  it('requestSLI can only be called if the period is finished', async () => {
    const SLICreatedEvent = 'SLICreated';

    // Fund the messenger contract with LINK
    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));

    const { timestamp: currentBlockTimestamp } = await web3.eth.getBlock(
      'latest',
    );
    // add 15 seconds to fail first transaction
    const slaPeriodEnd = currentBlockTimestamp + 15;
    slaRegistry.createSLA(
      owner,
      [sloName],
      userSlos,
      0,
      ipfsHash,
      bDSLA.address,
      [currentBlockTimestamp],
      [slaPeriodEnd],
      { from: owner },
    );
    const {
      values: { sla: slaAddress },
    } = await eventListener(slaRegistry, 'SLACreated');

    await expectRevert(
      slaRegistry.requestSLI.call(periodId, slaAddress, sloName),
      'SLA contract period has not finished yet',
    );

    // Wait for the correct block timestamp to execute the requestSLI function
    await waitBlockTimestamp(slaPeriodEnd);
    await slaRegistry.requestSLI(periodId, slaAddress, sloName);
    await eventListener(await SLA.at(slaAddress), SLICreatedEvent);
  });

  it('should ask for analytics to Chainlink correctly', async () => {
    const networkNameBytes32 = networkNamesBytes32[0];
    const week_id = 0;

    // Fund the messenger contract with LINK
    await chainlinkToken.transfer(messenger.address, web3.utils.toWei('0.1'));

    // Canonical period 0 is the past week, so is possible to be called
    slaRegistry.requestAnalytics(week_id, networkNameBytes32);
    const {
      values: { _ipfsHash },
    } = await eventListener(slaRegistry, 'AnalyticsReceived');
    const ipfsCID = bs58.encode(
      Buffer.from(`1220${_ipfsHash.replace('0x', '')}`, 'hex'),
    );
    const { data: weekAnalytics } = await axios.get(`https://ipfs.dsla.network/ipfs/${ipfsCID}`);
    expect(weekAnalytics.week_id).to.equal('0');

    const periodAnlyticsIPFSCID = await slaRegistry.canonicalPeriodsAnalytics.call(
      networkNameBytes32,
      week_id,
    );
    expect(periodAnlyticsIPFSCID).to.equal(_ipfsHash);
  });
});
