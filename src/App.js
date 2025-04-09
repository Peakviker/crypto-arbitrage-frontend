import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Table } from 'antd';
import 'antd/dist/reset.css';

import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'https://crypto-arbitrage-backend-production.up.railway.app/futures-vs-spot';


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
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    title: 'KuCoin Spot',
    dataIndex: 'spot_price',
    key: 'spot_price',
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    title: 'Разница ($)',
    dataIndex: 'diff',
    key: 'diff',
    render: (value) => `+${value.toFixed(2)}`,
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
        {value > 0 ? '+' : ''}
        {value.toFixed(2)}%
      </div>
    ),
  },
];

function App() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("Ответ от API:", res.data); // 👈 добавили сюда
      setData(res.data);
      setHistory((prev) => [...prev.slice(-20), res.data]);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    }
  };
  
// добавили лог для отладки ответа API

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter((item) => Math.abs(item.percent) > 1);

  const chartData = {
    labels: data.map((d) => d.symbol),
    datasets: [
      {
        label: 'Разница (%)',
        data: data.map((d) => d.percent),
        fill: false,
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Неебический арбитраж: Binance Futures vs KuCoin Spot</h2>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Все" key="1">
          <Table columns={columns} dataSource={data} rowKey="symbol" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab=">1%" key="2">
          <Table columns={columns} dataSource={filteredData} rowKey="symbol" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="График" key="3">
          <Line data={chartData} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default App;
