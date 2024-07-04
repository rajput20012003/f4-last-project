import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');

  // Fetch data using .then
  const fetchDataThen = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  // Fetch data using async/await
  const fetchDataAsync = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // You can choose which method to use for fetching data
    fetchDataThen();
    // fetchDataAsync();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSort = (key) => {
    setSortKey(key);
    const sortedData = [...data].sort((a, b) => {
      if (key === 'market_cap') {
        return b.market_cap - a.market_cap;
      } else if (key === 'percentage_change') {
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      }
      return 0;
    });
    setData(sortedData);
  };

  const filteredData = data.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Crypto Market</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      <button onClick={() => handleSort('market_cap')}>Sort by Market Cap</button>
      <button onClick={() => handleSort('percentage_change')}>Sort by Percentage Change</button>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Total Volume</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((coin) => (
            <tr key={coin.id}>
              <td><img src={coin.image} alt={coin.name} width="30" /></td>
              <td>{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>{coin.total_volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
