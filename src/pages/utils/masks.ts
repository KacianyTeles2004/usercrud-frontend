/**
 * Formata uma string para o padrão de cartão de crédito (0000 0000 0000 0000)
 * @param value - Valor a ser formatado
 * @returns String formatada
 */
export const maskCreditCard = (value: string): string => {
    // Remove tudo que não é dígito
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limita a 16 dígitos e adiciona espaços a cada 4 dígitos
    return digitsOnly
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  
  /**
   * Formata uma string para o padrão de data de expiração (MM/AA)
   * @param value - Valor a ser formatado
   * @returns String formatada
   */
  export const maskExpiryDate = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limita a 4 dígitos e insere a barra após 2 dígitos
    return digitsOnly
      .slice(0, 4)
      .replace(/(\d{2})(\d{0,2})/, '$1/$2');
  };
  
  /**
   * Formata uma string para o padrão CVV (000 ou 0000)
   * @param value - Valor a ser formatado
   * @param isAmex - Indica se é um cartão American Express (CVV 4 dígitos)
   * @returns String formatada
   */
  export const maskCVV = (value: string, isAmex: boolean = false): string => {
    const maxLength = isAmex ? 4 : 3;
    return value.replace(/\D/g, '').slice(0, maxLength);
  };
  
  /**
   * Valida o número do cartão usando o algoritmo de Luhn
   * @param cardNumber - Número do cartão (sem formatação)
   * @returns Booleano indicando se o número é válido
   */
  export const validateCreditCard = (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Algoritmo de Luhn
    let sum = 0;
    for (let i = 0; i < cleanNumber.length; i++) {
      let digit = parseInt(cleanNumber[i], 10);
      
      if ((cleanNumber.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
    }
    
    return sum % 10 === 0 && cleanNumber.length >= 13;
  };