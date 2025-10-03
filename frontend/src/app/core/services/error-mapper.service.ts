import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorMapperService {
  constructor(private snack: MatSnackBar) {}
  show(status: number, message?: string) {
    let text = 'Ocorreu um erro. Tente novamente.';
    if (status === 409) text = message || 'Conflito: Funcionário já possui um Notebook associado.';
    else if (status === 422) text = message || 'Regra de negócio: Ativo não está Disponível.';
    else if (status === 404) text = message || 'Recurso não encontrado.';
    else if (status === 400) text = message || 'Requisição inválida.';
    else if (status >= 500) text = message || 'Erro interno do servidor.';
    this.snack.open(text, 'Fechar', { duration: 4000 });
  }
}
