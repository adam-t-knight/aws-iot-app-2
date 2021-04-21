/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRPiTemperature = /* GraphQL */ `
  mutation CreateRPiTemperature(
    $input: CreateRPiTemperatureInput!
    $condition: ModelRPiTemperatureConditionInput
  ) {
    createRPiTemperature(input: $input, condition: $condition) {
      id
      provider
      topic
      temperature
      createdOn
      updatedOn
    }
  }
`;
export const updateRPiTemperature = /* GraphQL */ `
  mutation UpdateRPiTemperature(
    $input: UpdateRPiTemperatureInput!
    $condition: ModelRPiTemperatureConditionInput
  ) {
    updateRPiTemperature(input: $input, condition: $condition) {
      id
      provider
      topic
      temperature
      createdOn
      updatedOn
    }
  }
`;
export const deleteRPiTemperature = /* GraphQL */ `
  mutation DeleteRPiTemperature(
    $input: DeleteRPiTemperatureInput!
    $condition: ModelRPiTemperatureConditionInput
  ) {
    deleteRPiTemperature(input: $input, condition: $condition) {
      id
      provider
      topic
      temperature
      createdOn
      updatedOn
    }
  }
`;
