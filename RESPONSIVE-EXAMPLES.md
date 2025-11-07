# 🎨 Guia Prático de Classes Responsivas - Pesquisa360 EPAMIG

## 📱 Breakpoints em Uso

Todos os exemplos seguem a ordem **mobile-first**: base → xs → sm → md → lg → xl → 2xl

## 🧩 Componentes Comuns

### 1. Textos Responsivos

```tsx
// Títulos escaláveis
<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
  Título Principal
</h1>

// Parágrafos
<p className="text-xs sm:text-sm md:text-base lg:text-lg">
  Texto descritivo
</p>

// KPIs (números grandes)
<span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums">
  {valor}
</span>
```

### 2. Espaçamentos Adaptativos

```tsx
// Padding
<div className="p-3 sm:p-4 md:p-6 lg:p-8">
  Conteúdo com padding responsivo
</div>

// Margin
<section className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
  Seção com margem top adaptativa
</section>

// Gap em Grid/Flex
<div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 3. Layouts Grid

```tsx
// Grid de Cards (1 → 2 → 3 → 4 colunas)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</div>

// Grid assimétrico
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">Conteúdo Principal</div>
  <div>Sidebar</div>
</div>
```

### 4. Botões Responsivos

```tsx
// Botão com ícone e texto adaptativo
<button className="
  flex items-center gap-2
  px-3 sm:px-4 md:px-5
  py-2 sm:py-2.5
  text-xs sm:text-sm md:text-base
  rounded-lg
  focus-visible-ring
">
  <Icon />
  <span className="hidden sm:inline">Texto completo</span>
  <span className="sm:hidden">Curto</span>
</button>

// Grupo de botões que quebra em mobile
<div className="flex flex-wrap gap-2 sm:gap-3">
  <button>Ação 1</button>
  <button>Ação 2</button>
  <button>Ação 3</button>
</div>
```

### 5. Navegação Responsiva

```tsx
// Header adaptativo
<header className="
  flex flex-col sm:flex-row
  items-center justify-between
  px-4 sm:px-6 md:px-8
  py-3 sm:py-4
  gap-3 sm:gap-4
">
  <div>Logo</div>
  <nav className="
    flex items-center
    divide-x divide-gray-300
    text-xs sm:text-sm
  ">
    {/* Links */}
  </nav>
</header>

// Sidebar colapsável
<aside className={`
  fixed lg:static
  w-64 h-screen
  transition-transform duration-300
  ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
  {/* Conteúdo */}
</aside>
```

### 6. Tabelas Responsivas

```tsx
// Container com scroll horizontal
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
    <thead>
      <tr className="bg-[#025C3E] text-white">
        <th className="px-3 md:px-4 py-3 text-xs md:text-sm">
          Coluna
        </th>
      </tr>
    </thead>
    <tbody>
      {/* Linhas */}
    </tbody>
  </table>
</div>

// Alternativa: card em mobile, tabela em desktop
<div className="block md:hidden">
  {/* Cards para mobile */}
</div>
<div className="hidden md:block">
  <table>{/* Tabela para desktop */}</table>
</div>
```

### 7. Cards Adaptativos

```tsx
// Card que muda orientação
<div className="
  flex flex-col sm:flex-row
  p-4 sm:p-6
  gap-4
  bg-white rounded-xl shadow-md
">
  <div className="w-full sm:w-1/3">Imagem</div>
  <div className="flex-1">
    <h3 className="text-base sm:text-lg font-bold">Título</h3>
    <p className="text-sm sm:text-base">Descrição</p>
  </div>
</div>
```

### 8. Imagens Responsivas

```tsx
import Image from 'next/image';

// Logo adaptativo
<Image
  src="/logo.svg"
  alt="Logo"
  width={112}
  height={112}
  className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28"
  priority
/>

// Hero image com object-fit
<div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    className="object-cover"
  />
</div>
```

### 9. Formulários Responsivos

```tsx
// Input com label acima em mobile, lado em desktop
<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
  <label className="text-sm font-medium md:w-32">
    Nome:
  </label>
  <input className="
    flex-1 px-3 py-2
    text-sm md:text-base
    border rounded-lg
    focus-visible-ring
  " />
</div>

// Grid de campos
<form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  <div>Campo 1</div>
  <div>Campo 2</div>
  <div className="md:col-span-2">Campo Full Width</div>
</form>
```

### 10. Gráficos com Recharts

```tsx
import { ResponsiveContainer, BarChart } from 'recharts';

// Container adaptativo
<div className="w-full overflow-x-auto">
  <div className="min-w-[320px] h-[220px] sm:h-[240px] md:h-[260px] lg:h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ bottom: 60 }}>
        <XAxis 
          angle={-35} 
          height={70}
          tick={{ fontSize: 10 }} 
        />
        {/* Outros componentes */}
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
```

## 🎯 Padrões de Utilidade

### Visibilidade Condicional

```tsx
// Mostrar apenas em desktop
<div className="hidden lg:block">Desktop only</div>

// Mostrar apenas em mobile
<div className="block lg:hidden">Mobile only</div>

// Trocar entre componentes
<>
  <MobileComponent className="md:hidden" />
  <DesktopComponent className="hidden md:block" />
</>
```

### Container Centralizado

```tsx
// Container com max-width responsivo
<div className="
  w-full mx-auto
  px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
  max-w-screen-2xl
">
  Conteúdo
</div>
```

### Aspect Ratios

```tsx
// Manter proporção 16:9
<div className="aspect-video w-full bg-gray-200">
  <iframe className="w-full h-full" />
</div>

// Quadrado
<div className="aspect-square">...</div>
```

## ⚡ Performance Tips

### 1. Lazy Load de Imagens

```tsx
<Image 
  src="/large-image.jpg"
  loading="lazy"  // Carrega quando próximo à viewport
  placeholder="blur"
  blurDataURL="..."
/>
```

### 2. Condicional de Renderização

```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

return (
  <>
    {isMobile ? <MobileChart /> : <DesktopChart />}
  </>
);
```

### 3. CSS Containment

```tsx
<div className="contain-layout contain-paint">
  {/* Isola reflow/repaint */}
</div>
```

## 🐛 Troubleshooting

### Problema: Layout quebra em 375px
**Solução**: Use `min-w-[320px]` ou `xs:` breakpoint

### Problema: Texto muito pequeno em mobile
**Solução**: Base mínima de 14px (text-sm)

### Problema: Gráfico corta em mobile
**Solução**: Adicione `overflow-x-auto` no container pai

### Problema: Sidebar cobre conteúdo
**Solução**: Verifique `z-index` e `fixed` vs `absolute`

## 📚 Recursos Adicionais

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)

---

**Última atualização**: 2025-01-07

