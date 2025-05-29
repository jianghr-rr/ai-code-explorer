# 贡献指南

首先，感谢您考虑为 AI 代码探索器项目做出贡献！正是像您这样的人让开源社区成为一个学习、启发和创造的绝佳场所。

## 🤝 贡献方式

### 报告错误

如果您发现了错误，请：

1. 检查是否已有相关的 Issue
2. 如果没有，请创建一个新的 Issue，包含：
    - 清晰的标题和描述
    - 重现步骤
    - 预期结果 vs 实际结果
    - 您的环境信息（操作系统、Node.js 版本等）

### 建议新功能

如果您有好的想法：

1. 先创建一个 Issue 来讨论这个功能
2. 说明为什么这个功能有用
3. 如果可能，提供实现的大致思路

### 提交代码

1. **Fork 项目**

    ```bash
    git clone https://github.com/yourusername/ai-code-explorer.git
    cd ai-code-explorer
    ```

2. **创建分支**

    ```bash
    git checkout -b feature/your-feature-name
    # 或者
    git checkout -b fix/your-bug-fix
    ```

3. **进行修改**

    - 遵循项目的代码风格
    - 添加必要的测试
    - 更新相关文档

4. **提交更改**

    ```bash
    git add .
    git commit -m "feat: 添加新功能的简短描述"
    ```

5. **推送到您的 Fork**

    ```bash
    git push origin feature/your-feature-name
    ```

6. **创建 Pull Request**

## 📝 代码规范

### 提交消息格式

我们使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/) 格式：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

类型包括：

-   `feat`: 新功能
-   `fix`: 修复错误
-   `docs`: 文档更新
-   `style`: 代码格式调整
-   `refactor`: 重构代码
-   `test`: 添加或修改测试
-   `chore`: 构建过程或辅助工具的变动

示例：

```
feat: 添加RunnableSequence的流式处理支持

实现了RunnableSequence的stream方法，支持链式组件的流式数据处理。

Closes #123
```

### 代码风格

-   使用 TypeScript
-   使用 2 个空格缩进
-   使用分号
-   优先使用 const，然后是 let，避免使用 var
-   使用有意义的变量和函数名

### 文档标准

-   所有公共 API 都需要 JSDoc 注释
-   README 和其他 Markdown 文件使用中文
-   代码注释使用中文，但变量名、函数名使用英文

## 🎯 优先级领域

我们特别欢迎以下方面的贡献：

1. **学习资源改进**

    - 更清晰的代码示例
    - 更详细的解释
    - 实践练习

2. **代码质量**

    - 添加测试用例
    - 性能优化
    - 错误处理改进

3. **文档完善**

    - API 文档
    - 教程和指南
    - FAQ 维护

4. **社区建设**
    - Issue 回复
    - 代码审查
    - 新人指导

## 🚀 开发环境设置

### 本地开发

1. **克隆项目**

    ```bash
    git clone https://github.com/yourusername/ai-code-explorer.git
    cd ai-code-explorer
    ```

2. **安装依赖**（如果有的话）

    ```bash
    npm install
    ```

3. **运行测试**（如果有的话）
    ```bash
    npm test
    ```

### 项目结构

```
ai-code-explorer/
├── README.md                  # 项目主文档
├── CONTRIBUTING.md           # 本文件
├── LICENSE                   # 许可证
├── langchainjs/             # 学习资源目录
│   ├── LEARNING_PATH.md     # 主要学习路径
│   ├── phase1-core/         # 核心实现
│   └── ...
└── ...
```

## 📋 Pull Request 检查清单

在提交 PR 之前，请确保：

-   [ ] 我已经阅读了贡献指南
-   [ ] 我的代码遵循项目的代码风格
-   [ ] 我已经进行了自我代码审查
-   [ ] 我已经添加了必要的测试
-   [ ] 新增和现有的测试都通过了
-   [ ] 我的更改需要文档更新，我已经更新了文档
-   [ ] 我的提交消息遵循约定式提交格式

## 🏷️ 标签说明

我们使用以下标签来组织 Issues 和 PR：

-   `bug` - 错误报告
-   `enhancement` - 功能增强
-   `documentation` - 文档相关
-   `good first issue` - 适合新贡献者
-   `help wanted` - 需要帮助
-   `question` - 问题咨询

## 💬 获得帮助

如果您需要帮助，可以：

1. 查看现有的 Issues 和 Discussions
2. 创建新的 Discussion
3. 在相关 Issue 中评论

## 🙏 致谢

每一个贡献，无论大小，都让这个项目变得更好。谢谢您的参与！

---

记住：我们的目标是创建一个对学习者友好、对贡献者包容的项目。让我们一起建设一个更好的 AI 学习社区！
