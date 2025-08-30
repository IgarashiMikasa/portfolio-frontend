import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductList({products,updateCartQuantity,cart,loading,isLoggedIn}) {
  if (loading) return null;
  if(!products||products.length===0){
    return <p>商品がありません。</p>
  }

  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      return;
    }
    const currentQty = cart[productId] || 0;
    updateCartQuantity(productId, currentQty + 1);
  };



  return (
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
        margin: 0,
        listStyle: 'none',
        border: '2px solid #333',
        borderRadius: '8px',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {products.map(product=>(
          <li
            key={product.id}
            style={{ width: '33.33%',
                     boxSizing: 'border-box',
                     padding: '16px',
                     borderRight: '1px solid #ccc',
                     borderBottom: '1px solid #ccc' }}
            >
              <Link to={`/product/${product.id}`}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}

            >
              {product.name}
              </Link>
              <div>￥{product.price.toLocaleString()}</div>
            <button
              onClick={() => handleAddToCart(product.id)}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              カートに追加
            </button>
          </li>
        ))}
      </ol>

  );
}
