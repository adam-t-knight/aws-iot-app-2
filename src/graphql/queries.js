/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRPiTemperature = /* GraphQL */ `
  query GetRPiTemperature($id: ID!) {
    getRPiTemperature(id: $id) {
      id
      provider
      topic
      temperature
      createdOn
      updatedOn
    }
  }
`;
export const listRPiTemperatures = /* GraphQL */ `
  query ListRPiTemperatures(
    $filter: ModelRPiTemperatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRPiTemperatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        provider
        topic
        temperature
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
