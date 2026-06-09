import {defineArrayMember, defineField} from 'sanity'

export const slugField = defineField({
  name: 'slug',
  title: 'Endereco da pagina',
  type: 'slug',
  options: {source: 'title', maxLength: 96},
  validation: (rule) => rule.required(),
})

export const coverImageField = defineField({
  name: 'coverImage',
  title: 'Imagem de capa',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Descreva a imagem para acessibilidade e busca.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'credit', title: 'Credito da foto', type: 'string'}),
  ],
  validation: (rule) => rule.required(),
})

export const richTextField = defineField({
  name: 'body',
  title: 'Conteudo',
  type: 'array',
  of: [
    defineArrayMember({type: 'block'}),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'caption', title: 'Legenda', type: 'string'}),
      ],
    }),
  ],
  validation: (rule) => rule.required(),
})

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'Titulo para Google',
    type: 'string',
    validation: (rule) => rule.max(60),
  }),
  defineField({
    name: 'seoDescription',
    title: 'Descricao para Google',
    type: 'text',
    rows: 3,
    validation: (rule) => rule.max(160),
  }),
]
