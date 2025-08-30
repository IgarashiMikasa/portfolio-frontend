import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffe5e5',
      color: '#cc0000',
      border: '1px solid #cc0000',
      borderRadius: '4px',
      padding: '8px',
      fontSize: '14px',
      marginBottom: '6px',
    }}>
      <span style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#cc0000',
        color: '#fff',
        textAlign: 'center',
        lineHeight: '20px',
        fontWeight: 'bold',
        marginRight: '10px',
        paddingLeft: '1px',
      }}>
        !
      </span>
      {message}
    </div>
  );
}