# Day 1：Runnable 核心系统深度理解

## 🎯 今日学习目标

1. **深度理解 Runnable 接口的设计哲学**
2. **动手实现官方风格的 Runnable 基类**  
3. **掌握 RunnableConfig 配置系统**
4. **了解流式处理的重要性**

---

## 📚 理论基础：Runnable 的设计哲学

### 为什么需要统一接口？

在 LangChain.js 中，你会遇到各种组件：
- **LLM 模型**：处理文本生成
- **提示模板**：格式化输入
- **输出解析器**：处理模型输出
- **检索器**：搜索相关文档
- **代理**：执行复杂任务

**问题**：这些组件功能完全不同，如何让它们无缝组合？

**解决方案**：所有组件都实现同一个接口 `Runnable<Input, Output>`

### Runnable 接口的三个核心方法

```typescript
interface Runnable<Input, Output> {
  // 🎯 核心方法：处理单个输入
  invoke(input: Input, options?: RunnableConfig): Promise<Output>;
  
  // 📦 批量方法：处理多个输入  
  batch(inputs: Input[], options?: RunnableConfig): Promise<Output[]>;
  
  // 🌊 流式方法：实时处理和响应
  stream(input: Input, options?: RunnableConfig): AsyncIterable<Output>;
}
```

### 统一接口的威力

```typescript
// 因为都实现 Runnable 接口，所以可以这样组合：
const llm: Runnable<string, string> = new ChatOpenAI();
const prompt: Runnable<{input: string}, string> = PromptTemplate.fromTemplate("问题：{input}");
const parser: Runnable<string, string> = new StringOutputParser();

// 无缝组合 - 这就是 LCEL 的基础！
const chain = prompt.pipe(llm).pipe(parser);
```

---

## 💻 实践环节：动手实现

### 步骤 1：项目基础结构

我们先创建一个干净的学习项目：

```
study/langchain/phase1-core/implementation/
├── src/
│   ├── core/
│   │   ├── runnable.ts         # Runnable 接口和基类
│   │   ├── config.ts           # RunnableConfig 配置系统
│   │   └── errors.ts           # 错误处理
│   ├── lambda/
│   │   └── runnable-lambda.ts  # RunnableLambda 实现
│   └── examples/
│       └── basic-usage.ts      # 基础使用示例
├── package.json
├── tsconfig.json
└── README.md
```

### 步骤 2：核心接口定义

**文件：`src/core/runnable.ts`**

让我们从最核心的接口开始：

```typescript
/**
 * 配置接口 - 控制 Runnable 的行为
 */
export interface RunnableConfig {
  // 回调处理器（后续学习）
  callbacks?: any[];
  
  // 标签，用于标识和调试
  tags?: string[];
  
  // 元数据，用于传递额外信息
  metadata?: Record<string, any>;
  
  // 运行名称，用于日志和监控
  runName?: string;
  
  // 超时设置（毫秒）
  timeout?: number;
  
  // 最大并发数（批量处理时）
  maxConcurrency?: number;
}

/**
 * Runnable 核心接口 - LangChain.js 的基石
 * 
 * @template Input - 输入类型
 * @template Output - 输出类型
 */
export interface Runnable<Input = any, Output = any> {
  /**
   * 处理单个输入 - 核心方法
   */
  invoke(input: Input, config?: RunnableConfig): Promise<Output>;
  
  /**
   * 批量处理多个输入
   */
  batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]>;
  
  /**
   * 流式处理 - 实时生成输出
   */
  stream(input: Input, config?: RunnableConfig): AsyncIterable<Output>;
  
  // 🔗 组合方法（LCEL 的基础）
  pipe<NewOutput>(
    next: Runnable<Output, NewOutput>
  ): Runnable<Input, NewOutput>;
}
```

### 步骤 3：抽象基类实现

```typescript
/**
 * Runnable 抽象基类
 * 提供默认实现和通用功能
 */
export abstract class BaseRunnable<Input = any, Output = any> 
  implements Runnable<Input, Output> {
  
  /**
   * 抽象方法：子类必须实现
   */
  abstract invoke(input: Input, config?: RunnableConfig): Promise<Output>;
  
  /**
   * 默认批量实现：逐个调用 invoke
   */
  async batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]> {
    const maxConcurrency = config?.maxConcurrency ?? 10;
    
    // 并发控制的批量处理
    const results: Output[] = [];
    
    for (let i = 0; i < inputs.length; i += maxConcurrency) {
      const chunk = inputs.slice(i, i + maxConcurrency);
      const chunkResults = await Promise.all(
        chunk.map(input => this.invoke(input, config))
      );
      results.push(...chunkResults);
    }
    
    return results;
  }
  
  /**
   * 默认流式实现：包装 invoke 结果
   */
  async* stream(input: Input, config?: RunnableConfig): AsyncIterable<Output> {
    const result = await this.invoke(input, config);
    yield result;
  }
  
  /**
   * 管道组合方法 - LCEL 的基础
   */
  pipe<NewOutput>(
    next: Runnable<Output, NewOutput>
  ): Runnable<Input, NewOutput> {
    return new RunnableSequence([this, next]);
  }
}
```

### 步骤 4：配置系统实现

**文件：`src/core/config.ts`**

```typescript
/**
 * 默认配置
 */
export const DEFAULT_CONFIG: RunnableConfig = {
  tags: [],
  metadata: {},
  maxConcurrency: 10,
  timeout: 30000, // 30秒
};

/**
 * 合并配置的工具函数
 */
export function mergeConfigs(
  base?: RunnableConfig,
  override?: RunnableConfig
): RunnableConfig {
  if (!base) return override || DEFAULT_CONFIG;
  if (!override) return base;
  
  return {
    ...base,
    ...override,
    tags: [...(base.tags || []), ...(override.tags || [])],
    metadata: { ...base.metadata, ...override.metadata },
  };
}

/**
 * 配置验证器
 */
export function validateConfig(config: RunnableConfig): void {
  if (config.timeout && config.timeout <= 0) {
    throw new Error("Timeout must be positive");
  }
  
  if (config.maxConcurrency && config.maxConcurrency <= 0) {
    throw new Error("Max concurrency must be positive");
  }
}
```

---

## 🔍 深度理解：为什么这样设计？

### 1. 类型安全的组合

```typescript
// TypeScript 可以推断出正确的类型
const stringToNumber: Runnable<string, number> = new MyRunnable();
const numberToBoolean: Runnable<number, boolean> = new AnotherRunnable();

// 组合后的类型是 Runnable<string, boolean>
const combined = stringToNumber.pipe(numberToBoolean);
```

### 2. 配置的传递性

```typescript
const config: RunnableConfig = {
  tags: ["production", "important"],
  timeout: 5000,
};

// 配置会传递给整个链
await combined.invoke("input", config);
```

### 3. 流式处理的重要性

在 AI 应用中，特别是聊天机器人，用户期望实时看到响应：

```typescript
// 流式处理让用户看到实时生成的文本
for await (const chunk of llm.stream("写一首诗")) {
  console.log(chunk); // 逐字输出
}
```

---

## ✅ 第一天验收

### 理论检验
1. **解释**：为什么 LangChain.js 需要统一的 Runnable 接口？
2. **分析**：`invoke`、`batch`、`stream` 三个方法的不同用途？
3. **设计**：RunnableConfig 的配置传递机制有什么好处？

### 实践检验  
1. **实现**：一个简单的 RunnableLambda 类
2. **测试**：基础的组合操作
3. **验证**：配置系统的工作原理

**准备好了吗？让我们开始动手实现！** 🚀 