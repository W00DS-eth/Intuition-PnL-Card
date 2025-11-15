import { useState, useEffect } from 'react'
import { getUserPositions, formatPositionData } from '../api/intuition'

export default function PositionsTable({ address, onGenerateCard }) {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('pnl') // 'pnl', 'invested', 'name'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'

  useEffect(() => {
    if (!address) {
      setPositions([])
      return
    }

    async function fetchPositions() {
      setLoading(true)
      setError(null)
      
      try {
        const rawPositions = await getUserPositions(address)
        const formatted = rawPositions.map(formatPositionData)
        setPositions(formatted)
      } catch (err) {
        console.error('Error loading positions:', err)
        setError('Failed to load positions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [address])

  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const sortedPositions = [...positions].sort((a, b) => {
    let aVal, bVal

    switch (sortBy) {
      case 'pnl':
        aVal = a.rawPnl
        bVal = b.rawPnl
        break
      case 'invested':
        aVal = parseFloat(a.invested)
        bVal = parseFloat(b.invested)
        break
      case 'name':
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      default:
        return 0
    }

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })

  if (!address) {
    return (
      <div className="positions-empty">
        <p>Connect your wallet or search an address to view positions</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="positions-loading">
        <div className="spinner"></div>
        <p>Loading positions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="positions-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Retry
        </button>
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="positions-empty">
        <p>No positions found for this address</p>
      </div>
    )
  }

  return (
    <div className="positions-container">
      <div className="positions-header">
        <h2>Active Positions ({positions.length})</h2>
        <div className="address-display">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>

      <div className="positions-table-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Position {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('invested')} className="sortable">
                Invested {sortBy === 'invested' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Current Value</th>
              <th onClick={() => handleSort('pnl')} className="sortable">
                PnL {sortBy === 'pnl' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>% Change</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position) => (
              <tr key={position.id}>
                <td className="position-name">{position.name}</td>
                <td>${position.invested}</td>
                <td>${position.currentValue}</td>
                <td className={position.rawPnl >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                  {position.pnl}
                </td>
                <td className={position.rawPercentage >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                  {position.percentageChange}
                </td>
                <td>
                  <button 
                    onClick={() => onGenerateCard(position)}
                    className="btn btn-small btn-primary"
                  >
                    Generate Card
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
