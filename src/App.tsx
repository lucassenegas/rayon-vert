import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ChevronDown, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Star, Wifi, Wind, Coffee, Waves, Menu, X, ExternalLink,
  CalendarDays, Users, UtensilsCrossed, CircleCheck, Send, Loader2, BedDouble, FileText,
  Umbrella, Fish, TreePine, Anchor, Instagram, Facebook, Quote, Globe, Heart, Cake, PartyPopper, Briefcase,
} from 'lucide-react'

// ─── helpers ─────────────────────────────────────────────────────────────────

function useScrollFade(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1.1, ease: 'easeOut', delay },
  }),
}

const TODAY = new Date().toISOString().split('T')[0]

// ─── asset map ───────────────────────────────────────────────────────────────

const A = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

// ─── formulaires ─────────────────────────────────────────────────────────────
// À remplacer par vos identifiants Formspree (ou tout autre backend) avant mise en ligne.
const FORM_ENDPOINTS = {
  restaurant: 'https://formspree.io/f/YOUR_FORM_ID_RESTAURANT',
  sejour: 'https://formspree.io/f/YOUR_FORM_ID_SEJOUR',
  contact: 'https://formspree.io/f/YOUR_FORM_ID_CONTACT',
}
// Carte du restaurant — à remplacer par le vrai PDF une fois fourni.
const CARTE_URL = `${import.meta.env.BASE_URL}carte.html`
const BLOG_URL = `${import.meta.env.BASE_URL}blog.html`
/* Même tableur que la page blog.html — laisser vide masque la section. */
const BLOG_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScJjM41wMY7hbxLg3DvSJNvmPRNkzhrvZ2ZwXp2HvLLlNqXAD9qaye_ukYuJbpx1qwAGO1Jsa1LiPW/pub?output=csv'

type ModalKind = 'sejour' | 'restaurant' | 'contact' | null

function useFormspree(endpoint: string) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return { status, handleSubmit }
}

// ─── styles partagés ─────────────────────────────────────────────────────────

const btnPrimary = 'inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium tracking-wider uppercase px-8 py-3.5 rounded-full bg-gold text-deep hover:bg-gold-dark hover:text-white transition-all duration-300 shadow-lg shadow-gold/25'
const btnDark = 'inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium tracking-wider uppercase px-8 py-3.5 rounded-full bg-gold text-deep hover:bg-gold-dark hover:text-white transition-all duration-300 shadow-lg shadow-gold/25 disabled:opacity-60'
const btnGhost = 'inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium tracking-wider uppercase px-8 py-3.5 rounded-full border-2 border-gold text-deep hover:bg-gold hover:text-deep transition-all duration-300'

const fieldWrap = 'flex flex-col gap-1.5'
const fieldLabel = 'font-sans text-[10px] tracking-widest uppercase text-ink-soft/80'
const fieldInput = 'w-full bg-cream-soft border border-transparent rounded-2xl px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-soft/40 outline-none focus:border-forest transition-colors'

// ─── data ────────────────────────────────────────────────────────────────────

const rooms = [
  {
    key: 'standard',
    title: 'Chambre Standard',
    subtitle: 'Sérénité & confort',
    description: '20 m² · Chambre climatisée avec terrasse privée, nichée dans la végétation tropicale.',
    image: A('chambre-standard-jardin.jpg'),
    features: ['Clim', 'Terrasse privée'],
    badge: 'Standard · 20 m²',
    priceRoom: 95,
    priceHalfBoard: 179,
  },
  {
    key: 'confort',
    title: 'Bungalow Confort',
    subtitle: "L'art de vivre caribéen",
    description: '32 m² · Bungalow avec grande terrasse privée et vue panoramique sur la mer des Caraïbes.',
    image: A('chambre-confort.jpg'),
    features: ['Vue mer', 'Grande terrasse'],
    badge: 'Confort · 32 m²',
    priceRoom: 120,
    priceHalfBoard: 204,
  },
  {
    key: 'famille',
    title: 'Suite Familiale',
    subtitle: 'Espace & générosité',
    description: '50 m² · Chambres communicantes avec grande terrasse partagée, idéal en famille.',
    image: A('chambre-familiale-terrasse.jpg'),
    features: ['Famille', 'Vue panoramique'],
    badge: 'Familiale · 50 m²',
    priceRoom: 150,
    priceHalfBoard: 234,
  },
]

const gallery = [
  { src: A('dsc_0194_2.jpg'), alt: 'Plage de Deshaies', span: 'col-span-2 row-span-2' },
  { src: A('terrasse-hotel-rayon-vert-guadeloupe.jpg'), alt: 'Terrasse avec vue mer' },
  { src: A('IMG_0074-scaled.jpg'), alt: 'Jardin tropical' },
  { src: A('restaurant-hotel-rayon-vert-guadeloupe.jpg'), alt: 'Restaurant panoramique', span: 'col-span-2' },
  { src: A('pdj-low.jpg'), alt: 'Petit-déjeuner' },
  { src: A('IMG_0406-scaled.jpg'), alt: 'Moules frites, cuisine créole' },
  { src: A('extension.jpg'), alt: 'Faune locale' },
  { src: A('IMG_0094-scaled.jpg'), alt: 'Jardin et vue sur mer' },
]

const amenities = [
  { icon: Waves, label: 'Piscine à débordement', desc: 'Vue imprenable sur la mer des Caraïbes' },
  { icon: Coffee, label: 'Restaurant panoramique', desc: 'Cuisine créole locale, fruits de mer' },
  { icon: Wind, label: 'Climatisation', desc: 'Toutes les chambres climatisées' },
  { icon: Wifi, label: 'Wi-Fi inclus', desc: 'Connexion haut débit dans tout l\'hôtel' },
]

