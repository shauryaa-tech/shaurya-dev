import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { mergeSite } from "./defaults";
import { applyTheme } from "./theme";

const SiteContent = createContext(null);

export function SiteContentProvider({ children }) {
  const [site, setSite] = useState(() => mergeSite(null));

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/content");
      if (!response.ok) return mergeSite(null);
      const data = await response.json();
      const next = mergeSite(data);
      setSite(next);
      return next;
    } catch {
      return mergeSite(null);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    applyTheme(site.theme);
    const name = site.profile?.name;
    if (name) document.title = `${name} - AI/ML Engineer`;
  }, [site]);

  return (
    <SiteContent.Provider value={{ site, reload }}>
      {children}
    </SiteContent.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContent);
}

export function authHeaders() {
  const token = localStorage.getItem("sps-admin-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
