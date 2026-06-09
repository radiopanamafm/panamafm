import {defineField, defineType} from 'sanity'
import {coverImageField, richTextField, seoFields, slugField} from './shared'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'Noticia',
  type: 'document',
  groups: [
    {name: 'content', title: 'Conteudo', default: true},
    {name: 'seo', title: 'Google e compartilhamento'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(100),
    }),
    {...slugField, group: 'content'},
    defineField({
      name: 'summary',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(240),
    }),
    {...coverImageField, group: 'content'},
    {...richTextField, group: 'content'},
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      group: 'content',
      options: {
        list: ['Cidade', 'Radio', 'Politica', 'Esportes', 'Cultura', 'Utilidade publica'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'author', title: 'Autor', type: 'string', group: 'content'}),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicacao',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar na pagina inicial',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    ...seoFields.map((field) => ({...field, group: 'seo'})),
  ],
  orderings: [{title: 'Mais recentes', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'coverImage'},
  },
})
