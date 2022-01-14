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
var client = new FusionAuthClient(applicationId, "auth.dev.axis.lotterydev.com");
stream.pipe(JSONStream.parse("*")).on("data", (d) => {
    //console.log(d["email"]);
    //console.log(d["phoneVerified"]);
    // console.log(d["emailVerified"]);
    // console.log(d["_id"]["$oid"]);
    fusionAuthUser = {
        id: d["_id"]["$oid"],
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
try {
    client.importUsers({ users: importUsers });
}
catch (error) {
    console.log(error);
}
