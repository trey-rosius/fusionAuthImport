import FusionAuthClient from "@fusionauth/typescript-client";

import JSONStream from "JSONStream";

var fs = require("fs");

let applicationId: string;
let importUsers: Object[] = [];
let fusionAuthUser: {};
var stream = fs.createReadStream("datasource/users.json", {
  flags: "r",
  encoding: "utf-8",
});
stream.pipe(JSONStream.parse("*")).on("data", (d: {}) => {
  console.log(d["email"]);
  console.log(d["phoneVerified"]);
  console.log(d["emailVerified"]);
  console.log(d["_id"]["$oid"]);
  fusionAuthUser = {
    id: d["_id"]["$oid"],
    email: d["email"],
    registrations: [
      {
        applicationID: applicationId,
        data: {
          phoneVerified: d["phoneVerified"],
          emailVerified: d["emailVerified"],
        },
      },
    ],
  };
  importUsers.push(fusionAuthUser);
});
var client = new FusionAuthClient(applicationId, "https://local.fusionauth.io");

client.importUsers({ users: importUsers });
