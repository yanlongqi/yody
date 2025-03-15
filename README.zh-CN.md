<div align=center>

# <img src="https://storage.googleapis.com/sourcegraph-assets/cody/20230417/logomark-default.svg" width="26"> Cody

**具有最佳代码库理解能力的 AI 编程助手**

Cody 是一个 AI 编程助手，它利用最新的大语言模型和代码库上下文来帮助你更快地理解、编写和修复代码。

[文档](https://sourcegraph.com/docs/cody) • [cody.dev](https://about.sourcegraph.com/cody?utm_source=github.com&utm_medium=referral)

[![vscode extension](https://img.shields.io/vscode-marketplace/v/sourcegraph.cody-ai.svg?label=vscode%20ext)](https://marketplace.visualstudio.com/items?itemName=sourcegraph.cody-ai)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Twitter](https://img.shields.io/twitter/follow/sourcegraph.svg?label=Follow%20%40Sourcegraph&style=social)](https://twitter.com/sourcegraph)
[![Discord](https://dcbadge.vercel.app/api/server/s2qDtYGnAE?style=flat)](https://discord.gg/s2qDtYGnAE)

</div>

## 开始使用

[⭐ **从 VS Code 应用商店安装 Cody**](https://marketplace.visualstudio.com/items?itemName=sourcegraph.cody-ai) 或者从 [JetBrains 应用商店](https://plugins.jetbrains.com/plugin/9682-cody-ai-by-sourcegraph)安装，然后查看[演示](#演示)了解它的功能。

_&mdash; 或者 &mdash;_

- 在本地构建并运行 VS Code 扩展：`pnpm install && cd vscode && pnpm run dev`
- 查看[所有支持的编辑器](https://sourcegraph.com/docs/cody/clients)

## Cody 是什么？

Cody 是一个开源的 AI 编程助手，可以帮助你更快地理解、编写和修复代码。它使用高级搜索从本地和远程代码库中提取上下文，使你能够在任何规模的代码库中使用 API、符号和使用模式的上下文，所有这些都在你的 IDE 中完成。Cody 可以使用最新和最好的大语言模型，包括 Claude 3.5 Sonnet 和 GPT-4。

Cody 可用于 [VS Code](https://marketplace.visualstudio.com/items?itemName=sourcegraph.cody-ai)、[JetBrains](https://plugins.jetbrains.com/plugin/9682-cody-ai-by-sourcegraph) 和[网页版](https://sourcegraph.com/cody/chat)。

访问 [cody.dev](https://about.sourcegraph.com/cody?utm_source=github.com&utm_medium=referral) 了解更多信息。

## Cody 能做什么？

- **聊天：** 向 Cody 询问有关你代码库的问题。Cody 将使用语义搜索从你的代码库中检索文件，并使用这些文件的上下文来回答你的问题。你可以使用 @提及文件来指定特定的上下文，在 Cody Enterprise 版本中还可以添加远程仓库作为上下文。
- **自动完成：** Cody 在你输入时提供单行和多行建议，加快你的编码速度，减少查找函数和变量名的需求。
- **内联编辑：** 在文件的任何位置要求 Cody 修复或重构代码。
- **提示：** Cody 为常见操作提供快速、可自定义的提示。只需突出显示代码片段并运行提示，如"文档代码"、"解释代码"或"生成单元测试"。
- **可切换的 LLM：** 支持 Anthropic Claude 3.5 Sonnet、OpenAI GPT-4、Mixtral、Gemini 1.5 等。
  - **免费的 LLM 使用额度** Cody Free 版本为你提供 Anthropic Claude 3.5 Sonnet 和其他模型的访问权限。它适用于个人开发者的个人和工作代码，受合理的每用户使用限制（[更多信息](#使用说明)）。

## 演示

Cody 提供各种 AI 编码功能，如自动完成、聊天、智能应用、生成单元测试等。

以下是如何结合这些功能在大型代码库中使用 Cody 的示例。

https://www.loom.com/share/ae710891c9044069a9017ee98ce657c5

## 贡献

本仓库中的所有代码都是开源的（Apache 2）。

快速开始：运行 `pnpm install && pnpm build && cd vscode && pnpm run dev` 在本地构建 Cody VS Code 扩展。

查看[开发文档](doc/dev/index.md)了解更多信息。

### 反馈

Cody 有时神奇，有时令人沮丧地出错。Cody 的目标是既强大又准确。你可以这样帮助我们：

- 使用聊天侧边栏中的 <kbd>👍</kbd>/<kbd>👎</kbd> 按钮给出反馈。
- 当你发现问题时[提交 issue](https://github.com/sourcegraph/cody/issues)（或提交 PR！）。
- [社区论坛](https://community.sourcegraph.com/)
- [Discord](https://discord.gg/s2qDtYGnAE)

## 使用说明

### 个人使用

目前，个人使用 Cody 需要一个（免费的）[Sourcegraph.com](https://sourcegraph.com/?utm_source=github.com&utm_medium=referral) 账户，因为我们需要防止免费的 Anthropic/OpenAI LLM 使用被滥用。我们正在努力支持[更多可切换的 LLM 选项](https://sourcegraph.com/docs/cody/faq#can-i-use-my-own-api-keys)（包括使用你自己的 Anthropic/OpenAI 账户或自托管 LLM），以使 Cody 可以在没有任何第三方依赖的情况下使用。

### 在工作中使用 Cody

你可以在处理工作代码时使用 Cody Free 或 Cody Pro。如果这不能满足你的需求（因为你需要专用/单租户实例、审计日志、自带模型等），可以升级到 [Cody Enterprise](https://sourcegraph.com/pricing)。

### 现有 Sourcegraph 客户

Cody 编辑器扩展可与以下版本一起使用：

- Sourcegraph Cloud
- Sourcegraph Enterprise Server（自托管）5.1 或更高版本
