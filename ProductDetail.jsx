import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function ProductDetail({ addToCart,updateCartQuantity,isLoggedIn }) {
const { id } = useParams();
const [product,setProduct]=useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [quantity, setQuantity] = useState(1);
useEffect(()=>{
    if(!id) return;

    setLoading(true);
    setError('');
    axios.get(`http://localhost:8080/products/${id}`)
      .then(response => {setProduct(response.data);
      })
      .catch(error => {
        console.error(error);
        setError("");
      })
      .finally(() => setLoading(false));
    }, [id]);

 if (loading) return <p>読み込み中...</p>;
 if (error) return <p style={{ color: 'red' }}>{error}</p>;
 if (!product) return null;

 const handleAddToCart = () => {
    if (!isLoggedIn) {
      return;
    }
    addToCart(product.id, quantity);
  };

  return (
    <div>
        <h2>商品詳細</h2>
        <p>{product.id}</p>
        <p>{product.name}</p>
        <p>￥{product.price.toLocaleString()}</p>
        <p>カテゴリ: {product.categoryName || 'なし'}</p>

        <label>
        数量:
        <select
          value={quantity}
          onChange={e => setQuantity(Math.max(1,Number(e.target.value)))}
          style={{ marginLeft: '8px',
                   maxHeight: '120px',
                   overflowY: 'auto'
                  }}
          >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
      </select>
      </label>
      <div style={{ marginTop: '12px' }}>
        <button onClick={handleAddToCart}>
            カートに追加
            </button>
      </div>
    </div>
  )
}
