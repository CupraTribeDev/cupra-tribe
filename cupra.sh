sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 777 ./storage
sudo chmod -R 777 ./bootstrap/cache/
sudo chmod -R 777 ./node_modules/
sudo chmod +x cupra.sh
sudo chmod +x artisan
sudo docker-compose exec php php artisan storage:link
