import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressService } from '../services/addressService';
import { Address } from '../types/types';

export default function CheckoutEndereco() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuarioInfo') || '{}');

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        if (usuario?.id) {
          const data = await AddressService.getUserAddresses(usuario.id);
          setAddresses(data);
        } else {
          setError('Usuário não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar endereços');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddresses();
  }, [usuario]);

  const handleContinue = () => {
    if (!selectedAddress) {
      setError('Selecione um endereço de entrega');
      return;
    }
    navigate('/checkout/pagamento');
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Selecione um Endereço</h2>
      {addresses.length === 0 ? (
        <div>Nenhum endereço cadastrado.</div>
      ) : (
        addresses.map(address => (
          <div key={address.id}>
            <input
              type="radio"
              name="address"
              value={address.id}
              checked={selectedAddress === address.id}
              onChange={() => setSelectedAddress(address.id)}
            />
            <label>
              {address.logradouro}, {address.numero} - {address.bairro}, {address.cidade} - {address.estado} | CEP: {address.cep}
            </label>
          </div>
        ))
      )}
      <button onClick={handleContinue} disabled={!selectedAddress}>
        Continuar
      </button>
    </div>
  );
}