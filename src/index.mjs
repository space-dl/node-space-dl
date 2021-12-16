//
//  space-dl craeted by tsubasa652
//  ©︎2021 tsubasa652 All Rights Reserved
//

import Twitter from "twitterspace"
import fetch from "node-fetch"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import WebSocket from "ws"
import { EventEmitter } from "events"
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]
const defaultConfigPath = path.join(homeDir, ".space-dl")

async function get(url, method = "GET"){
    let res = await fetch(url, {
        method,
        headers: {
            Authorization:`Bearer ${config.token}`
        }
    })
    if(!res.ok) throw new Error("Server returned Error response")
    res = await res.json()
    return res
}

export default class space_dl extends EventEmitter{
    
    #config
    #twitter
    constructor(configPath = defaultConfigPath, config = undefined){
        super()
        if(!config){
            if(fs.existsSync(configPath)){
                config = JSON.parse(fs.readFileSync(configPath))
            }else{
                config = {
                    "token": ""
                }
                fs.writeFileSync(configPath, JSON.stringify(config))
            }
        }
        this.#config = config
        this.#twitter = new Twitter()
    }

    async #get(url, method = "GET"){
        let res = await fetch(url, {
            method,
            headers: {
                Authorization:`Bearer ${this.#config.token}`
            }
        })
        if(!res.ok) throw new Error("Server returned Error response")
        res = await res.json()
        return res
    }

    async download(id, chatRecord = false){
        id = id.split("?")[0]
        id = id.replace(/^https?:\/\/(www\.)?twitter\.com\/i\/spaces\/|\/peek$/g, "")
    
        let spaceInfo = await this.#twitter.getSpaceInfo(id)
        let {metadata} = spaceInfo.audioSpace
        let {title} = metadata
        console.log(`title: ${metadata.title}`)
        let streamInfo = await this.#twitter.getSpaceStreamInfo(null, metadata)
        let chatInfo = await this.#twitter.accessChatPublic(streamInfo.chatToken)
        let msgs = []

        ffmpeg(streamInfo.source.location)
            .on("start", ()=>{
                this.emit("start")
                console.log(`Recording of ${title} has started`)
            })
            .on("error", (err)=>{
                this.emit("error")
                throw new Error('Cannot record: ' + err.message)
            })
            .on("end", ()=>{
                console.log("finished recording")
                this.emit("end")
                if(chatRecord) fs.writeFileSync(`${id}.json`, JSON.stringify(msgs))
            })
            .save(`${id}.mp3`)
        if(chatRecord){
            if(metadata.is_space_available_for_replay){
                let cursor = "", end=false
                console.log("字幕ファイルのダウンロードを開始しました。")
                while(!end){
                    let history = await this.#twitter.getChatHistory(chatInfo.access_token, cursor)
                    cursor = history.cursor
                    if(cursor == "") end = true
                    for(let msg of history.messages){
                        if(msg.kind == 1){
                            msg = JSON.parse(msg.payload)
                            msg.body = JSON.parse(msg.body)
                            if(msg.body.final){
                                let tmp = {
                                    body: msg.body.body,
                                    timestamp: msg.timestamp,
                                    sender: msg.sender
                                }
                                msgs.push(tmp)
                            }
                        }
                    }
                    fs.writeFileSync(`${id}.json`, JSON.stringify(msgs))
                }
                console.log("字幕ファイルのダウンロードが完了しました。")

            }else{
                let socket = new WebSocket("wss://prod-chatman-ancillary-ap-northeast-1.pscp.tv/chatapi/v1/chatnow")
                socket.onopen =function(){
                    socket.send(JSON.stringify({
                        kind:3,
                        payload: JSON.stringify({
                            access_token: chatInfo.access_token
                        })
                    }))
                    socket.send(JSON.stringify({
                        kind: 2,
                        payload: JSON.stringify({
                            body:JSON.stringify({
                                room: id
                            }),
                            kind: 1
                        })
                    }))
                }
                socket.on("message", (msg)=>{
                    msg = JSON.parse(msg.toString())
                    if(msg.kind == 1){
                        msg = JSON.parse(msg.payload)
                        msg.body = JSON.parse(msg.body)
                        if(msg.body.final){
                            let tmp = {
                                body: msg.body.body,
                                timestamp: msg.timestamp,
                                sender: msg.sender
                            }
                            msgs.push(tmp)
                            fs.writeFileSync(`${id}.json`, JSON.stringify(msgs))
                        }
                    }
                })
                socket.on("close", ()=>{
                    fs.writeFileSync(`${id}.json`, JSON.stringify(msgs))
                })
            }
        }
    }

    async getSpaceID(screenName){
        if(!this.#config.token){
            throw new Error(`スクリーンネームからSpaceを取得するにはTwitter API v2のトークンを設定してください。\nspace-dl token <token>`)
        }
        screenName = screenName.replace(/^https?:\/\/(www\.)?twitter\.com\//g, "")
        screenName = screenName.split("/")[0]
        let {rest_id} = await this.#twitter.getUserByScreenName(screenName)

        try{
            let res = await this.#get(`https://api.twitter.com/2/spaces/by/creator_ids?user_ids=${rest_id}`)
            if(!res.meta.result_count){
                throw new Error("このユーザーは現在スペースを行なっていません")
            }else if(res.data[0].state != "live"){
                throw new Error("このユーザーは現在スペースを行なっていません")
            }else{
                return res.data[0].id
            }
        }catch(e){
            throw new Error("スペースのデータを取得できませんでした")
        }

    }

    static setToken(token, configPath = defaultConfigPath){
        let config = {
            token
        }
        fs.writeFileSync(configPath, JSON.stringify(config))
        console.log("Twitter API v2トークンを設定しました。")
        return
    }
}