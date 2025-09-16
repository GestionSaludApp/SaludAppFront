const diccionarioCompleto = {
    es: {
        mensajeDefault: 'Este es el componente: ',
        inicio: 'Inicio',
        usuario: 'Usuario',
        ingreso: 'Ingresar',
        registro: 'Registrarse',
        datosPersonales: 'Datos personales',
        calendario: 'Calendario',
        ayuda: 'Ayuda',
        error: 'Ups, algo salió mal.',
        escribaSu: 'Escriba su',
        nuevo: 'Nuevo',
        eliminar: 'Eliminar',
        selecccionarRol: 'Seleccioná el rol de este perfíl',
        faltaInformacion: 'Faltan datos necesarios',
        email: 'Email',
        password: 'Contraseña',
        confirmarpassword: 'Confirmar contraseña',
        rol: 'Rol',
        guardar: 'Guardar',
        advertenciaEmail: 'El correo electrónico debe tener un formato válido (ej: texto@correo.com).',
        advertenciaPassword: 'La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
        advertenciaConfirmacionPassword: 'Las contraseñas no coinciden.',
        nombre: 'Nombre',
        apellido: 'Apellido',
        dni: 'DNI',
        especialidad: 'Especialidad',
        advertenciaNombres: 'Nombre inválido: solo debe contener letras y espacios.',
        advertenciaDNI: 'DNI inválido: debe contener solo números.',
        fechaNacimiento: 'Fecha de nacimiento',
        registroExitoso: 'Usuario registrado con éxito.',
        registroFallido: 'No se pudo completar el registro. Verifique los datos e intente nuevamente.',
        ingresoFallido: 'No se pudo completar el ingreso. Intente nuevamente o verifique los datos.',
        disponibilidad: 'Cronograma',
        seccional: 'Localización',
        dia: 'Día',
        horaInicio: 'Entrada',
        horaFin: 'Salida',
        perfil: 'Perfil',
        turno: 'Turno',
    }
  };

let idiomaActual: keyof typeof diccionarioCompleto = 'es';

export function cambiarIdioma(nuevoIdioma: keyof typeof diccionarioCompleto) {
  idiomaActual = nuevoIdioma;
}

export function obtenerDiccionario() {
  return diccionarioCompleto[idiomaActual];
}