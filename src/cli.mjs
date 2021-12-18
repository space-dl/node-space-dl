#!/usr/bin/env node

//
//  space-dl craeted by tsubasa652
//  ©︎2021 tsubasa652 All Rights Reserved
//

import {cac} from "cac"
import space_dl from "./index.mjs"
const cli = cac()

async function download(url, options){
    try{
        if(!url){
            console.log("URL or ID is not set")
            console.log("space-dl --help")
            return 1
        }
        let spacedl = new space_dl()
        let opt = {}
        if(options.i && options.u){
            throw new Error("不正な引数")
        }
        if(!options.i && !options.u) options.i = true
        if(options.u){
            url = await spacedl.getSpaceID(url)
        }
        if(options.o){
            opt.output = options.o
        }
        spacedl.download(url, options.s, opt)

    }catch(e){
        console.log(e.message)
        return 1
    }
}

cli.command('[url]', 'record Twitter Space')
    .option('-i', 'record with Twitter SpaceID or URL')
    .option("-u, --user", 'record with Twitter screen name or Twitter account URL')
    .option("-s", "save subtitle")
    .option("-o <output>", "output file format and path setting")
    .action(download)

cli.command("download <url>", 'download with Twitter SpaceID or URL')
    .option('-i', 'record with Twitter SpaceID or URL')
    .option("-u, --user", 'record with Twitter screen name or Twitter account URL')
    .option("-s", "save subtitle")
    .option("-o <output>", "output file format and path setting")
    .action(download)

cli.command("token <token>", "set Twitter API v2 Token")
    .action((token)=>{
        if(!token){
            console.log("URL or ID is not set")
            console.log("space-dl --help")
            return 1
        }
        space_dl.setToken(token)
    })

cli.help()
cli.parse()