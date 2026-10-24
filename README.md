# Zaffenate — Site institucional B2B

Site **estático** em HTML/CSS/JavaScript. Compatível com GitHub Pages, sem Node, banco de dados, autenticação, API paga ou dados de visitantes armazenados pelo site. O objetivo é apresentar soldagem industrial, fabricação metálica e parcerias corporativas, sem inventar capacidades de engenharia ou certificações.

## Executar localmente

```bash
python3 -m http.server 8000
# http://localhost:8000
```

**Publicação segura:** `python3 scripts/build_public.py`. Publique exclusivamente a pasta `_site_public` ou use `.github/workflows/static.yml` para GitHub Pages. **Nunca publique o repositório inteiro**, nem arquivos de desenvolvimento; a allowlist do build publica somente páginas e mídias aprovadas. O projeto não contém rotas administrativas nem páginas de login. Se houver painel privado no futuro, implemente autenticação e autorização no servidor/gateway, não o esconda apenas com JavaScript/robots.txt.

## Funcionalidades

- `/`: home B2B, serviços reais, fotos de trabalhos, FAQ e mapa acionado pelo visitante.
- `/parcerias-industriais/`: conteúdo para construtoras, empreiteiras e indústrias, sem promessa de engenharia não verificada.
- `/contato/`: formulário de cotação com validação client-side que apenas **preenche a mensagem do WhatsApp**, sem enviar ao servidor do site; usuário confirma a mensagem no WhatsApp. Não há envio de e-mail automático nem armazenamento.
- `/privacidade/`: política descritiva com contatos para exercício de direitos e preferência de cookies.
- `/soldagem-industrial/` etc: páginas de serviços preservam URLs e possuem schema `Service`, informações B2B e interlinking.
- `/404.html`: rota de erro amigável em GitHub Pages. `/500.html`: arquivo pronto para hospedagem que permita definir uma página 500 — **GitHub Pages não mapeia automaticamente erros 500**.
- JSON-LD válido com `Organization`, `LocalBusiness`/`HomeAndConstructionBusiness` e `Service`; **sem avaliações forjadas ou `AggregateRating` impróprio**.
- OG 1200×630 JPG baseado em foto real; WebP otimizado nas galerias.

## Google Maps e avaliações

O mapa usa iframe de pesquisa/endereço sem chave de API, incluído somente depois do clique "Carregar mapa interativo". Existe alternativa sempre disponível "Abrir rota no Google Maps". Como o mapa é serviço externo, pode ficar indisponível por bloqueadores/restrições do Google: o link de fallback permanece.

A seção de avaliações anterior foi removida. Ela exigia uma chave Google Maps JavaScript API exposta e poderia deixar mensagens de erro no site. **A chave exposta anteriormente deve ser revogada/rotacionada e a cobrança da API revisada no Google Cloud.** Não geramos avaliações fictícias. Se no futuro forem exibidas avaliações reais, respeitar as políticas de origem e não esperar rich snippets de estrelas da própria empresa no Google.

## Analytics, consentimento e LGPD

O ID público do GA4 está em `assets/site.js`. O script da Google Tag **não é carregado** até que o visitante aceite análises. É possível revogar no rodapé. A preferência (aceita/recusa) é salva localmente; nenhum dado do formulário é armazenado no site. Google Maps também tem ação separada de carregamento.

A política de privacidade documenta **esta implementação**, mas deve ser revisada pelo responsável da empresa, sobretudo processos internos de atendimento, gestão de conversas e prazos de retenção. Ferramentas de hospedagem e serviços externos podem gerar registros próprios. Em contato B2B, combinar canal adequado antes de compartilhar especificações confidenciais. Um formulário com backend futuro exigirá medidas adicionais de segurança, retenção e base legal.

## Segurança e operação

- **Nenhum código de frontend consegue impedir sozinho o acesso a uma rota pública.** Administração e staging devem ser protegidos no servidor e **não incluídos nos artefatos publicados**.
- Recursos de erro e stack traces não são renderizados pela aplicação; configuração de erros HTTP e headers como `Content-Security-Policy`, `Strict-Transport-Security` e `X-Content-Type-Options` depende do host/CDN. GitHub Pages não oferece configuração personalizada completa desses headers.
- Manter certificados, CNPJ, endereços, alegações de experiência e capacidade atualizados após conferência com o responsável.
- Após publicação, verificar Search Console, Rich Results Test, indexação, Core Web Vitals e testes do PageSpeed Insights em rede real. **Pontuação 90+ é meta sujeita a teste real, não garantia.**
- Como os serviços de engenharia, ART e profissional habilitado não foram comprovados, o copy **não afirma** disponibilidade de engenheiro responsável nem certificações técnicas.

## Check de publicação

1. Revogar a antiga chave do Google Maps do código enviado, que estava exposta em `assets/reviews-config.js`.
2. Conferir endereço, WhatsApp, CNPJ, razão social e textos comerciais com a Zaffenate.
3. Executar `python3 scripts/build_public.py` e publicar somente `_site_public`.
4. Validar links, navegação mobile, consentimento, mapa, formulário e erros 404 no domínio final.
5. Verificar o site no Search Console e enviar `https://www.zaffenate.com.br/sitemap.xml`.
6. Testar OG no LinkedIn/WhatsApp e velocidade no PageSpeed Insights.
