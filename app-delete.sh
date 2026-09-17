{
echo "******APP-DELETE INICIO******"
echo "******CHECKEAR LOS CONTAINERS E IMAGENES******"
sudo docker ps -a
sudo docker image ls

echo "******DETENIENDO Y ELIMINANDO EL CONTAINER******"
sudo docker stop ruicontainer
sudo docker rm ruicontainer

echo "******ELIMINANDO LA IMAGEN******"
sudo docker image rm ruiimg:v0

echo "******VOLVER A CHECKEAR LOS CONTAINERS E IMAGENES******"
sudo docker ps -a
sudo docker image ls
echo "******APP-DELETE FIN******"
}