const activities = [
  { icon: Umbrella, name: 'Plages', desc: "La Grande Anse, l'une des plus belles plages de Guadeloupe, à 10 min." },
  { icon: Fish, name: 'Plongée', desc: "Explorez la Réserve Cousteau, l'une des plus belles au monde." },
  { icon: TreePine, name: 'Jardin Botanique', desc: 'Flamants roses, perroquets et végétation luxuriante à 25 min.' },
  { icon: Anchor, name: 'Nautisme', desc: 'Kayak, voile, snorkeling en eaux turquoise. Embarcadère à proximité.' },
]

const testimonials = [
  { text: 'Vue spectaculaire, personnel adorable et cuisine créole délicieuse. Nous reviendrons certainement.', author: 'Marie-Hélène D. — Paris', source: 'TripAdvisor · 2024' },
  { text: 'La piscine à débordement avec vue sur la mer est magique. On ne se lasse pas du coucher de soleil.', author: 'Jean-Claude & Sylvie — Lyon', source: 'Booking.com · 2024' },
  { text: 'Séjour parfait au paradis ! Équipe accueillante, vue à couper le souffle et restaurant exceptionnel.', author: 'Sarah & Tom W. — London', source: 'TripAdvisor · 2024' },
]

const navLinks = [
  { label: "L'Hôtel", href: '#hotel' },
  { label: 'Chambres', href: '#chambres' },
  { label: 'Restaurant', href: '#restaurant' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#devis' },
]

// ─── components ──────────────────────────────────────────────────────────────

function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-forest/40 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-forest/60" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-forest/40 to-transparent" />
    </div>
  )
}

function SectionLabel({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p className={`font-sans text-[12px] tracking-widest-xl uppercase font-medium mb-3 ${onDark ? 'text-gold-soft' : 'text-gold-dark'}`}>
      {children}
    </p>
  )
}

function SuccessNote({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center gap-2 py-6"
    >
      <CircleCheck size={32} className="text-forest" />
      <p className="font-chewy text-lg text-ink">{children}</p>
    </motion.div>
  )
}

// ─── Cluster de blobs (forme signature organique, 3 tailles qui se chevauchent) ─

function BlobCluster({ main, secondary, accentIcon, mainShape, secondaryShape, accentBg, reverse = false }: {
  main: { src: string; alt: string }
  secondary: { src: string; alt: string }
  accentIcon: ReactNode
  mainShape: 'blob-1' | 'blob-2'
  secondaryShape: 'blob-1' | 'blob-2'
  accentBg: string
  reverse?: boolean
}) {
  const accentShape = mainShape === 'blob-1' ? 'blob-2' : 'blob-1'
  const secondarySide = reverse ? 'left-[-8%]' : 'right-[-8%]'
  const accentSide = reverse ? 'right-[4%]' : 'left-[4%]'

  return (
    <div className="relative max-w-md mx-auto lg:max-w-none mt-[14%] mb-[12%]">
      {/* halo derrière le blob principal */}
      <div className={`absolute -inset-5 bg-forest-pale ${mainShape} blur-2xl opacity-60`} aria-hidden="true" />

      {/* blob principal — photo focale */}
      <div className={`relative aspect-[4/5] w-full overflow-hidden ${mainShape} shadow-2xl shadow-ink/15`}>
        <img src={main.src} alt={main.alt} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* blob secondaire — photo complémentaire, chevauche partiellement le blob principal */}
      <div className={`absolute w-[42%] aspect-square bottom-[-6%] ${secondarySide} ${secondaryShape} overflow-hidden shadow-xl shadow-ink/15 border-[3px] border-cream`}>
        <img src={secondary.src} alt={secondary.alt} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* petit blob couleur — accent graphique, pas de photo */}
      <div className={`absolute w-[22%] aspect-square top-[2%] ${accentSide} ${accentShape} ${accentBg} flex items-center justify-center shadow-lg shadow-ink/10`}>
        {accentIcon}
      </div>
    </div>
  )
}

// ─── Modale de réservation (desktop) / bottom sheet (mobile) ──────────────────

function ReservationDialog({ open, onOpenChange, title, icon, children }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-deep/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center">
                <motion.div
                  className="w-full sm:max-w-lg bg-cream rounded-t-[2rem] sm:rounded-6xl max-h-[88vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                >
                  <div className="sticky top-0 bg-cream/95 backdrop-blur-sm flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 z-10">
                    <Dialog.Title className="font-chewy text-2xl text-deep flex items-center gap-2">
                      {icon}
                      {title}
                    </Dialog.Title>
                    <Dialog.Close className="w-9 h-9 rounded-full bg-cream-soft hover:bg-forest-pale flex items-center justify-center transition-colors flex-shrink-0" aria-label="Fermer">
                      <X size={18} className="text-ink" />
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="sr-only">Formulaire de {title.toLowerCase()}</Dialog.Description>
                  <div className="px-6 sm:px-8 pb-8">{children}</div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

// ─── Contenus des formulaires ──────────────────────────────────────────────────

function SejourFormContent({ presetRoom, onPresetRoomChange }: { presetRoom: string; onPresetRoomChange: (v: string) => void }) {
  const { status, handleSubmit } = useFormspree(FORM_ENDPOINTS.sejour)
  const [arrivee, setArrivee] = useState('')

  if (status === 'success') return <SuccessNote>Demande reçue ! Réponse sous 24h.</SuccessNote>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="Réservation Hôtel – Le Rayon Vert" />
      <p className="font-sans text-[13px] text-ink-soft -mt-2 mb-2">Meilleur tarif garanti en direct · Réponse sous 24h</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Prénom *</label>
          <input type="text" name="prenom" required placeholder="Marie" className={fieldInput} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Nom *</label>
          <input type="text" name="nom" required placeholder="Dupont" className={fieldInput} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Email *</label>
          <input type="email" name="email" required placeholder="marie@exemple.com" className={fieldInput} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Téléphone</label>
          <input type="tel" name="telephone" placeholder="+33 6 00 00 00 00" className={fieldInput} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Arrivée *</label>
          <input
            type="date" name="arrivee" required min={TODAY} className={fieldInput}
            value={arrivee}
            onChange={(e) => setArrivee(e.target.value)}
          />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Départ *</label>
          <input type="date" name="depart" required min={arrivee || TODAY} className={fieldInput} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}><BedDouble size={11} className="inline mr-1" />Chambre</label>
          <select name="chambre" value={presetRoom} onChange={(e) => onPresetRoomChange(e.target.value)} className={fieldInput}>
            <option value="indifferent">Sans préférence</option>
            <option value="standard">Standard (~95€/nuit)</option>
            <option value="confort">Confort (~120€/nuit)</option>
            <option value="famille">Familiale (~150€/nuit)</option>
          </select>
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}><Users size={11} className="inline mr-1" />Personnes</label>
          <select name="personnes" defaultValue="2" className={fieldInput}>
            {[1, 2, 3, 4, '5+'].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Option repas</label>
        <select name="pension" defaultValue="sans" className={fieldInput}>
          <option value="sans">Sans pension (chambre seule)</option>
          <option value="demi">Demi-pension +42€/pers/nuit (petit-déj + dîner)</option>
        </select>
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Message</label>
        <textarea name="message" rows={2} placeholder="Demandes spéciales, allergie, lit bébé..." className={fieldInput + ' resize-none'} />
      </div>
      <button type="submit" disabled={status === 'sending'} className={btnPrimary + ' w-full !py-4'}>
        {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Envoyer ma demande de réservation
      </button>
      {status === 'error' && <p className="font-sans text-xs text-center text-red-500">Une erreur est survenue, merci de réessayer.</p>}
      <p className="font-sans text-[11px] text-ink-soft/70 text-center">Paiement sécurisé · CB, Virement · Chèques vacances acceptés</p>
    </form>
  )
}

