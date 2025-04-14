import { createClient,commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const subscriber=createClient()
subscriber.connect()

const publisher=createClient()
publisher.connect()

async function  main() {
    while(1){
        const response=await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        console.log(response)
        if(response===null) return
        
        await downloadS3Folder(`output/${response.element}`)
        console.log("downloaded")
        await buildProject(response.element as string)
        copyFinalDist(response.element as string)

        //insert status in hashset of redis
        publisher.hSet("status",response.element,"deployed")
    }
}
main()