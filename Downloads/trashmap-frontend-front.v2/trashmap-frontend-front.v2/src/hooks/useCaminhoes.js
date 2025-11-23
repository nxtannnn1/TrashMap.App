import { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../config/api';

export default function useCaminhoes() {
  const [caminhoes, setCaminhoes] = useState([]);

  const carregarCaminhoes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/caminhoes`);
      if (!res.ok) throw new Error('Erro ao buscar caminhões');
      const data = await res.json();

      // Se vier paginado (Spring Data), extrai o array de content
      const lista = Array.isArray(data) ? data : data.content || [];
      console.log('Caminhões carregados:', lista);

      setCaminhoes(lista);
    } catch (err) {
      console.error('Erro ao buscar caminhões:', err);
    }
  }, []);

  useEffect(() => {
    carregarCaminhoes();
    const interval = setInterval(carregarCaminhoes, 5000);
    return () => clearInterval(interval);
  }, [carregarCaminhoes]);

  return { caminhoes, carregarCaminhoes };
}
