import type { GhidPage } from "@/lib/ghid/types";

export const nginxSiHttpsPage: GhidPage = {
  slug: "nginx-si-https",
  title: "nginx și HTTPS",
  lead: "Câte un bloc nginx pentru site și pentru panou, apoi certificatele HTTPS.",
  blocks: [
    {
      t: "p",
      text: "nginx rulează direct pe server, nu într-un container, și trimite cererile către porturile locale ale containerelor: 3000 pentru site, 1337 pentru panou. Se configurează înaintea containerelor, pentru că panoul se deschide prin adresa lui publică, iar site-ul are nevoie de panou la construire. Până pornesc containerele, nginx răspunde 502: este normal.",
    },
    {
      t: "steps",
      steps: [
        {
          text: "Scrie blocul panoului în **/etc/nginx/sites-available/edusport-admin**. Înlocuiește gazda cu a ta.",
          code: `server {
    listen 80;
    server_name admin.exemplu.ro;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}`,
        },
        {
          text: "Scrie blocul site-ului în **/etc/nginx/sites-available/edusport-site**.",
          code: `server {
    listen 80;
    server_name exemplu.ro www.exemplu.ro;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}`,
        },
        {
          text: "Activează cele două blocuri, scoate blocul implicit, verifică și reîncarcă nginx.",
          code: `sudo ln -s /etc/nginx/sites-available/edusport-admin /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/edusport-site /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx`,
        },
        {
          text: "Emite certificatele, câte unul pentru fiecare bloc. DNS-ul trebuie să se rezolve deja. certbot adaugă blocul 443, redirecționarea de pe 80 și **options-ssl-nginx.conf**.",
          code: `sudo certbot --nginx -d admin.exemplu.ro
sudo certbot --nginx -d exemplu.ro -d www.exemplu.ro`,
        },
        {
          text: "Verifică reînnoirea automată. Reînnoirea este unitatea systemd **certbot.timer**, fără cron și fără alte scripturi.",
          code: `systemctl list-timers | grep certbot
sudo certbot renew --dry-run`,
        },
      ],
    },
    {
      t: "p",
      text: "Antetele contează. **Host** trebuie trimis nemodificat: frontend-ul alege între site și portal după el. **X-Real-IP** este singurul antet din care Strapi ia adresa clientului (limita de înscrieri pe adresă); nginx îl suprascrie cu **$remote_addr**, deci nu poate fi falsificat. **X-Forwarded-Proto** este obligatoriu pentru portaluri.",
    },
    {
      t: "warn",
      text: "Blocurile de pe serverul actual nu au antete de securitate (HSTS și celelalte), nu au limit_req și nu maschează linkurile de invitație din jurnalele de acces (**/invite/<secret>** și **?code=** apar întregi). Hotărăște pentru serverul nou: antetele, limit_req și un log_format propriu, cu map și $uri.",
    },
    { t: "p", text: "Opțional, pentru monitorizare: **/etc/nginx/conf.d/vhost-log.conf** scrie un al doilea jurnal de acces cu **$host** pe prima poziție (sursa în depozitul server-ops, **common/vhost-log.conf**)." },
    { t: "links", items: [{ slug: "instaleaza-panoul-de-administrare" }] },
  ],
};
