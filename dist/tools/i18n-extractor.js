import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerI18nExtractorTools(server) {
    server.tool("i18n_extract_strings", "Extract hardcoded user-facing strings from source code for internationalization", {
        source_code: z.string().describe("Source code to extract translatable strings from"),
        language: z.string().optional().describe("Programming language: 'typescript', 'javascript', 'python', 'java'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "extract_i18n_strings",
                        instructions: "Scan the provided source code and identify all hardcoded user-facing strings including UI labels, error messages, button text, placeholder text, tooltips, and notification messages. Exclude technical strings like log messages, API endpoints, and configuration keys. Generate a translation key for each string following a dot-notation convention (e.g., 'common.buttons.submit'). Output a JSON translation file and the modified source code with strings replaced by translation function calls.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("i18n_setup_framework", "Set up an i18n framework configuration for a project", {
        framework: z.string().describe("i18n framework: 'react-i18next', 'vue-i18n', 'next-intl', 'formatjs'"),
        languages: z.array(z.string()).describe("List of supported language codes (e.g., ['en', 'es', 'fr'])"),
        default_language: z.string().optional().describe("Default/fallback language code"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "setup_i18n_framework",
                        instructions: "Generate the complete i18n framework setup for the specified library. Include the configuration file with supported languages, default language, fallback behavior, and namespace settings. Create the directory structure for translation files, generate empty translation JSON files for each language, and provide the initialization code to integrate into the application entry point. Include examples of using the translation function in components.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("i18n_generate_translations", "Generate translations for extracted strings into target languages (Pro)", {
        source_strings: z.string().describe("JSON object of translation keys and source language values"),
        target_languages: z.array(z.string()).describe("Target language codes to translate into"),
        context: z.string().optional().describe("Application context for more accurate translations"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            action: "upgrade_required",
                            instructions: "This tool requires a Pro subscription. Upgrade to Pro to automatically generate translations for your extracted strings into multiple target languages with context-aware accuracy.",
                        }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_translations",
                        instructions: "Translate all provided source strings into each target language. Maintain the same JSON key structure for each language file. Consider the application context for accurate translations, handle pluralization rules for each language, preserve interpolation variables (e.g., {{name}}), and adapt string length for UI constraints. Generate separate JSON translation files for each target language.",
                    }, null, 2),
                },
            ],
        };
    });
}
