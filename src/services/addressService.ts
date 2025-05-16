// import api from './api';

// interface Address {
//   id: number;
//   tipo: string;
//   cep: string;
//   logradouro: string;
//   numero: string;
//   complemento?: string;
//   bairro: string;
//   cidade: string;
//   estado: string;
//   principal: boolean;
// }

// export const AddressService = {
//   async getUserAddresses(userId: number): Promise<Address[]> {
//     try {
//       const response = await api.get(`/users/${userId}/addresses`);
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao buscar endereços:', error);
//       throw error;
//     }
//   },

//   async setPrimaryAddress(addressId: number): Promise<void> {
//     try {
//       await api.patch(`/addresses/${addressId}/set-primary`);
//     } catch (error) {
//       console.error('Erro ao definir endereço principal:', error);
//       throw error;
//     }
//   },

//   async searchCEP(cep: string): Promise<any> {
//     try {
//       // Remove caracteres não numéricos
//       const cleanCEP = cep.replace(/\D/g, '');
      
//       if (cleanCEP.length !== 8) {
//         throw new Error('CEP inválido');
//       }

//       const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
//       const data = await response.json();

//       if (data.erro) {
//         throw new Error('CEP não encontrado');
//       }

//       return {
//         cep: data.cep,
//         logradouro: data.logradouro,
//         complemento: data.complemento,
//         bairro: data.bairro,
//         cidade: data.localidade,
//         estado: data.uf
//       };
//     } catch (error) {
//       console.error('Erro na busca do CEP:', error);
//       throw error;
//     }
//   }
// };