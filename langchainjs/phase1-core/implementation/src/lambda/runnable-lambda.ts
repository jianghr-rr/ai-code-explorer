import {BaseRunnable, RunnableConfig} from '../core/runnable';

/**
 * RunnableLambda - 将普通函数包装成 Runnable
 * 这是最基础的 Runnable 实现
 */
export class RunnableLambda<Input = any, Output = any> extends BaseRunnable<Input, Output> {
    constructor(private func: (input: Input) => Output | Promise<Output>) {
        super();
    }

    async invoke(input: Input, config?: RunnableConfig): Promise<Output> {
        if (config?.timeout) {
            return await this.withTimeout(input, config.timeout);
        }
        return await this.func(input);
    }

    /**
     * 超时控制的辅助方法
     */
    private async withTimeout(input: Input, timeout: number): Promise<Output> {
        return Promise.race<Output>([
            this.func(input),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
        ]);
    }

    static from<Input, Output>(func: (input: Input) => Output | Promise<Output>): RunnableLambda<Input, Output> {
        return new RunnableLambda(func);
    }
}

// 一些常用的工厂函数

/**
 * 创建字符串处理的 RunnableLambda
 */
export const createStringProcessor = (processor: (text: string) => string): RunnableLambda<string, string> => {
    return RunnableLambda.from(processor);
};
