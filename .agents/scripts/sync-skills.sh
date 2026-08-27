#!/bin/bash

set -e

echo "Clean up existing skill sources and links..."
rm -rf $HOME/.agents/skills
rm -rf $HOME/.agents/skill-sources

mkdir -p $HOME/.agents/skills
mkdir -p $HOME/.agents/skill-sources
cd $HOME/.agents/skill-sources

echo "Cloning skill repositories..."
git clone https://github.com/cloudflare/skills cloudflare-skills
git clone https://github.com/openai/skills.git openai-skills

echo "Setting up symbolic links to skill sources..."
ln -s $HOME/.agents/skill-sources/cloudflare-skills/skills/cloudflare $HOME/.agents/skills/cloudflare-platform
ln -s $HOME/.agents/skill-sources/openai-skills/skills/.curated/openai-docs $HOME/.agents/skills/openai-docs
ln -s $HOME/.agents/skill-sources/openai-skills/skills/.system/skill-creator $HOME/.agents/skills/skill-creator

echo "Copying personal skills..."
cp -r $HOME/.agents/my-skills/* $HOME/.agents/skills/

echo "Done."
echo "NOTE: Skills may require available MCP servers to function correctly."