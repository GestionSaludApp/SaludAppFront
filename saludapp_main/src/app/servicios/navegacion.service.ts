import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {

  constructor(private router: Router) {}

  irInicio(){this.router.navigate(['/inicio']);}
  irIngreso(){this.router.navigate(['/ingreso']);}

  irDatosPersonales(){this.router.navigate(['/datosPersonales']);}
  irCalendario(){this.router.navigate(['/calendario']);}

  irRegistro(){this.router.navigate(['/registro']);}

  irAyuda(){this.router.navigate(['/ayuda']);}
  irError(){this.router.navigate(['/error']);}

  irTurnosDisponibles(){this.router.navigate(['/turnosDisponibles']);}
  irTurnosAtencion(){this.router.navigate(['/turnosAtencion']);}

  irEspecialidades(){this.router.navigate(['/especialidades']);}
  irSeccionales(){this.router.navigate(['/seccionales']);}

}
