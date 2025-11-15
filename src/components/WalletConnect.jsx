import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'

export default function WalletConnect({ onAddressChange }) {
  const [searchAddress, setSearchAddress] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (searchAddress && searchAddress.startsWith('0x')) {
      onAddressChange(searchAddress)
    } else {
      alert('Please enter a valid Ethereum address (starts with 0x)')
    }
  }

  return (
    <div className="wallet-connect-bar">
      <div className="wallet-section">
        <ConnectButton />
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="address-search-form">
          <input
            type="text"
            placeholder="Or search by address (0x...)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="address-input"
          />
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </form>
      </div>
    </div>
  )
}
