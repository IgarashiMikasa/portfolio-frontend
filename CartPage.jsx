import React from 'react';
import axios from 'axios';

export default function CartPage({ cart, products, addToCart, removeFromCart,clearCart,updateCartQuantity }) {
  const entries = Object.entries(cart);

  const productsMap = React.useMemo(() => {
    const map = new Map();
    products.forEach(p => map.set(p.id, p));
    return map;
  }, [products]);

  if (entries.length === 0) {
    return <p>カートは空です。</p>;
  }

  const { totalAmount, totalQuantity } = entries.reduce(
    (acc, [productId, qty]) => {
      const product = productsMap.get(Number(productId));
      if (product) {
        acc.totalAmount += product.price * qty;
        acc.totalQuantity += qty;
      }
      return acc;
    },
    { totalAmount: 0, totalQuantity: 0 }
  );

  const handlePurchase = async () => {
    const orderItems = entries.map(([productId, qty]) => ({
      productId: Number(productId),
      quantity: qty
    }));

    try {
      await axios.post('http://localhost:8080/api/orders',{ items: orderItems },{ withCredentials: true });
      alert('注文が完了しました！');
      clearCart(); // カートを空にする（親コンポーネントから渡す想定）
    } catch (error) {
      console.error('注文エラー:', error);
      alert('注文に失敗しました。');
    }
  };


  return (
    <div>
      <h1>カートの中身</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {entries.map(([productId, qty]) => {
          const product = productsMap.get(Number(productId));
          if (!product) return null;
          //基準を10で設定している
          const isManualInput = qty >= 10;

          return (
            <li key={productId} style={{ marginBottom: '12px' }}>
              <div>{product.name} - ￥{product.price.toLocaleString()}</div>
              <div>
                数量:{' '}
                {isManualInput ? (
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => updateCartQuantity(product.id, Math.max(1, Number(e.target.value)))}
                  style={{ width: '50px', marginLeft: '8px'}}
                />
                ):(
                  <>
                  {qty}
                <button
                onClick={() => addToCart(product.id)} style={{ marginLeft: '8px' }}
                >
                  ＋
                </button>
                <button onClick={() => removeFromCart(product.id)} style={{ marginLeft: '4px' }}
                >
                  ー
                </button>
                </>
                )}
                <button
                 onClick={() => updateCartQuantity(product.id, 0)}
                 style={{ marginLeft: '8px', color: 'red' }}
                 >
                  削除
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <hr />
      <div>
        <p><strong>合計個数:</strong> {totalQuantity} 点</p>
        <p><strong>合計金額:</strong> ￥{totalAmount.toLocaleString()}</p>
        <button onClick={handlePurchase}>購入する</button>
      </div>
    </div>
  );
}