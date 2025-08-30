import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import ProductPage from './components/ProductPage';
import HomePage from './components/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import OrderHistory from './components/OrderHistory';

export default function App() {
  const navigate = useNavigate();
// --- State ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);


  // --- 認証情報確認 ---

    const fetchUserInfo = () => {
    axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(true);
        setUserName(res.data.name);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserName('');
      })
      .finally(() => setCheckingAuth(false));
      };

    // --- 初回レンダリング時に商品データ取得 ---
  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // --- 認証情報確認(初回) ---
    useEffect(() => {
     const timer=setTimeout(()=>{
       fetchUserInfo();
       }, 500);
       return ()=> clearTimeout(timer);
    },[]);

    //--- ログイン成功時に呼ぶ関数 ---
   const handleLoginSuccess = () => {
    fetchUserInfo();
  };

// --- カート操作関数 ---
  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };
  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (!newCart[productId]) return newCart;
      if (newCart[productId] === 1) {
        delete newCart[productId];
      } else {
        newCart[productId] -= 1;
      }
      return newCart;
    });
  };
  const clearCart = () => {
    setCart({}); // カートを空にする
  };
  const updateCartQuantity = (productId, newQty) => {
   setCart(prevCart => {
    const currentQty = prevCart[productId] || 0;
    if (newQty <= 0) {
      // 数量0以下なら商品削除
      const { [productId]: _, ...rest } = prevCart;
      return rest;
    }
    if (newQty === currentQty) {
      return prevCart; // 変化なし
    }
    return {
      ...prevCart,
      [productId]: newQty,
    };
  });
};
const addToCartMultiple = (productId, qty) => {
  setCart(prev => ({
    ...prev,
    [productId]: (prev[productId] || 0) + qty,
  }));
};

// --- 合計数量算出 ---
const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);


  // --- 認証情報確認中はローディング表示 ---
  if (checkingAuth) {
    return <p>認証情報を確認しています...</p>;
  }

return (
 <div>
 <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
        <div className="container-fluid">
          <Link className="custom-hover me-3" to="/">トップ</Link>
          <Link className="custom-hover me-3" to="/products">商品一覧</Link>
          <Link className="custom-hover me-3" to="/register">ユーザー登録</Link> {/* 追加 */}
          <Link className="custom-hover me-3" to="/orders/history">注文履歴</Link>
          <div className="d-flex">
            {isLoggedIn ? (
              <>
                <Link to="/logout" className="btn btn-outline-danger me-3">
                  ログアウト
                </Link>
                <Link to="/cart" className="btn btn-outline-primary position-relative">
                  カート
                  {totalCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
              <Link className="custom-hover me-3" to="/login">ログイン</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage userName={userName} />} />
        <Route
          path="/products"
          element={
            <ProductPage
              products={products}
              updateCartQuantity={updateCartQuantity}
              cart={cart}
              loading={loading}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              products={products}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              updateCartQuantity={updateCartQuantity}
            />
          }
        />
        <Route
         path="/product/:id"
         element={
          <ProductDetail
            addToCart={addToCartMultiple}
            updateCartQuantity={updateCartQuantity}
            isLoggedIn={isLoggedIn}/>} />

        <Route path="/register"
         element={
          <RegisterForm />} />

        <Route path="/orders/history"
        element={<OrderHistory />} />

        <Route path="/login"
         element={
          <LoginForm
           onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/logout" element={<Logout onLogout={() => {
          setIsLoggedIn(false);
          setUserName('');
          clearCart();
        }}/>} />
      </Routes>
  </div>
  );
}

