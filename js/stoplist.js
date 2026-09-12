// ===== otdoner · стоп-лист =====
// Тағамдардың уақытша қолжетімсіз тізімі stopmenu панелінен келеді (Supabase).

const StopList = (() => {
  const cfg = window.OTDONER_CONFIG;
  let ids = new Set();

  const configured = () => Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && cfg.siteSlug);

  async function load() {
    if (!configured()) return ids;
    const base = cfg.supabaseUrl.replace(/\/$/, "");
    const url = `${base}/rest/v1/stop_items?select=item_id&site_slug=eq.${encodeURIComponent(cfg.siteSlug)}`;
    const res = await fetch(url, {
      headers: { apikey: cfg.supabaseAnonKey, Authorization: `Bearer ${cfg.supabaseAnonKey}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`stoplist ${res.status}`);
    const rows = await res.json();
    ids = new Set(rows.map((r) => String(r.item_id)));
    return ids;
  }

  return {
    load,
    configured,
    has: (id) => ids.has(String(id)),
    get ids() { return ids; },
  };
})();
