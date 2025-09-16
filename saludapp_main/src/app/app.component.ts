import { Component } from '@angular/core';
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
}
