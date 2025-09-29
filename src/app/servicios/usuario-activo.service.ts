import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { Administrador, Paciente, Perfil, Profesional } from '../clases/perfil';
import { Disponibilidad } from '../clases/disponibilidad';

@Injectable({
  providedIn: 'root'
})
export class UsuarioActivoService {
  
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private perfilSubject = new BehaviorSubject<Perfil | null>(null);

  constructor() { }

  //CARGAR DATOS DEL USUARIO
  setUsuario(datosUsuario: any, datosPerfilActivo: any): void {
    const usuario = datosUsuario;
    const perfilActivo = datosPerfilActivo;

    let usuarioInstanciado = new Usuario();

    if (perfilActivo.rol === 'paciente') {
      usuarioInstanciado.perfilActivo = new Paciente();
    } else if (perfilActivo.rol === 'profesional') {
      usuarioInstanciado.perfilActivo = new Profesional();
    } else if (perfilActivo.rol === 'administrador') {
      usuarioInstanciado.perfilActivo = new Administrador();
    } else {
      console.error('Rol de usuario no reconocido:', perfilActivo.rol);
      return;
    }

    usuarioInstanciado.cargarDatos(usuario);
    usuarioInstanciado.perfilActivo.cargarDatos(perfilActivo);

    if (usuarioInstanciado.perfilActivo instanceof Profesional) {
      usuarioInstanciado.perfilActivo.disponibilidad = [];
      for (let disp of perfilActivo.disponibilidad) {
        let horario = new Disponibilidad();
        horario.cargarDatos(disp);
        usuarioInstanciado.perfilActivo.disponibilidad.push(horario);
      }
    }

    this.usuarioSubject.next(usuarioInstanciado);

  }

  setPerfil(datosPerfilActivo: any): void {
    const perfilActivo = datosPerfilActivo;

    let usuarioInstanciado = this.usuarioSubject.getValue();
    if (!usuarioInstanciado) return;

    if (perfilActivo.rol === 'paciente') {
      usuarioInstanciado.perfilActivo = new Paciente();
    } else if (perfilActivo.rol === 'profesional') {
      usuarioInstanciado.perfilActivo = new Profesional();
    } else if (perfilActivo.rol === 'administrador') {
      usuarioInstanciado.perfilActivo = new Administrador();
    } else {
      console.error('Rol de usuario no reconocido:', perfilActivo.rol);
      return;
    }

    usuarioInstanciado.perfilActivo.cargarDatos(perfilActivo);
    if (usuarioInstanciado.perfilActivo instanceof Profesional) {
      usuarioInstanciado.perfilActivo.disponibilidad = [];
      for (let disp of perfilActivo.disponibilidad) {
        let horario = new Disponibilidad();
        horario.cargarDatos(disp);
        usuarioInstanciado.perfilActivo.disponibilidad.push(horario);
      }
    }

    this.usuarioSubject.next(usuarioInstanciado);
  }

  //ELIMINAR DATOS DEL USUARIO
  limpiarUsuario(): void {
    this.perfilSubject.next(null);
    this.usuarioSubject.next(null);
  }

  //ENVIA TODOS LOS PERFILES EN UN ARRAY
  obtenerPerfiles(): Perfil[] {
    if (!this.usuarioSubject.value) {
      throw new Error('No existe un usuario o perfil activo.');
    }
    
    let listaPerfiles: Perfil[] = [];

    for (let perfil of this.usuarioSubject.value.perfiles) {
      listaPerfiles.push(perfil);
    }

    return listaPerfiles;
  }

  //VER UNA INSTANTANEA DEL PERFIL ACTIVO DEL USUARIO ACTIVO
  get perfil(): Paciente | Profesional | Administrador | null | undefined {
    if (!this.usuarioSubject.value) {
      throw new Error('No existe un usuario o perfil activo.');
    }
    return this.usuarioSubject.value.perfilActivo;
  }

  //TRAER DINAMICAMENTE AL PERFIL DEL USUARIO (MANTIENE DATOS ACTUALIZADOS)
  get perfilObservable$() {return this.usuarioSubject.asObservable().pipe(map(usuario => usuario?.perfilActivo ?? null));}

  //ESTO TRAE TODO EL USUARIO (POSIBLEMENTE NO DEBA IMPLEMENTARSE)
  get usuario() {return this.usuarioSubject.value;}

  //ESTO TRAE TODO EL USUARIO DINAMICAMENTE (POSIBLEMENTE NO DEBA IMPLEMENTARSE)
  get usuarioObservable$() {return this.usuarioSubject.asObservable();}

  get idUsuario() {
    if (!this.usuarioSubject.value) {
      throw new Error('No existe un usuario o perfil activo.');
    }
    return this.usuarioSubject.value.idUsuario;
  }

}
