/**
 * 配置接口 - 控制 Runnable 的行为
 */
export interface RunnableConfig {
    // 超时时间（毫秒）
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
    invoke(input: Input, config?: RunnableConfig): Promise<Output>;
    batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]>;
    stream(input: Input, config?: RunnableConfig): AsyncIterable<Output>;
    pipe<NewOutput>(next: Runnable<Output, NewOutput>): Runnable<Input, NewOutput>;
}

/**
 * Runnable 抽象基类
 * 提供默认实现和通用功能
 */
export abstract class BaseRunnable<Input = any, Output = any> implements Runnable<Input, Output> {
    abstract invoke(input: Input, config?: RunnableConfig): Promise<Output>;

    async batch(inputs: Input[], config?: RunnableConfig): Promise<Output[]> {
        const {maxConcurrency = 10} = config || {};
        const results: Output[] = [];

        for (let i = 0; i < inputs.length; i += maxConcurrency) {
            const batch = inputs.slice(i, i + maxConcurrency);
            const batchResults = await Promise.all(batch.map(input => this.invoke(input, config)));
            results.push(...batchResults);
        }

        return results;
    }

    async *stream(input: Input, config?: RunnableConfig): AsyncIterable<Output> {
        yield await this.invoke(input, config);
    }

    /**
     * 管道组合方法 - LCEL 的基础
     */
    pipe<NewOutput>(next: Runnable<Output, NewOutput>): Runnable<Input, NewOutput> {
        return new RunnableSequence([this, next]);
    }
}

/**
 * RunnableSequence - 序列组合的实现
 * 这是 pipe 方法的核心
 */
export class RunnableSequence<Input = any, Output = any> extends BaseRunnable<Input, Output> {
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
}
