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
  ChevronRight,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import "./App.css";

const serviceSlides = [
  {
    title: "Transforma tu baño",
    description: "Diseño moderno, transparencia y acabados para un espacio más elegante y funcional.",
    category: "DIVISIONES DE BAÑO",
    image: KIMM_IMAGES.projectBathroom,
  },
  {
    title: "Deja entrar la luz",
    description: "Ventanas y puertas que conectan tus espacios y aprovechan la luz natural.",
    category: "VENTANAS Y PUERTAS",
    image: KIMM_IMAGES.aluminum,
  },
  {
    title: "Dale amplitud a tus espacios",
    description: "Espejos decorativos que reflejan luz y aportan carácter a cada ambiente.",
    category: "ESPEJOS DECORATIVOS",
    image: KIMM_IMAGES.glass,
  },
  {
    title: "Una fachada que destaca",
    description: "Soluciones de vidrio y aluminio para una imagen arquitectónica contemporánea.",
    category: "FACHADAS Y CERRAMIENTOS",
    image: KIMM_IMAGES.projectArchitecture,
  },
  {
    title: "Diseño en cada detalle",
    description: "Cuéntanos tu idea y recibe orientación para encontrar una solución a tu medida.",
    category: "ASESORÍA Y COTIZACIÓN",
    image: KIMM_IMAGES.projectResidential,
  },
];

const galleryProjects = [
  {
    id: 1,
    title: "División de baño",
    category: "Baños",
    image: KIMM_IMAGES.projectBathroom,
    alt: "Inspiración de diseño para baño contemporáneo",
  },
  {
    id: 2,
    title: "Ventanas y aluminio",
    category: "Ventanería",
    image: KIMM_IMAGES.aluminum,
    alt: "Inspiración de ventanería y acabados modernos",
  },
  {
    id: 3,
    title: "Espejos y espacios",
    category: "Espejos",
    image: KIMM_IMAGES.glass,
    alt: "Inspiración de diseño interior con superficies reflectantes",
  },
  {
    id: 4,
    title: "Arquitectura contemporánea",
    category: "Fachadas",
    image: KIMM_IMAGES.projectArchitecture,
    alt: "Inspiración arquitectónica para fachadas modernas",
  },
  {
    id: 5,
    title: "Ambientes residenciales",
    category: "Interiores",
    image: KIMM_IMAGES.projectResidential,
    alt: "Inspiración de diseño para espacios residenciales",
  },
  {
    id: 6,
    title: "Detalles para el baño",
    category: "Baños",
    image: KIMM_IMAGES.process,
    alt: "Inspiración de acabados y detalles de interiores",
  },
];

