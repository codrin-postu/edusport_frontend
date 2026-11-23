import type { GhidPage } from "@/lib/ghid/types";

export const pregatesteServerulPage: GhidPage = {
  slug: "pregateste-serverul",
  title: "Pregătește serverul",
  lead: "Sistemul, Docker, swap-ul și firewall-ul unui server nou.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Actualizează sistemul." },
        { text: "Instalează Docker Engine cu pluginul compose, nginx, certbot cu pluginul nginx, git, rsync, fail2ban și sysstat." },
        { text: "Adaugă utilizatorul de instalare în grupul **docker**." },
        { text: "Fără cel puțin 4 GB de memorie, adaugă un fișier de swap de 2 GB. Construirea imaginilor consumă multă memorie." },
        {
          text: "Setează SSH numai cu cheie. Verifică valoarea efectivă, nu fișierul: fișierele cloud-init pot reactiva parola, iar fișierul de întărire trebuie să se sorteze primul.",
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
          text: "Creează rețeaua **edusport_net**. Ambele fișiere compose o declară ca externă, deci trebuie să existe înainte de prima pornire.",
          code: "docker network create edusport_net",
        },
        { text: "Copiază **edusport-egress.sh** și **edusport-egress.service** de pe serverul vechi, înainte de a-l scoate din uz (descrise mai jos)." },
        { text: "Activează serviciul **edusport-egress.service** (pornește după docker.service)." },
      ],
    },
    { t: "h2", text: "Politica de ieșire a containerelor" },
    {
      t: "p",
      text: "Serverul actual blochează traficul containerelor către exterior, cu excepția DNS (porturile 53 și 123) și a porturilor 80 și 443, și blochează portul 25, 465 și 587 de ieșire de pe server, cu excepția utilizatorului **postfix** pe 25. Fișierele sunt **/usr/local/sbin/edusport-egress.sh** și **edusport-egress.service** și nu se află în niciun depozit.",
    },
    { t: "p", text: "Consecință: containerele ajung în exterior doar pe 443 (Brevo, Google, GlitchTip)." },
    { t: "links", items: [{ slug: "instaleaza-backend-ul" }] },
  ],
};
