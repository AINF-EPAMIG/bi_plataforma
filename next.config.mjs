/**
 * Arquivo ESM de configuração do Next.
 * Observação: existe também `next.config.js` em CJS. Manter os dois com o mesmo conteúdo
 * evita divergência de parâmetros que pode causar inconsistências na geração dos chunks
 * (especialmente em Windows com watch/hot reload), levando a erros de abertura como
 * UNKNOWN ao tentar ler `layout.js` enquanto é sobrescrito.
 * Para corrigir: alinhar opções aqui às do arquivo CJS.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

export default nextConfig;
