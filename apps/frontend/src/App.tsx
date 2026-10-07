import { buildWhatsAppUrl, KIMM_WHATSAPP_MESSAGES } from "./config/contact";
import { analyzeProject } from "./intelligence/project-intelligence";
import { buildPromotionWhatsAppMessage } from "./intelligence/whatsapp-builder";
import { KIMM_IMAGES } from "./config/images";
import { SmartQuote } from "./components/SmartQuote";
import { SmartWhatsAppButton } from "./components/SmartWhatsAppButton";
import { loadProjectSession, saveProjectSession } from "./intelligence/session-memory";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  Ruler,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import "./App.css";

const references = [
  {
    title: "Vidrios",
    subtitle: "Soluciones que aportan luz, amplitud y diseño.",
    items: ["Vidrio templado", "Vidrio laminado", "Espejos", "Divisiones"],
    image:
      KIMM_IMAGES.glass,
  },
  {
    title: "Aluminios",
    subtitle: "Sistemas pensados para durar y transformar espacios.",
    items: ["Ventanas", "Puertas", "Divisiones", "Soluciones arquitectónicas"],
    image:
      KIMM_IMAGES.aluminum,
  },
];

const projects = [
  {
    category: "Residencial",
    title: "Espacios que respiran amplitud",
    image:
      KIMM_IMAGES.projectResidential,
  },
  {
    category: "Baños",
    title: "Divisiones con acabado limpio",
    image:
      KIMM_IMAGES.projectBathroom,
  },
  {
    category: "Arquitectura",
    title: "Diseño que conecta interior y exterior",
    image:
      KIMM_IMAGES.projectArchitecture,
  },
];

