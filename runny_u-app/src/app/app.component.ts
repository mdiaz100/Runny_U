import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
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
