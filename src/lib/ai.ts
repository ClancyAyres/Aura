import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const STAR_PROMPT = `
你是一位专业的简历撰写专家，擅长利用 STAR 原则（情境 Situation、任务 Task、行动 Action、结果 Result）重写工作经历。

目标：将用户提供的口语化经历描述，转化为专业、结构化的简历 Bullet Points。

要求：
1. 结构：每个 Point 包含 Action + 技术手段/行动细节 + 可量化结果（如 QPS、延迟、成本、事故率、业务增长等）。
2. 风格：专业、简洁，每条要点 ≤ 1 行；动词开头（如：设计/重构/落地/优化/推进/协作）。
3. 量化：尽可能包含数字（%, x 倍, ms, 人数等）。
4. 技术栈：自然融合提供的技术栈。
5. 长度：输出 2–4 个要点。

输入数据：
公司：{company}
职位：{title}
原始描述：{raw_description}
技术栈：{tech_stack}

请仅输出优化后的 Bullet Points，不要包含额外解释。
`;

export const JD_MATCH_PROMPT = `
你是一位专业的简历筛选官，擅长根据岗位需求（JD）匹配简历关键词。

目标：根据提供的 JD，调整简历经历的侧重点和关键词覆盖度。

要求：
1. 关键词提取：从 JD 中提取核心技术要求、能力项与业务场景。
2. 匹配与重排：对简历中的要点进行微调，使其更契合 JD 的表述，并根据相关度对要点进行重排（高相关在前）。
3. 补全建议：如果简历中有缺失但可从已有经历推断的关键词，请适当融入。
4. 真实性：保持经历真实，禁止凭空捏造。

输入数据：
目标岗位 JD：{jd}
简历内容：{resume_data}

请输出优化后的简历 JSON 数据（遵循原有 Schema）。
`;

export async function optimizeExperience(company: string, title: string, raw_description: string[], tech_stack: string[]) {
  const prompt = STAR_PROMPT
    .replace("{company}", company)
    .replace("{title}", title)
    .replace("{raw_description}", raw_description.join("\n"))
    .replace("{tech_stack}", tech_stack.join(", "));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // Default model for Phase 1
    messages: [
      { role: "system", content: "You are a professional resume writer." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) return [];
  
  return content.split("\n").filter(l => l.trim().length > 0).map(l => l.replace(/^[•\-\*]\s*/, ""));
}
