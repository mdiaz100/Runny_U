import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgIf } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent,HeaderComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'runny_u-app';
  router = inject(Router)
  hideFooter(): boolean {
    const routesWithoutFooter = ['/login', '/sign-up', '/cart' ]; 
    return routesWithoutFooter.includes(this.router.url);
  }
  hideHeader(): boolean {
    const routesWithoutHeader = ['/login', '/sign-up']; 
    return routesWithoutHeader.includes(this.router.url);
  }
}
