import { useEffect, useMemo, useState } from 'react'
import { Users, Target, UserRound, HeartPulse, Stethoscope, ClipboardList, GraduationCap, Trophy, ShieldCheck, CheckCheck, Home, Menu, Search as SearchIcon, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react'
import { content, ids, ui, type Lang, type Sec } from './data/content'

const icons = [Users, Target, UserRound, HeartPulse, Stethoscope, ClipboardList, GraduationCap, Trophy, ShieldCheck, CheckCheck]
const load = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const route = () => { const r = location.hash.replace('#/', ''); return ids.includes(r) ? r : '' }

function ProgressBar({ n, label }: { n: number; label: string }) {
  return (<div className="w-full"><div className="flex justify-between text-sm mb-1"><span>{label}</span><b>{n * 10}%</b></div>
    <div className="h-2 rounded-full bg-b-l overflow-hidden"><div className="h-full bg-g transition-all" style={{ width: `${n * 10}%` }} /></div></div>)
}
function LanguageSwitcher({ lang, set }: { lang: Lang; set: (l: Lang) => void }) {
  return (<div className="flex rounded-lg border border-b/30 overflow-hidden text-sm font-semibold">
    {(['ru', 'uz'] as Lang[]).map(l => <button key={l} onClick={() => set(l)} className={`px-3 py-1.5 ${lang === l ? 'bg-b text-white' : 'bg-white text-b-d'}`}>{l.toUpperCase()}</button>)}</div>)
}
function Search({ lang, go }: { lang: Lang; go: (id: string) => void }) {
  const [q, setQ] = useState('')
  const res = useMemo(() => q.trim().length < 2 ? [] : content[lang].filter(s => JSON.stringify(s).toLowerCase().includes(q.trim().toLowerCase())), [q, lang])
  return (<div className="relative w-full max-w-xs"><SearchIcon size={16} className="absolute left-3 top-2.5 text-slate-400" />
    <input value={q} onChange={e => setQ(e.target.value)} placeholder={ui[lang].search} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-g" />
    {q.trim().length >= 2 && <div className="absolute z-30 mt-1 w-full bg-white rounded-lg shadow-xl border border-slate-200 max-h-72 overflow-auto">
      {res.length === 0 ? <p className="p-3 text-sm text-slate-500">{ui[lang].noRes}</p> : res.map(s => <button key={s.id} onClick={() => { go(s.id); setQ('') }} className="block w-full text-left px-3 py-2 text-sm hover:bg-g-l">{s.title}</button>)}</div>}</div>)
}
function Sidebar({ lang, cur, done, go, open }: { lang: Lang; cur: string; done: string[]; go: (id: string) => void; open: boolean }) {
  return (<nav className={`${open ? 'block' : 'hidden'} lg:block lg:w-72 shrink-0 bg-white border-r border-slate-200 lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] overflow-auto p-3`}>
    <button onClick={() => go('')} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${cur === '' ? 'bg-g text-white' : 'hover:bg-g-l'}`}><Home size={18} />{ui[lang].home}</button>
    {content[lang].map((s, i) => { const I = icons[i]; return (
      <button key={s.id} onClick={() => go(s.id)} className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left ${cur === s.id ? 'bg-g text-white' : 'hover:bg-g-l'}`}>
        <span className="w-6 font-semibold opacity-70">{String(i + 1).padStart(2, '0')}</span><I size={18} /><span className="flex-1">{s.nav}</span>{done.includes(s.id) && <Check size={16} />}</button>) })}</nav>)
}
function Accordion({ t, d }: { t: string; d: string }) {
  const [o, setO] = useState(false)
  return (<div className="rounded-xl border border-b/20 bg-white"><button onClick={() => setO(!o)} className="flex w-full items-center justify-between p-4 text-left font-semibold text-b-d">{t}<ChevronDown size={18} className={o ? 'rotate-180' : ''} /></button>{o && <p className="px-4 pb-4 text-slate-700">{d}</p>}</div>)
}
const InfoCard = ({ t, d }: { t: string; d: string }) => (<div className="rounded-2xl border border-g/20 bg-g-l p-5"><h3 className="font-semibold text-g-d">{t}</h3>{d && <p className="mt-1 text-slate-700">{d}</p>}</div>)
const StatCard = ({ v, l }: { v: string; l: string }) => (<div className="rounded-2xl bg-b-d p-6 text-white"><div className="text-4xl font-bold">{v}</div><p className="mt-2 text-sm text-blue-100">{l}</p></div>)
const StepCard = ({ n, t }: { n: number; t: string }) => (<div className="flex gap-4 rounded-2xl border border-b/20 bg-b-l p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-b text-white font-bold">{n}</div><p className="self-center text-lg">{t}</p></div>)

