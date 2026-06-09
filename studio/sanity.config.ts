import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'panama-fm',
  title: 'Radio Panama FM',
  basePath: '/admin',
  projectId: '9dvoysnt',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteudo')
          .items([
            S.documentTypeListItem('newsArticle').title('Noticias'),
            S.documentTypeListItem('event').title('Eventos'),
            S.documentTypeListItem('gallery').title('Galerias'),
            S.divider(),
            S.documentTypeListItem('presenter').title('Locutores'),
            S.documentTypeListItem('program').title('Programas'),
            S.documentTypeListItem('banner').title('Banners'),
            S.divider(),
            S.listItem()
              .title('Configuracoes do site')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
