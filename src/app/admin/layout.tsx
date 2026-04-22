"use client";

import Link from "next/link";
import { LayoutGrid, FileText, Settings, Sparkles, Wand2, GalleryVerticalEnd, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";
import type { I18nKey } from "@/lib/i18n";
import { usePathname } from "next/navigation";

type NavItem = { href: string; labelKey: I18nKey; Icon: any };

const CORE_ITEMS: NavItem[] = [
  { href: "/admin/resumes", labelKey: "myResumes", Icon: FileText },
  { href: "/admin/templates", labelKey: "templateGallery", Icon: GalleryVerticalEnd },
  { href: "/admin/ai-provider", labelKey: "aiProvider", Icon: Settings },
  { href: "/admin/settings", labelKey: "settings", Icon: Settings },
  { href: "/admin/ai-optimization", labelKey: "aiOptimization", Icon: Sparkles },
];

const EXT_ITEMS: NavItem[] = [
  { href: "/admin/optimize", labelKey: "optimize", Icon: Wand2 },
  { href: "/admin/jd-match", labelKey: "jdMatch", Icon: Target },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-64 shrink-0">
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center gap-2">
                <LayoutGrid size={16} className="text-gray-700" />
                <div className="font-semibold text-sm">{t("admin")}</div>
              </div>

              <div className="p-2">
                <div className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {t("coreModules")}
                </div>
                <nav className="space-y-1">
                  {CORE_ITEMS.map(({ href, labelKey, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(pathname === href ? "text-blue-700" : "text-gray-400")}
                      />
                      <span>{t(labelKey)}</span>
                    </Link>
                  ))}
                </nav>

                <div className="px-2 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {t("extensions")}
                </div>
                <nav className="space-y-1">
                  {EXT_ITEMS.map(({ href, labelKey, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(pathname === href ? "text-blue-700" : "text-gray-400")}
                      />
                      <span>{t(labelKey)}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-xl border bg-white shadow-sm p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
