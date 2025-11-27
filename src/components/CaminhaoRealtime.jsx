// import React, { useEffect } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import API_BASE_URL from '../config/api';

// const CaminhaoRealtime = ({ onPosicaoUpdate, onReset }) => {
//   useEffect(() => {
//     const socket = new SockJS(`${API_BASE_URL}/ws`);
//     const client = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,
//       debug: (str) => console.log('STOMP: ', str),
//       onConnect: () => {
//         console.log('Conectado ao WebSocket');
//         client.subscribe('/topic/caminhao-posicao', (message) => {
//           if (!message.body) return;

//           const data = JSON.parse(message.body);

//           const novaPos = {
//             lat: parseFloat(data.latitude),
//             lng: parseFloat(data.longitude),
//           };

//           // Se o back enviar reset=true, limpa a Polyline
//           if (data.reset) {
//             onReset && onReset();
//           }

//           onPosicaoUpdate && onPosicaoUpdate(novaPos);
//         });
//       },
//       onStompError: (frame) => {
//         console.error('Erro STOMP:', frame.headers['message']);
//         console.error('Detalhes:', frame.body);
//       },
//     });

//     client.activate();

//     return () => client.deactivate();
//   }, [onPosicaoUpdate, onReset]);

//   return null; // Marker é controlado pelo mapa
// };

// export default CaminhaoRealtime;
