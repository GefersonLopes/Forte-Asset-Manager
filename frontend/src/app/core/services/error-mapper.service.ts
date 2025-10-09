import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorMapperService {
  constructor(private snack: MatSnackBar) {}

  show(status: number, message?: string) {
    let text = 'Ocorreu um erro. Tente novamente.';
    if (status === 409) text = message || 'Conflito.';
    else if (status === 422) text = message || 'Regra de negócio violada.';
    else if (status === 404) text = message || 'Recurso não encontrado.';
    else if (status === 400) text = message || 'Requisição inválida.';
    else if (status >= 500 || status === 0) text = message || 'Erro interno do servidor.';
    else text = message || text;

    const panelClass =
      status >= 500 || status === 0
        ? 'snack-error'
        : status === 409 || status === 422 || status === 400
          ? 'snack-warn'
          : status === 404
            ? 'snack-info'
            : 'snack-info';

    this.snack.dismiss();

    this.snack.open(text, undefined, {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass,
    });
  }
}
