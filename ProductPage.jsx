import React, { useState,useEffect,useCallback } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import debounce from 'lodash/debounce';

export default function ProductPage({ updateCartQuantity, cart,isLoggedIn}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 検索キーワードとカテゴリID
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // 商品取得
  const fetchProducts=() => {
    setLoading(true);
    // クエリパラメータを付けてAPI呼び出し
    axios.get('http://localhost:8080/products', {
      params: {
        keyword: keyword || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };
  // カテゴリ初期取得
  useEffect(() => {
  axios.get('http://localhost:8080/categories')
    .then(res => setCategories(res.data))
    .catch(err => console.error(err));
}, []);

  // カテゴリ変更時に商品再取得
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  //サジェスト取得
const fetchSuggestions = (kw) => {
    if (kw.trim() === '') {
      setSuggestions([]);
      return;
    }
    axios.get('http://localhost:8080/products/suggestions', {
      params: { keyword:kw },
    })
    .then(res => setSuggestions(res.data))
    .catch(err => {
      console.error('サジェスト取得エラー:', err);
      setSuggestions([]);
    });
  };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

    useEffect(() => {
    debouncedFetchSuggestions(keyword);
    return () => debouncedFetchSuggestions.cancel();
  }, [keyword, debouncedFetchSuggestions]);

  // サジェストクリック時
  const handleSuggestionClick = (name) => {
    setKeyword(name);
    setSuggestions([]); // 候補消す
    fetchProducts();
  };
  return (
    <div style={{ padding: '20px' }}>
      <h1>商品一覧</h1>

      {/* 検索フォーム */}
      <div style={{ position: 'relative',marginBottom: '16px'  }}>
      <input
        type="text"
        placeholder="商品名で検索"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyDown={(e) => {
    if (e.key === 'Enter') {
             fetchProducts();
             setSuggestions([]);
          }
        }}
        style={{ flex: 1, padding: '8px' }}
      />
      <button onClick={() => { fetchProducts(); setSuggestions([]); }}>
          検索
        </button>
      {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            zIndex: 10
          }}>
            {suggestions.map(s => (
              <li
                key={s.id}
                onClick={() => handleSuggestionClick(s.name)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* カテゴリ選択 */}
      <select value={categoryId}
      onChange={e => setCategoryId(e.target.value)}
      style={{ marginBottom: '16px', padding: '8px' }}
      >
        <option value="">すべてのカテゴリ</option>
        {categories.map(cat => (
      <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
       ))}
      </select>

      {/* 商品リスト */}
      <ProductList
      products={products}
      updateCartQuantity={updateCartQuantity}
      cart={cart}
      loading={loading}
      isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
