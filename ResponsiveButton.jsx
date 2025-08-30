import React from 'react'

export default function ResponsiveButton({ children }) {
  return (
    <div className="container">
        <button className="custom-hover">{children}</button>
    </div>
  )
}
