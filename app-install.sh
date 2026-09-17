{
echo "******APP-INSTALL INICIO******"
echo "******DESCARGANDO E INSTALANDO ACTUALIZACIONES******"
sudo apt-get update
sudo apt-get -y upgrade

echo "******DESCARGANDO E INSTALANDO NVM******"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v
echo "******APP-INSTALL FIN******"
}