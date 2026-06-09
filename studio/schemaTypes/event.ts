import {defineField, defineType} from 'sanity'
import {coverImageField, richTextField, seoFields, slugField} from './shared'

export const event = defineType({
  name: 'event',
  title: 'Evento',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do evento',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    slugField,
    coverImageField,
    defineField({name: 'startsAt', title: 'Inicio', type: 'datetime', validation: (rule) => rule.required()}),
    defineField({name: 'endsAt', title: 'Termino', type: 'datetime'}),
    defineField({name: 'location', title: 'Local', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Agendado', value: 'scheduled'},
          {title: 'Realizado', value: 'finished'},
          {title: 'Cancelado', value: 'cancelled'},
        ],
      },
      initialValue: 'scheduled',
      validation: (rule) => rule.required(),
    }),
    richTextField,
    defineField({name: 'featured', title: 'Destacar na pagina inicial', type: 'boolean', initialValue: false}),
    ...seoFields,
  ],
  orderings: [{title: 'Proximos eventos', name: 'startsAtAsc', by: [{field: 'startsAt', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'coverImage'},
  },
})
