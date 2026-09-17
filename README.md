# RUI (Remote Universal Input)

Esto es una guía para el uso básico y puesta en funcionamiento del sistema RUI.

## Index

1. [Instalación del sistema](#1-intalación-del-sistema)
2. [Funcionamiento](#2-funcionamiento)
3. [Configuración de Syndesis](#3-configuración-de-syndesis)
4. [Licencia](#4-licencia)

## 1. Intalación del sistema

_Aclaración: "este programa fue creado para su uso en una versión **Pi3+** con un OS **legacy lite 64bits sin entorno gráfico**, no fue testeado en otro entorno._"

Teniendo una **Raspberry Pi 3+** y una tarjeta **microSD** ya formateada con el OS correspondiente (En este caso se usa **Legacy lite 64bits sin entorno gráfico**), proceder a conectarla a la red local en la que se va a dar uso, ya sea por cable ethernet o wifi.

Una vez conectada iniciar una nueva instancia de **_Consola de Mando_** o **_CMD_** en otro equipo conectado en la misma red que la **Raspberry Pi**.

Vamos a conectarnos al equipo usando el comando **ssh usuario@ip**
```bash
# ssh es la keyword para conectar remotamente la sesión actual con el equipo
# usuario es el nombre de usuario que se le dió al OS al momento de formatearlo
# ip es el nombre asignado como parte de la ip que se le dió al OS al momento de formatearlo

# ejemplo:
ssh argos@pi

# ahora va a pedir la confirmación el usuario Argos pidiendo una contraseña, la misma se asignó al momento de formatear el OS

# ejemplo:
123
```

Si es la primera vez que el equipo utilizado se va conectar a la raspberry va a consultar por la firma, en este caso se responde "yes"

Si no es la primera vez y se cambió la firma por algún formateo hay que borrar la firma ssh dentro del usuario en el equipo.

Para usuarios de Windows suele estar en "C:/Users/[Usuario]/.shh" oculto

Una vez ingresado dentro del equipo por la consola vamos a actualizarla para poder usar todas las funciones disponibles:

```bash
sudo apt update
```

Cuando se haya actualizado vamos a instalar **Git** y mejorar el sistema para poder clonar el repositorio donde se encuentra guardada la aplicación:

```bash
yes | sudo apt install git
yes | sudo apt upgrade
```

Para activar el puerto serie:
```bash
sudo raspi-config
# 3. Interface Options
# 6. Serial Port
# Would you like a login shell to be accessible over serial? [No]
# Would you like the serial port hardware to be enabled? [Yes]
# Luego se reinicia el sistema
sudo reboot

# Luego añadir o modificar "enable_uart=1" en el archivo "config.txt"
sudo nano /boot/firmware/config.txt

# Luego en caso de ser necesario añadir o modificar "console=serial0, 115200" en el archivo "cmdline.txt"
sudo nano /boot/firmware/cmdline.txt
```

En este punto ya podemos clonar el repositorio con la aplicación, para eso vamos a usar los siguientes comandos:

```bash
# reemplazar el link con el repositorio que vaya a usarse para cada ocasión
git clone https://github.com/nicosimo8/rui.git

# agregar los siguientes archivos en "home/Argos"
touch log.txt log2.txt log3.txt log4.txt

# agregar el archivo de licencia correspondiente a este producto y pegar dentro el token correspondiente, ejemplo:
cat 2004-95-1001-20220518.licence

# agregar el archivo de configuración y pegar el contenido que hay debajo de este cuadro
cat config.json
# si se tiene la configuración ya definida se pueden modificar los valores por primera vez aquí, sino se podrá hacer luego dentro de la app

# ATENCIÓN: NO MODIFICAR LOS SIGUIENTES PARAMETROS A MENOS QUE SEA NECESARIO:
# "portNumber", "path"

# proceder dentro de la carpeta "/rui" para continuar
cd rui/
```

_config.json_
```json
{
  "portOne": {
    "portNumber": 1,
    "path": "/dev/ttyS0",
    "baudRate": "9600",
    "dataBits": "8",
    "parity": "none",
    "stopBits": "1",
    "stringLength": "38",
    "numberInit": "12",
    "numberFin": "22",
    "statusInit": "0",
    "statusFin": "0",
    "statusBo": "false"
  },
  "portTwo": {
    "portNumber": 2,
    "path": "/dev/ttyS0",
    "baudRate": "1200",
    "dataBits": "8",
    "parity": "none",
    "stopBits": "1",
    "stringLength": "8",
    "numberInit": "1",
    "numberFin": "5",
    "statusInit": "0",
    "statusFin": "1",
    "statusBo": "true"
  }
}
```

Luego procedemos a instalar **NVM** y **NPM** para poder utilizar aplicación hechas con **Node**.

_Atención: "Este paso puede obviarse si ya se clonó el respositorio anteriormente, ya que se puede usar el comando **sh app-install.sh** dentro de la carpeta de **/rui** que hace todo de forma automática con la versión de desarrollo (nvm v0.40.3 y node 22)."_

```bash
sh app-install.sh

# or

sudo apt update
# v0.40.3 es la versión que se usó durante el desarrollo, se recomienda usar la última versión disponible, reemplazar en el siguiente:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v
# si muestra el número de la versión al momento de usar node -v es porque ya está instalado!
```

Se instalan todas las librerías, se construye la app y se genera e inicia el servicio:

_Atención: "Este paso puede obviarse usando el comando **sh app-update.sh** dentro de la carpeta **/rui**"_

```bash
sh app-update.sh

# or

npm install
npm run build

sudo cp rui.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable rui.service
sudo systemctl start rui.service
```

En caso de tener problemas usando **node** o **npm**, estando dentro de la carpeta **/rui**:

```bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

Una vez realizado todos estos pasos el programa ya debería encontrarse funcionando correctamente.

## 2. Funcionamiento

Esta aplicación tiene dos formas de uso, vía **entorno gráfico** o **API**.

Entorno gráfico
-
Para su uso en **entorno gráfico** debemos acceder desde cualquier navegador conectado a la red local donde se instaló el equipo, se recomienda el uso de Chrome, y escribir la dirección local usada al momento del formateo del OS seguida del puerto 3000 que es el puerto que ocupa la aplicación dentro de la raspberry.

Ej: http://pi.local:3000/

Esta app tiene tres rutas creadas para acceder y usar:
* Principal -> http://pi.local:3000/pages/main
* Configuración -> http://pi.local:3000/pages/config
* [Licencia](http://pi.local:3000/pages/licence) -> http://pi.local:3000/pages/licence

### Principal
Empezando por la [Principal](http://pi.local:3000/pages/main), en esta sección podemos observar el Logo del producto seguido de dos recuadros, un botón y finalmente la firma de la empresa ***Argos Casilda S.A.S.™***.

Los recuadros están nombrados como **Puerto 1** y **Puerto 2**.
Dentro de ellos podremos ver el peso de los dispositivos conectados a **Rui** vía **Syndesis**.

* Entre **"lectura"** y **"estado"** aparecerá el **peso** indicado en **kg** o un "**-**", este último indicando un error de lectura o no recibiendo ninguna. Este se actualizará cada **1seg**, por lo que los cambios que surjan en la báscula se verán reflejados segundo a segundo.
* A la izquierda de **"estado"**, en caso de haber habilitado la opción de recibir un estado, se mostrará dichos caracteres seleccionado.
* Debajo de los antes mencionados aparecerá fecha y hora en formato _dd/mm/aaaa y 24hs, min y seg_. en caso de no estar recibiendo lectura en el puerto este mostrará dicho formato con ceros
* Por último un pequeño recuadro que cambia de **"Activo"** a **"Inactivo"** dependiendo si está o no recibiendo peso o hay un error de lectura.

El botón debajo de los **Puertos** lleva a la página de [Configuración](http://pi.local:3000/pages/config).

### Configuración
Seguimos por [Configuración](http://pi.local:3000/pages/config), en esta sección podemos observar un diseño similar al de la página [Principal](http://pi.local:3000/pages/main), el Logo del producto seguido de dos recuadros, dos botones y finalmente la firma de la empresa ***Argos Casilda S.A.S.™***.

Al igual que la sección anterior ambos recuadros están nombrados como **Puerto 1** y **Puerto 2** haciendo referencia a su debida entrada y configuración.

*  Las opciones "**Baudrate**", "**Bits**", "**Paridad**", "**Stop Bit**" y "**Largo**" siendo este último el largo del "***string***", se pueden configurar con las indicaciones del manual de cada báscula.
* "**Num Ini**" y "**Num Fin**" hacen referencia a los espacios utilizados por la balanza para mostrar el peso, por ejemplo, si el _string_ de la balanza es "L000123\r\n" el espacio del peso comprende desde la posición **1** hasta la **6**, la cuenta de caracteres siempre empieza por el "cero", ejemplo: la "**L**" es el **0**, se encuentra entre el **0** y el **1**.
* "**Estado**" hace referencia si el usuario desea mostrar el caracter de estado u otro dato del _string_ en el apartado de "**estado**" en la página [Principal](http://pi.local:3000/pages/main). En caso de poner "si" se mostrará el caracter indicado entre los números de las opciones siguientes. Este dato es un booleano, solo puede responderse "si" o "no".
* "**Estado Ini**" y "**Estado Fin**" hacen referencia a la opción anterior, al igual que "**Num Ini**" y "**Num Fin**" los caracteres comprendidos entre dicha selección son los que se mostrarán a un costado de "**estado**".

Depende de cada balanza este valor puede ser sacado del manual de la misma, a veces con un error de uno o dos lugares por como se resuelve dentro del código.

Volviendo a los elementos restantes:
* El botón de "**Guardar**" al presionarse va a emerger un anuncio sobre el reinicio del equipo, siendo "si" la opción que guarda los cambios y reinicia el equipo y "no" la que cancela el proceso.
* El botón de "**Volver**" lleva a la página [Principal](http://pi.local:3000/pages/main).

### Licencia
A diferencia de las otras dos, por el momento no hay un botón que lleve hacia esta página, en ella se podrá apreciar el logo del producto, los datos de la licencia, un _input_ junto a un botón para ingresar una nueva licencia y la firma de la empresa ***Argos Casilda S.A.S.™***.

API
-
Para su uso en **API** debemos realizar una petición por protocolo ***http*** dentro de la red local donde se instaló el equipo utilizando la dirección local mencionada anteriormente: La ip.local puesta al momento del formateo del OS seguida del puerto 3000 que es el puerto que ocupa la aplicación dentro de la raspberry.

Ej: http://pi.local:3000/

la ruta API habilitada es "***/api/v1/serialport***".

Esta ruta solo tiene habilitada la petición **GET**, para poder realizarla es necesario contar con la autorización de la API correspondiente a la licencia otorgada. Ejemplo de consulta por "**REST Client**":

```http
GET http://pi.local:3000/api/v1/serialport HTTP/1.1
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpZSI6IjIwMDQtOTUtMTAwMS0yMDIyMDUxOCIsImlhdCI6MTc1ODkwMTkwNCwiZXhwIjoxNzYxNDkzOTA0fQ.Xhwm4x0WGnmHpfAKn1Qwb-mAj8Ba5pvW0HrJAi-rqdA>
```

Por este medio se podrá obtener el peso remotamente mendiante json, ej:
```json
{
  "usb1": "",
  "usb2": "",
  "com1": "\\x02         1\\r\\n     11660\\r\\n       128\\r\\n\\x03",
  "com2": "L000123\\r\\n"
}
```
_A tener en cuenta: "Los backslash "\\" dobles significan uno simple "\", esto se debe a como se interpreta el código, así que de ser necesario hay que reemplazar los dobles backslash por simples. En lo personal recomiendo que se reemplace el caracter completo, ej: "\\r" por "\r" y así con los otros para poder tener un string mas limpio al momento de usarse."_

_Otra pequeña cosa a tener en cuenta es que tanto "usb1" como "usb2" son caracteristicas que se agregarán en futuras versiones del programa, por ahora solo se usará "com1" y "com2"._


## 3. Configuración de Syndesis

Parecido a lo mencionado anteriormente en el apartado de "**Configuración**" nos vamos a centrar en los datos necesarios para que la placa **Syndesis** reconozca la báscula conectada correctamente.

En una primera instancia vamos a observar que hay tres LEDs que van a indicar los diferentes estados de **Syndesis**.

El led aislado tiene dos estados posibles:
* **<span style="color:red">Rojo</span> titilante**: La placa no está iniciada.
* **<span style="color:red">Rojo</span> fijo**: La placa ya está operativa.

"**Baudrate**", "**Bits**", "**Paridad**", "**Stop Bit**" y "**Largo**" son necesarios para que el equipo reconozca y pueda leer correctamente los valores de la báscula conectada.
Para saber si estos fueron dados correctamente debemos observar el estado del LED indicador del equipo correspondiente al puerto conectado.
* **<span style="color:green">Verde</span> titilante**: El equipo lee y recibe correctamente los datos.
* **<span style="color:red">Rojo</span> fijo**: El equipo **no** está leyendo o recibiendo correctamente los datos.

## 4. Licencia

Este producto cuenta con una licencia por tiempo limitado, en caso de necesitar una nueva licencia comunicarse con el proveedor ***Argos Casilda S.A.S.™***.

Al momento de expirar la licencia, el equipo ya no será accesible para su uso en lectura o vía API.

[Ir hacia arriba](#rui-remote-universal-input)