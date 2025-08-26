class RepoFS {
  constructor( option ) {
    this.key = option.key
    this.branch = option.branch || "main"
    if( option.repo && option.repo.split( "/" ).length === 2 ) {
      this.repo = option.repo
    } else {
      throw new TypeError( "option.repo 不正确" )
    }
  }
  async check( path ) {
    return await (await fetch( this.getAPIURL( path ) )).json()
  }
  async upload( path, data, sha, message ) {
    return await (await fetch( this.getAPIURL( path ), {
      method: data !== undefined ? "PUT" : "DELETE",
      headers: {
        "content-type": "application/json",
        "Authorization" : "token " + this.key
      },
      body: JSON.stringify({
        sha, message,
        content: data !== undefined ? Buffer.from(data).toString("base64") : undefined
      })
    } )).json()
  }
  async exists( path ) {
    return !((await this.check(path)).status == "404")
  }
  async read( path ) {
    return Buffer.from(await (await fetch( this.getRawURL( path ) )).arrayBuffer())
  }
  async get( path ) {
    return (await this.read(path)).toString()
  }
  /*async read( path ) {
    return Buffer.from( (await this.check( path )).content, "base64" )
  }
  async get( path ) {
    return (await this.read(path)).toString()
  }*/
  async remove( path, msg = "Delete file by nodejs git-kv" ) {
    return await this.write(path, undefined, msg )
  }
  put( path, data ) {
    return this.write( path, data )
  }
  async append( path, data, msg = "Upload file by nodejs git-kv" ) {
    return await this.write( path, Buffer.concat( await read( path ), Buffer.from(data)), msg )
  }
  async write( path, data, msg = "Upload file by nodejs git-kv" ) {
    var file = await this.check( path )
    if( !file.sha && file.status !== "404") {
      throw new TypeError( path + "不是一个正确的文件" )
    } else {
      if( this.key ) {
        return await this.upload( path, data, file.sha, msg )
      } else {
        throw new TypeError( path + "option.key 错误" )
      }
    }
  }
  async readdir( path = "/" ) {
    var dir = await this.check( path )
    if( Array.isArray( dir ) ) {
      return dir
    } else {
      throw new TypeError( "目录目标不正确，请检查目录是否存在" )
    }
  }
  async dir( path = "/" ) {
    var files = await this.readdir( path )
    var retv = []
    for( let file of files ) {
      retv.push( file.path )
    }
    return retv
  }
  
  getRawURL( path ) {
    return `https://raw.githubusercontent.com/${this.repo}/${this.branch}${path}`
  }
  getAPIURL( path = "/" ) {
    return `https://api.github.com/repos/${this.repo}/contents${path}`
  }
}

if( typeof module === "object" )
  module.exports = RepoFS