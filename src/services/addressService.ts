import api from './axiosServices';
import { Address } from '../types/types';

export const AddressService = {
  async getUserAddresses(userId: number): Promise<Address[]> {
    const response = await api.get(/users/${userId}/addresses);
    return response.data;
  },

  async setPrimaryAddress(addressId: number): Promise<void> {
    await api.patch(/addresses/${addressId}/set-primary);
  },

  async searchCEP(cep: string): Promise<any> {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) throw new Error('CEP inválido');

    const response = await fetch(https://viacep.com.br/ws/${cleanCEP}/json/);
    const data = await response.json();

    if (data.erro) throw new Error('CEP não encontrado');

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf
    };
  }
};