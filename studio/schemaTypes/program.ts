import {defineField, defineType} from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Programa',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nome', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Descricao', type: 'text', rows: 4}),
    defineField({
      name: 'presenters',
      title: 'Locutores',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'presenter'}]}],
    }),
    defineField({
      name: 'days',
      title: 'Dias da semana',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Segunda', value: 'mon'},
          {title: 'Terca', value: 'tue'},
          {title: 'Quarta', value: 'wed'},
          {title: 'Quinta', value: 'thu'},
          {title: 'Sexta', value: 'fri'},
          {title: 'Sabado', value: 'sat'},
          {title: 'Domingo', value: 'sun'},
        ],
        layout: 'grid',
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'startTime',
      title: 'Horario de inicio',
      type: 'string',
      description: 'Formato 24 horas, por exemplo: 09:30',
      validation: (rule) => rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'horario HH:mm'}),
    }),
    defineField({
      name: 'endTime',
      title: 'Horario de termino',
      type: 'string',
      description: 'Formato 24 horas, por exemplo: 11:00',
      validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'horario HH:mm'}),
    }),
    defineField({name: 'image', title: 'Imagem do programa', type: 'image', options: {hotspot: true}}),
    defineField({name: 'active', title: 'Exibir no site', type: 'boolean', initialValue: true}),
  ],
  orderings: [{title: 'Horario', name: 'startTimeAsc', by: [{field: 'startTime', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'startTime', media: 'image'},
  },
})
