const http=require('http')
const {read,write}=require('./FS.js')
const server=http.createServer((req,res)=>{
    const options={
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*'
    }
    if(req.method == "GET"&&req.url.split('/')[1]=='books'){
        res.writeHead(200,options)
        res.end(JSON.stringify(read('data.json')))
        return
    }
    if(req.method == "POST") {
        if(req.url.split('/')[1]=='deleteBooks'){
            const allbooks=read('data.json')
            const finded=allbooks.find(e=>e.id==req.url.split('/')[2])
            const findedIndex=allbooks.findIndex(e=>e.id==req.url.split('/')[2])
            if(finded) {
                allbooks.splice(findedIndex,1)
                write('data.json', allbooks)
                return res.end("delete qilindi")
            } 
        }
        if(req.url.split('/')[1]=='add'){
            req.on('data',chunk=>{
                const allbooks=read('data.json')
                const {name,aftor} = JSON.parse(chunk)
                allbooks.push({
                    id:allbooks[allbooks.length-1].id+1||1,
                    name,
                    aftor
                })
                
                write('data.json', allbooks)
            })  
            res.writeHead(200,options)
            return res.end(JSON.stringify([]))
        }
    }
    if(req.method == "POST" && req.url.split('/')[1]=='edit'){
        const allbooks=read('data.json')
        const finded=allbooks.find(e=>e.id==req.url.split('/')[2])
        const findedIndex=allbooks.findIndex(e=>e.id==finded.id)
        if(finded) {
            req.on('data',chunk=>{
                const {name,aftor} = JSON.parse(chunk)
                const newA={
                    "id":finded.id,
                    name,
                    aftor
                }
                allbooks.splice(findedIndex,1,newA)
                write('data.json', allbooks)
                res.end("edit qilindi")
            })
            return 
        }
        return
    }
})
server.listen(9000,console.log(9000))