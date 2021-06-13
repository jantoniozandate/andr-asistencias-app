## Asistencias App

Este proyecto Node.js cuenta la asistencia de alumnos con base en archivos generados por día.
Para que una asistencia sea válida debe contar como mínimo con la forma:

```
From  ######## Nombre Apellido : PRESENTE
```

## RegExp

La expresión que se está usando para detectar asistencias válidas es la siguiente:
```javascript
/.*From\s*([0-9]{9}|[0-9]{8})\s*((\w\s?)*)\:\s*PRESENTE$/gm
```

## Requerimientos

* Node 8
* Git
* VS Code (o cualquier editor de código)

## Setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/jantoniozandate/andr-asistencias-app.git
cd andr-asistencias-app
```

```bash
npm install
```

## Ejecución

```bash
node index.js
```

El proyecto buscará los archivos de asistencia en la carpeta /asistencias

Al terminar, el proyecto generará un archivo json en la carpeta /results