function RestaurantFormContent() {
  const { status, handleSubmit } = useFormspree(FORM_ENDPOINTS.restaurant)

  if (status === 'success') return <SuccessNote>Demande envoyée ! Confirmation par téléphone sous 2h.</SuccessNote>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="Réservation Restaurant – Le Rayon Vert" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Date *</label>
          <input type="date" name="date" required min={TODAY} className={fieldInput} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Heure *</label>
          <select name="heure" required className={fieldInput}>
            <option value="">--</option>
            <optgroup label="Déjeuner · vendredi, samedi & dimanche">
              <option value="11:30">11h30</option>
              <option value="12:00">12h00</option>
              <option value="12:30">12h30</option>
              <option value="13:00">13h00</option>
              <option value="13:30">13h30</option>
            </optgroup>
            <optgroup label="Dîner · tous les soirs">
              <option value="18:00">18h00</option>
              <option value="18:30">18h30</option>
              <option value="19:00">19h00</option>
              <option value="19:30">19h30</option>
              <option value="20:00">20h00</option>
              <option value="20:30">20h30</option>
            </optgroup>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}><Users size={11} className="inline mr-1" />Personnes *</label>
          <select name="personnes" required defaultValue="2" className={fieldInput}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Téléphone *</label>
          <input type="tel" name="telephone" required placeholder="+590 6 00 00 00 00" className={fieldInput} />
        </div>
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Nom & prénom *</label>
        <input type="text" name="nom" required placeholder="Marie Dupont" className={fieldInput} />
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Commentaires <span className="normal-case text-ink-soft/50">(optionnel)</span></label>
        <textarea name="commentaires" rows={2} placeholder="Allergie, chaise haute, anniversaire..." className={fieldInput + ' resize-none'} />
      </div>
      <button type="submit" disabled={status === 'sending'} className={btnDark + ' w-full !py-4'}>
        {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <CalendarDays size={14} />}
        Demande de réservation
      </button>
      {status === 'error' && <p className="font-sans text-xs text-center text-red-500">Une erreur est survenue, merci de réessayer.</p>}
    </form>
  )
}

