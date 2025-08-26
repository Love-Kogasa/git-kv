class RepoKV {
  commit = new Map()
  removeCommit = []
  constructor( option ) {
    this.fs = option.fs
    this.path = option.path
  }
  async save( msg = "Upload data" ) {
    await this.init()
    for( let [key, value] of this.commit ) {
      this.cache.set( key, value )
    }
    for( let key of this.removeCommit ) {
      this.cache.delete( key )
    }
    this.removeCommit = []
    this.commit = new Map()
    return await this.fs.write( this.path, JSON.stringify(Array.from(this.cache)), msg )
  }
  async init() {
    this.cache = new Map(JSON.parse(await this.fs.get( this.path )))
    return this
  }
  set( key, value ) {
    this.cache.set( key )
    this.commit.set( key, value )
    return this
  }
  get( key ) {
    return this.cache.get( key )
  }
  has( key ) {
    return this.cache.has( key )
  }
  add( key, value ) {
    return this.set( key, this.get( key ) + value )
  }
  remove( key ) {
    this.removeCommit.push( key )
    this.cache.delete(key)
    return this
  }
  delete( key ) {
    return this.remove( key )
  }
  search( want, test = "key" ) {
    var result = []
    for( let [key, value] of this.cache ) {
      let testfor = test === "key" ? key : value
      if( typeof want == "string" && testfor.includes( want ) ) {
        result.push([ key, value ])
      } else if( typeof want.test == "function" && testfor.test( key ) ) {
        result.push([ key, value ])
      } else if( typeof want === "function" && want( key, value ) ) {
        result.push([ key, value ])
      } else {
        throw new TypeError( "搜索错误，不支持的类型" )
      }
    }
    return result
  }
  static async load( option ) {
    var db = new RepoKV(option)
    return await db.init()
  }
}

if( typeof module === "object" )
  module.exports = RepoKV