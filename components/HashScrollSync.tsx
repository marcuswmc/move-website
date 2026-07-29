"use client";

import { useEffect, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/SmoothScroll";

function scrollToHash(hash: string, immediate = false) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target = document.getElementById(id);
  if (!target) return;

  ScrollTrigger.refresh();
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, immediate });
  } else {
    target.scrollIntoView();
  }
}

/**
 * Routes hash-anchor navigation through Lenis instead of the browser's native jump.
 * Without this, landing on a page via `/#id` (e.g. from another route) scrolls the
 * document directly, Lenis's own raf loop then lerps back toward its stale target,
 * and pinned/scrubbed ScrollTrigger sections never engage until the user scrolls manually.
 * This only handles the cross-page case (pathname actually changes); same-page hash
 * clicks are handled synchronously by `handleHashLinkClick` below.
 *
 * Jumps immediately (no tween) here: the target page's ScrollTrigger instances were
 * just created this render, and an animated multi-second scroll fires their "enter"
 * callbacks mid-tween, racing the freshly-mounted panel reveal timelines so they only
 * partially play. Landing instantly lets those reveals start clean with their full
 * duration ahead of them.
 */
export function HashScrollSync() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const frame = requestAnimationFrame(() => scrollToHash(hash, true));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

/**
 * For nav links pointing at a hash on the page the user is already on, Next's own
 * router handles a hash-only change by re-pushing the current href, which — at least
 * on this Next version — can concatenate onto the existing fragment instead of
 * replacing it (e.g. `/#hero` + click to `/#entregamos` → `/#hero#entregamos`).
 * We bypass that entirely: prevent Next's default handling, set the URL ourselves,
 * and drive the scroll through Lenis directly (no route change to wait for).
 */
export function handleHashLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string, currentPathname: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;

  const targetPathname = href.slice(0, hashIndex) || "/";
  if (targetPathname !== currentPathname) return;

  event.preventDefault();
  window.history.pushState(null, "", href);
  scrollToHash(href.slice(hashIndex));
}