function ContactFormContent() {
  const { status, handleSubmit } = useFormspree(FORM_ENDPOINTS.contact)

  if (status === 'success') return <SuccessNote>Merci ! Nous vous répondons sous 24h.</SuccessNote>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="_subject" value="Demande – Le Rayon Vert" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Prénom *</label>
          <input type="text" name="prenom" required placeholder="Marie" className={fieldInput} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Nom *</label>
          <input type="text" name="nom" required placeholder="Dupont" className={fieldInput} />
        </div>
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Email *</label>
        <input type="email" name="email" required placeholder="marie@exemple.com" className={fieldInput} />
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Téléphone</label>
        <input type="tel" name="telephone" placeholder="+33 6 00 00 00 00" className={fieldInput} />
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Motif de la demande</label>
        <select name="motif" className={fieldInput} defaultValue="">
          <option value="">--</option>
          <option value="Mariage">Mariage</option>
          <option value="Baptême">Baptême</option>
          <option value="Anniversaire">Anniversaire</option>
          <option value="Séminaire / entreprise">Séminaire ou entreprise</option>
          <option value="Réservation de groupe">Réservation de groupe</option>
          <option value="Autre">Autre demande</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={fieldWrap}>
          <label className={fieldLabel}>Date envisagée</label>
          <input type="date" name="date_evenement" min={TODAY} className={fieldInput} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Nombre de personnes</label>
          <input type="number" name="personnes" min={1} placeholder="40" className={fieldInput} />
        </div>
      </div>
      <div className={fieldWrap}>
        <label className={fieldLabel}>Votre projet</label>
        <textarea name="message" rows={4} placeholder="Décrivez-nous votre événement : ambiance souhaitée, repas, hébergement des invités..." className={fieldInput + ' resize-none'} />
      </div>
      <button type="submit" disabled={status === 'sending'} className={btnDark + ' w-full !py-4'}>
        {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Envoyer ma demande
      </button>
      {status === 'error' && <p className="font-sans text-xs text-center text-red-500">Une erreur est survenue, merci de réessayer.</p>}
      <p className="font-sans text-[11px] text-ink-soft/70 text-center pt-1">Vos données sont utilisées uniquement pour répondre à votre demande.</p>
    </form>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ onReserve }: { onReserve: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 60))
  }, [scrollY])

  useEffect(() => {
    if (!langOpen) return
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [langOpen])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.6 }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 rounded-full backdrop-blur-md transition-all duration-500 ${
          scrolled ? 'bg-white/90 shadow-lg shadow-ink/10' : 'bg-deep/25 shadow-lg shadow-deep/10'
        }`}
      >
        {/* Logo */}
        <a href="#" className="group flex-shrink-0 flex items-center gap-2.5">
          <img
            src={A('logo-mark.png')}
            alt=""
            aria-hidden="true"
            className="h-8 sm:h-9 w-auto"
          />
          <p className={`font-chewy text-2xl sm:text-3xl leading-none transition-colors ${scrolled ? 'text-deep' : 'text-white drop-shadow-sm'}`}>
            Le <span className="text-forest">Rayon Vert</span>
          </p>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-sans text-[12px] font-medium tracking-wide px-3.5 py-2 rounded-full transition-colors duration-300 ${
                scrolled ? 'text-ink-soft hover:bg-forest-pale hover:text-forest-dark' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Langue + réseaux + CTA */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className={`inline-flex items-center gap-1 font-sans text-[11px] font-medium px-2.5 py-2 rounded-full transition-colors duration-300 ${
                scrolled ? 'text-ink-soft hover:bg-forest-pale hover:text-forest-dark' : 'text-white/80 hover:bg-white/15'
              }`}
            >
              <Globe size={14} />
              FR
              <ChevronDown size={11} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl shadow-ink/10 overflow-hidden py-1"
                  role="listbox"
                >
                  <button
                    role="option"
                    aria-selected="true"
                    className="w-full flex items-center justify-between px-4 py-2.5 font-sans text-[12px] text-ink hover:bg-forest-pale/60 transition-colors"
                  >
                    Français
                    <CircleCheck size={14} className="text-forest" />
                  </button>
                  <button
                    role="option"
                    aria-selected="false"
                    disabled
                    className="w-full flex items-center justify-between px-4 py-2.5 font-sans text-[12px] text-ink-soft/50 cursor-not-allowed"
                  >
                    English
                    <span className="text-[9px] font-medium uppercase tracking-wide">Bientôt</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="https://www.instagram.com/hotelrestaurantlerayonvert/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
              scrolled ? 'text-ink-soft hover:bg-forest-pale hover:text-forest-dark' : 'text-white/80 hover:bg-white/15'
            }`}
          >
            <Instagram size={16} />
          </a>

          <button
            onClick={onReserve}
            className={`inline-flex items-center gap-2 font-sans text-[11px] font-medium tracking-wider uppercase px-6 py-2.5 rounded-full shadow-md transition-all duration-300 ${
              scrolled ? 'bg-gold text-deep shadow-gold/30 hover:bg-gold-dark hover:text-white' : 'bg-gold text-deep shadow-ink/20 hover:bg-gold-dark hover:text-white'
            }`}
          >
            <CalendarDays size={13} />
            Réserver
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors ${scrolled ? 'text-deep bg-cream-soft' : 'text-white bg-white/15'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 top-0 bg-cream z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-28 flex flex-col gap-6 h-full overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="font-chewy text-3xl text-deep hover:text-forest transition-colors"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onReserve() }}
                className={btnPrimary + ' mt-4 self-start'}
              >
                Réserver maintenant
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll()
  const imgY = useTransform(scrollY, [0, 600], [0, 100])
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.22, 0.55])

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden">
      {/* Fond parallax — remplacer <img> par <video> quand le drone sera monté :
          <video src={A('drone.mp4')} autoPlay muted loop playsInline
                 className="w-full h-full object-cover scale-110" /> */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={A('DJI_0148-scaled.jpg')}
          alt="Vue aérienne de l'hôtel Le Rayon Vert à Deshaies"
          className="w-full h-full object-cover scale-110"
          loading="eager"
        />
      </motion.div>

      {/* Voiles — assez légers pour laisser respirer la vidéo, assez denses
          pour que le logo reste lisible en haut de l'écran */}
      <motion.div className="absolute inset-0 bg-deep" style={{ opacity: overlayOpacity }} />
      <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-transparent to-deep/45" />

      {/* Logo seul, centré dans la partie haute */}
      <div className="relative z-10 h-full flex flex-col items-center justify-start pt-24 sm:pt-28 px-6">
        <motion.img
          src={A('logo.png')}
          alt="Hôtel Le Rayon Vert — Deshaies, Guadeloupe"
          className="w-[260px] sm:w-[320px] lg:w-[380px] h-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Indicateur de défilement — masqué sur mobile */}
      <motion.div
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/70 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
        <ChevronDown size={12} className="text-white/80" />
      </motion.div>
    </section>
  )
}


// ─── Intro ────────────────────────────────────────────────────────────────────

function Intro({ onReserve }: { onReserve: () => void }) {
  const { ref, isInView } = useScrollFade(0.1)

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-4">
      <div className="max-w-3xl mx-auto text-center" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0}>
          <p className="font-sans text-[15px] sm:text-[17px] tracking-widest-xl uppercase font-medium text-forest-dark mb-1">
            Deshaies · Guadeloupe
          </p>
          <p className="text-gold text-2xl sm:text-3xl tracking-[0.25em] leading-none mb-4" aria-label="Hôtel 3 étoiles">
            ★★★
          </p>
        </motion.div>

        <motion.h1
          className="font-chewy text-4xl sm:text-5xl lg:text-6xl text-deep leading-[1.1] mt-4"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          Une promesse entre <span className="text-forest">mer et montagne</span>
        </motion.h1>

        <motion.p
          className="font-sans text-base sm:text-lg text-ink-soft leading-relaxed mt-6"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.2}
        >
          Vingt-deux chambres posées à flanc de morne, face à la mer des Caraïbes.
          Un hôtel familial de charme où l'on vient pour la piscine à débordement,
          la table créole et ces couchers de soleil que l'on regarde sans rien dire.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.3}
        >
          {[['22', 'Chambres'], ['4.4', 'Google'], ['4.3', 'TripAdvisor']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="font-chewy text-3xl text-forest-dark leading-none">{num}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-ink-soft/70 mt-1.5">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.4}
        >
          <button onClick={onReserve} className={btnPrimary}>
            <CalendarDays size={14} />
            Réserver votre séjour
          </button>
          <a href="#chambres" className={btnGhost}>
            Voir les chambres
          </a>
        </motion.div>
      </div>
    </section>
  )
}


// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="hotel" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center" ref={ref}>
        <motion.div variants={fadeIn} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.2}>
          <BlobCluster
            main={{ src: A('20220120_133026-scaled.jpg'), alt: "Vue de l'hôtel Le Rayon Vert" }}
            secondary={{ src: A('flamboyants-scaled.jpg'), alt: 'Jardin tropical en fleurs' }}
            mainShape="blob-1"
            secondaryShape="blob-2"
            accentBg="bg-forest"
            accentIcon={<Waves size={20} className="text-white" />}
          />
        </motion.div>

        {/* Text */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0}>
            <SectionLabel>Bienvenue</SectionLabel>
            <h2 className="font-chewy text-4xl lg:text-5xl text-deep leading-tight mb-6">
              Un hôtel à taille humaine,<br />
              face à la <span className="text-forest">mer des Caraïbes</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.15}>
            <Divider className="mb-8" />
          </motion.div>

          <motion.p
            className="font-sans text-base text-ink-soft leading-loose mb-5"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.25}
          >
            22 chambres, pas une de plus : sur les hauteurs de Deshaies, on connaît nos clients par leur prénom. C'est le format qu'on a choisi pour garder un accueil vraiment personnel, terrasse après terrasse.
          </motion.p>
          <motion.p
            className="font-sans text-base text-ink-soft leading-loose mb-10"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.35}
          >
            Piscine à débordement, restaurant tourné vers l'horizon, jardin tropical où nichent les oiseaux : tout ici est pensé pour que vous n'ayez qu'une chose à faire, ralentir.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.45}
          >
            {[['22', 'Chambres'], ['★★★', 'Classé'], ['∞', 'Vue mer']].map(([num, label]) => (
              <div key={label} className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-2.5 shadow-md shadow-ink/5">
                <p className="font-chewy text-xl text-forest-dark">{num}</p>
                <p className="font-sans text-[10px] text-ink-soft leading-tight max-w-[4.5rem]">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Highlights bar ───────────────────────────────────────────────────────────

function Highlights() {
  const { ref, isInView } = useScrollFade()

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto bg-forest-pale rounded-6xl px-4 sm:px-8 py-10" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {amenities.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center text-center gap-3 px-2"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={i * 0.1}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md shadow-ink/5">
                <Icon size={20} className="text-forest-dark" />
              </div>
              <p className="font-sans text-[12px] font-medium tracking-wide uppercase text-deep">{label}</p>
              <p className="font-sans text-[12px] text-ink-soft leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

function Rooms({ onSelectRoom }: { onSelectRoom: (key: string) => void }) {
  const { ref, isInView } = useScrollFade(0.1)

  return (
    <section id="chambres" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14" ref={ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <SectionLabel>Hébergement</SectionLabel>
            <h2 className="font-chewy text-4xl lg:text-5xl text-deep">Nos chambres</h2>
          </motion.div>
          <motion.a
            href="https://www.hotels-deshaies.com/tarifs-reservation-hotel-deshaies-guadeloupe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans text-[12px] text-ink-soft hover:text-forest-dark transition-colors"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            Disponibilités en temps réel
            <ExternalLink size={12} />
          </motion.a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {rooms.map((room, i) => (
            <RoomCard key={room.key} room={room} index={i} onSelectRoom={onSelectRoom} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RoomCard({ room, index, onSelectRoom }: { room: typeof rooms[number]; index: number; onSelectRoom: (key: string) => void }) {
  const { ref, isInView } = useScrollFade(0.1)
  const [hovered, setHovered] = useState(false)
  const [halfBoard, setHalfBoard] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col bg-white rounded-5xl overflow-hidden shadow-lg shadow-ink/5 hover:shadow-xl hover:shadow-ink/10 transition-shadow duration-500"
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index * 0.15}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
        <p className="font-sans text-[10px] font-medium tracking-wide uppercase text-deep">{room.badge}</p>
      </div>

      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <p className="font-sans text-[11px] tracking-wide uppercase text-forest-dark mb-1">{room.subtitle}</p>
        <h3 className="font-chewy text-2xl text-deep mb-3 leading-tight">{room.title}</h3>
        <p className="font-sans text-sm text-ink-soft leading-relaxed mb-4 flex-1">{room.description}</p>

        <div className="flex gap-2 flex-wrap mb-5">
          {room.features.map((f) => (
            <span key={f} className="font-sans text-[11px] text-forest-dark bg-forest-pale px-3 py-1 rounded-full">{f}</span>
          ))}
        </div>

        <Divider className="mb-5" />

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex gap-1.5 mb-2">
              <button
                onClick={() => setHalfBoard(false)}
                className={`font-sans text-[10px] px-2.5 py-1 rounded-full border transition-colors ${!halfBoard ? 'bg-forest border-forest text-white' : 'border-forest/50 text-forest-dark'}`}
              >
                Chambre
              </button>
              <button
                onClick={() => setHalfBoard(true)}
                className={`font-sans text-[10px] px-2.5 py-1 rounded-full border transition-colors ${halfBoard ? 'bg-forest border-forest text-white' : 'border-forest/50 text-forest-dark'}`}
              >
                Demi-pension
              </button>
            </div>
            <p className="font-chewy text-xl text-forest-dark">
              dès {halfBoard ? room.priceHalfBoard : room.priceRoom}€ <span className="font-sans text-[11px] text-ink-soft font-normal">/nuit</span>
            </p>
          </div>
          <button
            onClick={() => onSelectRoom(room.key)}
            className="font-sans text-[11px] font-medium tracking-wide uppercase text-gold-dark border-b border-gold-dark/50 hover:border-gold-dark pb-0.5 transition-colors flex-shrink-0"
          >
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Restaurant ───────────────────────────────────────────────────────────────

function Restaurant({ onReserveTable }: { onReserveTable: () => void }) {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="restaurant" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div variants={fadeIn} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <BlobCluster
              main={{ src: A('dinerdegroupe1-scaled.jpg'), alt: 'Restaurant panoramique Le Rayon Vert' }}
              secondary={{ src: A('IMG_0406-scaled.jpg'), alt: 'Moules frites, cuisine créole' }}
              mainShape="blob-2"
              secondaryShape="blob-1"
              accentBg="bg-gold"
              accentIcon={<UtensilsCrossed size={18} className="text-white" />}
              reverse
            />
          </motion.div>

          {/* Text */}
          <div ref={ref}>
            <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0}>
              <SectionLabel>Cuisine créole</SectionLabel>
              <h2 className="font-chewy text-4xl lg:text-5xl text-deep leading-tight mb-6">
                Une table qui regarde<br /><span className="text-forest">l'horizon</span>
              </h2>
            </motion.div>

            <motion.p
              className="font-sans text-base text-ink-soft leading-loose mb-8"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.2}
            >
              Poissons du jour, accras dorés, colombo mijoté : notre chef cuisine local et généreux, à déguster face au coucher de soleil sur la Caraïbe.
            </motion.p>

            <motion.div
              className="flex items-start gap-3 bg-forest-pale rounded-3xl px-5 py-4 mb-8"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.25}
            >
              <Waves size={18} className="text-forest-dark flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-forest-dark leading-relaxed">
                <span className="font-medium">Piscine offerte.</span> L'accès à la piscine à débordement
                est inclus pour tous les clients du restaurant, midi comme soir.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-4xl p-6 space-y-1 mb-8"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.3}
            >
              {[
                { label: 'Déjeuner · vendredi, samedi & dimanche', hours: '11h30 – 14h15' },
                { label: 'Dîner · tous les soirs', hours: '18h00 – 21h00' },
              ].map(({ label, hours }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-cream-dark last:border-0">
                  <p className="font-sans text-sm text-ink-soft">{label}</p>
                  <p className="font-sans text-sm font-medium text-deep">{hours}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.4}
            >
              <button onClick={onReserveTable} className={btnDark}>
                <UtensilsCrossed size={14} />
                Réserver une table
              </button>
              <a href={CARTE_URL} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                <FileText size={14} />
                Voir notre carte
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pool / Full bleed feature ─────────────────────────────────────────────────

function PoolFeature() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden" ref={containerRef}>
      <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
        <img src={A('IMG_8507.jpg')} alt="Piscine et vue sur la mer" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-deep/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-transparent to-deep" />

      <motion.div className="relative z-10 text-center px-6" style={{ y: textY, opacity }}>
        <p className="font-sans text-[13px] tracking-widest-xl uppercase text-gold-soft font-medium mb-4">Piscine à débordement</p>
        <p className="font-chewy text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-2xl mx-auto">
          Là où l'horizon<br /><span className="text-gold-soft">se fond dans la mer</span>
        </p>
      </motion.div>
    </section>
  )
}

// ─── Activities ───────────────────────────────────────────────────────────────

function Activities() {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="activites" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-14" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <SectionLabel>À proximité</SectionLabel>
          <h2 className="font-chewy text-4xl lg:text-5xl text-deep mb-4">Activités & découvertes</h2>
          <p className="font-sans text-sm text-ink-soft leading-relaxed">
            Entre mer et montagne, Deshaies est le point de départ idéal pour explorer les merveilles naturelles de la Guadeloupe.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {activities.map(({ icon: Icon, name, desc }, i) => (
          <motion.div
            key={name}
            className="bg-forest-pale rounded-5xl p-6 text-center flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-300"
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={i * 0.1}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Icon size={18} className="text-forest-dark" />
            </div>
            <h3 className="font-chewy text-lg text-deep">{name}</h3>
            <p className="font-sans text-[12px] text-ink-soft leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

type Article = { Slug: string; Titre: string; Date: string; Image: string; 'Résumé': string; 'Publié': string }

function parseCSVSimple(txt: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], cur = '', q = false
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i]
    if (q) {
      if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++ } else q = false }
      else cur += c
    } else {
      if (c === '"') q = true
      else if (c === ',') { row.push(cur); cur = '' }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
      else if (c !== '\r') cur += c
    }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  const head = (rows.shift() || []).map(h => h.trim())
  return rows.filter(r => r.some(v => v.trim() !== '')).map(r => {
    const o: Record<string, string> = {}
    head.forEach((h, i) => (o[h] = (r[i] || '').trim()))
    return o
  })
}

function Blog() {
  const { ref, isInView } = useScrollFade(0.1)
  const [articles, setArticles] = useState<Article[]>([])
  const piste = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!BLOG_CSV) return
    let vivant = true
    fetch(BLOG_CSV, { cache: 'no-store' })
      .then(r => (r.ok ? r.text() : Promise.reject()))
      .then(t => {
        if (!vivant) return
        const lus = (parseCSVSimple(t) as unknown as Article[])
          .filter(a => a.Slug && (a['Publié'] || 'OUI').toUpperCase() !== 'NON')
          .sort((x, y) => +new Date(y.Date || 0) - +new Date(x.Date || 0))
          .slice(0, 6)
        setArticles(lus)
      })
      .catch(() => {})
    return () => { vivant = false }
  }, [])

  // Tant qu'aucun article n'est publié, la section n'existe pas.
  if (!articles.length) return null

  const glisser = (sens: number) => {
    const el = piste.current
    if (el) el.scrollBy({ left: sens * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  const dateFr = (v: string) => {
    const d = new Date(v)
    return isNaN(+d) ? v : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  const src = (v: string) => (/^https?:\/\//.test(v) ? v : A(v))

  return (
    <section id="journal" className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="flex items-end justify-between gap-6 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div>
            <SectionLabel>Le journal</SectionLabel>
            <h2 className="font-chewy text-3xl lg:text-4xl text-deep leading-tight">
              Nos <span className="text-forest">actualités</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => glisser(-1)}
              aria-label="Articles précédents"
              className="hidden sm:flex w-10 h-10 rounded-full border border-cream-dark items-center justify-center text-ink-soft hover:bg-forest-pale hover:text-forest-dark transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => glisser(1)}
              aria-label="Articles suivants"
              className="hidden sm:flex w-10 h-10 rounded-full border border-cream-dark items-center justify-center text-ink-soft hover:bg-forest-pale hover:text-forest-dark transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={piste}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          {articles.map(a => (
            <a
              key={a.Slug}
              href={`${BLOG_URL}?a=${encodeURIComponent(a.Slug)}`}
              className="group flex-shrink-0 w-[280px] sm:w-[320px] snap-start bg-white rounded-4xl overflow-hidden hover:shadow-xl hover:shadow-forest-dark/10 transition-all duration-500"
            >
              <div className="aspect-[16/10] bg-forest-pale overflow-hidden">
                {a.Image && (
                  <img
                    src={src(a.Image)}
                    alt={a.Titre}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold-dark mb-2">{dateFr(a.Date)}</p>
                <h3 className="font-sans text-base font-medium text-forest-dark leading-snug mb-2">{a.Titre}</h3>
                <p className="font-sans text-[13px] text-ink-soft leading-relaxed line-clamp-3">{a['Résumé']}</p>
              </div>
            </a>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.2}
        >
          <a href={BLOG_URL} className={btnGhost}>
            <FileText size={14} />
            Tous les articles
          </a>
        </motion.div>
      </div>
    </section>
  )
}


// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery() {
  const { ref, isInView } = useScrollFade(0.05)
  const [selected, setSelected] = useState<number | null>(null)

  const goPrev = () => setSelected((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length))
  const goNext = () => setSelected((i) => (i === null ? null : (i + 1) % gallery.length))

  useEffect(() => {
    if (selected === null) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  const current = selected !== null ? gallery[selected] : null

  return (
    <section id="galerie" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={ref}>
      <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        <SectionLabel>Galerie photos</SectionLabel>
        <h2 className="font-chewy text-4xl lg:text-5xl text-deep">L'hôtel en images</h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[160px] sm:auto-rows-[180px]">
        {gallery.map((img, i) => (
          <motion.div
            key={img.src}
            className={`relative overflow-hidden rounded-[1.5rem] cursor-pointer group ${img.span || ''}`}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={i * 0.06}
            onClick={() => setSelected(i)}
          >
            <motion.img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-0 bg-deep/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <p className="font-sans italic text-white text-sm">{img.alt}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                className="max-w-5xl max-h-[85vh] w-full object-contain rounded-3xl"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-sm text-white/70">
              {current.alt} · {selected! + 1}/{gallery.length}
            </p>

            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white/80 hover:text-forest hover:bg-white/20 transition-colors flex items-center justify-center"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <button
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white/80 hover:text-forest hover:bg-white/20 transition-colors flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Photo précédente"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white/80 hover:text-forest hover:bg-white/20 transition-colors flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Photo suivante"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Avis ─────────────────────────────────────────────────────────────────────

function Avis() {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="avis" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-deep-panel">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} ref={ref}>
          <SectionLabel onDark>Avis voyageurs</SectionLabel>
          <h2 className="font-chewy text-4xl lg:text-5xl text-cream">Ce que disent nos clients</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              className="bg-white rounded-5xl p-7 shadow-md shadow-ink/5"
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={i * 0.12}
            >
              <Quote size={20} className="text-gold mb-3" />
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, s) => <Star key={s} size={15} className="fill-gold text-gold" />)}
              </div>
              <p className="font-chewy italic text-base text-ink leading-relaxed mb-4">"{t.text}"</p>
              <p className="font-sans text-sm font-medium text-deep">{t.author}</p>
              <p className="font-sans text-[11px] text-ink-soft/70 mt-0.5">{t.source}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.tripadvisor.fr/Hotel_Review-g580415-d2366289-Reviews-Hotel_Restaurant_Le_Rayon_Vert-Deshaies_Basse_Terre_Island_Guadeloupe.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md shadow-ink/5 font-sans text-sm font-medium text-forest-dark hover:shadow-lg transition-shadow"
          >
            <Star size={14} className="fill-gold text-gold" />
            Voir tous les avis sur TripAdvisor
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── CTA réservation séjour ──────────────────────────────────────────────────

function ReserveCTA({ onReserve }: { onReserve: () => void }) {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="reserver" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-deep-panel">
      <div className="max-w-xl mx-auto text-center" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <SectionLabel onDark>Réservation directe</SectionLabel>
          <h2 className="font-chewy text-4xl lg:text-5xl text-cream mb-4">
            Réservez votre <span className="text-gold-soft">séjour</span>
          </h2>
          <p className="font-sans text-sm text-cream/60 mb-10 max-w-md mx-auto">
            Meilleur tarif garanti en réservation directe · Réponse sous 24h · Sans frais de dossier
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.15}>
          <button onClick={onReserve} className={btnPrimary + ' !px-12 !py-4'}>
            <CalendarDays size={16} />
            Vérifier les disponibilités
          </button>
        </motion.div>

        <p className="font-sans text-[11px] text-cream/35 mt-8">Paiement sécurisé · CB, Virement · Chèques vacances acceptés</p>
      </div>
    </section>
  )
}

// ─── Contact / Devis ─────────────────────────────────────────────────────────

function ContactSection({ onContact }: { onContact: () => void }) {
  const { ref, isInView } = useScrollFade()

  return (
    <section id="devis" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <SectionLabel>Événements privés</SectionLabel>
          <h2 className="font-chewy text-3xl lg:text-4xl text-deep leading-tight mb-4">
            Célébrez face à la <span className="text-forest">mer des Caraïbes</span>
          </h2>
          <p className="font-sans text-sm text-ink-soft leading-relaxed mb-8 max-w-lg mx-auto">
            Mariage les pieds dans le jardin tropical, baptême en famille, anniversaire au
            coucher du soleil, séminaire au calme : nous privatisons le restaurant, la terrasse
            panoramique et les chambres pour votre événement. Dites-nous ce que vous imaginez,
            nous vous répondons sous 24h avec une proposition sur mesure.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.05}
        >
          {[
            { icon: Heart, label: 'Mariages' },
            { icon: Cake, label: 'Baptêmes' },
            { icon: PartyPopper, label: 'Anniversaires' },
            { icon: Briefcase, label: 'Séminaires' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-forest-pale rounded-3xl px-4 py-5 flex flex-col items-center gap-2">
              <Icon size={20} className="text-forest-dark" />
              <p className="font-sans text-[12px] font-medium text-forest-dark text-center">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.1}
        >
          <a href="tel:+590590284323" className="flex items-center gap-2 bg-forest-pale rounded-full px-5 py-3 font-sans text-sm text-forest-dark hover:bg-forest hover:text-white transition-colors">
            <Phone size={14} /> +590 (0)590 28 43 23
          </a>
          <a href="mailto:contact@hotels-deshaies.com" className="flex items-center gap-2 bg-forest-pale rounded-full px-5 py-3 font-sans text-sm text-forest-dark hover:bg-forest hover:text-white transition-colors">
            <Mail size={14} /> contact@hotels-deshaies.com
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=436+All%C3%A9e+Lacoque+97126+Deshaies+Guadeloupe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-forest-pale rounded-full px-5 py-3 font-sans text-sm text-forest-dark hover:bg-forest hover:text-white transition-colors"
          >
            <MapPin size={14} /> 436 Allée Lacoque, 97126 Deshaies
          </a>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.2}>
          <button onClick={onContact} className={btnDark}>
            <Send size={14} />
            Demander un devis
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const { ref, isInView } = useScrollFade()

  const socials = [
    { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/hotelrestaurantlerayonvert' },
    { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/hotelrestaurantlerayonvert/' },
    { label: 'TripAdvisor', icon: Star, href: 'https://www.tripadvisor.fr/Hotel_Review-g580415-d2366289-Reviews-Hotel_Restaurant_Le_Rayon_Vert-Deshaies_Basse_Terre_Island_Guadeloupe.html' },
  ]

  return (
    <footer className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <motion.div className="sm:col-span-2 lg:col-span-1" variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <p className="font-chewy text-2xl text-deep mb-2">Le <span className="text-forest">Rayon Vert</span></p>
            <p className="font-sans text-sm text-ink-soft leading-relaxed mb-5">
              Hôtel de charme familial à Deshaies, Guadeloupe. Vue imprenable sur la mer des Caraïbes, piscine à débordement, restaurant créole.
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full bg-forest-pale text-forest-dark flex items-center justify-center hover:bg-forest hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.1}>
            <h4 className="font-sans text-[11px] tracking-widest uppercase text-forest-dark font-medium mb-4">L'hôtel</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}><a href={link.href} className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.15}>
            <h4 className="font-sans text-[11px] tracking-widest uppercase text-forest-dark font-medium mb-4">Réservation</h4>
            <ul className="space-y-2.5">
              <li><a href="#reserver" className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">Réserver en direct</a></li>
              <li><a href="https://www.hotels-deshaies.com/tarifs-reservation-hotel-deshaies-guadeloupe" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">Tarifs</a></li>
              <li><a href="#devis" className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">Devis groupe</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} custom={0.2}>
            <h4 className="font-sans text-[11px] tracking-widest uppercase text-forest-dark font-medium mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li><a href="tel:+590590284323" className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">+590 (0)590 28 43 23</a></li>
              <li><a href="mailto:contact@hotels-deshaies.com" className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors">contact@hotels-deshaies.com</a></li>
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=436+All%C3%A9e+Lacoque+97126+Deshaies+Guadeloupe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-ink-soft hover:text-forest-dark transition-colors"
                >
                  436 Allée Lacoque<br />97126 Deshaies, Guadeloupe
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="pt-6 border-t border-cream-dark flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left"
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0.3}
        >
          <p className="font-sans text-[11px] text-ink-soft/60">© {new Date().getFullYear()} Hôtel Le Rayon Vert · Deshaies, Guadeloupe</p>
        </motion.div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [presetRoom, setPresetRoom] = useState('indifferent')
  const [modal, setModal] = useState<ModalKind>(null)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar onReserve={() => setModal('sejour')} />
      <Hero />
      <Intro onReserve={() => setModal('sejour')} />
      <About />
      <Highlights />
      <Rooms onSelectRoom={(key) => { setPresetRoom(key); setModal('sejour') }} />
      <Avis />
      <Restaurant onReserveTable={() => setModal('restaurant')} />
      <PoolFeature />
      <Activities />
      <Gallery />
      <Blog />
      <ReserveCTA onReserve={() => setModal('sejour')} />
      <ContactSection onContact={() => setModal('contact')} />
      <Footer />

      <ReservationDialog
        open={modal === 'sejour'}
        onOpenChange={(v) => setModal(v ? 'sejour' : null)}
        title="Réserver votre séjour"
        icon={<CalendarDays size={20} className="text-forest" />}
      >
        <SejourFormContent presetRoom={presetRoom} onPresetRoomChange={setPresetRoom} />
      </ReservationDialog>

      <ReservationDialog
        open={modal === 'restaurant'}
        onOpenChange={(v) => setModal(v ? 'restaurant' : null)}
        title="Réserver une table"
        icon={<UtensilsCrossed size={20} className="text-forest" />}
      >
        <RestaurantFormContent />
      </ReservationDialog>

      <ReservationDialog
        open={modal === 'contact'}
        onOpenChange={(v) => setModal(v ? 'contact' : null)}
        title="Nous contacter"
        icon={<Mail size={20} className="text-forest" />}
      >
        <ContactFormContent />
      </ReservationDialog>
    </div>
  )
}
