import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const original: string = (control.value ?? '').toString();

    if (original && !/^[\d.\-/]*$/.test(original)) {
      return { cnpjInvalid: true };
    }

    const value = original.replace(/[^\d]+/g, '');

    if (!value) {
      return original ? { cnpjInvalid: true } : null;
    }

    if (value.length !== 14) return { cnpjInvalid: true };
    if (/^(\d)\1{13}$/.test(value)) return { cnpjInvalid: true };

    let tamanho = 12;
    let numeros = value.substring(0, tamanho);
    const digitos = value.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return { cnpjInvalid: true };

    tamanho = 13;
    numeros = value.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return { cnpjInvalid: true };

    return null;
  };
}
