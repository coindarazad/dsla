import { AbiItem } from 'web3-utils/types';

export const SLOABI: AbiItem[] = [
  {
    inputs: [
      { internalType: 'uint256', name: '_value', type: 'uint256' },
      {
        internalType: 'enum SLORegistry.SLOType',
        name: '_sloType',
        type: 'uint8',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'sloType',
    outputs: [
      { internalType: 'enum SLORegistry.SLOType', name: '', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'value',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_value', type: 'uint256' }],
    name: 'isRespected',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDetails',
    outputs: [
      { internalType: 'uint256', name: '_value', type: 'uint256' },
      {
        internalType: 'enum SLORegistry.SLOType',
        name: '_sloType',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
