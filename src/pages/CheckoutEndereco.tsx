// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AddressService } from '../services/addressService';
// import { useAuth } from '../contexts/AuthContext'; // Supondo que você tenha um contexto de autenticação

// export default function CheckoutEndereco() {
//   const navigate = useNavigate();
//   const { user } = useAuth(); // Obter usuário logado
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Buscar endereços ao carregar o componente
//   useEffect(() => {
//     const loadAddresses = async () => {
//       try {
//         setIsLoading(true);
//         if (user?.id) {
//           const userAddresses = await AddressService.getUserAddresses(user.id);
//           setAddresses(userAddresses);
          
//           // Seleciona automaticamente o endereço principal
//           const primary = userAddresses.find(addr => addr.principal);
//           if (primary) {
//             setSelectedAddress(primary.id);
//           }
//         }
//       } catch (err) {
//         setError('Erro ao carregar endereços');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadAddresses();
//   }, [user]);

//   const handleSelectAddress = async (id: number) => {
//     try {
//       // Se o endereço selecionado não for o principal, atualiza
//       const address = addresses.find(addr => addr.id === id);
//       if (address && !address.principal) {
//         await AddressService.setPrimaryAddress(id);
//         setAddresses(prev => 
//           prev.map(addr => ({
//             ...addr,
//             principal: addr.id === id
//           }))
//         );
//       }
//       setSelectedAddress(id);
//     } catch (err) {
//       setError('Erro ao selecionar endereço');
//       console.error(err);
//     }
//   };

//   const handleContinue = () => {
//     if (!selectedAddress) {
//       setError('Selecione um endereço de entrega');
//       return;
//     }
//     navigate('/checkout/pagamento');
//   };

//   if (isLoading) return <div>Carregando endereços...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (addresses.length === 0) return <div>Nenhum endereço cadastrado</div>;

//   return (
//     // ... (seu JSX existente, utilizando os addresses da API)
//   );
// }