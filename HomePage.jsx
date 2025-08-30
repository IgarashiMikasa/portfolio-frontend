import React from 'react'
import { Link } from 'react-router-dom';

import ResponsiveButton from './ResponsiveButton';

export default function HomePage({ userName }) {
  return (
    <div className='container mt-4'>
        <h1>{userName ? `ようこそ、${userName} さん！` : 'ようこそ！'}</h1>
        <p>このサイトでは商品を閲覧・購入できます。</p>
        <Link to="/products" className="btn btn-primary">商品一覧を見る</Link>
    </div>
  )
}
