import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerFormBuilderTools(server) {
    server.tool("form_from_schema", "Generate a form definition from a JSON schema, TypeScript interface, or data model", {
        schema: z.string().describe("JSON schema, TypeScript interface, or data model to generate a form from"),
        framework: z.string().optional().describe("UI framework: 'react', 'vue', 'svelte', 'html'"),
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
                        action: "generate_form_from_schema",
                        instructions: "Parse the provided schema and generate a form definition with appropriate input types for each field. Map string fields to text inputs, booleans to checkboxes, enums to select dropdowns, numbers to number inputs, dates to date pickers, and arrays to dynamic field lists. Include labels derived from field names, placeholder text, and required field indicators. Structure the form with logical field grouping.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("form_add_validation", "Add client-side validation rules to a form based on schema constraints", {
        form_code: z.string().describe("Existing form code to add validation to"),
        schema: z.string().optional().describe("Schema with validation constraints (min, max, pattern, required)"),
        library: z.string().optional().describe("Validation library: 'zod', 'yup', 'joi', 'native'"),
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
                        action: "add_form_validation",
                        instructions: "Analyze the form code and schema constraints to add comprehensive client-side validation. Generate validation rules using the specified library for required fields, string length limits, numeric ranges, email/URL formats, regex patterns, and custom validators. Add inline error messages, field-level validation triggers (onBlur/onChange), and form-level validation on submit. Include accessible error announcements.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("form_generate_component", "Generate a complete, reusable form component with state management and submission (Pro)", {
        schema: z.string().describe("Schema or form definition to generate the component from"),
        framework: z.string().optional().describe("UI framework: 'react', 'vue', 'svelte'"),
        features: z.array(z.string()).optional().describe("Additional features: 'multi-step', 'autosave', 'file-upload', 'conditional-fields'"),
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
                            instructions: "This tool requires a Pro subscription. Upgrade to Pro to generate complete, production-ready form components with state management, validation, accessibility, and advanced features like multi-step forms and autosave.",
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
                        action: "generate_form_component",
                        instructions: "Generate a complete, reusable form component with full state management, validation, error handling, loading states, and form submission logic. Include TypeScript types, accessible markup with proper ARIA attributes, responsive styling, and the requested features (multi-step wizard, autosave to localStorage, file upload with preview, conditional field visibility). Export the component with configurable props for onSubmit, initialValues, and validation mode.",
                    }, null, 2),
                },
            ],
        };
    });
}
