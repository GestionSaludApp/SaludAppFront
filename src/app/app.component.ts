import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from "./componentes/estaticos/encabezado/encabezado.component";
import { PieComponent } from "./componentes/estaticos/pie/pie.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EncabezadoComponent, PieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'saludapp';

  ocultarFooter = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.ocultarFooter = url.includes('ingreso') || url.includes('registro');
    });
  }
}
