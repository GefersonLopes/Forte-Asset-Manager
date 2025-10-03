import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-toolbar color="primary" class="!sticky top-0 z-50">
      <button mat-icon-button routerLink="/companies" aria-label="Ir para início">
        <mat-icon>home</mat-icon>
      </button>
      <span class="ml-2 font-semibold">Forte Asset Manager Web</span>
      <span class="flex-1"></span>
      <a mat-button routerLink="/companies">Empresas</a>
    </mat-toolbar>
    <main class="p-4 max-w-6xl mx-auto">
      <router-outlet />
    </main>
  `,
})
export class RootComponent {}