function Learning({ lang, sec, idx, done, mark, go }: { lang: Lang; sec: Sec; idx: number; done: boolean; mark: () => void; go: (id: string) => void }) {
  const all = content[lang]; const t = ui[lang]; const prev = all[idx - 1]; const next = all[idx + 1]
  const grid = sec.cards && !sec.acc
  return (<article className="space-y-8">
    <header><p className="text-sm text-g-d font-semibold">{t.sectionOf.replace('{n}', String(idx + 1))}</p><h1 className="mt-1 text-3xl md:text-4xl font-bold text-b-d">{sec.title}</h1>{sec.lead && <p className="mt-3 text-lg text-slate-700 max-w-3xl">{sec.lead}</p>}</header>
    {sec.quote && <blockquote className="rounded-2xl bg-gradient-to-br from-g-d to-b-d p-6 md:p-10 text-xl md:text-3xl font-semibold text-white">{sec.quote}</blockquote>}
    {sec.stats && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sec.stats.map(([v, l]) => <StatCard key={v} v={v} l={l} />)}</div>}
    {sec.items && <ul className="space-y-3">{sec.items.map(x => <li key={x} className="flex gap-3"><Check size={20} className="mt-1 shrink-0 text-g" /><span>{x}</span></li>)}</ul>}
    {grid && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sec.cards!.map(([a, b]) => <InfoCard key={a} t={a} d={b} />)}</div>}
    {sec.id === 'academy' && <div className="grid gap-3 sm:grid-cols-2">{sec.items && sec.items[0].split(': ')[1].split(' · ').map(m => <Accordion key={m} t={m} d={lang === 'ru' ? 'Модуль программы Академии МИР.' : 'МИР Академияси дастури модули.'} />)}</div>}
    {sec.steps && <ol className="space-y-3">{sec.steps.map((x, i) => <li key={x}><StepCard n={i + 1} t={x} /></li>)}</ol>}
    <section className="rounded-2xl border-2 border-g p-5"><h2 className="font-bold text-g-d mb-2">{t.remember}</h2><ul className="list-disc pl-5 space-y-1">{sec.remember.map(x => <li key={x}>{x}</li>)}</ul></section>
    <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
      <button disabled={!prev} onClick={() => prev && go(prev.id)} className="order-3 md:order-1 flex items-center gap-1 text-b disabled:opacity-30"><ChevronLeft size={18} />{t.prev}</button>
      <button onClick={mark} className={`order-1 md:order-2 rounded-xl px-6 py-3 font-semibold ${done ? 'bg-g-l text-g-d border border-g' : 'bg-g text-white'}`}>{done ? t.marked : t.mark}</button>
      <button disabled={!next} onClick={() => next && go(next.id)} className="order-2 md:order-3 flex items-center gap-1 text-b disabled:opacity-30">{t.next}<ChevronRight size={18} /></button></div></article>)
}
function Dashboard({ lang, done, go }: { lang: Lang; done: string[]; go: (id: string) => void }) {
  const t = ui[lang]; const nextId = ids.find(i => !done.includes(i))
  return (<div className="space-y-8">
    <div className="rounded-3xl bg-gradient-to-br from-g-d to-b-d p-8 md:p-12 text-white"><p className="font-semibold text-green-200">{t.academy}</p><h1 className="mt-2 text-3xl md:text-5xl font-bold">{t.welcome}</h1><p className="mt-4 max-w-2xl text-lg text-blue-50">{t.welcomeText}</p></div>
    <div className="rounded-2xl border border-slate-200 p-6 space-y-4"><h2 className="text-xl font-bold text-b-d">{t.yours}</h2>
      <p>{t.done}: <b>{done.length} / 10</b> {t.finished}</p><ProgressBar n={done.length} label={t.progress} />
      {nextId ? <button onClick={() => go(nextId)} className="rounded-xl bg-g px-5 py-3 font-semibold text-white">{t.cont}</button> : <p className="font-semibold text-g-d">{t.allDone}</p>}</div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{content[lang].map((s, i) => { const I = icons[i]; return (
      <button key={s.id} onClick={() => go(s.id)} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left hover:border-g"><I className="text-g" /><span className="flex-1 font-medium">{s.nav}</span>{done.includes(s.id) && <Check size={16} className="text-g" />}</button>) })}</div></div>)
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('mir-lang', 'ru'))
  const [cur, setCur] = useState(route())
  const [done, setDone] = useState<string[]>(() => load<string[]>('mir-done', []))
  const [open, setOpen] = useState(false)
  useEffect(() => { const h = () => { setCur(route()); setOpen(false); window.scrollTo(0, 0) }; window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h) }, [])
  const go = (id: string) => { location.hash = id ? `/${id}` : '/' }
  const setL = (l: Lang) => { setLang(l); save('mir-lang', l); document.documentElement.lang = l }
  const mark = () => { if (cur && !done.includes(cur)) { const d = [...done, cur]; setDone(d); save('mir-done', d) } }
  const idx = ids.indexOf(cur); const t = ui[lang]
  return (<div className="min-h-screen bg-white">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <button className="lg:hidden rounded-lg border p-2" onClick={() => setOpen(!open)} aria-label={t.menu}><Menu size={18} /></button>
      <button onClick={() => go('')} className="font-bold text-g-d text-lg">МИР <span className="hidden sm:inline font-normal text-slate-500 text-sm">{t.academy}</span></button>
      <div className="ml-auto flex items-center gap-3 flex-1 justify-end"><Search lang={lang} go={go} /><LanguageSwitcher lang={lang} set={setL} /></div>
      <div className="w-full lg:hidden"><ProgressBar n={done.length} label={`${done.length}/10`} /></div></div></header>
    <div className="lg:flex"><Sidebar lang={lang} cur={cur} done={done} go={go} open={open} />
      <main className="min-w-0 flex-1 p-4 md:p-8 max-w-5xl">{idx < 0 ? <Dashboard lang={lang} done={done} go={go} /> : <Learning lang={lang} sec={content[lang][idx]} idx={idx} done={done.includes(cur)} mark={mark} go={go} />}</main></div>
    <footer className="border-t border-slate-200 p-4 text-center text-sm text-slate-500">{t.footer}</footer></div>)
}
