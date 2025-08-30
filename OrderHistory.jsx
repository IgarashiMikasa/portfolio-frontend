import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/orders/history', { withCredentials: true })  // セッションIDを送るならwithCredentialsを付ける
      .then(response => {
        console.log('orders response.data:', response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.response?.data || '注文履歴の取得に失敗しました');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div style={{color: 'red'}}>エラー: {error}</div>;

  return (
    <div>
    <h2>注文履歴</h2>
      {orders.length === 0 ? (
        <p>注文履歴はありません。</p>
      ) : (
        orders.map(order => {
            // 合計金額計算
          const totalPrice = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
           );

         return(
          <div key={order.orderId} style={{border: '1px solid #ccc', marginBottom: '1em', padding: '1em'}}>
            <div><strong>注文ID:</strong> {order.orderId}</div>
            <div><strong>注文日時:</strong> {new Date(order.orderDate).toLocaleString()}</div>
            <h4>注文商品</h4>
            <ul>
              {order.items.map(item => (
                <li key={item.productId}>
                  {item.productName} - 数量: {item.quantity} - 価格: ¥{item.price.toLocaleString()}
                </li>
              ))}
            </ul>
            <div><strong>合計金額:</strong> ¥{totalPrice.toLocaleString()}</div>
          </div>
            );
         })
      )}
    </div>
  );
}
