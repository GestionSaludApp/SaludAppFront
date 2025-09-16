import { Perfil } from "../clases/perfil";
import { Usuario } from "../clases/usuario";
import { BasededatosService } from "../servicios/basededatos.service";
import { fechaAhora } from "./fechas";
import { categoriasPerfil } from "./listas";

export function generarProfesionales(minimo: number, maximo: number, baseDeDatos: BasededatosService) {
  const nombres = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Fernando', 'Gabriela', 'Hugo', 'Isabel', 'Juan'];
  const apellidos = ['Pérez', 'Gómez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Acosta'];

  for (let i = minimo; i < maximo; i++) {
    const numero = fechaAhora + i;

    let nuevoUsuario = new Usuario();
      nuevoUsuario.email = `profesional-${numero}@email.com`;
      nuevoUsuario.password = generarPassword();
      nuevoUsuario.fechaCreacion = fechaAhora;
      nuevoUsuario.ultimoIngreso = fechaAhora;

    let idEspecialidad = generarNumero(1, 12);
    const datosPerfil = {
      rol: 'profesional' as 'profesional',
      categoria: categoriasPerfil[0],
      alias: 'Profesional aleatorio (' + categoriasPerfil[0] + ')',

      nombre: obtenerAleatorio(nombres),
      apellido: obtenerAleatorio(apellidos),
      dni: generarDNI().toLocaleString(),
      fechaNacimiento: generarFechaNacimiento(),
      idEspecialidad: idEspecialidad,
      disponibilidad: generarDisponibilidades(idEspecialidad)
    };

    let nuevoPerfil = new Perfil();
    nuevoPerfil.cargarDatos(datosPerfil);

    baseDeDatos.registrarUsuario(nuevoUsuario, nuevoPerfil, null).subscribe({
      error: (err) => console.error(`Error registrando profesional ${numero}: `, err)
    });
  }
}

// Funciones auxiliares

function generarPassword(): string {
  const mayuscula = String.fromCharCode(generarNumero(65, 90));
  const numero = generarNumero(0, 9).toString();
  const signos = ['!', '?', '@', '#', '$'];
  const signo = signos[generarNumero(0, signos.length - 1)];
  const minusculas = Array.from({ length: 5 }, () => String.fromCharCode(generarNumero(97, 122))).join('');
  return mayuscula + numero + signo + minusculas;
}

function obtenerAleatorio(array: string[]): string {
  return array[generarNumero(0, array.length - 1)];
}

function generarDNI(): number {
  return generarNumero(20000000, 45000000);
}

function generarFechaNacimiento(): string {
  const dia = generarNumero(1, 28).toString().padStart(2, '0');
  const mes = generarNumero(1, 12).toString().padStart(2, '0');
  const anio = generarNumero(1970, 2000);
  return `${dia}/${mes}/${anio}, 00:00`;
}

function generarNumero(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarDisponibilidades(idEspecialidad: number): any[] {
  const cantidadDisponibilidades = generarNumero(2, 6);
  const idSeccional = generarNumero(1, 6);
  const diasDisponibles: number[] = [];
  const disponibilidades = [];

  while (disponibilidades.length < cantidadDisponibilidades) {
    let diaSemana = generarNumero(1, 6);
    if (diasDisponibles.includes(diaSemana)) continue;
    diasDisponibles.push(diaSemana);

    let horaInicio = generarNumero(480, 1080); // entre 8:00 (480 min) y 18:00 (1080 min)
    let horaFin = horaInicio + generarNumero(120, 480); // +2 horas mínimo, +8 horas máximo

    if (horaFin > 1200) horaFin = 1200; // no pasar de las 20:00 (1200 min)

    disponibilidades.push({
      idEspecialidad,
      idSeccional,
      diaSemana,
      horaInicio,
      horaFin
    });
  }

  return disponibilidades;
}