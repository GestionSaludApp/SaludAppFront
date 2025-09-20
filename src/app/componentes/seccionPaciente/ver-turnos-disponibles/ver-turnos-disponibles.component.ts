import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { Disponibilidad } from '../../../clases/disponibilidad';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dias, leerMinutos } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';

@Component({
  selector: 'app-ver-turnos-disponibles',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './ver-turnos-disponibles.component.html',
  styleUrls: ['./ver-turnos-disponibles.component.css']
})
export class VerTurnosDisponiblesComponent implements OnInit {
  // Datos comunes
  diasLocal = dias;
  seccionalesLocal = seccionales;
  especialidadesLocal = especialidades;

  // Filtros y disponibilidad
  turnosDisponibles: Turno[] = [];
  disponibilidadesActivas: Disponibilidad[] = [];
  duracion: number = 20;
  filtroDia: number | null = null;
  filtroSeccional: number | null = null;
  filtroEspecialidad: number | null = null;

  // Turnos del usuario
  turnosActivos: Turno[] = [];

  constructor(private baseDeDatos: BasededatosService, private usuarioActual: UsuarioActivoService) {}

  ngOnInit(): void {
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades.slice(1);
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });

    this.cargarTurnosActivos();
  }

  // Filtrar turnos disponibles
  filtrar() {
    const filtros: any = {};
    if (this.filtroDia !== null) filtros.diaSemana = this.filtroDia;
    if (this.filtroSeccional !== null) filtros.idSeccional = this.filtroSeccional;
    if (this.filtroEspecialidad !== null) filtros.idEspecialidad = this.filtroEspecialidad;

    this.baseDeDatos.buscarTurnos(filtros).subscribe({
      next: (turnos: Turno[]) => {
        this.turnosDisponibles = turnos;
      },
      error: (error) => console.error('Error al cargar turnos:', error)
    });
  }

  // Solicitar turno
  solicitarTurno(turno: Turno) {
    const idPerfil = this.usuarioActual.perfil?.idPerfil;
    if (!idPerfil) {
      alert('Debes iniciar sesión para solicitar un turno.');
      return;
    }

    turno.idPerfilPaciente = idPerfil;

    this.baseDeDatos.solicitarTurno(turno).subscribe({
      next: () => {
        alert('Turno solicitado correctamente.');
        // Actualizar listas
        this.turnosDisponibles = this.turnosDisponibles.filter(t => t !== turno);
        this.cargarTurnosActivos();
      },
      error: (error) => {
        console.error('Error al solicitar turno:', error.message);
        alert('Hubo un error al solicitar el turno.');
      }
    });
  }

  // Cargar turnos del usuario
  cargarTurnosActivos() {
    if (!this.usuarioActual.perfil) return;

    const filtros = { idPerfil: this.usuarioActual.perfil.idPerfil };
    this.baseDeDatos.buscarTurnosActivos(filtros).subscribe({
      next: (turnos: Turno[]) => this.turnosActivos = turnos,
      error: (error) => console.error('Error al cargar turnos activos:', error)
    });
  }

  // Convertir minutos a hora legible
  leerMinutos(minutos: number) {
    return leerMinutos(minutos);
  }
}
