# LangChain.js Core 深度学习项目

## 🎯 项目目标

基于 LangChain.js 官方架构，从零开始实现和理解 `@langchain/core` 的核心概念。

## 📁 项目结构

```
src/
├── core/
│   ├── runnable.ts         # Runnable 接口和基类 ⭐⭐⭐⭐⭐
│   ├── config.ts           # RunnableConfig 配置系统
│   └── errors.ts           # 错误处理
├── lambda/
│   └── runnable-lambda.ts  # RunnableLambda 实现
└── examples/
    └── basic-usage.ts      # 第一天学习示例 🚀
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd study/langchain/phase1-core/implementation
npm install
```

### 2. 运行第一天的学习示例

```bash
npm run dev
```

你将看到 7 个实践示例，涵盖：
- ✅ 基础 RunnableLambda 使用
- ✅ 链式组合（pipe）
- ✅ 批量处理
- ✅ 流式处理
- ✅ 数字处理链
- ✅ 配置系统
- ✅ TypeScript 类型安全

### 3. 编译项目

```bash
npm run build
```

## 📚 学习路径

### Day 1-2：Runnable 核心系统 ⭐⭐⭐⭐⭐

**今日重点**：
- 理解 Runnable 接口的设计哲学
- 掌握 `invoke`、`batch`、`stream` 三个核心方法
- 学会使用 `pipe` 方法进行链式组合
- 了解 RunnableConfig 配置系统

**实践任务**：
1. 运行 `basic-usage.ts` 示例
2. 尝试修改示例代码
3. 创建自己的 RunnableLambda 实现

### Day 3-4：LCEL (即将到来)

- 学习 LangChain Expression Language
- 理解 `|` 操作符的实现
- 掌握并行组合和条件分支

### Day 5-7：回调系统 (即将到来)

- LangSmith 集成
- 调试和监控
- 错误处理策略

## 🔍 核心概念详解

### Runnable 接口

所有 LangChain.js 组件的基础接口：

```typescript
interface Runnable<Input, Output> {
  invoke(input: Input, config?: RunnableConfig): Promise<Output>;
  batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]>;
  stream(input: Input, config?: RunnableConfig): AsyncIterable<Output>;
  pipe<NewOutput>(next: Runnable<Output, NewOutput>): Runnable<Input, NewOutput>;
}
```

### 为什么需要统一接口？

1. **组合能力**：所有组件都可以用 `pipe` 方法组合
2. **类型安全**：TypeScript 确保组合时类型匹配
3. **批量处理**：统一的批量处理接口
4. **流式处理**：支持实时响应
5. **配置传递**：配置可以在整个链中传递

### RunnableLambda 的重要性

RunnableLambda 是最基础的 Runnable 实现，它：
- 将普通函数包装成 Runnable
- 提供了学习其他 Runnable 的基础
- 展示了 Runnable 的基本实现模式

## 🎯 实践建议

1. **先运行示例**：理解基本概念
2. **修改代码**：尝试不同的组合
3. **创建新的 RunnableLambda**：加深理解
4. **阅读源码**：理解实现细节
5. **对比官方**：学习官方的实现差异

## 🔧 开发工具

- **TypeScript**：提供类型安全
- **ts-node**：直接运行 TypeScript
- **Jest**：单元测试（即将添加）

## 📖 相关资源

- [LangChain.js 官方文档](https://js.langchain.com/)
- [Runnable 概念文档](https://js.langchain.com/docs/expression_language/interface)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)

## ❓ 常见问题

### Q: 为什么所有方法都是异步的？
A: AI 操作通常涉及网络请求，异步设计确保了一致性和性能。

### Q: 为什么需要泛型？
A: 泛型确保类型安全，让 TypeScript 能够推断出正确的输入输出类型。

### Q: pipe 和 LCEL 的 | 操作符有什么区别？
A: pipe 是方法调用，| 是 LCEL 的语法糖，功能类似但 | 更简洁。

---

**准备好开始你的 LangChain.js 学习之旅了吗？运行 `npm run dev` 开始第一天的实践！** 🚀 