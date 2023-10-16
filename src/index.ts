import { 
    Canister, 
    StableBTreeMap, 
    Record, Principal,
    nat8, 
    nat64, 
    Vec, 
    query, 
    text, 
    update, 
    Void,
    Result, 
    Err, 
    Ok,
    Opt,
    Variant,
    int8,
    int64,
    Tuple,
    ic
} from 'azle';

const TipoSangre = {
    1: 'O+',
    2: 'O-',
    3: 'A-',
    4: 'A+',
    5: 'B+',
    6: 'B-',
    7: 'AB+',
    8: 'AB-'
}
const Sexo = {
    1: 'Másculino',
    2: 'Femenino',
    3: 'No binario'
}

const TipoDonacion = {
    1: 'Sangre',
    2: 'Plaquetas',
    3: 'Plasma',
    4: 'Dobles glóbulos rojos'
}

const EstatusSolicitud = {
    1: 'Activa',
    4: 'Atendida parcial',
    2: 'Atendida total',
    3: 'Cerrada'
}

const ErroresAplicacion = Variant({
    CentroDoesNotExist: Principal,
    SolicitudDoesNotExist: Principal,
    UsuarioDoesNotExist: Principal,
    DonacionDoesNotExist: Principal,

});

const CentroDonacion = Record({
    idCentro: Principal,
    nombre: text,
    direccion: text,
    latitud: text,
    longitud: text
});

// Usuario, almancena el id, tipo de sangre de los usuarios
const Usuario = Record({
    idUsuario: Principal,
    nombre: text,
    apPat: text,
    apMat: text,
    tipoSangre: nat8,
    sexo: nat8,
    fechaNacimiento: nat64
});

// Evento, organización, grupo o personas (donataria) beneficiadas por las donaciones, 
// La idea es que una vez registrada se vote para verificar o seleccionar cuál Donataria
// se apoyará en cierto momento.
const Solicitud = Record({
    idSolicitud:Principal,
    usuarioSolicita: Principal,
    tipoSangre: nat8,
    fechaSolicitud: nat64,
    tipoDonacion: nat8,
    estatus: nat8,
    fechaCierre: nat64,
    unidades: nat8,
    unidadesAportadas: nat8
});


// Corresponde con la información que se debe almacenar de cada transacción de tipo donación
// La importancia de está Dapp es que no exista un usuario/organización centralizado que 
// pudiera disponer indebidamente de lo recaudado.
const Donacion = Record({
    idDonacion:Principal,
    usuarioDonador: Principal,
    solicitud: Principal,
    unidades: nat8,
    fecha: nat64
});

//

let usuarios = StableBTreeMap(Principal, Usuario, 0);
let solicitudes = StableBTreeMap(Principal, Solicitud, 1);
let donaciones = StableBTreeMap(Principal, Donacion, 2);
let centrosDonacion = StableBTreeMap(Principal, CentroDonacion, 2);


