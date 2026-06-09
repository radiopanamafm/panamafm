import {defineField, defineType} from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titulo interno', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'headline', title: 'Texto principal', type: 'string'}),
    defineField({name: 'link', title: 'Link', type: 'url'}),
    defineField({name: 'startsAt', title: 'Exibir a partir de', type: 'datetime'}),
    defineField({name: 'endsAt', title: 'Exibir ate', type: 'datetime'}),
    defineField({name: 'active', title: 'Ativo', type: 'boolean', initialValue: true}),
    defineField({name: 'order', title: 'Ordem de exibicao', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'title', subtitle: 'headline', media: 'image'}},
})
