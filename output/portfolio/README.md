# Extração do Portfólio — revisão

94 cases extraídos da API pública e reconciliados com o sitemap. 59 estão na listagem principal; 35 constam apenas no sitemap. O PDF tem 95 páginas e preserva os textos de desafio e resultados dos 94 cases. Uma página renderizada (Instituto Arapyaú) também foi comparada com sua resposta da API, sem divergência.

## Arquivos

- `Portfolio_Move_Social.pdf`: fichas para revisão.
- `portfolio.csv`: tabela com textos e classificações.
- `portfolio.json`: dados completos, HTML original, taxonomias, candidatos no CMS e notas de revisão.
- `validation.json`: resultado da conferência de integridade.

## Ecossistemas que divergem entre texto e taxonomia

| Cliente | Texto do case | Taxonomia WordPress |
|---|---|---|
| EcoSocial | Cultura | Direitos Humanos; Empreendedorismo |
| Projeto Guri | Cultura | Direitos Humanos |
| Sustenidos | Cultura | Direitos Humanos |
| RaiaDrogasil | Saúde | Meio Ambiente |
| OMIDYAR | Educação e Direitos humanos | Direitos Humanos; Finanças |
| Instituto C&A | Desenvolvimento Organizacional | Educação |

Além dessas seis divergências, 36 cases têm vários ecossistemas e 20 têm vários serviços. O Payload aceita um ecossistema e um serviço textual por projeto. Antes de importar, deve-se decidir a regra de ecossistema principal ou ampliar o modelo para preservar a classificação múltipla. As sugestões no arquivo são provisórias; nunca substituem os valores originais.

No segmento, “Organização da Sociedade Civil” corresponde ao valor existente “Organização de Sociedade Civil”. Ambos estão preservados no JSON (original e proposta).

Foram conferidos 15 projetos e 12 clientes/logos existentes no CMS, sem alterações. Nomes repetidos não foram deduplicados: podem representar projetos distintos.

A coleta usou requests sequenciais com oito segundos de intervalo e cache. O conteúdo dos cases veio em cinco lotes de 20 itens no máximo. Nenhuma imagem foi baixada; suas URLs constam dos arquivos. Não houve importação, publicação ou mudança de schema.
