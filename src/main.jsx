import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  createContext,
  useContext,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  Plus,
  Search,
  BookOpen,
  Bookmark,
  Users,
  MessageSquare,
  LayoutDashboard,
  UploadCloud,
  Settings,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  FileText,
  Maximize,
  Sparkles,
  Cpu,
  Leaf,
  FlaskConical,
  Layers,
  Globe,
  ExternalLink,
  CircleUser,
  Sun,
  Moon,
} from "lucide-react";
import "./styles.css";
const PdfViewer = lazy(() => import("./PdfViewer"));
const Context = createContext();
const topics = [
  ["Tecnología", Cpu, "Lo que viene, hoy."],
  ["Sostenibilidad", Leaf, "Diseñar un mejor mañana."],
  ["Ciencia", FlaskConical, "Preguntas que abren caminos."],
  ["Diseño e innovación", Layers, "Otra forma de ver las cosas."],
];
function useStored(key, initial) {
  const [v, s] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  return [
    v,
    (next) =>
      s((old) => {
        const value = typeof next === "function" ? next(old) : next;
        localStorage.setItem(key, JSON.stringify(value));
        return value;
      }),
  ];
}
function App() {
  const [user, setUser] = useStored("iy-user", null),
    [comments, setComments] = useStored("iy-comments", []),
    [drafts, setDrafts] = useState([]),
    [toast, setToast] = useState("");
  function notify(t) {
    setToast(t);
    setTimeout(() => setToast(""), 4500);
  }
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        comments,
        setComments,
        drafts,
        setDrafts,
        notify,
      }}
    >
      <BrowserRouter>
        <ScrollReset />
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/revistas" element={<Catalog />} />
            <Route path="/revistas/:id" element={<Reader />} />
            <Route path="/lector" element={<Reader />} />
            <Route path="/comunidad" element={<Community />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/acceso" element={<Login />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        {toast && (
          <div className="toast" role="status">
            <Check size={19} />
            {toast}
          </div>
        )}
      </BrowserRouter>
    </Context.Provider>
  );
}
function Header() {
  const [open, setOpen] = useState(false),
    { user } = useContext(Context);
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <header>
        <Link to="/" className="brand" aria-label="Ingeniería Y, inicio">
          ingeniería<span>y</span>
        </Link>
        <nav
          aria-label="Navegación principal"
          id="main-navigation"
          className={open ? "open" : ""}
          onClick={() => setOpen(false)}
        >
          {[
            ["/", "Inicio"],
            ["/revistas", "Revistas"],
            ["/comunidad", "Comunidad"],
            ["/nosotros", "Nosotros"],
          ].map(([p, t]) => (
            <NavLink key={p} to={p} end={p === "/"}>
              {t}
            </NavLink>
          ))}
        </nav>
        <Link className="account" aria-label={user ? "Mi perfil" : "Mi cuenta"} to={user ? "/perfil" : "/acceso"}>
          <CircleUser size={18} />
          <span>{user ? user.name.split(" ")[0] : "Mi cuenta"}</span>
        </Link>
        <button
          className="mobile-toggle icon-btn"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}
