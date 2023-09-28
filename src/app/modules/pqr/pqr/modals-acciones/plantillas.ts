export const plantillas = [
    {
        name: "default",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha sido atendida y puedes recibir la respuesta a la misma, por lo tanto te solicitamos muy amablemente te presentes en nuestras oficinas para que recibas tu respuesta, recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>
          
          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
    {
        name: "citarUsuario",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha sido atendida y puedes recibir la respuesta a la misma, por lo tanto te solicitamos muy amablemente te presentes en nuestras oficinas para que recibas tu respuesta, recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>
          
          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
    {
        name: "notificarUsuario",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha sido atendida y respondida como sigue:
          
          <br>
          <br>
          [variable_respuesta_pqr]
          <br>
          <br>
          
          Recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>
          
          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
    {
        name: "notificarUsuarioPorCorreo",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha sido atendida y respondida como sigue:
          
          <br>
          <br>
          [variable_respuesta_pqr]
          <br>
          <br>
          <p>Si no estás conforme con lo decidido, tienes 5 días hábiles a partir del conocimiento de esta respuesta para comunicarnos tu inconformidad indicando las razones en una nueva solicitud de tipo Recurso de Reposición, con el fin que el revisemos nuevamente dicha decisión.</p>
          <br>
          <p>Recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>
          
          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
    {
        name: "notificarUsuarioProrroga",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha necesitado más tiempo para poder resolverse y que su fecha maxima de solución se ahora el [variable_fecha_max], por lo que te agradecemos la espera.
          
          <br>
          <br>
          <p>Recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>
          
          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
    {
        name: "notificarResponsable",
        asunto: "PQR No. [variable_cod_pqr] asignada para gestión",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Usuario responsable</title>
        </head>
        <body>
          <p>Hola [variable_nombre_responsable],</p>
          <br>
          <p>La PQR No. [variable_cod_pqr] se te ha asignado para gestión</p>
          <br>
          <p>Atentamente,<br>
          [variable_usuario_actual]</p>
        </body>
        </html>
        `,
    },
    {
        name: "cerrarPqr",
        asunto: "Avance de su solicitud PQR No. [variable_cod_pqr]",
        mensaje: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gracias por contactarnos</title>
        </head>
        <body>
          <p>Hola [variable_nombre],</p>
          
          <p>Te escribimos para contarte que tu solicitud No. [variable_cod_pqr] ha sido cerrada.</p>
          <br>
          <br>
          <p>Recuerda que si no estás conforme con lo decidido, tienes 5 días hábiles a partir del conocimiento de la respuesta para comunicarnos tu inconformidad indicando las razones en una nueva solicitud de tipo Recurso de Reposición, con el fin que el revisemos nuevamente dicha decisión. Puedes diligenciar el Recurso de Reposición o un Recurso de Reposición en Subsidio de Apelación al radicado No. [variable_cod_pqr] de la misma forma en la que presentaste dicha solicitud.</p>
          <br>
          
          Recuerda que es un gusto poder servirte. ¡Estamos aquí para ayudarte!</p>

          <p>Atentamente,<br>
          [variable_empresa]</p>
        </body>
        </html>
        `,
    },
];