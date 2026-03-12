FROM nginx:alpine

# Varsayılan nginx konfigürasyonunu kaldır
RUN rm /etc/nginx/conf.d/default.conf

# Kendi konfigürasyonumuzu kopyala
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
