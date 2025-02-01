# Agent-to-Agent Communication Schema
#
# This schema defines how agents discover each other, exchange capabilities,
# and negotiate interactions. Each agent must advertise its address, chain ID,
# supported skills/tools, their parameters, experience levels, usage descriptions,
# related embeddings, response formats, and rate information.

Agent {
    // Unique identifier for the agent, typically its public key or wallet address.
    string address;

    // Chain ID on which the agent resides, enabling multi-chain compatibility.
    string chain_id;

    // A list of supported skills/tools. Each skill/tool includes its name, version,
    // parameters, experience points or level, usage description, related embeddings,
    // response formats, and rate information.
    Skill[] supported_skills;

    // A public key or other cryptographic identifier used for secure communication.
    string public_key;
}

Skill {
    // Human-readable name of the skill or tool.
    string name;

    // Version identifier for the skill/tool, ensuring compatibility.
    string version;

    // Array of parameters accepted by this skill’s API.
    Parameter[] api_parameters;

    // The experience level or point value associated with this skill.
    int experience_points;

    // Description explaining what the skill does and how to use it.
    string usage_description;

    // An array of embeddings representing the skill in a vector space for RAG-enabled searches.
    float[] embeddings;

    // Array of potential response formats that the skill returns.
    ResponseFormat[] response_formats;

    // Rate information, reserved for future use when skills charge micropayments.
    Rate rate;
}

Parameter {
    // The name of the parameter, used in API requests.
    string param_name;

    // The type of the parameter (e.g., "string", "int", "bool", "float").
    string param_type;

    // Whether this parameter is required or optional.
    bool required;

    // Optional description of what the parameter does.
    string description;
}

ResponseFormat {
    // A name or label identifying the response type.
    string name;

    // The data type of the response (e.g., "string", "json", "array", "binary").
    string type;

    // A detailed object containing response schema and possible errors.
    ResponseDetails and;
}

ResponseDetails {
    // Schema describing the structure of the response.
    string response_schema;

    // List of errors that might be emitted by the skill.
    string[] possible_errors;
}

Rate {
    // Reserved field for rate information.
    float rate_per_use;
}

# Sample Agent Declaration
# This is a conceptual representation of how an agent would define its communication schema.

Agent agent = {
    address: "0x123456789abcdef",
    chain_id: "1",
    public_key: "abc123def456...",
    supported_skills: [
        {
            name: "DataProcessing",
            version: "1.0",
            api_parameters: [
                { param_name: "input_data", param_type: "string", required: true, description: "The data to be processed." },
                { param_name: "processing_mode", param_type: "string", required: false, description: "Optional mode to apply (e.g., 'fast', 'accurate')." }
            ],
            experience_points: 250,
            usage_description: "Processes raw data into structured output.",
            embeddings: [0.12, -0.34, 0.56, ...],
            response_formats: [
                {
                    name: "ProcessedData",
                    type: "json",
                    and: {
                        response_schema: "{\"type\": \"object\", \"properties\": {\"processed_data\": {\"type\": \"array\"}}}",
                        possible_errors: ["InvalidInputData", "ProcessingTimeout"]
                    }
                }
            ],
            rate: {
                rate_per_use: 0.01
            }
        },
        {
            name: "LanguageTranslation",
            version: "2.1",
            api_parameters: [
                { param_name: "source_language", param_type: "string", required: true, description: "The language code of the text to be translated." },
                { param_name: "target_language", param_type: "string", required: true, description: "The language code of the desired translation." },
                { param_name: "text", param_type: "string", required: true, description: "The text to be translated." }
            ],
            experience_points: 1000,
            usage_description: "Translates text from one language to another.",
            embeddings: [-0.45, 0.22, 0.78, ...],
            response_formats: [
                {
                    name: "TranslationResult",
                    type: "string",
                    and: {
                        response_schema: "{\"type\": \"string\"}",
                        possible_errors: ["UnsupportedLanguage", "TextTooLong"]
                    }
                },
                {
                    name: "TranslationMetadata",
                    type: "json",
                    and: {
                        response_schema: "{\"type\": \"object\", \"properties\": {\"confidence\": {\"type\": \"number\"}, \"language\": {\"type\": \"string\"}}}",
                        possible_errors: ["MetadataUnavailable"]
                    }
                }
            ],
            rate: {
                rate_per_use: 0.02
            }
        }
    ]
};