<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

## UI & Design Rules
- **DILARANG KERAS membuat badge / pill / tag warna-warni yang tidak jelas fungsinya**:
  - Jangan menaruh badge/pill/kapsul dekoratif di atas setiap judul heading/section (seperti "Solusi Praktis", "Hemat Waktu", "Integrasi Fleksibel", "Formula AI", dsb).
  - Dilarang membuat badge warna-warni acak (merah muda/rose-50, kuning/amber-50, ungu/purple-50, hijau/emerald-50, biru/blue-50) yang membuat halaman terlihat seperti template AI murahan dan tidak profesional.
  - Jangan menambahkan badge atau stiker buzzword pada kartu fitur (misal: "100% Match", "HD Ready", "Viral", "Auto Verif", dsb).
  - Desain harus bersih, tenang, elegan, dan berorientasi pada konten asli serta hierarki tipografi murni.
  - Badge hanya boleh dipakai jika **benar-benar fungsional** (misal: status order transaksi di halaman pembayaran/riwayat: Sukses, Pending, Ditolak), dan harus menggunakan palet netral atau warna brand yang konsisten sesuai `DESIGN.md`.
- **DILARANG KERAS menggunakan emoji / emotikon dalam UI dan copywriting**:
  - Dilarang menaruh emoji (seperti ☕, 🌙, 👗, 🔒, ⚡, ✨, 💡, ★, dsb) pada heading, tombol, label, form simulator, kartu, atau teks copywriting.
  - Tampilan harus profesional, tenang, dan berstandar editorial manusia. Gunakan tipografi murni yang jelas atau icon SVG standar (Lucide) yang proporsional jika memang fungsional.

