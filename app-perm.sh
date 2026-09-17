{
echo "******APP-PERM - INICIO******"
echo "******PERMITIENDO A DOCKER, RUI Y LEDS BOOTEAR DESDE EL INICIO******"
sudo systemctl enable docker
sudo systemctl start docker
# sudo systemctl status docker
sudo cp estado_led_anodo.service /etc/systemd/system
sudo cp rui.service /etc/systemd/system
sudo systemctl daemon-reload
sudo systemctl enable estado_led_anodo.service
sudo systemctl enable rui.service
sudo systemctl start estado_led_anodo
sudo systemctl start rui
echo "******APP-PERM - FIN******"
}