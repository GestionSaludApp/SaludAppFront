import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NuevaSeccionalComponent } from "../../nuevosElementos/nueva-seccional/nueva-seccional.component";
import { NgFor, NgIf } from '@angular/common';
import { Seccional } from '../../../clases/seccional';
import { Subscription } from 'rxjs';
import { Perfil } from '../../../clases/perfil';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { seccionales } from '../../../funciones/listas';
import { prefijoImagen } from '../../../credenciales/datos';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seccionales',
  standalone: true,
  imports: [NgFor, NgIf, NuevaSeccionalComponent, FormsModule],
  templateUrl: './seccionales.component.html',
  styleUrl: './seccionales.component.css'
})

/*
export class SeccionalesComponent implements OnInit{
  seccionalesLocal: Seccional[] = [];
  prefijoImagen = prefijoImagen;
  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;
  
  mostrarPanelNueva: boolean = false;
  seccionalEditada: Seccional = new Seccional();
  mostrarPanelEditar: boolean[] = [];

  constructor(private usuarioActivo: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  mostrarPanelNuevaSeccional(){
    this.mostrarPanelNueva = !this.mostrarPanelNueva;
  }

  mostrarPanelEditarSeccional(index: number) {
    this.cerrarPaneles();
    this.seccionalEditada = this.seccionalesLocal[index];
    var estabaAbierto = this.mostrarPanelEditar[index];
    if (estabaAbierto) {
      this.mostrarPanelEditar[index] = false;
    } else {
      this.mostrarPanelEditar = this.mostrarPanelEditar.map((_, i) => i === index);
    }
  }

  editarSeccional() {
    this.baseDeDatos.editarSeccional(this.usuarioActivo.idUsuario, this.seccionalEditada).subscribe({
      next: (resp) => {
        console.log('Seccional actualizada', resp);
        this.cerrarPaneles();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
      },
    });
  }

  cerrarPaneles(){
    this.mostrarPanelNueva = false;
    for (let i = 0; i < this.mostrarPanelEditar.length; i++){
      this.mostrarPanelEditar[i] = false;
    }
  }

  */

export class SeccionalesComponent implements OnInit, OnDestroy {
  seccionalesLocal: Seccional[] = [];
  prefijoImagen = prefijoImagen; // asegurate de importar/definir prefijoImagen
  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;

  mostrarPanelNueva = false;
  seccionalEditada: Seccional = new Seccional();
  mostrarPanelEditar: boolean[] = [];

  constructor(
    private usuarioActivo: UsuarioActivoService,
    private baseDeDatos: BasededatosService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });

    // Cuando cargas las seccionales, inicializá también el array de flags
    this.baseDeDatos.buscarSeccionales(() => {
      // atención al slice(1) — confirmá si realmente querés omitir el primer elemento
      this.seccionalesLocal = seccionales.slice(1);

      // inicializar mostrarPanelEditar con el tamaño correcto
      this.mostrarPanelEditar = new Array(this.seccionalesLocal.length).fill(false);

      // si el callback viene de fuera de Angular:
      try { this.cd.detectChanges(); } catch (e) { /* ignora si no está disponible */ }
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  mostrarPanelNuevaSeccional() {
    this.mostrarPanelNueva = !this.mostrarPanelNueva;
  }

  mostrarPanelEditarSeccional(index: number) {
    if (!this.mostrarPanelEditar || this.mostrarPanelEditar.length !== this.seccionalesLocal.length) {
      this.mostrarPanelEditar = new Array(this.seccionalesLocal.length).fill(false);
    }

    const abrir = !this.mostrarPanelEditar[index];
    this.mostrarPanelEditar.fill(false);
    this.mostrarPanelEditar[index] = abrir;

    this.seccionalEditada = { ...this.seccionalesLocal[index] };
  }

  editarSeccional() {
    this.baseDeDatos.editarSeccional(this.usuarioActivo.idUsuario, this.seccionalEditada).subscribe({
      next: (resp) => {
        const idx = this.seccionalesLocal.findIndex(s => s.idSeccional === this.seccionalEditada.idSeccional);
        if (idx !== -1) {
          this.seccionalesLocal[idx] = { ...this.seccionalEditada };
        }
        this.cerrarPaneles();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
      },
    });
  }

  cerrarPaneles() {
    this.mostrarPanelNueva = false;
    if (!this.mostrarPanelEditar || this.mostrarPanelEditar.length !== this.seccionalesLocal.length) {
      this.mostrarPanelEditar = new Array(this.seccionalesLocal.length).fill(false);
      return;
    }
    this.mostrarPanelEditar.fill(false);
  }
  
  exportarCSV() {
    const csvContent = this.generarCSV(this.seccionalesLocal);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'seccionales_disponibles.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generarCSV(seccionales: Seccional[]): string {
    const headers = 'Seccional; Direccion, Ciudad, Provincia, Telefono, Email\n';
    const rows = seccionales.map(seccional => {
      return `
        ${this.eliminarTildes(seccional.nombre)};
        ${this.eliminarTildes(seccional.direccion)};
        ${this.eliminarTildes(seccional.ciudad)};
        ${this.eliminarTildes(seccional.provincia)};
        ${seccional.telefono};
        ${seccional.email}`;
    });

    return headers + rows.join('\n');
  }

  eliminarTildes(palabra: string): string {
    let nuevaPalabra = '';

    for (let letra of palabra) {
        if (letra === 'á') {
            nuevaPalabra += 'a';
        } else if (letra === 'é') {
            nuevaPalabra += 'e';
        } else if (letra === 'í') {
            nuevaPalabra += 'i';
        } else if (letra === 'ó') {
            nuevaPalabra += 'o';
        } else if (letra === 'ú') {
            nuevaPalabra += 'u';
        } else {
            nuevaPalabra += letra;
        }
    }
    return nuevaPalabra;
  }

  eliminarSeccional(seccional: Seccional){
    this.baseDeDatos.eliminarSeccional(this.usuarioActivo.idUsuario, seccional).subscribe({
      next: (res) => {
        console.log('Seccional eliminada:', res);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
      }
    });      
  }

}
