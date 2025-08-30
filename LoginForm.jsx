import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LimitedInput from './LimitedInput';

export default function LoginForm({ onLoginSuccess }) {
const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage(''); // 前のエラーをクリア
    if (!loginId.trim() || !password.trim()) {
      setErrorMessage('ログインIDとパスワードを入力してください');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/login', {
        loginId,
        password
      }, { withCredentials: true }); // クッキーを送受信

      onLoginSuccess(); // 親コンポーネントに通知
      navigate('/');
    } catch (err) {

      // ここでサーバーメッセージをチェックしてカスタムメッセージにする
      const serverMsg = err.response?.data || '';

      // 例: サーバーからの認証失敗メッセージに「認証失敗」が含まれている場合
      if (typeof serverMsg === 'string' && serverMsg.includes('認証失敗')) {
      setErrorMessage('IDまたはパスワードが違います');
    } else {
      // それ以外はそのままor汎用メッセージ
      setErrorMessage(serverMsg || 'ログインに失敗しました');
    }
  }
};

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2>ログイン</h2>

      <LimitedInput
        value={loginId}
        onChange={setLoginId}
        maxLength={15}
        placeholder="ID"
        error={!loginId.trim() && errorMessage}
      />

      <LimitedInput
        value={password}
        onChange={setPassword}
        maxLength={20}
        placeholder="パスワード"
        type="password"
        error={!password.trim() && errorMessage}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}

      <button onClick={handleLogin}>ログイン</button>

    </div>
  )
}
