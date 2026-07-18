"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";

type Props = { id: string };

export default function ObsButton({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // controla si el modal está montado
  const [isOpen, setIsOpen] = useState(false);   // controla estado activo (clases)
  const [obs, setObs] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const ANIM_DURATION = 300; // ms -> coincide con las clases duration-300

  // Abrir modal: fetch y animación de entrada
  const handleClick = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown" }));
        alert(`Error: ${err.error ?? res.status}`);
        return;
      }
      const data = await res.json();
      const fetchedObs = data.obs ?? data.observaciones ?? "Sin observaciones";
      setObs(String(fetchedObs));

      // Montar y activar transición
      setMounted(true);
      // next frame para que las clases de entrada se apliquen correctamente
      requestAnimationFrame(() => setIsOpen(true));
      // focus en el botón cerrar cuando abra
      setTimeout(() => closeBtnRef.current?.focus(), ANIM_DURATION);
    } catch (err) {
      console.error(err);
      alert("Error al obtener observaciones");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal con animación de salida
  const close = () => {
    setIsOpen(false); // aplica clases de salida
    // esperar a que termine la animación y desmontar
    setTimeout(() => {
      setMounted(false);
      setObs(null);
    }, ANIM_DURATION);
  };

  // cerrar con ESC
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted]);

  // bloquear scroll del body mientras está montado
  useEffect(() => {
    if (mounted) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mounted]);

  const onOverlayMouseDown = (e: React.MouseEvent) => {
    // si clicas en el overlay (fondo) cerramos
    if (e.target === e.currentTarget) close();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-purple-500 transition-colors"
        aria-label="Ver observaciones"
        disabled={loading}
      >
        {loading ? "..." : <MdOutlineRemoveRedEye className="w-5 h-5" />}
      </button>

      {mounted && (
        /* Overlay: fade in/out */
        <div
          onMouseDown={onOverlayMouseDown}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-modal="true"
          role="dialog"
        >
          {/* Panel: pop/fade */}
          <div
            className={`bg-white max-w-lg w-full mx-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            }`}
            role="document"
          >
            <div className="p-4 flex items-start justify-between bg-gray-800 text-white">
              <h3 id="modal-title" className="text-lg font-semibold">
                Observaciones
              </h3>
              <button
                ref={closeBtnRef}
                onClick={close}
                className="ml-4 text-gray-500 hover:text-gray-800"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{obs}</p>
            </div>

            <div className="p-4 flex justify-end">
              <button onClick={close} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}