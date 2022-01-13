var fs = require("fs");
var JSONStream = require("JSONStream");
let applicationId;
let importUsers = [];
let fusionAuthUser;
var stream = fs.createReadStream("datasource/users.json", {
  flags: "r",
  encoding: "utf-8",
});
stream.pipe(JSONStream.parse("*")).on("data", (d) => {
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
