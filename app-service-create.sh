{
echo "******APP-SERVICE-CREATE INICIO******"
sude npm install
sudo npm run build
echo "******APP CONSTRUIDA CON ÉXITO******"
echo "******PERMITIENDO A RUI BOOTEAR DESDE EL INICIO******"
sudo cp rui.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable rui.service
sudo systemctl start rui.service
echo "******APP-SERVICE-CREATE FIN******"
}