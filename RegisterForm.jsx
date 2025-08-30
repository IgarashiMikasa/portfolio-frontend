import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LimitedInput from './LimitedInput';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

const handleRegister = async () => {
    const newErrors = {};

    if (!name.trim()){
      newErrors.name = 'ニックネームを入力してください';
    } else if (name.length < 3 || name.length > 20) {
    newErrors.name = 'ニックネームは3文字以上20文字以内で入力してください';
  }
    if (!loginId.trim()){
      newErrors.loginId = 'IDを入力してください';
    } else if (loginId.length < 7 || loginId.length > 20) {
    newErrors.loginId = 'IDは7文字以上20文字以内で入力してください';
  }
    if (!password.trim()){
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 8) {
    newErrors.password = 'パスワードは8文字以上で入力してください';
  }
    if (!passwordConfirm.trim()) {
      newErrors.passwordConfirm = 'パスワード(確認用)を入力してください';
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'パスワードが一致しません';
    }
    // エラーがあれば中断
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        loginId,
        password,
      },{withCredentials: true});
      navigate('/login', { state: { loginId, password } });
    } catch (error) {
      if (error.response?.data) {
        setErrors({ general: error.response.data });
      } else {
        setErrors({ general: '登録中にエラーが発生しました。' });
      }
    }
};

  const getInputStyle = (field) =>({
    border: errors[field] ? '1px solid red' : '1px solid #ccc',
    padding: '8px',
    marginBottom: '8px',
    width: '100%',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2>ユーザー登録</h2>

      <LimitedInput
        value={name}
        onChange={setName}
        maxLength={20}
        placeholder="ニックネーム"
        error={errors.name}
      />

      <LimitedInput
        value={loginId}
        onChange={setLoginId}
        maxLength={20}
        placeholder="ID"
        error={errors.loginId}
      />

      <LimitedInput
        value={password}
        onChange={setPassword}
        maxLength={20}
        placeholder="パスワード"
        type="password"
        error={errors.password}
      />

      <LimitedInput
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        maxLength={20}
        placeholder="パスワード(確認用)"
        type="password"
        error={errors.passwordConfirm}
      />

      {Object.values(errors).map((msg, i) => (
       <ErrorMessage key={i} message={msg} />
      ))}

      <button onClick={handleRegister}>登録</button>

    </div>
  );
};
