# Relatório de Implementações — MundoCarteu

**Data:** 30 de abril de 2026  
**Projeto:** MundoCarteu — Visualizador de Funções Matemáticas  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4

---

## Visão Geral

Sistema web para representação gráfica interativa de funções do **1º grau** (afim) e **2º grau** (quadrática/parábola). O usuário ajusta os coeficientes `a`, `b` e `c` em tempo real via inputs numéricos e sliders; o gráfico e as informações matemáticas atualizam instantaneamente.

---

## Estrutura de Arquivos Criados

```
d:\Projetos\mundoCarteu\
├── package.json
├── tsconfig.json
├── next.config.ts
├── src\
│   ├── app\
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components\
│   │   ├── FunctionForm.tsx
│   │   ├── GraphCanvas.tsx
│   │   └── MathLegend.tsx
│   ├── hooks\
│   │   └── useGraphLogic.ts
│   └── utils\
│       └── mathHelpers.ts
└── docs\
    └── relatorio.md   ← este arquivo
```

---

## Detalhamento por Arquivo

### `src/utils/mathHelpers.ts`

Módulo de funções matemáticas puras (sem dependências externas):

| Função | Descrição |
|---|---|
| `generateLinearPoints(b, c)` | Gera array de `{x, y}` para f(x) = bx + c |
| `generateQuadraticPoints(a, b, c)` | Gera array de `{x, y}` para f(x) = ax² + bx + c |
| `calcRoots(a, b, c)` | Calcula raízes via Bhaskara; retorna `null` se Δ < 0 |
| `calcVertex(a, b, c)` | Calcula o vértice da parábola V = (−b/2a, −Δ/4a) |

Tipo exportado: `Point = { x: number; y: number }`.

---

### `src/hooks/useGraphLogic.ts`

Hook customizado `useGraphLogic(a, b, c)` que centraliza toda a lógica de estado do gráfico:

- Detecta automaticamente o **grau da função** (`a !== 0` → 2º grau; `a === 0` → 1º grau)
- Memoriza `points`, `roots` e `vertex` com `useMemo` para evitar recálculos desnecessários
- Retorna: `{ points, roots, vertex, yIntercept, degree }`

---

### `src/components/FunctionForm.tsx`

Formulário de entrada dos coeficientes `a`, `b` e `c`:

- Cada coeficiente possui um `<input type="number">` e um `<input type="range">` sincronizados
- Sliders com range de −10 a +10 e step de 0,1
- Prop `onChange(field, value)` notifica o componente pai de cada alteração
- Importa `ChangeEvent` diretamente de `react` (sem namespace `React.*`) — correção aplicada durante a sessão

---

### `src/components/GraphCanvas.tsx`

Componente de renderização do gráfico usando **Canvas API nativa** (sem bibliotecas externas):

- Recebe `points`, `vertex` e `roots` como props
- Calcula automaticamente o range dos eixos com base nos pontos gerados
- Renderiza:
  - **Grid** em cinza claro
  - **Eixos X e Y** com labels numéricas
  - **Curva** em índigo (2,5px)
  - **Raízes** em verde esmeralda com label `x=valor`
  - **Vértice** em âmbar com label `V(x, y)`
- Redesenha via `useEffect` sempre que as props mudam

---

### `src/components/MathLegend.tsx`

Painel lateral de informações matemáticas dinâmicas:

- **Expressão atual** da função (formata sinais automaticamente)
- **Tipo** da função (1º ou 2º grau)
- **Raízes**: x₁ e x₂ (ou "raiz dupla", ou "Δ < 0")
- **Vértice** com indicação de concavidade (mínimo/máximo)
- **Interseção com o eixo Y**: f(0) = c
- **Discriminante** Δ = b² − 4ac com interpretação textual

---

### `src/app/page.tsx`

Página principal com layout de **três colunas** responsivo:

```
[ FunctionForm ] [ GraphCanvas ] [ MathLegend ]
```

- Em telas menores que `lg` (1024px), as colunas empilham verticalmente
- Estado (`a`, `b`, `c`) gerenciado com `useState` e passado para `useGraphLogic`
- Valores iniciais: `a=1, b=0, c=-4` → parábola `f(x) = x² - 4`

---

### `src/app/layout.tsx`

Layout raiz da aplicação:

- `lang="pt-BR"`
- Metadata: título e descrição SEO
- Fundo cinza claro (`bg-gray-100`) com `antialiased`

---

## Problemas Encontrados e Resolvidos

### 1. Nome do projeto com letras maiúsculas
`create-next-app` rejeitou o nome `mundoCarteu` por restrições do npm (nomes de pacote não aceitam maiúsculas). **Solução:** projeto criado manualmente com `name: "mundocarteu"` no `package.json`, mantendo o nome real do diretório.

### 2. Erros TypeScript (`2503` e `7026`) em `FunctionForm.tsx`
Após a falha de instalação das dependências, o servidor TypeScript não encontrava `@types/react`. Dois ajustes foram aplicados:
- Adicionado `import type { ChangeEvent } from "react"` explícito
- Substituído `React.ChangeEvent<HTMLInputElement>` por `ChangeEvent<HTMLInputElement>`

### 3. Disco C cheio — `ENOSPC` no npm
O npm tenta escrever o cache em `C:\Users\artur\AppData\Local\npm-cache`. O disco C tinha apenas **330 MB livres**. **Solução:** cache redirecionado permanentemente para `D:\npm-cache` via:
```bash
npm config set cache "D:\npm-cache" --global
```

### 4. Vulnerabilidades de segurança
- **CVE-2025-66478** (Next.js 15.3.1 — crítica): resolvida atualizando para `next@latest`
- **GHSA-qx2v-qp2m-jg93** (PostCSS < 8.5.10 — moderada): dependência transitiva interna do Next.js; sem fix disponível sem breaking changes

---

## Como Executar

```bash
# Na raiz do projeto
npm run dev
```

Acesse `http://localhost:3000`.

---

## Dependências Principais

| Pacote | Versão | Função |
|---|---|---|
| `next` | latest (≥15.3.3) | Framework |
| `react` / `react-dom` | ^19 | UI |
| `tailwindcss` | ^4 | Estilização |
| `typescript` | ^5 | Tipagem estática |
| `@types/react` | ^19 | Tipos React |
