/** Objeto para iniciar el formulario con valores por defecto */
export const FORM_INIT_SEARCH_FRAUDE = { 
  // Información básica
  fecha_ini_re:  new Date(),
  fecha_fin_re:  new Date(),
  fecha_ini_ocu: new Date(),
  fecha_fin_ocu: new Date(),
  id:            '',
  descripcion:   '',
  tipo_fraude:   '0',
  componente:    '0',
  fuente:        '0',
  // Información avanzada
  usuario:       '',
  riesgo:        '',
  impacto:       '0',
  empresa:       '',
  servicio:      '0'
};