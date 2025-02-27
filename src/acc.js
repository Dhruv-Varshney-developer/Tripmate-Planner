/**
 * Calculate this value by running the script: 'pnpm run ipfsCID'.
 */
export const ipfsHash = 'QmNzx2cs3UQpXKwJxQPhCAFy8LVHaArBikfNbdfFXpyvUi'

/**
 *
 * @typedef {`did:key:${string}`} DID
 * @type DID
 */
export const spaceDID = 'did:key:z6Mkk89bC3JrVqKie71YEcc5M1SMVxuCgNx6zLZ8SYJsxALi'

/** @type import('@lit-protocol/types').AccessControlConditions */
export const accessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain: 'ethereum',
    method: '',
    parameters: [':currentActionIpfsId', spaceDID],
    returnValueTest: {
      comparator: '=',
      value: ipfsHash
    }
  }
]
