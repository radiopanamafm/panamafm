import {defineArrayMember, defineField, defineType} from 'sanity'
import {coverImageField, slugField} from './shared'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titulo', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    defineField({name: 'description', title: 'Descricao', type: 'text', rows: 3}),
    coverImageField,
    defineField({name: 'event', title: 'Evento relacionado', type: 'reference', to: [{type: 'event'}]}),
    defineField({
      name: 'photos',
      title: 'Fotos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'caption', title: 'Legenda', type: 'string'}),
            defineField({name: 'credit', title: 'Credito', type: 'string'}),
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      options: {layout: 'grid'},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'publishedAt', title: 'Data de publicacao', type: 'datetime'}),
    defineField({name: 'featured', title: 'Destacar na pagina inicial', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title', media: 'coverImage'}},
})
