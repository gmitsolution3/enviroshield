"use client";

import { useLenis } from "lenis/react";
import {
  Briefcase,
  CornerDownLeft,
  Loader2,
  Newspaper,
  Package,
  Search,
  Wrench,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type SearchResultItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  category?: string;
  price?: number;
  tag?: string;
  url: string;
  type: "service" | "product" | "project" | "article";
};

type SearchResults = {
  services: SearchResultItem[];
  products: SearchResultItem[];
  projects: SearchResultItem[];
  articles: SearchResultItem[];
};

const SUGGESTED_SEARCHES = [
  "Waterproofing",
  "Epoxy Flooring",
  "PU Flooring",
  "Heatproofing",
  "Floor Hardener",
  "Injection Grouting",
  "Primers & Paints",
];

export default function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const lenis = useLenis();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    services: [],
    products: [],
    projects: [],
    articles: [],
  });

  // Stop Lenis & lock body/html scroll when search modal is open
  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      lenis?.start();
    };
  }, [open, lenis]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({
        services: [],
        products: [],
        projects: [],
        articles: [],
      });
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults({
        services: [],
        products: [],
        projects: [],
        articles: [],
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (url: string) => {
      onOpenChange(false);
      router.push(url);
    },
    [onOpenChange, router],
  );

  if (!open) return null;

  const totalResults =
    results.services.length +
    results.products.length +
    results.projects.length +
    results.articles.length;

  const hasQuery = query.trim().length >= 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global site search"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 pt-6 sm:pt-10 md:pt-14 pb-6 sm:pb-12"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        data-lenis-prevent
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line/40 bg-white shadow-2xl transition-all max-h-[calc(100dvh-4.5rem)] sm:max-h-[calc(100dvh-7.5rem)]"
      >
        {/* Search Input Bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5 bg-white">
          <Search
            size={20}
            className="shrink-0 text-ink/40"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, projects, articles..."
            className="flex-1 bg-transparent text-base font-medium text-navy placeholder:text-ink/40 focus:outline-none"
          />

          {loading ? (
            <Loader2 size={18} className="animate-spin text-blue" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-1 text-ink/40 transition-colors hover:bg-mist hover:text-ink"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="hidden rounded border border-line bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink/60 sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Content Body */}
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5"
        >
          {/* Query too short - Show suggested quick queries */}
          {!hasQuery && (
            <div>
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-ink/50">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-line bg-mist/60 px-3.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-blue/30 hover:bg-blue/10 hover:text-blue"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Has query and loading */}
          {hasQuery && loading && totalResults === 0 && (
            <div className="py-12 text-center text-sm text-ink/60">
              <Loader2
                size={24}
                className="mx-auto mb-3 animate-spin text-blue"
              />
              Searching across Enviroshield...
            </div>
          )}

          {/* Has query and empty results */}
          {hasQuery && !loading && totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-base font-bold text-navy">
                No matching results found
              </p>
              <p className="mt-1 text-sm text-ink/60">
                No items found for &ldquo;{query}&rdquo;. Try another
                keyword or category.
              </p>
            </div>
          )}

          {/* Results List */}
          {hasQuery && totalResults > 0 && (
            <div className="space-y-6">
              {/* 1. Services */}
              {results.services.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue">
                    <Wrench size={13} aria-hidden="true" />
                    <span>Services ({results.services.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.services.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.url)}
                        className="group flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-mist"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-bold text-navy group-hover:text-blue">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="line-clamp-1 text-xs text-ink/60">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <CornerDownLeft
                          size={14}
                          className="mt-1 shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                    <Package size={13} aria-hidden="true" />
                    <span>Products ({results.products.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.products.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.url)}
                        className="group flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-mist"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy group-hover:text-blue">
                              {item.title}
                            </span>
                            {item.category && (
                              <span className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-semibold text-ink/70">
                                {item.category}
                              </span>
                            )}
                          </div>
                          {item.price ? (
                            <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                              ৳{item.price.toLocaleString("en-BD")}
                            </p>
                          ) : (
                            item.description && (
                              <p className="line-clamp-1 text-xs text-ink/60">
                                {item.description}
                              </p>
                            )
                          )}
                        </div>
                        <CornerDownLeft
                          size={14}
                          className="mt-1 shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Projects */}
              {results.projects.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-purple-600">
                    <Briefcase size={13} aria-hidden="true" />
                    <span>Projects ({results.projects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.projects.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.url)}
                        className="group flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-mist"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-bold text-navy group-hover:text-blue">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="line-clamp-1 text-xs text-ink/60">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <CornerDownLeft
                          size={14}
                          className="mt-1 shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Articles */}
              {results.articles.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                    <Newspaper size={13} aria-hidden="true" />
                    <span>
                      Articles & News ({results.articles.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {results.articles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.url)}
                        className="group flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-colors hover:bg-mist"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-bold text-navy group-hover:text-blue">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="line-clamp-1 text-xs text-ink/60">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <CornerDownLeft
                          size={14}
                          className="mt-1 shrink-0 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-line bg-mist/40 px-4 py-2.5 text-[11px] text-ink/50 sm:px-5">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-semibold">
                ↵
              </kbd>{" "}
              select
            </span>
            <span>
              <kbd className="rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-semibold">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
          <span>Enviroshield Global Search</span>
        </div>
      </div>
    </div>
  );
}
