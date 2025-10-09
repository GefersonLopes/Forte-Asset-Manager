import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const original = (control.value ?? '').toString();
    const cpf = original.replace(/\D/g, '');

    if (!original) return null;

    if (cpf.length !== 11) return { cpfInvalid: true };
    if (/^(\d)\1{10}$/.test(cpf)) return { cpfInvalid: true };

    const calcDV = (base: string, factor: number) => {
      let total = 0;
      for (const char of base) {
        total += Number(char) * factor--;
      }
      const rest = total % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const dv1 = calcDV(cpf.substring(0, 9), 10);
    const dv2 = calcDV(cpf.substring(0, 10), 11);

    if (dv1 !== Number(cpf[9]) || dv2 !== Number(cpf[10])) {
      return { cpfInvalid: true };
    }

    return null;
  };
}
