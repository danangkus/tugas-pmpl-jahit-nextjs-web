export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sistem Manajemen Jahit",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Pesanan",
      href: "/admin/pesanan",
      role: ["PEGAWAI", "PEMILIK"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Pelanggan",
      href: "/admin/pelanggan",
      role: ["PEGAWAI"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Model",
      href: "/admin/model",
      role: ["PEGAWAI"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Bahan",
      href: "/admin/bahan",
      role: ["PEGAWAI"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Pegawai",
      href: "/admin/pegawai",
      role: ["PEMILIK"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Pengguna",
      href: "/admin/pengguna",
      role: ["PEMILIK"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Aktivitas",
      href: "/admin/aktivitas",
      role: ["PEMILIK"],
      nav: ["BAR", "MENU"],
    },
    {
      label: "Keluar",
      href: "/",
      role: ["PEGAWAI", "PEMILIK"],
      nav: ["MENU"],
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
