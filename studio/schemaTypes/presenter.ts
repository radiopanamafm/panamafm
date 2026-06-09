import {defineField, defineType} from 'sanity'

export const presenter = defineType({
  name: 'presenter',
  title: 'Locutor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nome', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'bio', title: 'Biografia', type: 'text', rows: 4}),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociais',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Rede', type: 'string'},
            {name: 'url', title: 'Link', type: 'url'},
          ],
        },
      ],
    }),
    defineField({name: 'active', title: 'Exibir no site', type: 'boolean', initialValue: true}),
    defineField({name: 'order', title: 'Ordem de exibicao', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Ordem do site', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', media: 'photo'}},
})
