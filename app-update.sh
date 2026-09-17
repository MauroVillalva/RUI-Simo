#ACTUALIZAR REPO
{
echo "******APP-UPDATE INICIO******"
echo "******TRAYENDO LOS NUEVOS CAMBIOS******"
git pull

echo "******DETENIENDO Y ELIMINANDO EL SERVICIO******"
sh app-service-remove.sh

echo "******VOLVER A CREAR EL SERVICIO Y DANDO PERMISOS******"
sh app-service-create.sh

echo "******APP-UPDATE FIN******"
}