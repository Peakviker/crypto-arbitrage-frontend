import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import 'antd/dist/reset.css';

const API_URL = 'https://crypto-arbitrage-backend.up.railway.app/futures-vs-spot';

const columns = [
  {
    title: 'Криптовалюта',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Binance Futures',
    dataIndex: 'futures_price',
    key: 'futures_price',
    render: (value) => `$${value.toFixed(2)}`
  },
  {
    title: 'KuCoin Spot',
    dataIndex: 'spot_price',
    key: 'spot_price',
    render: (value) => `$${value.toFixed(2)}`
  },
  {
    title: 'Разница ($)',
    dataIndex: 'diff',
    key: 'diff',
    render: (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`
  },
  {
    title: 'Разница (%)',
    dataIndex: 'percent',
    key: 'percent',
    render: (value) => {
      const style = {
        backgroundColor:
          Math.abs(value) > 2
            ? '#00cc44'
            : Math.abs(value) > 1.5
            ? '#33cc66'
            : Math.abs(value) > 1
            ? '#99cc66'
            : '#f6fff6',
        padding: '5px',
      };
      return <div style={style}>{value > 0 ? '+' : ''}{value.toFixed(2)}%</div>;
    },
  },
];

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);

    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Неебический арбитран: Binance Futures vs KuCoin Spot</h2>
      <Table columns={columns} dataSource={data} rowKey="symbol" pagination={false} />
    </div>
  );
}

export default App;
