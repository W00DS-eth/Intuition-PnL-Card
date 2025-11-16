import { useState, useEffect } from 'react'
import { getUserPositions, formatPositionData } from '../api/intuition'

export default function PositionsTable({ address, onGenerateCard }) {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('pnl') // 'pnl', 'invested', 'currentValue', 'percentageChange', 'name'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15) // Show 15 positions per page
  const [showFilters, setShowFilters] = useState(false) // Filters collapsed by default
  
  // Filters
  const [filters, setFilters] = useState({
    name: '',
    investedMin: '',
    investedMax: '',
    currentValueMin: '',
    currentValueMax: '',
    pnlMin: '',
    pnlMax: '',
    percentMin: '',
    percentMax: '',
  })

  useEffect(() => {
    if (!address) {
      setPositions([])
      setCurrentPage(1)
      setFilters({
        name: '',
        investedMin: '',
        investedMax: '',
        currentValueMin: '',
        currentValueMax: '',
        pnlMin: '',
        pnlMax: '',
        percentMin: '',
        percentMax: '',
      })
      return
    }

    async function fetchPositions() {
      setLoading(true)
      setError(null)
      setCurrentPage(1) // Reset to first page
      
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

  // Apply filters
  const filteredPositions = positions.filter(pos => {
    // Name filter
    if (filters.name && !pos.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false
    }
    
    // Invested filters
    const invested = parseFloat(pos.invested)
    if (filters.investedMin && invested < parseFloat(filters.investedMin)) return false
    if (filters.investedMax && invested > parseFloat(filters.investedMax)) return false
    
    // Current Value filters
    const currentValue = parseFloat(pos.currentValue)
    if (filters.currentValueMin && currentValue < parseFloat(filters.currentValueMin)) return false
    if (filters.currentValueMax && currentValue > parseFloat(filters.currentValueMax)) return false
    
    // PnL filters
    if (filters.pnlMin && pos.rawPnl < parseFloat(filters.pnlMin)) return false
    if (filters.pnlMax && pos.rawPnl > parseFloat(filters.pnlMax)) return false
    
    // Percentage filters
    if (filters.percentMin && pos.rawPercentage < parseFloat(filters.percentMin)) return false
    if (filters.percentMax && pos.rawPercentage > parseFloat(filters.percentMax)) return false
    
    return true
  })

  const sortedPositions = [...filteredPositions].sort((a, b) => {
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
      case 'currentValue':
        aVal = parseFloat(a.currentValue)
        bVal = parseFloat(b.currentValue)
        break
      case 'percentageChange':
        aVal = a.rawPercentage
        bVal = b.rawPercentage
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

  // Calculate portfolio totals (use ALL positions, not paginated)
  const totals = sortedPositions.reduce((acc, pos) => {
    const invested = parseFloat(pos.invested)
    const currentValue = parseFloat(pos.currentValue)
    return {
      totalInvested: acc.totalInvested + invested,
      totalCurrentValue: acc.totalCurrentValue + currentValue,
    }
  }, { totalInvested: 0, totalCurrentValue: 0 })

  const totalPnl = totals.totalCurrentValue - totals.totalInvested
  const overallPercentage = totals.totalInvested > 0 
    ? ((totalPnl / totals.totalInvested) * 100) 
    : 0

  // Pagination
  const totalPages = Math.ceil(sortedPositions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPositions = sortedPositions.slice(startIndex, endIndex)

  return (
    <div className="positions-container">
      <div className="positions-header">
        <h2>Active Positions ({positions.length})</h2>
        <div className="header-actions">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-small btn-secondary filter-toggle"
          >
            🔍 {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <div className="address-display">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      {/* Portfolio Summary Stats */}
      <div className="portfolio-summary">
        <div className="summary-stat">
          <div className="stat-label">Total Invested</div>
          <div className="stat-value">{totals.totalInvested.toFixed(4)} $TRUST</div>
        </div>
        <div className="summary-stat">
          <div className="stat-label">Current Value</div>
          <div className="stat-value">{totals.totalCurrentValue.toFixed(4)} $TRUST</div>
        </div>
        <div className="summary-stat">
          <div className="stat-label">Total PnL</div>
          <div className={`stat-value ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(4)} $TRUST
          </div>
        </div>
        <div className="summary-stat">
          <div className="stat-label">Overall Change</div>
          <div className={`stat-value ${overallPercentage >= 0 ? 'positive' : 'negative'}`}>
            {overallPercentage >= 0 ? '+' : ''}{overallPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="portfolio-actions">
        <button 
          onClick={() => onGenerateCard({
            name: 'Portfolio Overview',
            invested: totals.totalInvested.toFixed(4),
            currentValue: totals.totalCurrentValue.toFixed(4),
            pnl: (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(4),
            percentageChange: (overallPercentage >= 0 ? '+' : '') + overallPercentage.toFixed(2) + '%',
            rawPnl: totalPnl,
            rawPercentage: overallPercentage,
          })}
          className="btn btn-primary btn-portfolio"
        >
          📊 Generate Portfolio Card
        </button>
      </div>

      {/* Filters - Collapsible */}
      {showFilters && (
        <div className="filters-container">
        <div className="filter-header">
          <h3>🔍 Filters</h3>
          <button 
            onClick={() => setFilters({
              name: '', investedMin: '', investedMax: '', 
              currentValueMin: '', currentValueMax: '',
              pnlMin: '', pnlMax: '', percentMin: '', percentMax: ''
            })}
            className="btn btn-small btn-secondary"
          >
            Clear All
          </button>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Position Name</label>
            <input
              type="text"
              placeholder="Search..."
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Invested (Min-Max)</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.investedMin}
                onChange={(e) => setFilters({...filters, investedMin: e.target.value})}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.investedMax}
                onChange={(e) => setFilters({...filters, investedMax: e.target.value})}
                className="filter-input-small"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Current Value (Min-Max)</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.currentValueMin}
                onChange={(e) => setFilters({...filters, currentValueMin: e.target.value})}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.currentValueMax}
                onChange={(e) => setFilters({...filters, currentValueMax: e.target.value})}
                className="filter-input-small"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>PnL (Min-Max)</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.pnlMin}
                onChange={(e) => setFilters({...filters, pnlMin: e.target.value})}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.pnlMax}
                onChange={(e) => setFilters({...filters, pnlMax: e.target.value})}
                className="filter-input-small"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>% Change (Min-Max)</label>
            <div className="filter-range">
              <input
                type="number"
                placeholder="Min %"
                value={filters.percentMin}
                onChange={(e) => setFilters({...filters, percentMin: e.target.value})}
                className="filter-input-small"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max %"
                value={filters.percentMax}
                onChange={(e) => setFilters({...filters, percentMax: e.target.value})}
                className="filter-input-small"
              />
            </div>
          </div>
        </div>
        
        <div className="filter-results">
          Showing {sortedPositions.length} of {positions.length} positions
        </div>
      </div>
      )}

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
              <th onClick={() => handleSort('currentValue')} className="sortable">
                Current Value<br/>
                <span className="token-label">($TRUST)</span>
                {sortBy === 'currentValue' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('pnl')} className="sortable">
                PnL<br/>
                <span className="token-label">($TRUST)</span>
                {sortBy === 'pnl' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('percentageChange')} className="sortable">
                % Change
                {sortBy === 'percentageChange' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedPositions.map((position) => (
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
        {paginatedPositions.map((position) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary pagination-btn"
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
            <span className="pagination-range">
              ({startIndex + 1}-{Math.min(endIndex, sortedPositions.length)} of {sortedPositions.length})
            </span>
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}