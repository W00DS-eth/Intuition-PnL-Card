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
  query GetUserPositions($userAddress: String!, $limit: Int!, $offset: Int!) {
    positions(
      where: { account_id: { _eq: $userAddress } }
      limit: $limit
      offset: $offset
    ) {
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
      vault {
        current_share_price
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

// Helper function to query user positions (fetches ALL positions)
export async function getUserPositions(userAddress) {
  try {
    console.log('Fetching positions for:', userAddress)
    
    let allPositions = []
    let offset = 0
    const limit = 100 // Fetch 100 at a time
    let hasMore = true
    
    // Keep fetching until we get all positions
    while (hasMore) {
      const data = await graphqlClient.request(GET_USER_POSITIONS, {
        userAddress: userAddress,
        limit: limit,
        offset: offset,
      })
      
      const positions = data.positions || []
      allPositions = allPositions.concat(positions)
      
      // If we got fewer than the limit, we've fetched everything
      if (positions.length < limit) {
        hasMore = false
      } else {
        offset += limit
      }
    }
    
    console.log(`Fetched ${allPositions.length} total positions`)
    return allPositions
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

  // Generate Intuition portal URL
  const getPortalUrl = () => {
    if (position.term?.atom?.term_id) {
      return `https://portal.intuition.systems/explore/atom/${position.term.atom.term_id}?tab=overview`
    }
    if (position.term?.triple?.term_id) {
      return `https://portal.intuition.systems/explore/triple/${position.term.triple.term_id}?tab=positions`
    }
    return null
  }

  // Calculate values (convert from wei to TRUST by dividing by 10^18)
  // Note: Intuition uses TRUST token, which has 18 decimals like ETH
  // 
  // CORRECT LOGIC:
  // - Invested (Total Bought) = total_deposit_assets_after_total_fees
  // - Current Value = shares × vault.current_share_price
  // - PnL = Current Value - Invested
  
  const invested = parseFloat(position.total_deposit_assets_after_total_fees || 0) / 1e18
  const shares = parseFloat(position.shares || 0) / 1e18
  const sharePrice = parseFloat(position.vault?.current_share_price || 0) / 1e18
  
  const currentValue = shares * sharePrice
  const pnl = currentValue - invested  
  const percentageChange = invested > 0 ? ((pnl / invested) * 100) : 0

  return {
    id: position.id,
    name: getName(),
    portalUrl: getPortalUrl(),
    invested: invested.toFixed(4),
    currentValue: currentValue.toFixed(4),
    pnl: pnl >= 0 ? `+${pnl.toFixed(4)}` : pnl.toFixed(4),
    percentageChange: percentageChange >= 0 
      ? `+${percentageChange.toFixed(2)}%` 
      : `${percentageChange.toFixed(2)}%`,
    rawPnl: pnl,
    rawPercentage: percentageChange,
    term: position.term,
  }
}