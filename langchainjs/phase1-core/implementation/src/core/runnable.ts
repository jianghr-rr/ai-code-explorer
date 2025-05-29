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
  
  /**
   * 管道组合方法 - LCEL 的基础
   */
  pipe<NewOutput>(
    next: Runnable<Output, NewOutput>
  ): Runnable<Input, NewOutput>;
}

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

/**
 * RunnableSequence - 序列组合的实现
 * 这是 pipe 方法的核心
 */
export class RunnableSequence<Input = any, Output = any> 
  extends BaseRunnable<Input, Output> {
  
  constructor(private steps: Runnable<any, any>[]) {
    super();
  }
  
  async invoke(input: Input, config?: RunnableConfig): Promise<Output> {
    let current: any = input;
    
    for (const step of this.steps) {
      current = await step.invoke(current, config);
    }
    
    return current as Output;
  }
  
  /**
   * 优化的批量处理 - 整个序列一次性处理所有输入
   */
  async batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]> {
    let currentInputs: any[] = inputs;
    
    for (const step of this.steps) {
      currentInputs = await step.batch(currentInputs, config);
    }
    
    return currentInputs as Output[];
  }
  
  /**
   * 流式处理 - 逐步传递流
   */
  async* stream(input: Input, config?: RunnableConfig): AsyncIterable<Output> {
    let currentStream: AsyncIterable<any> = (async function* () {
      yield input;
    })();
    
    for (const step of this.steps) {
      currentStream = this.streamThroughStep(step, currentStream, config);
    }
    
    for await (const chunk of currentStream) {
      yield chunk as Output;
    }
  }
  
  private async* streamThroughStep(
    step: Runnable<any, any>,
    inputStream: AsyncIterable<any>,
    config?: RunnableConfig
  ): AsyncIterable<any> {
    for await (const input of inputStream) {
      for await (const output of step.stream(input, config)) {
        yield output;
      }
    }
  }
} 