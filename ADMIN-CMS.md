# Painel administrativo da Radio Panama FM

O Sanity Studio fica em `studio/` e usa:

- Project ID: `9dvoysnt`
- Dataset: `production`
- Organization ID: `obTUWbHyS`

Nenhum token de API deve ser versionado. O login dos editores acontece pela
propria conta Sanity.

> Antes de importar conteudo ou publicar o Studio, revogue qualquer token que
> tenha sido compartilhado em conversa e crie um novo token com o menor acesso
> necessario.

## Desenvolvimento local

```powershell
cd studio
npm install
npm run dev
```

O painel local abre normalmente em `http://localhost:3333/admin`.

## Publicacao do painel

```powershell
cd studio
npm run build
npm run deploy
```

Na Vercel, o painel e publicado junto com o site em:

`https://www.radiopanamafm.com.br/admin`

Antes da publicacao, libere as origens CORS do site publico e dos ambientes de
preview no Sanity.

O site publico e o painel sao publicados juntos pela Vercel. O site consulta os
documentos publicados no dataset `production` diretamente pela API do Sanity.

## Modulos disponiveis

- Noticias: aparecem em `Ultimas Noticias`, em `/noticias` e em `/noticias/<slug>`.
- Eventos: aparecem abaixo das noticias, em `/eventos` e em `/eventos/<slug>`.
- Galerias: aparecem antes do footer, em `/galerias` e em `/galerias/<slug>`.
- Locutores: alimentam a secao `Nossa Equipe`.
- Programas: alimentam a secao `Grade Diaria`.
- Banners: alimentam o destaque do hero quando estiverem ativos e dentro do periodo.
- Configuracoes gerais: controlam stream, institucional, contatos e redes sociais.

O site consulta o Sanity diretamente. Depois que um documento e publicado no
Studio, ele aparece no site sem exigir um novo deploy.

## Importacao inicial

Os locutores e programas que existiam no HTML foram migrados para o Sanity com
IDs estaveis. O comando abaixo pode ser executado novamente sem duplicar os
documentos:

```powershell
cd studio
$env:SANITY_AUTH_TOKEN="<token temporario>"
npm run content:seed
```

## Seguranca

- Revogue tokens expostos e crie tokens separados por finalidade.
- O site publico deve usar somente leitura publica via CDN.
- Tokens de escrita devem existir apenas em ambientes de servidor protegidos.
- Restrinja usuarios do Studio aos papeis necessarios.
