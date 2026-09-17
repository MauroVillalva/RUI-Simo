{
echo "******APP-DELETE INICIO******"
sudo systemctl stop rui.service
sudo systemctl disable rui.service
sudo rm /etc/systemd/system/rui.service
echo "******APP-DELETE FIN******"
}