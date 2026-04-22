export type LocaleKey = "zh" | "en";

const DICT = {
  en: {
    appName: "AI Resume Generator",
    quickStart: "Quick Start",
    openEditor: "Open Editor",
    import: "Import",
    optimize: "Optimize",
    jdMatch: "JD Match",
    export: "Export",
    importDesc: "Import your existing resume in JSON or YAML format.",
    optimizeDesc: "Use AI to optimize your experience based on STAR principles.",
    jdMatchDesc: "Match your resume with a specific job description.",
    exportDesc: "Export your optimized resume to PDF.",
    admin: "Admin",
    coreModules: "Core Modules",
    extensions: "Feature Extensions",
    myResumes: "My Resumes",
    templateGallery: "Template Gallery",
    aiProvider: "AI Service Provider",
    settings: "General Settings",
    aiOptimization: "AI Optimization",
    star: "Star",
  },
  zh: {
    appName: "AI 简历生成器",
    quickStart: "快速开始",
    openEditor: "打开编辑器",
    import: "导入",
    optimize: "优化",
    jdMatch: "JD 匹配",
    export: "导出",
    importDesc: "支持 JSON / YAML 导入现有简历数据。",
    optimizeDesc: "基于 STAR 法则进行润色与重写。",
    jdMatchDesc: "与职位描述匹配并植入关键词。",
    exportDesc: "将优化后的简历导出为 PDF。",
    admin: "管理后台",
    coreModules: "核心业务模块",
    extensions: "功能扩展接口",
    myResumes: "我的简历",
    templateGallery: "模板选择",
    aiProvider: "AI 接口选择",
    settings: "通用设置",
    aiOptimization: "AI 优化中心",
    star: "Star",
  },
} as const;

export type I18nKey = keyof typeof DICT.en;

export function t(locale: LocaleKey, key: I18nKey) {
  return (DICT[locale] as any)[key] ?? (DICT.en as any)[key] ?? key;
}

