{
echo "******APP-CREATE - INICIO******"

echo "******CREANDO IMAGEN******"
sudo docker build . -t ruiimg:v0

echo "******CREANDO Y CORRIENDO LOS CONTAINERS******"
sudo docker run --privileged -d --restart=always -v /sys:/sys -v /dev:/dev -p3000:3000 --name ruicontainer ruiimg:v0

echo "******FINALIZANDO******"

echo "******APP-CREATE - FIN******"
}