import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuracoes do site',
  type: 'document',
  fields: [
    defineField({name: 'stationName', title: 'Nome da radio', type: 'string', initialValue: 'Radio Panama FM 87.9'}),
    defineField({name: 'tagline', title: 'Slogan', type: 'string', initialValue: 'De bem com a vida!'}),
    defineField({name: 'streamUrl', title: 'URL do stream', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'aboutImage', title: 'Foto da radio', type: 'image', options: {hotspot: true}}),
    defineField({name: 'aboutText', title: 'Texto institucional', type: 'text', rows: 6}),
    defineField({name: 'phone', title: 'Telefone / WhatsApp', type: 'string'}),
    defineField({name: 'email', title: 'E-mail', type: 'string'}),
    defineField({name: 'address', title: 'Endereco', type: 'string'}),
    defineField({name: 'instagramUrl', title: 'Instagram', type: 'url'}),
    defineField({name: 'facebookUrl', title: 'Facebook', type: 'url'}),
  ],
  preview: {
    prepare: () => ({title: 'Configuracoes do site'}),
  },
})
