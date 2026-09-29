import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { Toaster } from "sonner";
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { SiteContentProvider } from "./site-content";
import "./App.css";

class ErrorBoundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{ background: "#030712", color: "#e2e8f0", minHeight: "100vh", padding: 40, fontFamily: "sans-serif" }}>
          Something broke on this page — a refresh usually fixes it.
          <pre style={{ color: "#00F0FF", whiteSpace: "pre-wrap", marginTop: 16 }}>{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Tracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    let sessionId = sessionStorage.getItem("sps-sid");
    if (!sessionId) {
      sessionId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("sps-sid", sessionId);
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        sessionId,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SiteContentProvider>
        <ScrollManager />
        <Tracker />
        <Cursor />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        </SiteContentProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0B0F19",
              border: "1px solid rgba(0,240,255,0.25)",
              color: "#e2e8f0",
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
