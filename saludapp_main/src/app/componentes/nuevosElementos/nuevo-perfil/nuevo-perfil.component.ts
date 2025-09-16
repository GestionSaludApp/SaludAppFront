import { Component } from '@angular/core';
import { categoriasPerfil } from '../../../funciones/listas';
import { FormsModule } from '@angular/forms';
import { NuevoPacienteComponent } from "../nuevo-paciente/nuevo-paciente.component";
import { NuevoProfesionalComponent } from "../nuevo-profesional/nuevo-profesional.component";
import { NuevoAdministradorComponent } from "../nuevo-administrador/nuevo-administrador.component";
import { NgFor, NgIf } from '@angular/common';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { NavegacionService } from '../../../servicios/navegacion.service';

@Component({
  selector: 'app-nuevo-perfil',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NuevoPacienteComponent, NuevoProfesionalComponent, NuevoAdministradorComponent],
  templateUrl: './nuevo-perfil.component.html',
  styleUrl: './nuevo-perfil.component.css'
})

export class NuevoPerfilComponent {

  datosPerfil: any = {};
  categoriasPerfilLocal = categoriasPerfil;
  categoriaNuevoPerfil: string = 'categoría';
  posiblesPerfiles: string[] = ['paciente', 'profesional', 'administrador'];
  perfilNuevoSeleccionado: string | null = null;
  mostrarFormularioNuevoPerfil: boolean = false;

  constructor(private baseDeDatos: BasededatosService, private usuarioActivo: UsuarioActivoService, private navegar: NavegacionService) {}

  guardarDatosUsuario(datos: any) {this.datosPerfil = datos;}

  guardarNuevoPerfil(){
    this.baseDeDatos.registrarPerfilAdicional(this.usuarioActivo.idUsuario, this.datosPerfil).subscribe({
      next: () => {
        alert('Usuario registrado con éxito.');
        this.limpiarFormulario();
        this.navegar.irDatosPersonales();
      },
      error: () => {
        alert('No se pudo completar el registro. Verifique los datos e intente nuevamente.');
        this.limpiarFormulario();
      }
    });
  }

  reiniciarFormulario() {
    this.mostrarFormularioNuevoPerfil = false;
    setTimeout(() => this.mostrarFormularioNuevoPerfil = true, 10);
  }

  limpiarFormulario(){
    this.perfilNuevoSeleccionado = null;
    this.mostrarFormularioNuevoPerfil = false;
  }

}
