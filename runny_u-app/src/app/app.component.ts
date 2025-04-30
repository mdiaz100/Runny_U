import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'runny_u-app';
  router = inject(Router)
  ocultarFooter(): boolean {
    const rutasSinFooter = ['/login', '/sign-up', '/admin']; 
    return rutasSinFooter.includes(this.router.url);
  }
}
