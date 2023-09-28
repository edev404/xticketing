/** Objeto para iniciar el formulario con valores por defecto */
export const FORM_INIT = {
  /** Información Básica */
  estado           : '0', 
  codigo           : '',
  control          : '',
  tipo_control     : '', 
  componente       : '',
  descripcion      : '',
  /** Información Avanzada */
  criticidad       : '',
  fuente           : '',
  deteccion        : '',
  accion_resultante: '',
  servicio         : '0',
  empresa          : '',
  /** Checkbox para controles activados */
  activo           : false,
  /** Información Avanzada (Controles activados) */
  fecha_ini         : new Date(),
  fecha_fin         : new Date(),
  serviceac         : 0,
  empreac           : 0,
  causa             : '',
  accion_eje        : ''
};