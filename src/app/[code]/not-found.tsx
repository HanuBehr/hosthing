import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbfc] px-6 py-12 text-slate-900">
      <section className="max-w-xl rounded-[2rem] border border-cyan-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
          Guia não encontrado
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Não encontramos um imóvel com este código.
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Confira se o link recebido está correto. Se o problema continuar,
          entre em contato com o anfitrião ou com a central da Seazone.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-cyan-700 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
        >
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
