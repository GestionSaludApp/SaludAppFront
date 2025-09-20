import { Component } from '@angular/core';
import{RouterLink} from '@angular/router';  
import { CommonModule } from '@angular/common';
import { UsuarioActivoService } from '../../servicios/usuario-activo.service';
import { Profesional } from '../../clases/perfil';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  esProfesional = false;

  constructor(private usuarioActivoService: UsuarioActivoService) {}

  ngOnInit(): void {
    try {
      const perfil = this.usuarioActivoService.perfil; 
      this.esProfesional = perfil instanceof Profesional;
    } catch (error) {
      this.esProfesional = false;
    }
  }
}
