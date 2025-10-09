import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { Disponibilidad } from '../../../clases/disponibilidad';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { NgFor, NgIf } from '@angular/common';
import { dias } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';
import { FormsModule } from '@angular/forms';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { TitleCasePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-turnos-disponibles',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, TitleCasePipe],
  templateUrl: './ver-turnos-disponibles.component.html',
  styleUrl: './ver-turnos-disponibles.component.css'
})
export class VerTurnosDisponiblesComponent implements OnInit {
  diasLocal = dias;
  seccionalesLocal = seccionales;
  especialidadesLocal = especialidades;
  
  disponibilidadesActivas: Disponibilidad[] = [];
  turnosDisponibles: Turno[] = [];
  turnosActivos: Turno[] = [];   // nuevos: turnos asignados al usuario

  duracion: number = 20;

  filtroActivo: boolean = false;
  filtroDia: number | null = null;
  filtroSeccional: number | null = null;
  filtroEspecialidad: number | null = null;

  constructor(
    private baseDeDatos: BasededatosService, 
    private usuarioActual: UsuarioActivoService
  ) {}
  
  ngOnInit(): void {
    // Cargar especialidades y seccionales
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades.slice(1);
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });

    // Cargar turnos asignados al usuario al iniciar
    let idPerfil = this.usuarioActual.perfil?.idPerfil;
    if (idPerfil) {
      this.baseDeDatos.buscarTurnosActivos({ idPerfil }).subscribe({
        next: (turnos: Turno[]) => {
          this.turnosActivos = turnos;
        },
        error: (err) => console.error('Error cargando turnos activos:', err)
      });
    }
  }
  
  filtrar() {
    const filtros: any = {};
  
    if (this.filtroDia !== null) filtros.diaSemana = this.filtroDia;
    if (this.filtroSeccional !== null) filtros.idSeccional = this.filtroSeccional;
    if (this.filtroEspecialidad !== null) filtros.idEspecialidad = this.filtroEspecialidad;
    
    this.baseDeDatos.buscarTurnos(filtros).subscribe({
      next: (turnos: Turno[]) => {
        this.turnosDisponibles = turnos;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
      }
    });
  }

  solicitarTurno(turno: Turno) {
    let idPerfil = this.usuarioActual.perfil?.idPerfil;
    if (idPerfil) {
      turno.idPaciente = idPerfil;
    } else {
      return;
    }

    console.log('Turno a solicitar:', turno);
    
    this.baseDeDatos.solicitarTurno(turno).subscribe({
      next: () => {
        // Mover turno de disponibles a activos
        this.turnosActivos.push(turno);
        this.turnosDisponibles = this.turnosDisponibles.filter(t => t.idTurno !== turno.idTurno);
    
        Swal.fire({
          title: '¡Turno confirmado!',
          text: 'Tu turno fue reservado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd'
        });
      },
      error: (error) => {
        console.error('Error al solicitar turno:', error);
        Swal.fire({
          title: 'Error al confirmar turno',
          text: 'No se pudo reservar el turno. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // convierte minutos a formato hh:mm
  leerMinutos(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
