// ---------------------------------------------------------------------------
// Shared types & mock data for Noutăți pages
// Replace with Strapi API calls when ready
// ---------------------------------------------------------------------------

export type CategoryKey =
  | "evenimente"
  | "anunturi"
  | "general"
  | "competitii"
  | "tips";

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string
  category: CategoryKey;
  coverImage: string;
  body: string; // Rich content (mock HTML)
}

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  evenimente: "Evenimente",
  anunturi: "Anunțuri",
  general: "General",
  competitii: "Competiții",
  tips: "Tips",
};

export const ARTICLES: Article[] = [
  {
    slug: "campionatul-national-2025",
    title: "Campionatul Național de Patinaj Artistic 2025",
    description:
      "Sportivii noștri au obținut rezultate excepționale la Campionatul Național, demonstrând calitatea antrenamentelor și dedicarea echipei.",
    date: "2025-11-15T10:00:00",
    category: "competitii",
    coverImage: "/images/courses_generated.png",
    body: `<h2>Rezultate remarcabile pentru EduSport</h2>
<p>Sportivii Școlii de Patinaj EduSport au participat la Campionatul Național de Patinaj Artistic 2025, desfășurat în perioada 12-15 noiembrie la Patinoarul Olimpic din București.</p>
<p>Echipa noastră a obținut <strong>3 medalii de aur</strong>, <strong>2 de argint</strong> și <strong>4 de bronz</strong>, confirmând încă o dată calitatea programului de antrenament și dedicarea instructorilor.</p>
<h3>Clasamente pe categorii</h3>
<table>
<thead><tr><th>Sportiv</th><th>Categorie</th><th>Loc</th></tr></thead>
<tbody>
<tr><td>Maria Ionescu</td><td>Juniori</td><td>Locul 1</td></tr>
<tr><td>Andrei Popescu</td><td>Seniori</td><td>Locul 2</td></tr>
<tr><td>Elena Dumitrescu</td><td>Juniori</td><td>Locul 1</td></tr>
</tbody>
</table>
<p>Felicitări tuturor sportivilor și antrenorilor pentru rezultatele obținute!</p>
<blockquote><p>„Aceste rezultate sunt rodul muncii de echipă și al pasiunii pentru patinaj." — Antrenor Principal</p></blockquote>`,
  },
  {
    slug: "inscrieri-sezon-2025-2026",
    title: "Înscrierile pentru sezonul 2025-2026 sunt deschise!",
    description:
      "Înscrie-te acum la cursurile de patinaj artistic pentru noul sezon. Locuri limitate pentru toate grupele de vârstă.",
    date: "2025-10-01T08:00:00",
    category: "anunturi",
    coverImage: "/images/generated_image.png",
    body: `<h2>Noul sezon începe în curând!</h2>
<p>Suntem bucuroși să anunțăm că înscrierile pentru sezonul 2025-2026 sunt oficial deschise. Cursurile vor începe pe 15 octombrie și se vor desfășura la Patinoarul Cotroceni On Ice.</p>
<h3>Grupe disponibile</h3>
<ul>
<li><strong>Primii Pași</strong> — pentru copii de 3-5 ani, fără experiență anterioară</li>
<li><strong>Începători</strong> — pentru copii de 5-8 ani</li>
<li><strong>Intermediari</strong> — pentru cei cu minim 1 an experiență</li>
<li><strong>Avansați</strong> — program de performanță</li>
</ul>
<p>Locurile sunt limitate, iar înscrierea se face pe principiul „primul venit, primul servit".</p>`,
  },
  {
    slug: "echipament-patinaj-ghid-parinti",
    title: "Echipamentul de patinaj — ghid complet pentru părinți",
    description:
      "Tot ce trebuie să știi despre alegerea patinelor, protecțiilor și îmbrăcămintei potrivite pentru primele lecții.",
    date: "2025-09-20T09:00:00",
    category: "tips",
    coverImage: "/images/courses_generated.png",
    body: `<h2>Cum alegi echipamentul potrivit</h2>
<p>Alegerea echipamentului corect este esențială pentru confortul și siguranța copilului pe gheață. Iată un ghid complet pentru părinți.</p>
<h3>Patinele</h3>
<p>Patinele de patinaj artistic diferă de cele de hochei sau de cele recreaționale. Ele au lama mai lungă și cu dinți la vârf, necesari pentru sărituri și piruete.</p>
<h3>Protecții recomandate</h3>
<table>
<thead><tr><th>Echipament</th><th>Nivel</th><th>Obligatoriu</th></tr></thead>
<tbody>
<tr><td>Cască</td><td>Începători</td><td>Da</td></tr>
<tr><td>Genunchiere</td><td>Toți</td><td>Recomandat</td></tr>
<tr><td>Mănuși</td><td>Toți</td><td>Da</td></tr>
<tr><td>Protecție șold</td><td>Avansați</td><td>Recomandat</td></tr>
</tbody>
</table>
<p>Vă recomandăm să consultați instructorii înainte de a achiziționa echipament scump.</p>`,
  },
  {
    slug: "spectacol-craciun-2025",
    title: "Spectacolul de Crăciun 2025 — Pregătiri în toi",
    description:
      "Pregătirile pentru spectacolul anual de Crăciun sunt în plină desfășurare. Detalii despre program și bilete.",
    date: "2025-11-28T10:00:00",
    category: "evenimente",
    coverImage: "/images/generated_image.png",
    body: `<h2>Magia sărbătorilor pe gheață</h2>
<p>Spectacolul de Crăciun 2025 va avea loc pe 21 decembrie la Patinoarul Cotroceni On Ice. Toți cursanții școlii vor participa într-un program artistic special.</p>
<p>Pregătirile au început încă din luna noiembrie, cu repetiții săptămânale dedicate coreografiilor de grup.</p>`,
  },
  {
    slug: "rezultate-cupa-edusport-toamna",
    title: "Rezultatele Cupei EduSport — Ediția de Toamnă",
    description:
      "Peste 40 de cursanți au participat la competiția internă. Descoperă clasamentele și momentele speciale.",
    date: "2025-11-20T10:00:00",
    category: "competitii",
    coverImage: "/images/courses_generated.png",
    body: `<h2>O competiție de succes</h2>
<p>Cupa EduSport — Ediția de Toamnă 2025 a adunat peste 40 de participanți din toate grupele de nivel. Competiția s-a desfășurat într-o atmosferă plină de energie și fair-play.</p>`,
  },
  {
    slug: "program-modificat-vacanta",
    title: "Program modificat în perioada vacanței de iarnă",
    description:
      "Vă informăm că în perioada 23 decembrie — 7 ianuarie programul cursurilor va fi modificat.",
    date: "2025-12-10T08:00:00",
    category: "anunturi",
    coverImage: "/images/generated_image.png",
    body: `<h2>Modificări de program</h2>
<p>În perioada vacanței de iarnă (23 decembrie 2025 — 7 ianuarie 2026), programul cursurilor va suferi următoarele modificări:</p>
<ul>
<li>Cursurile de luni și miercuri se suspendă</li>
<li>Cursurile de weekend se mențin conform programului obișnuit</li>
<li>Sesiunile de antrenament individual continuă conform programărilor</li>
</ul>`,
  },
  {
    slug: "beneficii-patinaj-copii",
    title: "5 beneficii ale patinajului artistic pentru copii",
    description:
      "De la îmbunătățirea echilibrului la dezvoltarea disciplinei — descoperă cum patinajul ajută în dezvoltarea copilului tău.",
    date: "2025-09-05T09:00:00",
    category: "tips",
    coverImage: "/images/courses_generated.png",
    body: `<h2>De ce patinaj artistic?</h2>
<p>Patinajul artistic nu este doar un sport spectaculos, ci și un instrument extraordinar pentru dezvoltarea fizică și emoțională a copiilor.</p>
<h3>1. Echilibru și coordonare</h3>
<p>Patinajul dezvoltă simțul echilibrului și coordonarea motorie într-un mod unic, pe care puține sporturi îl oferă.</p>
<h3>2. Disciplină și perseverență</h3>
<p>Învățarea elementelor tehnice necesită răbdare și muncă constantă, calități care se transferă și în viața de zi cu zi.</p>
<h3>3. Încredere în sine</h3>
<p>Fiecare element nou stăpânit aduce un sentiment puternic de realizare personală.</p>
<h3>4. Socializare</h3>
<p>Cursurile de grup oferă oportunitatea de a lega prietenii și de a învăța să lucreze în echipă.</p>
<h3>5. Sănătate fizică</h3>
<p>Patinajul este un exercițiu cardiovascular complet care dezvoltă musculatura armonios.</p>`,
  },
  {
    slug: "parteneriat-federatia-patinaj",
    title: "Parteneriat cu Federația Română de Patinaj",
    description:
      "EduSport devine partener oficial al Federației Române de Patinaj pentru programele de inițiere.",
    date: "2025-08-15T10:00:00",
    category: "general",
    coverImage: "/images/generated_image.png",
    body: `<h2>Un pas important pentru EduSport</h2>
<p>Suntem mândri să anunțăm că Școala de Patinaj EduSport a semnat un acord de parteneriat cu Federația Română de Patinaj.</p>
<p>Acest parteneriat ne permite să oferim cursanților noștri acces la competiții oficiale și la programe de dezvoltare a tinerelor talente.</p>`,
  },
  {
    slug: "cum-sa-te-pregatesti-primul-curs",
    title: "Cum să îți pregătești copilul pentru primul curs de patinaj",
    description:
      "Sfaturi practice pentru părinți: ce trebuie să știi înainte de prima lecție pe gheață.",
    date: "2025-08-01T09:00:00",
    category: "tips",
    coverImage: "/images/courses_generated.png",
    body: `<h2>Primul curs de patinaj — ghid pentru părinți</h2>
<p>Prima lecție de patinaj poate fi o experiență emoționantă atât pentru copii, cât și pentru părinți. Iată câteva sfaturi utile.</p>
<h3>Înainte de curs</h3>
<ul>
<li>Asigurați-vă că copilul a dormit bine și a mâncat cu cel puțin o oră înainte</li>
<li>Îmbrăcați-l în straturi subțiri dar calde — nu haine groase care restricționează mișcarea</li>
<li>Mănuși impermeabile sunt obligatorii</li>
</ul>
<h3>La patinoar</h3>
<p>Ajungeți cu 15 minute înainte pentru a vă familiariza cu spațiul. Instructorii noștri vă vor ghida pas cu pas.</p>`,
  },
  {
    slug: "gala-patinaj-artistic-bucuresti",
    title: "EduSport la Gala de Patinaj Artistic București 2025",
    description:
      "Cursanții noștri au participat la gala anuală, oferind momente artistice memorabile.",
    date: "2025-07-20T10:00:00",
    category: "evenimente",
    coverImage: "/images/generated_image.png",
    body: `<h2>O seară de spectacol</h2>
<p>Gala de Patinaj Artistic București 2025 a fost un eveniment de neuitat, iar cursanții EduSport au fost printre vedetele serii.</p>
<p>Cu coreografii originale și interpretări pline de emoție, echipa noastră a demonstrat că pasiunea și talentul merg mână în mână.</p>`,
  },
  {
    slug: "noi-cursuri-incepatori-aprilie",
    title: "Noi cursuri pentru începători în aprilie",
    description:
      "Lansăm o nouă serie de cursuri pentru începători. Înscrierea este deschisă până pe 31 martie.",
    date: "2025-03-15T08:00:00",
    category: "anunturi",
    coverImage: "/images/courses_generated.png",
    body: `<h2>Cursuri noi de primăvară</h2>
<p>Începând cu luna aprilie, deschidem o nouă serie de cursuri pentru începători, adresată copiilor cu vârsta între 4 și 8 ani.</p>`,
  },
  {
    slug: "tabara-vara-2025",
    title: "Tabăra de vară de patinaj — Ediția 2025",
    description:
      "O săptămână intensivă de antrenamente, jocuri pe gheață și activități creative pentru cursanții EduSport.",
    date: "2025-06-01T09:00:00",
    category: "evenimente",
    coverImage: "/images/generated_image.png",
    body: `<h2>Tabăra de vară revine!</h2>
<p>Între 7 și 13 iulie 2025, organizăm a patra ediție a taberei de vară de patinaj. O săptămână plină de antrenamente intensive, jocuri pe gheață și activități creative.</p>`,
  },
];
