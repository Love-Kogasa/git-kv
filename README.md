# Git-KV
一次使用GithubRepo作为数据库的尝试。  
如果您不想承担小项目的数据库需求带来的费用，您可以尝试使用Git-KV然后使用Git仓库作为数据库  
**本项目仅建议用于对数据读写频率较少的公益或者开发项目**  
**Git-KV不是一个像Sqlite，redis一类的真正的数据库，仅作为一个可以存储数据的平替**  
本项目支持前端运行，只需要加载[buffer](https://www.npmjs.com/package/buffer)库来在浏览器模拟Buffer  

## Api
(不想写详细的教程，有人真的需要再说吧)  
- FS: class RepoFS
  - constructor({ ?token, repo })
  - 高级方法
  - async read( path ) *返回Buffer*
  - async get( path ) *返回字符串*
  - async write( path, data, ?msg )
  - async put( path, data )
  - async append( path, data, ?msg )
  - async exists( path )
  - async remove( path, ?msg )
  - async dir( path ) *返回文件名数组(不含/)*
  - 基础方法
  - async readdir( path ) *不经检查直接请求api，返回的是api返回的内容*
  - async check( path ) *与上者类似*
  - async upload( path, data, sha, msg )
  - getRawURL( path ) *获取文件读取的目标地址，本地测试不方便可以让这个返回github的镜像站*
  - getAPIURL( path ) *获取目标api地址*

- KV: class RepoKV
  - constructor({ fs, path })
  - static async load({ fs, path }) *返回一个已初始化好的RepoKV对象*
  - async init() *初始化*
  - get( key )
  - set( key, value )
  - has( key )
  - remove( key )
  - delete( key ) *remove别名*
  - search( info *搜索内容，可以是字符串正则以及函数*, ?test *搜索范围，默认为key搜索索引，value为内容* ) *返回内容为二级数组，可以用来创建一个map*
  - async save() *尝试合并修改并提交*
  - fs *RepoFS对象*