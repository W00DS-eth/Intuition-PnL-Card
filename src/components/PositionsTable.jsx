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

      {/* Desktop Table View */}
      <div className="positions-table-wrapper desktop-only">
        <table className="positions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Position {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('invested')} className="sortable">
                Invested<br/>
                <span className="token-label">($TRUST)</span>
                {sortBy === 'invested' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th>
                Current Value<br/>
                <span className="token-label">($TRUST)</span>
              </th>
              <th onClick={() => handleSort('pnl')} className="sortable">
                PnL<br/>
                <span className="token-label">($TRUST)</span>
                {sortBy === 'pnl' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th>% Change</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position) => (
              <tr key={position.id}>
                <td className="position-name">
                  {position.portalUrl ? (
                    <a 
                      href={position.portalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="position-link"
                    >
                      {position.name}
                    </a>
                  ) : (
                    position.name
                  )}
                </td>
                <td>{position.invested}</td>
                <td>{position.currentValue}</td>
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

      {/* Mobile Card View */}
      <div className="positions-cards mobile-only">
        {sortedPositions.map((position) => (
          <div key={position.id} className="position-card">
            <div className="position-card-header">
              <h3 className="position-card-name">
                {position.portalUrl ? (
                  <a 
                    href={position.portalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="position-link"
                  >
                    {position.name}
                  </a>
                ) : (
                  position.name
                )}
              </h3>
              <div className={`position-card-change ${position.rawPercentage >= 0 ? 'positive' : 'negative'}`}>
                {position.percentageChange}
              </div>
            </div>
            
            <div className="position-card-stats">
              <div className="stat">
                <span className="stat-label">Invested ($TRUST)</span>
                <span className="stat-value">{position.invested}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Current Value ($TRUST)</span>
                <span className="stat-value">{position.currentValue}</span>
              </div>
              <div className="stat">
                <span className="stat-label">PnL ($TRUST)</span>
                <span className={`stat-value ${position.rawPnl >= 0 ? 'positive' : 'negative'}`}>
                  {position.pnl}
                </span>
              </div>
            </div>

            <button 
              onClick={() => onGenerateCard(position)}
              className="btn btn-primary btn-full-width"
            >
              Generate Card
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}