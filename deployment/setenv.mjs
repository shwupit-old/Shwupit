#!/usr/bin/env zx

import 'zx/globals';

echo(chalk.green('Started Setup server'));

echo(chalk.blue('#Step 1 - Installing Nginx'));
await $`sudo apt update`;
await $`sudo apt install -y nginx`;

echo(chalk.blue('#Step 2: Adjusting the Firewall'));
await $`sudo ufw allow ssh`;
await $`sudo ufw allow 'Nginx HTTP'`;
await $`echo "y" | sudo ufw enable`;
await $`sudo ufw default deny`;
await $`sudo ufw status`;

echo(chalk.blue('#Step 3 – Checking your Web Server'));
await $`sudo systemctl status nginx`;

echo(chalk.blue('#Step 9: Setting Up Server & Project'));
let domainName = "localhost";
echo(chalk.green(`Using domain name: ${domainName} \n`));

await $`sudo rm -f /etc/nginx/sites-enabled/default`;
await $`sudo rm -f /etc/nginx/sites-available/default`;
await $`sudo touch /etc/nginx/sites-available/default`;
await $`sudo chmod -R 777 /etc/nginx/sites-available/default`;

await $`sudo echo 'server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location ~ ^/uploads/([^/]+)/images/(.*)$ {
        alias /var/www/html/uploads/$1/images/$2;
        autoindex on;
    }

    location ~ /\. {
        deny all;
    }
}' > '/etc/nginx/sites-available/default'`;

await $`sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/`;
await $`sudo nginx -t`;
await $`sudo systemctl restart nginx`;

echo(chalk.green('Nginx Setup success!'));