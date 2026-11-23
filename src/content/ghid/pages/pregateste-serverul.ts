import type { GhidPage } from "@/lib/ghid/types";

export const pregatesteServerulPage: GhidPage = {
  slug: "pregateste-serverul",
  title: "Pregătește serverul",
  lead: "Sistemul, Docker, accesul SSH, firewall-ul, directoarele, cheile de deploy și DNS-ul.",
  blocks: [
    { t: "p", text: "Toate comenzile se rulează pe server, conectat prin SSH cu utilizatorul de instalare (fără drepturi de root, dar cu sudo)." },
    {
      t: "steps",
      steps: [
        {
          text: "Actualizează sistemul și repornește dacă se cere.",
          code: "sudo apt update && sudo apt full-upgrade -y",
        },
        {
          text: "Instalează Docker Engine și pluginul compose din depozitul apt oficial Docker, după documentația de pe pagina **Ce îți trebuie**. Verifică versiunile.",
          code: `docker --version
docker compose version`,
        },
        {
          text: "Instalează nginx, certbot cu pluginul nginx, git, rsync, fail2ban și ufw.",
          code: "sudo apt install -y nginx certbot python3-certbot-nginx git rsync fail2ban ufw",
        },
        {
          text: "Adaugă utilizatorul de instalare în grupul **docker**, apoi deconectează-te și reconectează-te.",
          code: "sudo usermod -aG docker \"$USER\"",
        },
        {
          text: "Cu mai puțin de 4 GB de memorie, adaugă un fișier de swap de 2 GB și păstrează-l și după instalare. Construirea imaginilor consumă multă memorie.",
          code: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab`,
        },
        {
          text: "Permite accesul SSH doar cu cheie și fără root. Verifică valoarea efectivă, nu fișierul: fișierele cloud-init pot reactiva parola, iar fișierul tău de configurare trebuie să se sorteze primul (de exemplu **/etc/ssh/sshd_config.d/00-hardening.conf**).",
          code: "sudo sshd -T | grep -i -E \"passwordauthentication|permitrootlogin\"",
        },
        {
          text: "Activează ufw cu porturile 22, 80 și 443.",
          code: `sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable`,
        },
        {
          text: "Creează directorul **/opt/edusport**, cu utilizatorul de instalare ca proprietar.",
          code: "sudo mkdir -p /opt/edusport && sudo chown \"$USER\":docker /opt/edusport",
        },
        {
          text: "Creează rețeaua Docker **edusport_net**. Ambele fișiere compose o declară ca externă, deci trebuie să existe înainte de prima pornire.",
          code: "docker network create edusport_net",
        },
        {
          text: "Generează o cheie SSH pe server și adaugă cheia publică la depozitul **edusport_backend** din GitHub, la Settings, Deploy keys, doar pentru citire. GitHub nu acceptă aceeași cheie la două depozite: pentru **edusport_frontend** generează a doua cheie și pune câte un alias **Host** în **~/.ssh/config**.",
          code: `ssh-keygen -t ed25519 -f ~/.ssh/edusport_backend -N ""
cat ~/.ssh/edusport_backend.pub`,
        },
        {
          text: "Creează înregistrările **A** pentru site și pentru panou la registrar, către adresa IP a serverului, și așteaptă până se rezolvă. Certificatele din pasul următor cer DNS-ul funcțional.",
          code: `dig +short <gazda site-ului>
dig +short <gazda panoului>`,
        },
      ],
    },
    { t: "h2", text: "Politica de ieșire a containerelor (opțional)" },
    {
      t: "p",
      text: "Serverul actual blochează traficul containerelor către exterior, cu excepția DNS (porturile 53 și 123) și a porturilor 80 și 443, și blochează ieșirea pe porturile 25, 465 și 587 de pe server, cu excepția utilizatorului **postfix** pe 25. Fișierele sunt **/usr/local/sbin/edusport-egress.sh** și unitatea systemd **edusport-egress.service** (pornește după docker.service).",
    },
    {
      t: "warn",
      text: "Cele două fișiere nu se află în niciun depozit, doar pe serverul actual. Copiază-le de acolo înainte de a-l scoate din uz, dacă vrei aceeași protecție. Efect: containerele comunică în exterior doar pe 443 (Brevo, Google, GlitchTip).",
    },
    { t: "links", items: [{ slug: "nginx-si-https" }] },
  ],
};