const process = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Cuéntanos tu proyecto",
    text: "Háblanos de lo que necesitas y nuestro equipo te orientará.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Medimos",
    text: "Revisamos el espacio y tomamos las medidas necesarias.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Fabricamos",
    text: "Preparamos cada solución con precisión y cuidado.",
  },
  {
    number: "04",
    icon: Check,
    title: "Instalamos",
    text: "Llevamos el proyecto a su resultado final.",
  },
];

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [projectDescription, setProjectDescription] = useState(() => loadProjectSession()?.description ?? "");

  const projectProfile = analyzeProject(projectDescription);

  useEffect(() => {
    if (projectDescription.trim()) {
      saveProjectSession(projectDescription, projectProfile);
    }
  }, [projectDescription]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      location: String(formData.get("location") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const apiUrl =
      import.meta.env.VITE_CONTACT_API_URL ?? "http://localhost:3107";

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.debug
            ? `${data?.message ?? "No fue posible enviar la solicitud."} | ${data.debug}`
            : data?.message ?? "No fue posible enviar la solicitud."
        );
      }

      setSubmitMessage(
        "¡Solicitud enviada! Nuestro equipo recibió tus datos y se pondrá en contacto contigo."
      );

      form.reset();
    } catch (error) {

      setSubmitMessage(
        error instanceof Error
          ? `Error real: ${error.message}`
          : "Error desconocido al enviar la solicitud."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="site">
      <header className="header">
        <div className="container header-inner">
          <a className="brand" href="#inicio">
            <img
              className="brand-logo"
              src="/kimm-logo.svg"
              alt="Vidrios y Aluminios KIMM"
            />
            <span>
              <strong>KIMM</strong>
              <small>VIDRIOS & ALUMINIOS</small>
            </span>
          </a>

          <nav className="nav">
            <a href="#referencias">Referencias</a>
            <a href="#proceso">Cómo trabajamos</a>
            <a href="#nosotros">Nosotros</a>
          </nav>

          <SmartWhatsAppButton
  profile={projectProfile}
  className="header-cta"
>
  Cotizar <ArrowRight size={16} />
</SmartWhatsAppButton>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-image" />
          <div className="hero-overlay" />

          <div className="container hero-content">
            <div className="hero-copy">
              <span className="eyebrow light">
                VIDRIOS & ALUMINIOS · MEDELLÍN
              </span>

              <h1>
                Diseño que
                <br />
                transforma
                <br />
                <em>espacios.</em>
              </h1>

              <p>
                Soluciones en vidrio y aluminio para hogares, baños,
                oficinas y proyectos arquitectónicos.
              </p>

              <div className="hero-actions">
                <SmartWhatsAppButton
  profile={projectProfile}
  className="button button-primary"
>
  Solicitar cotización <ArrowRight size={18} />
</SmartWhatsAppButton>

                <a className="button button-ghost" href="#referencias">
                  Ver proyectos <ChevronRight size={18} />
                </a>
              </div>
            </div>

            <div className="hero-proof">
              <div>
                <strong>01</strong>
                <span>Asesoría personalizada</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Fabricación a medida</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Instalación profesional</span>
              </div>
            </div>
          </div>
        </section>

                <section className="promo promo-exotic">
          <div className="container promo-exotic-inner">

            <div className="promo-offer">
              <div className="promo-kicker">
                <Sparkles size={16} />
                OFERTA ESPECIAL KIMM
              </div>

              <div className="promo-discount">
                <span>10%</span>
                <strong>DE DESCUENTO</strong>
              </div>

              <p className="promo-description">
                En cabinas de baño, espejos personalizados,
                ventanería, divisiones y otras soluciones KIMM.
              </p>

              <span className="promo-conditions">
                En proyectos seleccionados · Aplican condiciones
              </span>

              <a
                className="promo-button"
                href={buildWhatsAppUrl(buildPromotionWhatsAppMessage(projectProfile))}
                target="_blank"
                rel="noreferrer"
              >
                Cotizar con el 10% <ArrowRight size={17} />
              </a>
            </div>

            <div className="promo-gift-card">

              <div className="promo-gift-copy">
                <span className="promo-gift-tag">
                  REGALO KIMM
                </span>

                <h3>
                  Reposa toallas
                  <br />
                  en aluminio
                </h3>

                <p>
                  Un detalle funcional para darle
                  un acabado especial a tu baño.
                </p>

                <div className="promo-finishes">
                  <span>
                    <i className="finish-dot finish-black" />
                    Negro mate
                  </span>

                  <span>
                    <i className="finish-dot finish-gray" />
                    Gris
                  </span>

                  <span>
                    <i className="finish-dot finish-silver" />
                    Otros acabados
                  </span>
                </div>

                <a
                  className="promo-gift-link"
                  href={buildWhatsAppUrl(KIMM_WHATSAPP_MESSAGES.gift)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero mi regalo <ArrowRight size={16} />
                </a>
              </div>

              <div className="promo-gift-image">
                <img
                  src="/kimm-reposa-toallas.webp"
                  alt="Reposa toallas de aluminio"
                />
                <span>DETALLE DE PROMOCIÓN</span>
              </div>

            </div>

          </div>
        </section>

        <section className="section references">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">NUESTRAS SOLUCIONES</span>
                <h2>Materiales que se convierten en espacios.</h2>
              </div>

              <p>
                Explora algunas de las soluciones que podemos llevar a tu
                proyecto con diseño, precisión y funcionalidad.
              </p>
            </div>

            <div className="reference-grid">
              {references.map((reference) => (
                <article className="reference-card" key={reference.title}>
                  <img src={reference.image} alt={reference.title} />

                  <div className="reference-content">
                    <span className="card-kicker">KIMM / {reference.title}</span>
                    <h3>{reference.title}</h3>
                    <p>{reference.subtitle}</p>

                    <ul>
                      {reference.items.map((item) => (
                        <li key={item}>
                          <Check size={15} />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <SmartWhatsAppButton
  profile={projectProfile}
  className="text-link"
>
  Consultar solución <ArrowRight size={16} />
</SmartWhatsAppButton>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section dark-section" id="referencias">
          <div className="container">
            <div className="section-heading dark-heading">
              <div>
                <span className="eyebrow light">REFERENCIAS</span>
                <h2>Ideas que ya tomaron forma.</h2>
              </div>

              <p>
                Una referencia visual del tipo de espacios que podemos
                transformar.
              </p>
            </div>

            <div className="project-grid">
              {projects.map((project, index) => (
                <article
                  className={`project-card project-${index + 1}`}
                  key={project.title}
                >
                  <img src={project.image} alt={project.title} />

                  <div className="project-overlay">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>
                    <SmartWhatsAppButton
  profile={projectProfile}
  className="text-link"
>
  Quiero algo similar <ArrowRight size={16} />
</SmartWhatsAppButton>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section action-section">
          <div className="container action-grid">
            <div className="action-copy">
              <span className="eyebrow">KIMM EN ACCIÓN</span>
              <h2>Del espacio real al resultado final.</h2>

              <p>
                Queremos mostrarte cómo trabajamos: medición, fabricación,
                instalación y transformación.
              </p>

              <SmartWhatsAppButton
  profile={projectProfile}
  className="text-link"
>
  Preguntar por un proyecto <ArrowRight size={17} />
</SmartWhatsAppButton>
            </div>

            <div className="video-card">
                <img
                  src={KIMM_IMAGES.process}
                  alt="Referencia visual de arquitectura y acabados"
                />

                <div className="video-shade" />

                <div className="video-label">
                  <span>KIMM EN ACCIÓN</span>
                  <strong>Así trabajamos</strong>
                  <small>Medición · Fabricación · Instalación · Resultado</small>
                </div>
              </div>
            </div>
          </section>

        <section className="section process-section" id="proceso">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">NUESTRO PROCESO</span>
                <h2>Simple para ti. Preciso para nosotros.</h2>
              </div>

              <p>
                Nos encargamos del proceso para que tú puedas concentrarte
                en disfrutar el resultado.
              </p>
            </div>

            <div className="process-grid">
              {process.map((item) => {
                const Icon = item.icon;

                return (
                  <article className="process-card" key={item.number}>
                    <span className="process-number">{item.number}</span>
                    <Icon size={24} strokeWidth={1.6} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="trust-section" id="nosotros">
          <div className="container trust-grid">
            <div>
              <span className="eyebrow">KIMM</span>
              <h2>
                Una solución bien hecha comienza escuchando tu proyecto.
              </h2>
            </div>

            <div className="trust-content">
              <p>
                Somos una empresa enfocada en soluciones de vidrio y aluminio
                para espacios donde el diseño, la funcionalidad y el acabado
                importan.
              </p>

              <div className="trust-points">
                <span>
                  <ShieldCheck size={18} />
                  Atención personalizada
                </span>

                <span>
                  <ShieldCheck size={18} />
                  Soluciones a medida
                </span>

                <span>
                  <ShieldCheck size={18} />
                  Acompañamiento profesional
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section quote-section" id="cotizar">
          <div className="container quote-grid">
            <div className="quote-intro">
              <span className="eyebrow">COTIZACIÓN</span>

              <h2>
                Cuéntanos
                <br />
                sobre tu
                <br />
                proyecto.
              </h2>

              <p>
                Déjanos tus datos y una breve descripción. Más adelante
                conectaremos esta solicitud directamente con el equipo KIMM.
              </p>

              <div className="quote-note">
                <ShieldCheck size={18} />
                <span>
                  Tus datos serán utilizados únicamente para atender tu
                  solicitud.
                </span>
              </div>
            </div>

            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Nombre
                  <input
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label>
                  Teléfono
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Tu número"
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Tipo de proyecto
                  <select name="projectType" defaultValue="" required>
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="oficina">Oficina</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>

                <label>
                  Ciudad / sector del proyecto
                  <input
                    name="location"
                    type="text"
                    placeholder="Ej. Medellín, Envigado..."
                  />
                </label>
              </div>

              <label>
                Cuéntanos qué necesitas
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Describe brevemente tu proyecto..."
                  value={projectDescription}
                  onChange={(event) => setProjectDescription(event.target.value)}
                  required
                />
                {projectDescription.trim() && (                  <div className="smart-quote-detected">
                    <div className="smart-quote-detected-head">
                      <span>ANALISIS KIMM</span>
                      <strong>{projectProfile.label}</strong>
                    </div>

                    <div className="smart-quote-data">
                      <span>
                        <small>Contexto</small>
                        {projectProfile.contextLabel}
                      </span>

                      <span>
                        <small>Cantidad</small>
                        {projectProfile.quantity !== null
                          ? projectProfile.quantity
                          : "Por definir"}
                      </span>

                      <span>
                        <small>Medidas</small>
                        {projectProfile.dimensions ?? "Por definir"}
                      </span>

                      <span>
                        <small>Urgencia</small>
                        {projectProfile.urgencyLabel}
                      </span>
                    </div>

                    <p>
                      {projectProfile.hasMeasurements
                        ? "Tenemos medidas para preparar mejor la solicitud."
                        : "Puedes agregar medidas aproximadas para mejorar la cotizacion."}
                    </p>
                  </div>
                )}
              </label>

              <button
                className="button button-dark"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Solicitar cotización"}
                <Send size={17} />
              </button>

              {submitMessage && (
                <p className="form-status" role="status">
                  {submitMessage}
                </p>
              )}

              <p className="form-disclaimer">
                Al enviar esta solicitud aceptas ser contactado para dar
                seguimiento a tu proyecto.
              </p>
            </form>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta-bg" />

          <div className="container final-cta-content">
            <span className="eyebrow light">¿TIENES UN PROYECTO?</span>

            <h2>Hagámoslo realidad.</h2>

            <p>
              Cuéntanos qué tienes en mente y encontremos juntos la mejor
              solución.
            </p>

            <SmartWhatsAppButton
              profile={projectProfile}
              className="button button-primary"
            >
              Solicitar cotización
            </SmartWhatsAppButton>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#inicio">
              <img
              className="brand-logo"
              src="/kimm-logo.svg"
              alt="Vidrios y Aluminios KIMM"
            />

              <span>
                <strong>KIMM</strong>
                <small>VIDRIOS & ALUMINIOS</small>
              </span>
            </a>

            <p>
              Soluciones en vidrio y aluminio para espacios que inspiran.
            </p>
          </div>

          <div>
            <span className="footer-title">Navegación</span>
            <a href="#referencias">Referencias</a>
            <a href="#proceso">Proceso</a>
            <SmartWhatsAppButton
  profile={projectProfile}
  className="footer-smart-link"
>
  Cotizar
</SmartWhatsAppButton>
          </div>

          <div>
            <span className="footer-title">Contacto</span>
            <span>Medellín & Área Metropolitana</span>
            <SmartWhatsAppButton
  profile={projectProfile}
  className="footer-smart-link"
>
  Solicitar cotización
</SmartWhatsAppButton>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Vidrios y Aluminios KIMM</span>
          <span>Diseño · Precisión · Arquitectura</span>
        </div>
      </footer>
      <SmartQuote projectDescription={projectDescription} />
    </div>
  );
}

export default App;