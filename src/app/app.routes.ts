import { Routes } from '@angular/router';

import { InicioComponent } from './componentes/inicio/inicio.component';
import { IngresoComponent } from './componentes/ingreso/ingreso.component';
import { AyudaComponent } from './componentes/estaticos/ayuda/ayuda.component';
import { ErrorComponent } from './componentes/estaticos/error/error.component';

import { RegistroComponent } from './componentes/registro/registro.component';

import { DatosPersonalesComponent } from './componentes/usuario/datos-personales/datos-personales.component';
import { CalendarioComponent } from './componentes/usuario/calendario/calendario.component';
import { VerTurnosDisponiblesComponent } from './componentes/seccionPaciente/ver-turnos-disponibles/ver-turnos-disponibles.component';

import { EspecialidadesComponent } from './componentes/seccionAdministrador/especialidades/especialidades.component';
import { SeccionalesComponent } from './componentes/seccionAdministrador/seccionales/seccionales.component';
import { AtencionComponent } from './componentes/seccionProfesional/atencion/atencion.component';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { OlvidecontraComponent } from './componentes/olvidecontra/olvidecontra.component';
import { ContactenosComponent } from './componentes/contactenos/contactenos.component';
import { GestiononlineComponent } from './componentes/gestiononline/gestiononline.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { EstudiosComponent } from './componentes/estudios/estudios.component';

export const routes: Routes = [

    { path: '', redirectTo: 'inicio', pathMatch: 'full' }, //Redirección DEFAULT

    { path: 'inicio', component: InicioComponent },
    { path: 'datosPersonales', component: DatosPersonalesComponent },
    { path: 'calendario', component: CalendarioComponent },

    { path: 'registro', component: RegistroComponent },
    { path: 'ingreso', component: IngresoComponent },

    { path: 'especialidades', component: EspecialidadesComponent },
    { path: 'seccionales', component: SeccionalesComponent },

    { path: 'ayuda', component: AyudaComponent },
    { path: 'error', component: ErrorComponent },

    { path: 'turnosDisponibles', component: VerTurnosDisponiblesComponent },
    { path: 'turnosAtencion', component: AtencionComponent },
    
    {path: 'navbar', component: NavbarComponent},
    {path: 'olvidecontra', component: OlvidecontraComponent},
    {path: 'contactenos', component: ContactenosComponent},
    {path: 'gestiononline', component: GestiononlineComponent},
    {path: 'turnos', component: TurnosComponent},
    {path: 'estudios', component: EstudiosComponent},


];
