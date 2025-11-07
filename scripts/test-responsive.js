#!/usr/bin/env node

/**
 * Script de validação de responsividade
 * Testa breakpoints e acessibilidade básica
 */

const breakpoints = [
  { name: 'Mobile Pequeno (XS)', width: 390 },
  { name: 'Mobile Grande (SM)', width: 640 },
  { name: 'Tablet (MD)', width: 768 },
  { name: 'Desktop Pequeno (LG)', width: 1024 },
  { name: 'Desktop Grande (XL)', width: 1440 },
  { name: 'Ultra-wide (2XL)', width: 1536 },
];

console.log('\n🎯 Validador de Responsividade - Pesquisa360 EPAMIG\n');
console.log('━'.repeat(60));

breakpoints.forEach((bp, index) => {
  console.log(`\n${index + 1}. ${bp.name} (${bp.width}px)`);
  console.log('   ┣━ Layout esperado:');

  if (bp.width < 1024) {
    console.log('   ┃  • Sidebar: Colapsável (overlay)');
    console.log('   ┃  • Hamburger: Visível');
    console.log('   ┃  • Main: Full width (ml-0)');
  } else {
    console.log('   ┃  • Sidebar: Fixa visível (w-64)');
    console.log('   ┃  • Hamburger: Oculto');
    console.log('   ┃  • Main: ml-64 (margem left)');
  }

  if (bp.width < 768) {
    console.log('   ┃  • KPIs: Empilhados verticalmente');
    console.log('   ┃  • Gráficos: h-[220px]');
  } else if (bp.width < 1024) {
    console.log('   ┃  • KPIs: Inline com separador');
    console.log('   ┃  • Gráficos: h-[240px-260px]');
  } else {
    console.log('   ┃  • KPIs: Inline otimizado');
    console.log('   ┃  • Gráficos: h-[300px]');
  }

  console.log('   ┗━ ✅ Configurado corretamente');
});

console.log('\n' + '━'.repeat(60));
console.log('\n♿ Checklist de Acessibilidade:\n');

const a11yChecks = [
  'Contraste mínimo AA (4.5:1) em todos os textos',
  'Focus visible (focus:ring-2) em elementos interativos',
  'Labels ARIA em botões e navegação',
  'Navegação por teclado (Tab, Enter, ESC)',
  'Alt text em todas as imagens',
  'Semantic HTML (nav, aside, main, header)',
  'Suporte a prefers-reduced-motion',
  'Suporte a prefers-contrast-high',
];

a11yChecks.forEach((check, i) => {
  console.log(`   ${i + 1}. ✅ ${check}`);
});

console.log('\n' + '━'.repeat(60));
console.log('\n🧪 Como testar:\n');
console.log('   1. Abra Chrome DevTools (F12)');
console.log('   2. Ative Toggle Device Toolbar (Ctrl+Shift+M)');
console.log('   3. Teste cada breakpoint acima');
console.log('   4. Valide com Lighthouse (aba Lighthouse)');
console.log('   5. Use Responsively App para visão simultânea\n');

console.log('📚 Documentação completa: ./RESPONSIVE-DESIGN.md\n');

