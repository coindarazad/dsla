import { AbiItem } from 'web3-utils/types';

export const SLORegistryABI: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract SLO',
        name: 'slo',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'enum SLORegistry.SLOType',
        name: 'sloType',
        type: 'uint8',
      },
    ],
    name: 'SLOCreated',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'registeredSLOs',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'enum SLORegistry.SLOType', name: '', type: 'uint8' },
    ],
    name: 'sloAddresses',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_value', type: 'uint256' },
      {
        internalType: 'enum SLORegistry.SLOType',
        name: '_sloType',
        type: 'uint8',
      },
    ],
    name: 'createSLO',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_sloAddress', type: 'address' }],
    name: 'isRegisteredSLO',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'getAllSLOs',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
];
