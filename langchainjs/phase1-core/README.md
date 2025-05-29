# 第一阶段：@langchain/core 深度理解

## 🎯 本阶段学习目标

基于 LangChain.js 官方架构，深度理解整个框架的基石 `@langchain/core`。这个包包含所有基础抽象，是理解 LangChain.js 的关键。

## 📋 学习进度追踪

- [ ] **Day 1-2**: Runnable 核心系统 ⭐⭐⭐⭐⭐
- [ ] **Day 3-4**: LCEL (LangChain Expression Language) 核心 ⭐⭐⭐⭐⭐  
- [ ] **Day 5-7**: 回调系统和 LangSmith 集成 ⭐⭐⭐⭐

---

## 🟢 Day 1-2：Runnable 核心系统

### 为什么 Runnable 是核心？

在 LangChain.js 中，**所有组件都实现 Runnable 接口**。这是统一所有 AI 组件的设计哲学：

```typescript
// 官方的 Runnable 设计哲学
interface Runnable<Input, Output> {
  invoke(input: Input, options?: RunnableConfig): Promise<Output>;
  batch(inputs: Input[], options?: RunnableConfig): Promise<Output[]>;
  stream(input: Input, options?: RunnableConfig): AsyncIterable<Output>;
}
```

### 今日学习重点

1. **统一接口的威力**：为什么所有组件都需要实现这个接口？
2. **配置传递系统**：`RunnableConfig` 的设计巧思
3. **流式优先理念**：为什么 `stream` 是一等公民？

### 实践任务

我们将从零开始实现官方风格的 Runnable 系统：

1. 创建基础 `Runnable` 抽象类
2. 理解 `RunnableConfig` 配置系统
3. 探索官方的错误处理策略
4. 实现基础的 `RunnableLambda`

### 学习方法

📚 **理论学习** → 💻 **动手实践** → 🔍 **源码对比** → ✅ **验收测试**

---

## 📝 第一天具体任务清单

### ✅ 任务 1：理解 Runnable 接口设计理念
- [ ] 阅读官方文档中的 Runnable 概念
- [ ] 理解为什么需要统一接口
- [ ] 掌握三个核心方法的用途

### ✅ 任务 2：实现基础 Runnable 抽象类  
- [ ] 创建 TypeScript 项目结构
- [ ] 实现 `Runnable<Input, Output>` 接口
- [ ] 添加基础的错误处理

### ✅ 任务 3：探索 RunnableConfig
- [ ] 理解配置传递的设计原理
- [ ] 实现基础的配置系统
- [ ] 了解回调机制的预留接口

---

## 🔧 准备工作

在开始之前，我们需要创建学习项目的基础结构。

**你准备好开始第一天的学习了吗？**

输入任何内容开始，或者如果你有特定问题可以直接提出！ 