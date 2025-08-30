import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:8080/api/auth/logout', null, { withCredentials: true });
      } catch (error) {
        console.error('ログアウトエラー:', error);
        // ここでエラーハンドリングしてもOK
      } finally {
        onLogout();
        // ログアウト後はトップページへ遷移
        navigate('/');
      }
    };

    logout();
  }, [navigate,onLogout]);

  // ログアウト処理中に表示するUI（任意）
  return <p>ログアウト中です...</p>;
}