// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISkill {
    function skillDetails(address agentAddress) external view returns (string memory, string[] memory);
}

contract AgentCommunication {
    struct Skill {
        string name;
        string version;
        Parameter[] api_parameters;
        int experience_points;
        string usage_description;
        float[] embeddings;
        ResponseFormat[] response_formats;
        Rate rate;
    }

    struct Parameter {
        string param_name;
        string param_type;
        bool required;
        string description;
    }

    struct ResponseFormat {
        string name;
        string type;
        ResponseDetails and;
    }

    struct ResponseDetails {
        string response_schema;
        string[] possible_errors;
    }

    struct Rate {
        float rate_per_use;
    }

    struct Agent {
        string address;
        string chain_id;
        Skill[] supported_skills;
        string public_key;
    }

    mapping(address => Agent) public agents;
    address[] public allAgents;

    event AgentRegistered(address indexed agentAddress, string chain_id);
    event SkillAdded(address indexed agentAddress, string skillName, string version);

    function registerAgent(string memory address_, string memory chain_id_, string memory public_key_) public {
        require(!agentExists(address_), "Agent already registered");
        Agent memory newAgent = Agent({
            address: address_,
            chain_id: chain_id_,
            supported_skills: new Skill[](0),
            public_key: public_key_
        });
        agents[address_] = newAgent;
        allAgents.push(address_);
        emit AgentRegistered(address_, chain_id_);
    }

    function addSkill(address agentAddress, string memory skillName, string memory version, Parameter[] memory parameters, int experience_points, string memory usage_description, float[] memory embeddings, ResponseFormat[] memory formats, Rate memory rate) public {
        require(agentExists(agentAddress), "Agent not registered");
        Skill memory newSkill = Skill({
            name: skillName,
            version: version,
            api_parameters: parameters,
            experience_points: experience_points,
            usage_description: usage_description,
            embeddings: embeddings,
            response_formats: formats,
            rate: rate
        });
        agents[agentAddress].supported_skills.push(newSkill);
        emit SkillAdded(agentAddress, skillName, version);
    }

    function getAgentInfo(address agentAddress) public view returns (string memory, string memory, string[] memory) {
        require(agentExists(agentAddress), "Agent not registered");
        Agent memory info = agents[agentAddress];
        string[] memory skillsList;
        if (info.supported_skills.length > 0) {
            skillsList = new string[](info.supported_skills.length);
            for (uint i = 0; i < info.supported_skills.length; i++) {
                skillsList[i] = string(abi.encodePacked(info.supported_skills[i].name, ":", info.supported_skills[i].version));
            }
        } else {
            skillsList = new string[](0);
        }
        return (info.address, info.chain_id, skillsList);
    }

    function getAllAgents() public view returns (address[] memory) {
        return allAgents;
    }

    function agentExists(address agentAddress) internal view returns (bool) {
        return agents[agentAddress].supported_skills.length > 0;
    }
}

