// // src/components/NewAddressForm.tsx
// import { useState } from 'react';
// import { AddressService } from '../services/addressService';

// export const NewAddressForm = ({ userId, onSuccess }: { userId: number, onSuccess: () => void }) => {
//   const [formData, setFormData] = useState({
//     tipo: 'Casa',
//     cep: '',
//     logradouro: '',
//     numero: '',
//     complemento: '',
//     bairro: '',
//     cidade: '',
//     estado: '',
//     principal: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleCEPBlur = async () => {
//     if (formData.cep.length === 8) {
//       try {
//         const cepData = await AddressService.searchCEP(formData.cep);
//         setFormData(prev => ({
//           ...prev,
//           logradouro: cepData.logradouro,
//           bairro: cepData.bairro,
//           cidade: cepData.cidade,
//           estado: cepData.estado,
//           complemento: cepData.complemento || ''
//         }));
//       } catch (err) {
//         setError('CEP não encontrado');
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await api.post(`/users/${userId}/addresses`, formData);
//       onSuccess();
//     } catch (err) {
//       setError('Erro ao salvar endereço');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Campos do formulário aqui */}
//       <button type="submit" disabled={isLoading}>
//         {isLoading ? 'Salvando...' : 'Salvar Endereço'}
//       </button>
//       {error && <div className="error">{error}</div>}
//     </form>
//   );
// };