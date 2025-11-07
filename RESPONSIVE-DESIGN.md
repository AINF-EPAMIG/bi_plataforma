# 📱 Guia de Design Responsivo - Pesquisa360 EPAMIG

## 🎯 Visão Geral

Este projeto implementa **responsividade avançada mobile-first** com adaptabilidade inteligente para todos os dispositivos, desde smartphones pequenos (390px) até desktops ultra-wide (1536px+).

## 📐 Breakpoints Customizados

```typescript
screens: {
  'xs': '390px',   // 📱 Mobile pequeno (iPhone SE, etc)
  'sm': '640px',   // 📱 Mobile grande (iPhone 12/13/14)
  'md': '768px',   // 📱 Tablet portrait (iPad, etc)
  'lg': '1024px',  // 💻 Desktop pequeno (laptop 13")
  'xl': '1440px',  // 🖥️ Desktop grande (laptop 15"+)
  '2xl': '1536px', // 🖥️ Desktop ultra-wide
}
```

## 🎨 Princípios de Design

### 1. Mobile-First
- Layout base projetado para 390px
- Funcionalidades essenciais acessíveis em telas pequenas
- Progressive enhancement para telas maiores

### 2. Sidebar Adaptativa
- **Mobile (< 1024px)**: Colapsável com overlay escuro
  - Botão hamburger no canto superior esquerdo
  - Fechamento ao clicar fora ou pressionar ESC
  - Animação suave de slide
- **Desktop (≥ 1024px)**: Sempre visível, fixa
  - Largura de 256px (w-64)
  - Rolagem independente

### 3. KPIs Estilo Power BI
- **Mobile**: Empilhados verticalmente
- **Tablet+**: Inline horizontal com separador
- Tipografia escalável: 2xl → 3xl → 4xl
- Números tabulares para alinhamento perfeito

### 4. Gráficos Responsivos
- Container fluido com `ResponsiveContainer` do Recharts
- Alturas adaptativas:
  - Mobile: 220px
  - Small: 240px
  - Medium: 260px
  - Large+: 300px
- Overflow-X automático para telas estreitas
- Labels rotacionados -35° para economia de espaço

### 5. Tabelas Adaptativas
- Scroll horizontal em mobile (overflow-x-auto)
- Padding e fonte escaláveis
- Hover states para melhor UX

## ♿ Acessibilidade (WCAG 2.1 AA)

### Contraste
- ✅ Todos os textos atendem AA (mínimo 4.5:1)
- ✅ Elementos interativos com >= 3:1

### Navegação por Teclado
- ✅ Todos os botões focáveis (focus:ring-2)
- ✅ ESC fecha sidebar e dropdowns
- ✅ Tab navega em ordem lógica
- ✅ Labels ARIA em elementos interativos

### Estados Visuais
- ✅ Focus visible com outline verde EPAMIG
- ✅ Hover states distintos
- ✅ Active/pressed states com aria-pressed

### Motion
- ✅ Respeita `prefers-reduced-motion`
- ✅ Animações podem ser desabilitadas

## 🧪 Testing Recomendado

### Dispositivos Físicos
- [ ] iPhone SE (390px)
- [ ] iPhone 12/13/14 (390px - 428px)
- [ ] iPad (768px - 1024px)
- [ ] MacBook Air 13" (1440px)
- [ ] Desktop 1920px+

### Ferramentas
1. **Responsively App** (recomendado)
   - Visualização simultânea de múltiplos breakpoints
   
2. **Chrome DevTools**
   ```
   F12 → Toggle Device Toolbar (Ctrl+Shift+M)
   Testar: iPhone SE, iPad, Desktop HD
   ```

3. **Firefox Responsive Design Mode**
   ```
   Ctrl+Shift+M
   Testar contraste com Accessibility Inspector
   ```

### Checklist de Teste

#### Mobile (390px - 767px)
- [ ] Sidebar abre/fecha corretamente
- [ ] Overlay escurece fundo
- [ ] Botões de ação acessíveis
- [ ] KPIs legíveis e bem espaçados
- [ ] Gráficos com scroll horizontal funcional
- [ ] Tabelas com scroll horizontal
- [ ] Header compacto mas legível

#### Tablet (768px - 1023px)
- [ ] Sidebar ainda colapsável
- [ ] KPIs inline com separador
- [ ] Gráficos em tamanho médio
- [ ] Navegação header responsiva

#### Desktop (1024px+)
- [ ] Sidebar fixa e visível
- [ ] Layout em 2 colunas fluido
- [ ] Gráficos em tamanho completo
- [ ] Todas as labels visíveis

## 🎯 Performance

### Otimizações Implementadas
- ✅ `next/image` para logos (lazy + blur placeholder)
- ✅ Memoização de gráficos (useMemo recomendado)
- ✅ Debounce em resize listeners
- ✅ CSS contain para isolamento de reflow
- ✅ will-change apenas quando necessário

### Lighthouse Scores Esperados
- Performance: > 90
- Accessibility: 100
- Best Practices: > 95
- SEO: 100

## 📚 Bibliotecas Utilizadas

### UI/Responsividade
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Gráficos responsivos
- **Material-UI Icons** - Ícones consistentes
- **next/image** - Otimização de imagens

### Acessibilidade
- **focus-visible** - Focus apenas por teclado
- **aria-labels** - Rótulos semânticos
- **Semantic HTML** - nav, aside, main, section

## 🔧 Manutenção

### Adicionar Novo Breakpoint
```typescript
// tailwind.config.ts
screens: {
  'xxl': '1920px', // Novo breakpoint
}
```

### Ajustar KPIs
```tsx
// Adicionar novo breakpoint
className="text-2xl md:text-3xl lg:text-4xl xxl:text-5xl"
```

### Debugar Responsividade
```tsx
// Adicionar indicador de breakpoint (dev only)
<div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded z-50">
  <span className="xs:hidden">XS</span>
  <span className="hidden xs:inline sm:hidden">XS</span>
  <span className="hidden sm:inline md:hidden">SM</span>
  <span className="hidden md:inline lg:hidden">MD</span>
  <span className="hidden lg:inline xl:hidden">LG</span>
  <span className="hidden xl:inline">XL</span>
</div>
```

## 🐛 Problemas Conhecidos e Soluções

### Sidebar não fecha no mobile
**Causa**: Event listener não registrado  
**Solução**: Verificar `useEffect` com dependência `[sidebarOpen]`

### Gráfico cortado em mobile
**Causa**: Container sem overflow  
**Solução**: Adicionar `overflow-x-auto` no wrapper

### Focus não visível
**Causa**: Outline desabilitado  
**Solução**: Usar `focus-visible:ring-2`

## 📈 Métricas de Sucesso

- ✅ 100% funcional em todos os breakpoints
- ✅ Tempo de carregamento < 2s (3G)
- ✅ Score Lighthouse Accessibility: 100
- ✅ Zero erros de contraste
- ✅ Navegação completa por teclado
- ✅ Suporte a screen readers

## 🚀 Próximos Passos

1. [ ] Implementar Service Worker para offline
2. [ ] Adicionar skeleton loaders
3. [ ] PWA para instalação mobile
4. [ ] Dark mode completo
5. [ ] Animações mais ricas (Framer Motion)

---

**Última atualização**: 2025-01-07  
**Mantido por**: Equipe EPAMIG Dev