function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-square" /> UNA REVISTA. MUCHAS PERSPECTIVAS.
          </div>
          <h1>
            Las ideas
            <br />
            no tienen
            <br />
            <em>límites.</em>
            <span className="asterisk">✳</span>
          </h1>
          <p>
            Ingeniería, ciencia y creatividad en un mismo lugar.
            <br className="desktop" /> Una nueva forma de entender lo que nos
            mueve
            <br className="desktop" /> y de imaginar lo que sigue.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/revistas">
              Explorar revistas <BookOpen size={18} />
            </Link>
            <Link className="text-link" to="/nosotros">
              Conoce el proyecto <Plus size={16} />
            </Link>
          </div>
          <div className="hero-foot">
            <span>HECHA PARA MENTES CURIOSAS</span>
            <span>EST. 2026</span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Composición editorial abstracta con una letra Y y órbitas"
        >
          <div className="art-top">
            <span>
              IDEAS EN
              <br />
              CONSTANTE MOVIMIENTO.
            </span>
            <span>
              INGENIERÍA
              <br />+ TODO LO DEMÁS
            </span>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="giant-y">y</div>
          <div className="art-sticker">
            EL FUTURO
            <br />
            SE CUESTIONA.
            <br />
            <strong>Y SE CONSTRUYE.</strong>
          </div>
          <div className="art-bottom">
            <span>CIENCIA / CULTURA / INNOVACIÓN</span>
            <span>✳</span>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <span>INGENIERÍA</span>✳<span>IDEAS QUE CONECTAN</span>✳
        <span>CIENCIA</span>✳<span>PENSAR DIFERENTE</span>✳
        <span>INNOVACIÓN</span>✳
      </div>
      <section className="shell section">
        <div className="section-head">
          <div>
            <div className="eyebrow">EL SIGUIENTE CAPÍTULO</div>
            <h2>
              Una revista.
              <br />
              <span>Infinitas posibilidades.</span>
            </h2>
          </div>
          <Link className="text-link" to="/revistas">
            Ver todas las revistas <Plus size={18} />
          </Link>
        </div>
        <div className="launch-panel">
          <div className="launch-visual">
            <div className="paper-sheet">
              <span>
                ingeniería<strong>y</strong>
              </span>
              <div className="paper-lines" />
              <b>
                TODO
                <br />
                EMPIEZA
                <br />
                CON UNA
                <br />
                <em>IDEA.</em>
              </b>
              <small>UN NUEVO ESPACIO PARA EXPLORAR</small>
            </div>
            <div className="launch-tag">PRÓXIMAMENTE</div>
          </div>
          <div className="launch-copy">
            <span className="pill">ESTAMOS PREPARANDO ALGO NUEVO</span>
            <h3>
              Las buenas ideas
              <br />
              merecen su espacio.
            </h3>
            <p>
              Nuestra primera edición está en camino. Aquí encontrarás las
              revistas publicadas por el equipo editorial, listas para leer a tu
              ritmo y desde cualquier lugar.
            </p>
            <Link className="btn light" to="/revistas">
              Conocer la biblioteca <BookOpen size={18} />
            </Link>
            <small>
              Sin ediciones publicadas todavía. La curiosidad ya está aquí.
            </small>
          </div>
        </div>
      </section>
      <section className="shell section">
        <div className="section-head">
          <div>
            <div className="eyebrow">CONECTA LOS PUNTOS</div>
            <h2>
              Hay mucho por <em>descubrir.</em>
            </h2>
          </div>
          <p>
            Distintas disciplinas.
            <br />
            Una misma curiosidad.
          </p>
        </div>
        <div className="topic-grid">
          {topics.map(([n, Icon, d]) => (
            <Link
              key={n}
              to={"/revistas?tema=" + encodeURIComponent(n)}
              className="topic-card"
            >
              <Icon size={30} strokeWidth={1.3} />
              <div>
                <h3>{n}</h3>
                <p>{d}</p>
              </div>
              <Plus size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="community-banner shell">
        <div className="community-symbol">✳</div>
        <div>
          <div className="eyebrow">LAS MEJORES IDEAS SE COMPARTEN</div>
          <h2>
            Tu perspectiva
            <br />
            también cuenta.
          </h2>
          <p>Un espacio para preguntar, conversar y construir ideas juntos.</p>
        </div>
        <Link to="/comunidad" className="btn dark">
          Explorar la comunidad <Users size={18} />
        </Link>
      </section>
    </>
  );
}
function PageTitle({ label, title, description }) {
  return (
    <div className="page-title">
      <div className="eyebrow">{label}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
function Empty({ icon: Icon = BookOpen, title, children, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={34} strokeWidth={1.3} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
function Catalog() {
  const [topic, setTopic] = useState(
      new URLSearchParams(window.location.search).get("tema") || "Todas",
    ),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("recent");
  return (
    <div className="shell inner">
      <PageTitle
        label="LA BIBLIOTECA"
        title={
          <>
            Ideas para leer.
            <br />
            <em>Mundos por descubrir.</em>
          </>
        }
        description="Explora nuestras ediciones y encuentra tu próxima gran idea."
      />
      <div className="catalog-tools">
        <label className="search">
          <Search size={20} />
          <input
            aria-label="Buscar revistas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, tema o autor…"
          />
          {query && (
            <button
              className="icon-btn"
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="select-wrap">
          <SlidersHorizontal size={17} />
          <select
            aria-label="Ordenar revistas"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Más recientes</option>
            <option value="old">Más antiguas</option>
            <option value="title">Título A–Z</option>
          </select>
          <ChevronDown size={15} />
        </div>
      </div>
      <div className="filter-row">
        {["Todas", ...topics.map((t) => t[0])].map((t) => (
          <button
            key={t}
            className={topic === t ? "filter selected" : "filter"}
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
          >
            {t}
          </button>
        ))}
        <span>0 ediciones</span>
      </div>
      <Empty
        title={
          query ? "Aún no hay resultados" : "Las grandes ideas están en camino"
        }
      >
        {query
          ? `No hay ediciones para “${query}”. La biblioteca todavía no tiene publicaciones.`
          : "Nuestro equipo está preparando las primeras ediciones. Vuelve pronto para descubrirlas aquí."}
      </Empty>
      <div className="note">
        <Sparkles size={20} />
        <div>
          <strong>Un espacio que está por comenzar</strong>
          <p>
            Cuando se publique una edición, podrás leerla en línea, guardarla y
            participar en la conversación.
          </p>
        </div>
      </div>
    </div>
  );
}
function Community() {
  const { user, comments, setComments, notify } = useContext(Context),
    [text, setText] = useState(""),
    [sort, setSort] = useState("recent");
  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setComments([
      {
        id: crypto.randomUUID(),
        name: user.name,
        userId: user.id,
        text: text.trim(),
        created: new Date().toISOString(),
      },
      ...comments,
    ]);
    setText("");
    notify("Conversación guardada en este navegador");
  }
  return (
    <div className="shell inner">
      <PageTitle
        label="LA COMUNIDAD"
        title={
          <>
            Las ideas crecen
            <br />
            <em>cuando se comparten.</em>
          </>
        }
        description="Preguntas, perspectivas y conversaciones que nos llevan más lejos."
      />
      <div className="two-column">
        <section>
          <div className="panel composer">
            <h3>Abre una conversación</h3>
            <p>¿Qué tema te gustaría explorar en la revista?</p>
            {user ? (
              <form onSubmit={submit}>
                <label className="sr-only" htmlFor="comment">
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  maxLength={1500}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Comparte tu perspectiva…"
                  required
                />
                <div className="composer-bottom">
                  <small>
                    {text.length}/1500 · Visible solo en este navegador
                  </small>
                  <button className="btn primary" disabled={!text.trim()}>
                    Publicar comentario
                  </button>
                </div>
              </form>
            ) : (
              <Link className="btn primary" to="/acceso">
                Entrar para participar <CircleUser size={18} />
              </Link>
            )}
          </div>
          <div className="section-head compact">
            <h3>
              Conversaciones <span className="count">{comments.length}</span>
            </h3>
            <select
              aria-label="Ordenar comentarios"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="old">Más antiguos</option>
            </select>
          </div>
          {!comments.length ? (
            <Empty icon={MessageSquare} title="La conversación empieza contigo">
              Todavía no hay comentarios. Comparte la primera idea y abre un
              nuevo punto de vista.
            </Empty>
          ) : (
            [...comments]
              .sort((a, b) =>
                sort === "recent"
                  ? b.created.localeCompare(a.created)
                  : a.created.localeCompare(b.created),
              )
              .map((c) => (
                <article className="panel comment" key={c.id}>
                  <div className="avatar">{c.name[0].toUpperCase()}</div>
                  <div>
                    <strong>{c.name}</strong>
                    <small>
                      {new Date(c.created).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                      })}
                    </small>
                    <p>{c.text}</p>
                  </div>
                  {user?.id === c.userId && (
                    <button
                      className="icon-btn"
                      aria-label="Eliminar mi comentario"
                      onClick={() =>
                        setComments(comments.filter((x) => x.id !== c.id))
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </article>
              ))
          )}
        </section>
        <aside>
          <div className="panel community-guide">
            <Users size={28} />
            <h3>La curiosidad nos une.</h3>
            <p>Este espacio se construye entre todos.</p>
            <ul>
              <li>Comparte ideas con respeto.</li>
              <li>Cuestiona las ideas, cuida a las personas.</li>
              <li>Aporta contexto y fuentes cuando puedas.</li>
              <li>Mantén viva la curiosidad.</li>
            </ul>
          </div>
          <div className="note stacked">
            <span className="eyebrow">MODO DE DEMOSTRACIÓN</span>
            <p>
              Los perfiles y comentarios se guardan únicamente en este
              navegador. Las cuentas reales llegarán con la conexión del
              servidor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Login() {
  const { setUser } = useContext(Context),
    nav = useNavigate(),
    [name, setName] = useState(""),
    [email, setEmail] = useState("");
  return (
    <div className="shell auth-layout">
      <div>
        <div className="eyebrow">UN ESPACIO PARA TI</div>
        <h1>
          La siguiente
          <br />
          gran idea
          <br />
          podría ser <em>tuya.</em>
        </h1>
        <p>
          Guarda tus lecturas, comparte tus preguntas
          <br />y conecta con otras perspectivas.
        </p>
        <div className="auth-star">✳</div>
      </div>
      <form
        className="panel auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          setUser({
            id: crypto.randomUUID(),
            name: name.trim(),
            email,
            bio: "",
          });
          nav("/perfil");
        }}
      >
        <span className="pill">VISTA PREVIA DE CUENTAS</span>
        <h2>Entra a la comunidad.</h2>
        <p>Prueba tu perfil en este dispositivo.</p>
        <label>
          Tu nombre
          <input
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
            pattern=".*\S.*"
          />
        </label>
        <label>
          Correo electrónico
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="tu@correo.com"
          />
        </label>
        <button className="btn primary">
          Crear perfil de demostración <Plus size={18} />
        </button>
        <div className="form-note">
          No se crea una cuenta real ni se envía información a un servidor. No
          uses información sensible. La autenticación se conectará en una
          próxima etapa.
        </div>
      </form>
    </div>
  );
}
function Profile() {
  const { user, setUser, comments, notify } = useContext(Context),
    [tab, setTab] = useState("saved"),
    nav = useNavigate();
  if (!user)
    return (
      <div className="shell inner">
        <Empty
          icon={CircleUser}
          title="Tu espacio te espera"
          action={
            <Link className="btn primary" to="/acceso">
              Crear perfil de demostración
            </Link>
          }
        >
          Entra para explorar tu perfil y tu biblioteca personal.
        </Empty>
      </div>
    );
  return (
    <div className="shell inner">
      <PageTitle
        label="MI ESPACIO"
        title={
          <>
            Hola, <em>{user.name.split(" ")[0]}.</em>
          </>
        }
        description="Tu curiosidad, tus lecturas y tus conversaciones."
      />
      <div className="two-column">
        <section>
          <div className="filter-row">
            {[
              ["saved", "Lecturas guardadas"],
              ["comments", "Mis comentarios"],
              ["settings", "Editar perfil"],
            ].map(([id, t]) => (
              <button
                key={id}
                className={"filter " + (tab === id ? "selected" : "")}
                onClick={() => setTab(id)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "saved" && (
            <Empty
              icon={Bookmark}
              title="Tu próxima lectura te espera"
              action={
                <Link className="btn light" to="/revistas">
                  Explorar revistas
                </Link>
              }
            >
              Las ediciones que guardes aparecerán aquí cuando se publiquen.
            </Empty>
          )}
          {tab === "comments" &&
            (comments.some((c) => c.userId === user.id) ? (
              comments
                .filter((c) => c.userId === user.id)
                .map((c) => (
                  <article key={c.id} className="panel">
                    <p>{c.text}</p>
                    <Link to="/comunidad" className="text-link">
                      Ver conversación
                    </Link>
                  </article>
                ))
            ) : (
              <Empty icon={MessageSquare} title="Todo empieza con una idea">
                Tus comentarios aparecerán aquí cuando participes en la
                comunidad.
              </Empty>
            ))}
          {tab === "settings" && (
            <form
              className="panel profile-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setUser({
                  ...user,
                  name: f.get("name").trim(),
                  bio: f.get("bio"),
                });
                notify("Perfil actualizado");
              }}
            >
              <label>
                Nombre
                <input
                  name="name"
                  required
                  pattern=".*\S.*"
                  maxLength={60}
                  defaultValue={user.name}
                />
              </label>
              <label>
                Acerca de ti
                <textarea
                  name="bio"
                  maxLength={350}
                  defaultValue={user.bio}
                  placeholder="¿Qué despierta tu curiosidad?"
                />
              </label>
              <button className="btn primary">Guardar cambios</button>
            </form>
          )}
        </section>
        <aside className="panel profile-card">
          <div className="avatar large">{user.name[0].toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p className="break">{user.email}</p>
          <span className="pill">PERFIL LOCAL</span>
          <p>{user.bio || "Una mente curiosa, muchas posibilidades."}</p>
          <button
            className="text-link"
            onClick={() => {
              setUser(null);
              nav("/");
            }}
          >
            <LogOut size={17} /> Salir del perfil
          </button>
        </aside>
      </div>
    </div>
  );
}
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const names = {
      "/": "Inicio",
      "/revistas": "Revistas",
      "/comunidad": "Comunidad",
      "/nosotros": "Nosotros",
      "/acceso": "Mi cuenta",
      "/perfil": "Mi perfil",
      "/admin": "Estudio editorial",
      "/lector": "Lector",
    };
    document.title = (names[pathname] || "Ingeniería Y") + " — Ingeniería Y";
  }, [pathname]);
  return null;
}
function Reader() {
  const { drafts } = useContext(Context),
    draft = drafts.find(
      (d) =>
        d.id === new URLSearchParams(window.location.search).get("borrador"),
    );
  return (
    <div className="reader">
      <div className="reader-toolbar">
        <Link to={draft ? "/admin" : "/revistas"} className="text-link">
          <ChevronLeft size={18} />
          {draft ? "Estudio editorial" : "Biblioteca"}
        </Link>
        <span>{draft?.title || "Lector de revistas"}</span>
      </div>
      {draft ? (
        <Suspense fallback={<div className="empty">Preparando el lector…</div>}>
          <PdfViewer draft={draft} />
        </Suspense>
      ) : (
        <div className="shell">
          <Empty
            icon={BookOpen}
            title="Cada gran lectura tiene un comienzo"
            action={
              <Link className="btn primary" to="/revistas">
                Volver a la biblioteca
              </Link>
            }
          >
            Aún no hay una revista publicada para abrir. Cuando una edición esté
            disponible, podrás leerla aquí.
          </Empty>
        </div>
      )}
    </div>
  );
}
function Admin() {
  const { drafts, setDrafts, comments, setComments, notify } =
      useContext(Context),
    [tab, setTab] = useState("overview"),
    [form, setForm] = useState(false),
    [file, setFile] = useState(null),
    [error, setError] = useState("");
  function add(e) {
    e.preventDefault();
    if (!file) {
      setError("Selecciona un archivo PDF.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Solo se admiten archivos PDF.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("El PDF debe pesar menos de 50 MB.");
      return;
    }
    const f = new FormData(e.currentTarget);
    setDrafts([
      ...drafts,
      {
        id: crypto.randomUUID(),
        title: f.get("title").trim(),
        description: f.get("description"),
        topic: f.get("topic"),
        url: URL.createObjectURL(file),
      },
    ]);
    setForm(false);
    setFile(null);
    notify("Borrador creado para esta sesión. No está publicado.");
  }
  return (
    <div className="shell inner">
      <div className="admin-heading">
        <PageTitle
          label="ESTUDIO EDITORIAL"
          title={
            <>
              Detrás de las <em>ideas.</em>
            </>
          }
          description="Prepara ediciones y explora las herramientas de administración."
        />
        <span className="pill">DEMOSTRACIÓN PÚBLICA</span>
      </div>
      <div className="note">
        <Settings size={21} />
        <p>
          Panel de vista previa sin permisos reales. Los PDF solo se abren en tu
          dispositivo durante esta sesión; no se suben ni se publican. La
          gestión real de administradores se habilitará con el servidor.
        </p>
      </div>
      <div className="admin-layout">
        <aside className="admin-nav">
          {[
            ["overview", LayoutDashboard, "Resumen"],
            ["editions", BookOpen, "Ediciones"],
            ["comments", MessageSquare, "Comentarios"],
            ["users", Users, "Usuarios"],
          ].map(([id, Icon, t]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => {
                setTab(id);
                setForm(false);
              }}
            >
              <Icon size={19} />
              {t}
            </button>
          ))}
          <Link to="/">
            Ver sitio <Globe size={18} />
          </Link>
        </aside>
        <section>
          {tab === "overview" && (
            <>
              <div className="stats">
                {[
                  ["Ediciones publicadas", 0],
                  ["Borradores locales", drafts.length],
                  ["Comentarios locales", comments.length],
                ].map(([t, n]) => (
                  <div className="panel" key={t}>
                    <span>{t}</span>
                    <strong>{n.toString().padStart(2, "0")}</strong>
                  </div>
                ))}
              </div>
              <div className="panel welcome-admin">
                <Sparkles size={28} />
                <h2>
                  El próximo capítulo
                  <br />
                  empieza aquí.
                </h2>
                <p>
                  Prepara tu primera edición y comprueba cómo se verá en el
                  lector antes de conectar la publicación.
                </p>
                <button
                  className="btn primary"
                  onClick={() => {
                    setTab("editions");
                    setForm(true);
                  }}
                >
                  Preparar un borrador <Plus size={18} />
                </button>
              </div>
            </>
          )}
          {tab === "editions" && (
            <>
              <div className="section-head compact">
                <h3>Ediciones</h3>
                <button
                  className="btn primary"
                  onClick={() => {
                    setForm(!form);
                    setError("");
                  }}
                >
                  {form ? "Cerrar formulario" : "Nuevo borrador"}
                  {form ? <X size={17} /> : <Plus size={17} />}
                </button>
              </div>
              {form && (
                <form onSubmit={add} className="panel profile-form">
                  <h3>Preparar una edición</h3>
                  <label>
                    Título
                    <input
                      name="title"
                      required
                      pattern=".*\S.*"
                      maxLength={160}
                      placeholder="Título de la edición"
                    />
                  </label>
                  <label>
                    Descripción
                    <textarea
                      name="description"
                      maxLength={1000}
                      placeholder="¿Qué encontrará el lector?"
                    />
                  </label>
                  <label>
                    Tema
                    <select name="topic">
                      {topics.map(([t]) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="upload-zone">
                    <UploadCloud size={30} />
                    <strong>
                      {file ? file.name : "Selecciona el PDF de la revista"}
                    </strong>
                    <small>PDF · Máximo 50 MB · Solo vista previa local</small>
                    <input
                      aria-label="Archivo PDF"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => {
                        setFile(e.target.files[0] || null);
                        setError("");
                      }}
                    />
                  </label>
                  {error && (
                    <p role="alert" className="error">
                      {error}
                    </p>
                  )}
                  <button className="btn primary">
                    Guardar borrador local
                  </button>
                </form>
              )}
              {!drafts.length && !form ? (
                <Empty icon={FileText} title="Un lienzo en blanco">
                  Todavía no hay ediciones. Prepara un borrador para probar el
                  lector en línea.
                </Empty>
              ) : (
                drafts.map((d) => (
                  <div className="panel draft" key={d.id}>
                    <div className="draft-icon">
                      <FileText size={26} />
                    </div>
                    <div>
                      <h3>{d.title}</h3>
                      <small>{d.topic} · Borrador de esta sesión</small>
                      <p>{d.description}</p>
                    </div>
                    <Link className="btn light" to={"/lector?borrador=" + d.id}>
                      Vista previa
                    </Link>
                    <button
                      className="icon-btn"
                      aria-label={"Eliminar " + d.title}
                      onClick={() => {
                        URL.revokeObjectURL(d.url);
                        setDrafts(drafts.filter((x) => x.id !== d.id));
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
          {tab === "comments" && (
            <>
              <h3>Moderación de comentarios locales</h3>
              {!comments.length ? (
                <Empty icon={MessageSquare} title="Todo está en calma">
                  Aquí aparecerán los comentarios de demostración de este
                  navegador.
                </Empty>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="panel comment">
                    <div>
                      <strong>{c.name}</strong>
                      <p>{c.text}</p>
                    </div>
                    <button
                      className="icon-btn"
                      aria-label="Eliminar comentario local"
                      onClick={() => {
                        setComments(comments.filter((x) => x.id !== c.id));
                        notify("Comentario local eliminado");
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
          {tab === "users" && <UserManagement />}
        </section>
      </div>
    </div>
  );
}
function UserManagement() {
  const { user } = useContext(Context),
    [query, setQuery] = useState("");
  const matches =
    user &&
    [user.name, user.email].some((v) =>
      v.toLowerCase().includes(query.toLowerCase()),
    );
  return (
    <>
      <h3>Gestión de usuarios</h3>
      <p className="admin-description">
        Explora la vista de usuarios con el perfil local de este navegador.
      </p>
      <label className="search user-search">
        <Search size={19} />
        <input
          aria-label="Buscar usuarios"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo…"
        />
      </label>
      {matches ? (
        <div className="user-table-wrap">
          <table className="user-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="user-cell">
                    <span className="avatar">{user.name[0].toUpperCase()}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                </td>
                <td>Lector</td>
                <td>
                  <span className="pill">PERFIL LOCAL</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          icon={Users}
          title={
            query ? "Sin coincidencias" : "Las personas hacen la comunidad"
          }
        >
          {query
            ? "No se encontró un perfil local para esta búsqueda."
            : "Los perfiles aparecerán aquí cuando crees uno de demostración en este navegador."}
        </Empty>
      )}
      <div className="note">
        <Settings size={20} />
        <p>
          Los usuarios reales, la asignación de administradores y los permisos
          se habilitarán al conectar la autenticación y la base de datos. Un
          perfil local no concede acceso administrativo.
        </p>
      </div>
    </>
  );
}
function About() {
  return (
    <div className="shell inner about">
      <PageTitle
        label="SOBRE EL PROYECTO"
        title={
          <>
            Ingeniería.
            <br />Y todo lo que <em>conecta.</em>
          </>
        }
        description="Creemos en las preguntas que cruzan disciplinas y en las ideas que encuentran nuevas posibilidades."
      />
      <div className="about-manifesto">
        <span>✳</span>
        <h2>
          El conocimiento
          <br />
          se mueve mejor
          <br />
          cuando se comparte.
        </h2>
      </div>
      <div className="about-grid">
        <div>
          <div className="eyebrow">NUESTRA RAZÓN DE SER</div>
          <h2>Una mirada abierta.</h2>
          <p>
            Ingeniería Y es un proyecto editorial para explorar la relación
            entre ingeniería, ciencia, tecnología y creatividad. Un lugar donde
            una pregunta puede convertirse en el inicio de algo nuevo.
          </p>
          <p>
            Buscamos acercar distintas perspectivas y hacer del conocimiento una
            conversación accesible, curiosa y compartida.
          </p>
        </div>
        <div>
          <div className="eyebrow">LO QUE NOS MUEVE</div>
          {[
            [
              "Curiosidad",
              "Hacer preguntas. Explorar conexiones. Seguir aprendiendo.",
            ],
            ["Claridad", "Compartir ideas con contexto y un lenguaje cercano."],
            [
              "Colaboración",
              "Construir un espacio donde distintas voces encuentren lugar.",
            ],
          ].map(([t, d]) => (
            <div className="value" key={t}>
              <Plus size={21} />
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/comunidad" className="btn primary">
        Forma parte de la conversación <Users size={18} />
      </Link>
    </div>
  );
}
function NotFound() {
  return (
    <div className="shell inner">
      <Empty
        title="Esta página aún no tiene una historia"
        action={
          <Link to="/" className="btn primary">
            Volver al inicio
          </Link>
        }
      >
        La dirección que buscas no existe. Hay otras ideas por descubrir.
      </Empty>
    </div>
  );
}
function Footer() {
  return (
    <footer className="shell">
      <div className="footer-top">
        <div>
          <Link to="/" className="brand">
            ingeniería<span>y</span>
          </Link>
          <p>
            Para quienes nunca dejan
            <br />
            de hacerse preguntas.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORA</span>
          <Link to="/revistas">Revistas</Link>
          <Link to="/comunidad">Comunidad</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>
        <div>
          <span className="eyebrow">TU ESPACIO</span>
          <Link to="/perfil">Mi perfil</Link>
          <Link to="/lector">Lector en línea</Link>
          <Link to="/admin">Estudio editorial · demo</Link>
        </div>
        <div className="footer-statement">
          La curiosidad
          <br />
          es solo el <em>comienzo.</em>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Ingeniería Y. Todos los derechos
          reservados.
        </span>
        <span>HECHO DE IDEAS. CONECTADO POR PERSONAS.</span>
      </div>
    </footer>
  );
}
createRoot(document.getElementById("root")).render(<App />);