export default Canister({
    // obtenerCentros: query([], Vec(CentroDonacion), () => {
    //     return centrosDonacion.values();
    // }),

    // obtenerCentro: query([Principal], Opt(CentroDonacion), (idCentro) => {
    //     return centrosDonacion.get(idCentro);
    // }),

    // crearCentro: update([text, text, text, text], CentroDonacion, (nombre, direccion, lat, lon) => {
    //     const idCentro = generateId();
    //     const centro: typeof CentroDonacion = {
    //         idCentro: idCentro,
    //         nombre: nombre,
    //         direccion: direccion,
    //         latitud:lat,
    //         longitud:lon
    //     };
    //     centrosDonacion.insert(idCentro, centro);
    //     console.log(`Nuevo centro se ha creado:`, idCentro.toText());
    //     return centro;
    // }),

    // eliminarCentro: update([Principal], Result(CentroDonacion, ErroresAplicacion), (idCentro) => {
    //     const centro = centrosDonacion.get(idCentro);
    //     if ('None' in centro) {
    //         return Err({
    //             CentroDoesNotExist: idCentro
    //         });
    //     }
    //     const centroX = centro.Some;
    //     centrosDonacion.remove(idCentro);
    //     return Ok(centroX);
    // }),

    // actualizaCentro: update([Principal, text, text, text, text], Result(CentroDonacion, ErroresAplicacion), (idCentro, nombre, direccion, lat, lon) => {
    //     const centro = centrosDonacion.get(idCentro);
    //     if ('None' in centro) {
    //         return Err({
    //             CentroDoesNotExist: idCentro
    //         });
    //     }
    //     const nuevoCentro: typeof CentroDonacion = {
    //         idCentro,
    //         nombre: nombre,
    //         direccion: direccion,
    //         latitud:lat,
    //         longitud:lon
    //     };
    //     centrosDonacion.remove(idCentro);
    //     centrosDonacion.insert(idCentro, nuevoCentro);
    //     return Ok(nuevoCentro);
    // }),

    obtenerUsuarios: query([], Vec(Usuario), () => {
        return usuarios.values();
    }),

    // obtenerUsuario: query([Principal], Opt(Usuario), (idUsuario) => {
    //     return usuarios.get(idUsuario);
    // }),

    // obtenerUsuarioPorTipoSangre: query([nat8], Vec(Usuario), (tipoSangre) => {
    //     let users: typeof Usuario[] = [];
    //     for (const usuario of usuarios.values()) {
    //         if (usuario.tipoSangre == tipoSangre) {
    //             users.push(usuario);
    //         }
    //     }
    //     return users;
    // }),

    // crearUsuario: update([text, text, text, nat8, nat8, nat64], Usuario, (nombre, apPat, apMat, tipoSangre, sexo, fecha) => {
    //     const idUsuario = generateId();
    //     // const idUsuario = ic.caller(); 
    //     //En producción sería que cada usuario tenga su ID en función de su Identity
    //     const usuario: typeof Usuario = {
    //         idUsuario: idUsuario,
    //         nombre: nombre,
    //         apPat: apPat,
    //         apMat: apMat,
    //         tipoSangre: tipoSangre,
    //         sexo: sexo,
    //         fechaNacimiento: fecha
    //     };
    //     usuarios.insert(idUsuario, usuario);
    //     console.log(`Nuevo usuario se ha creado:`, idUsuario.toText());
    //     return usuario;
    // }),

    // eliminarUsuario: update([Principal], Result(Usuario, ErroresAplicacion), (idUsuario) => {
    //     const usuario = usuarios.get(idUsuario);
    //     if ('None' in usuario) {
    //         return Err({
    //             CentroDoesNotExist: idUsuario
    //         });
    //     }
    //     const usuarioX = usuario.Some;
    //     usuarios.remove(idUsuario);
    //     return Ok(usuarioX);
    // }),

    // actualizaUsuario: update([Principal, text, text, text, nat8, nat8, nat64],  Result(Usuario, ErroresAplicacion), (idUsuario, nombre, apPat, apMat, tipoSangre, sexo, fecha) => {
    //     const usuario = usuarios.get(idUsuario);
    //     if ('None' in usuario) {
    //         return Err({
    //             UsuarioDoesNotExist: idUsuario
    //         });
    //     }
    //     const nuevoUsuario: typeof Usuario = {
    //         idUsuario: idUsuario,
    //         nombre: nombre,
    //         apPat: apPat,
    //         apMat: apMat,
    //         tipoSangre: tipoSangre,
    //         sexo: sexo,
    //         fechaNacimiento: fecha
    //     };
    //     usuarios.remove(idUsuario);
    //     usuarios.insert(idUsuario, nuevoUsuario);
    //     return Ok(nuevoUsuario);
    // }),


    llenar: update([],  Void, () => {
        llenarDatos('Juan','Pérez','López',2,1,3121212n);
        llenarDatos('María','Sánchez','Gómez',3,2,3121212n);
        llenarDatos('Pedro','González','Reyes',4,1,3121212n);
        llenarDatos('Gael','Flores','Juárez',4,1,3121212n);
        llenarDatos('Sara','Olivares','Segovia',3,2,3121212n);
        llenarDatos('Manuel','De León','Campos',2,1,3121212n);
    }),
    // Función para notificar a los donantes de nueva solicitud, basado en el tipo de sangre
    // Función para obtener las donaciones hechas por un usuario derminado
    // Función para obtener las donaciones por tipo de sangre
    // Función para obtener las usuarios por tipo de sangre
    // Función para premiar con 5 estrellas (puede ser gamificación o tokens ICP)
    // Función para estádisticas
    //      Por tipo de sangre
    //      Por tipo de donación
    //      Por sexo



    crearSolicitud: update([Principal, nat8, nat8, nat8, nat64,nat8], Solicitud, (idUsuario, tipoSangre, tipoDonacion, estatus, fechaCierre, unidades) => {
        const idSolicitud = generateId();
            // const idUsuario = ic.caller(); 
            //En producción sería que cada usuario tenga su ID en función de su Identity
        const solicitud: typeof Solicitud = {
            idSolicitud: idSolicitud,
            usuarioSolicita: idUsuario,
            tipoSangre: tipoSangre,
            fechaSolicitud: ic.time(),
            tipoDonacion: tipoDonacion,
            estatus: 1,
            fechaCierre: fechaCierre,
            unidades: unidades,
            unidadesAportadas: 0
        };
        solicitudes.insert(idSolicitud, solicitud);
        console.log(`Nueva solicitud se ha creado:`, idSolicitud.toText());
        return solicitud;
    }),

    obtenerSolicitudes: query([], Vec(Solicitud), () => {
        return solicitudes.values();
    }),

    crearDonacion: update([Principal, Principal, nat8], Donacion, (idUsuario, idSolicitud, unidades) => {
        const idDonacion = generateId();
        const solicitudOpt = solicitudes.get(idSolicitud);
        let solicitud = solicitudOpt.Some;
        if (solicitud?.unidadesAportadas){
            solicitud.unidadesAportadas += unidades
        }
        const donacion: typeof Donacion = {
            idDonacion:idDonacion,
            usuarioDonador: idUsuario,
            solicitud: idSolicitud,
            unidades: unidades,
            fecha: ic.time()
        };
        donaciones.insert(idDonacion, donacion);
        console.log(`Nueva donación se ha creado:`, idDonacion.toText());
        return donacion;
    }),

    obtenerDonaciones: query([], Vec(Donacion), () => {
        return donaciones.values();
    }),
});

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

function llenarDatos(nombre:string, apPat:string, apMat:string, tipoSangre:int8, sexo:int8,fecha:int64){
    const idUsuario = generateId();
    // const idUsuario = ic.caller(); 
    //En producción sería que cada usuario tenga su ID en función de su Identity
    const usuario: typeof Usuario = {
        idUsuario: idUsuario,
        nombre: nombre,
        apPat: apPat,
        apMat: apMat,
        tipoSangre: tipoSangre,
        sexo: sexo,
        fechaNacimiento: fecha
    };
    usuarios.insert(idUsuario, usuario);
}
