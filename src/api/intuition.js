import { GraphQLClient } from 'graphql-request'

// Intuition GraphQL API endpoint (Mainnet)
export const INTUITION_API_URL = 'https://mainnet.intuition.sh/v1/graphql'

export const graphqlClient = new GraphQLClient(INTUITION_API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
})

// GraphQL Query using ACTUAL schema fields
export const GET_USER_POSITIONS = `
  query GetUserPositions($userAddress: String!) {
    positions(where: { account_id: { _eq: $userAddress } }) {
      id
      account {
        id
        label
      }
      shares
      total_deposit_assets_after_total_fees
      total_redeem_assets_for_receiver
      term {
        id
        atom {
          term_id
          label
          emoji
          image
        }
        triple {
          term_id
          subject {
            label
          }
          predicate {
            label
          }
          object {
            label
          }
        }
      }
    }
  }
`

export const GET_ATOMS = `
  query GetAtoms($limit: Int!) {
    atoms(limit: $limit, order_by: { created_at: desc }) {
      id
      label
      emoji
      image
      created_at
    }
  }
`

// Helper function to query user positions
export async function getUserPositions(userAddress) {
  try {
    console.log('Fetching positions for:', userAddress)
    const data = await graphqlClient.request(GET_USER_POSITIONS, {
      userAddress: userAddress,
    })
    console.log('API Response:', data)
    return data.positions || []
  } catch (error) {
    console.error('Error fetching user positions:', error)
    console.error('Error details:', error.response?.errors || error.message)
    throw error
  }
}

// Helper to format position data for display
export function formatPositionData(position) {
  // Extract the name from term.atom or term.triple
  const getName = () => {
    if (position.term?.atom) {
      return position.term.atom.label || position.term.atom.term_id
    }
    if (position.term?.triple) {
      const subject = position.term.triple.subject?.label || 'Unknown'
      const predicate = position.term.triple.predicate?.label || 'Unknown'
      const object = position.term.triple.object?.label || 'Unknown'
      return `${subject} ${predicate} ${object}`
    }
    return position.term?.id || 'Unknown Position'
  }

  // Calculate values (convert from wei to TRUST by dividing by 10^18)
  // Note: Intuition uses TRUST token, which has 18 decimals like ETH
  const invested = parseFloat(position.shares || 0) / 1e18
  const currentValue = parseFloat(position.total_deposit_assets_after_total_fees || 0) / 1e18
  const pnl = currentValue - invested
  const percentageChange = invested > 0 ? ((pnl / invested) * 100) : 0

  return {
    id: position.id,
    name: getName(),
    invested: invested.toFixed(4),
    currentValue: currentValue.toFixed(4),
    pnl: pnl >= 0 ? `+${pnl.toFixed(4)}` : pnl.toFixed(4),
    percentageChange: percentageChange >= 0 
      ? `+${percentageChange.toFixed(2)}%` 
      : `${percentageChange.toFixed(2)}%`,
    rawPnl: pnl,
    rawPercentage: percentageChange,
    term: position.term,
    vault: position.vault,
  }
}
