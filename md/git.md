# Git Setup e Ligação ao Repositório

Este documento resume os passos para **ligar um projecto local a um repositório remoto Git** e resolver conflitos de histórico divergente.

---

```bash
# 1. Inicializar Git no projecto
cd /caminho/do/teu/projecto
git init

# 2. Configurar identidade do utilizador
git config --global user.name "Teu Nome"
git config --global user.email "teuemail@example.com"

# 3. Adicionar repositório remoto
git remote add origin https://github.com/joeldasilvamanuel/tcc.git
git remote -v

# 4. Adicionar ficheiros e fazer commit inicial
git add .
git commit -m "Primeiro commit do projecto"
git branch -M main

# 5. Resolver conflito com histórico remoto existente (se o repositório remoto já tiver ficheiros)
git pull origin main --no-rebase --allow-unrelated-histories

# Se aparecerem conflitos, editar ficheiros em conflito e depois:
git add .
git commit -m "Merge do histórico remoto com o projecto local"

# 6. Enviar alterações para o GitHub
git push -u origin main

# 7. Configuração recomendada para o futuro
git config pull.rebase false
# Ou globalmente
git config --global pull.rebase false

# 8. .gitignore recomendado para Node.js / Web
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

git add .gitignore
git commit -m "Adicionar gitignore"
git push
```
