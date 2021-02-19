import { AbiItem } from 'web3-utils/types';

export const StakeRegistryABI: AbiItem[] = [
  {
    inputs: [
      { internalType: 'address', name: '_dslaTokenAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'DSLAburnRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier1',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier2',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier3',
        type: 'uint256',
      },
    ],
    name: 'StakingParametersModified',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DSLATokenAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allowedTokens',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_tokenAddress', type: 'address' },
    ],
    name: 'addAllowedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_tokenAddress', type: 'address' },
    ],
    name: 'isAllowedToken',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getStakingParameters',
    outputs: [
      { internalType: 'uint256', name: 'DSLAburnRate', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier2',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier3',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'DSLAburnRate', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier2',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minimumDSLAStakedTier3',
        type: 'uint256',
      },
    ],
    name: 'setStakingParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
