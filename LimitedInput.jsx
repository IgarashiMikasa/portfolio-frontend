import React from 'react'

export default function LimitedInput({
    value,
  onChange,
  maxLength,
  placeholder,
  type = 'text',
  style = {},
  error,
}) {
   const handleChange = (e) => {
    const val = e.target.value.slice(0, maxLength);
    onChange(val);
   };



  return (
      <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        border: error ? '1px solid red' : '1px solid #ccc',
        padding: '8px',
        marginBottom: '8px',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  )
}
