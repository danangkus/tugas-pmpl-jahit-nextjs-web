export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Pesanan",
      href: "/admin/pesanan",
    },
    {
      label: "Pelanggan",
      href: "/admin/pelanggan",
    },
    {
      label: "Model",
      href: "/admin/model",
    },
    {
      label: "Pegawai",
      href: "/admin/pegawai",
    },
    {
      label: "Aktivitas",
      href: "/admin/aktivitas",
    },
  ],
  navMenuItems: [
    {
      label: "Pesanan",
      href: "/admin/pesanan",
    },
    {
      label: "Model",
      href: "/admin/model",
    },
    {
      label: "Pelanggan",
      href: "/admin/pelanggan",
    },
    {
      label: "Pegawai",
      href: "/admin/pegawai",
    },
    {
      label: "Aktivitas",
      href: "/admin/aktivitas",
    },
    {
      label: "Keluar",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
