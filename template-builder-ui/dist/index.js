import { jsx as e, Fragment as M, jsxs as r } from "react/jsx-runtime";
import Te, { useRef as ye, useState as L, useEffect as D, useMemo as Tt, useCallback as Ce } from "react";
import We from "axios";
import { useNavigate as qe, useParams as St, Routes as It, Route as we, Navigate as Pt } from "react-router-dom";
import * as B from "@ant-design/icons";
import { FileImageOutlined as At, LayoutOutlined as Ke, BgColorsOutlined as Ee, CodeOutlined as ce, PlusOutlined as Et, MoreOutlined as zt, EditOutlined as Bt, CopyOutlined as Ze, PoweroffOutlined as Rt, DeleteOutlined as Ot, AppstoreOutlined as je, ImportOutlined as Le, BorderOutlined as Qe, FontSizeOutlined as $t, DollarOutlined as _t, LineOutlined as Wt, PictureFilled as jt, HeartOutlined as Lt, StarOutlined as Mt, EyeOutlined as Ft, ZoomOutOutlined as Vt, ZoomInOutlined as Ht, ArrowLeftOutlined as Gt, SaveOutlined as Yt } from "@ant-design/icons";
import { Typography as de, Collapse as Ue, Drawer as Xt, Tabs as De, Input as pe, Space as le, Button as G, message as X, Tag as Ne, Layout as ze, Row as Jt, Col as Me, Card as Se, Skeleton as qt, Alert as Kt, Empty as Zt, Modal as et, Dropdown as Qt, Tooltip as ae, Divider as ke, Switch as Ut, Spin as Dt } from "antd";
import { TemplateProvider as Nt, ScrollableContainer as ei, Post as Fe } from "@directo/template-builder/react";
import { create as ti } from "zustand";
let Ie = null, xe = null, ve = null;
function ii(t) {
  Ie = t, xe = We.create({
    baseURL: t.templateApiBaseUrl,
    headers: { "Content-Type": "application/json" }
  }), ve = We.create({
    baseURL: t.accountApiBaseUrl,
    headers: { "Content-Type": "application/json" }
  });
  const l = (s) => {
    s.interceptors.request.use((o) => {
      const c = t.getAuthToken();
      return c && (o.headers.Authorization = `Bearer ${c}`), o;
    });
  };
  l(xe), l(ve);
}
function ue() {
  if (!xe) throw new Error("[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.");
  return xe;
}
function tt() {
  if (!ve) throw new Error("[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.");
  return ve;
}
function li() {
  if (!Ie) throw new Error("[TemplateBuilder] Not initialized. Call initTemplateBuilder() first.");
  return Ie;
}
function Oi({ config: t, children: l }) {
  const s = ye(!1);
  return s.current || (ii(t), s.current = !0), /* @__PURE__ */ e(M, { children: l });
}
const q = {
  colors: {
    // Base / Brand
    primary: "#6366f1",
    // Indigo 500
    secondary: "#ec4899",
    // Pink 500
    accent: "#f59e0b",
    // Amber 500
    // Feedback
    success: "#22c55e",
    // Green 500
    warning: "#eab308",
    // Yellow 500
    error: "#ef4444",
    // Red 500
    info: "#3b82f6",
    // Blue 500
    // Neutrals / Grayscale
    white: "#ffffff",
    black: "#000000",
    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "gray-950": "#030712",
    // Interactions
    "primary-hover": "#4f46e5",
    "primary-active": "#4338ca",
    "secondary-hover": "#db2777",
    "secondary-active": "#be185d"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px"
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px"
  },
  typography: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "24px",
    xxl: "32px"
  }
}, it = "Directo Feed", lt = "Titulo do post aparece aqui", be = "Adicione uma legenda para visualizar como seu conteudo vai aparecer no feed.", rt = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="100%" stop-color="#f0f0f0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect x="280" y="165" width="640" height="390" rx="34" fill="#ffffff" stroke="#d9d9d9" stroke-width="12"/>
  <circle cx="470" cy="330" r="58" fill="#e5e7eb"/>
  <path d="M380 500l155-155 120 120 85-85 110 120H380z" fill="#d1d5db"/>
  <text x="600" y="680" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" fill="#9ca3af">Sua imagem aparecera aqui</text>
