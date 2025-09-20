import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule
  ],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {
  fechaSeleccionada: string | null = null;
  horariosDisponibles: { hora: string; disponible: boolean }[] = [];
  turnoConfirmado: string | null = null;
  private modalInstance: any;

  especialidades = ['Cardiología', 'Odontología', 'Pediatría'];
  entidades = ['Centro A', 'Centro B', 'Centro C'];
  filtroEspecialidad = '';
  filtroMedico = '';
  filtroEntidad = '';
  mostrarCalendario = false;

  // Array tipado para el HTML
  eventosFiltrados: EventInput[] = [];

  // Turnos originales para el calendario
  turnos: EventInput[] = [
    { title: 'Disponible - Dr. Pérez - Cardiología - Centro A', date: '2025-09-02', color: 'green' },
    { title: 'No disponible - Dr. López - Odontología - Centro B', date: '2025-09-05', color: 'red' },
    { title: 'Disponible - Dra. García - Pediatría - Centro C', date: '2025-09-07', color: 'green' },
  ];

  // Horarios dinámicos por turno
  horariosPorTurno = [
    {
      fecha: '2025-09-02',
      medico: 'Dr. Pérez',
      especialidad: 'Cardiología',
      entidad: 'Centro A',
      horarios: [
        { hora: '09:00', disponible: true },
        { hora: '10:30', disponible: false },
        { hora: '12:00', disponible: true },
      ]
    },
    {
      fecha: '2025-09-07',
      medico: 'Dra. García',
      especialidad: 'Pediatría',
      entidad: 'Centro C',
      horarios: [
        { hora: '08:00', disponible: true },
        { hora: '10:00', disponible: true },
        { hora: '11:30', disponible: false },
      ]
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    selectable: true,
    events: this.turnos,
    dateClick: (info) => this.onDateClick(info)
  };

  constructor(private cdr: ChangeDetectorRef) {}

  filtrarTurnos() {
    const filtrados = this.turnos.filter(t => {
      if (!t || !t.title) return false;
      const matchEspecialidad = this.filtroEspecialidad ? t.title.includes(this.filtroEspecialidad) : true;
      const matchMedico = this.filtroMedico ? t.title.toLowerCase().includes(this.filtroMedico.toLowerCase()) : true;
      const matchEntidad = this.filtroEntidad ? t.title.includes(this.filtroEntidad) : true;
      return matchEspecialidad && matchMedico && matchEntidad;
    });

    this.eventosFiltrados = filtrados;
    this.calendarOptions.events = this.eventosFiltrados;
    this.mostrarCalendario = true;
    this.cdr.detectChanges();

    if (filtrados.length === 0) {
      Swal.fire({
        icon: 'info',
        title: '⚠️ No hay turnos',
        text: `No se encontraron turnos disponibles${this.filtroEspecialidad ? ' para ' + this.filtroEspecialidad : ''}${this.filtroEntidad ? ' en ' + this.filtroEntidad : ''}${this.filtroMedico ? ' para ' + this.filtroMedico : ''}.`,
      });
    }
  }

  onDateClick(info: any) {
    this.fechaSeleccionada = info.dateStr;

    const turnoDia = this.horariosPorTurno.find(t =>
      t.fecha === info.dateStr &&
      (!this.filtroMedico || t.medico === this.filtroMedico) &&
      (!this.filtroEspecialidad || t.especialidad === this.filtroEspecialidad) &&
      (!this.filtroEntidad || t.entidad === this.filtroEntidad)
    );

    if (turnoDia) {
      this.horariosDisponibles = turnoDia.horarios;

      const modal = document.getElementById('horariosModal');
      if (modal) {
        if (!this.modalInstance) {
          this.modalInstance = new (window as any).bootstrap.Modal(modal);
        }
        this.modalInstance.show();
      }
    } else {
      this.horariosDisponibles = [];
    }
  }

  confirmarTurno(hora: string) {
    this.turnoConfirmado = `Turno confirmado para el ${this.fechaSeleccionada} a las ${hora}`;
    console.log(this.turnoConfirmado);

    if (this.modalInstance) {
      this.modalInstance.hide();
    }

    Swal.fire({
      title: '✅ Turno confirmado!',
      text: this.turnoConfirmado,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      width: '500px',
      padding: '2rem',
      position: 'center',
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
  }
}