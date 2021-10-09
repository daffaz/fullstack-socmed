import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async function () {
    const orm = await MikroORM.init({
        dbName: 'node_socmed',
        entities: [],
        user: 'root',
        password: '',
        type: 'mysql',
        debug: !__prod__,
    })
}

main()
