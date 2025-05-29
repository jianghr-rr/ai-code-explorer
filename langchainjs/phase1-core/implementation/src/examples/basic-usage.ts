import { RunnableLambda, createStringProcessor, createNumberProcessor } from '../lambda/runnable-lambda';

/**
 * 第一天实践示例：Runnable 基础用法
 */
async function main() {
  console.log('🚀 开始 LangChain.js Runnable 学习\n');
  
  // ===== 示例 1：基础 RunnableLambda =====
  console.log('📝 示例 1：基础 RunnableLambda');
  
  const upperCase = RunnableLambda.from((text: string) => text.toUpperCase());
  
  const result1 = await upperCase.invoke('hello world');
  console.log(`输入: "hello world"`);
  console.log(`输出: "${result1}"`);
  console.log();
  
  // ===== 示例 2：链式组合（Pipe） =====
  console.log('🔗 示例 2：链式组合');
  
  const addPrefix = createStringProcessor(text => `[处理过] ${text}`);
  const makeExciting = createStringProcessor(text => `${text}!!!`);
  
  // 使用 pipe 方法组合
  const pipeline = upperCase.pipe(addPrefix).pipe(makeExciting);
  
  const result2 = await pipeline.invoke('hello world');
  console.log(`输入: "hello world"`);
  console.log(`经过链式处理: "${result2}"`);
  console.log();
  
  // ===== 示例 3：批量处理 =====
  console.log('📦 示例 3：批量处理');
  
  const inputs = ['hello', 'world', 'langchain', 'javascript'];
  const results = await pipeline.batch(inputs);
  
  console.log('批量输入:', inputs);
  console.log('批量输出:', results);
  console.log();
  
  // ===== 示例 4：流式处理 =====
  console.log('🌊 示例 4：流式处理');
  
  console.log('流式输出: ');
  for await (const chunk of pipeline.stream('streaming test')) {
    console.log(`  📄 ${chunk}`);
  }
  console.log();
  
  // ===== 示例 5：数字处理链 =====
  console.log('🔢 示例 5：数字处理链');
  
  const double = createNumberProcessor(n => n * 2);
  const addTen = createNumberProcessor(n => n + 10);
  const toSquare = createNumberProcessor(n => n * n);
  
  const mathPipeline = double.pipe(addTen).pipe(toSquare);
  
  const mathResult = await mathPipeline.invoke(5);
  console.log('数学运算: 5 → *2 → +10 → ^2');
  console.log(`结果: ${mathResult}`); // (5*2+10)^2 = 400
  console.log();
  
  // ===== 示例 6：配置系统 =====
  console.log('⚙️  示例 6：配置系统');
  
  const slowProcessor = RunnableLambda.from(async (text: string) => {
    // 模拟慢速处理
    await new Promise(resolve => setTimeout(resolve, 100));
    return `慢速处理: ${text}`;
  });
  
  try {
    console.log('使用超时配置 (50ms)...');
    await slowProcessor.invoke('test', { timeout: 50 });
  } catch (error: any) {
    console.log(`❌ 预期的超时错误: ${error.message}`);
  }
  
  console.log('使用足够的超时 (200ms)...');
  const slowResult = await slowProcessor.invoke('test', { timeout: 200 });
  console.log(`✅ 成功: ${slowResult}`);
  console.log();
  
  // ===== 示例 7：类型安全演示 =====
  console.log('🛡️  示例 7：类型安全');
  
  // TypeScript 会确保类型匹配
  const stringToNumber = RunnableLambda.from((text: string) => text.length);
  const numberToString = RunnableLambda.from((num: number) => `长度是: ${num}`);
  
  // 类型安全的组合: string → number → string
  const typeSafeChain = stringToNumber.pipe(numberToString);
  
  const typeResult = await typeSafeChain.invoke('TypeScript is awesome!');
  console.log(`输入: "TypeScript is awesome!"`);
  console.log(`输出: "${typeResult}"`);
  console.log();
  
  console.log('🎉 第一天学习完成！');
  console.log('\n📋 总结:');
  console.log('✅ 理解了 Runnable 接口的三个核心方法');
  console.log('✅ 掌握了 pipe 方法的链式组合');
  console.log('✅ 学会了批量处理和流式处理');
  console.log('✅ 了解了配置系统的使用');
  console.log('✅ 体验了 TypeScript 的类型安全');
}

// 运行示例
main().catch(console.error); 