import { FusionAuthClient } from "@fusionauth/typescript-client";
import JSONStream from "JSONStream";
import ksuid from "ksuid";
import fs from "fs";
export const uuid = () => {
  return ksuid.randomSync().string;
};
let applicationId = "a3c87de8-92fe-4739-8d4e-0bcf75ea03bf";
let importUsers = [];
let fusionAuthUser;
var stream = fs.createReadStream("datasource/users.json", {
  flags: "r",
  encoding: "utf-8",
});
var client = new FusionAuthClient(
  "api_key",
  "https://auth.dev.axis.lotterydev.com"
);
stream.pipe(JSONStream.parse("*")).on("data", (d) => {
  //console.log(d["email"]);
  //console.log(d["phoneVerified"]);
  // console.log(d["emailVerified"]);
  console.log(d["_id"]["$oid"]);
  fusionAuthUser = {
    userId: d["_id"]["$oid"],
    email: d["email"],
    password: uuid(),
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
client
  .importUsers({ users: importUsers })
  .then((clientResponse) => {
    console.log("Completed");
  })
  .catch(console.error);