</svg>
`)}`, Pe = {
  post: {
    title: lt,
    description: be,
    legend: be,
    originalPrice: "R$ 89,90",
    price: "R$ 39,90",
    discount: "26",
    destinationUrl: "https://directo.ai",
    contentType: "image",
    url: rt,
    profile: {
      accountName: it,
      iconUrl: "",
      description: "Perfil exemplo para preview de templates."
    },
    customVariables: {}
  }
}, $i = (t) => {
  var s, o, c, a, p, m, d, $, v, y, h, R, b, E, i, I;
  if (!t)
    return Pe;
  const l = (s = t.customVariables) == null ? void 0 : s.profile;
  return {
    post: {
      title: t.contentTitle || ((o = t.qualifiers) == null ? void 0 : o.title) || ((c = t.qualifiers) == null ? void 0 : c.name) || lt,
      description: t.caption || be,
      legend: t.caption || be,
      originalPrice: ((a = t.customVariables) == null ? void 0 : a.originalPrice) || ((m = (p = t.customVariables) == null ? void 0 : p.price) == null ? void 0 : m.price_suggested) || "",
      price: (($ = (d = t.customVariables) == null ? void 0 : d.price) == null ? void 0 : $.price) || ((v = t.customVariables) == null ? void 0 : v.discountPrice) || "",
      discount: ((y = t.customVariables) == null ? void 0 : y.discountPrice) || ((b = (R = (h = t.customVariables) == null ? void 0 : h.price) == null ? void 0 : R.discount_percentage) == null ? void 0 : b.toString()) || "",
      destinationUrl: t.destinationUrl || Pe.post.destinationUrl,
      contentType: t.contentType || "image",
      url: t.imageUrl || rt,
      templateId: t.templateId || "",
      contentId: t.contentId || "",
      category: ((i = (E = t.qualifiers) == null ? void 0 : E.category) == null ? void 0 : i.join(" / ")) || "",
      brand: ((I = t.qualifiers) == null ? void 0 : I.brand) || "",
      profile: {
        accountName: (l == null ? void 0 : l.accountName) || t.accountName || it,
        iconUrl: (l == null ? void 0 : l.iconUrl) || "",
        description: (l == null ? void 0 : l.description) || ""
      },
      customVariables: {
        ...t.customVariables || {}
      }
    }
  };
}, Ae = "Directo Feed", oe = (t) => t && typeof t == "object" ? t : {}, _ = (t, l = "") => typeof t == "string" ? t : typeof t == "number" ? String(t) : l, N = (t) => {
  const l = _(t);
  return l || null;
}, Q = (t) => {
  if (typeof t == "boolean")
    return t;
}, ri = (t) => {
  if (typeof t == "number")
    return t;
  if (typeof t == "string") {
    const l = Number(t);
    return Number.isFinite(l) ? l : void 0;
  }
}, Ve = (t) => {
  const l = _(t).toLowerCase();
  if (l.includes("video"))
    return "video";
  if (l.includes("image"))
    return "image";
}, te = {
  contentId: "template-preview",
  id: "template-preview",
  title: "Chaleira Elétrica Cadence 1,8L Inox Control 127V CEL850",
  legend: "Oferta especial disponível por tempo limitado.",
  url: "https://cdn.luxuryloyalty.com/media/product/detail/9c3adfe3-00d6-4e1a-9e4f-be925067f2d6-1.jpg",
  mediaType: "image",
  originalPrice: "R$ 89,90",
  price: "R$ 39,90",
  discount: "26",
  destinationUrl: "https://directo.ai",
  templateId: "",
  profile: {
    accountName: Ae,
    iconUrl: "",
    description: "Perfil exemplo para preview de templates."
  },
  shop: {
    name: Ae,
    avatar: ""
  },
  customVariables: {}
}, He = (t) => ({
  templateId: t.id,
  name: t.title,
  active: t.active !== !1,
  slug: t.slug,
  data: t.template
}), ni = (t, l = "", s = "template-preview") => {
  if (!t)
    return {
      ...te,
      templateId: l,
      contentId: s,
      id: s
    };
  const o = oe(t.customVariables), c = oe(o.price), a = oe(t.profile), p = oe(o.profile), m = oe(t.shop), d = _(t.contentId) || _(t.id) || s, $ = _(a.accountName) || _(p.accountName) || _(o.storeName) || Ae, v = _(a.iconUrl) || _(p.iconUrl), y = _(t.title) || _(t.contentTitle) || te.title, h = _(t.legend) || _(t.caption) || _(t.description) || te.legend;
  return {
    ...te,
    ...t,
    id: _(t.id) || d,
    contentId: d,
    accountId: _(t.accountId),
    title: y,
    legend: h,
    url: _(t.url) || _(t.imageUrl) || te.url,
    mediaType: Ve(t.mediaType) || Ve(t.contentType) || te.mediaType,
    posterUrl: _(t.posterUrl),
    price: N(t.price) || N(o.discountPrice) || N(c.price),
    originalPrice: N(t.originalPrice) || N(o.originalPrice) || N(c.price_suggested) || N(c.original_price),
    discount: N(t.discount) || N(c.discount_percentage),
    destinationUrl: _(t.destinationUrl) || te.destinationUrl,
    templateId: _(t.templateId) || l || te.templateId,
    template: _(t.template),
    sponsored: Q(t.sponsored),
    liked: Q(t.liked),
    likeCount: ri(t.likeCount),
    favorite: Q(t.favorite),
    following: Q(t.following) ?? Q(t.isFollowing),
    isFollowing: Q(t.isFollowing) ?? Q(t.following),
    category: Array.isArray(t.category) ? t.category.join(" / ") : _(t.category),
    brand: _(t.brand),
    profile: {
      accountName: $,
      iconUrl: v,
      accountId: _(a.accountId) || _(t.accountId),
      description: _(a.description) || _(p.description),
      following: Q(a.following) ?? Q(a.isFollowing),
      isFollowing: Q(a.isFollowing) ?? Q(a.following)
    },
    shop: {
      name: _(m.name) || $,
      avatar: _(m.avatar) || v
    },
    customVariables: o
  };
};
function ai({
  template: t,
  templates: l = [],
  theme: s,
  dataContext: o,
  posts: c,
  scale: a = 1,
  width: p = "358px",
  height: m,
  wrapperStyle: d,
  canvasStyle: $,
  emptyState: v,
  scrollable: y = !1,
  orientation: h = "vertical",
  scrollableStyle: R
}) {
  const E = (l.length > 0 ? l : t ? [t] : []).map(He), i = t ? He(t) : E[0], g = (c && c.length > 0 ? c : Array.isArray(o == null ? void 0 : o.posts) ? o.posts : [
    (o == null ? void 0 : o.post) || Pe.post
  ]).map(
    (Y, Z) => ni(
      Y,
      (i == null ? void 0 : i.templateId) || "",
      `template-preview-${Z}`
    )
  ), z = y || g.length > 1, A = {
    width: "100%",
    height: "100%",
    gap: "16px",
    padding: "8px",
    boxSizing: "border-box",
    ...R
  };
  return E.length ? /* @__PURE__ */ e(
    "div",
    {
      style: {
        width: "100%",
        height: (d == null ? void 0 : d.height) || "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        position: "relative",
        ...d
      },
      children: /* @__PURE__ */ e(
        "div",
        {
          style: {
            width: p,
            height: m,
            transform: `scale(${a})`,
            transformOrigin: "center center",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            ...$
          },
          children: /* @__PURE__ */ e(
            Nt,
            {
              theme: s || q,
              templates: E,
              children: z ? /* @__PURE__ */ e(
                ei,
                {
                  orientation: h,
                  style: A,
                  children: g.map((Y) => /* @__PURE__ */ e(
                    Fe,
                    {
                      post: Y,
                      template: i
                    },
                    Y.contentId
                  ))
                }
              ) : /* @__PURE__ */ e(
                Fe,
                {
                  post: g[0],
                  template: i
                }
              )
            }
          )
        }
      )
    }
  ) : /* @__PURE__ */ e(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        minHeight: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#cbd5e1",
        ...d
      },
      children: v || /* @__PURE__ */ e(
        At,
        {
          style: { fontSize: 40, color: "#cbd5e1" }
        }
      )
    }
  );
}
const { Text: ge } = de, { Panel: oi } = Ue;
function nt({
  open: t,
  onClose: l,
  theme: s,
  onThemeChange: o,
  onSave: c,
  title: a = "Editar Tema"
}) {
  const [p, m] = L(s);
  D(() => {
    t && m(s);
  }, [t, s]);
  const d = (b, E) => {
    const i = { ...p, colors: { ...p.colors, [b]: E } };
    m(i);
  }, $ = (b, E) => {
    const i = { ...p, spacing: { ...p.spacing, [b]: E } };
    m(i);
  }, v = Tt(() => JSON.stringify(p) !== JSON.stringify(s), [p, s]), y = () => {
    c ? c(p) : o(p);
  }, h = (b, E) => {
    const i = p.colors[b];
    return /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-3 p-2 bg-gray-50 rounded-md border border-gray-100 mb-2", children: [
      /* @__PURE__ */ r("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "color",
            value: i,
            onChange: (I) => d(b, I.target.value),
            className: "w-5 h-5 rounded border border-gray-200 shrink-0 cursor-pointer p-0",
            style: { appearance: "none", WebkitAppearance: "none", background: "none" }
          }
        ),
        /* @__PURE__ */ r("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ e(ge, { className: "text-[10px] font-bold text-gray-700 leading-tight", children: E }),
          /* @__PURE__ */ e(ge, { className: "text-[8px] text-gray-400 font-mono italic", children: b })
        ] })
      ] }),
      /* @__PURE__ */ e(
        pe,
        {
          size: "small",
          value: i,
          onChange: (I) => d(b, I.target.value),
          className: "w-20 text-[10px] h-7 px-1.5 font-mono"
        }
      )
    ] }, b);
  }, R = (b, E, i, I) => /* @__PURE__ */ r(
    oi,
    {
      header: /* @__PURE__ */ e(ge, { strong: !0, className: "text-[11px] uppercase tracking-wider text-gray-500", children: E }),
      children: [
        I,
        i.map(([g, z]) => h(g, z))
      ]
    },
    b
  );
  return /* @__PURE__ */ e(
    Xt,
    {
      title: a,
      closeIcon: !1,
      placement: "right",
      onClose: l,
      open: t,
      width: 360,
      styles: {
        header: { padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
        body: { padding: "0 20px 20px" },
        footer: { padding: "12px 20px", borderTop: "1px solid #f1f5f9" }
      },
      footer: /* @__PURE__ */ r("div", { className: "flex justify-between items-center w-full", children: [
        /* @__PURE__ */ e(
          G,
          {
            icon: /* @__PURE__ */ e(ce, {}),
            onClick: () => {
              navigator.clipboard.writeText(JSON.stringify(p, null, 2)), X.success("Tema copiado para a área de transferência!");
            },
            children: "Exportar JSON"
          }
        ),
        /* @__PURE__ */ e(
          G,
          {
            type: "primary",
            onClick: y,
            disabled: !v,
            children: "Salvar"
          }
        )
      ] }),
      children: /* @__PURE__ */ e(
        De,
        {
          defaultActiveKey: "spacing",
          className: "theme-tabs",
          items: [
            {
              key: "spacing",
              label: /* @__PURE__ */ r(le, { size: "small", children: [
                /* @__PURE__ */ e(Ke, { className: "text-[12px]" }),
                /* @__PURE__ */ e("span", { className: "text-[12px] font-bold text-gray-700", children: "Espaços" })
              ] }),
              children: /* @__PURE__ */ e("div", { className: "pt-2 grid grid-cols-2 gap-x-4 gap-y-3", children: (p == null ? void 0 : p.spacing) && Object.entries(p.spacing).map(([b, E]) => /* @__PURE__ */ r("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ e(ge, { className: "text-[9px] font-bold uppercase text-gray-400", children: b }),
                /* @__PURE__ */ e(
                  pe,
                  {
                    size: "small",
                    value: E,
                    onChange: (i) => $(b, i.target.value),
                    className: "text-[10px] h-7 px-2"
                  }
                )
              ] }, b)) })
            },
            {
              key: "colors",
              label: /* @__PURE__ */ r(le, { size: "small", children: [
                /* @__PURE__ */ e(Ee, { className: "text-[12px]" }),
                /* @__PURE__ */ e("span", { className: "text-[12px] font-bold", children: "Cores" })
              ] }),
              children: /* @__PURE__ */ e("div", { children: /* @__PURE__ */ r(
                Ue,
                {
                  ghost: !0,
                  expandIconPosition: "end",
                  defaultActiveKey: ["base"],
                  className: "theme-collapse",
                  style: { padding: 0 },
                  children: [
                    R("base", "Marca", [
                      ["primary", "Primária"],
                      ["secondary", "Secundária"],
                      ["accent", "Destaque"]
                    ]),
                    R("feedback", "Feedback", [
                      ["success", "Sucesso"],
                      ["warning", "Aviso"],
                      ["error", "Erro"],
                      ["info", "Informação"]
                    ]),
                    R("neutrals", "Neutras", [
                      ["white", "White"],
                      ["black", "Black"],
                      ...["gray-50", "gray-100", "gray-200", "gray-300", "gray-400", "gray-500", "gray-600", "gray-700", "gray-800", "gray-900", "gray-950"].map(
                        (b) => [b, b.replace("gray-", "Nível ")]
                      )
                    ]),
                    R(
                      "interactions",
                      "Interações",
                      [
                        ["primary-hover", "Primary Hover"],
                        ["primary-active", "Primary Active"],
                        ["secondary-hover", "Secondary Hover"],
                        ["secondary-active", "Secondary Active"]
                      ],
                      /* @__PURE__ */ e(Ne, { color: "blue", className: "mb-3 text-[9px]", children: "Automático via CSS" })
                    )
                  ]
                }
              ) })
            }
          ]
        }
      )
    }
  );
}
function at(t) {
  return {
    id: t.templateId,
    title: t.name,
    slug: t.slug,
    active: t.active ?? !0,
    template: Array.isArray(t.data) ? t.data : []
  };
}
function ot(t) {
  return {
    templateId: t.id,
    name: t.title,
    slug: t.slug,
    active: t.active ?? !0,
    description: "",
    content: "",
    data: t.template
  };
}
function si(t) {
  return t ? t.colors ? {
    colors: { ...q.colors, ...t.colors },
    spacing: { ...q.spacing, ...t.spacing },
    borderRadius: { ...q.borderRadius, ...t.borderRadius },
    typography: { ...q.typography, ...t.typography }
  } : {
    ...q,
    colors: {
      ...q.colors,
      ...t.primaryColor && { primary: t.primaryColor },
      ...t.secondaryColor && { secondary: t.secondaryColor }
    }
  } : q;
}
async function Be() {
  var t;
  try {
    const l = await tt().get("/theme");
    return si((t = l.data) == null ? void 0 : t.data);
  } catch {
    return q;
  }
}
function ci(t) {
  return {
    colors: t.colors,
    spacing: t.spacing,
    borderRadius: t.borderRadius,
    typography: t.typography
  };
}
async function pi(t) {
  await tt().put("/theme", ci(t));
}
async function st() {
  var o;
  const t = li().getAccountId();
  return (((o = (await ue().get(`/templates/account/${t}`)).data) == null ? void 0 : o.data) ?? []).map(at);
}
async function di(t) {
  var l, s;
  try {
    const o = await ue().get(`/templates/${t}`), c = ((l = o.data) == null ? void 0 : l.data) ?? o.data;
    return c ? at(c) : void 0;
  } catch (o) {
    if (((s = o == null ? void 0 : o.response) == null ? void 0 : s.status) === 404)
      return;
    throw o;
  }
}
async function ct(t) {
  await ue().post("/templates", ot(t));
}
async function pt(t) {
  await ue().patch(`/templates/${t.id}`, ot(t));
}
async function ui(t) {
  await ue().delete(`/templates/${t}`);
}
async function hi(t) {
  const l = await di(t);
  return {
    found: !!l,
    components: (l == null ? void 0 : l.template) || [],
    theme: await Be(),
    slug: (l == null ? void 0 : l.slug) || "",
    title: (l == null ? void 0 : l.title) || "",
    enabled: (l == null ? void 0 : l.active) !== !1
  };
}
const Ge = {
  templates: [],
  globalTheme: q,
  templatesStatus: "idle",
  themeStatus: "idle",
  templatesError: null,
  themeError: null
}, H = ti(
  (t, l) => ({
    ...Ge,
    loadTemplates: async ({ force: s = !1 } = {}) => {
      const { templatesStatus: o, templates: c } = l();
      if (!s && o === "success" && c.length > 0)
        return c;
      t({
        templatesStatus: "loading",
        templatesError: null
      });
      try {
        const a = await st();
        return t({
          templates: a,
          templatesStatus: "success",
          templatesError: null
        }), a;
      } catch (a) {
        throw t({
          templatesStatus: "error",
          templatesError: a instanceof Error ? a.message : "Erro ao carregar templates"
        }), a;
      }
    },
    loadGlobalTheme: async ({ force: s = !1 } = {}) => {
      const { themeStatus: o, globalTheme: c } = l();
      if (!s && o === "success")
        return c;
      t({
        themeStatus: "loading",
        themeError: null
      });
      try {
        const a = await Be();
        return t({
          globalTheme: a,
          themeStatus: "success",
          themeError: null
        }), a;
      } catch (a) {
        throw t({
          globalTheme: q,
          themeStatus: "error",
          themeError: a instanceof Error ? a.message : "Erro ao carregar tema global"
        }), a;
      }
    },
    hydrateCatalog: async ({ force: s = !1 } = {}) => {
      await Promise.all([
        l().loadTemplates({ force: s }),
        l().loadGlobalTheme({ force: s })
      ]);
    },
    upsertTemplate: (s) => t((o) => o.templates.some(
      ({ id: a }) => a === s.id
    ) ? {
      templates: o.templates.map(
        (a) => a.id === s.id ? s : a
      )
    } : {
      templates: [...o.templates, s]
    }),
    removeTemplate: (s) => t((o) => ({
      templates: o.templates.filter(
        ({ id: c }) => c !== s
      )
    })),
    setGlobalTheme: (s) => t({
      globalTheme: s,
      themeStatus: "success",
      themeError: null
    }),
    persistGlobalTheme: async (s) => {
      t({
        globalTheme: s,
        themeStatus: "loading",
        themeError: null
      });
      try {
        await pi(s), t({
          globalTheme: s,
          themeStatus: "success",
          themeError: null
        });
      } catch (o) {
        throw t({
          themeStatus: "error",
          themeError: o instanceof Error ? o.message : "Erro ao salvar tema global"
        }), o;
      }
    },
    reset: () => t(Ge)
  })
), { Content: mi } = ze, { Text: Ye } = de;
function gi({
  t,
  onOpen: l,
  onDuplicate: s,
  onCopyJson: o,
  onToggleEnabled: c,
  onDelete: a,
  theme: p
}) {
  const m = t.active !== !1, d = t.template || [], $ = [
    {
      key: "edit",
      label: "Editar",
      icon: /* @__PURE__ */ e(Bt, {})
    },
    {
      key: "duplicate",
      label: "Duplicar",
      icon: /* @__PURE__ */ e(Ze, {})
    },
    {
      key: "copyJson",
      label: "Copiar JSON",
      icon: /* @__PURE__ */ e(ce, {})
    },
    {
      key: "toggle",
      label: m ? "Desativar" : "Ativar",
      icon: /* @__PURE__ */ e(Rt, {})
    },
    {
      key: "delete",
      label: "Excluir",
      icon: /* @__PURE__ */ e(Ot, {}),
      danger: !0
    }
  ];
  return /* @__PURE__ */ e(
    Se,
    {
      hoverable: !0,
      className: "h-full flex flex-col overflow-hidden cursor-pointer",
      onClick: l,
      cover: /* @__PURE__ */ r("div", { className: "h-80 bg-gray-50 flex items-center justify-center relative overflow-hidden border-b", children: [
        /* @__PURE__ */ e(
          ai,
          {
            template: d.length > 0 ? t : null,
            theme: p,
            scale: 0.5,
            width: "420px",
            height: "550px",
            wrapperStyle: {
              position: "absolute",
              inset: 0
            }
          }
        ),
        /* @__PURE__ */ e(
          "div",
          {
            className: "absolute top-2 right-2 z-10",
            onClick: (v) => v.stopPropagation(),
            children: /* @__PURE__ */ e(
              Qt,
              {
                menu: {
                  items: $,
                  onClick: ({ key: v, domEvent: y }) => {
                    y.stopPropagation(), v === "edit" && l(), v === "duplicate" && s(t.id), v === "copyJson" && o(t.id), v === "toggle" && c(t.id, !m), v === "delete" && a(t.id);
                  }
                },
                trigger: ["click"],
                children: /* @__PURE__ */ e(
                  G,
                  {
                    type: "text",
                    icon: /* @__PURE__ */ e(zt, {}),
                    className: "!bg-white hover:!bg-white shadow-md border border-gray-200"
                  }
                )
              }
            )
          }
        )
      ] }),
      children: /* @__PURE__ */ e(
        Se.Meta,
        {
          title: /* @__PURE__ */ r("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ e("span", { className: "font-semibold text-gray-800 truncate", children: t.title }),
            /* @__PURE__ */ e(
              Ne,
              {
                color: m ? "success" : "default",
                className: "flex-shrink-0",
                children: m ? "Ativo" : "Inativo"
              }
            )
          ] }),
          description: /* @__PURE__ */ r("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ r(
              Ye,
              {
                type: "secondary",
                className: "text-xs text-gray-400",
                children: [
                  /* @__PURE__ */ e("span", { className: "font-bold", children: "ID:" }),
                  " ",
                  t.id
                ]
              }
            ),
            t.slug && /* @__PURE__ */ r(
              Ye,
              {
                type: "secondary",
                className: "text-xs text-gray-400",
                children: [
                  /* @__PURE__ */ e("span", { className: "font-bold", children: "Slug:" }),
                  " ",
                  t.slug
                ]
              }
            )
          ] })
        }
      )
    }
  );
}
function fi() {
  const t = qe(), [l, s] = L(!1), o = H((k) => k.templates), c = H((k) => k.globalTheme), a = H(
    (k) => k.templatesStatus
  ), p = H((k) => k.themeStatus), m = H(
    (k) => k.templatesError
  ), d = H((k) => k.themeError), $ = H(
    (k) => k.hydrateCatalog
  ), v = H(
    (k) => k.loadTemplates
  ), y = H(
    (k) => k.persistGlobalTheme
  ), h = H(
    (k) => k.upsertTemplate
  ), R = H(
    (k) => k.removeTemplate
  ), b = a === "loading" || p === "loading", E = a === "error" || p === "error", i = m || d, I = async () => {
    try {
      await $({ force: !0 });
    } catch {
      X.error("Erro ao atualizar o catálogo de templates.");
    }
  };
  D(() => {
    $();
  }, [$]);
  const g = async (k) => {
    const n = o.find((C) => C.id === k);
    if (!n) return;
    const T = {
      ...n,
      id: `template-${Date.now()}`,
      title: `${n.title} (cópia)`,
      slug: `${n.slug}-copia-${Date.now()}`,
      active: !1
    };
    try {
      await ct(T), h(T), await v({ force: !0 }), X.success("Template duplicado com sucesso!");
    } catch {
      X.error("Erro ao duplicar o template.");
    }
  }, z = (k) => {
    const n = o.find((T) => T.id === k);
    n && (navigator.clipboard.writeText(
      JSON.stringify(n.template, null, 2)
    ), X.success("JSON copiado para a área de transferência!"));
  }, A = async (k, n) => {
    const T = o.find((x) => x.id === k);
    if (!T) return;
    const C = { ...T, active: n };
    h(C);
    try {
      await pt(C);
    } catch {
      h(T), X.error("Erro ao atualizar o status do template.");
    }
  }, Y = (k) => {
    const n = o.find((T) => T.id === k);
    et.confirm({
      title: "Excluir template",
      content: `Tem certeza que deseja excluir "${n == null ? void 0 : n.title}"? Essa ação não pode ser desfeita.`,
      okText: "Excluir",
      okButtonProps: { danger: !0 },
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await ui(k), R(k), X.success("Template excluído com sucesso!");
        } catch {
          X.error("Erro ao excluir o template.");
        }
      }
    });
  }, Z = async (k) => {
    await y(k);
  };
  return /* @__PURE__ */ r(mi, { className: "tb-root cockpit-content-align", children: [
    /* @__PURE__ */ e("div", { className: "cockpit-subheader", children: /* @__PURE__ */ r(Jt, { align: "middle", justify: "space-between", children: [
      /* @__PURE__ */ e(Me, { children: /* @__PURE__ */ e("h2", { className: "cockpit-subheader-title", children: "Gestão de Templates" }) }),
      /* @__PURE__ */ e(Me, { children: /* @__PURE__ */ r(le, { size: "middle", children: [
        /* @__PURE__ */ e(
          G,
          {
            icon: /* @__PURE__ */ e(Ee, {}),
            onClick: () => s(!0),
            children: "Editar Tema Global"
          }
        ),
        /* @__PURE__ */ e(
          G,
          {
            type: "primary",
            icon: /* @__PURE__ */ e(Et, {}),
            onClick: () => t("/template-builder/editor/new"),
            className: "bg-primary flex items-center",
            children: "Criar Template"
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ e("div", { className: "px-6 py-8", children: /* @__PURE__ */ r("div", { className: "grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto", children: [
      b && Array.from({ length: 6 }).map((k, n) => /* @__PURE__ */ e(
        Se,
        {
          cover: /* @__PURE__ */ e("div", { className: "h-80 bg-gray-100 animate-pulse" }),
          children: /* @__PURE__ */ e(qt, { active: !0, paragraph: { rows: 2 } })
        },
        n
      )),
      !b && E && /* @__PURE__ */ e("div", { className: "col-span-full", children: /* @__PURE__ */ e(
        Kt,
        {
          type: "error",
          message: "Não foi possível carregar os templates.",
          description: i || "Verifique sua conexão e tente novamente.",
          showIcon: !0,
          action: /* @__PURE__ */ e(G, { size: "small", onClick: I, children: "Tentar novamente" })
        }
      ) }),
      !b && !E && o.length === 0 && /* @__PURE__ */ e("div", { className: "col-span-full flex justify-center py-16", children: /* @__PURE__ */ e(Zt, { description: "Nenhum template encontrado. Crie o seu primeiro!" }) }),
      !b && !E && o.map((k) => /* @__PURE__ */ e(
        gi,
        {
          t: k,
          onOpen: () => t(`/template-builder/editor/${k.id}`),
          onDuplicate: g,
          onCopyJson: z,
          onToggleEnabled: A,
          onDelete: Y,
          theme: c
        },
        k.id
      ))
    ] }) }),
    /* @__PURE__ */ e(
      nt,
      {
        open: l,
        onClose: () => s(!1),
        theme: c,
        onThemeChange: Z
      }
    )
  ] });
}
const yi = () => Math.random().toString(36).substr(2, 9), { Text: fe } = de, xi = () => /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ e("rect", { x: "2", y: "7", width: "20", height: "10", rx: "2" }),
  /* @__PURE__ */ e("path", { d: "M7 12h10" })
] });
function vi({
  onDragStart: t,
  activeTab: l,
  onImportJson: s
}) {
  const [o, c] = L("elements"), [a, p] = L(""), m = l || o, d = l ? () => {
  } : c, $ = () => {
    s != null && s(a) && p("");
  };
  return /* @__PURE__ */ e("div", { className: "h-full flex flex-col bg-white", children: /* @__PURE__ */ e(
    De,
    {
      activeKey: m,
      onChange: d,
      centered: !0,
      className: "builder-tabs-50",
      tabBarGutter: 0,
      items: [
        {
          key: "elements",
          label: /* @__PURE__ */ r(le, { size: 8, children: [
            /* @__PURE__ */ e(je, {}),
            /* @__PURE__ */ e("span", { children: "Elementos" })
          ] }),
          children: /* @__PURE__ */ e("div", { className: "p-3 overflow-y-auto flex-1", children: [
            {
              title: "Containers",
              items: [
                { type: "container", label: "Container", icon: /* @__PURE__ */ e(Qe, { style: { fontSize: "20px" } }) }
              ]
            },
            {
              title: "Visuais",
              items: [
                { type: "header", label: "Header", icon: /* @__PURE__ */ e(Ke, { style: { fontSize: "20px" } }) },
                { type: "text", label: "Texto", icon: /* @__PURE__ */ e($t, { style: { fontSize: "20px" } }) },
                { type: "price", label: "Preço", icon: /* @__PURE__ */ e(_t, { style: { fontSize: "20px" } }) },
                { type: "divider", label: "Divisor", icon: /* @__PURE__ */ e(Wt, { style: { fontSize: "20px" } }) },
                { type: "media", label: "Mídia", icon: /* @__PURE__ */ e(jt, { style: { fontSize: "20px" } }) },
                { type: "avatar", label: "Avatar", icon: /* @__PURE__ */ e(je, { style: { fontSize: "20px" } }) },
                { type: "post_interactions", label: "Interações", icon: /* @__PURE__ */ e(Lt, { style: { fontSize: "20px" } }) },
                { type: "html", label: "HTML Custom", icon: /* @__PURE__ */ e(ce, { style: { fontSize: "20px" } }) }
              ]
            },
            {
              title: "Ações",
              items: [
                { type: "button", label: "Botão", icon: /* @__PURE__ */ e(xi, {}) },
                { type: "icon", label: "Ícone", icon: /* @__PURE__ */ e(Mt, { style: { fontSize: "20px", color: "#f59e0b" } }) }
              ]
            }
          ].map((y) => /* @__PURE__ */ r("div", { className: "mb-4", children: [
            /* @__PURE__ */ e(fe, { strong: !0, type: "secondary", className: "text-[10px] uppercase tracking-wider block mb-2 pl-1", children: y.title }),
            /* @__PURE__ */ e("div", { className: "grid grid-cols-2 gap-2", children: y.items.map((h) => /* @__PURE__ */ r(
              "div",
              {
                draggable: !0,
                onDragStart: (R) => t(R, h.type),
                className: "group flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                children: [
                  /* @__PURE__ */ e("div", { className: "mb-1 text-gray-500 group-hover:text-primary transition-colors", children: Te.cloneElement(h.icon, { style: { fontSize: "18px" } }) }),
                  /* @__PURE__ */ e(fe, { className: "text-[10px] text-gray-600 group-hover:text-gray-900 transition-colors", children: h.label })
                ]
              },
              h.type
            )) })
          ] }, y.title)) })
        },
        {
          key: "import",
          label: /* @__PURE__ */ r(le, { size: 8, children: [
            /* @__PURE__ */ e(Le, {}),
            /* @__PURE__ */ e("span", { children: "Importar" })
          ] }),
          children: /* @__PURE__ */ r("div", { className: "p-5 overflow-y-auto flex-1", children: [
            /* @__PURE__ */ e(fe, { strong: !0, type: "secondary", className: "text-[11px] uppercase tracking-wider block mb-3", children: "🚀 Importar Configuração" }),
            /* @__PURE__ */ e(fe, { type: "secondary", className: "text-xs block mb-6 leading-relaxed", children: "Cole abaixo o JSON do template ou do post que deseja importar. O editor tentará extrair a lista de componentes automaticamente." }),
            /* @__PURE__ */ r("div", { className: "space-y-4", children: [
              /* @__PURE__ */ e(
                pe.TextArea,
                {
                  rows: 12,
                  value: a,
                  onChange: (y) => p(y.target.value),
                  placeholder: '{"template": [...] }',
                  className: "font-mono text-[10px] bg-gray-50 border-gray-200 rounded-lg p-3 hover:bg-white focus:bg-white transition-all",
                  style: { resize: "none" }
                }
              ),
              /* @__PURE__ */ e(
                G,
                {
                  type: "primary",
                  icon: /* @__PURE__ */ e(Le, {}),
                  onClick: $,
                  className: "w-full bg-primary h-10 shadow-md shadow-primary/10",
                  disabled: !a.trim(),
                  children: "Importar JSON"
                }
              )
            ] })
          ] })
        }
      ]
    }
  ) });
}
function bi({
  node: t,
  resolvedTitle: l,
  resolvedImageUrl: s,
  abbreviation: o,
  renderIcon: c,
  colorToHex: a,
  resolveVariables: p,
  selectionStyle: m,
  dragIndicatorStyle: d,
  baseStyle: $,
  onSelect: v,
  onDragStartNode: y,
  onDragOverNode: h,
  onDragLeaveNode: R,
  onDropNode: b
}) {
  const [E, i] = L(!1), I = ye(null);
  return D(() => {
    if (!E) return;
    const g = (z) => {
      I.current && !I.current.contains(z.target) && i(!1);
    };
    return document.addEventListener("mousedown", g), () => document.removeEventListener("mousedown", g);
  }, [E]), /* @__PURE__ */ r(
    "div",
    {
      draggable: !0,
      onDragStart: (g) => y == null ? void 0 : y(g, t.id),
      onDragOver: (g) => h == null ? void 0 : h(g, t.id),
      onDragLeave: (g) => R == null ? void 0 : R(g, t.id),
      onDrop: (g) => b == null ? void 0 : b(g, t.id),
      onClick: (g) => {
        g.stopPropagation(), v(t.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        cursor: "pointer",
        position: "relative",
        ...$,
        ...m,
        ...d
      },
      children: [
        /* @__PURE__ */ r(
          "div",
          {
            onClick: (g) => {
              t.onProfilePress && (g.stopPropagation(), console.log("Action Triggered (Profile):", t.onProfilePress), alert(`Profile Action: ${t.onProfilePress.type}`));
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
              minWidth: 0,
              cursor: t.onProfilePress ? "pointer" : "default"
            },
            children: [
              /* @__PURE__ */ e(
                "div",
                {
                  style: {
                    width: 36,
                    height: 36,
                    borderRadius: "9999px",
                    backgroundColor: a("gray-100") || "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0
                  },
                  children: s ? /* @__PURE__ */ e(
                    "img",
                    {
                      src: s,
                      alt: l,
                      style: { width: "100%", height: "100%", objectFit: "cover" },
                      onError: (g) => {
                        g.target.style.display = "none";
                        const z = g.target.parentElement;
                        if (z) {
                          const A = document.createElement("span");
                          A.textContent = o, A.style.cssText = "font-size:14px;font-weight:600;color:#6b7280;", z.appendChild(A);
                        }
                      }
                    }
                  ) : /* @__PURE__ */ e(
                    "span",
                    {
                      style: {
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--tb-text-primary)"
                      },
                      children: o
                    }
                  )
                }
              ),
              /* @__PURE__ */ e(
                "span",
                {
                  style: {
                    flex: 1,
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--tb-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  },
                  children: l
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r("div", { ref: I, style: { position: "relative", flexShrink: 0 }, children: [
          /* @__PURE__ */ e(
            "div",
            {
              onClick: (g) => {
                g.stopPropagation(), i((z) => !z);
              },
              style: {
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "4px"
              },
              children: c("more-vertical", a("gray-500") || "#6b7280", 18)
            }
          ),
          E && t.menuItems && t.menuItems.length > 0 && /* @__PURE__ */ e(
            "div",
            {
              style: {
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "4px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                minWidth: "180px",
                zIndex: 50,
                overflow: "hidden"
              },
              children: t.menuItems.map((g, z) => /* @__PURE__ */ r(
                "div",
                {
                  onClick: (A) => {
                    A.stopPropagation(), i(!1), g.action && (console.log("Action Triggered (Menu Item):", g.action), alert(
                      `Action: ${g.action.type}
Payload: ${JSON.stringify(g.action.payload)}`
                    ));
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: g.icon === "flag" || g.icon === "report" ? a("error") || "#dc2626" : a("gray-800") || "#1f2937",
                    cursor: "pointer",
                    borderBottom: z < t.menuItems.length - 1 ? "1px solid #f3f4f6" : void 0
                  },
                  className: "dynamic-tag-item",
                  children: [
                    c(
                      g.icon || "star",
                      g.icon === "flag" || g.icon === "report" ? a("error") || "#dc2626" : a("gray-500") || "#6b7280",
                      16
                    ),
                    /* @__PURE__ */ e("span", { children: p(g.text) })
                  ]
                },
                z
              ))
            }
          )
        ] })
      ]
    }
  );
}
function dt({
  node: t,
  selectedNodeId: l,
  dragOverNodeId: s,
  dragPosition: o,
  onSelect: c,
  onDragStartNode: a,
  onDragOverNode: p,
  onDragLeaveNode: m,
  onDropNode: d,
  dataContext: $,
  theme: v
}) {
  var Z, k;
  const y = (n) => {
    if (n) {
      if (v != null && v.spacing && n in v.spacing)
        return v.spacing[n];
      switch (n) {
        case "xs":
          return "4px";
        case "sm":
          return "8px";
        case "md":
          return "16px";
        case "lg":
          return "24px";
        case "xl":
          return "32px";
        case "xxl":
          return "48px";
        default:
          return n.includes("px") || n.includes("%") ? n : void 0;
      }
    }
  }, h = (n) => {
    if (n) {
      if (v != null && v.colors && n in v.colors)
        return v.colors[n];
      switch (n) {
        case "white":
          return "#ffffff";
        case "gray-100":
          return "#f3f4f6";
        case "gray-200":
          return "#e2e8f0";
        case "gray-800":
          return "#1f2937";
        case "gray-900":
          return "#111827";
        case "primary":
          return "#6366f1";
        default:
          return n;
      }
    }
  }, R = {
    post: {
      title: "Titulo do post",
      description: "Chaleira Elétrica Cadence 1,8L Inox Control 127V CEL850",
      originalPrice: "89,90",
      price: "39,90",
      discount: "26",
      destinationUrl: "/shop/f148c0ad-a39a-4674-a59f-cad2f4b7e91b",
      contentType: "catalog",
      url: "https://cdn.luxuryloyalty.com/media/product/detail/9c3adfe3-00d6-4e1a-9e4f-be925067f2d6-1.jpg",
      profile: {
        accountName: "Flash Shopping",
        iconUrl: "https://cockpit-app.dev-directoai.com.br/assets/creator_logo-BVuuYkvo.png",
        description: "A Rede Sol Antunes em Mirassol foi inaugurada em 1946, conta com quatro amplas unidades na cidade, com estacionamento próprio com capacidade para 270 veículos, grande variedade de produtos em todos os setores, restaurante e rotisseria próprios e uma equipe de 410 colaboradores prontos para servir da melhor maneira."
      },
      customVariables: {}
    }
  }, b = (n) => n && n.replace(/\{\{(.*?)\}\}/g, (T, C) => {
    const x = C.trim().split(".");
    let O = $ || R;
    for (const S of x)
      if (O && typeof O == "object" && S in O)
        O = O[S];
      else
        return T;
    return String(O ?? "");
  }), E = (n, T, C = 20) => {
    const O = {
      user: B.UserOutlined,
      heart: B.HeartOutlined,
      bookmark: B.BookOutlined,
      share: B.ShareAltOutlined,
      camera: B.CameraOutlined,
      settings: B.SettingOutlined,
      home: B.HomeOutlined,
      search: B.SearchOutlined,
      bell: B.BellOutlined,
      star: B.StarOutlined,
      "more-horizontal": B.EllipsisOutlined,
      "more-vertical": B.MoreOutlined,
      shopping: B.ShoppingOutlined,
      shoppingbag: B.ShoppingOutlined,
      "shopping-bag": B.ShoppingOutlined,
      plus: B.PlusOutlined,
      trash: B.DeleteOutlined,
      edit: B.EditOutlined,
      check: B.CheckOutlined,
      chevronRight: B.RightOutlined,
      chevronLeft: B.LeftOutlined,
      info: B.InfoCircleOutlined,
      flag: B.FlagOutlined,
      follow: B.UserAddOutlined,
      report: B.FlagOutlined
    }[n] || B.StarOutlined;
    return /* @__PURE__ */ e(O, { style: { fontSize: C, color: T } });
  }, i = t.id === l, I = t.id === s, g = i ? { outline: "2px solid #2563eb", outlineOffset: "-2px" } : {}, z = I ? {
    borderTop: o === "top" ? "4px solid #2563eb" : void 0,
    borderBottom: o === "bottom" ? "4px solid #2563eb" : void 0,
    backgroundColor: o === "inside" ? "rgba(37, 99, 235, 0.1)" : void 0
  } : {}, A = {
    flex: t.flex || ("height" in t && t.height === "100%" ? 1 : void 0)
  };
  if (t.type === "text") {
    const n = t;
    let T = "16px", C = "normal";
    return n.typography === "caption" ? T = "12px" : n.typography === "heading1" ? (T = "32px", C = "bold") : n.typography === "heading2" ? (T = "24px", C = "bold") : n.typography === "heading3" ? (T = "20px", C = "bold") : n.typography === "heading4" ? (T = "18px", C = "bold") : n.typography === "heading5" && (T = "16px", C = "bold"), n.fontWeight && (n.fontWeight === "bold" ? C = "bold" : n.fontWeight === "semiBold" ? C = "600" : C = "normal"), /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (x) => a == null ? void 0 : a(x, t.id),
        onDragOver: (x) => p == null ? void 0 : p(x, t.id),
        onDragLeave: (x) => m == null ? void 0 : m(x, t.id),
        onDrop: (x) => d == null ? void 0 : d(x, t.id),
        style: {
          fontSize: T,
          fontWeight: C,
          textAlign: n.textAlign || "left",
          color: n.color ? h(n.color) : "var(--tb-text-primary)",
          padding: "0",
          cursor: "action" in t && t.action || i ? "pointer" : "default",
          ...A,
          ...g,
          ...z
        },
        onClick: (x) => {
          if ("action" in t && t.action) {
            x.stopPropagation();
            const O = t.action;
            O && (console.log("Action Triggered (Text/Node):", O), alert(`Action: ${O.type}`));
          } else
            x.stopPropagation(), c(t.id);
        },
        children: b(n.value || "Input Text")
      }
    );
  }
  const Y = (n) => {
    if (!n) return "0";
    if (v != null && v.borderRadius && n in v.borderRadius)
      return v.borderRadius[n];
    switch (n) {
      case "sm":
        return "4px";
      case "md":
        return "8px";
      case "lg":
      case "full":
        return "9999px";
      default:
        return n.includes("px") ? n : "0";
    }
  };
  if (t.type === "container") {
    const n = t, T = y(n.paddingX), C = y(n.paddingY), x = y(n.marginX), O = y(n.marginY);
    return /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (S) => a == null ? void 0 : a(S, t.id),
        onDragOver: (S) => p == null ? void 0 : p(S, t.id),
        onDragLeave: (S) => m == null ? void 0 : m(S, t.id),
        onDrop: (S) => d == null ? void 0 : d(S, t.id),
        onClick: (S) => {
          S.stopPropagation(), c(t.id);
        },
        style: {
          display: "flex",
          flexDirection: n.direction || "column",
          justifyContent: n.justifyContent || "flex-start",
          alignItems: n.alignItems || "stretch",
          paddingLeft: T,
          paddingRight: T,
          paddingTop: C,
          paddingBottom: C,
          marginLeft: x,
          marginRight: x,
          marginTop: O,
          marginBottom: O,
          gap: y(n.gap),
          backgroundColor: h(n.backgroundColor),
          borderRadius: Y(n.borderRadius),
          border: n.borderWidth ? `${n.borderWidth} ${n.borderStyle || "solid"} ${h(n.borderColor) || "#000"}` : void 0,
          width: n.width || "auto",
          height: n.height || "auto",
          minHeight: "40px",
          position: "relative",
          boxSizing: "border-box",
          ...A,
          ...g,
          ...z
        },
        className: "builder-container-node",
        children: n.blocks && n.blocks.length > 0 ? n.blocks.map((S) => /* @__PURE__ */ e(
          dt,
          {
            node: S,
            selectedNodeId: l,
            dragOverNodeId: s,
            dragPosition: o,
            onSelect: c,
            onDragStartNode: a,
            onDragOverNode: p,
            onDragLeaveNode: m,
            onDropNode: d,
            dataContext: $,
            theme: v
          },
          S.id
        )) : /* @__PURE__ */ e(
          "span",
          {
            style: {
              color: "#94a3b8",
              fontSize: "12px",
              opacity: 0.6,
              alignSelf: "center",
              margin: "auto"
            },
            children: "Empty Container"
          }
        )
      }
    );
  }
  if (t.type === "divider") {
    const n = t;
    let T = "1px", C = "#e2e8f0";
    return n.thickness === "thin" ? (T = "0.5px", C = "#f1f5f9") : n.thickness === "thick" && (T = "2px"), /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (x) => a == null ? void 0 : a(x, t.id),
        onDragOver: (x) => p == null ? void 0 : p(x, t.id),
        onDragLeave: (x) => m == null ? void 0 : m(x, t.id),
        onDrop: (x) => d == null ? void 0 : d(x, t.id),
        onClick: (x) => {
          x.stopPropagation(), c(t.id);
        },
        style: {
          height: "12px",
          margin: "0",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ...A,
          ...g,
          ...z
        },
        children: /* @__PURE__ */ e(
          "hr",
          {
            style: {
              borderTop: `${T} solid ${C}`,
              margin: 0,
              width: "100%"
            }
          }
        )
      }
    );
  }
  if (t.type === "media") {
    const n = t, T = n.width || "100%", C = n.height || "200px";
    return /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (x) => a == null ? void 0 : a(x, t.id),
        onDragOver: (x) => p == null ? void 0 : p(x, t.id),
        onDragLeave: (x) => m == null ? void 0 : m(x, t.id),
        onDrop: (x) => d == null ? void 0 : d(x, t.id),
        style: {
          width: T,
          height: C,
          backgroundColor: n.url ? "transparent" : "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          cursor: n.action || i ? "pointer" : "default",
          overflow: "hidden",
          ...A,
          ...g,
          ...z
        },
        onClick: (x) => {
          x.stopPropagation(), c(t.id);
        },
        children: n.url ? /* @__PURE__ */ e(
          "img",
          {
            src: b(n.url),
            alt: b(n.alt || ""),
            style: {
              width: "100%",
              height: "100%",
              objectFit: n.objectFit || "cover"
            }
          }
        ) : /* @__PURE__ */ r(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: h("gray-400")
            },
            children: [
              /* @__PURE__ */ r(
                "svg",
                {
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ e("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                    /* @__PURE__ */ e("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                    /* @__PURE__ */ e("polyline", { points: "21 15 16 10 5 21" })
                  ]
                }
              ),
              /* @__PURE__ */ e("span", { style: { fontSize: "14px", fontWeight: 500 }, children: "Mídia Placeholder" })
            ]
          }
        )
      }
    );
  }
  if (t.type === "post_interactions") {
    const n = t, T = n.showLike !== !1, C = n.showSave !== !1, x = n.showShare !== !1, O = y(n.paddingX) || "0", S = y(n.paddingY) || "12px", re = y(n.gap) || "16px";
    return /* @__PURE__ */ r(
      "div",
      {
        draggable: !0,
        onDragStart: (j) => a == null ? void 0 : a(j, t.id),
        onDragOver: (j) => p == null ? void 0 : p(j, t.id),
        onDragLeave: (j) => m == null ? void 0 : m(j, t.id),
        onDrop: (j) => d == null ? void 0 : d(j, t.id),
        onClick: (j) => {
          j.stopPropagation(), c(t.id);
        },
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${S} ${O}`,
          cursor: "pointer",
          width: "100%",
          ...A,
          ...g,
          ...z
        },
        children: [
          /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", gap: re }, children: [
            T && /* @__PURE__ */ e(
              "div",
              {
                onClick: (j) => {
                  const V = n.onLike || {
                    payload: { actionName: "like" }
                  };
                  j.stopPropagation(), alert(`Action: Like (${V.payload.actionName})`);
                },
                style: { cursor: "pointer" },
                children: E("heart", h("gray-500") || "#64748b", 24)
              }
            ),
            C && /* @__PURE__ */ e(
              "div",
              {
                onClick: (j) => {
                  const V = n.onSave || {
                    payload: { actionName: "save" }
                  };
                  j.stopPropagation(), alert(`Action: Save (${V.payload.actionName})`);
                },
                style: { cursor: "pointer" },
                children: E("bookmark", h("gray-500") || "#64748b", 24)
              }
            )
          ] }),
          /* @__PURE__ */ e("div", { children: x && /* @__PURE__ */ e(
            "div",
            {
              onClick: (j) => {
                const V = n.onShare || {
                  payload: { actionName: "share" }
                };
                j.stopPropagation(), alert(`Action: Share (${V.payload.actionName})`);
              },
              style: { cursor: "pointer" },
              children: E("share", h("gray-500") || "#64748b", 24)
            }
          ) })
        ]
      }
    );
  }
  if (t.type === "price") {
    const n = t, T = y(n.paddingX) || "0", C = y(n.paddingY) || "8px";
    return /* @__PURE__ */ r(
      "div",
      {
        draggable: !0,
        onDragStart: (x) => a == null ? void 0 : a(x, t.id),
        onDragOver: (x) => p == null ? void 0 : p(x, t.id),
        onDragLeave: (x) => m == null ? void 0 : m(x, t.id),
        onDrop: (x) => d == null ? void 0 : d(x, t.id),
        onClick: (x) => {
          x.stopPropagation(), c(t.id);
        },
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: `${C} ${T}`,
          cursor: "pointer",
          ...A,
          ...g,
          ...z
        },
        children: [
          /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
            n.showOriginalPrice !== !1 && n.originalPrice && /* @__PURE__ */ e(
              "span",
              {
                style: {
                  fontSize: "12px",
                  color: h("gray-400"),
                  textDecoration: "line-through"
                },
                children: b(n.originalPrice)
              }
            ),
            n.showDiscountPercent !== !1 && n.discountPercent && /* @__PURE__ */ r(
              "span",
              {
                style: {
                  backgroundColor: h("error") + "20" || "#fecaca",
                  color: h("error") || "#dc2626",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "1px 4px",
                  borderRadius: "3px"
                },
                children: [
                  b(n.discountPercent),
                  "% OFF"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ e(
            "span",
            {
              style: {
                fontSize: "20px",
                fontWeight: "bold",
                color: "var(--tb-text-primary)"
              },
              children: b(n.price)
            }
          )
        ]
      }
    );
  }
  if (t.type === "button") {
    const n = t, T = ((Z = n.action) == null ? void 0 : Z.type) === "DEEPLINK" ? String(
      n.action.payload.deeplink || n.action.payload.url || ""
    ) : ((k = n.action) == null ? void 0 : k.type) === "OPEN_URL" ? String(n.action.payload.url || "") : n.url || "", C = h("primary") || "#6366f1";
    let x = h(n.background) || C, O = "#ffffff", S = "none";
    n.variant === "outline" ? (x = "transparent", O = h(n.background) || C, S = `1px solid ${O}`) : n.variant === "ghost" && (x = "transparent", O = h(n.background) || C, S = "none");
    const j = {
      xs: { padding: "4px 8px", fontSize: "10px" },
      sm: { padding: "6px 12px", fontSize: "12px" },
      md: { padding: "10px 16px", fontSize: "14px" },
      lg: { padding: "14px 24px", fontSize: "16px" },
      xl: { padding: "18px 32px", fontSize: "18px" },
      xxl: { padding: "22px 40px", fontSize: "20px" }
    }[n.size || "md"];
    return /* @__PURE__ */ e(
      "button",
      {
        draggable: !0,
        onDragStart: (V) => a == null ? void 0 : a(V, t.id),
        onDragOver: (V) => p == null ? void 0 : p(V, t.id),
        onDragLeave: (V) => m == null ? void 0 : m(V, t.id),
        onDrop: (V) => d == null ? void 0 : d(V, t.id),
        onClick: (V) => {
          V.stopPropagation(), c(t.id);
        },
        title: T,
        style: {
          backgroundColor: x,
          color: O,
          border: S,
          ...j,
          borderRadius: Y(n.radius) || "8px",
          fontWeight: "bold",
          width: n.fullWidth ? "100%" : "auto",
          cursor: "pointer",
          transition: "opacity 0.2s",
          ...A,
          ...g,
          ...z
        },
        children: b(n.label || "Button")
      }
    );
  }
  if (t.type === "avatar") {
    const n = t, T = b(n.url || ""), C = Number(n.size) || 40, x = h(n.backgroundColor) || "#f3f4f6", O = Y(n.borderRadius || "full");
    return /* @__PURE__ */ r(
      "div",
      {
        draggable: !0,
        onDragStart: (S) => a == null ? void 0 : a(S, t.id),
        onDragOver: (S) => p == null ? void 0 : p(S, t.id),
        onDragLeave: (S) => m == null ? void 0 : m(S, t.id),
        onDrop: (S) => d == null ? void 0 : d(S, t.id),
        onClick: (S) => {
          S.stopPropagation(), c(t.id);
        },
        style: {
          width: C,
          height: C,
          borderRadius: O,
          backgroundColor: x,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          flexShrink: 0,
          ...A,
          ...g,
          ...z
        },
        children: [
          T ? /* @__PURE__ */ e(
            "img",
            {
              src: T,
              alt: "Avatar",
              style: { width: "100%", height: "100%", objectFit: "cover" },
              onError: (S) => {
                S.target.style.display = "none";
              }
            }
          ) : null,
          !T && E(
            n.icon || "user",
            h("gray-400") || "#9ca3af",
            C * 0.6
          )
        ]
      }
    );
  }
  if (t.type === "icon") {
    const n = t, T = y(n.padding);
    return /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (C) => a == null ? void 0 : a(C, t.id),
        onDragOver: (C) => p == null ? void 0 : p(C, t.id),
        onDragLeave: (C) => m == null ? void 0 : m(C, t.id),
        onDrop: (C) => d == null ? void 0 : d(C, t.id),
        onClick: (C) => {
          C.stopPropagation(), c(t.id);
        },
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: h(n.backgroundColor) || "transparent",
          padding: T,
          borderRadius: Y(n.borderRadius) || "0",
          cursor: "pointer",
          ...A,
          ...g,
          ...z
        },
        children: E(
          n.icon || "star",
          h("gray-500") || "#64748b",
          n.size || 20
        )
      }
    );
  }
  if (t.type === "header") {
    const n = t, T = b(n.title || "Shopping"), C = b(n.imageUrl || ""), x = T.split(" ").map((O) => O[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
    return /* @__PURE__ */ e(
      bi,
      {
        node: n,
        resolvedTitle: T,
        resolvedImageUrl: C,
        abbreviation: x,
        renderIcon: E,
        colorToHex: h,
        resolveVariables: b,
        selectionStyle: g,
        dragIndicatorStyle: z,
        baseStyle: A,
        onSelect: c,
        onDragStartNode: a,
        onDragOverNode: p,
        onDragLeaveNode: m,
        onDropNode: d
      }
    );
  }
  if (t.type === "html") {
    const n = t, T = y(n.paddingX) || "0", C = y(n.paddingY) || "0", x = n.width || "auto", O = n.height || "auto";
    return /* @__PURE__ */ e(
      "div",
      {
        draggable: !0,
        onDragStart: (S) => a == null ? void 0 : a(S, t.id),
        onDragOver: (S) => p == null ? void 0 : p(S, t.id),
        onDragLeave: (S) => m == null ? void 0 : m(S, t.id),
        onDrop: (S) => d == null ? void 0 : d(S, t.id),
        onClick: (S) => {
          S.stopPropagation(), c(t.id);
        },
        style: {
          padding: `${C} ${T}`,
          cursor: "pointer",
          width: x,
          height: O,
          ...A,
          ...g,
          ...z
        },
        dangerouslySetInnerHTML: {
          __html: b(n.html || "<div>Custom HTML</div>")
        }
      }
    );
  }
  return /* @__PURE__ */ e("div", { children: "Unknown Component" });
}
const { Text: Xe } = de;
function Ci({
  showGuides: t,
  setShowGuides: l,
  components: s,
  theme: o,
  selectedNodeId: c,
  isDragOver: a,
  dragOverNodeId: p,
  dragPosition: m,
  onSelectNode: d,
  onDragOver: $,
  onDragLeave: v,
  onDrop: y,
  onDragStartNode: h,
  onDragOverNode: R,
  onDragLeaveNode: b,
  onDropNode: E,
  children: i
}) {
  const [I, g] = Te.useState(0.75), [z, A] = Te.useState(!1), Y = () => {
    localStorage.setItem("builder-components", JSON.stringify(s)), window.open("/template-builder/previews", "_blank");
  }, Z = (n) => {
    navigator.clipboard.writeText(n), X.success("Código JSON copiado para a área de transferência!");
  }, k = JSON.stringify(
    { template: s },
    null,
    2
  );
  return /* @__PURE__ */ r("div", { className: "flex flex-col w-full h-full relative", children: [
    /* @__PURE__ */ e("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 z-20", children: /* @__PURE__ */ r(le, { className: "bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-gray-100", children: [
      /* @__PURE__ */ e(ae, { title: "Preview", children: /* @__PURE__ */ e(
        G,
        {
          shape: "circle",
          icon: /* @__PURE__ */ e(Ft, {}),
          onClick: Y,
          type: "text"
        }
      ) }),
      /* @__PURE__ */ e(ke, { type: "vertical" }),
      /* @__PURE__ */ e(ae, { title: "Diminuir Zoom", children: /* @__PURE__ */ e(
        G,
        {
          shape: "circle",
          icon: /* @__PURE__ */ e(Vt, {}),
          onClick: () => g(Math.max(0.1, I - 0.1)),
          type: "text"
        }
      ) }),
      /* @__PURE__ */ e("div", { className: "min-w-[45px] text-center", children: /* @__PURE__ */ r(Xe, { strong: !0, className: "text-[11px]", children: [
        Math.round(I * 100),
        "%"
      ] }) }),
      /* @__PURE__ */ e(ae, { title: "Aumentar Zoom", children: /* @__PURE__ */ e(
        G,
        {
          shape: "circle",
          icon: /* @__PURE__ */ e(Ht, {}),
          onClick: () => g(Math.min(1.5, I + 0.1)),
          type: "text"
        }
      ) }),
      /* @__PURE__ */ e(ke, { type: "vertical" }),
      /* @__PURE__ */ e(ae, { title: "Ver JSON", children: /* @__PURE__ */ e(
        G,
        {
          shape: "circle",
          icon: /* @__PURE__ */ e(ce, {}),
          onClick: () => A(!0),
          type: "text"
        }
      ) }),
      /* @__PURE__ */ e(ke, { type: "vertical" }),
      /* @__PURE__ */ e(ae, { title: t ? "Ocultar Guias" : "Mostrar Guias", children: /* @__PURE__ */ e(
        G,
        {
          shape: "circle",
          icon: /* @__PURE__ */ e(Qe, {}),
          onClick: () => l(!t),
          type: t ? "primary" : "text",
          size: "small",
          className: t ? "bg-primary text-white" : ""
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e(
      "div",
      {
        className: "flex-1 overflow-auto pt-20 pb-10 px-6 flex justify-center bg-[#f1f5f9] custom-scrollbar",
        onClick: () => d(null),
        onDragOver: $,
        onDragLeave: v,
        onDrop: y,
        children: /* @__PURE__ */ r(
          "div",
          {
            className: `canvas-page format-portrait shadow-2xl relative bg-white ${t ? "show-guides" : ""}`,
            style: {
              transform: `scale(${I})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out"
            },
            children: [
              t && /* @__PURE__ */ e("div", { className: "absolute inset-0 border-[20px] border-gray-500/10 pointer-events-none z-20 flex items-start justify-center pt-1 overflow-hidden transition-all" }),
              /* @__PURE__ */ r("div", { className: "relative z-10 flex flex-col h-full", children: [
                s.map((n) => /* @__PURE__ */ e(
                  dt,
                  {
                    node: n,
                    selectedNodeId: c,
                    dragOverNodeId: p,
                    dragPosition: m,
                    onSelect: d,
                    onDragStartNode: h,
                    onDragOverNode: R,
                    onDragLeaveNode: b,
                    onDropNode: E,
                    theme: o
                  },
                  n.id
                )),
                s.length === 0 && /* @__PURE__ */ r(
                  "div",
                  {
                    className: `flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all m-4 rounded-xl
                  ${a ? "border-primary bg-primary/5 scale-105" : "border-gray-200 bg-gray-50 opacity-60"}`,
                    children: [
                      /* @__PURE__ */ e("div", { className: "text-4xl text-gray-300 mb-2", children: "+" }),
                      /* @__PURE__ */ e(Xe, { type: "secondary", strong: !0, children: "Arraste elementos para começar" })
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    i,
    /* @__PURE__ */ e(
      et,
      {
        title: /* @__PURE__ */ r(le, { children: [
          /* @__PURE__ */ e(ce, { className: "text-primary" }),
          /* @__PURE__ */ e("span", { children: "Código JSON do Template" })
        ] }),
        open: z,
        onCancel: () => A(!1),
        footer: [
          /* @__PURE__ */ e(G, { icon: /* @__PURE__ */ e(Ze, {}), onClick: () => Z(k), children: "Copiar Código" }, "copy"),
          /* @__PURE__ */ e(G, { type: "primary", onClick: () => A(!1), children: "Fechar" }, "close")
        ],
        width: 700,
        centered: !0,
        children: /* @__PURE__ */ e("div", { className: "bg-gray-900 rounded-lg p-4 overflow-auto max-h-[500px]", children: /* @__PURE__ */ e("pre", { className: "m-0 text-blue-300 text-xs font-mono leading-relaxed", children: k }) })
      }
    )
  ] });
}
const se = ({ includeNone: t = !0, noneLabel: l = "None" }) => /* @__PURE__ */ r(M, { children: [
  t && /* @__PURE__ */ e("option", { value: "", children: l }),
  /* @__PURE__ */ r("optgroup", { label: "Marca", children: [
    /* @__PURE__ */ e("option", { value: "primary", children: "Primary" }),
    /* @__PURE__ */ e("option", { value: "secondary", children: "Secondary" }),
    /* @__PURE__ */ e("option", { value: "accent", children: "Accent" })
  ] }),
  /* @__PURE__ */ r("optgroup", { label: "Feedback", children: [
    /* @__PURE__ */ e("option", { value: "success", children: "Success" }),
    /* @__PURE__ */ e("option", { value: "warning", children: "Warning" }),
    /* @__PURE__ */ e("option", { value: "error", children: "Error" }),
    /* @__PURE__ */ e("option", { value: "info", children: "Info" })
  ] }),
  /* @__PURE__ */ r("optgroup", { label: "Neutras", children: [
    /* @__PURE__ */ e("option", { value: "white", children: "White" }),
    /* @__PURE__ */ e("option", { value: "black", children: "Black" }),
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => /* @__PURE__ */ r("option", { value: `gray-${s}`, children: [
      "Gray ",
      s
    ] }, s))
  ] }),
  /* @__PURE__ */ r("optgroup", { label: "Interação", children: [
    /* @__PURE__ */ e("option", { value: "primary-hover", children: "Primary Hover" }),
    /* @__PURE__ */ e("option", { value: "primary-active", children: "Primary Active" }),
    /* @__PURE__ */ e("option", { value: "secondary-hover", children: "Secondary Hover" }),
    /* @__PURE__ */ e("option", { value: "secondary-active", children: "Secondary Active" })
  ] })
] }), ut = [
  { label: "Product Title", value: "{{post.title}}" },
  { label: "Product Price", value: "{{post.price}}" },
  { label: "Original Price", value: "{{post.originalPrice}}" },
  { label: "Discount %", value: "{{post.discount}}" },
  { label: "Description", value: "{{post.description}}" },
  { label: "Image URL", value: "{{post.url}}" },
  { label: "Account Name", value: "{{post.profile.accountName}}" },
  { label: "Account Description", value: "{{post.profile.description}}" },
  { label: "Account Icon", value: "{{post.profile.iconUrl}}" },
  { label: "Link URL", value: "{{post.destinationUrl}}" },
  { label: "Custom HTML Variable", value: "{{post.customVariables.html}}" }
], U = ({
  label: t,
  value: l,
  fieldKey: s,
  selectedNode: o,
  onUpdateNode: c,
  activeDynamicField: a,
  setActiveDynamicField: p,
  dynamicPopupRef: m
}) => /* @__PURE__ */ r(
  "div",
  {
    ref: a === s ? m : null,
    style: { marginBottom: "12px", position: "relative" },
    children: [
      /* @__PURE__ */ r(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [
            /* @__PURE__ */ e("label", { style: { marginBottom: "4px" }, children: t }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: (d) => {
                  d.stopPropagation(), p(
                    a === s ? null : s
                  );
                },
                style: {
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "var(--tb-primary-color)",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px"
                },
                title: "Dynamic Tags",
                children: [
                  /* @__PURE__ */ e("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ e("path", { d: "M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4zm0 4c-5.52 0-10 2.69-10 6s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4z" }) }),
                  "Dynamic"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ e(
        "input",
        {
          type: "text",
          value: l,
          onChange: (d) => c(o.id, { [s]: d.target.value })
        }
      ),
      a === s && /* @__PURE__ */ e(
        "div",
        {
          style: {
            position: "absolute",
            top: "100%",
            right: 0,
            background: "var(--tb-bg-panel)",
            border: "1px solid var(--tb-border-color)",
            borderRadius: "4px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            zIndex: 100,
            width: "160px",
            marginTop: "4px",
            overflow: "hidden"
          },
          children: ut.map((d) => /* @__PURE__ */ e(
            "div",
            {
              onClick: () => {
                c(o.id, {
                  [s]: l + d.value
                }), p(null);
              },
              style: {
                padding: "8px 12px",
                fontSize: "12px",
                cursor: "pointer",
                borderBottom: "1px solid var(--tb-border-color)",
                color: "var(--tb-text-primary)"
              },
              className: "dynamic-tag-item",
              children: d.label
            },
            d.value
          ))
        }
      )
    ]
  }
), ee = ({
  label: t,
  action: l,
  onUpdate: s,
  activeDynamicField: o,
  setActiveDynamicField: c,
  dynamicPopupRef: a,
  selectedNode: p,
  parentId: m
}) => {
  const [d, $] = L(!1), v = (l == null ? void 0 : l.type) || "OPEN_URL", y = (l == null ? void 0 : l.payload) || {};
  return /* @__PURE__ */ r("div", { style: {
    border: "1px solid var(--tb-border-color)",
    borderRadius: "6px",
    marginBottom: "8px",
    background: "rgba(0,0,0,0.02)",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ r(
      "div",
      {
        onClick: () => $(!d),
        style: {
          padding: "8px 10px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: d ? "rgba(0,0,0,0.05)" : "transparent"
        },
        children: [
          /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ e("span", { style: { fontWeight: 600, fontSize: "10px", textTransform: "uppercase", opacity: 0.7 }, children: t }),
            !d && /* @__PURE__ */ e("span", { style: { fontSize: "11px", opacity: 0.8, color: "var(--tb-text-primary)" }, children: v === "OPEN_URL" ? `URL: ${y.url || "(vazio)"}` : v === "DEEPLINK" ? `Link: ${y.deeplink || "(vazio)"}` : v === "UI_ACTION" ? `Ação: ${y.actionName || "(vazia)"}` : v === "NAVIGATE" ? `Navegar: ${y.target || "(vazio)"}` : v })
          ] }),
          d ? /* @__PURE__ */ e(B.CaretDownOutlined, { style: { fontSize: "12px" } }) : /* @__PURE__ */ e(B.CaretRightOutlined, { style: { fontSize: "12px" } })
        ]
      }
    ),
    d && /* @__PURE__ */ r("div", { style: { padding: "10px", borderTop: "1px solid var(--tb-border-color)" }, children: [
      /* @__PURE__ */ r("div", { style: { marginBottom: "8px" }, children: [
        /* @__PURE__ */ e("label", { style: { fontSize: "10px" }, children: "Tipo de Ação" }),
        /* @__PURE__ */ r(
          "select",
          {
            value: v,
            onChange: (R) => s({ type: R.target.value, payload: {} }),
            style: { marginBottom: "4px" },
            children: [
              /* @__PURE__ */ e("option", { value: "OPEN_URL", children: "Abrir URL (Browser)" }),
              /* @__PURE__ */ e("option", { value: "DEEPLINK", children: "Deeplink (App)" }),
              /* @__PURE__ */ e("option", { value: "UI_ACTION", children: "Ação de UI (Social)" }),
              /* @__PURE__ */ e("option", { value: "NAVIGATE", children: "Navegação (Plataforma)" })
            ]
          }
        )
      ] }),
      v === "OPEN_URL" && /* @__PURE__ */ e(
        U,
        {
          label: "URL",
          value: y.url || "",
          fieldKey: `${m}_url`,
          selectedNode: p,
          onUpdateNode: (R, b) => {
            const E = `${m}_url`, i = b[E];
            s({ ...l, payload: { ...y, url: i } });
          },
          activeDynamicField: o,
          setActiveDynamicField: c,
          dynamicPopupRef: a
        }
      ),
      v === "DEEPLINK" && /* @__PURE__ */ e(
        U,
        {
          label: "Deeplink",
          value: y.deeplink || "",
          fieldKey: `${m}_deeplink`,
          selectedNode: p,
          onUpdateNode: (R, b) => {
            const E = `${m}_deeplink`, i = b[E];
            s({ ...l, payload: { ...y, deeplink: i } });
          },
          activeDynamicField: o,
          setActiveDynamicField: c,
          dynamicPopupRef: a
        }
      ),
      v === "UI_ACTION" && /* @__PURE__ */ r("div", { children: [
        /* @__PURE__ */ e("label", { style: { fontSize: "10px" }, children: "Nome da Ação" }),
        /* @__PURE__ */ r(
          "select",
          {
            value: y.actionName || "",
            onChange: (R) => s({ ...l, payload: { ...y, actionName: R.target.value } }),
            children: [
              /* @__PURE__ */ e("option", { value: "", children: "Selecione..." }),
              /* @__PURE__ */ e("option", { value: "like", children: "Curtir (Like)" }),
              /* @__PURE__ */ e("option", { value: "save", children: "Salvar (Favorite)" }),
              /* @__PURE__ */ e("option", { value: "share", children: "Compartilhar (Share)" }),
              /* @__PURE__ */ e("option", { value: "follow", children: "Seguir (Follow)" }),
              /* @__PURE__ */ e("option", { value: "report", children: "Denunciar (Report)" }),
              /* @__PURE__ */ e("option", { value: "open_profile", children: "Abrir Perfil" })
            ]
          }
        )
      ] }),
      v === "NAVIGATE" && /* @__PURE__ */ r("div", { children: [
        /* @__PURE__ */ e("label", { style: { fontSize: "10px" }, children: "Alvo (Target)" }),
        /* @__PURE__ */ r(
          "select",
          {
            value: y.target || "",
            onChange: (R) => s({ ...l, payload: { ...y, target: R.target.value } }),
            children: [
              /* @__PURE__ */ e("option", { value: "profile", children: "Perfil" }),
              /* @__PURE__ */ e("option", { value: "cart", children: "Carrinho" }),
              /* @__PURE__ */ e("option", { value: "settings", children: "Configurações" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
function wi({
  selectedNode: t,
  onUpdateNode: l,
  onClose: s
}) {
  const [o, c] = L(
    null
  ), a = ye(null), [p, m] = L(null);
  D(() => {
    function i(I) {
      a.current && !a.current.contains(I.target) && c(null);
    }
    return o && document.addEventListener("mousedown", i), () => {
      document.removeEventListener("mousedown", i);
    };
  }, [o]);
  const [d, $] = L({ x: 0, y: 0 }), [v, y] = L(!1), [h, R] = L("design"), b = ye({ x: 0, y: 0 });
  D(() => {
    if (!v) return;
    const i = (g) => {
      const z = g.clientX - b.current.x, A = g.clientY - b.current.y;
      $({ x: z, y: A });
    }, I = () => {
      y(!1);
    };
    return window.addEventListener("mousemove", i), window.addEventListener("mouseup", I), () => {
      window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", I);
    };
  }, [v]);
  const E = (i) => {
    i.target.closest("button, select, input") || (y(!0), b.current = {
      x: i.clientX - d.x,
      y: i.clientY - d.y
    });
  };
  return /* @__PURE__ */ r(
    "div",
    {
      className: "floating-properties-popup",
      onClick: (i) => i.stopPropagation(),
      style: {
        transform: `translate(${d.x}px, ${d.y}px)`,
        transition: v ? "none" : "transform 0.1s ease-out"
      },
      children: [
        /* @__PURE__ */ r(
          "div",
          {
            className: "popup-header",
            onMouseDown: E,
            style: { cursor: "move", userSelect: "none" },
            children: [
              /* @__PURE__ */ r("span", { children: [
                "Edit ",
                t.type
              ] }),
              /* @__PURE__ */ e(
                "button",
                {
                  onClick: s,
                  style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    lineHeight: 1
                  },
                  children: "×"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r("div", { className: "properties-tabs", children: [
          /* @__PURE__ */ e(
            "div",
            {
              className: `tab-item ${h === "design" ? "active" : ""}`,
              onClick: () => R("design"),
              children: "Design"
            }
          ),
          /* @__PURE__ */ e(
            "div",
            {
              className: `tab-item ${h === "config" ? "active" : ""}`,
              onClick: () => R("config"),
              children: "Config"
            }
          )
        ] }),
        /* @__PURE__ */ r("div", { className: "properties-panel", children: [
          t.type === "container" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r("div", { className: "prop-group", style: { borderTop: "none", marginTop: 0 }, children: [
              /* @__PURE__ */ r("div", { className: "dense-grid", children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Direction" }),
                  /* @__PURE__ */ r("div", { className: "segmented-control", children: [
                    /* @__PURE__ */ e(
                      "div",
                      {
                        className: `segmented-item ${t.direction === "row" ? "active" : ""}`,
                        onClick: () => l(t.id, { direction: "row" }),
                        title: "Row",
                        children: /* @__PURE__ */ e(B.ArrowRightOutlined, {})
                      }
                    ),
                    /* @__PURE__ */ e(
                      "div",
                      {
                        className: `segmented-item ${t.direction !== "row" ? "active" : ""}`,
                        onClick: () => l(t.id, { direction: "column" }),
                        title: "Column",
                        children: /* @__PURE__ */ e(B.ArrowDownOutlined, {})
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Gap" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.gap || "",
                      onChange: (i) => l(t.id, {
                        gap: i.target.value || void 0
                      }),
                      style: { marginBottom: 0 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ r("div", { className: "dense-grid", style: { marginTop: "8px" }, children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Justify" }),
                  /* @__PURE__ */ e("div", { className: "segmented-control", children: [
                    { val: "flex-start", icon: /* @__PURE__ */ e(B.AlignLeftOutlined, {}) },
                    { val: "center", icon: /* @__PURE__ */ e(B.AlignCenterOutlined, {}) },
                    { val: "flex-end", icon: /* @__PURE__ */ e(B.AlignRightOutlined, {}) },
                    { val: "space-between", icon: /* @__PURE__ */ e(B.ColumnWidthOutlined, {}) }
                  ].map((i) => /* @__PURE__ */ e(
                    "div",
                    {
                      className: `segmented-item ${t.justifyContent === i.val ? "active" : ""}`,
                      onClick: () => l(t.id, { justifyContent: i.val }),
                      children: i.icon
                    },
                    i.val
                  )) })
                ] }),
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Align" }),
                  /* @__PURE__ */ e("div", { className: "segmented-control", children: [
                    { val: "flex-start", icon: /* @__PURE__ */ e(B.VerticalAlignTopOutlined, {}) },
                    { val: "center", icon: /* @__PURE__ */ e(B.AlignCenterOutlined, {}) },
                    { val: "flex-end", icon: /* @__PURE__ */ e(B.VerticalAlignBottomOutlined, {}) },
                    { val: "stretch", icon: /* @__PURE__ */ e(B.FullscreenExitOutlined, {}) }
                  ].map((i) => /* @__PURE__ */ e(
                    "div",
                    {
                      className: `segmented-item ${t.alignItems === i.val ? "active" : ""}`,
                      onClick: () => l(t.id, { alignItems: i.val }),
                      children: i.icon
                    },
                    i.val
                  )) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ e("div", { className: "prop-group", children: /* @__PURE__ */ r("div", { className: "dense-grid", children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("label", { children: "Padding (H / V)" }),
                /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.paddingX || "",
                      onChange: (i) => l(t.id, { paddingX: i.target.value || void 0 }),
                      style: { marginBottom: 0, flex: 1 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "4" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "8" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "16" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "24" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.paddingY || "",
                      onChange: (i) => l(t.id, { paddingY: i.target.value || void 0 }),
                      style: { marginBottom: 0, flex: 1 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "4" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "8" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "16" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "24" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("label", { children: "Margin (H / V)" }),
                /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.marginX || "",
                      onChange: (i) => l(t.id, { marginX: i.target.value || void 0 }),
                      style: { marginBottom: 0, flex: 1 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "4" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "8" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "16" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "24" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.marginY || "",
                      onChange: (i) => l(t.id, { marginY: i.target.value || void 0 }),
                      style: { marginBottom: 0, flex: 1 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "4" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "8" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "16" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "24" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ r("div", { className: "prop-group", children: [
              /* @__PURE__ */ r("div", { className: "dense-grid", children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Background" }),
                  /* @__PURE__ */ e(
                    "select",
                    {
                      value: t.backgroundColor || "",
                      onChange: (i) => l(t.id, { backgroundColor: i.target.value }),
                      style: { marginBottom: 0 },
                      children: /* @__PURE__ */ e(se, { includeNone: !0 })
                    }
                  )
                ] }),
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Border" }),
                  /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                    /* @__PURE__ */ e(
                      "input",
                      {
                        type: "text",
                        placeholder: "W",
                        value: t.borderWidth || "",
                        onChange: (i) => l(t.id, { borderWidth: i.target.value }),
                        style: { marginBottom: 0, flex: 1, padding: "4px" }
                      }
                    ),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.borderStyle || "solid",
                        onChange: (i) => l(t.id, { borderStyle: i.target.value }),
                        style: { marginBottom: 0, flex: 1.5 },
                        children: [
                          /* @__PURE__ */ e("option", { value: "solid", children: "Solid" }),
                          /* @__PURE__ */ e("option", { value: "dashed", children: "Dash" }),
                          /* @__PURE__ */ e("option", { value: "dotted", children: "Dot" })
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ r("div", { className: "dense-grid", style: { marginTop: "8px" }, children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Border Color" }),
                  /* @__PURE__ */ e(
                    "select",
                    {
                      value: t.borderColor || "",
                      onChange: (i) => l(t.id, { borderColor: i.target.value }),
                      style: { marginBottom: 0 },
                      children: /* @__PURE__ */ e(se, { noneLabel: "None" })
                    }
                  )
                ] }),
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Radius" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.borderRadius || "",
                      onChange: (i) => l(t.id, { borderRadius: i.target.value }),
                      style: { marginBottom: 0 },
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "sm" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "md" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "lg" }),
                        /* @__PURE__ */ e("option", { value: "full", children: "full" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ e("div", { className: "prop-group", children: /* @__PURE__ */ r("div", { className: "dense-grid", children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("label", { children: "Width" }),
                /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "text",
                      placeholder: "Auto/100%",
                      value: t.width || "",
                      onChange: (i) => l(t.id, { width: i.target.value }),
                      style: { marginBottom: 0, flex: 1, fontSize: "11px" }
                    }
                  ),
                  /* @__PURE__ */ e("div", { style: { display: "flex", gap: "2px" }, children: ["auto", "100%"].map((i) => /* @__PURE__ */ e("button", { className: "size-chip", onClick: () => l(t.id, { width: i }), style: { padding: "2px 4px" }, children: i }, i)) })
                ] })
              ] }),
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("label", { children: "Height" }),
                /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "text",
                      placeholder: "Auto/100%",
                      value: t.height || "",
                      onChange: (i) => l(t.id, { height: i.target.value }),
                      style: { marginBottom: 0, flex: 1, fontSize: "11px" }
                    }
                  ),
                  /* @__PURE__ */ e("div", { style: { display: "flex", gap: "2px" }, children: ["auto", "100%"].map((i) => /* @__PURE__ */ e("button", { className: "size-chip", onClick: () => l(t.id, { height: i }), style: { padding: "2px 4px" }, children: i }, i)) })
                ] })
              ] })
            ] }) })
          ] }),
          t.type === "container" && h === "config" && /* @__PURE__ */ e("div", { className: "prop-group", style: { borderTop: "none", marginTop: 0 }, children: /* @__PURE__ */ e("div", { style: { color: "var(--tb-text-secondary)", fontSize: "12px", textAlign: "center", padding: "20px 0" }, children: "No configuration properties for this component." }) }),
          t.type === "text" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e("label", { children: "Typography" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.typography || "body",
                onChange: (i) => l(t.id, {
                  typography: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "body", children: "Body" }),
                  /* @__PURE__ */ e("option", { value: "caption", children: "Caption" }),
                  /* @__PURE__ */ e("option", { value: "heading1", children: "Heading 1" }),
                  /* @__PURE__ */ e("option", { value: "heading2", children: "Heading 2" }),
                  /* @__PURE__ */ e("option", { value: "heading3", children: "Heading 3" }),
                  /* @__PURE__ */ e("option", { value: "heading4", children: "Heading 4" }),
                  /* @__PURE__ */ e("option", { value: "heading5", children: "Heading 5" })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Color Token" }),
            /* @__PURE__ */ e(
              "select",
              {
                value: t.color || "",
                onChange: (i) => l(t.id, {
                  color: i.target.value
                }),
                children: /* @__PURE__ */ e(se, { includeNone: !1 })
              }
            ),
            /* @__PURE__ */ e("label", { children: "Font Weight (Override)" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.fontWeight || "",
                onChange: (i) => l(t.id, {
                  fontWeight: i.target.value || void 0
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "", children: "Default from Typography" }),
                  /* @__PURE__ */ e("option", { value: "normal", children: "Normal" }),
                  /* @__PURE__ */ e("option", { value: "semiBold", children: "Semi Bold" }),
                  /* @__PURE__ */ e("option", { value: "bold", children: "Bold" })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Text Align" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.textAlign || "left",
                onChange: (i) => l(t.id, {
                  textAlign: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "left", children: "Left" }),
                  /* @__PURE__ */ e("option", { value: "center", children: "Center" }),
                  /* @__PURE__ */ e("option", { value: "right", children: "Right" })
                ]
              }
            )
          ] }),
          t.type === "text" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Value",
                value: t.value || "",
                fieldKey: "value",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (Texto)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "text_action"
              }
            )
          ] }),
          t.type === "media" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px"
                },
                children: [
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Width" }),
                    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "text",
                          placeholder: "e.g. 100%",
                          value: t.width || "",
                          onChange: (i) => l(t.id, {
                            width: i.target.value
                          }),
                          style: { marginBottom: "4px" }
                        }
                      ),
                      /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { width: "auto" }),
                            children: "Auto"
                          }
                        ),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { width: "100%" }),
                            children: "100%"
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Height" }),
                    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "text",
                          placeholder: "e.g. 300px",
                          value: t.height || "",
                          onChange: (i) => l(t.id, {
                            height: i.target.value
                          }),
                          style: { marginBottom: "4px" }
                        }
                      ),
                      /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { height: "auto" }),
                            children: "Auto"
                          }
                        ),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            style: {
                              backgroundColor: t.height === "100%" ? "#dbeafe" : void 0,
                              borderColor: t.height === "100%" ? "#3b82f6" : void 0
                            },
                            onClick: () => l(t.id, { height: "100%" }),
                            children: "Fill"
                          }
                        )
                      ] })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { style: { marginTop: "12px" }, children: "Object Fit" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.objectFit || "cover",
                onChange: (i) => l(t.id, {
                  objectFit: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "cover", children: "Cover (Fill)" }),
                  /* @__PURE__ */ e("option", { value: "contain", children: "Contain (Fit)" }),
                  /* @__PURE__ */ e("option", { value: "fill", children: "Stretch" }),
                  /* @__PURE__ */ e("option", { value: "scale-down", children: "Scale Down" }),
                  /* @__PURE__ */ e("option", { value: "none", children: "None" })
                ]
              }
            )
          ] }),
          t.type === "media" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Mídia URL",
                value: t.url || "",
                fieldKey: "url",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e("label", { children: "Alt Text" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "text",
                value: t.alt || "",
                onChange: (i) => l(t.id, {
                  alt: i.target.value
                })
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (Mídia)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "media_action"
              }
            )
          ] }),
          t.type === "html" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px"
                },
                children: [
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Padding X" }),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.paddingX || "",
                        onChange: (i) => l(t.id, {
                          paddingX: i.target.value || void 0
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "", children: "None" }),
                          /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                          /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                          /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                          /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                          /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Padding Y" }),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.paddingY || "",
                        onChange: (i) => l(t.id, {
                          paddingY: i.target.value || void 0
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "", children: "None" }),
                          /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                          /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                          /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                          /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                          /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "16px"
                },
                children: [
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Width" }),
                    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "text",
                          placeholder: "e.g. 100%",
                          value: t.width || "",
                          onChange: (i) => l(t.id, {
                            width: i.target.value
                          }),
                          style: { marginBottom: "4px" }
                        }
                      ),
                      /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { width: "auto" }),
                            children: "Auto"
                          }
                        ),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { width: "100%" }),
                            children: "100%"
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Height" }),
                    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: [
                      /* @__PURE__ */ e(
                        "input",
                        {
                          type: "text",
                          placeholder: "e.g. 300px",
                          value: t.height || "",
                          onChange: (i) => l(t.id, {
                            height: i.target.value
                          }),
                          style: { marginBottom: "4px" }
                        }
                      ),
                      /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: [
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            onClick: () => l(t.id, { height: "auto" }),
                            children: "Auto"
                          }
                        ),
                        /* @__PURE__ */ e(
                          "button",
                          {
                            className: "size-chip",
                            style: {
                              backgroundColor: t.height === "100%" ? "#dbeafe" : void 0,
                              borderColor: t.height === "100%" ? "#3b82f6" : void 0
                            },
                            onClick: () => l(t.id, { height: "100%" }),
                            children: "Fill"
                          }
                        )
                      ] })
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          t.type === "html" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r("div", { style: { marginBottom: "12px", position: "relative" }, children: [
              /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ e("label", { style: { marginBottom: "4px" }, children: "Custom HTML" }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: (i) => {
                          i.stopPropagation(), c(o === "html" ? null : "html");
                        },
                        style: {
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "var(--tb-primary-color)",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px"
                        },
                        title: "Dynamic Tags",
                        children: [
                          /* @__PURE__ */ e("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ e("path", { d: "M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4zm0 4c-5.52 0-10 2.69-10 6s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zm0 10c-4.41 0-8-1.79-8-4s3.59-4 8-4 8 1.79 8 4-3.59 4-8 4z" }) }),
                          "Dynamic"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ e(
                "textarea",
                {
                  rows: 8,
                  value: t.html || "",
                  onChange: (i) => l(t.id, { html: i.target.value }),
                  style: {
                    width: "100%",
                    padding: "8px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    borderRadius: "4px",
                    border: "1px solid var(--tb-border-color)",
                    background: "white",
                    resize: "vertical"
                  }
                }
              ),
              o === "html" && /* @__PURE__ */ e(
                "div",
                {
                  ref: a,
                  style: {
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "var(--tb-bg-panel)",
                    border: "1px solid var(--tb-border-color)",
                    borderRadius: "4px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    zIndex: 101,
                    width: "180px",
                    overflow: "hidden"
                  },
                  children: ut.map((i) => /* @__PURE__ */ e(
                    "div",
                    {
                      onClick: () => {
                        const I = t.html || "";
                        l(t.id, {
                          html: I + i.value
                        }), c(null);
                      },
                      style: {
                        padding: "8px 12px",
                        fontSize: "11px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--tb-border-color)",
                        color: "var(--tb-text-primary)"
                      },
                      className: "dynamic-tag-item",
                      children: i.label
                    },
                    i.value
                  ))
                }
              )
            ] }),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (HTML)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "html_action"
              }
            )
          ] }),
          t.type === "button" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e("label", { children: "Variant" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.variant || "primary",
                onChange: (i) => l(t.id, {
                  variant: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "primary", children: "Primary" }),
                  /* @__PURE__ */ e("option", { value: "secondary", children: "Secondary" }),
                  /* @__PURE__ */ e("option", { value: "outline", children: "Outline" }),
                  /* @__PURE__ */ e("option", { value: "ghost", children: "Ghost" })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Radius" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.radius || "md",
                onChange: (i) => l(t.id, {
                  radius: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "sm", children: "sm (4px)" }),
                  /* @__PURE__ */ e("option", { value: "md", children: "md (8px)" }),
                  /* @__PURE__ */ e("option", { value: "lg", children: "lg (16px)" }),
                  /* @__PURE__ */ e("option", { value: "full", children: "full (circular)" })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Size" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.size || "md",
                onChange: (i) => l(t.id, {
                  size: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "xs", children: "Extra Small" }),
                  /* @__PURE__ */ e("option", { value: "sm", children: "Small" }),
                  /* @__PURE__ */ e("option", { value: "md", children: "Medium" }),
                  /* @__PURE__ */ e("option", { value: "lg", children: "Large" }),
                  /* @__PURE__ */ e("option", { value: "xl", children: "Extra Large" }),
                  /* @__PURE__ */ e("option", { value: "xxl", children: "Huge" })
                ]
              }
            ),
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.fullWidth || !1,
                      onChange: (i) => l(t.id, {
                        fullWidth: i.target.checked
                      }),
                      style: { width: "auto", marginBottom: 0 }
                    }
                  ),
                  "Full Width"
                ]
              }
            )
          ] }),
          t.type === "button" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Button Label",
                value: t.label || "",
                fieldKey: "label",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação (Primary Click)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "button_action"
              }
            )
          ] }),
          t.type === "icon" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e("label", { children: "Size (px)" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                value: t.size || 24,
                onChange: (i) => l(t.id, {
                  size: parseInt(i.target.value) || 24
                })
              }
            ),
            /* @__PURE__ */ e("label", { children: "Padding" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.padding || "",
                onChange: (i) => l(t.id, {
                  padding: i.target.value || void 0
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "", children: "None" }),
                  /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                  /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                  /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Background Color" }),
            /* @__PURE__ */ e(
              "select",
              {
                value: t.backgroundColor || "",
                onChange: (i) => l(t.id, {
                  backgroundColor: i.target.value || void 0
                }),
                children: /* @__PURE__ */ e(se, { noneLabel: "Transparent" })
              }
            ),
            /* @__PURE__ */ e("label", { children: "Border Radius" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.borderRadius || "",
                onChange: (i) => l(t.id, {
                  borderRadius: i.target.value || void 0
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "", children: "None" }),
                  /* @__PURE__ */ e("option", { value: "sm", children: "sm (4px)" }),
                  /* @__PURE__ */ e("option", { value: "md", children: "md (8px)" }),
                  /* @__PURE__ */ e("option", { value: "lg", children: "lg (16px)" }),
                  /* @__PURE__ */ e("option", { value: "full", children: "full (circular)" })
                ]
              }
            )
          ] }),
          t.type === "icon" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e("label", { children: "Icon Identifier" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.icon || "star",
                onChange: (i) => l(t.id, {
                  icon: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "star", children: "Star" }),
                  /* @__PURE__ */ e("option", { value: "user", children: "User" }),
                  /* @__PURE__ */ e("option", { value: "heart", children: "Heart" }),
                  /* @__PURE__ */ e("option", { value: "bookmark", children: "Bookmark" }),
                  /* @__PURE__ */ e("option", { value: "share", children: "Share" }),
                  /* @__PURE__ */ e("option", { value: "camera", children: "Camera" }),
                  /* @__PURE__ */ e("option", { value: "settings", children: "Settings" }),
                  /* @__PURE__ */ e("option", { value: "home", children: "Home" }),
                  /* @__PURE__ */ e("option", { value: "search", children: "Search" }),
                  /* @__PURE__ */ e("option", { value: "bell", children: "Bell" }),
                  /* @__PURE__ */ e("option", { value: "shoppingbag", children: "Shopping Bag" })
                ]
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (Ícone)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "icon_action"
              }
            )
          ] }),
          t.type === "divider" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e("label", { children: "Thickness" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.thickness || "medium",
                onChange: (i) => l(t.id, {
                  thickness: i.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "thin", children: "Thin (0.5px)" }),
                  /* @__PURE__ */ e("option", { value: "medium", children: "Medium (1px)" }),
                  /* @__PURE__ */ e("option", { value: "thick", children: "Thick (2px)" })
                ]
              }
            )
          ] }),
          t.type === "divider" && h === "config" && /* @__PURE__ */ e("div", { style: { textAlign: "center", padding: "20px", opacity: 0.5 }, children: "No configuration available" }),
          t.type === "post_interactions" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginBottom: "12px"
                },
                children: [
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Padding X" }),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.paddingX || "",
                        onChange: (i) => l(t.id, {
                          paddingX: i.target.value || void 0
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "", children: "None" }),
                          /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                          /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                          /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                          /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                          /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" }),
                          /* @__PURE__ */ e("option", { value: "xxl", children: "xxl (48px)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Padding Y" }),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.paddingY || "",
                        onChange: (i) => l(t.id, {
                          paddingY: i.target.value || void 0
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "", children: "Default (12px)" }),
                          /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                          /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                          /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                          /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                          /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" }),
                          /* @__PURE__ */ e("option", { value: "xxl", children: "xxl (48px)" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { children: "Gap between Icons" }),
            /* @__PURE__ */ r(
              "select",
              {
                value: t.gap || "",
                onChange: (i) => l(t.id, {
                  gap: i.target.value || void 0
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "", children: "Default (16px)" }),
                  /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                  /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                  /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                  /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                  /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" }),
                  /* @__PURE__ */ e("option", { value: "xxl", children: "xxl (48px)" })
                ]
              }
            )
          ] }),
          t.type === "post_interactions" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.showLike !== !1,
                      onChange: (i) => l(t.id, {
                        showLike: i.target.checked
                      }),
                      style: { width: "auto", margin: 0 }
                    }
                  ),
                  "Show Like Icon"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.showSave !== !1,
                      onChange: (i) => l(t.id, {
                        showSave: i.target.checked
                      }),
                      style: { width: "auto", margin: 0 }
                    }
                  ),
                  "Show Save Icon"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.showShare !== !1,
                      onChange: (i) => l(t.id, {
                        showShare: i.target.checked
                      }),
                      style: { width: "auto", margin: 0 }
                    }
                  ),
                  "Show Share Icon"
                ]
              }
            )
          ] }),
          t.type === "price" && h === "design" && /* @__PURE__ */ e(M, { children: /* @__PURE__ */ r(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px"
              },
              children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Padding X" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.paddingX || "",
                      onChange: (i) => l(t.id, {
                        paddingX: i.target.value || void 0
                      }),
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "None" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                        /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" }),
                        /* @__PURE__ */ e("option", { value: "xxl", children: "xxl (48px)" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("label", { children: "Padding Y" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: t.paddingY || "",
                      onChange: (i) => l(t.id, {
                        paddingY: i.target.value || void 0
                      }),
                      children: [
                        /* @__PURE__ */ e("option", { value: "", children: "Default (8px)" }),
                        /* @__PURE__ */ e("option", { value: "xs", children: "xs (4px)" }),
                        /* @__PURE__ */ e("option", { value: "sm", children: "sm (8px)" }),
                        /* @__PURE__ */ e("option", { value: "md", children: "md (16px)" }),
                        /* @__PURE__ */ e("option", { value: "lg", children: "lg (24px)" }),
                        /* @__PURE__ */ e("option", { value: "xl", children: "xl (32px)" }),
                        /* @__PURE__ */ e("option", { value: "xxl", children: "xxl (48px)" })
                      ]
                    }
                  )
                ] })
              ]
            }
          ) }),
          t.type === "price" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Price",
                value: t.price || "",
                fieldKey: "price",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              U,
              {
                label: "Original Price",
                value: t.originalPrice || "",
                fieldKey: "originalPrice",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              U,
              {
                label: "Discount %(e.g. 25)",
                value: t.discountPercent || "",
                fieldKey: "discountPercent",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e("hr", { style: { margin: "16px 0", opacity: 0.1 } }),
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.showOriginalPrice !== !1,
                      onChange: (i) => l(t.id, {
                        showOriginalPrice: i.target.checked
                      }),
                      style: { width: "auto", margin: 0 }
                    }
                  ),
                  "Show Original Price"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "label",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: t.showDiscountPercent !== !1,
                      onChange: (i) => l(t.id, {
                        showDiscountPercent: i.target.checked
                      }),
                      style: { width: "auto", margin: 0 }
                    }
                  ),
                  "Show Percent Tag"
                ]
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (Preço)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "price_action"
              }
            )
          ] }),
          t.type === "avatar" && h === "design" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "12px"
                },
                children: [
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Size (px)" }),
                    /* @__PURE__ */ e(
                      "input",
                      {
                        type: "number",
                        value: t.size || 40,
                        onChange: (i) => l(t.id, {
                          size: parseInt(i.target.value) || 0
                        })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r("div", { children: [
                    /* @__PURE__ */ e("label", { children: "Radius" }),
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: t.borderRadius || "full",
                        onChange: (i) => l(t.id, {
                          borderRadius: i.target.value
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "none", children: "None" }),
                          /* @__PURE__ */ e("option", { value: "sm", children: "sm (4px)" }),
                          /* @__PURE__ */ e("option", { value: "md", children: "md (8px)" }),
                          /* @__PURE__ */ e("option", { value: "lg", children: "lg (16px)" }),
                          /* @__PURE__ */ e("option", { value: "full", children: "full" })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e("label", { style: { marginTop: "12px" }, children: "Background" }),
            /* @__PURE__ */ e(
              "select",
              {
                value: t.backgroundColor || "",
                onChange: (i) => l(t.id, {
                  backgroundColor: i.target.value
                }),
                children: /* @__PURE__ */ e(se, { noneLabel: "Gray 100" })
              }
            )
          ] }),
          t.type === "avatar" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Avatar URL",
                value: t.url || "",
                fieldKey: "url",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e("label", { children: "Fallback Icon" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "text",
                value: t.icon || "user",
                onChange: (i) => l(t.id, {
                  icon: i.target.value
                }),
                placeholder: "user, shoppingbag, heart..."
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Ação de Clique (Avatar)",
                action: t.action,
                onUpdate: (i) => l(t.id, { action: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "avatar_action"
              }
            )
          ] }),
          t.type === "header" && h === "design" && /* @__PURE__ */ e("div", { style: { textAlign: "center", padding: "20px", opacity: 0.5, color: "var(--tb-text-secondary)" }, children: "Header uses system-defined layout" }),
          t.type === "header" && h === "config" && /* @__PURE__ */ r(M, { children: [
            /* @__PURE__ */ e(
              U,
              {
                label: "Image URL",
                value: t.imageUrl || "",
                fieldKey: "imageUrl",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              U,
              {
                label: "Shopping Name",
                value: t.title || "",
                fieldKey: "title",
                selectedNode: t,
                onUpdateNode: l,
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a
              }
            ),
            /* @__PURE__ */ e(
              ee,
              {
                label: "Clique no Perfil (Header)",
                action: t.onProfilePress,
                onUpdate: (i) => l(t.id, { onProfilePress: i }),
                activeDynamicField: o,
                setActiveDynamicField: c,
                dynamicPopupRef: a,
                selectedNode: t,
                parentId: "header_profile_action"
              }
            ),
            /* @__PURE__ */ r("div", { style: { marginTop: "16px" }, children: [
              /* @__PURE__ */ r("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }, children: [
                /* @__PURE__ */ e("label", { style: { fontWeight: 600 }, children: "Menu Items" }),
                /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const i = [...t.menuItems || []];
                      i.push({ icon: "star", text: "Novo item", action: { type: "OPEN_URL", payload: { url: "" } } }), l(t.id, { menuItems: i });
                    },
                    style: {
                      background: "var(--tb-primary-color)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: 600
                    },
                    children: "+ Adicionar"
                  }
                )
              ] }),
              (t.menuItems || []).map((i, I) => {
                const g = p === I;
                return /* @__PURE__ */ r(
                  "div",
                  {
                    style: {
                      border: "1px solid var(--tb-border-color)",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      background: "var(--tb-bg-panel)",
                      overflow: "hidden"
                    },
                    children: [
                      /* @__PURE__ */ r(
                        "div",
                        {
                          onClick: () => m(g ? null : I),
                          style: {
                            padding: "8px 12px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: g ? "rgba(0,0,0,0.05)" : "transparent"
                          },
                          children: [
                            /* @__PURE__ */ r("span", { style: { fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }, children: [
                              g ? /* @__PURE__ */ e(B.CaretDownOutlined, {}) : /* @__PURE__ */ e(B.CaretRightOutlined, {}),
                              i.text || `Item ${I + 1}`
                            ] }),
                            /* @__PURE__ */ e(
                              "button",
                              {
                                type: "button",
                                onClick: (z) => {
                                  z.stopPropagation();
                                  const A = [...t.menuItems || []];
                                  A.splice(I, 1), l(t.id, { menuItems: A }), p === I && m(null);
                                },
                                style: {
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  color: "#ef4444",
                                  padding: "4px"
                                },
                                title: "Remover item",
                                children: /* @__PURE__ */ e(B.DeleteOutlined, {})
                              }
                            )
                          ]
                        }
                      ),
                      g && /* @__PURE__ */ r("div", { style: { padding: "8px", display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid var(--tb-border-color)" }, children: [
                        /* @__PURE__ */ r("div", { style: { display: "grid", gridTemplateColumns: "80px 1fr", gap: "8px" }, children: [
                          /* @__PURE__ */ r("div", { children: [
                            /* @__PURE__ */ e("label", { style: { fontSize: "10px", margin: 0, opacity: 0.7 }, children: "Ícone" }),
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "text",
                                placeholder: "Ex: user",
                                value: i.icon,
                                style: { margin: 0, padding: "4px" },
                                onChange: (z) => {
                                  const A = [...t.menuItems || []];
                                  A[I] = { ...A[I], icon: z.target.value }, l(t.id, { menuItems: A });
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ r("div", { children: [
                            /* @__PURE__ */ e("label", { style: { fontSize: "10px", margin: 0, opacity: 0.7 }, children: "Texto" }),
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "text",
                                placeholder: "Texto",
                                value: i.text,
                                style: { margin: 0, padding: "4px" },
                                onChange: (z) => {
                                  const A = [...t.menuItems || []];
                                  A[I] = { ...A[I], text: z.target.value }, l(t.id, { menuItems: A });
                                }
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ e(
                          ee,
                          {
                            label: "Ação do Item",
                            action: i.action,
                            onUpdate: (z) => {
                              const A = [...t.menuItems || []];
                              A[I] = { ...A[I], action: z }, l(t.id, { menuItems: A });
                            },
                            activeDynamicField: o,
                            setActiveDynamicField: c,
                            dynamicPopupRef: a,
                            selectedNode: t,
                            parentId: `menu_item_${I}`
                          }
                        )
                      ] })
                    ]
                  },
                  I
                );
              })
            ] })
          ] })
        ] })
      ]
    }
  );
}
const { Content: Je, Sider: ki } = ze;
function Ti() {
  const t = qe(), { id: l } = St(), s = H(
    (u) => u.upsertTemplate
  ), o = H(
    (u) => u.persistGlobalTheme
  );
  D(() => {
    if (l === "new") {
      const u = `template-${Date.now()}`;
      t(`/template-builder/editor/${u}`, { replace: !0 });
    }
  }, [l, t]);
  const [c, a] = L("");
  D(() => {
    async function u() {
      if (!l || l === "new") {
        a("");
        return;
      }
      const w = (await st()).find((P) => P.id === l);
      a(
        (w == null ? void 0 : w.title) ?? (l === "dermage" ? "Template Dermage" : `Template ${l.replace("template-", "#")}`)
      );
    }
    u();
  }, [l]);
  const p = (u) => {
    a(u);
  }, [m, d] = L(!0), [$, v] = L(!1), [y, h] = L([]), [R, b] = L(null), [E, i] = L(""), [I, g] = L(!0), [z, A] = L(q), [Y, Z] = L(!1), [k, n] = L(!0), [T, C] = L(!1);
  D(() => {
    async function u() {
      if (n(!0), h([]), a(""), i(""), b(null), !l || l === "new") {
        h([]), i(""), g(!0), C(!1);
        const f = await Be();
        A(f), n(!1);
        return;
      }
      try {
        const f = await hi(l);
        h(f.components || []), a(
          f.title || (l === "dermage" ? "Template Dermage" : `Template ${l.replace("template-", "#")}`)
        ), i(f.slug || ""), g(f.enabled !== !1), A(f.theme || q), C(f.found);
      } catch (f) {
        console.error("Error loading template data:", f), X.error("Erro ao carregar o template.");
      } finally {
        n(!1);
      }
    }
    u();
  }, [l]);
  const [x, O] = L(null), [S, re] = L(null), j = Ce(
    (u) => {
      h((f) => typeof u == "function" ? u(f) : u);
    },
    [h]
  ), V = Ce(
    (u, f, w) => u.map((P) => P.id === f ? { ...P, ...w } : "blocks" in P && P.blocks ? {
      ...P,
      blocks: V(P.blocks, f, w)
    } : P),
    []
  ), ht = (u, f) => {
    j((w) => V(w, u, f));
  }, he = Ce(
    (u, f) => u.filter((w) => w.id !== f).map((w) => "blocks" in w && w.blocks ? {
      ...w,
      blocks: he(w.blocks, f)
    } : w),
    []
  ), me = (u) => {
    b(u);
  }, ne = (u, f) => {
    for (const w of u) {
      if (w.id === f) return w;
      if ("blocks" in w && w.blocks) {
        const P = ne(w.blocks, f);
        if (P) return P;
      }
    }
    return null;
  }, Re = R ? ne(y, R) : null;
  D(() => {
    const u = (f) => {
      if (!R) return;
      const w = f.target;
      w.tagName === "INPUT" || w.tagName === "TEXTAREA" || w.tagName === "SELECT" || w.isContentEditable || (f.key === "Delete" || f.key === "Backspace") && (f.preventDefault(), j(
        (P) => he(P, R)
      ), me(null));
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [R, he, j]);
  const Oe = async () => {
    if (!l) return;
    const u = {
      id: l,
      title: c,
      active: I,
      slug: E,
      template: y
    };
    try {
      T ? await pt(u) : (await ct(u), C(!0)), s(u), X.success("Layout salvo com sucesso! ✅");
    } catch (f) {
      console.error("Error saving template:", f), X.error("Erro ao salvar o layout. ❌");
    }
  }, mt = (u) => {
    var f;
    try {
      let w = u.trim();
      w.startsWith("```") && (w = w.replace(/^```[a-z]*\n/i, "").replace(/\n```$/m, ""));
      const P = JSON.parse(w);
      let F = [];
      return Array.isArray(P) ? F = P : P.template && Array.isArray(P.template) ? (F = P.template, P.title && a(P.title), P.slug && i(P.slug), P.active !== void 0 && g(P.active)) : P.components && Array.isArray(P.components) ? F = P.components : (f = P.config) != null && f.components && Array.isArray(P.config.components) && (F = P.config.components), F && F.length > 0 ? (h(F), X.success("JSON importado com sucesso! 🚀"), !0) : (X.error(
        "Não encontramos uma lista de componentes válida no JSON."
      ), !1);
    } catch (w) {
      console.error("Import error:", w);
      const P = w instanceof Error ? w.message : "Erro desconhecido";
      return X.error(`Erro na sintaxe do JSON: ${P}`), !1;
    }
  }, gt = (u, f) => {
    u.dataTransfer.setData("componentType", f);
  }, ft = (u) => {
    u.preventDefault(), v(!0);
  }, yt = (u) => {
    u.preventDefault(), v(!1);
  }, xt = (u, f) => {
    u.stopPropagation(), u.dataTransfer.setData("draggedNodeId", f);
  }, vt = (u, f) => {
    u.preventDefault(), u.stopPropagation();
    const P = u.currentTarget.getBoundingClientRect(), F = u.clientY - P.top, ie = ne(y, f), K = ie && ie.type === "container";
    let W = "inside";
    if (K) {
      const J = P.height * 0.25;
      F < J ? W = "top" : F > P.height - J ? W = "bottom" : W = "inside";
    } else
      F < P.height / 2 ? W = "top" : W = "bottom";
    O(f), re(W);
  }, bt = (u) => {
    u.stopPropagation(), O(null), re(null);
  }, Ct = (u, f) => {
    const w = ne(y, u);
    return w ? u === f ? !0 : "blocks" in w && w.blocks ? !!ne(w.blocks, f) : !1 : !1;
  }, $e = (u, f) => {
    if (u === f || Ct(u, f)) return;
    const w = ne(y, u);
    if (!w) return;
    const P = he(y, u);
    if (f === "canvas") {
      j([...P, w]);
      return;
    }
    const F = (ie) => {
      const K = [];
      for (const W of ie)
        W.id === f ? S === "inside" && W.type === "container" ? K.push({
          ...W,
          blocks: [...W.blocks || [], w]
        }) : S === "top" ? (K.push(w), K.push(W)) : (K.push(W), K.push(w)) : "blocks" in W && W.blocks ? K.push({
          ...W,
          blocks: F(W.blocks)
        }) : K.push(W);
      return K;
    };
    j(F(P));
  }, wt = (u, f) => {
    u.preventDefault(), u.stopPropagation(), O(null), re(null);
    const w = u.dataTransfer.getData("draggedNodeId"), P = u.dataTransfer.getData("componentType");
    if (w)
      $e(w, f);
    else if (P) {
      const F = _e(P), ie = (K) => {
        const W = [];
        for (const J of K)
          J.id === f ? S === "inside" && J.type === "container" ? W.push({
            ...J,
            blocks: [...J.blocks || [], F]
          }) : S === "top" ? (W.push(F), W.push(J)) : (W.push(J), W.push(F)) : "blocks" in J && J.blocks ? W.push({
            ...J,
            blocks: ie(J.blocks)
          }) : W.push(J);
        return W;
      };
      j(ie(y)), b(F.id);
    }
  }, kt = (u) => {
    u.preventDefault(), v(!1);
    const f = u.dataTransfer.getData("draggedNodeId"), w = u.dataTransfer.getData("componentType");
    if (f)
      $e(f, "canvas");
    else if (w) {
      const P = _e(w);
      j([...y, P]);
    }
  }, _e = (u) => {
    const f = { id: yi(), type: u };
    switch (u) {
      case "container":
        return {
          ...f,
          blocks: [],
          direction: "column",
          paddingX: "md",
          paddingY: "md"
        };
      case "price":
        return {
          ...f,
          price: "R$ 99,90",
          originalPrice: "R$ 149,90",
          discountPercent: "33",
          showOriginalPrice: !0,
          showDiscountPercent: !0
        };
      case "text":
        return {
          ...f,
          value: "Novo Texto",
          typography: "body",
          color: "gray-900"
        };
      case "media":
        return {
          ...f,
          url: "",
          alt: "Mídia",
          width: "100%",
          height: "200px"
        };
      case "icon":
        return {
          ...f,
          icon: "star",
          size: 24,
          padding: "xs",
          backgroundColor: void 0,
          borderRadius: "full"
        };
      case "button":
        return {
          ...f,
          label: "Clique Aqui",
          variant: "primary",
          radius: "md"
        };
      case "post_interactions":
        return {
          ...f,
          showLike: !0,
          showSave: !0,
          showShare: !0,
          onLike: {
            type: "UI_ACTION",
            payload: { actionName: "like" }
          },
          onSave: {
            type: "UI_ACTION",
            payload: { actionName: "save" }
          },
          onShare: {
            type: "UI_ACTION",
            payload: { actionName: "share" }
          }
        };
      case "avatar":
        return {
          ...f,
          url: "{{post.profile.iconUrl}}",
          icon: "user",
          size: 40,
          backgroundColor: "gray-100",
          borderRadius: "full"
        };
      case "header":
        return {
          ...f,
          imageUrl: "{{post.profile.iconUrl}}",
          title: "{{post.profile.accountName}}",
          menuItems: [
            { icon: "info", text: "Sobre esta conta", link: "" },
            { icon: "user", text: "Seguir", link: "" }
          ]
        };
      default:
        return f;
    }
  };
  return /* @__PURE__ */ r(Je, { className: "tb-root cockpit-content-align flex flex-col h-full bg-[#f8fafc]", children: [
    /* @__PURE__ */ r("div", { className: "bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4", children: [
      /* @__PURE__ */ e(
        G,
        {
          icon: /* @__PURE__ */ e(Gt, {}),
          onClick: () => t("/template-builder/list"),
          type: "text",
          size: "small",
          className: "flex-shrink-0 text-gray-400 hover:text-gray-700"
        }
      ),
      /* @__PURE__ */ e(
        pe,
        {
          addonBefore: /* @__PURE__ */ e("span", { className: "text-xs text-gray-400", children: "Nome" }),
          value: c,
          onChange: (u) => p(u.target.value),
          placeholder: "Nome do template...",
          disabled: k,
          className: "w-[260px] flex-shrink-0 text-sm [&_.ant-input-group-addon]:bg-gray-50 [&_.ant-input-group-addon]:border-gray-200 [&_.ant-input]:border-gray-200 [&_.ant-input-group-wrapper]:shadow-none"
        }
      ),
      /* @__PURE__ */ e("div", { className: "h-5 w-px bg-gray-200 flex-shrink-0" }),
      /* @__PURE__ */ e(
        pe,
        {
          addonBefore: /* @__PURE__ */ e("span", { className: "text-xs text-gray-400", children: "Slug" }),
          prefix: /* @__PURE__ */ e("span", { className: "text-gray-300 text-xs font-mono", children: "/" }),
          value: E,
          onChange: (u) => i(u.target.value),
          placeholder: "meu-template",
          disabled: k,
          className: "w-[210px] flex-shrink-0 text-xs font-mono [&_.ant-input-group-addon]:bg-gray-50 [&_.ant-input-group-addon]:border-gray-200 [&_.ant-input]:border-gray-200 [&_.ant-input-group-wrapper]:shadow-none"
        }
      ),
      /* @__PURE__ */ e("div", { className: "flex-1" }),
      /* @__PURE__ */ r("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
        /* @__PURE__ */ r("div", { className: "flex items-center gap-2 pr-2 border-r border-gray-200", children: [
          /* @__PURE__ */ e(
            Ut,
            {
              size: "small",
              checked: I,
              onChange: g,
              disabled: k
            }
          ),
          /* @__PURE__ */ e(de.Text, { className: "text-[11px] font-medium text-gray-500 select-none", children: I ? "Ativo" : "Inativo" })
        ] }),
        /* @__PURE__ */ e(
          G,
          {
            icon: /* @__PURE__ */ e(Ee, {}),
            onClick: () => Z(!0),
            className: "text-gray-600",
            disabled: k,
            children: "Editar Tema Global"
          }
        ),
        /* @__PURE__ */ e(
          G,
          {
            type: "primary",
            icon: /* @__PURE__ */ e(Yt, {}),
            onClick: Oe,
            className: "bg-primary shadow-sm",
            disabled: k,
            children: "Salvar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ r(ze, { className: "flex-1 min-h-0 bg-transparent relative", children: [
      k && /* @__PURE__ */ e("div", { className: "absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm", children: /* @__PURE__ */ e(Dt, { size: "large" }) }),
      /* @__PURE__ */ e(
        ki,
        {
          width: 280,
          theme: "light",
          className: "border-r border-gray-200 overflow-y-auto",
          style: { background: "#fff" },
          children: /* @__PURE__ */ e(
            vi,
            {
              onDragStart: gt,
              activeTab: $ ? "elements" : void 0,
              onImportJson: mt
            }
          )
        }
      ),
      /* @__PURE__ */ e(
        Je,
        {
          className: "relative flex flex-col items-center justify-start p-8",
          onClick: () => me(null),
          children: /* @__PURE__ */ e(
            Ci,
            {
              showGuides: m,
              setShowGuides: d,
              components: y,
              theme: z,
              selectedNodeId: R,
              isDragOver: $,
              dragOverNodeId: x,
              dragPosition: S,
              onSelectNode: me,
              onDragOver: ft,
              onDragLeave: yt,
              onDrop: kt,
              onDragStartNode: xt,
              onDragOverNode: vt,
              onDragLeaveNode: bt,
              onDropNode: wt,
              onSave: Oe,
              templateName: c,
              onRenameTemplate: p,
              children: Re && /* @__PURE__ */ e(
                wi,
                {
                  selectedNode: Re,
                  onUpdateNode: ht,
                  onClose: () => me(null)
                }
              )
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ e(
      nt,
      {
        open: Y,
        onClose: () => Z(!1),
        theme: z,
        onThemeChange: async (u) => {
          A(u), await o(u);
        }
      }
    )
  ] });
}
function _i() {
  return /* @__PURE__ */ r(It, { children: [
    /* @__PURE__ */ e(we, { index: !0, element: /* @__PURE__ */ e(Pt, { to: "list", replace: !0 }) }),
    /* @__PURE__ */ e(we, { path: "list", element: /* @__PURE__ */ e(fi, {}) }),
    /* @__PURE__ */ e(we, { path: "editor/:id", element: /* @__PURE__ */ e(Ti, {}) })
  ] });
}
function Wi() {
  const t = H((a) => a.templates), l = H((a) => a.globalTheme), s = H((a) => a.hydrateCatalog), o = H((a) => a.templatesStatus), c = H((a) => a.themeStatus);
  return D(() => {
    s();
  }, [s]), {
    templates: t,
    globalTheme: l,
    isLoading: o === "loading" || c === "loading"
  };
}
const ji = {
  id: "template-builder-empty-state",
  title: "Post Empty State",
  slug: "post-empty-state",
  active: !0,
  template: [
    {
      id: "empty-root",
      type: "container",
      direction: "column",
      backgroundColor: "white",
      blocks: [
        {
          id: "empty-header",
          type: "header",
          imageUrl: "{{post.profile.iconUrl}}",
          title: "{{post.profile.accountName}}",
          menuItems: [
            {
              icon: "more",
              text: "Mais"
            }
          ]
        },
        {
          id: "empty-media",
          type: "media",
          url: "{{post.url}}",
          alt: "{{post.title}}",
          aspectRatio: "4:3",
          objectFit: "cover"
        },
        {
          id: "empty-actions",
          type: "post_interactions",
          showLike: !0,
          showSave: !0,
          showShare: !0,
          paddingX: "md",
          paddingY: "sm"
        },
        {
          id: "empty-content",
          type: "container",
          direction: "column",
          paddingX: "md",
          paddingY: "md",
          gap: "sm",
          blocks: [
            {
              id: "empty-title",
              type: "text",
              value: "{{post.title}}",
              typography: "heading4",
              fontWeight: "bold",
              color: "gray-900"
            },
            {
              id: "empty-caption",
              type: "text",
              value: "{{post.legend}}",
              typography: "body",
              color: "gray-700"
            },
            {
              id: "empty-button",
              type: "button",
              label: "Clique aqui",
              variant: "primary",
              size: "md",
              radius: "lg",
              fullWidth: !0,
              action: {
                type: "OPEN_URL",
                payload: {
                  url: "{{post.destinationUrl}}"
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
export {
  ai as TemplateBuilderPreview,
  Oi as TemplateBuilderProvider,
  _i as TemplateBuilderRoutes,
  $i as buildTemplatePreviewDataContext,
  Pe as defaultTemplatePreviewData,
  ii as initTemplateBuilder,
  ji as templateBuilderEmptyStateTemplate,
  Wi as useBuilderCatalog,
  H as useTemplateBuilderStore
};
