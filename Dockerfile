###### Copiar todo el proyecto y hacer build desde dentro ######
###### si existe dist/disenos-nuevos tambien la va a copiar dentro de la imagen ######
FROM node:16-alpine as build_recaudo
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
FROM nginx:alpine
COPY --from=build_recaudo /app/dist/disenos-nuevos /usr/share/nginx/html
RUN nginx
EXPOSE 80

###### solo copiar el /dist/disenos-nuevos ya generado ######
###### si no existe /dist/disenos-nuevos va a dar error ######
# FROM nginx:alpine
# WORKDIR /app
# COPY ./dist/disenos-nuevos /usr/share/nginx/html
# RUN nginx
# EXPOSE 80

# Siempre se va a correr en NGINX porque consume menos