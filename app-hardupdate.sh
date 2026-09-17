{
echo "******APP-HARDUPDATE INICIO******"
echo "******ELIMINANDO******"
cd ..
yes | sudo rm -r rui
echo "******VOLVIENDO A COPIAR******"
git clone https://github.com/nicosimo8/rui.git
echo "******EJECUTANDO SCRIPT******"
cd rui/
# ONLY FOR TESTING
# git switch develop
# ONLY FOR TESTING
sh app-update.sh
# ONLY FOR PRODUCTION
# sh app-mess.sh
# ONLY FOR PRODUCTION
}