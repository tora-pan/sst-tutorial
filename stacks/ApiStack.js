import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    },
    routes: {
      "POST /notes": "functions/create.main", // create a note
      "GET /notes/{id}": "functions/get.main", // get a specific note
      "GET /notes": "functions/list.main", // list all of a specific users notes
      "PUT /notes/{id}": "functions/update.main", // update an existing note
      "DELETE /notes/{id}": "functions/delete.main", // delete an existing note
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the Api Resource
  return {
    api,
  };
}
