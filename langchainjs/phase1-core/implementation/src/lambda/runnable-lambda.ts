import { BaseRunnable, RunnableConfig } from '../core/runnable';

/**
 * RunnableLambda - 将普通函数包装成 Runnable
 * 这是最基础的 Runnable 实现
 */
export class RunnableLambda<Input = any, Output = any> extends BaseRunnable<Input, Output> {
  constructor(private func: (input: Input) => Output | Promise<Output>) {
    super();
  }
  
  async invoke(input: Input, config?: RunnableConfig): Promise<Output> {
    try {
      // 应用超时控制
      if (config?.timeout) {
        return await this.withTimeout(input, config.timeout);
      }
      
      const result = await this.func(input);
      return result;
    } catch (error) {
      console.error(`RunnableLambda error:`, error);
      throw error;
    }
  }
  
  /**
   * 超时控制的辅助方法
   */
  private async withTimeout(input: Input, timeoutMs: number): Promise<Output> {
    return new Promise<Output>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Function execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      
      Promise.resolve(this.func(input))
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }
  
  /**
   * 工厂方法 - 更方便的创建方式
   */
  static from<Input, Output>(
    func: (input: Input) => Output | Promise<Output>
  ): RunnableLambda<Input, Output> {
    return new RunnableLambda(func);
  }
}

// 一些常用的工厂函数

/**
 * 创建字符串处理的 RunnableLambda
 */
export const createStringProcessor = (
  processor: (text: string) => string
): RunnableLambda<string, string> => {
  return RunnableLambda.from(processor);
};

/**
 * 创建数字处理的 RunnableLambda
 */
export const createNumberProcessor = (
  processor: (num: number) => number
): RunnableLambda<number, number> => {
  return RunnableLambda.from(processor);
};

/**
 * 创建异步处理的 RunnableLambda
 */
export const createAsyncProcessor = <Input, Output>(
  processor: (input: Input) => Promise<Output>
): RunnableLambda<Input, Output> => {
  return RunnableLambda.from(processor);
}; 