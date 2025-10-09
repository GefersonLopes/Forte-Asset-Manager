import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailStrictValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = (control.value ?? '').toString();

    if (!value) return null;

    value = value.trim();

    if (value.length > 254) return { emailInvalid: true };

    const at = value.indexOf('@');
    if (at <= 0 || at === value.length - 1) return { emailInvalid: true };

    const local = value.slice(0, at);
    const domain = value.slice(at + 1);

    if (local.length > 64) return { emailInvalid: true };
    if (/\.\./.test(local)) return { emailInvalid: true };

    const localOk = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local);
    if (!localOk) return { emailInvalid: true };

    const labels = domain.split('.');
    if (labels.length < 2) return { emailInvalid: true };

    const labelRe = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/;
    if (!labels.every((l) => labelRe.test(l))) return { emailInvalid: true };

    const tld = labels[labels.length - 1];
    if (tld.length < 2) return { emailInvalid: true };

    return null;
  };
}
