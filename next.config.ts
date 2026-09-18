import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

import { LEGACY_GONE_PATHS, LEGACY_GONE_PREFIXES, LEGACY_REDIRECTS } from "./lib/legacy-urls";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * O host público do Blob é derivado do token, exatamente como o adapter do Payload
 * faz (`vercel_blob_rw_<store>_<hash>` → `<store>.public.blob.vercel-storage.com`).
 * Sem token — num clone sem `.env`, por exemplo — o redirecionamento de compatibilidade
 * simplesmente não é registrado; o site continua buildando.
 */
const blobStoreId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
const blobHost = blobStoreId ? `${blobStoreId}.public.blob.vercel-storage.com` : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Destino das mídias da collection Media desde que o controlo de acesso do
        // Payload foi desligado (ver payload.config.ts). O curinga cobre qualquer
        // store, para o preview e a produção não dependerem de um id fixo aqui.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    /**
     * As únicas imagens locais que passam pelo otimizador são as da marca, em
     * public/brand. O padrão anterior era `/**`, que autorizava qualquer caminho:
     * cada variação pedida é uma transformação cobrada, e uma lista aberta permite a
     * terceiros gerarem transformações à vontade a partir do site.
     */
    localPatterns: [
      {
        pathname: "/brand/**",
      },
    ],
    /**
     * Uma transformação é cobrada por combinação distinta de (imagem, largura,
     * qualidade, formato). Com as listas padrão do Next — 8 `deviceSizes` e 8
     * `imageSizes` — só a home podia pedir 704 combinações diferentes, porque cada
     * densidade de tela escolhe uma largura diferente do srcset.
     *
     * Estas listas são dimensionadas pelo layout real: `.editorial-container` tem no
     * máximo 1340px, e os slots menores (logos, retratos) estão entre 120 e 272px.
     * 2048 cobre a tela grande em DPR 2; 3840 seria DPR 2,9 num slot de 1340px, que
     * não existe. Menos larguras também significa mais acertos de cache, porque os
     * visitantes convergem para as mesmas variações.
     */
    deviceSizes: [640, 828, 1080, 1440, 2048],
    imageSizes: [64, 128, 256, 384],
    /**
     * O nome do arquivo no Blob é a chave do objeto: trocar a imagem de um documento
     * grava outro nome, e o nome antigo deixa de ser referenciado. Como nenhuma URL
     * muda de conteúdo, o otimizador pode guardar o resultado pelo prazo máximo em
     * vez de revalidar a cada 4 horas (o padrão do Next 16).
     */
    minimumCacheTTL: 31_536_000,
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async redirects() {
    return [
      /**
       * Endereços do WordPress anterior que têm equivalente no site novo. Ficam aqui,
       * e não no proxy, porque `redirects()` é resolvido na camada de roteamento —
       * antes do middleware e sem invocar função nenhuma.
       */
      ...Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        // 301 explícito em vez de `permanent: true`, que no Next gera 308. Para o
        // Google os dois valem o mesmo, mas 301 é o código que qualquer rastreador,
        // proxy ou ferramenta de SEO antiga entende sem ambiguidade — e o que
        // importa aqui é justamente a fila de clientes herdada.
        statusCode: 301,
      })),
      /**
       * O filtro por cliente saiu de `?cliente=` para /portfolio/cliente/<slug>, para
       * /portfolio poder voltar a ser estática. O parâmetro antigo continua a funcionar
       * — está em links do próprio site já indexados — e é resolvido aqui, na camada de
       * roteamento, sem invocar função.
       */
      {
        source: "/portfolio",
        has: [{ type: "query", key: "cliente", value: "(?<cliente>.*)" }],
        destination: "/portfolio/cliente/:cliente",
        statusCode: 301,
      },
      /**
       * Antes de `disablePayloadAccessControl`, toda mídia era publicada sob
       * /api/media/file/<arquivo> — inclusive as imagens de OG já rastreadas pelos
       * buscadores. O endereço agora é o do Blob, e sem esta regra o caminho antigo
       * passaria a responder 404, porque o plugin deixa de registrar o handler.
       */
      ...(blobHost
        ? [
            {
              source: "/api/media/file/:path*",
              destination: `https://${blobHost}/:path*`,
              statusCode: 301,
            },
          ]
        : []),
    ];
  },
  async rewrites() {
    /**
     * O que não veio do WordPress para cá é reescrito para /conteudo-removido, que
     * responde 410. Fica em `rewrites()` e não no proxy porque o matcher do
     * middleware exige literais estáticos no build — e uma lista de 88 endereços
     * copiada à mão em dois lugares é uma divergência esperando para acontecer.
     *
     * `afterFiles` garante que uma rota real do site sempre vence a regra.
     */
    return {
      beforeFiles: [],
      afterFiles: [
        ...LEGACY_GONE_PREFIXES.map((prefix) => ({
          source: `${prefix}/:path*`,
          destination: "/conteudo-removido",
        })),
        ...LEGACY_GONE_PATHS.map((source) => ({ source, destination: "/conteudo-removido" })),
      ],
      fallback: [],
    };
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
