# Leve+ 🌿

Aplicativo mobile de acompanhamento de peso, refeições e evolução corporal.

**Status:** Fase 1 — demonstração visual com informações fictícias. Nada é enviado para servidor; alterações ficam apenas em memória e desaparecem ao recarregar o aplicativo. Não é um plano alimentar nem uma prescrição clínica.

## Tecnologia
Expo SDK 57, React Native 0.86, Expo Router, React 19, TypeScript e React Native Web. A mesma base serve à web, ao Android e ao iOS.

## Executar localmente
Instale Node.js 22.13 ou superior e rode:

\`\`\`bash
npm install
npx expo start --web
\`\`\`

Para gerar os arquivos estáticos da web: \`npx expo export --platform web\` (saída \`dist/\`).
Para verificar tipos: \`npm run typecheck\`.

## Prévia pública
O workflow \`.github/workflows/web-preview.yml\` valida, exporta a versão web e tenta publicá-la no GitHub Pages. No GitHub, em **Settings > Pages > Build and deployment > Source**, selecione **GitHub Actions** para permitir a publicação. Só utilize o endereço do Pages depois que o workflow terminar com sucesso. O modo de demonstração não armazena dados privados.

## Fluxos para testar
A tela inicial permite **Explorar demonstração** e **Experimentar onboarding**. Há quatro abas: Hoje, Alimentação, Evolução e Perfil. É possível adicionar e remover refeições de exemplo, registrar peso, comparar fotos escolhidas no próprio dispositivo (somente memória) e editar metas demonstrativas.

## Próximas fases
- Fase 2: autenticação Supabase, persistência e políticas RLS.
- Fase 3: cálculos energéticos documentados, base nutricional validada e fotos em storage privado.
- Fase 4: testes em dispositivos e builds EAS.

## Builds futuros
Arquivo \`eas.json\` preparado com perfis **preview** (APK interno Android) e **production** (AAB Android / distribuição iOS). Requer associação a uma conta Expo, credenciais e assinatura antes de qualquer build. Nenhum pacote foi publicado em loja.
