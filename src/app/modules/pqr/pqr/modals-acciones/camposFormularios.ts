import { Validators } from "@angular/forms";

export let today:string = new Date().toISOString().substring(0,10);

export let camposAccionesModals = {
    "": [
        {
            name: "none",
            defaultValue: "",
            errorMsg: "",
            label: "",
            validations: [Validators.required, Validators.minLength(4)],
            tipo: "hidden", 
        },
    ],
    "PLANT": [
        {
            name: "cod_pqr",
            defaultValue: "",
            errorMsg: "",
            label: "",
            validations: [],
            tipo: "hidden", 
        },
        {
            name: "fecha_respuesta",
            defaultValue: today,
            errorMsg: "Fecha no válida, por favor verifique.",
            label: "Fecha de respuesta",
            validations: [Validators.required, Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)],
            tipo: "date", 
        },
        {
            name: "descripcion_respuesta",
            defaultValue: "",
            errorMsg: "Respuesta no válida, por favor verifique.",
            label: "Descripción de la respuesta",
            validations: [Validators.required, Validators.minLength(10)],
            tipo: "text", 
        },
    ],
    "ASIAB": [
        {
            name: "responsables",
            defaultValue: "",
            errorMsg: "Debe seleccionar un usuario para gestionar la Pqr.",
            label: "Responsables disponibles",
            validations: [Validators.required, ],
            tipo: "select", 
        },
    ],
    "SUBIR": [
        {
            name: "archivo",
            defaultValue: "",
            errorMsg: "",
            label: "Subir archivo:",
            validations: [Validators.required],
            tipo: "file", 
        },
    ],
    "RECHA": [
        {
            name: "pqr",
            defaultValue: "",
            errorMsg: "",
            label: "Seguro que desea rechazar esta PQR?",
            validations: [],
            tipo: "hidden", 
        },
        {
            name: "motivo_rechazo",
            defaultValue: "",
            errorMsg: "Debe registrar el motivo del rechazo, máximo 500 caracteres.",
            label: "Descripción",
            validations: [Validators.required, Validators.maxLength(500)],
            tipo: "text", 
        },
    ],
    "ENVNO": [
        {
            name: "pqr",
            defaultValue: "",
            errorMsg: "",
            label: "Seguro que desea enviar esta PQR al intermediario de notificación?",
            validations: [],
            tipo: "hidden", 
        },
    ],
    "CITAR": [
        {
            name: "fecha_cita",
            defaultValue: "",
            errorMsg: "",
            label: "Fecha: ",
            validations: [],
            tipo: "date", 
        },
    ],
    "NOTIF": [
        {
            name: "fecha_noti",
            defaultValue: "",
            errorMsg: "",
            label: "Fecha: ",
            validations: [],
            tipo: "date", 
        },
    ],
    "NOTCO": [
        {
            name: "fecha_notif_correo",
            defaultValue: "",
            errorMsg: "",
            label: "Fecha: ",
            validations: [],
            tipo: "date", 
        },
    ],
    "NOTAV": [
        {
            name: "fecha_notif_aviso",
            defaultValue: "",
            errorMsg: "",
            label: "Fecha: ",
            validations: [],
            tipo: "date", 
        },
    ],
    "HISTO": [
        {
            name: "pqr",
            defaultValue: "",
            errorMsg: "",
            label: "Historial de acciones sobre la PQR: ",
            validations: [],
            tipo: "hidden", 
        },
    ],
    "CERRA": [
        {
            name: "pqr",
            defaultValue: "",
            errorMsg: "",
            label: "Seguro que desea cerrar la PQR?",
            validations: [],
            tipo: "hidden", 
        },
    ],
    "PRORR" : [
        {
            name: "pqr",
            defaultValue: "",
            errorMsg: "",
            label: "Notificar extensión de plazo (Prórroga)",
            validations: [],
            tipo: "hidden", 
        },
        {
            name: "justificacion",
            defaultValue: "",
            errorMsg: "Debe registrar el motivo de la prórroga, máximo 500 caracteres.",
            label: "Descripción",
            validations: [Validators.required, Validators.maxLength(500)],
            tipo: "text", 
        },
    ]
};