FROM orchardup/nginx
ADD public_html/ /var/www
CMD 'nginx'