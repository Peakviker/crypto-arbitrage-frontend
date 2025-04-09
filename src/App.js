// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Table, Select, Spin } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const { Option } = Select;

const API_URL = 'https://crypto-arbitrage-backend-production.up.railway.app/compare';

const columns = [
  {
    title: 'Криптовалюта',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Futures (Base)',
    dataIndex: 'base_price',
    key: 'base_price',
    render: (value) => `$${value.toFixed(4)}`,
  },
  {
    title: 'Spot (Compare)',
    dataIndex: 'compare_price',
    key: 'compare_price',
    render: (value) => `$${value.toFixed(4)}`,
  },
  {
    title: 'Разница ($)',
    dataIndex: 'diff',
    key: 'diff',
    render: (value) => `${value > 0 ? '+' : ''}${value.toFixed(4)}`,
  },
  {
    title: 'Разница (%)',
    dataIndex: 'percent',
    key: 'percent',
    render: (value) => (
      <div
        style={{
          backgroundColor:
            Math.abs(value) > 2
              ? '#00cc44'
              : Math.abs(value) > 1.5
              ? '#33cc66'
              : Math.abs(value) > 1
              ? '#99cc66'
              : '#f6fff6',
          padding: '0 4px',
        }}
      >
        {value > 0 ? '+' : ''}{value.toFixed(2)}%
      </div>
    ),
  },
];

const exchanges = [
  'binance_futures',
  'kucoin',
  'okx',
  'bybit',
  'bitget',
];

function App() {
  const [data, setData] = useState([]);
  const [baseExchange, setBaseExchange] = useState('binance_futures');
  const [compareExchange, setCompareExchange] = useState('kucoin');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?base_exchange=${baseExchange}&compare_exchange=${compareExchange}`);
      setData(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [baseExchange, compareExchange]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Арбитраж между биржами</h2>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '1rem' }}>
        <div>
          <span>Base:</span>
          <Select value={baseExchange} onChange={setBaseExchange} style={{ width: 180, marginLeft: 8 }}>
            {exchanges.map((ex) => (
              <Option key={ex} value={ex}>{ex}</Option>
            ))}
          </Select>
        </div>

        <div>
          <span>Compare:</span>
          <Select value={compareExchange} onChange={setCompareExchange} style={{ width: 180, marginLeft: 8 }}>
            {exchanges.map((ex) => (
              <Option key={ex} value={ex}>{ex}</Option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? <Spin /> : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(row) => `${row.symbol}-${row.base_exchange}-${row.compare_exchange}`}
          pagination={false}
        />
      )}
    </div>
  );
}

export default App;