const galleryCategories = [
  "Todos",
  "Baños",
  "Ventanería",
  "Espejos",
  "Fachadas",
  "Interiores",
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeGalleryCategory, setActiveGalleryCategory] = useState("Todos");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % serviceSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);
  const [submitMessage, setSubmitMessage] = useState("");
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
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

    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const projectType = String(formData.get("projectType") ?? "");
    const location = String(formData.get("location") ?? "");
    const description = String(formData.get("message") ?? "").trim();
    const quantity = String(formData.get("quantity") ?? "").trim();
    const measurements = String(formData.get("measurements") ?? "").trim();
    const hasPhotos = formData
      .getAll("photos")
      .some((item) => item instanceof File && item.size > 0);

    const whatsappMessage = [
      "Hola KIMM, quiero cotizar un proyecto.",
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Trabajo: ${projectType}`,
      location ? `Ubicación: ${location}` : "",
      quantity ? `Cantidad aproximada: ${quantity}` : "",
      measurements ? `Medidas aproximadas: ${measurements}` : "",
      description ? `Descripción: ${description}` : "",
      hasPhotos ? "Tengo fotos de referencia para adjuntar en este chat." : "",
      "Por favor, asesórenme con opciones, acabados y cotización.",
    ].filter(Boolean).join("\n");

    const payload = {
      name,
      phone,
      projectType,
      location,
      message: whatsappMessage,
    };

    const apiUrl =
      import.meta.env.VITE_CONTACT_API_URL ?? "http://localhost:3107";

    setIsSubmitting(true);
    setSubmitMessage("");
    setWhatsAppUrl("");

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

      setWhatsAppUrl(buildWhatsAppUrl(whatsappMessage));
      setProjectDescription("");
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
            <a href="#inicio">Inicio</a>
            <a href="#cotizar">Cotizar</a>
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
        <section className="hero hero-carousel" id="inicio" aria-label="Servicios KIMM">
  {serviceSlides.map((slide, index) => (
    <div
      key={slide.category}
      className={`hero-slide ${index === activeSlide ? "is-active" : ""}`}
      aria-hidden={index !== activeSlide}
    >
      <img className="hero-slide-image" src={slide.image} alt="" />
      <div className="hero-slide-shade" />
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow light">
            {slide.category} · MEDELLÍN Y ÁREA METROPOLITANA
          </span>
          <h1>{slide.title}</h1>
          <p>{slide.description}</p>
          <div className="hero-actions">
            <SmartWhatsAppButton
              profile={projectProfile}
              className="button button-primary"
            >
              Cotizar por WhatsApp <ArrowRight size={18} />
            </SmartWhatsAppButton>
            <a className="button button-ghost" href="#cotizar">
              Solicitar asesoría <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  ))}

  <div className="hero-carousel-controls" aria-label="Elegir servicio">
    {serviceSlides.map((slide, index) => (
      <button
        key={slide.category}
        type="button"
        className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
        aria-label={`Ver ${slide.category.toLowerCase()}`}
        aria-current={index === activeSlide ? "true" : undefined}
        onClick={() => setActiveSlide(index)}
      />
    ))}
    <span>{String(activeSlide + 1).padStart(2, "0")} / 05</span>
  </div>
</section>

        <section className="section gallery-section" id="proyectos">
          <div className="container">
            <div className="gallery-heading">
              <div>
                <span className="eyebrow">ESPACIOS CON ESTILO</span>
                <h2>Inspiración para tu próximo proyecto</h2>
                <p>
                  Explora ideas en vidrio, aluminio y diseño interior.
                  Cuéntanos qué tienes en mente y te orientamos.
                </p>
              </div>
              <span className="gallery-count">
                {String(
                  galleryProjects.filter(
                    (project) =>
                      activeGalleryCategory === "Todos" ||
                      project.category === activeGalleryCategory
                  ).length
                ).padStart(2, "0")} referencias
              </span>
            </div>

            <div className="gallery-filters" aria-label="Filtrar referencias">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`gallery-filter ${
                    activeGalleryCategory === category ? "is-active" : ""
                  }`}
                  aria-pressed={activeGalleryCategory === category}
                  onClick={() => setActiveGalleryCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="gallery-grid">
              {galleryProjects
                .filter(
                  (project) =>
                    activeGalleryCategory === "Todos" ||
                    project.category === activeGalleryCategory
                )
                .map((project) => (
                  <article className="gallery-card" key={project.id}>
                    <div className="gallery-image-wrap">
                      <img
                        src={project.image}
                        alt={project.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="gallery-image-label">
                        REFERENCIA DE INSPIRACIÓN
                      </span>
                    </div>
                    <div className="gallery-card-copy">
                      <div>
                        <span className="gallery-card-category">
                          {project.category}
                        </span>
                        <h3>{project.title}</h3>
                      </div>
                      <a href="#cotizar" aria-label={`Cotizar ${project.title}`}>
                        <ArrowRight size={19} />
                      </a>
                    </div>
                  </article>
                ))}
            </div>

            <div className="gallery-footer">
              <p>¿Tienes una idea diferente? La convertimos en un plan de trabajo.</p>
              <a className="button button-primary" href="#cotizar">
                Cuéntanos tu proyecto <ArrowRight size={17} />
              </a>
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
                    <option value="" disabled>Selecciona el tipo de trabajo</option>
                    <option value="Ventanas">Ventanas</option>
                    <option value="Puertas">Puertas</option>
                    <option value="Ventanales">Ventanales</option>
                    <option value="Divisiones de baño">Divisiones de baño</option>
                    <option value="Barandas">Barandas</option>
                    <option value="Espejos">Espejos</option>
                    <option value="Otro proyecto">Otro proyecto</option>
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

              <div className="form-row">
                <label>
                  Cantidad aproximada
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ej. 3"
                  />
                </label>

                <label>
                  Medidas aproximadas
                  <input
                    name="measurements"
                    type="text"
                    placeholder="Ej. 1,20 m × 2,00 m"
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

              <label className="quote-photo-field">
                Fotos de referencia (opcional)
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                />
                <small>Si seleccionas fotos, recuerda adjuntarlas en el chat de WhatsApp.</small>
              </label>
              <button
                className="quote-whatsapp-button"
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

              {whatsAppUrl && (
                <a
                  className="quote-whatsapp-button"
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Continuar cotización por WhatsApp
                </a>
              )}

              <p className="form-disclaimer">
                Al enviar esta solicitud aceptas ser contactado para dar
                seguimiento a tu proyecto.
              </p>
            </form>
          </div>
        </section>


      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-compact-brand">
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
            <p>Soluciones en vidrio y aluminio para tu espacio.</p>
          </div>

          <div className="footer-compact-contact">
            <span>Medellín y área metropolitana</span>
            <a href="#cotizar">Solicitar cotización</a>
            <SmartWhatsAppButton
              profile={projectProfile}
              className="footer-smart-link"
            >
              Hablar por WhatsApp
            </SmartWhatsAppButton>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Vidrios y Aluminios KIMM</span>
        </div>
      </footer>
      <SmartQuote projectDescription={projectDescription} />
    </div>
  );
}

export default App;