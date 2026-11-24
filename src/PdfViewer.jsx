import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize,
  Moon,
  Sun,
  Bookmark,
  Check,
} from "lucide-react";
GlobalWorkerOptions.workerSrc = workerUrl;
export default function PdfViewer({ draft }) {
  const [pdf, setPdf] = useState(null),
    [page, setPage] = useState(1),
    [zoom, setZoom] = useState(1),
    [night, setNight] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [saved, setSaved] = useState(false);
  const canvas = useRef(null),
    host = useRef(null),
    [width, setWidth] = useState(800);
  useEffect(() => {
    let alive = true;
    setBusy(true);
    const task = getDocument(draft.url);
    task.promise
      .then((doc) => {
        if (alive) {
          setPdf(doc);
          setPage(1);
        }
      })
      .catch(() => {
        if (alive) {
          setError(
            "No pudimos abrir este PDF. Comprueba que no esté dañado o protegido con contraseña.",
          );
          setBusy(false);
        }
      });
    return () => {
      alive = false;
      task.destroy();
    };
  }, [draft.url]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!pdf) return;
    let active = true,
      renderTask;
    setBusy(true);
    pdf
      .getPage(page)
      .then((p) => {
        if (!active) return;
        const base = p.getViewport({ scale: 1 }),
          scale = Math.min((width - 48) / base.width, 1.5) * zoom,
          viewport = p.getViewport({ scale }),
          ratio = Math.min(window.devicePixelRatio || 1, 2),
          c = canvas.current;
        c.width = viewport.width * ratio;
        c.height = viewport.height * ratio;
        c.style.width = viewport.width + "px";
        c.style.height = viewport.height + "px";
        renderTask = p.render({
          canvasContext: c.getContext("2d"),
          viewport,
          transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0],
        });
        return renderTask.promise;
      })
      .then(() => {
        if (active) setBusy(false);
      })
      .catch((e) => {
        if (active && e.name !== "RenderingCancelledException") {
          setError(
            "No pudimos mostrar esta página. Prueba abriendo el PDF original.",
          );
          setBusy(false);
        }
      });
    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [pdf, page, zoom, width]);
  return (
    <div className={"pdf-viewer " + (night ? "night" : "")}>
      <div className="reader-notice">
        Borrador local · No publicado ·{" "}
        {pdf
          ? pdf.numPages + (pdf.numPages === 1 ? " página" : " páginas")
          : "Preparando documento"}{" "}
        · Disponible durante esta sesión
      </div>
      <div className="pdf-actions">
        <span>{draft.topic}</span>
        <button className="text-link" onClick={() => setSaved(!saved)}>
          {saved ? <Check size={17} /> : <Bookmark size={17} />}{" "}
          {saved ? "Marcado en esta sesión" : "Marcar lectura"}
        </button>
        <button
          className="icon-btn"
          aria-label="Cambiar fondo del lector"
          onClick={() => setNight(!night)}
        >
          {night ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button
          className="icon-btn"
          aria-label="Pantalla completa"
          onClick={() => host.current.parentElement.requestFullscreen?.()}
        >
          <Maximize size={19} />
        </button>
      </div>
      <div className="pdf-stage" ref={host}>
        {busy && !error && (
          <div role="status" className="pdf-loading">
            Preparando tu lectura…
          </div>
        )}
        {error ? (
          <div className="panel" role="alert">
            {error}
          </div>
        ) : (
          <canvas
            ref={canvas}
            role="img"
            aria-label={"Página " + page + " de " + draft.title}
          />
        )}
      </div>
      <div className="reader-bottom">
        <button
          className="icon-btn"
          aria-label="Página anterior"
          disabled={!pdf || page <= 1 || busy}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft />
        </button>
        <label>
          Página{" "}
          <input
            type="number"
            aria-label="Ir a la página"
            min="1"
            max={pdf?.numPages || 1}
            value={page}
            disabled={!pdf}
            onChange={(e) =>
              setPage(
                Math.max(
                  1,
                  Math.min(pdf?.numPages || 1, Number(e.target.value) || 1),
                ),
              )
            }
          />{" "}
          de {pdf?.numPages || "—"}
        </label>
        <button
          className="icon-btn"
          aria-label="Página siguiente"
          disabled={!pdf || page >= pdf.numPages || busy}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight />
        </button>
        <select
          aria-label="Zoom"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        >
          <option value="0.75">75 %</option>
          <option value="1">Ajustar ancho</option>
          <option value="1.25">125 %</option>
          <option value="1.5">150 %</option>
          <option value="2">200 %</option>
        </select>
        <a
          className="text-link"
          href={draft.url}
          target="_blank"
          rel="noreferrer"
        >
          Abrir PDF <ExternalLink size={16} />
        </a>
      </div>
      <p className="reader-accessibility">
        Para buscar texto, usar un lector de pantalla o descargar el documento,
        abre el PDF original.
      </p>
    </div>
  );
}
