const SANITY_PROJECT_ID = '9dvoysnt'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2026-06-09'
const SANITY_QUERY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`

const CMS_QUERY = `{
  "news": *[_type == "newsArticle"] | order(featured desc, publishedAt desc) {
    _id, title, "slug": slug.current, summary, category, publishedAt, featured,
    "coverImage": coverImage.asset->url, "coverAlt": coverImage.alt, body
  },
  "events": *[_type == "event" && status != "cancelled"] | order(startsAt asc) {
    _id, title, "slug": slug.current, startsAt, endsAt, location, status, featured,
    "coverImage": coverImage.asset->url, "coverAlt": coverImage.alt, body
  },
  "galleries": *[_type == "gallery"] | order(featured desc, publishedAt desc) {
    _id, title, "slug": slug.current, description, publishedAt, featured,
    "coverImage": coverImage.asset->url, "coverAlt": coverImage.alt,
    "photos": photos[]{"url": asset->url, alt, caption, credit}
  },
  "presenters": *[_type == "presenter" && active != false] | order(order asc, name asc) {
    _id, name, bio, "photo": photo.asset->url, "photoAlt": photo.alt
  },
  "programs": *[_type == "program" && active != false] | order(startTime asc) {
    _id, title, description, days, startTime, endTime,
    "image": image.asset->url, presenters[]->{_id, name}
  },
  "banners": *[_type == "banner" && active != false] | order(order asc) {
    _id, title, headline, link, startsAt, endsAt, "image": image.asset->url
  },
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0] {
    stationName, tagline, streamUrl, aboutText, phone, email, address,
    instagramUrl, facebookUrl, "aboutImage": aboutImage.asset->url
  }
}`

const dayLabels = {
  mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui',
  fri: 'Sex', sat: 'Sáb', sun: 'Dom',
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[char])
}

function formatDate(value, options = {day: '2-digit', month: 'short', year: 'numeric'}) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(value))
}

function image(url, alt, className = 'cms-card-image') {
  if (!url) return ''
  const sized = `${url}?auto=format&fit=crop&w=900&q=82`
  return `<img class="${className}" src="${escapeHtml(sized)}" alt="${escapeHtml(alt || '')}" loading="lazy">`
}

function richText(blocks = []) {
  return blocks.map((block) => {
    if (block._type === 'image' && block.asset?._ref) return ''
    if (block._type !== 'block') return ''
    const text = (block.children || []).map((child) => escapeHtml(child.text)).join('')
    const style = block.style || 'normal'
    if (/^h[2-4]$/.test(style)) return `<${style}>${text}</${style}>`
    if (style === 'blockquote') return `<blockquote>${text}</blockquote>`
    return `<p>${text}</p>`
  }).join('')
}

function newsCard(item) {
  return `<article class="cms-card">
    <a href="/noticias/${escapeHtml(item.slug)}">${image(item.coverImage, item.coverAlt)}</a>
    <div class="cms-card-body">
      <div class="cms-card-meta">${escapeHtml(item.category || 'Notícia')} · ${formatDate(item.publishedAt)}</div>
      <h3 class="cms-card-title"><a href="/noticias/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></h3>
      <p class="cms-card-summary">${escapeHtml(item.summary || '')}</p>
      <a class="cms-card-link" href="/noticias/${escapeHtml(item.slug)}">Ler notícia →</a>
    </div>
  </article>`
}

function eventCard(item) {
  return `<article class="cms-card">
    <a href="/eventos/${escapeHtml(item.slug)}">${image(item.coverImage, item.coverAlt)}</a>
    <div class="cms-card-body">
      <div class="cms-card-meta">${formatDate(item.startsAt, {day: '2-digit', month: 'long'})}</div>
      <h3 class="cms-card-title"><a href="/eventos/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></h3>
      <p class="cms-card-summary">${escapeHtml(item.location || '')}</p>
      <a class="cms-card-link" href="/eventos/${escapeHtml(item.slug)}">Ver evento →</a>
    </div>
  </article>`
}

function programCard(item) {
  const days = (item.days || []).map((day) => dayLabels[day] || day).join(' · ')
  const presenters = (item.presenters || []).map((presenter) => presenter.name).join(' e ')
  return `<div class="show-card fade-in">
    <span class="show-time">${escapeHtml(days)} · ${escapeHtml(item.startTime || '')}</span>
    <div class="show-name">${escapeHtml(item.title)}</div>
    <div class="show-host">${presenters ? `com <strong>${escapeHtml(presenters)}</strong>` : ''}</div>
    <div class="show-desc">${escapeHtml(item.description || '')}</div>
  </div>`
}

function presenterCard(item, programs) {
  const related = programs.filter((program) => (program.presenters || []).some((presenter) => presenter._id === item._id))
  const role = related.map((program) => program.title).join(' · ')
  const schedule = related.map((program) => `${program.startTime || ''}`).filter(Boolean).join(' · ')
  return `<div class="host-card fade-in">
    <div class="host-av">${image(item.photo, item.photoAlt || item.name, '')}</div>
    <div class="host-name">${escapeHtml(item.name)}</div>
    <div class="host-role">${escapeHtml(role)}</div>
    <div class="host-schedule">${escapeHtml(schedule)}</div>
  </div>`
}

function galleryCard(item) {
  return `<a class="cms-gallery-card" href="/galerias/${escapeHtml(item.slug)}">
    ${image(item.coverImage || item.photos?.[0]?.url, item.coverAlt || item.title, '')}
    <div class="cms-gallery-overlay">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${item.photos?.length || 0} fotos</span>
    </div>
  </a>`
}

function setGrid(id, html, emptyMessage) {
  const target = document.getElementById(id)
  if (!target) return
  target.innerHTML = html || `<div class="cms-empty">${escapeHtml(emptyMessage)}</div>`
}

function renderHome(data) {
  setGrid('newsGrid', data.news.slice(0, 6).map(newsCard).join(''), 'Nenhuma notícia publicada no momento.')
  setGrid('eventsGrid', data.events.slice(0, 6).map(eventCard).join(''), 'Nenhum evento publicado no momento.')
  setGrid('galleryGrid', data.galleries.slice(0, 7).map(galleryCard).join(''), 'Nenhuma galeria publicada no momento.')

  if (data.programs.length) setGrid('programsGrid', data.programs.map(programCard).join(''), '')
  if (data.presenters.length) setGrid('presentersGrid', data.presenters.map((item) => presenterCard(item, data.programs)).join(''), '')
}

function setText(id, value) {
  const element = document.getElementById(id)
  if (element && value) element.textContent = value
}

function setHref(id, value) {
  const element = document.getElementById(id)
  if (element && value) element.href = value
}

function applySettings(data) {
  const settings = data.settings
  if (settings) {
    if (settings.streamUrl && typeof STREAM_URL !== 'undefined') STREAM_URL = settings.streamUrl
    setText('aboutText', settings.aboutText)
    setText('contactPhone', settings.phone)
    setText('contactEmail', settings.email)
    setText('contactAddress', settings.address)
    setHref('instagramLink', settings.instagramUrl)
    setHref('facebookLink', settings.facebookUrl)
    const aboutImage = document.getElementById('aboutImage')
    if (aboutImage && settings.aboutImage) aboutImage.src = `${settings.aboutImage}?auto=format&fit=crop&w=1200&q=85`
  }

  const now = new Date()
  const banner = (data.banners || []).find((item) =>
    (!item.startsAt || new Date(item.startsAt) <= now) &&
    (!item.endsAt || new Date(item.endsAt) >= now)
  )
  const heroBanner = document.getElementById('heroBanner')
  if (banner && heroBanner) {
    setText('heroBannerText', banner.headline || banner.title)
    heroBanner.href = banner.link || '#noticias'
    heroBanner.hidden = false
  }
}

function detailMarkup(item, type) {
  const isNews = type === 'noticias'
  const isEvent = type === 'eventos'
  const back = isNews ? '/noticias' : isEvent ? '/eventos' : '/galerias'
  const label = isNews ? item.category || 'Notícia' : isEvent ? 'Evento' : 'Galeria'
  const date = isNews ? item.publishedAt : isEvent ? item.startsAt : item.publishedAt
  const lead = isNews ? item.summary : isEvent ? item.location : item.description
  const gallery = type === 'galerias' ? `<div class="cms-detail-gallery">${(item.photos || []).map((photo) => image(photo.url, photo.alt || photo.caption, '')).join('')}</div>` : ''

  return `<section class="cms-detail-page"><div class="container"><article class="cms-detail">
    <a class="cms-detail-back" href="${back}">← Voltar</a>
    <div class="cms-card-meta">${escapeHtml(label)}${date ? ` · ${formatDate(date)}` : ''}</div>
    <h1>${escapeHtml(item.title)}</h1>
    ${lead ? `<p class="cms-detail-lead">${escapeHtml(lead)}</p>` : ''}
    ${image(item.coverImage || item.photos?.[0]?.url, item.coverAlt || item.title, 'cms-detail-cover')}
    <div class="cms-richtext">${richText(item.body)}</div>
    ${gallery}
  </article></div></section>`
}

function listingMarkup(items, type) {
  const title = type === 'noticias' ? 'Todas as Notícias' : type === 'eventos' ? 'Agenda de Eventos' : 'Galerias da Rádio'
  const cards = type === 'noticias' ? items.map(newsCard) : type === 'eventos' ? items.map(eventCard) : items.map(galleryCard)
  const gridClass = type === 'galerias' ? 'cms-gallery-grid' : 'cms-grid'
  return `<section class="cms-detail-page"><div class="container">
    <div class="cms-section-head"><div><div class="sec-label">Panamá FM 87.9</div><h1 class="sec-title">${title}</h1></div><a class="cms-more" href="/">Voltar ao início</a></div>
    <div class="${gridClass}">${cards.join('') || '<div class="cms-empty">Nenhum conteúdo publicado no momento.</div>'}</div>
  </div></section>`
}

function renderRoute(data) {
  const parts = location.pathname.split('/').filter(Boolean)
  if (!['noticias', 'eventos', 'galerias'].includes(parts[0])) return false

  document.body.classList.add('cms-route')
  const map = {noticias: data.news, eventos: data.events, galerias: data.galleries}
  const items = map[parts[0]]
  const main = document.querySelector('main')
  if (!main) return false

  if (parts[1]) {
    const item = items.find((entry) => entry.slug === parts[1])
    main.innerHTML = item ? detailMarkup(item, parts[0]) : '<section class="cms-detail-page"><div class="container"><div class="cms-empty">Conteúdo não encontrado.</div></div></section>'
    if (item) document.title = `${item.title} | Rádio Panamá FM 87.9`
  } else {
    main.innerHTML = listingMarkup(items, parts[0])
  }
  return true
}

async function loadCms() {
  try {
    const response = await fetch(`${SANITY_QUERY_URL}?query=${encodeURIComponent(CMS_QUERY)}`)
    if (!response.ok) throw new Error(`Sanity respondeu ${response.status}`)
    const {result} = await response.json()
    applySettings(result)
    if (!renderRoute(result)) renderHome(result)
  } catch (error) {
    console.error('Não foi possível carregar o conteúdo editorial:', error)
    setGrid('newsGrid', '', 'Não foi possível carregar as notícias agora.')
  }
}

loadCms()
