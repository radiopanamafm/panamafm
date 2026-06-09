import {readFile} from 'node:fs/promises'
import {basename, resolve} from 'node:path'
import {createClient} from '@sanity/client'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) throw new Error('Defina SANITY_AUTH_TOKEN antes de executar a importacao.')

const client = createClient({
  projectId: '9dvoysnt',
  dataset: 'production',
  apiVersion: '2026-06-09',
  token,
  useCdn: false,
})

const root = resolve(import.meta.dirname, '..', '..')

const presenters = [
  {
    _id: 'presenter-divino-alexandre',
    name: 'Divino Alexandre',
    bio: 'Apresentador do Panamá News.',
    order: 1,
    photo: resolve(root, 'divino-alexandre.jpg'),
    photoAlt: 'Divino Alexandre',
  },
  {
    _id: 'presenter-sergio-lima',
    name: 'Sérgio Lima',
    bio: 'Apresentador do Jornal do Rádio.',
    order: 2,
    photo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=85',
    photoAlt: 'Microfone representando Sérgio Lima',
  },
  {
    _id: 'presenter-valdir-barbosa',
    name: 'Valdir Barbosa',
    bio: 'Apresentador do Jornal do Rádio.',
    order: 3,
    photo: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?w=1200&q=85',
    photoAlt: 'Microfone representando Valdir Barbosa',
  },
  {
    _id: 'presenter-fernanda-paola',
    name: 'Dra. Fernanda Paola',
    bio: 'Apresentadora do Momento Jurídico.',
    order: 4,
    photo: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=85',
    photoAlt: 'Microfone representando Dra. Fernanda Paola',
  },
]

const programs = [
  {
    _id: 'program-panama-news',
    title: 'Panamá News',
    description: 'As principais notícias locais e regionais com informação concreta e transparente para o seu dia.',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    presenters: ['presenter-divino-alexandre'],
  },
  {
    _id: 'program-jornal-do-radio',
    title: 'Jornal do Rádio',
    description: 'Jornalismo de qualidade com profissionais capacitados trazendo os fatos da nossa cidade e região.',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '11:00',
    presenters: ['presenter-sergio-lima', 'presenter-valdir-barbosa'],
  },
  {
    _id: 'program-momento-juridico',
    title: 'Momento Jurídico',
    description: 'Orientações jurídicas de forma acessível e objetiva para ajudar você a conhecer seus direitos.',
    days: ['wed'],
    startTime: '08:30',
    presenters: ['presenter-fernanda-paola'],
  },
  {
    _id: 'program-mensageiros-do-senhor',
    title: 'Mensageiros do Senhor',
    description: 'Programação religiosa que leva fé, esperança e renovação espiritual para toda a família no domingo.',
    days: ['sun'],
    startTime: '09:00',
    presenters: [],
  },
]

async function imageBuffer(source) {
  if (!source.startsWith('http')) return readFile(source)
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Falha ao baixar ${source}: ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

async function ensurePresenter(item) {
  const current = await client.getDocument(item._id)
  let photo = current?.photo

  if (!photo?.asset?._ref) {
    const filename = item.photo.startsWith('http') ? `${item._id}.jpg` : basename(item.photo)
    const asset = await client.assets.upload('image', await imageBuffer(item.photo), {filename})
    photo = {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
      alt: item.photoAlt,
    }
  }

  await client.createOrReplace({
    _id: item._id,
    _type: 'presenter',
    name: item.name,
    bio: item.bio,
    active: true,
    order: item.order,
    photo,
  })
  console.log(`Locutor importado: ${item.name}`)
}

async function ensureProgram(item) {
  await client.createOrReplace({
    _id: item._id,
    _type: 'program',
    title: item.title,
    description: item.description,
    days: item.days,
    startTime: item.startTime,
    active: true,
    presenters: item.presenters.map((id) => ({
      _key: id,
      _type: 'reference',
      _ref: id,
    })),
  })
  console.log(`Programa importado: ${item.title}`)
}

for (const presenter of presenters) await ensurePresenter(presenter)
for (const program of programs) await ensureProgram(program)

console.log('Importacao concluida.')
