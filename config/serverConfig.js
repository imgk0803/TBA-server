import dotenv from "dotenv"
dotenv.config()

const dburl = process.env.DB_URL
const dbpwd = process.env.DB_PWD
const port = process.env.PORT
const key = process.env.JWT_KEY

    const serverConfig =  {
    port :port,
    url : dburl.replace('<password>',dbpwd),
    key : key
}
export default serverConfig

