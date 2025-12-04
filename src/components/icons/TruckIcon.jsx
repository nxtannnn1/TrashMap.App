import React from 'react';

const TruckIcon = ({ status, size = 30, placa }) => {
  // Define cor baseada no status
  const getColor = () => {
    switch(status?.toUpperCase()) {
      case 'ATIVO': 
        return '#28a745'; // Verde
      case 'EM_MANUTENCAO': 
      case 'EM_MANUTENCÃO': 
        return '#ffc107'; // Amarelo
      case 'INATIVO': 
        return '#dc3545'; // Vermelho
      case 'EM_VIAGEM':
        return '#17a2b8'; // Azul claro
      default: 
        return '#007bff'; // Azul padrão
    }
  };

  // Define emoji baseado no status
  const getEmoji = () => {
    switch(status?.toUpperCase()) {
      case 'ATIVO': return '🚚';
      case 'EM_MANUTENCAO': 
      case 'EM_MANUTENCÃO': return '🔧';
      case 'INATIVO': return '⛔';
      case 'EM_VIAGEM': return '🚛';
      default: return '🚚';
    }
  };

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: getColor(),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: `${size * 0.45}px`,
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      border: '2px solid white',
      cursor: 'pointer',
      position: 'relative',
      transition: 'transform 0.2s'
    }}
    title={`${placa || 'Caminhão'} - ${status || 'Status desconhecido'}`}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.zIndex = '1000';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.zIndex = '1';
    }}>
      {getEmoji()}
      
      {/* Indicador de status (círculo pequeno) */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: getColor(),
        border: '1px solid white'
      }} />
    </div>
  );
};

export default TruckIcon;