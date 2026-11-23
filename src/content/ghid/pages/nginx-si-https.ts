import type { GhidPage } from "@/lib/ghid/types";

export const nginxSiHttpsPage: GhidPage = {
  slug: "nginx-si-https",
  title: "nginx și HTTPS",
  lead: "nginx pe server, câte un bloc pentru fiecare gazdă, și certificatele HTTPS.",
  blocks: [
    { t: "p", text: "nginx rulează direct pe server, nu într-un container. Certificatele vin de la certbot, instalat din apt." },
    {
      t: "steps",
      steps: [
        {
          text: "Instalează nginx și certbot.",
          code: "sudo apt install nginx certbot python3-certbot-nginx",
        },
        {
          text: "Scrie blocul site-ului în **/etc/nginx/sites-available/edusport-frontend** și leagă-l simbolic în **sites-enabled/**.",
          code: `server {
    listen 80;
    server_name edusport.codrin.space;

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
        { text: "Adaugă un singur bloc pentru portaluri: **server_name antrenor.edusport.codrin.space sportiv.edusport.codrin.space;**, cu aceeași locație și destinația 127.0.0.1:3000." },
        { text: "Adaugă blocul panoului: **server_name admin.edusport.codrin.space;**, destinația **http://127.0.0.1:1337**, plus **client_max_body_size 50M;**, **proxy_read_timeout 300s;**, **proxy_send_timeout 300s;** și aceleași antete." },
        { text: "Verifică înregistrările DNS: toate cele patru nume trebuie să se rezolve la noul server." },
        {
          text: "Verifică configurația și reîncarcă nginx.",
          code: "sudo nginx -t && sudo systemctl reload nginx",
        },
        {
          text: "Emite certificatele. certbot adaugă blocul 443, redirecționarea și **options-ssl-nginx.conf**.",
          code: `sudo certbot --nginx -d edusport.codrin.space
sudo certbot --nginx -d admin.edusport.codrin.space
sudo certbot --nginx -d antrenor.edusport.codrin.space -d sportiv.edusport.codrin.space`,
        },
        {
          text: "Verifică reînnoirea automată. Reînnoirea este unitatea systemd **certbot.timer**, fără cron și fără scripturi de deploy.",
          code: `systemctl list-timers | grep certbot
sudo certbot renew --dry-run`,
        },
      ],
    },
    {
      t: "p",
      text: "**X-Real-IP** contează: Strapi se bazează doar pe acest antet pentru adresa clientului (limita de înscrieri pe adresă). nginx îl suprascrie cu **$remote_addr**, deci nu poate fi falsificat. **X-Forwarded-Proto** este obligatoriu pentru portal.",
    },
    {
      t: "warn",
      text: "Blocurile de pe serverul actual nu au antete de securitate, limit_req și nici mascarea linkurilor de invitație (**/invite/<secret>** și **?code=** apar întregi în jurnalele de acces). Hotărăște pentru serverul nou: HSTS și celelalte antete, limit_req și un log_format propriu, cu map și $uri.",
    },
    { t: "p", text: "Opțional: configurarea de monitorizare scrie un al doilea jurnal de acces cu **$host** primul, în **/etc/nginx/conf.d/vhost-log.conf**." },
    { t: "links", items: [{ slug: "muta-datele-de-pe-serverul-vechi" }] },
  ],
};
